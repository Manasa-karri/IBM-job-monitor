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
  Cell
} from "recharts";
import { Job } from "@/types/job";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ChartsGridProps {
  jobs: Job[];
}

export function ChartsGrid({ jobs }: ChartsGridProps) {
  // Jobs over time data
  const jobsOverTime = jobs.reduce((acc, job) => {
    const date = new Date(job.created).toISOString().split("T")[0];
    const existing = acc.find((item) => item.date === date);
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

  const statusColors = {
    Completed: "hsl(var(--chart-1))",
    Running: "hsl(var(--chart-2))",
    Failed: "hsl(var(--chart-3))",
    Pending: "hsl(var(--chart-4))",
    Queued: "hsl(var(--chart-5))",
  };

  const chartConfig = {
    count: { label: "Jobs", color: "hsl(var(--chart-1))" },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Jobs Over Time */}
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
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })
                  }
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

      {/* Status Distribution */}
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
                  label={({ status, percentage }) =>
                    `${status} (${percentage}%)`
                  }
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        statusColors[
                          entry.status as keyof typeof statusColors
                        ] || "hsl(var(--muted))"
                      }
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


      {/* IBM Composer Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle>IBM Quantum Composer</CardTitle>
            <CardDescription>
              Design and run quantum circuits directly on IBM Quantum.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-[200px]">
            {/* Some placeholder content to match height */}
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Drag & drop circuit builder</li>
              <li>• Real quantum hardware access</li>
              <li>• Integrated error mitigation</li>
            </ul>

            {/* Composer Button */}
            <a
              href="https://quantum-computing.ibm.com/composer"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-input 
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium 
                shadow-md transition-all duration-300
                hover:scale-105 hover:shadow-lg hover:from-pink-500 hover:to-indigo-500"
            >
              Open Composer
              <ExternalLink className="w-4 h-4" />
            </a>
          </CardContent>
        </Card>
      </motion.div>

    </div>
  );
}
