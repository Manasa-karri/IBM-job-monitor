import { z } from "zod";

// Base job schema from API
export const JobSchema = z.object({
  id: z.string(),
  backend: z.string(),
  state: z.object({
    status: z.string(),
  }),
  program: z.object({
    id: z.string(),
    name: z.string().optional(),
  }),
  user_id: z.string(),
  created: z.string(),
  tags: z.array(z.string()).optional(),
  cost: z.number(),
  bss: z.object({
    seconds: z.number(),
  }).optional(),
  usage: z.object({
    quantum_seconds: z.number(),
    seconds: z.number(),
  }),
  status: z.string(),
});

// Extended job details schema
export const JobDetailsSchema = JobSchema.extend({
  shots: z.number().optional(),
  queue_position: z.number().optional(),
  run_time_seconds: z.number().optional(),
  completed: z.string().optional(),
  metrics: z.object({
    depth: z.number(),
    width: z.number(),
    success_rate: z.number(),
  }).optional(),
  bloch: z.object({
    type: z.enum(["vector", "statevector"]),
    data: z.array(z.number()),
  }).optional(),
  raw: z.record(z.string(), z.any()).optional(),
});

// API response schemas
export const JobsResponseSchema = z.object({
  jobs: z.array(JobSchema),
  count: z.number(),
  limit: z.number(),
  offset: z.number(),
});

export type Job = z.infer<typeof JobSchema>;
export type JobDetails = z.infer<typeof JobDetailsSchema>;
export type JobsResponse = z.infer<typeof JobsResponseSchema>;

// Status types for filtering
export type JobStatus = "Completed" | "Running" | "Failed" | "Pending" | "Queued";

// Filters interface
export interface JobFilters {
  search?: string;
  backends?: string[];
  statuses?: JobStatus[];
  dateRange?: {
    from: Date;
    to: Date;
  };
}