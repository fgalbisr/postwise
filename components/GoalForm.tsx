"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Target, Save } from "lucide-react";
import { toast } from "sonner";

const goalSchema = z.object({
  type: z.enum(["cpl", "roas", "budget"]),
  targetCpl: z.number().min(0).optional(),
  targetRoas: z.number().min(0).optional(),
  budgetCap: z.number().min(0).optional(),
});

type GoalFormData = z.infer<typeof goalSchema>;

export default function GoalForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      type: "cpl",
    },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: GoalFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save goal");
      }

      toast.success("Goal saved successfully");
      reset();
    } catch (error) {
      toast.error("Failed to save goal");
      console.error("Error saving goal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-card">
      <div className="flex items-center space-x-2 mb-4">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">Campaign Goals</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal Type
          </label>
          <select
            {...register("type")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="cpl">Cost Per Lead (CPL)</option>
            <option value="roas">Return on Ad Spend (ROAS)</option>
            <option value="budget">Budget Optimization</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-danger">{errors.type.message}</p>
          )}
        </div>

        {selectedType === "cpl" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target CPL ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("targetCpl", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 25.00"
            />
            {errors.targetCpl && (
              <p className="mt-1 text-sm text-danger">{errors.targetCpl.message}</p>
            )}
          </div>
        )}

        {selectedType === "roas" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target ROAS (x)
            </label>
            <input
              type="number"
              step="0.1"
              {...register("targetRoas", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 3.5"
            />
            {errors.targetRoas && (
              <p className="mt-1 text-sm text-danger">{errors.targetRoas.message}</p>
            )}
          </div>
        )}

        {selectedType === "budget" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Cap ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("budgetCap", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 10000.00"
            />
            {errors.budgetCap && (
              <p className="mt-1 text-sm text-danger">{errors.budgetCap.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Saving..." : "Save Goal"}</span>
        </button>
      </form>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Set clear goals to get more accurate recommendations. 
          The AI will optimize your campaigns based on these targets.
        </p>
      </div>
    </div>
  );
}
