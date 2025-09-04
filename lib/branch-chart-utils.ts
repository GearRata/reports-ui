
import { DashboardData } from "@/types/Dashboard/model"

// Define chart data point structure for branch-specific data
export interface BranchChartDataPoint {
  date: string; // "YYYY-MM-DD"
  day: number; // Day of month
  [branchKey: string]: number | string;
  // Dynamic keys like: "สาขาใหญ่_total", "สาขาสันกำแพง_total"
}

// Month option interface for selector
export interface MonthOption {
  value: string; // YYYY-MM format
  label: string; // "มกราคม 2568" format (Thai Buddhist year)
  taskCount: number; // จำนวน tasks ในเดือนนั้น
}

// Task structure validation interface
interface ValidatedTask {
  id: number;
  branch_name: string;
  status: number;
  created_at: string;
}

/**
 * Extract date from created_at field handling different formats
 * @param createdAt - The created_at field from task
 * @returns Date string in YYYY-MM-DD format or null if invalid
 */
export function extractDateFromCreatedAt(createdAt: string): string | null {
  try {
    // Validate input
    if (!createdAt || typeof createdAt !== "string") {
      return null;
    }

    // Trim whitespace
    const trimmedDate = createdAt.trim();
    if (!trimmedDate) {
      return null;
    }

    let dateStr: string;

    if (trimmedDate.includes(" ")) {
      // Format: "2025-07-22 04:49:39"
      const parts = trimmedDate.split(" ");
      if (parts.length < 1) {
        console.warn("Invalid space-separated date format:", trimmedDate);
        return null;
      }
      dateStr = parts[0];
    } else if (trimmedDate.includes("T")) {
      // ISO format: "2025-07-22T04:49:39Z"
      const parts = trimmedDate.split("T");
      if (parts.length < 1) {
        console.warn("Invalid ISO date format:", trimmedDate);
        return null;
      }
      dateStr = parts[0];
    } else {
      // Fallback: assume it's already in YYYY-MM-DD format
      dateStr = trimmedDate;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateStr)) {
      console.warn("Invalid date format:", dateStr, "from:", createdAt);
      return null;
    }

    // Additional validation: check if it's a valid date
    const [year, month, day] = dateStr.split('-').map(num => parseInt(num));

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      console.warn("Invalid date components:", year, month, day);
      return null;
    }

    // Validate ranges
    if (year < 1900 || year > 2200) {
      console.warn("Year out of reasonable range:", year);
      return null;
    }

    if (month < 1 || month > 12) {
      console.warn("Month out of valid range:", month);
      return null;
    }

    if (day < 1 || day > 31) {
      console.warn("Day out of valid range:", day);
      return null;
    }

    // Check if the date is actually valid (e.g., not Feb 30)
    const testDate = new Date(year, month - 1, day);
    if (testDate.getFullYear() !== year ||
      testDate.getMonth() !== month - 1 ||
      testDate.getDate() !== day) {
      console.warn("Invalid date combination:", dateStr);
      return null;
    }

    return dateStr;
  } catch (error) {
    console.warn("Error extracting date from created_at:", createdAt, error);
    return null;
  }
}

/**
 * Validate task data structure
 * @param tasks - Array of tasks to validate
 * @returns Array of validated tasks
 */
export function validateTaskData(tasks: unknown[]): ValidatedTask[] {
  if (!Array.isArray(tasks)) {
    console.warn("Tasks is not an array:", tasks);
    return [];
  }

  return tasks.filter((task): task is ValidatedTask => {
    if (!task || typeof task !== 'object') {
      return false;
    }

    const taskObj = task as Record<string, unknown>;

    // Check required fields
    const hasRequiredFields = (
      'id' in taskObj &&
      'created_at' in taskObj &&
      'branch_name' in taskObj &&
      'status' in taskObj &&
      typeof taskObj.id === 'number' &&
      typeof taskObj.created_at === 'string' &&
      typeof taskObj.branch_name === 'string' &&
      typeof taskObj.status === 'number'
    );

    if (!hasRequiredFields) {
      console.warn("Invalid task structure:", task);
      return false;
    }

    // Validate date format
    const dateStr = extractDateFromCreatedAt(taskObj.created_at as string);
    if (!dateStr) {
      return false;
    }

    return true;
  });
}

/**
 * Filter tasks by selected month
 * @param tasks - Array of validated tasks
 * @param selectedMonth - Month in YYYY-MM format
 * @returns Filtered tasks for the selected month
 */
export function filterTasksByMonth(tasks: ValidatedTask[], selectedMonth: string): ValidatedTask[] {
  try {
    // Validate inputs
    if (!tasks || !Array.isArray(tasks)) {
      console.warn("Invalid tasks array for filterTasksByMonth:", tasks);
      return [];
    }

    if (!selectedMonth || typeof selectedMonth !== 'string') {
      console.warn("Invalid selectedMonth for filterTasksByMonth:", selectedMonth);
      return [];
    }

    // Validate selectedMonth format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(selectedMonth)) {
      console.warn("Invalid selectedMonth format:", selectedMonth);
      return [];
    }

    // Additional validation for month values
    const [year, month] = selectedMonth.split('-');
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum)) {
      console.warn("Invalid year or month in selectedMonth:", selectedMonth);
      return [];
    }

    if (yearNum < 1900 || yearNum > 2200) {
      console.warn("Year out of reasonable range:", yearNum);
      return [];
    }

    if (monthNum < 1 || monthNum > 12) {
      console.warn("Month out of valid range:", monthNum);
      return [];
    }

    return tasks.filter((task, index) => {
      try {
        // Additional task validation
        if (!task || typeof task !== 'object') {
          console.warn(`Invalid task at index ${index}:`, task);
          return false;
        }

        if (!('created_at' in task) || typeof task.created_at !== 'string') {
          console.warn(`Invalid created_at at index ${index}:`, task.created_at);
          return false;
        }

        const dateStr = extractDateFromCreatedAt(task.created_at);
        if (!dateStr) {
          return false;
        }

        const taskMonth = dateStr.substring(0, 7); // "2025-07"

        // Validate extracted month format
        if (!monthRegex.test(taskMonth)) {
          console.warn(`Invalid extracted month format at index ${index}:`, taskMonth);
          return false;
        }

        return taskMonth === selectedMonth;
      } catch (error) {
        console.warn(`Error filtering task at index ${index}:`, task, error);
        return false;
      }
    });
  } catch (error) {
    console.error("Error in filterTasksByMonth:", error);
    return [];
  }
}

/**
 * Count daily tasks by branch (combine pending + solved)
 * @param tasks - Array of filtered tasks for a specific month
 * @returns Map of date -> branch -> count
 */
export function countDailyTasksByBranch(
  tasks: ValidatedTask[]
): Map<string, Map<string, number>> {
  try {
    // Validate input
    if (!tasks || !Array.isArray(tasks)) {
      console.warn("Invalid tasks array for countDailyTasksByBranch:", tasks);
      return new Map();
    }

    const dateMap = new Map<string, Map<string, number>>();

    tasks.forEach((task, index) => {
      try {
        // Validate task structure
        if (!task || typeof task !== 'object') {
          console.warn(`Invalid task at index ${index}:`, task);
          return;
        }

        if (!('created_at' in task) || !('branch_name' in task) || !('status' in task)) {
          console.warn(`Task missing required fields at index ${index}:`, task);
          return;
        }

        const dateStr = extractDateFromCreatedAt(task.created_at);
        if (!dateStr) {
          return;
        }

        // Initialize date map if not exists
        if (!dateMap.has(dateStr)) {
          dateMap.set(dateStr, new Map());
        }

        const dayMap = dateMap.get(dateStr)!;

        // Handle missing or invalid branch names
        let branchName = task.branch_name;
        if (!branchName || typeof branchName !== 'string') {
          console.warn(`Invalid branch_name at index ${index}:`, branchName);
          branchName = "ไม่ระบุสาขา";
        } else {
          branchName = branchName.trim();
          if (!branchName) {
            branchName = "ไม่ระบุสาขา";
          }
        }

        // Initialize branch count if not exists
        if (!dayMap.has(branchName)) {
          dayMap.set(branchName, 0);
        }

        // Validate status
        if (typeof task.status !== 'number' || isNaN(task.status)) {
          console.warn(`Invalid status at index ${index}:`, task.status);
          return;
        }

        // Count all tasks regardless of status (pending + solved)
        // Status 0 = pending, Status 1 = solved
        if (task.status === 0 || task.status === 1) {
          const currentCount = dayMap.get(branchName) || 0;

          if (typeof currentCount !== 'number' || isNaN(currentCount)) {
            console.warn(`Invalid current count for ${branchName}:`, currentCount);
            dayMap.set(branchName, 1);
          } else {
            dayMap.set(branchName, currentCount + 1);
          }
        } else {
          // Log unexpected status values for debugging
          console.info(`Ignoring task with status ${task.status} at index ${index}`);
        }
      } catch (error) {
        console.warn(`Error processing task at index ${index}:`, task, error);
      }
    });

    return dateMap;
  } catch (error) {
    console.error("Error in countDailyTasksByBranch:", error);
    return new Map();
  }
}

/**
 * Generate chart data points for a selected month
 * @param tasks - Array of validated tasks
 * @param selectedMonth - Month in YYYY-MM format
 * @param branches - Array of available branches
 * @returns Array of chart data points with daily data for each branch
 */
export function generateChartDataPoints(
  tasks: ValidatedTask[],
  selectedMonth: string,
  branches: Array<{ id: number; name: string }>
): BranchChartDataPoint[] {
  try {
    // Validate inputs
    if (!tasks || !Array.isArray(tasks)) {
      console.warn("Invalid tasks array:", tasks);
      return [];
    }

    if (!selectedMonth || typeof selectedMonth !== 'string') {
      console.warn("Invalid selectedMonth:", selectedMonth);
      return [];
    }

    if (!branches || !Array.isArray(branches) || branches.length === 0) {
      console.warn("Invalid branches array:", branches);
      return [];
    }

    // Validate selectedMonth format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(selectedMonth)) {
      console.warn("Invalid selectedMonth format:", selectedMonth);
      return [];
    }

    // Validate branches structure
    const validBranches = branches.filter(branch => {
      if (!branch || typeof branch !== 'object') {
        console.warn("Invalid branch object:", branch);
        return false;
      }
      if (!('id' in branch) || !('name' in branch)) {
        console.warn("Branch missing required fields:", branch);
        return false;
      }
      if (typeof branch.id !== 'number' || typeof branch.name !== 'string') {
        console.warn("Branch has invalid field types:", branch);
        return false;
      }
      if (!branch.name.trim()) {
        console.warn("Branch has empty name:", branch);
        return false;
      }
      return true;
    });

    if (validBranches.length === 0) {
      console.warn("No valid branches found");
      return [];
    }

    // Filter tasks by month
    const monthTasks = filterTasksByMonth(tasks, selectedMonth);

    if (monthTasks.length === 0) {
      // Still generate empty data points for the month
      console.info("No tasks found for selected month, generating empty data points");
    }

    // Count daily tasks by branch
    const dateMap = countDailyTasksByBranch(monthTasks);

    // Generate all dates in the selected month
    const [year, month] = selectedMonth.split("-");
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    // Validate year and month
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      console.warn("Invalid year or month:", year, month);
      return [];
    }

    // Validate year range (reasonable bounds)
    if (yearNum < 2000 || yearNum > 2100) {
      console.warn("Year out of reasonable range:", yearNum);
      return [];
    }

    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();

    if (daysInMonth < 1 || daysInMonth > 31) {
      console.warn("Invalid days in month:", daysInMonth);
      return [];
    }

    const allDates: string[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${month}-${String(day).padStart(2, "0")}`;
      allDates.push(dateStr);
    }

    // Create chart data points
    const chartPoints: BranchChartDataPoint[] = allDates.map((dateStr) => {
      try {
        const dayData = dateMap.get(dateStr) || new Map();
        const day = parseInt(dateStr.split("-")[2]);

        if (isNaN(day) || day < 1 || day > 31) {
          console.warn("Invalid day extracted from date:", dateStr, day);
          return null;
        }

        const dataPoint: BranchChartDataPoint = {
          date: dateStr,
          day: day,
        };

        // Add data for each branch (total count)
        validBranches.forEach((branch) => {
          try {
            const branchCount = dayData.get(branch.name) || 0;

            // Validate count is a number
            if (typeof branchCount !== 'number' || isNaN(branchCount) || branchCount < 0) {
              console.warn("Invalid branch count:", branch.name, branchCount);
              dataPoint[`${branch.name}_total`] = 0;
            } else {
              dataPoint[`${branch.name}_total`] = branchCount;
            }
          } catch (error) {
            console.warn("Error processing branch data:", branch.name, error);
            dataPoint[`${branch.name}_total`] = 0;
          }
        });

        return dataPoint;
      } catch (error) {
        console.warn("Error creating data point for date:", dateStr, error);
        return null;
      }
    }).filter((point): point is BranchChartDataPoint => point !== null);

    return chartPoints;
  } catch (error) {
    console.error("Error in generateChartDataPoints:", error);
    return [];
  }
}

/**
 * Format month string to Thai label with Buddhist year
 * @param monthString YYYY-MM format
 * @returns Thai month label with Buddhist year
 */
export function formatMonthLabel(monthString: string): string {
  try {
    // Validate input
    if (!monthString || typeof monthString !== 'string') {
      console.warn("Invalid monthString for formatMonthLabel:", monthString);
      return monthString || '';
    }

    // Validate format
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(monthString)) {
      console.warn("Invalid monthString format:", monthString);
      return monthString;
    }

    const parts = monthString.split("-");
    if (parts.length !== 2) {
      console.warn("Invalid monthString parts:", parts);
      return monthString;
    }

    const [year, month] = parts;
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    // Validate year and month values
    if (isNaN(yearNum) || isNaN(monthNum)) {
      console.warn("Invalid year or month numbers:", year, month);
      return monthString;
    }

    if (yearNum < 1900 || yearNum > 2200) {
      console.warn("Year out of reasonable range:", yearNum);
      return monthString;
    }

    if (monthNum < 1 || monthNum > 12) {
      console.warn("Month out of valid range:", monthNum);
      return monthString;
    }

    const monthNames = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

    const monthIndex = monthNum - 1;
    const buddhistYear = yearNum + 543;

    if (monthIndex >= 0 && monthIndex < monthNames.length) {
      return `${monthNames[monthIndex]} ${buddhistYear}`;
    }

    console.warn("Month index out of range:", monthIndex);
    return monthString; // fallback
  } catch (error) {
    console.warn("Error in formatMonthLabel:", monthString, error);
    return monthString || ''; // fallback
  }
}

/**
 * Generate month options from task data
 * @param data - Dashboard data containing tasks
 * @returns Array of month options with Thai labels and task counts
 */
export function generateMonthOptions(data: DashboardData | null): MonthOption[] {
  try {
    // Validate input data
    if (!data) {
      console.warn("No data provided to generateMonthOptions");
      return [];
    }

    if (!data.tasks) {
      console.warn("No tasks array in data");
      return [];
    }

    if (!Array.isArray(data.tasks)) {
      console.warn("Tasks is not an array:", typeof data.tasks);
      return [];
    }

    if (data.tasks.length === 0) {
      return [];
    }

    // Validate and filter tasks
    const validatedTasks = validateTaskData(data.tasks);

    if (validatedTasks.length === 0) {
      console.warn("No valid tasks found after validation");
      return [];
    }

    // Group tasks by month
    const monthMap = new Map<string, number>();

    validatedTasks.forEach((task) => {
      try {
        const dateStr = extractDateFromCreatedAt(task.created_at);
        if (!dateStr) {
          return;
        }

        // Extract YYYY-MM and validate
        const monthKey = dateStr.substring(0, 7); // "2025-07"
        const monthRegex = /^\d{4}-\d{2}$/;
        if (!monthRegex.test(monthKey)) {
          console.warn("Invalid month format:", monthKey);
          return;
        }

        // Validate month values
        const [year, month] = monthKey.split('-');
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);

        if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
          console.warn("Invalid month values:", year, month);
          return;
        }

        // Count tasks for this month
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + 1);
      } catch (error) {
        console.warn("Error processing task for month options:", task, error);
      }
    });

    if (monthMap.size === 0) {
      console.warn("No valid months found in tasks");
      return [];
    }

    // Convert to array and sort (newest first)
    const monthArray = Array.from(monthMap.entries())
      .map(([monthKey, taskCount]) => {
        try {
          return {
            value: monthKey,
            label: formatMonthLabel(monthKey),
            taskCount: taskCount || 0,
          };
        } catch (error) {
          console.warn("Error formatting month option:", monthKey, error);
          return null;
        }
      })
      .filter((option): option is MonthOption => option !== null)
      .sort((a, b) => b.value.localeCompare(a.value));

    return monthArray;
  } catch (error) {
    console.error("Error in generateMonthOptions:", error);
    return [];
  }
}

/**
 * Calculate branch totals for toggle buttons
 * @param chartData - Array of chart data points
 * @param branches - Array of available branches
 * @returns Record of branch name to total count
 */
export function calculateBranchTotals(
  chartData: BranchChartDataPoint[],
  branches: Array<{ id: number; name: string }>
): Record<string, number> {
  try {
    // Validate inputs
    if (!chartData || !Array.isArray(chartData)) {
      console.warn("Invalid chartData for calculateBranchTotals:", chartData);
      return {};
    }

    if (!branches || !Array.isArray(branches)) {
      console.warn("Invalid branches for calculateBranchTotals:", branches);
      return {};
    }

    const totals: Record<string, number> = {};

    branches.forEach(branch => {
      try {
        // Validate branch structure
        if (!branch || typeof branch !== 'object') {
          console.warn("Invalid branch object:", branch);
          return;
        }

        if (!('name' in branch) || typeof branch.name !== 'string') {
          console.warn("Branch missing or invalid name:", branch);
          return;
        }

        if (!branch.name.trim()) {
          console.warn("Branch has empty name:", branch);
          return;
        }

        // Calculate total for this branch
        const branchKey = `${branch.name}_total`;
        let total = 0;

        chartData.forEach(dataPoint => {
          try {
            if (!dataPoint || typeof dataPoint !== 'object') {
              return;
            }

            const value = dataPoint[branchKey];

            if (typeof value === 'number' && !isNaN(value) && value >= 0) {
              total += value;
            } else if (value !== undefined) {
              console.warn("Invalid value for branch total:", branchKey, value);
            }
          } catch (error) {
            console.warn("Error processing data point for branch total:", branchKey, error);
          }
        });

        totals[branch.name] = total;
      } catch (error) {
        console.warn("Error calculating total for branch:", branch, error);
      }
    });

    return totals;
  } catch (error) {
    console.error("Error in calculateBranchTotals:", error);
    return {};
  }
}