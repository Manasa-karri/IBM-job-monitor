import { z } from "zod";

// Base job schema from API
export const JobSchema = z.object({
  id: z.string(),
  backend: z.string(),
  state: z.object({
    status: z.string(),
  }).optional(), // sometimes IBM only gives `status`
  program: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
  user_id: z.string().optional(),
  created: z.string().optional(),
  tags: z.array(z.string()).optional(),
  cost: z.number().optional(),
  bss: z.object({
    seconds: z.number().optional(),
  }).optional(),
  usage: z.object({
    quantum_seconds: z.number().optional(),
    seconds: z.number().optional(),
  }).optional(),
  status: z.string().optional(),
});

// Extended job details schema
export const JobDetailsSchema = JobSchema.extend({
  shots: z.number().optional(),
  queue_position: z.number().optional(),
  run_time_seconds: z.number().optional(),
  completed: z.string().optional(),
  metrics: z.object({
    depth: z.number().optional(),
    width: z.number().optional(),
    success_rate: z.number().optional(),
  }).optional(),
  bloch: z.object({
    type: z.enum(["vector", "statevector"]).optional(),
    data: z.array(z.number()).optional(),
  }).optional(),
  raw: z.record(z.string(), z.any()).optional(),
  results: z.any().optional(),   // IBM job results payload
  qobj: z.any().optional(),      // IBM input quantum object
  info: z.any().optional(),      // extra metadata from IBM
});

// API response schemas
export const JobsResponseSchema = z.object({
  jobs: z.array(JobSchema),
  count: z.number(),
  limit: z.number(),
  offset: z.number(),
});

// Types
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