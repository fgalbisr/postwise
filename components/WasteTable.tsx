"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, TrendingDown, DollarSign, Eye } from "lucide-react";

interface WasteData {
  id: string;
  entity: string;
  platform: string;
  spend: number;
  conversions: number;
  roas: number;
  cpl: number;
  wastePercentage: number;
  recommendation: string;
}

export default function WasteTable() {
  const [wasteData, setWasteData] = useState<WasteData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWasteData();
  }, []);

  const fetchWasteData = async () => {
    try {
      const response = await fetch("/api/waste");
      if (response.ok) {
        const data = await response.json();
        setWasteData(data);
      }
    } catch (error) {
      console.error("Error fetching waste data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-card">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (wasteData.length === 0) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-card text-center">
        <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Waste Detected</h3>
        <p className="text-gray-600">All campaigns are performing efficiently</p>
      </div>
    );
  }

  const getWasteColor = (percentage: number) => {
    if (percentage > 50) return "text-danger";
    if (percentage > 25) return "text-yellow-600";
    return "text-success";
  };

  const getWasteBgColor = (percentage: number) => {
    if (percentage > 50) return "bg-danger/10";
    if (percentage > 25) return "bg-yellow-100";
    return "bg-success/10";
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-card">
      <div className="flex items-center space-x-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-danger" />
        <h2 className="text-xl font-bold text-gray-900">Budget Waste Analysis</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spend
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conversions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ROAS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Waste %
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recommendation
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {wasteData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{row.entity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {row.platform}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    {row.spend.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {row.conversions.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm">
                    <TrendingDown className="w-4 h-4 text-gray-400 mr-1" />
                    {row.roas.toFixed(2)}x
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${row.cpl.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getWasteBgColor(
                      row.wastePercentage
                    )} ${getWasteColor(row.wastePercentage)}`}
                  >
                    {row.wastePercentage.toFixed(1)}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {row.recommendation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          <strong>Waste Percentage:</strong> Calculated based on low ROAS, high CPL, or poor conversion rates compared to your goals.
        </p>
      </div>
    </div>
  );
}
