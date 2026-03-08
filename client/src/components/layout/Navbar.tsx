import { Link, useLocation } from "wouter";
import { BrainCircuit, Library, LayoutDashboard, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/", label: "Home", icon: Library },
    { href: "/notes/new", label: "Study Notes", icon: BookOpen },
    { href: "/concepts", label: "Concept Explainer", icon: Sparkles },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b-0 border-white/5 pb-2 pt-4 px-6 md:px-10 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3 group">
        <div className="bg-gradient-to-tr from-primary to-accent p-2 rounded-xl group-hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-300">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
          Smart Study <span className="text-gradient">Buddy</span>
        </span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-2">
        {links.map((link) => {
          const isActive = location === link.href || (link.href !== "/" && location.startsWith(link.href));
          return (
            <Link key={link.href} href={link.href} className="relative px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm font-medium transition-colors hover:text-white text-muted-foreground z-10 flex items-center gap-2">
              <link.icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
              <span className="hidden md:block">{link.label}</span>
              {isActive && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute inset-0 bg-white/10 rounded-xl -z-10 border border-white/10"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
