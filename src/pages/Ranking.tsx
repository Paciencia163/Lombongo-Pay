import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Leaf, Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface RankEntry {
  user_id: string;
  full_name: string;
  total_kg: number;
}

const Ranking = () => {
  const { user, loading: authLoading } = useAuth();
  const [rankings, setRankings] = useState<RankEntry[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) fetchRanking();
  }, [user]);

  const fetchRanking = async () => {
    // Get all descarte transactions with profiles
    const { data: txData } = await supabase
      .from("transactions")
      .select("user_id, weight_kg")
      .eq("type", "descarte");

    if (txData) {
      // Aggregate by user_id
      const userMap: Record<string, number> = {};
      txData.forEach((t) => {
        userMap[t.user_id] = (userMap[t.user_id] || 0) + Number(t.weight_kg || 0);
      });

      // Fetch profiles for these users
      const userIds = Object.keys(userMap);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds.length > 0 ? userIds : ["none"]);

      const profileMap: Record<string, string> = {};
      profiles?.forEach((p) => { profileMap[p.user_id] = p.full_name || "Usuário"; });

      const sorted = Object.entries(userMap)
        .map(([uid, kg]) => ({ user_id: uid, full_name: profileMap[uid] || "Usuário", total_kg: kg }))
        .sort((a, b) => b.total_kg - a.total_kg);

      setRankings(sorted);
    }
    setLoadingData(false);
  };

  if (authLoading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  const myRank = rankings.findIndex(r => r.user_id === user.id);
  const myEntry = myRank >= 0 ? rankings[myRank] : null;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-secondary">Ranking de Recicladores</h1>
          <p className="text-muted-foreground mt-1">Veja quem mais está a contribuir para um Angola mais limpo.</p>
        </motion.div>

        {/* Your position */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="gradient-hero rounded-2xl p-6 mb-8 text-primary-foreground relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-primary" />
            </div>
            <div>
              <p className="text-sm opacity-70">A sua posição</p>
              <p className="text-3xl font-extrabold">#{myRank >= 0 ? myRank + 1 : "—"}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm opacity-70">Total reciclado</p>
              <p className="text-2xl font-bold">{myEntry ? myEntry.total_kg.toFixed(1) : "0"} kg</p>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <div className="bg-card rounded-2xl shadow-card border overflow-hidden">
          <div className="p-5 border-b">
            <h2 className="text-lg font-bold text-secondary">Top Recicladores</h2>
          </div>
          <div className="divide-y">
            {rankings.length > 0 ? rankings.slice(0, 20).map((entry, i) => {
              const isYou = entry.user_id === user.id;
              const badge = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";
              return (
                <div key={entry.user_id}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors ${isYou ? "bg-accent" : "hover:bg-muted/30"}`}>
                  <span className={`w-8 text-center font-bold text-sm ${i < 3 ? "text-primary" : "text-muted-foreground"}`}>
                    {badge || `#${i + 1}`}
                  </span>
                  <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {entry.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isYou ? "text-primary" : "text-foreground"}`}>
                      {entry.full_name}{isYou ? " (Você)" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-success" />
                    <span className="text-sm font-bold text-foreground">{entry.total_kg.toFixed(1)} kg</span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm text-muted-foreground text-center py-8">Nenhum dado de reciclagem ainda.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Ranking;
