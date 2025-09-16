"use client";

import { useState, useEffect } from "react";
import { DollarSign, MousePointer, Target, TrendingUp, AlertTriangle } from "lucide-react";

interface KpiData {
  totalSpend: number;
  totalClicks: number;
  totalConversions: number;
  averageCpc: number;
  averageCtr: number;
  averageCvr: number;
  averageRoas: number;
  averageCpl: number;
}

export default function KpiCards() {
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchKpiData();
  }, []);

  const fetchKpiData = async () => {
    try {
      const response = await fetch("/api/diagnose");
      if (response.ok) {
        const data = await response.json();
        setKpiData(data);
      }
    } catch (error) {
      console.error("Error fetching KPI data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!kpiData) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-card text-center">
        <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">Upload campaign data to see KPIs</p>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Spend",
      value: `$${kpiData.totalSpend.toLocaleString()}`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Clicks",
      value: kpiData.totalClicks.toLocaleString(),
      icon: MousePointer,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Conversions",
      value: kpiData.totalConversions.toLocaleString(),
      icon: Target,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Avg. CPC",
      value: `$${kpiData.averageCpc.toFixed(2)}`,
      icon: DollarSign,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
    {
      title: "CTR",
      value: `${(kpiData.averageCtr * 100).toFixed(2)}%`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "CVR",
      value: `${(kpiData.averageCvr * 100).toFixed(2)}%`,
      icon: Target,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "ROAS",
      value: `${kpiData.averageRoas.toFixed(2)}x`,
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "CPL",
      value: `$${kpiData.averageCpl.toFixed(2)}`,
      icon: DollarSign,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Campaign Performance</h2>
        <button
          onClick={fetchKpiData}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${kpi.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${kpi.color}`} />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{kpi.title}</h3>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
