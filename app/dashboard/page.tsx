"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useState } from "react";
import { BarChart3, Brain, Settings, Target, Upload, Zap } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import CsvUploader from "@/components/CsvUploader";
import GoalForm from "@/components/GoalForm";
import KpiCards from "@/components/KpiCards";
import WasteTable from "@/components/WasteTable";
import Recommendations from "@/components/Recommendations";
import ActionsPanel from "@/components/ActionsPanel";
import GoogleAdsMock from "@/components/GoogleAdsMock";
import MetaAdsMock from "@/components/MetaAdsMock";
import PerformanceCharts from "@/components/PerformanceCharts";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [activeTab, setActiveTab] = useState("diagnosis");

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    redirect("/");
  }

  const tabs = [
    { id: "diagnosis", label: "Diagnóstico", icon: Brain, description: "Análisis de rendimiento" },
    { id: "recommendations", label: "Recomendaciones", icon: Target, description: "Optimizaciones IA" },
    { id: "actions", label: "Acciones", icon: Zap, description: "Ejecutar cambios" },
    { id: "settings", label: "Configuración", icon: Settings, description: "Conectar APIs" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-blue-800/30 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/postwise logo.png" 
                  alt="PostWise Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  Postwise
                </span>
                <p className="text-xs text-blue-300">AI-Powered Ad Optimization</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-blue-200">Welcome, {user?.firstName}</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar Navigation */}
        <div className="w-80 bg-slate-900/90 backdrop-blur-sm border-r border-blue-800/30 p-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/postwise logo.png" 
                  alt="PostWise Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-white">Dashboard</h3>
            </div>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start space-x-3 p-4 rounded-xl transition-all duration-200 group ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25"
                      : "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    activeTab === tab.id
                      ? "bg-white/20"
                      : "bg-slate-700/50 group-hover:bg-slate-600/50"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      activeTab === tab.id ? "text-white" : "text-blue-400"
                    }`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className={`font-medium ${
                      activeTab === tab.id ? "text-white" : "text-blue-200"
                    }`}>
                      {tab.label}
                    </div>
                    <div className={`text-sm ${
                      activeTab === tab.id ? "text-blue-100" : "text-slate-400"
                    }`}>
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* AI Status Indicator */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-xl border border-blue-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-400">IA Activa</span>
            </div>
            <p className="text-xs text-blue-200">
              Analizando {activeTab === "diagnosis" ? "datos de campañas" : 
                         activeTab === "recommendations" ? "oportunidades" :
                         activeTab === "actions" ? "acciones pendientes" : "configuraciones"}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Dashboard
              <span className="block text-lg text-blue-300 font-normal">
                Optimiza tus campañas con IA
              </span>
            </h1>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === "diagnosis" && (
                <div className="space-y-8">
                  {/* Performance Charts Section */}
                  <PerformanceCharts />
                  
                  {/* Upload and Goals Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CsvUploader />
                    <GoalForm />
                  </div>
                  
                  {/* KPI Cards and Waste Table */}
                  <KpiCards />
                  <WasteTable />
                </div>
              )}

              {activeTab === "recommendations" && (
                <div className="space-y-8">
                  <Recommendations />
                </div>
              )}

              {activeTab === "actions" && (
                <div className="space-y-8">
                  <ActionsPanel />
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-8">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-800/30 p-8 rounded-2xl shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Configuración</h2>
                    <div className="space-y-6">
                      <GoogleAdsMock />
                      <MetaAdsMock />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}