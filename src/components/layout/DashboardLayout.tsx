import { Link, useLocation } from "react-router-dom";
import { Recycle, LayoutDashboard, Wallet, Trash2, MapPin, Trophy, Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const citizenMenu = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/cidadao" },
  { icon: Wallet, label: "Carteira", path: "/cidadao/carteira" },
  { icon: Trash2, label: "Descartar", path: "/cidadao/descarte" },
  { icon: MapPin, label: "Parceiros", path: "/parceiros" },
  { icon: Trophy, label: "Ranking", path: "/cidadao/ranking" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName?: string;
}

const DashboardLayout = ({ children, userName }: DashboardLayoutProps) => {
  const location = useLocation();
  const { signOut } = useAuth();
  const displayName = userName || "Usuário";

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
              <p className="text-[9px] font-medium tracking-wider uppercase text-secondary-foreground/40">Dinheiro Ecológico</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {citizenMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
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
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-foreground truncate">{displayName}</p>
              <p className="text-xs text-secondary-foreground/40">Reciclador</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-secondary-foreground/40 hover:text-secondary-foreground mt-2" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-card border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
              <Recycle className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-secondary">Lombongo</span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-card border-t shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {citizenMenu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 md:ml-64 pt-14 md:pt-0 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
