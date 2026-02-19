import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Recycle, Wallet, Store, ArrowRight, Leaf, Shield, Zap, Trophy, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/hero-image.jpg";

const features = [
  {
    icon: Recycle,
    title: "Descarte Inteligente",
    description: "Registe os seus resíduos recicláveis e converta-os automaticamente em créditos digitais.",
  },
  {
    icon: Wallet,
    title: "Carteira Digital",
    description: "Acumule e utilize os seus créditos ecológicos em supermercados e lojas parceiras.",
  },
  {
    icon: Store,
    title: "Rede de Parceiros",
    description: "Encontre pontos de coleta e comércios que aceitam Lombongo Pay na sua região.",
  },
  {
    icon: Trophy,
    title: "Gamificação",
    description: "Ganhe medalhas, suba no ranking e desbloqueie recompensas por reciclar mais.",
  },
];

const steps = [
  { number: "01", title: "Cadastre-se", description: "Crie a sua conta gratuita em menos de 2 minutos." },
  { number: "02", title: "Descarte", description: "Leve os resíduos recicláveis a um ponto de coleta parceiro." },
  { number: "03", title: "Receba Créditos", description: "Os créditos são calculados automaticamente pelo peso e tipo." },
  { number: "04", title: "Utilize", description: "Pague em lojas parceiras usando QR Code ou transfira o saldo." },
];

const stats = [
  { value: "15K+", label: "Recicladores activos" },
  { value: "200+", label: "Parceiros comerciais" },
  { value: "50 ton", label: "Resíduos reciclados" },
  { value: "99.9%", label: "Uptime da plataforma" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Reciclagem em Angola"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-secondary/80" />

        <div className="container relative z-10 pt-20 pb-16">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6">
                <Leaf className="w-4 h-4" />
                Dinheiro Ecológico
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground leading-[1.1] mb-6"
            >
              Recicle e ganhe{" "}
              <span className="text-gradient">recompensas</span>{" "}
              reais
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-primary-foreground/70 mb-8 max-w-lg leading-relaxed"
            >
              Transforme os seus resíduos recicláveis em créditos digitais. Pague em supermercados e lojas parceiras com a sua carteira Lombongo Pay.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="hero" size="lg" asChild>
                <Link to="/registro">
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/login">Já tenho conta</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-secondary/60 backdrop-blur-md border-t border-primary-foreground/10">
          <div className="container py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-xs md:text-sm text-primary-foreground/60 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Simples e rápido</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-secondary">Como Funciona</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              Em apenas 4 passos simples, comece a transformar resíduos em valor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative bg-card rounded-2xl p-6 shadow-card border group hover:shadow-elevated transition-all"
              >
                <span className="text-5xl font-extrabold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-secondary mt-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.description}</p>
                {idx < 3 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/30 z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 md:py-28 bg-muted/50">
        <div className="container">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Funcionalidades</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-secondary">Tudo numa só plataforma</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto">
              A solução completa para a gestão sustentável de resíduos com recompensas financeiras.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card border group hover:shadow-elevated hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-bold text-secondary">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container">
          <div className="gradient-hero rounded-3xl p-8 md:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary/15 blur-2xl" />

            <div className="relative z-10">
              <div className="flex justify-center gap-6 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
                Junte-se à revolução ecológica
              </h2>
              <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">
                Milhares de angolanos já estão a transformar resíduos em oportunidades. Faça parte desta mudança.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/registro">
                  Criar Conta Grátis
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
