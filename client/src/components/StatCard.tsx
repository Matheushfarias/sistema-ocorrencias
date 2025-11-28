import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
}

export default function StatCard({ title, value, icon: Icon, iconColor = "text-primary", onClick }: StatCardProps) {
  return (
    <Card 
      className={`p-6 ${onClick ? "cursor-pointer hover-elevate active-elevate-2" : ""}`}
      onClick={onClick}
      data-testid={`stat-card-${title.toLowerCase().replace(/\s/g, "-")}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}
