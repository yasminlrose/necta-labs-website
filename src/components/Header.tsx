import { useState } from "react";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import NectaLogo from "@/components/NectaLogo";
import SearchOverlay from "@/components/SearchOverlay";
import AccountModal from "@/components/AccountModal";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const announcements = [
  "Free delivery on orders over £35",
  "Subscribe & save up to 30% on every order",
  "Clinically-dosed ingredients, third-party tested",
  "New: GLOW — skin health from the inside out",
];

const navLinks = [
  { to: "/shop", label: "Shop" },
  { to: "/science", label: "Ingredients" },
  { to: "/about", label: "About" },
  { to: "/stockist", label: "Stockists" },
];

const marqueeText = announcements.join("   ·   ");

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { count, openCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (user) {
      navigate("/account");
    } else {
      setAccountOpen(true);
    }
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground overflow-hidden h-9 flex items-center">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-xs tracking-wide px-4">{marqueeText}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{marqueeText}</span>
          <span className="text-xs tracking-wide px-4" aria-hidden="true">{marqueeText}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{marqueeText}</span>
        </div>
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <nav className="necta-container">
          <div className="flex items-center justify-between h-16 md:h-[68px]">

            {/* Logo */}
            <NectaLogo />

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Pick & Mix button (desktop only) */}
            <Link
              to="/pick-and-mix"
              className="hidden md:inline-flex items-center gap-1.5 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              Pick &amp; Mix
            </Link>

            {/* Icon group (desktop + mobile) */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label="Search"
              >
                <Search className="h-4.5 w-4.5 text-primary" />
              </button>

              {/* Account — navigates to /account if logged in, opens modal if not */}
              <button
                onClick={handleAccountClick}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label={user ? "My account" : "Sign in"}
              >
                <User className="h-4.5 w-4.5 text-primary" />
                {user && (
                  <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label="Open basket"
              >
                <ShoppingBag className="h-4.5 w-4.5 text-primary" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors ml-1"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-5 w-5 text-primary" /> : <Menu className="h-5 w-5 text-primary" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col pt-20 px-8">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-5 right-6 text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="space-y-6">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block text-2xl font-bold text-primary"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-10 space-y-3">
            {user ? (
              <Link
                to="/account"
                onClick={() => setMenuOpen(false)}
                className="block w-full border border-border text-primary font-medium py-3 rounded-md text-sm text-center"
              >
                My Account
              </Link>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); setAccountOpen(true); }}
                className="w-full border border-border text-primary font-medium py-3 rounded-md text-sm"
              >
                Sign in / Register
              </button>
            )}
            <Link
              to="/waitlist"
              onClick={() => setMenuOpen(false)}
              className="block w-full bg-primary text-primary-foreground text-center font-medium py-3 rounded-md text-sm"
            >
              Join Waitlist
            </Link>
          </div>
        </div>
      )}

      {/* Overlays */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AccountModal isOpen={accountOpen} onClose={() => setAccountOpen(false)} />
    </>
  );
};

export default Header;
