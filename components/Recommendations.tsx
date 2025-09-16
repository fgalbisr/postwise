"use client";

import { useState, useEffect } from "react";
import { Brain, TrendingUp, TrendingDown, Pause, Play, Settings } from "lucide-react";

interface Recommendation {
  id: string;
  level: string;
  entity: string;
  currentSpend: number;
  suggestedSpend: number;
  expectedConversions: number;
  expectedRoas: number;
  rationale: string;
  status: string;
  platform: string;
}

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aggressiveness, setAggressiveness] = useState(50);

  useEffect(() => {
    fetchRecommendations();
  }, [aggressiveness]);

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`/api/recommend?aggressiveness=${aggressiveness}`);
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendationAction = async (recommendationId: string, action: string) => {
    try {
      const response = await fetch("/api/recommendations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recommendationId,
          action,
        }),
      });

      if (response.ok) {
        fetchRecommendations();
      }
    } catch (error) {
      console.error("Error updating recommendation:", error);
    }
  };

  const getActionIcon = (level: string) => {
    switch (level) {
      case "increase":
        return <TrendingUp className="w-4 h-4" />;
      case "decrease":
        return <TrendingDown className="w-4 h-4" />;
      case "pause":
        return <Pause className="w-4 h-4" />;
      case "resume":
        return <Play className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getActionColor = (level: string) => {
    switch (level) {
      case "increase":
        return "text-success bg-success/10";
      case "decrease":
        return "text-yellow-600 bg-yellow-100";
      case "pause":
        return "text-danger bg-danger/10";
      case "resume":
        return "text-primary bg-primary/10";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-white">AI Recommendations</h2>
        </div>
        <button
          onClick={fetchRecommendations}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Aggressiveness Slider */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-800/30 p-6 rounded-2xl shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-4">Recommendation Aggressiveness</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-blue-200 w-20">Conservative</span>
            <input
              type="range"
              min="0"
              max="100"
              value={aggressiveness}
              onChange={(e) => setAggressiveness(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-blue-200 w-20">Aggressive</span>
          </div>
          <p className="text-sm text-blue-200">
            Current level: {aggressiveness}% - {aggressiveness < 30 ? "Conservative" : aggressiveness < 70 ? "Balanced" : "Aggressive"}
          </p>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-card text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Recommendations</h3>
            <p className="text-gray-600">Upload data and set goals to get AI recommendations</p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div key={rec.id} className="bg-white p-6 rounded-2xl shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActionColor(rec.level)}`}>
                    {getActionIcon(rec.level)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{rec.entity}</h3>
                    <p className="text-sm text-gray-600 capitalize">{rec.level} • {rec.platform}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rec.status === "accepted" ? "bg-success/10 text-success" :
                  rec.status === "rejected" ? "bg-danger/10 text-danger" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {rec.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Current Spend</p>
                  <p className="font-semibold text-gray-900">${rec.currentSpend.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Suggested Spend</p>
                  <p className="font-semibold text-gray-900">${rec.suggestedSpend.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected ROAS</p>
                  <p className="font-semibold text-gray-900">{rec.expectedRoas.toFixed(2)}x</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{rec.rationale}</p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleRecommendationAction(rec.id, "accept")}
                  disabled={rec.status === "accepted"}
                  className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRecommendationAction(rec.id, "reject")}
                  disabled={rec.status === "rejected"}
                  className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleRecommendationAction(rec.id, "simulate")}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Simulate
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
