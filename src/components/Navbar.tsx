
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, BookOpen, Star, Clock, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const NavLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => {
    const isActive = location.pathname === to;
    
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
          isActive 
            ? "bg-dictionary-navy text-white" 
            : "hover:bg-dictionary-blue/50"
        )}
        onClick={closeMenu}
      >
        {icon}
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "py-2 bg-white/80 backdrop-blur-md shadow-sm" : "py-4 bg-transparent"
      )}
    >
      <div className="container max-w-4xl mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-dictionary-navy hover:opacity-80 transition-opacity"
          onClick={closeMenu}
        >
          <BookOpen size={24} />
          <span className="text-xl tracking-tight">Ayokanmi Adejola</span>
        </Link>

        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-dictionary-blue/50 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {isMenuOpen && (
              <div className="fixed inset-0 top-16 bg-white z-40 animate-fade-in">
                <nav className="flex flex-col gap-4 p-6 animate-slide-down">
                  <NavLink to="/" icon={<Search size={20} />} label="Search" />
                  <NavLink to="/favorites" icon={<Star size={20} />} label="Favorites" />
                  <NavLink to="/history" icon={<Clock size={20} />} label="History" />
                </nav>
              </div>
            )}
          </>
        ) : (
          <nav className="flex items-center gap-2">
            <NavLink to="/" icon={<Search size={20} />} label="Search" />
            <NavLink to="/favorites" icon={<Star size={20} />} label="Favorites" />
            <NavLink to="/history" icon={<Clock size={20} />} label="History" />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
