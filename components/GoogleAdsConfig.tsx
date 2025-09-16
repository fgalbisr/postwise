"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, Save, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const googleAdsConfigSchema = z.object({
  customerId: z.string().min(1, "Customer ID es requerido"),
  developerToken: z.string().min(1, "Developer Token es requerido"),
  clientId: z.string().min(1, "Client ID es requerido"),
  clientSecret: z.string().min(1, "Client Secret es requerido"),
  refreshToken: z.string().min(1, "Refresh Token es requerido"),
});

type GoogleAdsConfigData = z.infer<typeof googleAdsConfigSchema>;

export default function GoogleAdsConfig() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GoogleAdsConfigData>({
    resolver: zodResolver(googleAdsConfigSchema),
  });

  const onSubmit = async (data: GoogleAdsConfigData) => {
    setIsConnecting(true);
    try {
      const response = await fetch("/api/google-ads/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error connecting to Google Ads");
      }

      const result = await response.json();
      setIsConnected(true);
      toast.success("Google Ads conectado exitosamente");
    } catch (error) {
      toast.error("Error al conectar con Google Ads");
      console.error("Error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch("/api/google-ads/test");
      if (response.ok) {
        toast.success("Conexión exitosa con Google Ads");
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
        <h3 className="text-xl font-bold text-gray-900">Configuración de Google Ads</h3>
      </div>

      {isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Google Ads Conectado</p>
              <p className="text-sm text-green-700">Sincronización en tiempo real activa</p>
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
              Reconfigurar
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer ID
              </label>
              <input
                type="text"
                {...register("customerId")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123-456-7890"
              />
              {errors.customerId && (
                <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Developer Token
              </label>
              <input
                type="text"
                {...register("developerToken")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu developer token"
              />
              {errors.developerToken && (
                <p className="mt-1 text-sm text-red-600">{errors.developerToken.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID
              </label>
              <input
                type="text"
                {...register("clientId")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu OAuth Client ID"
              />
              {errors.clientId && (
                <p className="mt-1 text-sm text-red-600">{errors.clientId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Secret
              </label>
              <input
                type="password"
                {...register("clientSecret")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu OAuth Client Secret"
              />
              {errors.clientSecret && (
                <p className="mt-1 text-sm text-red-600">{errors.clientSecret.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refresh Token
            </label>
            <input
              type="text"
              {...register("refreshToken")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tu OAuth Refresh Token"
            />
            {errors.refreshToken && (
              <p className="mt-1 text-sm text-red-600">{errors.refreshToken.message}</p>
            )}
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">¿Cómo obtener estas credenciales?</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Ve a <a href="https://console.cloud.google.com" target="_blank" className="underline">Google Cloud Console</a></li>
                  <li>Habilita Google Ads API</li>
                  <li>Crea credenciales OAuth 2.0 con estas URIs de redirección:
                    <ul className="list-disc list-inside ml-4 mt-1">
                      <li><code>http://localhost:3001</code></li>
                      <li><code>http://localhost:3001/dashboard</code></li>
                    </ul>
                  </li>
                  <li>Obtén tu Customer ID desde Google Ads</li>
                  <li>Solicita un Developer Token en Google Ads</li>
                </ol>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isConnecting ? "Conectando..." : "Conectar Google Ads"}</span>
          </button>
        </form>
      )}
    </div>
  );
}
