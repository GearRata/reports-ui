# Design Document

## Overview

The Branch Line Chart feature transforms the existing interactive line chart to display branch-specific task data using the DashboardData structure. The component will show task counts for different branches with month filtering capabilities and daily data visualization, following the same pattern as BranchAreaChart but as a line chart with branch toggle functionality.

## Architecture

### Component Structure
```
BranchLineChart
├── MonthSelector (similar to BranchAreaChart)
├── CardHeader
│   ├── Title & Description
│   └── BranchToggleButtons (modified from desktop/mobile)
└── CardContent
    └── ChartContainer
        └── LineChart (modified)
```

### Data Flow
1. **Data Source**: DashboardData with tasks array and branches array
2. **Month Filtering**: Filter tasks by created_at field for selected month
3. **Branch Calculation**: Count tasks (pending + solved) for each branch per day
4. **Chart Rendering**: Display filtered data with proper formatting

## Components and Interfaces

### Data Models

#### Component Props Interface
```typescript
interface BranchLineChartProps {
  data: DashboardData | null;
  loading?: boolean;
  error?: string | null;
}
```

#### Chart Data Point Interface
```typescript
interface BranchChartDataPoint {
  date: string; // "YYYY-MM-DD"
  day: number; // Day of month
  [branchKey: string]: number | string;
  // Dynamic keys like: "สาขาใหญ่_total", "สาขาสันกำแพง_total"
}
```

#### Month Option Interface (reuse from BranchAreaChart)
```typescript
interface MonthOption {
  value: string; // "YYYY-MM" format
  label: string; // "มกราคม 2568" format (Thai Buddhist year)
  taskCount: number; // จำนวน tasks ในเดือนนั้น
}
```

### State Management

#### Component State
```typescript
const [activeBranch, setActiveBranch] = useState<string>(''); // Dynamic branch name
const [selectedMonth, setSelectedMonth] = useState<string>('');
```

#### Computed Values
```typescript
// Month options generation (similar to BranchAreaChart)
const monthOptions = useMemo<MonthOption[]>(() => {
  // Extract unique months from tasks, count tasks per month
  // Format with Thai Buddhist year
}, [data]);

// Chart data processing
const chartData = useMemo<BranchChartDataPoint[]>(() => {
  // Filter tasks by selectedMonth
  // Group by date and branch_name
  // Count pending (status 0) + solved (status 1) per branch per day
  // Fill missing dates with zero values
}, [data, selectedMonth]);

// Available branches
const availableBranches = useMemo(() => {
  return data?.branches || [];
}, [data]);

// Branch totals for toggle buttons
const branchTotals = useMemo(() => {
  const totals: Record<string, number> = {};
  availableBranches.forEach(branch => {
    totals[branch.name] = chartData.reduce((acc, curr) => 
      acc + (curr[`${branch.name}_total`] as number || 0), 0
    );
  });
  return totals;
}, [chartData, availableBranches]);
```

### Chart Configuration

#### Dynamic Chart Config
```typescript
const chartConfig = useMemo<ChartConfig>(() => {
  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))", 
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))"
  ];

  const config: ChartConfig = {};
  availableBranches.forEach((branch, index) => {
    config[`${branch.name}_total`] = {
      label: branch.name,
      color: colors[index % colors.length]
    };
  });
  return config;
}, [availableBranches]);
```

## Data Models

### DashboardData Structure (from existing types)
```typescript
interface DashboardData {
  tasks: Task[];
  branches: Branch[];
  // ... other fields
}

interface Task {
  id: number;
  branch_name: string;
  status: number; // 0 = pending, 1 = solved
  created_at: string; // "YYYY-MM-DD HH:MM:SS" or ISO format
  // ... other fields
}

interface Branch {
  id: number;
  name: string;
  // ... other fields
}
```

### Data Processing Logic
```typescript
// Month filtering (reuse from BranchAreaChart)
const monthTasks = data.tasks.filter(task => {
  const dateStr = extractDateFromCreatedAt(task.created_at);
  const taskMonth = dateStr.substring(0, 7); // "YYYY-MM"
  return taskMonth === selectedMonth;
});

// Daily aggregation
const dateMap = new Map<string, Map<string, number>>();
monthTasks.forEach(task => {
  const dateStr = extractDateFromCreatedAt(task.created_at);
  const branchName = task.branch_name || "ไม่ระบุสาขา";
  
  if (!dateMap.has(dateStr)) {
    dateMap.set(dateStr, new Map());
  }
  
  const dayMap = dateMap.get(dateStr)!;
  const currentCount = dayMap.get(branchName) || 0;
  dayMap.set(branchName, currentCount + 1); // Count all tasks regardless of status
});
```

## Error Handling

### TypeScript Type Safety
- Fix existing TypeScript errors in date formatters by properly typing parameters
- Ensure all data transformations maintain type safety
- Add proper error boundaries for data processing

### Data Validation (reuse from BranchAreaChart)
```typescript
const validateTaskData = (tasks: unknown[]): Task[] => {
  return tasks.filter((task): task is Task => {
    return (
      typeof task === 'object' &&
      task !== null &&
      'created_at' in task &&
      'branch_name' in task &&
      'status' in task &&
      typeof task.created_at === 'string'
    );
  });
};
```

### Fallback Handling
- Default to current month if invalid month selected
- Show empty state message if no data available for selected month
- Graceful degradation if data fetching fails
- Handle missing branch names with fallback text

## Testing Strategy

### Unit Tests
1. **Data Processing Tests**
   - Test month filtering logic from created_at field
   - Test task counting by branch and date
   - Test data validation functions

2. **Component Behavior Tests**
   - Test branch toggle functionality
   - Test month selector changes
   - Test responsive layout adaptations

3. **Integration Tests**
   - Test chart rendering with different data sets
   - Test tooltip functionality with Thai date formatting
   - Test accessibility features

### Test Data
```typescript
const mockDashboardData: DashboardData = {
  tasks: [
    { id: 1, branch_name: "สาขาใหญ่", status: 0, created_at: "2024-08-01 10:00:00" },
    { id: 2, branch_name: "สาขาใหญ่", status: 1, created_at: "2024-08-01 14:00:00" },
    { id: 3, branch_name: "สาขาสันกำแพง", status: 0, created_at: "2024-08-01 16:00:00" },
    { id: 4, branch_name: "สาขาสันกำแพง", status: 1, created_at: "2024-08-02 09:00:00" }
  ],
  branches: [
    { id: 1, name: "สาขาใหญ่" },
    { id: 2, name: "สาขาสันกำแพง" }
  ]
};
```

## Implementation Notes

### Key Changes from Original
1. **Data Structure**: Use DashboardData instead of mock data
2. **Month Filtering**: Reuse logic from BranchAreaChart
3. **Calculation Logic**: Count tasks per branch per day (not desktop/mobile)
4. **UI Labels**: Use dynamic branch names from data
5. **Color Scheme**: Maintain existing chart color variables

### Code Reuse from BranchAreaChart
- Month options generation and formatting
- Date extraction and validation logic
- Thai language formatting functions
- Error handling patterns
- Loading and empty state handling

### Performance Considerations
- Memoize expensive calculations (filtering, totals)
- Optimize re-renders when switching months/branches
- Reuse existing utility functions from BranchAreaChart

### Responsive Design
- Month selector adapts to mobile layout (same as BranchAreaChart)
- Branch toggle buttons stack on smaller screens
- Chart maintains readability across viewports