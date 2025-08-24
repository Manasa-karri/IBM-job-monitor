import { Job, JobDetails, JobsResponse, JobsResponseSchema, JobDetailsSchema } from "@/types/job";

// Mock data for development
const mockJobs: Job[] = [
  {
    id: "d2kud4cg59ks73c524c0",
    backend: "ibm_brisbane",
    state: { status: "Completed" },
    program: { id: "sampler", name: "Sampler" },
    user_id: "IBMid-6940012W0V",
    created: "2025-08-23T16:04:33.285627Z",
    tags: ["Composer"],
    cost: 10000,
    bss: { seconds: 1 },
    usage: { quantum_seconds: 1, seconds: 1 },
    status: "Completed"
  },
  {
    id: "a1b2c3d4e5f6g7h8i9j0",
    backend: "ibm_osaka",
    state: { status: "Running" },
    program: { id: "optimizer", name: "VQE Optimizer" },
    user_id: "IBMid-6940012W0V",
    created: "2025-08-24T10:15:42.123456Z",
    tags: ["VQE", "Optimization"],
    cost: 25000,
    usage: { quantum_seconds: 2.5, seconds: 2.5 },
    status: "Running"
  },
  {
    id: "b2c3d4e5f6g7h8i9j0k1",
    backend: "ibm_kyoto",
    state: { status: "Failed" },
    program: { id: "error_correction", name: "Error Correction" },
    user_id: "IBMid-6940012W0V",
    created: "2025-08-24T08:30:15.987654Z",
    tags: ["Error Correction"],
    cost: 0,
    usage: { quantum_seconds: 0, seconds: 0.1 },
    status: "Failed"
  },
  {
    id: "c3d4e5f6g7h8i9j0k1l2",
    backend: "ibm_brisbane",
    state: { status: "Queued" },
    program: { id: "qft", name: "Quantum Fourier Transform" },
    user_id: "IBMid-6940012W0V",
    created: "2025-08-24T12:45:33.456789Z",
    tags: ["QFT", "Algorithm"],
    cost: 15000,
    usage: { quantum_seconds: 0, seconds: 0 },
    status: "Queued"
  },
];

const mockJobDetails: Record<string, JobDetails> = {
  "d2kud4cg59ks73c524c0": {
    ...mockJobs[0],
    shots: 1024,
    queue_position: 0,
    run_time_seconds: 1.2,
    completed: "2025-08-23T16:05:10Z",
    metrics: {
      depth: 12,
      width: 3,
      success_rate: 0.98
    },
    bloch: {
      type: "vector",
      data: [0.2, -0.1, 0.97]
    },
    raw: {
      original_request: { shots: 1024, backend: "ibm_brisbane" },
      results: { counts: { "00": 512, "11": 512 } }
    }
  }
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/jobs";

class ApiClient {
  private async fetchWithRetry(url: string, options?: RequestInit): Promise<Response> {
    // For development, use mock data
    // if (import.meta.env.DEV) {
    //   return this.getMockResponse(url);
    // }
    
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  private getMockResponse(url: string): Promise<Response> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (url.startsWith('/jobs/') && url !== '/jobs') {
          const jobId = url.split('/')[2];
          const jobDetail = mockJobDetails[jobId];
          if (jobDetail) {
            resolve(new Response(JSON.stringify(jobDetail), { status: 200 }));
          } else {
            resolve(new Response(JSON.stringify({ error: 'Job not found' }), { status: 404 }));
          }
        } else {
          const response: JobsResponse = {
            jobs: mockJobs,
            count: mockJobs.length,
            limit: 200,
            offset: 0
          };
          resolve(new Response(JSON.stringify(response), { status: 200 }));
        }
      }, Math.random() * 500 + 200); // Simulate network delay
    });
  }

  async getJobs(): Promise<JobsResponse> {
    const response = await this.fetchWithRetry('/jobs');
    const data = await response.json();
    return JobsResponseSchema.parse(data);
  }

  async getJob(id: string): Promise<JobDetails> {
    const response = await this.fetchWithRetry(`/jobs/${id}`);
    const data = await response.json();
    return JobDetailsSchema.parse(data);
  }
}

export const apiClient = new ApiClient();