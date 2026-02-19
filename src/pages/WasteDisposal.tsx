import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, MapPin, ArrowRight, Check, Info, Loader2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const materials = [
  { id: "plastico", label: "Plástico", emoji: "♻️", rate: 430 },
  { id: "papel", label: "Papel", emoji: "📄", rate: 320 },
  { id: "vidro", label: "Vidro", emoji: "🪟", rate: 450 },
  { id: "metal", label: "Metal", emoji: "🔩", rate: 600 },
];

const collectionPoints = [
  "Ponto Hoji Ya Henda — Maianga",
  "Centro de Reciclagem — Talatona",
  "Eco Ponto — Viana",
  "Ponto Verde — Kilamba",
];

const WasteDisposal = () => {
  const { user, loading: authLoading } = useAuth();
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedPoint, setSelectedPoint] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedCredits, setSavedCredits] = useState(0);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;

  const material = materials.find(m => m.id === selectedMaterial);
  const credits = material && weight ? Math.round(parseFloat(weight) * material.rate) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial || !weight || !selectedPoint) return;

    setSaving(true);
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      type: "descarte",
      amount: credits,
      weight_kg: parseFloat(weight),
      material_type: material?.label || selectedMaterial,
      description: `Descarte de ${material?.label?.toLowerCase()} — ${selectedPoint}`,
    });
    setSaving(false);

    if (error) {
      toast.error("Erro ao registar descarte. Tente novamente.");
      return;
    }

    setSavedCredits(credits);
    setSubmitted(true);
    toast.success("Descarte registado com sucesso!");
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-extrabold text-secondary mb-2">Descarte registado!</h2>
            <p className="text-muted-foreground mb-2">
              {weight}kg de {material?.label?.toLowerCase()} registado com sucesso.
            </p>
            <p className="text-2xl font-bold text-primary mb-6">+{savedCredits.toLocaleString("pt-AO")} Kz</p>
            <Button onClick={() => { setSubmitted(false); setSelectedMaterial(""); setWeight(""); setSelectedPoint(""); }}>
              Novo Descarte
            </Button>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-secondary">Registar Descarte</h1>
          <p className="text-muted-foreground mt-1">Selecione o material, peso e ponto de coleta.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
          {/* Material selection */}
          <div>
            <Label className="text-base font-bold text-secondary mb-3 block">Tipo de Material</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {materials.map((mat) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => setSelectedMaterial(mat.id)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    selectedMaterial === mat.id
                      ? "border-primary bg-accent shadow-brand"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <span className="text-3xl block mb-2">{mat.emoji}</span>
                  <p className="text-sm font-semibold text-foreground">{mat.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{mat.rate} Kz/kg</p>
                </button>
              ))}
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-base font-bold text-secondary">Peso (kg)</Label>
            <div className="relative">
              <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="weight" type="number" step="0.1" min="0.1" placeholder="Ex: 2.5" value={weight} onChange={(e) => setWeight(e.target.value)} className="pl-10" required />
            </div>
          </div>

          {/* Collection point */}
          <div className="space-y-2">
            <Label className="text-base font-bold text-secondary">Ponto de Coleta</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {collectionPoints.map((point) => (
                <button key={point} type="button" onClick={() => setSelectedPoint(point)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    selectedPoint === point ? "border-primary bg-accent" : "border-border hover:border-primary/30"
                  }`}>
                  <MapPin className={`w-4 h-4 shrink-0 ${selectedPoint === point ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium text-foreground">{point}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Credits preview */}
          {credits > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-accent rounded-xl p-5 border border-primary/10">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Estimativa de créditos</p>
                  <p className="text-2xl font-bold text-primary mt-1">+{credits.toLocaleString("pt-AO")} Kz</p>
                  <p className="text-xs text-muted-foreground mt-1">{weight}kg × {material?.rate} Kz/kg</p>
                </div>
              </div>
            </motion.div>
          )}

          <Button type="submit" size="lg" className="w-full md:w-auto" disabled={!selectedMaterial || !weight || !selectedPoint || saving}>
            {saving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            Confirmar Descarte
            {!saving && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default WasteDisposal;
