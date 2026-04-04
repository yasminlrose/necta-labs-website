import { Link } from "react-router-dom";

interface NectaLogoProps {
  className?: string;
  light?: boolean;
}

const NectaLogo = ({ className = "", light = false }: NectaLogoProps) => {
  const textColor = light ? "text-primary-foreground" : "text-foreground";

  return (
    <Link to="/" className={`inline-flex flex-col items-start leading-none ${className}`}>
      <span className={`text-lg font-medium tracking-[0.08em] ${textColor}`}>NECTA</span>
      <span
        className={`text-[11px] ${textColor} opacity-70 self-end -mt-0.5 mr-0.5`}
        style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}
      >
        Labs
      </span>
    </Link>
  );
};

export default NectaLogo;
