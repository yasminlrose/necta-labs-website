import bottleFocus from "@/assets/bottle-focus.jpeg";
import bottleImmunity from "@/assets/bottle-immunity.jpeg";
import bottleCalm from "@/assets/bottle-calm.jpeg";
import bottleBeauty from "@/assets/bottle-glow.jpeg";

interface PumpBottleProps {
  variant: "focus" | "immunity" | "calm" | "beauty";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const bottleImages = {
  focus: bottleFocus,
  immunity: bottleImmunity,
  calm: bottleCalm,
  beauty: bottleBeauty,
};

const sizeClasses = {
  sm: "h-40",
  md: "h-56",
  lg: "h-72",
};

const PumpBottle = ({ variant, size = "md", className = "" }: PumpBottleProps) => {
  return (
    <div className={`${sizeClasses[size]} w-auto ${className}`.trim()}>
      <img
        src={bottleImages[variant].src}
        alt={`NECTA LABS ${variant} pump bottle`}
        className="h-full w-auto object-contain"
      />
    </div>
  );
};

export default PumpBottle;
