import { Shield, Flame } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
}

export default function Logo({ size = "md", showTagline = true }: LogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const iconSize = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Shield className={`${iconSize[size]} text-pm`} />
          <Flame className={`${iconSize[size]} text-bombeiros`} />
        </div>
        <h1 className={`${sizeClasses[size]} font-bold tracking-tight`}>
          <span className="text-pm">BO</span>
          <span className="text-muted-foreground">.</span>
          <span className="text-bombeiros">Militar</span>
        </h1>
      </div>
      {showTagline && (
        <p className="text-sm text-muted-foreground">
          Emergências ao seu alcance
        </p>
      )}
    </div>
  );
}
