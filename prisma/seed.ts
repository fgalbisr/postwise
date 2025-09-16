import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample accounts
  const googleAccount = await prisma.account.upsert({
    where: { platform_name: { platform: 'google', name: 'Google Account' } },
    update: {},
    create: {
      platform: 'google',
      name: 'Google Account',
    },
  });

  const metaAccount = await prisma.account.upsert({
    where: { platform_name: { platform: 'meta', name: 'Meta Account' } },
    update: {},
    create: {
      platform: 'meta',
      name: 'Meta Account',
    },
  });

  // Create sample datasets
  const googleDataset = await prisma.dataset.create({
    data: {
      accountId: googleAccount.id,
      source: 'google_ads',
    },
  });

  const metaDataset = await prisma.dataset.create({
    data: {
      accountId: metaAccount.id,
      source: 'meta_ads',
    },
  });

  // Create sample goals
  const cplGoal = await prisma.goal.create({
    data: {
      type: 'cpl',
      targetCpl: 25.0,
    },
  });

  const roasGoal = await prisma.goal.create({
    data: {
      type: 'roas',
      targetRoas: 3.0,
    },
  });

  // Create sample metric rows
  const sampleDates = [
    new Date('2024-01-01'),
    new Date('2024-01-02'),
    new Date('2024-01-03'),
    new Date('2024-01-04'),
    new Date('2024-01-05'),
  ];

  const campaigns = [
    { name: 'Brand Awareness', platform: 'google', roas: 4.2, spend: 1000 },
    { name: 'Lead Generation', platform: 'google', roas: 2.8, spend: 800 },
    { name: 'Retargeting', platform: 'google', roas: 1.5, spend: 600 },
    { name: 'Holiday Campaign', platform: 'meta', roas: 3.5, spend: 1200 },
    { name: 'Lookalike Audience', platform: 'meta', roas: 2.1, spend: 900 },
  ];

  for (const campaign of campaigns) {
    for (const date of sampleDates) {
      const dataset = campaign.platform === 'google' ? googleDataset : metaDataset;
      const baseSpend = campaign.spend / sampleDates.length;
      const baseConversions = Math.floor(baseSpend / (campaign.roas * 50)); // Rough calculation
      const baseClicks = Math.floor(baseConversions * 20); // Rough calculation
      const baseImpressions = Math.floor(baseClicks * 50); // Rough calculation

      await prisma.metricRow.create({
        data: {
          datasetId: dataset.id,
          platform: campaign.platform,
          date,
          campaign: campaign.name,
          adGroup: `${campaign.name} - Ad Group 1`,
          ad: `${campaign.name} - Ad 1`,
          audience: 'All Users',
          device: 'Desktop',
          impressions: baseImpressions + Math.floor(Math.random() * 1000),
          clicks: baseClicks + Math.floor(Math.random() * 50),
          spend: baseSpend + Math.floor(Math.random() * 100),
          conversions: baseConversions + Math.floor(Math.random() * 5),
          convValue: (baseSpend + Math.floor(Math.random() * 100)) * campaign.roas,
          cpc: (baseSpend + Math.floor(Math.random() * 100)) / (baseClicks + Math.floor(Math.random() * 50)),
          cpm: ((baseSpend + Math.floor(Math.random() * 100)) / (baseImpressions + Math.floor(Math.random() * 1000))) * 1000,
          ctr: (baseClicks + Math.floor(Math.random() * 50)) / (baseImpressions + Math.floor(Math.random() * 1000)),
          cvRate: (baseConversions + Math.floor(Math.random() * 5)) / (baseClicks + Math.floor(Math.random() * 50)),
          roas: campaign.roas + (Math.random() - 0.5) * 0.5,
          costPerConv: (baseSpend + Math.floor(Math.random() * 100)) / (baseConversions + Math.floor(Math.random() * 5)),
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
