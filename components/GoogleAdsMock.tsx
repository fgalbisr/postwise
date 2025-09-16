"use client";

import { useState } from "react";
import { Search, CheckCircle, AlertCircle, BarChart3 } from "lucide-react";
import { toast } from "sonner";

export default function GoogleAdsMock() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectMock = async () => {
    setIsConnecting(true);
    try {
      // Simular conexión
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      toast.success("Conexión simulada exitosa con Google Ads");
    } catch (error) {
      toast.error("Error al conectar");
    } finally {
      setIsConnecting(false);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch("/api/google-ads/test");
      if (response.ok) {
        const data = await response.json();
        toast.success(`Conexión exitosa - ${data.campaigns.length} campañas encontradas`);
      } else {
        throw new Error("Error testing connection");
      }
    } catch (error) {
      toast.error("Error al probar la conexión");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-card">
      <div className="flex items-center space-x-2 mb-6">
        <Search className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Google Ads - Modo Demo</h3>
      </div>

      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Google Ads Conectado (Demo)</p>
              <p className="text-sm text-green-700">Sincronización simulada activa</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Campañas Activas</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">5</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">Presupuesto Total</span>
              </div>
              <p className="text-2xl font-bold text-green-900">$5,000</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">ROAS Promedio</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">3.2x</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={testConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Probar Conexión
            </button>
            <button
              onClick={() => setIsConnected(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Desconectar
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Modo Demo - Google Ads</p>
                <p className="mb-2">
                  Estás usando datos de prueba simulados. Para conectar con tu cuenta real de Google Ads:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Solicita acceso al API Center en Google Ads</li>
                  <li>Obtén un Developer Token</li>
                  <li>Configura las credenciales OAuth</li>
                </ol>
              </div>
            </div>
          </div>

          <button
            onClick={connectMock}
            disabled={isConnecting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>{isConnecting ? "Conectando..." : "Activar Modo Demo"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
