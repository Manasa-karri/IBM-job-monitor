import { useState } from "react";
import { X, Copy, ExternalLink, Clock, Zap, Target } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JobDetails } from "@/types/job";
import { formatCurrency, formatDuration, timeAgo, formatDateTime, getStatusColor } from "@/lib/utils/format";
import { BlochSphere } from "@/components/quantum/BlochSphere";
import { processBlochData } from "@/lib/utils/bloch";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface JobDetailsDrawerProps {
  jobId: string | null;
  jobDetails: JobDetails | null;
  isLoading: boolean;
  open: boolean;
  onClose: () => void;
}

export function JobDetailsDrawer({
  jobId,
  jobDetails,
  isLoading,
  open,
  onClose,
}: JobDetailsDrawerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  const renderOverview = () => {
    if (!jobDetails) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={getStatusColor(jobDetails.status) as any}>
                  {jobDetails.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Backend</span>
                <Badge variant="outline" className="font-mono">
                  {jobDetails.backend}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Program</span>
                <span className="font-mono text-sm">
                  {jobDetails.program.name || jobDetails.program.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Cost</span>
                <span className="font-mono font-semibold">
                  {formatCurrency(jobDetails.cost)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Timing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Created</span>
                <span className="text-sm">{timeAgo(jobDetails.created)}</span>
              </div>
              {jobDetails.completed && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="text-sm">{timeAgo(jobDetails.completed)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Quantum Time</span>
                <span className="font-mono text-sm">
                  {formatDuration(jobDetails.usage.quantum_seconds)}
                </span>
              </div>
              {jobDetails.run_time_seconds && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Runtime</span>
                  <span className="font-mono text-sm">
                    {formatDuration(jobDetails.run_time_seconds)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {jobDetails.metrics && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Quantum Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {jobDetails.metrics.depth}
                  </div>
                  <div className="text-sm text-muted-foreground">Circuit Depth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {jobDetails.metrics.width}
                  </div>
                  <div className="text-sm text-muted-foreground">Qubits</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {(jobDetails.metrics.success_rate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {jobDetails.tags && jobDetails.tags.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {jobDetails.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>
    );
  };

  const renderBlochSphere = () => {
    if (!jobDetails?.bloch) {
      return (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          <div className="text-center">
            <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No Bloch sphere data available</p>
            <p className="text-sm">This job doesn't contain quantum state information</p>
          </div>
        </div>
      );
    }

    try {
      const blochVector = processBlochData(jobDetails.bloch);
      return (
        <div className="space-y-4">
          <div className="h-64 relative">
            <BlochSphere vector={blochVector} />
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Quantum State</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Data Type:</span>
                  <Badge variant="outline">{jobDetails.bloch.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Vector Magnitude:</span>
                  <span className="font-mono">
                    {Math.sqrt(blochVector.x ** 2 + blochVector.y ** 2 + blochVector.z ** 2).toFixed(3)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } catch (error) {
      return (
        <div className="flex items-center justify-center h-64 text-destructive">
          <div className="text-center">
            <X className="h-12 w-12 mx-auto mb-4" />
            <p>Error processing Bloch sphere data</p>
            <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </div>
      );
    }
  };

  const renderRawData = () => {
    if (!jobDetails?.raw) {
      return (
        <div className="text-muted-foreground text-center py-8">
          No raw data available for this job
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">Raw JSON Data</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(JSON.stringify(jobDetails.raw, null, 2))}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy JSON
          </Button>
        </div>
        <div className="bg-muted rounded-lg p-4 overflow-auto max-h-96">
          <pre className="text-xs font-mono">
            {JSON.stringify(jobDetails.raw, null, 2)}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-[90vw] sm:w-[540px] sm:max-w-none">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span>Job Details</span>
              {jobId && (
                <Badge variant="outline" className="font-mono text-xs">
                  {jobId.slice(0, 8)}...
                </Badge>
              )}
            </div>
            {jobId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(jobId)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            {isLoading ? "Loading job details..." : "Detailed information about this quantum job"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : jobDetails ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="bloch">Bloch Sphere</TabsTrigger>
                <TabsTrigger value="raw">Raw Data</TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="overview" className="mt-0">
                  {renderOverview()}
                </TabsContent>

                <TabsContent value="bloch" className="mt-0">
                  {renderBlochSphere()}
                </TabsContent>

                <TabsContent value="raw" className="mt-0">
                  {renderRawData()}
                </TabsContent>
              </div>
            </Tabs>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <X className="h-12 w-12 mx-auto mb-4" />
              <p>Failed to load job details</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}