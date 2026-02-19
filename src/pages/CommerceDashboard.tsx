import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, Navigate } from "react-router-dom";
import { Recycle, LayoutDashboard, BarChart3, Settings, LogOut, Building2, Receipt, TrendingUp, DollarSign, ShoppingBag, Clock, Users, Loader2 } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import TransactionItem from "@/components/dashboard/TransactionItem";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const commerceMenu = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/comercio" },
  { icon: Receipt, label: "Transações", path: "/comercio" },
  { icon: BarChart3, label: "Relatórios", path: "/comercio" },
  { icon: Settings, label: "Definições", path: "/comercio" },
];

const CommerceDashboard = () => {
  const location = useLocation();
  const { user, loading: authLoading, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    const [profileRes, txRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle(),
      supabase.from("transactions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(20),
    ]);
    if (profileRes.data) setProfile(profileRes.data);
    if (txRes.data) setTransactions(txRes.data);
    setLoadingData(false);
  };

  if (authLoading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  const totalReceived = transactions.reduce((s, t) => s + Number(t.amount || 0), 0);
  const uniqueClients = new Set(transactions.map(t => t.user_id)).size;
  const avgPerDay = transactions.length > 0 ? Math.round(totalReceived / Math.max(1, new Set(transactions.map(t => new Date(t.created_at).toDateString())).size)) : 0;
  const businessName = profile?.full_name || "Comércio";

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-secondary flex-col fixed h-full z-20">
        <div className="p-5 border-b border-secondary-foreground/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Recycle className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="text-sm font-bold text-secondary-foreground">Lombongo Pay</span>
              <p className="text-[9px] font-medium tracking-wider uppercase text-secondary-foreground/40">Comércio</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {commerceMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-brand"
                    : "text-secondary-foreground/60 hover:text-secondary-foreground hover:bg-secondary-foreground/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-secondary-foreground/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-foreground truncate">{businessName}</p>
              <p className="text-xs text-secondary-foreground/40">Parceiro</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-secondary-foreground/40 hover:text-secondary-foreground mt-2" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />Sair
          </Button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-secondary">Dashboard do Comércio</h1>
            <p className="text-muted-foreground mt-1">{businessName} — {profile?.location || "Angola"}</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={DollarSign} label="Total Recebido" value={`${totalReceived.toLocaleString("pt-AO")} Kz`} />
            <StatCard icon={ShoppingBag} label="Transações" value={String(transactions.length)} />
            <StatCard icon={Users} label="Clientes Únicos" value={String(uniqueClients)} />
            <StatCard icon={TrendingUp} label="Média/Dia" value={`${avgPerDay.toLocaleString("pt-AO")} Kz`} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-5 md:p-6 shadow-card border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-secondary">Pagamentos Recentes</h2>
                </div>
                <div className="space-y-0">
                  {transactions.length > 0 ? transactions.slice(0, 8).map((tx, i) => (
                    <TransactionItem
                      key={tx.id || i}
                      type="debit"
                      description={tx.description || "Pagamento"}
                      amount={Number(tx.amount)}
                      date={new Date(tx.created_at).toLocaleDateString("pt-AO")}
                      category={tx.material_type || "QR Code"}
                    />
                  )) : (
                    <p className="text-sm text-muted-foreground text-center py-8">Nenhum pagamento recebido ainda.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-card rounded-2xl p-5 shadow-card border">
                <h3 className="text-sm font-bold text-secondary mb-4">Resumo</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pagamentos aceitos</span>
                    <span className="text-sm font-bold text-foreground">{transactions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Valor total</span>
                    <span className="text-sm font-bold text-primary">{totalReceived.toLocaleString("pt-AO")} Kz</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Ticket médio</span>
                    <span className="text-sm font-bold text-foreground">{transactions.length > 0 ? Math.round(totalReceived / transactions.length).toLocaleString("pt-AO") : 0} Kz</span>
                  </div>
                </div>
              </div>

              <div className="bg-accent rounded-2xl p-5 border border-primary/10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Aceite pagamentos</p>
                    <p className="text-xs text-muted-foreground mt-1">Use o QR Code para receber créditos Lombongo dos seus clientes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CommerceDashboard;
