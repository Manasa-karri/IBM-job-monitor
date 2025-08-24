import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";
import { Job } from "@/types/job";
import { formatCurrency } from "@/lib/utils/format";
import { motion } from "framer-motion";

interface KpiCardsProps {
  jobs: Job[];
}

export function KpiCards({ jobs }: KpiCardsProps) {
  const stats = {
    total: jobs.length,
    completed: jobs.filter(job => job.status === "Completed").length,
    running: jobs.filter(job => job.status === "Running").length,
    failed: jobs.filter(job => job.status === "Failed").length,
    avgCost: jobs.length > 0 ? jobs.reduce((sum, job) => sum + job.cost, 0) / jobs.length : 0,
  };

  const kpis = [
    {
      title: "Total Jobs",
      value: stats.total.toLocaleString(),
      icon: Zap,
      color: "primary",
    },
    {
      title: "Completed",
      value: stats.completed.toLocaleString(),
      icon: CheckCircle,
      color: "success",
    },
    {
      title: "Running",
      value: stats.running.toLocaleString(),
      icon: Clock,
      color: "warning",
    },
    {
      title: "Failed",
      value: stats.failed.toLocaleString(),
      icon: XCircle,
      color: "destructive",
    },
    {
      title: "Avg Cost",
      value: formatCurrency(stats.avgCost),
      icon: DollarSign,
      color: "primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {kpi.value}
              </div>
              {kpi.title === "Running" && stats.running > 0 && (
                <Badge variant="outline" className="mt-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-primary mr-1 animate-pulse" />
                  Active
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}