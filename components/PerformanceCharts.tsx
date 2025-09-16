"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Eye, MousePointer, DollarSign, Target, Instagram, Linkedin } from "lucide-react";

interface CampaignData {
  id: string;
  name: string;
  platform: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  roas: number;
  ctr: number;
  cpc: number;
}

export default function PerformanceCharts() {
  const [googleAdsData, setGoogleAdsData] = useState<CampaignData[]>([]);
  const [metaData, setMetaData] = useState<CampaignData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados de Google Ads
      setGoogleAdsData([
        {
          id: "1",
          name: "Search Campaign - Brand",
          platform: "google",
          impressions: 125000,
          clicks: 3200,
          spend: 8500,
          conversions: 180,
          roas: 4.2,
          ctr: 2.56,
          cpc: 2.66
        },
        {
          id: "2", 
          name: "Display Campaign - Retargeting",
          platform: "google",
          impressions: 89000,
          clicks: 1200,
          spend: 3200,
          conversions: 45,
          roas: 2.8,
          ctr: 1.35,
          cpc: 2.67
        },
        {
          id: "3",
          name: "Shopping Campaign - Products",
          platform: "google", 
          impressions: 67000,
          clicks: 2100,
          spend: 4200,
          conversions: 95,
          roas: 3.5,
          ctr: 3.13,
          cpc: 2.00
        }
      ]);

      // Datos simulados de Meta (Instagram + LinkedIn)
      setMetaData([
        {
          id: "4",
          name: "Instagram Stories - Awareness",
          platform: "instagram",
          impressions: 145000,
          clicks: 2800,
          spend: 4200,
          conversions: 120,
          roas: 2.9,
          ctr: 1.93,
          cpc: 1.50
        },
        {
          id: "5",
          name: "Instagram Feed - Conversion",
          platform: "instagram",
          impressions: 98000,
          clicks: 1900,
          spend: 3100,
          conversions: 85,
          roas: 3.2,
          ctr: 1.94,
          cpc: 1.63
        },
        {
          id: "6",
          name: "LinkedIn - B2B Lead Gen",
          platform: "linkedin",
          impressions: 45000,
          clicks: 800,
          spend: 2800,
          conversions: 35,
          roas: 2.1,
          ctr: 1.78,
          cpc: 3.50
        },
        {
          id: "7",
          name: "LinkedIn - Brand Awareness",
          platform: "linkedin",
          impressions: 67000,
          clicks: 950,
          spend: 2100,
          conversions: 25,
          roas: 1.8,
          ctr: 1.42,
          cpc: 2.21
        }
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'google':
        return <BarChart3 className="w-4 h-4 text-blue-400" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4 text-blue-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'google':
        return 'border-blue-500/30 bg-blue-500/10';
      case 'instagram':
        return 'border-pink-500/30 bg-pink-500/10';
      case 'linkedin':
        return 'border-blue-600/30 bg-blue-600/10';
      default:
        return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Google Ads Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-800/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Google Ads Performance</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {googleAdsData.map((campaign) => (
            <div key={campaign.id} className={`p-4 rounded-xl border ${getPlatformColor(campaign.platform)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(campaign.platform)}
                  <span className="font-medium text-white text-sm">{campaign.name}</span>
                </div>
                <span className="text-xs text-blue-200">ROAS: {campaign.roas}x</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-200">Impressions</span>
                  </div>
                  <div className="text-white font-semibold">{formatNumber(campaign.impressions)}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <MousePointer className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-200">Clicks</span>
                  </div>
                  <div className="text-white font-semibold">{formatNumber(campaign.clicks)}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-200">Spend</span>
                  </div>
                  <div className="text-white font-semibold">${formatNumber(campaign.spend)}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-200">Conversions</span>
                  </div>
                  <div className="text-white font-semibold">{campaign.conversions}</div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-blue-500/20">
                <div className="flex justify-between text-xs">
                  <span className="text-blue-200">CTR: {campaign.ctr}%</span>
                  <span className="text-blue-200">CPC: ${campaign.cpc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meta Ads Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-800/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Meta Ads Performance</h3>
          <span className="text-sm text-blue-300">(Instagram & LinkedIn)</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {metaData.map((campaign) => (
            <div key={campaign.id} className={`p-4 rounded-xl border ${getPlatformColor(campaign.platform)}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(campaign.platform)}
                  <span className="font-medium text-white text-sm">{campaign.name}</span>
                </div>
                <span className="text-xs text-blue-200">ROAS: {campaign.roas}x</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-200">Impressions</span>
                  </div>
                  <div className="text-white font-semibold">{formatNumber(campaign.impressions)}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <MousePointer className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-200">Clicks</span>
                  </div>
                  <div className="text-white font-semibold">{formatNumber(campaign.clicks)}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-200">Spend</span>
                  </div>
                  <div className="text-white font-semibold">${formatNumber(campaign.spend)}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-200">Conversions</span>
                  </div>
                  <div className="text-white font-semibold">{campaign.conversions}</div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-blue-500/20">
                <div className="flex justify-between text-xs">
                  <span className="text-blue-200">CTR: {campaign.ctr}%</span>
                  <span className="text-blue-200">CPC: ${campaign.cpc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">
            ${formatNumber(googleAdsData.reduce((sum, c) => sum + c.spend, 0) + metaData.reduce((sum, c) => sum + c.spend, 0))}
          </div>
          <div className="text-sm text-blue-200">Total Spend</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">
            {formatNumber(googleAdsData.reduce((sum, c) => sum + c.conversions, 0) + metaData.reduce((sum, c) => sum + c.conversions, 0))}
          </div>
          <div className="text-sm text-green-200">Total Conversions</div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">
            {((googleAdsData.reduce((sum, c) => sum + c.roas, 0) + metaData.reduce((sum, c) => sum + c.roas, 0)) / (googleAdsData.length + metaData.length)).toFixed(1)}x
          </div>
          <div className="text-sm text-purple-200">Avg ROAS</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-white">
            {formatNumber(googleAdsData.reduce((sum, c) => sum + c.impressions, 0) + metaData.reduce((sum, c) => sum + c.impressions, 0))}
          </div>
          <div className="text-sm text-orange-200">Total Impressions</div>
        </div>
      </div>
    </div>
  );
}
