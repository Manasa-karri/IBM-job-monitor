import { useState } from "react";
import { MoreHorizontal, ExternalLink, Copy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Job } from "@/types/job";
import { formatCurrency, formatDuration, timeAgo, truncateText, getStatusColor } from "@/lib/utils/format";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface JobsTableProps {
  jobs: Job[];
  onJobSelect: (jobId: string) => void;
}

export function JobsTable({ jobs, onJobSelect }: JobsTableProps) {
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Job;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: keyof Job) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];
    
    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Job ID has been copied to your clipboard.",
    });
  };

  if (jobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
          <CardDescription>No jobs found matching your criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No quantum jobs to display</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs ({jobs.length})</CardTitle>
        <CardDescription>
          Monitor and analyze your quantum computing jobs
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("id")}
                >
                  Job ID
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("backend")}
                >
                  Backend
                </TableHead>
                <TableHead>Program</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  Status
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleSort("created")}
                >
                  Created
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50 transition-colors text-right"
                  onClick={() => handleSort("cost")}
                >
                  Cost
                </TableHead>
                <TableHead className="text-right">Quantum Time</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedJobs.map((job, index) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => onJobSelect(job.id)}
                >
                  <TableCell className="font-mono">
                    <div className="flex items-center gap-2">
                      <span title={job.id}>
                        {truncateText(job.id, 12)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(job.id);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {job.backend}
                    </Badge>
                  </TableCell>
                  <TableCell>{job.program.name || job.program.id}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusColor(job.status) as any}
                      className={`${job.status === "Running" ? "animate-pulse" : ""}`}
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{timeAgo(job.created)}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(job.created).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(job.cost)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatDuration(job.usage.quantum_seconds)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onJobSelect(job.id)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(job.id)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Job ID
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

import { Zap } from "lucide-react";