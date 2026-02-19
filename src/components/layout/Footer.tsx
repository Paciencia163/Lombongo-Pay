import { Link } from "react-router-dom";
import { Recycle, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                <Recycle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold text-secondary-foreground">Lombongo Pay</span>
                <p className="text-[10px] font-medium tracking-wider uppercase text-secondary-foreground/50">Dinheiro Ecológico</p>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground/70 leading-relaxed">
              Transformando resíduos em recompensas. A plataforma que valoriza o seu compromisso com o meio ambiente.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-secondary-foreground">Plataforma</h4>
            <ul className="space-y-2.5">
              <li><Link to="/registro" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Criar Conta</Link></li>
              <li><Link to="/login" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Entrar</Link></li>
              <li><Link to="/parceiros" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Parceiros</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-secondary-foreground">Recursos</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Como Funciona</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">Tabela de Créditos</a></li>
              <li><a href="#" className="text-sm text-secondary-foreground/60 hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-secondary-foreground">Contacto</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-sm text-secondary-foreground/60">
                <Mail className="w-4 h-4" />
                <span>info@lombongopay.ao</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary-foreground/60">
                <Phone className="w-4 h-4" />
                <span>+244 923 000 000</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-secondary-foreground/60">
                <MapPin className="w-4 h-4" />
                <span>Luanda, Angola</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-secondary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-secondary-foreground/40">
            © 2026 Lombongo Pay. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-secondary-foreground/40 hover:text-primary transition-colors">Privacidade</a>
            <a href="#" className="text-xs text-secondary-foreground/40 hover:text-primary transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
