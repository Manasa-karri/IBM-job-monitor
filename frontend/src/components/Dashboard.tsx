import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Header } from "@/components/dashboard/Header";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { FiltersBar } from "@/components/dashboard/FiltersBar";
import { JobsTable } from "@/components/dashboard/JobsTable";
import { ChartsGrid } from "@/components/dashboard/ChartsGrid";
import { JobDetailsDrawer } from "@/components/dashboard/JobDetailsDrawer";
import { apiClient } from "@/lib/api";
import { Job, JobDetails, JobFilters } from "@/types/job";

export function Dashboard() {
  const [filters, setFilters] = useState<JobFilters>({});
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Fetch jobs
  const {
    data: jobsResponse,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
    isFetching: isFetchingJobs,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: () => apiClient.getJobs(),
    staleTime: 30000, // 30 seconds
  });

  // Fetch selected job details
  const {
    data: jobDetails,
    isLoading: isLoadingJobDetails,
  } = useQuery({
    queryKey: ["job", selectedJobId],
    queryFn: () => selectedJobId ? apiClient.getJob(selectedJobId) : null,
    enabled: !!selectedJobId,
  });

  const jobs = jobsResponse?.jobs || [];

  // Filter jobs based on current filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!job.id.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Backend filter
      if (filters.backends && filters.backends.length > 0) {
        if (!filters.backends.includes(job.backend)) {
          return false;
        }
      }

      // Status filter
      if (filters.statuses && filters.statuses.length > 0) {
        if (!filters.statuses.includes(job.status as any)) {
          return false;
        }
      }

      // Date range filter (if implemented)
      if (filters.dateRange) {
        const jobDate = new Date(job.created);
        if (jobDate < filters.dateRange.from || jobDate > filters.dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }, [jobs, filters]);

  // Get available backends for filter dropdown
  const availableBackends = useMemo(() => {
    return Array.from(new Set(jobs.map(job => job.backend))).sort();
  }, [jobs]);

  const handleRefresh = () => {
    refetchJobs();
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
  };

  const handleCloseJobDetails = () => {
    setSelectedJobId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onRefresh={handleRefresh} 
        isRefreshing={isFetchingJobs} 
      />
      
      <main className="container mx-auto px-6 py-6 space-y-6">
        {/* Loading state for initial load */}
        {isLoadingJobs ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
            <div className="h-64 bg-muted animate-pulse rounded-lg" />
            <div className="h-96 bg-muted animate-pulse rounded-lg" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* KPI Cards */}
            <KpiCards jobs={filteredJobs} />

            {/* Filters */}
            <FiltersBar
              filters={filters}
              onFiltersChange={setFilters}
              availableBackends={availableBackends}
            />

            {/* Charts */}
            <ChartsGrid jobs={filteredJobs} />

            {/* Jobs Table */}
            <JobsTable 
              jobs={filteredJobs} 
              onJobSelect={handleJobSelect}
            />
          </motion.div>
        )}

        {/* Job Details Drawer */}
        <JobDetailsDrawer
          jobId={selectedJobId}
          jobDetails={jobDetails || null}
          isLoading={isLoadingJobDetails}
          open={!!selectedJobId}
          onClose={handleCloseJobDetails}
        />
      </main>
    </div>
  );
}