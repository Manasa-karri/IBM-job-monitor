import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({ onRefresh, isRefreshing }: HeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Quantum Jobs Tracker
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitor and analyze quantum computing jobs
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}