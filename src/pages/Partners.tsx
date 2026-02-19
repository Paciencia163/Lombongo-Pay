import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Store, Search, Star, Phone, Loader2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const Partners = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    const { data } = await supabase.from("partners").select("*").eq("is_active", true).order("name");
    if (data) setPartners(data);
    setLoading(false);
  };

  const categories = ["Todos", ...Array.from(new Set(partners.map(p => p.category)))];

  const filtered = partners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.address.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <DashboardLayout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-secondary">Rede de Parceiros</h1>
          <p className="text-muted-foreground mt-1">Encontre pontos de coleta e lojas parceiras perto de si.</p>
        </motion.div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Pesquisar parceiros..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "gradient-primary text-primary-foreground shadow-brand"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Partner list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length > 0 ? filtered.map((partner, i) => (
            <motion.div key={partner.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-5 shadow-card border hover:shadow-elevated transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-accent">
                  <Store className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{partner.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{partner.address}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground capitalize">{partner.category}</span>
                    {partner.responsible && <span className="text-xs text-muted-foreground">• {partner.responsible}</span>}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span className="text-xs font-medium text-primary bg-accent px-2 py-1 rounded-md capitalize">{partner.category}</span>
                {partner.phone && (
                  <a href={`tel:${partner.phone}`} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="w-3 h-3" />
                    Ligar
                  </a>
                )}
              </div>
            </motion.div>
          )) : (
            <div className="col-span-2 text-center py-12">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Nenhum parceiro encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Partners;
