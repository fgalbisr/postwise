import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Papa from "papaparse";
import { z } from "zod";

const metricRowSchema = z.object({
  date: z.string(),
  campaign: z.string(),
  ad_group: z.string().optional(),
  ad: z.string().optional(),
  audience: z.string().optional(),
  device: z.string().optional(),
  placement: z.string().optional(),
  impressions: z.coerce.number().default(0),
  clicks: z.coerce.number().default(0),
  spend: z.coerce.number().default(0),
  conversions: z.coerce.number().default(0),
  conv_value: z.coerce.number().default(0),
  cpc: z.coerce.number().optional(),
  cpm: z.coerce.number().optional(),
  ctr: z.coerce.number().optional(),
  cv_rate: z.coerce.number().optional(),
  roas: z.coerce.number().optional(),
  cost_per_conv: z.coerce.number().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Parse CSV
    const csvText = await file.text();
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { error: "CSV parsing failed", details: parseResult.errors },
        { status: 400 }
      );
    }

    // Determine platform based on file name or content
    const platform = file.name.toLowerCase().includes("google") ? "google" : "meta";
    const source = platform === "google" ? "google_ads" : "meta_ads";

    // Create or find account
    const account = await prisma.account.upsert({
      where: {
        platform_name: {
          platform,
          name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
        },
      },
      update: {},
      create: {
        platform,
        name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Account`,
      },
    });

    // Create dataset
    const dataset = await prisma.dataset.create({
      data: {
        accountId: account.id,
        source,
      },
    });

    // Process and validate metric rows
    const metricRows = [];
    for (const row of parseResult.data) {
      try {
        const validatedRow = metricRowSchema.parse(row);
        
        // Calculate missing metrics
        const cpc = validatedRow.cpc || (validatedRow.clicks > 0 ? validatedRow.spend / validatedRow.clicks : 0);
        const cpm = validatedRow.cpm || (validatedRow.impressions > 0 ? (validatedRow.spend / validatedRow.impressions) * 1000 : 0);
        const ctr = validatedRow.ctr || (validatedRow.impressions > 0 ? validatedRow.clicks / validatedRow.impressions : 0);
        const cvRate = validatedRow.cv_rate || (validatedRow.clicks > 0 ? validatedRow.conversions / validatedRow.clicks : 0);
        const roas = validatedRow.roas || (validatedRow.spend > 0 ? validatedRow.convValue / validatedRow.spend : 0);
        const costPerConv = validatedRow.cost_per_conv || (validatedRow.conversions > 0 ? validatedRow.spend / validatedRow.conversions : 0);

        metricRows.push({
          datasetId: dataset.id,
          platform,
          date: new Date(validatedRow.date),
          campaign: validatedRow.campaign,
          adGroup: validatedRow.ad_group,
          ad: validatedRow.ad,
          audience: validatedRow.audience,
          device: validatedRow.device,
          placement: validatedRow.placement,
          impressions: validatedRow.impressions,
          clicks: validatedRow.clicks,
          spend: validatedRow.spend,
          conversions: validatedRow.conversions,
          convValue: validatedRow.conv_value,
          cpc,
          cpm,
          ctr,
          cvRate,
          roas,
          costPerConv,
        });
      } catch (error) {
        console.error("Error validating row:", error, row);
        // Skip invalid rows
      }
    }

    // Batch insert metric rows
    if (metricRows.length > 0) {
      await prisma.metricRow.createMany({
        data: metricRows,
      });
    }

    return NextResponse.json({
      success: true,
      datasetId: dataset.id,
      rowsProcessed: metricRows.length,
      platform,
    });
  } catch (error) {
    console.error("Error ingesting data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
