import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Recycle, Menu, X } from "lucide-react";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isLanding = location.pathname === "/";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLanding ? "bg-transparent" : "bg-card/95 backdrop-blur-md border-b shadow-sm"}`}>
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
            <Recycle className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-bold leading-tight ${isLanding ? "text-primary-foreground" : "text-secondary"}`}>
              Lombongo Pay
            </span>
            <span className={`text-[10px] font-medium tracking-wider uppercase ${isLanding ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
              Dinheiro Ecológico
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {isLanding && (
            <>
              <a href="#como-funciona" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Como Funciona
              </a>
              <a href="#funcionalidades" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Funcionalidades
              </a>
              <a href="#parceiros" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Parceiros
              </a>
            </>
          )}
          <div className="flex items-center gap-3">
            <Button variant={isLanding ? "hero-outline" : "outline"} size="sm" asChild>
              <Link to="/login">Entrar</Link>
            </Button>
            <Button variant={isLanding ? "hero" : "default"} size="sm" asChild>
              <Link to="/registro">Criar Conta</Link>
            </Button>
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 rounded-lg ${isLanding ? "text-primary-foreground" : "text-secondary"}`}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-b shadow-elevated animate-fade-in">
          <div className="container py-4 flex flex-col gap-3">
            {isLanding && (
              <>
                <a href="#como-funciona" className="text-sm font-medium text-foreground py-2" onClick={() => setMobileOpen(false)}>Como Funciona</a>
                <a href="#funcionalidades" className="text-sm font-medium text-foreground py-2" onClick={() => setMobileOpen(false)}>Funcionalidades</a>
                <a href="#parceiros" className="text-sm font-medium text-foreground py-2" onClick={() => setMobileOpen(false)}>Parceiros</a>
              </>
            )}
            <div className="flex flex-col gap-2 pt-2 border-t">
              <Button variant="outline" asChild>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Entrar</Link>
              </Button>
              <Button asChild>
                <Link to="/registro" onClick={() => setMobileOpen(false)}>Criar Conta</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
