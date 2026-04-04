import sachetFocus from "@/assets/sachet-focus.png";
import sachetImmunity from "@/assets/sachet-immunity.png";
import sachetCalm from "@/assets/sachet-calm.png";
import sachetBeauty from "@/assets/sachet-beauty.png";

interface SachetProps {
  variant: "focus" | "immunity" | "calm" | "beauty";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sachetImages = {
  focus: sachetFocus,
  immunity: sachetImmunity,
  calm: sachetCalm,
  beauty: sachetBeauty,
};

const sizeClasses = {
  sm: "h-20",
  md: "h-28",
  lg: "h-36",
};

const Sachet = ({ variant, size = "md", className = "" }: SachetProps) => {
  return (
    <img
      src={sachetImages[variant]}
      alt={`NECTA LABS ${variant} sachet`}
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
    />
  );
};

export default Sachet;
