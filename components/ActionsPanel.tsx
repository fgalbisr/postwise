"use client";

import { useState, useEffect } from "react";
import { Zap, Play, Pause, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";

interface Action {
  id: string;
  platform: string;
  entityType: string;
  entityId: string;
  actionType: string;
  params: any;
  dryRun: boolean;
  expectedImpact: any;
  applied: boolean;
  appliedAt?: string;
  createdAt: string;
}

export default function ActionsPanel() {
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await fetch("/api/actions");
      if (response.ok) {
        const data = await response.json();
        setActions(data);
      }
    } catch (error) {
      console.error("Error fetching actions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const executeAction = async (actionId: string) => {
    setIsExecuting(true);
    try {
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ actionId }),
      });

      if (response.ok) {
        fetchActions();
      }
    } catch (error) {
      console.error("Error executing action:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  const simulateAction = async (actionId: string) => {
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ actionId }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Simulation Result: ${JSON.stringify(result, null, 2)}`);
      }
    } catch (error) {
      console.error("Error simulating action:", error);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case "increase_budget":
        return <Play className="w-4 h-4" />;
      case "decrease_budget":
        return <Pause className="w-4 h-4" />;
      case "pause":
        return <Pause className="w-4 h-4" />;
      case "resume":
        return <Play className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case "increase_budget":
        return "text-success bg-success/10";
      case "decrease_budget":
        return "text-yellow-600 bg-yellow-100";
      case "pause":
        return "text-danger bg-danger/10";
      case "resume":
        return "text-primary bg-primary/10";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatActionType = (actionType: string) => {
    return actionType.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
          <Zap className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Action Center</h2>
        </div>
        <button
          onClick={fetchActions}
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Action Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {actions.filter(a => !a.applied).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Executed Actions</p>
              <p className="text-2xl font-bold text-gray-900">
                {actions.filter(a => a.applied).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Dry Run Mode</p>
              <p className="text-2xl font-bold text-gray-900">
                {actions.filter(a => a.dryRun).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-4">
        {actions.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-card text-center">
            <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Actions Available</h3>
            <p className="text-gray-600">Accept recommendations to see available actions</p>
          </div>
        ) : (
          actions.map((action) => (
            <div key={action.id} className="bg-white p-6 rounded-2xl shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActionColor(action.actionType)}`}>
                    {getActionIcon(action.actionType)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {formatActionType(action.actionType)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.entityType} • {action.platform}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {action.dryRun && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                      Dry Run
                    </span>
                  )}
                  {action.applied ? (
                    <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                      Applied
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      Pending
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Entity ID</p>
                  <p className="font-mono text-sm text-gray-900">{action.entityId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="text-sm text-gray-900">
                    {new Date(action.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {action.expectedImpact && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">Expected Impact</p>
                  <p className="text-sm text-gray-600">
                    {JSON.stringify(action.expectedImpact, null, 2)}
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                {!action.applied && (
                  <>
                    <button
                      onClick={() => executeAction(action.id)}
                      disabled={isExecuting}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {isExecuting ? "Executing..." : "Execute"}
                    </button>
                    <button
                      onClick={() => simulateAction(action.id)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                    >
                      Simulate
                    </button>
                  </>
                )}
                {action.applied && action.appliedAt && (
                  <span className="text-sm text-gray-600">
                    Applied on {new Date(action.appliedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
