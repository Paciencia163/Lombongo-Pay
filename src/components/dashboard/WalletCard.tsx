import { Wallet, Eye, EyeOff, QrCode } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface WalletCardProps {
  balance: number;
  name: string;
}

const WalletCard = ({ balance, name }: WalletCardProps) => {
  const [visible, setVisible] = useState(true);

  return (
    <div className="gradient-hero rounded-2xl p-6 md:p-8 text-primary-foreground relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-primary/15 blur-xl" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium opacity-80">Lombongo Wallet</span>
          </div>
          <button
            onClick={() => setVisible(!visible)}
            className="p-1.5 rounded-lg hover:bg-primary-foreground/10 transition-colors"
          >
            {visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <div className="mb-1">
          <p className="text-xs opacity-60 mb-1">Saldo disponível</p>
          <p className="text-3xl md:text-4xl font-bold tracking-tight">
            {visible ? `${balance.toLocaleString("pt-AO")} Kz` : "••••••"}
          </p>
        </div>

        <p className="text-sm opacity-60 mt-4">{name}</p>

        <div className="flex gap-3 mt-6">
          <Button variant="hero" size="sm" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 border-0 shadow-none">
            <QrCode className="w-4 h-4 mr-1.5" />
            QR Code
          </Button>
          <Button variant="hero" size="sm" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 border-0 shadow-none">
            Transferir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
