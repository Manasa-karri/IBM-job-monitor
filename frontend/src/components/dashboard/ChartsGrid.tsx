import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ResponsiveContainer
} from "recharts";
import { Job } from "@/types/job";
import { formatCurrency } from "@/lib/utils/format";
import { motion } from "framer-motion";

interface ChartsGridProps {
  jobs: Job[];
}

export function ChartsGrid({ jobs }: ChartsGridProps) {
  // Jobs over time data
  const jobsOverTime = jobs.reduce((acc, job) => {
    const date = new Date(job.created).toISOString().split('T')[0];
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    return acc;
  }, [] as { date: string; count: number }[])
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice(-7); // Last 7 days

  // Status distribution data
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
    percentage: Math.round((count / jobs.length) * 100),
  }));

  // Average cost per backend
  const backendCosts = jobs.reduce((acc, job) => {
    if (!acc[job.backend]) {
      acc[job.backend] = { total: 0, count: 0 };
    }
    acc[job.backend].total += job.cost;
    acc[job.backend].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const costData = Object.entries(backendCosts).map(([backend, data]) => ({
    backend,
    avgCost: data.total / data.count,
  }));

  const statusColors = {
    Completed: "hsl(var(--chart-1))",
    Running: "hsl(var(--chart-2))",
    Failed: "hsl(var(--chart-3))",
    Pending: "hsl(var(--chart-4))",
    Queued: "hsl(var(--chart-5))",
  };

  const chartConfig = {
    count: { label: "Jobs", color: "hsl(var(--chart-1))" },
    avgCost: { label: "Avg Cost", color: "hsl(var(--chart-2))" },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Jobs Over Time</CardTitle>
            <CardDescription>Daily job submissions (last 7 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <LineChart data={jobsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Current job status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="count"
                  label={({ status, percentage }) => `${status} (${percentage}%)`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={statusColors[entry.status as keyof typeof statusColors] || "hsl(var(--muted))"}
                    />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`${value} jobs`, name]}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Avg Cost per Backend</CardTitle>
            <CardDescription>Average job cost by quantum backend</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="backend" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [formatCurrency(Number(value)), "Avg Cost"]}
                />
                <Bar 
                  dataKey="avgCost" 
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}