import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "critical";
  icon?: React.ReactNode;
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  variant = "default",
  icon 
}: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return "border-l-4 border-l-success bg-success-light/50";
      case "warning":
        return "border-l-4 border-l-warning bg-warning-light/50";
      case "critical":
        return "border-l-4 border-l-critical bg-critical-light/50";
      default:
        return "border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent";
    }
  };

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", getVariantStyles())}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {icon && <div className="text-primary">{icon}</div>}
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-foreground">{value}</p>
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {trend && trendValue && (
            <div className="text-right">
              <Badge 
                variant="outline" 
                className={cn("gap-1", getTrendColor())}
              >
                {getTrendIcon()}
                {trendValue}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}