import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobFilters, JobStatus } from "@/types/job";

interface FiltersBarProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  availableBackends: string[];
}

const statusOptions: JobStatus[] = ["Completed", "Running", "Failed", "Pending", "Queued"];

export function FiltersBar({ filters, onFiltersChange, availableBackends }: FiltersBarProps) {
  const updateFilters = (updates: Partial<JobFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.search || 
    (filters.backends && filters.backends.length > 0) ||
    (filters.statuses && filters.statuses.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Job ID..."
            value={filters.search || ""}
            onChange={(e) => updateFilters({ search: e.target.value || undefined })}
            className="pl-10"
          />
        </div>

        {/* Backend Filter */}
        <Select
          value={filters.backends?.[0] || "all"}
          onValueChange={(value) => 
            updateFilters({ backends: value === "all" ? undefined : [value] })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Backends" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Backends</SelectItem>
            {availableBackends.map((backend) => (
              <SelectItem key={backend} value={backend}>
                {backend}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.statuses?.[0] || "all"}
          onValueChange={(value) => 
            updateFilters({ statuses: value === "all" ? undefined : [value as JobStatus] })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              Search: {filters.search}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => updateFilters({ search: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
          {filters.backends?.map((backend) => (
            <Badge key={backend} variant="secondary" className="flex items-center gap-1">
              Backend: {backend}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => updateFilters({ backends: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          
          {filters.statuses?.map((status) => (
            <Badge key={status} variant="secondary" className="flex items-center gap-1">
              Status: {status}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => updateFilters({ statuses: undefined })}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}