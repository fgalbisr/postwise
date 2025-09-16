"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Brain, Target, Upload, CheckCircle, Play, Quote } from "lucide-react";
import { useState, useEffect } from "react";

// Componente para métricas animadas
function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`counter-${end}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [end]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span id={`counter-${end}`} className="font-bold">
      {prefix}{count}{suffix}
    </span>
  );
}

export default function Home() {
  const [language, setLanguage] = useState("es");
  
  const content = {
    es: {
      hero: {
        title: "Optimiza tus campañas publicitarias con IA",
        subtitle: "PostWise analiza tus reportes de Google Ads y Meta Ads, detecta cuellos de botella y te da recomendaciones precisas para aumentar tu ROAS hasta 38%",
        cta: "Empieza gratis",
        ctaSecondary: "Ver demo"
      },
      howItWorks: {
        title: "Cómo funciona PostWise",
        steps: [
          {
            icon: Upload,
            title: "Conecta tus cuentas",
            description: "Conecta directamente con tus cuentas de Google Ads y Meta Ads para análisis en tiempo real"
          },
          {
            icon: Brain,
            title: "IA analiza todo",
            description: "Nuestra IA analiza rendimiento, audiencias, creativos y detecta oportunidades de optimización"
          },
          {
            icon: Target,
            title: "Recibe recomendaciones",
            description: "Obtén recomendaciones de inversión, redistribución de presupuesto, tests A/B y optimización de audiencias"
          }
        ]
      },
      impact: {
        title: "Resultados reales de nuestros clientes",
        metrics: [
          { value: "+38%", label: "ROAS promedio", color: "text-green-400" },
          { value: "-22%", label: "Costo por lead", color: "text-blue-400" },
          { value: "+54%", label: "Conversiones", color: "text-purple-400" },
          { value: "3.2x", label: "ROI promedio", color: "text-cyan-400" }
        ]
      },
      clients: {
        title: "Usan PostWise",
        subtitle: "Empresas que confían en nuestra plataforma",
        logos: [
          { src: "/clientes/2.png", alt: "Cliente 1" },
          { src: "/clientes/7.png", alt: "Cliente 2" },
          { src: "/clientes/10.png", alt: "Cliente 3" },
          { src: "/clientes/AKWA (Logotipo)_edited.avif", alt: "Akwa" }
        ]
      },
      pricing: {
        title: "Elige tu plan",
        subtitle: "Empieza gratis y escala según crezcas",
        plans: [
          {
            name: "Gratis",
            price: "$0",
            period: "/mes",
            description: "Perfecto para empezar",
            features: [
              "1 cuenta de Google Ads",
              "1 cuenta de Meta Ads",
              "Análisis básico de campañas",
              "Recomendaciones limitadas",
              "Soporte por email"
            ],
            cta: "Empezar gratis",
            popular: false,
            color: "border-blue-500"
          },
          {
            name: "Basic",
            price: "$49",
            period: "/mes",
            description: "Para profesionales independientes",
            features: [
              "3 cuentas de Google Ads",
              "3 cuentas de Meta Ads",
              "Análisis mejorado con IA",
              "Recomendaciones avanzadas",
              "Reportes personalizados",
              "Soporte por email y chat",
              "Integración con herramientas"
            ],
            cta: "Probar Basic",
            popular: false,
            color: "border-cyan-500"
          },
          {
            name: "Premium",
            price: "$99",
            period: "/mes",
            description: "Para equipos en crecimiento",
            features: [
              "5 cuentas de Google Ads",
              "5 cuentas de Meta Ads",
              "Análisis avanzado con IA",
              "Recomendaciones ilimitadas",
              "Tests A/B automatizados",
              "Optimización de audiencias",
              "Soporte prioritario"
            ],
            cta: "Probar Premium",
            popular: true,
            color: "border-green-500"
          },
          {
            name: "Enterprise",
            price: "Personalizado",
            period: "",
            description: "Para grandes empresas",
            features: [
              "Cuentas ilimitadas",
              "Análisis personalizado",
              "API completa",
              "Integraciones custom",
              "Manager dedicado",
              "SLA garantizado",
              "Soporte 24/7"
            ],
            cta: "Contactar ventas",
            popular: false,
            color: "border-purple-500"
          }
        ]
      },
      testimonials: {
        title: "Lo que dicen nuestros clientes",
        items: [
          {
            name: "María González",
            company: "E-commerce Fashion",
            role: "Marketing Manager",
            quote: "PostWise nos ayudó a aumentar nuestro ROAS de 2.1x a 3.8x en solo 2 meses. La redistribución de presupuesto fue clave.",
            avatar: "MG",
            improvement: "+81% ROAS"
          },
          {
            name: "Carlos Ruiz",
            company: "SaaS B2B",
            role: "Growth Director", 
            quote: "Redujimos nuestro CPL en 35% y aumentamos las conversiones en 60%. La IA de PostWise es increíble.",
            avatar: "CR",
            improvement: "-35% CPL"
          },
          {
            name: "Ana Martínez",
            company: "Agencia Digital",
            role: "Account Director",
            quote: "Nuestros clientes están viendo resultados consistentes. PostWise se ha vuelto indispensable en nuestra estrategia.",
            avatar: "AM",
            improvement: "+45% conversiones"
          }
        ]
      },
      cta: {
        title: "¿Listo para optimizar tus campañas?",
        subtitle: "Únete a cientos de marketers que ya están aumentando su ROAS con IA",
        button: "Empieza gratis ahora",
        guarantee: "Sin compromiso • Setup en 5 minutos"
      }
    },
    en: {
      hero: {
        title: "Optimize your ad campaigns with AI",
        subtitle: "PostWise analyzes your Google Ads and Meta Ads reports, detects bottlenecks and gives you precise recommendations to increase your ROAS up to 38%",
        cta: "Start free",
        ctaSecondary: "Watch demo"
      },
      howItWorks: {
        title: "How PostWise works",
        steps: [
          {
            icon: Upload,
            title: "Connect your accounts",
            description: "Connect directly with your Google Ads and Meta Ads accounts for real-time analysis"
          },
          {
            icon: Brain,
            title: "AI analyzes everything",
            description: "Our AI analyzes performance, audiences, creatives and detects optimization opportunities"
          },
          {
            icon: Target,
            title: "Get recommendations",
            description: "Receive investment recommendations, budget redistribution, A/B tests and audience optimization"
          }
        ]
      },
      impact: {
        title: "Real results from our clients",
        metrics: [
          { value: "+38%", label: "Average ROAS", color: "text-green-400" },
          { value: "-22%", label: "Cost per lead", color: "text-blue-400" },
          { value: "+54%", label: "Conversions", color: "text-purple-400" },
          { value: "3.2x", label: "Average ROI", color: "text-cyan-400" }
        ]
      },
      clients: {
        title: "Use PostWise",
        subtitle: "Companies that trust our platform",
        logos: [
          { src: "/clientes/2.png", alt: "Client 1" },
          { src: "/clientes/7.png", alt: "Client 2" },
          { src: "/clientes/10.png", alt: "Client 3" },
          { src: "/clientes/AKWA (Logotipo)_edited.avif", alt: "Akwa" }
        ]
      },
      pricing: {
        title: "Choose your plan",
        subtitle: "Start free and scale as you grow",
        plans: [
          {
            name: "Free",
            price: "$0",
            period: "/month",
            description: "Perfect to get started",
            features: [
              "1 Google Ads account",
              "1 Meta Ads account",
              "Basic campaign analysis",
              "Limited recommendations",
              "Email support"
            ],
            cta: "Start free",
            popular: false,
            color: "border-blue-500"
          },
          {
            name: "Basic",
            price: "$49",
            period: "/month",
            description: "For independent professionals",
            features: [
              "3 Google Ads accounts",
              "3 Meta Ads accounts",
              "Enhanced AI analysis",
              "Advanced recommendations",
              "Custom reports",
              "Email and chat support",
              "Tool integrations"
            ],
            cta: "Try Basic",
            popular: false,
            color: "border-cyan-500"
          },
          {
            name: "Premium",
            price: "$99",
            period: "/month",
            description: "For growing teams",
            features: [
              "5 Google Ads accounts",
              "5 Meta Ads accounts",
              "Advanced AI analysis",
              "Unlimited recommendations",
              "Automated A/B tests",
              "Audience optimization",
              "Priority support"
            ],
            cta: "Try Premium",
            popular: true,
            color: "border-green-500"
          },
          {
            name: "Enterprise",
            price: "Custom",
            period: "",
            description: "For large companies",
            features: [
              "Unlimited accounts",
              "Custom analysis",
              "Full API access",
              "Custom integrations",
              "Dedicated manager",
              "Guaranteed SLA",
              "24/7 support"
            ],
            cta: "Contact sales",
            popular: false,
            color: "border-purple-500"
          }
        ]
      },
      testimonials: {
        title: "What our clients say",
        items: [
          {
            name: "Maria Gonzalez",
            company: "Fashion E-commerce",
            role: "Marketing Manager",
            quote: "PostWise helped us increase our ROAS from 2.1x to 3.8x in just 2 months. Budget redistribution was key.",
            avatar: "MG",
            improvement: "+81% ROAS"
          },
          {
            name: "Carlos Ruiz",
            company: "B2B SaaS",
            role: "Growth Director",
            quote: "We reduced our CPL by 35% and increased conversions by 60%. PostWise's AI is incredible.",
            avatar: "CR",
            improvement: "-35% CPL"
          },
          {
            name: "Ana Martinez",
            company: "Digital Agency",
            role: "Account Director",
            quote: "Our clients are seeing consistent results. PostWise has become indispensable in our strategy.",
            avatar: "AM",
            improvement: "+45% conversions"
          }
        ]
      },
      cta: {
        title: "Ready to optimize your campaigns?",
        subtitle: "Join hundreds of marketers already increasing their ROAS with AI",
        button: "Start free now",
        guarantee: "No commitment • Setup in 5 minutes"
      }
    }
  };

  const t = content[language as keyof typeof content];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-blue-800/30 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
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
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Postwise
                </span>
                <p className="text-xs text-blue-300">AI-Powered Ad Optimization</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Language Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setLanguage("es")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    language === "es" 
                      ? "bg-white text-slate-800" 
                      : "text-blue-200 hover:text-white"
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    language === "en" 
                      ? "bg-white text-slate-800" 
                      : "text-blue-200 hover:text-white"
                  }`}
                >
                  EN
                </button>
              </div>
              
              <SignInButton mode="modal">
                <button className="text-blue-200 hover:text-white font-medium transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-r from-white to-gray-100 text-slate-800 px-6 py-2 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 font-medium shadow-lg shadow-white/25">
                  {t.hero.cta}
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center" style={{
        backgroundImage: 'url(/hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-blue-900/40 to-slate-800/40"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 w-full">
          <div className="text-center">
            <h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fadeInUp"
              style={{ animationDelay: '0.2s' }}
            >
              {t.hero.title}
            </h1>
            <p 
              className="text-xl lg:text-2xl text-blue-200 mb-8 max-w-4xl mx-auto leading-relaxed animate-fadeInUp"
              style={{ animationDelay: '0.4s' }}
            >
              {t.hero.subtitle}
            </p>
            
            <div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeInUp"
              style={{ animationDelay: '0.6s' }}
            >
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-r from-white to-gray-100 text-slate-800 px-8 py-4 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-white/25 hover:scale-105 hover:shadow-white/40 group">
                  {t.hero.cta}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </SignUpButton>
              <button className="border border-white/50 text-white px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300 font-semibold text-lg backdrop-blur-sm flex items-center justify-center gap-2 hover:scale-105 group">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                {t.hero.ctaSecondary}
              </button>
            </div>

            {/* Trust Indicators */}
            <div 
              className="flex flex-wrap justify-center items-center gap-8 text-blue-300 text-sm animate-fadeInUp"
              style={{ animationDelay: '0.8s' }}
            >
              <div className="flex items-center gap-2 group">
                <CheckCircle className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:text-white transition-colors duration-300">Setup en 5 minutos</span>
              </div>
              <div className="flex items-center gap-2 group">
                <CheckCircle className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
                <span className="group-hover:text-white transition-colors duration-300">Resultados en 24h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Interactive */}
      <section className="py-20 bg-slate-800/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border border-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 right-1/3 w-24 h-24 border border-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 animate-fadeInUp">
              {t.howItWorks.title}
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Optimiza tus campañas en 3 simples pasos
            </p>
          </div>

          {/* Interactive Steps */}
          <div className="relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="hidden lg:block absolute top-24 left-1/4 w-0.5 h-12 bg-gradient-to-b from-white/20 to-transparent"></div>
            <div className="hidden lg:block absolute top-24 right-1/4 w-0.5 h-12 bg-gradient-to-b from-white/20 to-transparent"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
              {t.howItWorks.steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={index} 
                    className="relative group animate-fadeInUp"
                    style={{ animationDelay: `${0.3 + (index * 0.2)}s` }}
                  >
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-white text-slate-800 rounded-full flex items-center justify-center font-bold text-sm z-10 group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>

                    {/* Interactive Card */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl group-hover:shadow-white/10 transition-all duration-500 group-hover:scale-105 group-hover:border-white/40 relative overflow-hidden">
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Icon Container */}
                      <div className="relative z-10 text-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-r from-white to-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-white/50">
                          <Icon className="w-10 h-10 text-slate-800 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        
                        {/* Animated Dots */}
                        <div className="flex justify-center space-x-1">
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 text-center">
                        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white transition-colors duration-300">
                          {step.title}
                        </h3>
                        <p className="text-blue-200 leading-relaxed group-hover:text-white transition-colors duration-300">
                          {step.description}
                        </p>
                      </div>

                      {/* Progress Indicator */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700 rounded-b-2xl overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-white to-gray-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
                      </div>
                    </div>

                    {/* Arrow for mobile */}
                    {index < t.howItWorks.steps.length - 1 && (
                      <div className="lg:hidden flex justify-center mt-8 mb-8">
                        <div className="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-white/60" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16 animate-fadeInUp" style={{ animationDelay: '1s' }}>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Proceso automatizado y optimizado</span>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="py-20 relative" style={{
        backgroundImage: 'url(/resultados.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-blue-900/70 to-slate-800/70"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {t.impact.title}
            </h2>
            <p className="text-xl text-blue-200">
              Datos reales de clientes que usan PostWise
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {t.impact.metrics.map((metric, index) => (
              <div 
                key={index} 
                className="text-center bg-slate-800/50 backdrop-blur-sm border border-blue-800/30 rounded-2xl p-8 shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-105 group"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                <div className={`text-4xl lg:text-5xl font-bold ${metric.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {metric.value.includes('+') ? (
                    <AnimatedCounter 
                      end={parseInt(metric.value.replace('+', ''))} 
                      prefix="+" 
                      suffix={metric.value.includes('%') ? '%' : ''}
                      duration={2000 + (index * 200)}
                    />
                  ) : metric.value.includes('-') ? (
                    <AnimatedCounter 
                      end={parseInt(metric.value.replace('-', ''))} 
                      prefix="-" 
                      suffix={metric.value.includes('%') ? '%' : ''}
                      duration={2000 + (index * 200)}
                    />
                  ) : metric.value.includes('x') ? (
                    <AnimatedCounter 
                      end={parseFloat(metric.value.replace('x', '')) * 10} 
                      suffix="x"
                      duration={2000 + (index * 200)}
                    />
                  ) : (
                    metric.value
                  )}
                </div>
                <div className="text-blue-200 font-medium group-hover:text-white transition-colors duration-300">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="py-16 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              {t.clients.title}
            </h2>
            <p className="text-lg text-blue-200">
              {t.clients.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
            {t.clients.logos.map((logo, index) => (
              <div 
                key={index} 
                className="group animate-fadeInUp"
                style={{ animationDelay: `${0.1 + (index * 0.1)}s` }}
              >
                <div className="bg-white/10 backdrop-blur-sm border border-blue-800/30 rounded-xl p-6 shadow-lg hover:shadow-green-500/10 transition-all duration-300 group-hover:scale-105 group-hover:border-green-500/50 w-32 h-20 flex items-center justify-center">
                  <img 
                    src={logo.src} 
                    alt={logo.alt}
                    className="max-h-12 max-w-24 object-contain filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-xl text-blue-200">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.pricing.plans.map((plan, index) => (
              <div key={index} className={`relative bg-slate-800/50 backdrop-blur-sm border-2 ${plan.color} rounded-2xl p-8 shadow-2xl hover:shadow-green-500/10 transition-all duration-300 ${
                plan.popular ? 'scale-105 ring-2 ring-green-500/50' : ''
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-blue-200 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-blue-200 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-blue-200 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25'
                    : 'bg-slate-700 text-white hover:bg-slate-600 border border-slate-600'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-blue-200 text-sm">
              ¿Necesitas un plan personalizado? <a href="#" className="text-green-400 hover:text-green-300 font-medium">Contacta con nuestro equipo</a>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {t.testimonials.title}
            </h2>
            <p className="text-xl text-blue-200">
              Casos reales de éxito
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.testimonials.items.map((testimonial, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-blue-800/30 rounded-2xl p-8 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-white to-gray-100 rounded-full flex items-center justify-center text-slate-800 font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-blue-200">{testimonial.role}</div>
                    <div className="text-sm text-blue-300">{testimonial.company}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <Quote className="w-6 h-6 text-white mb-2" />
                  <p className="text-blue-200 italic leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
                
                <div className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-center">
                  <span className="text-white font-semibold text-sm">
                    {testimonial.improvement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-white/10 to-gray-100/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            {t.cta.title}
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            {t.cta.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <SignUpButton mode="modal">
              <button className="bg-gradient-to-r from-white to-gray-100 text-slate-800 px-8 py-4 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-200 font-semibold text-lg shadow-lg shadow-white/25">
                {t.cta.button}
              </button>
            </SignUpButton>
          </div>
          
          <p className="text-sm text-blue-300">
            {t.cta.guarantee}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-blue-800/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                  <img 
                    src="/postwise logo.png" 
                    alt="PostWise Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Postwise
                </span>
              </div>
              <p className="text-blue-200 text-sm leading-relaxed max-w-md">
                Optimiza tus campañas publicitarias con IA. Aumenta tu ROAS, reduce costos y escala tu negocio con datos reales.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Estado del sistema</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-300 text-sm">
              © 2024 PostWise. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85 8.233 8.233 0 01-5.032 1.756 4.106 4.106 0 001.27 5.477A11.65 11.65 0 01.8 18.251a11.65 11.65 0 01-1.27-5.477 4.106 4.106 0 001.27-5.477A11.65 11.65 0 01.8 18.251z" />
                </svg>
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}