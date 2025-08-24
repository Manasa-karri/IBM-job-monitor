# Quantum Jobs Tracker

A professional, production-ready React dashboard for monitoring and analyzing quantum computing jobs. Built with enterprise-grade design patterns and modern web technologies.

## Features

- **Professional Dashboard**: Clean, enterprise-style interface for quantum job monitoring
- **Real-time Status Tracking**: Monitor job progress with live status updates
- **Interactive Bloch Sphere**: 3D visualization of quantum states using react-three-fiber
- **Comprehensive Charts**: Line charts, donut charts, and bar charts for data analysis
- **Advanced Filtering**: Search and filter jobs by ID, backend, status, and date range
- **Dark/Light Theme**: Automatic theme switching with manual override
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard navigation and screen reader support

## Tech Stack

- **React 18** + **TypeScript** for type-safe development
- **Tailwind CSS** + **shadcn/ui** for professional styling
- **Recharts** for data visualization
- **React Three Fiber** + **Three.js** for 3D Bloch sphere
- **TanStack Query** for data fetching and caching
- **Framer Motion** for smooth animations
- **Zod** for runtime type validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser with WebGL support

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd quantum-jobs-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
cp .env.example .env
```

4. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://your-quantum-api.com/api

# Development Settings
VITE_DEV_MODE=true
```

## Data Contract

The application expects job data in the following format:

### Jobs List Response
```json
{
  "jobs": [
    {
      "id": "d2kud4cg59ks73c524c0",
      "backend": "ibm_brisbane",
      "state": {"status": "Completed"},
      "program": {"id": "sampler", "name": "Sampler"},
      "user_id": "IBMid-6940012W0V",
      "created": "2025-08-23T16:04:33.285627Z",
      "tags": ["Composer"],
      "cost": 10000,
      "bss": {"seconds": 1},
      "usage": {"quantum_seconds": 1, "seconds": 1},
      "status": "Completed"
    }
  ],
  "count": 1,
  "limit": 200,
  "offset": 0
}
```

### Job Details Response
```json
{
  "id": "d2kud4cg59ks73c524c0",
  "shots": 1024,
  "queue_position": 0,
  "run_time_seconds": 1.2,
  "backend": "ibm_brisbane",
  "program": {"id": "sampler", "name": "Sampler"},
  "status": "Completed",
  "created": "2025-08-23T16:04:33.285627Z",
  "completed": "2025-08-23T16:05:10Z",
  "metrics": {
    "depth": 12,
    "width": 3,
    "success_rate": 0.98
  },
  "bloch": {
    "type": "vector",
    "data": [0.2, -0.1, 0.97]
  },
  "raw": {
    "original_request": {"shots": 1024, "backend": "ibm_brisbane"},
    "results": {"counts": {"00": 512, "11": 512}}
  }
}
```

## Key Features

### Bloch Sphere Visualization
- Supports both vector `[x, y, z]` and statevector formats
- Interactive 3D controls (rotate, zoom)
- Real-time coordinate display
- Professional lighting and materials

### Dashboard Analytics
- **KPI Cards**: Total jobs, completion rates, costs
- **Jobs Over Time**: Line chart showing daily trends
- **Status Distribution**: Donut chart of job statuses
- **Cost Analysis**: Bar chart of average costs per backend

### Enterprise Features
- Manual refresh only (no auto-polling)
- URL-shareable filters
- Keyboard navigation
- Copy-to-clipboard functionality
- Loading states and error handling
- Responsive design

## Development

### Project Structure
```
src/
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── quantum/           # Quantum-specific components
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── api.ts            # API client
│   └── utils/            # Utility functions
├── types/
│   └── job.ts            # TypeScript definitions
└── pages/
    └── Index.tsx         # Main page
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Mock Data

In development mode, the application uses mock data that simulates real quantum job responses. The mock data includes various job statuses, backends, and quantum state information.

## Deployment

The application can be deployed to any static hosting service:

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist/` folder to your hosting service

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

WebGL support is required for 3D Bloch sphere visualization.

## License

MIT License - see LICENSE file for details.