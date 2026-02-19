import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Recycle, Mail, Lock, User, Phone, MapPin, ArrowRight, Building2, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

type UserType = "citizen" | "commerce";

const Register = () => {
  const [userType, setUserType] = useState<UserType>("citizen");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Form fields
  const [fullName, setFullName] = useState("");
  const [biNumber, setBiNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [nif, setNif] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const metadata = {
      full_name: userType === "citizen" ? fullName : businessName,
      user_type: userType === "citizen" ? "cidadao" : "comercio",
      phone,
      location,
      bi_number: userType === "citizen" ? biNumber : "",
      nif: userType === "commerce" ? nif : "",
    };

    const { error } = await signUp(email, password, metadata);
    setLoading(false);

    if (error) {
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
      return;
    }

    toast.success("Conta criada com sucesso!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Recycle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold text-secondary">Lombongo Pay</span>
              <p className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground">Dinheiro Ecológico</p>
            </div>
          </Link>

          <h1 className="text-2xl md:text-3xl font-extrabold text-secondary mb-2">Criar Conta</h1>
          <p className="text-muted-foreground mb-6">Escolha o tipo de conta e preencha os dados.</p>

          {/* User type selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setUserType("citizen")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                userType === "citizen"
                  ? "border-primary bg-accent shadow-brand"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <User className={`w-5 h-5 mb-2 ${userType === "citizen" ? "text-primary" : "text-muted-foreground"}`} />
              <p className="text-sm font-semibold text-foreground">Cidadão</p>
              <p className="text-xs text-muted-foreground mt-0.5">Reciclador</p>
            </button>
            <button
              type="button"
              onClick={() => setUserType("commerce")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                userType === "commerce"
                  ? "border-primary bg-accent shadow-brand"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <Building2 className={`w-5 h-5 mb-2 ${userType === "commerce" ? "text-primary" : "text-muted-foreground"}`} />
              <p className="text-sm font-semibold text-foreground">Comércio</p>
              <p className="text-xs text-muted-foreground mt-0.5">Parceiro</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {userType === "citizen" ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="name" placeholder="João da Silva" className="pl-10" required value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bi">Número do BI</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="bi" placeholder="000000000LA000" className="pl-10" required value={biNumber} onChange={e => setBiNumber(e.target.value)} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="business-name">Nome do Estabelecimento</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="business-name" placeholder="Supermercado Kero" className="pl-10" required value={businessName} onChange={e => setBusinessName(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nif">NIF</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="nif" placeholder="5000000000" className="pl-10" required value={nif} onChange={e => setNif(e.target.value)} />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="phone" type="tel" placeholder="+244 923 000 000" className="pl-10" required value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="location" placeholder="Luanda, Angola" className="pl-10" required value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="reg-email" type="email" placeholder="seu@email.com" className="pl-10" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="reg-password" type="password" placeholder="Mínimo 6 caracteres" className="pl-10" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
              Criar Conta
              {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-primary/15 blur-2xl" />

        <div className="relative z-10 text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-8">
            {userType === "citizen" ? (
              <User className="w-10 h-10 text-primary-foreground" />
            ) : (
              <Building2 className="w-10 h-10 text-primary-foreground" />
            )}
          </div>
          <h2 className="text-3xl font-extrabold text-primary-foreground mb-4">
            {userType === "citizen" ? "Comece a reciclar hoje" : "Torne-se parceiro"}
          </h2>
          <p className="text-primary-foreground/70 leading-relaxed">
            {userType === "citizen"
              ? "Registe-se e comece a acumular créditos ecológicos a cada descarte de resíduos."
              : "Aceite pagamentos com Lombongo Pay e atraia clientes conscientes do meio ambiente."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
