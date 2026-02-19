import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Recycle, Leaf, TrendingUp, Award, Clock, Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import WalletCard from "@/components/dashboard/WalletCard";
import TransactionItem from "@/components/dashboard/TransactionItem";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const achievements = [
  { icon: "🌱", label: "Primeiro Descarte", minKg: 0 },
  { icon: "♻️", label: "10kg Reciclados", minKg: 10 },
  { icon: "🏆", label: "50kg Reciclados", minKg: 50 },
  { icon: "🌍", label: "Eco Guerreiro", minKg: 100 },
];

const CitizenDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    const [profileRes, txRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle(),
      supabase.from("transactions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }).limit(10),
    ]);
    if (profileRes.data) setProfile(profileRes.data);
    if (txRes.data) setTransactions(txRes.data);
    setLoadingData(false);
  };

  if (authLoading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  const totalKg = transactions.reduce((s, t) => s + Number(t.weight_kg || 0), 0);
  const totalCredits = transactions.filter(t => t.type === "descarte").reduce((s, t) => s + Number(t.amount || 0), 0);
  const totalDescartes = transactions.filter(t => t.type === "descarte").length;
  const balance = transactions.reduce((s, t) => t.type === "descarte" ? s + Number(t.amount) : s - Number(t.amount), 0);
  const firstName = profile?.full_name?.split(" ")[0] || "Usuário";

  return (
    <DashboardLayout userName={profile?.full_name || "Usuário"}>
      <div className="p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-secondary">Olá, {firstName}! 👋</h1>
          <p className="text-muted-foreground mt-1">Veja o resumo da sua actividade ecológica.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <WalletCard balance={balance} name={profile?.full_name || "Usuário"} />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Recycle} label="Total Reciclado" value={`${totalKg.toFixed(1)} kg`} />
          <StatCard icon={Leaf} label="Créditos Ganhos" value={`${totalCredits.toLocaleString("pt-AO")} Kz`} />
          <StatCard icon={TrendingUp} label="Descartes" value={String(totalDescartes)} />
          <StatCard icon={Award} label="Conquistas" value={`${achievements.filter(a => totalKg >= a.minKg).length}/${achievements.length}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-5 md:p-6 shadow-card border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-secondary">Actividade Recente</h2>
              </div>
              <div className="space-y-0">
                {transactions.length > 0 ? transactions.map((tx, i) => (
                  <TransactionItem
                    key={tx.id || i}
                    type={tx.type === "descarte" ? "credit" : "debit"}
                    description={tx.description || tx.type}
                    amount={Number(tx.amount)}
                    date={new Date(tx.created_at).toLocaleDateString("pt-AO")}
                    category={tx.material_type || tx.type}
                  />
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhuma transação ainda. Comece a reciclar!</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="bg-card rounded-2xl p-5 md:p-6 shadow-card border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-secondary">Conquistas</h2>
                <Award className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-3">
                {achievements.map((a, i) => {
                  const achieved = totalKg >= a.minKg;
                  return (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${achieved ? "bg-accent" : "bg-muted/50 opacity-60"}`}>
                      <span className="text-2xl">{a.icon}</span>
                      <span className="text-sm font-medium text-foreground">{a.label}</span>
                      {achieved && <span className="ml-auto text-xs font-semibold text-primary">✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-accent rounded-2xl p-5 mt-4 border border-primary/10">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Dica</p>
                  <p className="text-xs text-muted-foreground mt-1">Descarte plásticos e vidros para acumular créditos mais rápido!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CitizenDashboard;
