import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import WalletCard from "@/components/dashboard/WalletCard";
import TransactionItem from "@/components/dashboard/TransactionItem";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type FilterType = "all" | "credit" | "debit";

const WalletPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    const [profileRes, txRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user!.id).maybeSingle(),
      supabase.from("transactions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    ]);
    if (profileRes.data) setProfile(profileRes.data);
    if (txRes.data) setTransactions(txRes.data);
    setLoadingData(false);
  };

  if (authLoading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  const balance = transactions.reduce((s, t) => t.type === "descarte" ? s + Number(t.amount) : s - Number(t.amount), 0);
  const totalCredit = transactions.filter(t => t.type === "descarte").reduce((s, t) => s + Number(t.amount), 0);
  const totalDebit = transactions.filter(t => t.type !== "descarte").reduce((s, t) => s + Number(t.amount), 0);

  const filtered = filter === "all"
    ? transactions
    : filter === "credit"
      ? transactions.filter(t => t.type === "descarte")
      : transactions.filter(t => t.type !== "descarte");

  return (
    <DashboardLayout userName={profile?.full_name}>
      <div className="p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-secondary">Lombongo Wallet</h1>
          <p className="text-muted-foreground mt-1">Gerencie o seu saldo e transações.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <WalletCard balance={balance} name={profile?.full_name || "Usuário"} />
        </motion.div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card rounded-xl p-5 shadow-card border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Recebido</span>
            </div>
            <p className="text-xl font-bold text-success">+{totalCredit.toLocaleString("pt-AO")} Kz</p>
          </div>
          <div className="bg-card rounded-xl p-5 shadow-card border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-destructive" />
              </div>
              <span className="text-sm text-muted-foreground">Gasto</span>
            </div>
            <p className="text-xl font-bold text-destructive">-{totalDebit.toLocaleString("pt-AO")} Kz</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-card rounded-2xl p-5 md:p-6 shadow-card border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-secondary">Histórico</h2>
            <div className="flex bg-muted rounded-lg p-0.5">
              {(["all", "credit", "debit"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    filter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {f === "all" ? "Tudo" : f === "credit" ? "Entradas" : "Saídas"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-0">
            {filtered.length > 0 ? filtered.map((tx, i) => (
              <TransactionItem
                key={tx.id || i}
                type={tx.type === "descarte" ? "credit" : "debit"}
                description={tx.description || tx.type}
                amount={Number(tx.amount)}
                date={new Date(tx.created_at).toLocaleDateString("pt-AO")}
                category={tx.material_type || tx.type}
              />
            )) : (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhuma transação encontrada.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WalletPage;
