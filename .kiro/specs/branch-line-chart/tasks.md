# Implementation Plan

- [x] 1. Update component props and TypeScript interfaces

  - Change component props to match BranchAreaChart pattern (data, loading, error)
  - Import DashboardData type from existing types/entities
  - Define BranchChartDataPoint interface for chart data structure
  - Remove desktop/mobile related interfaces and use branch-based structure
  - _Requirements: 1.1, 5.1_

- [x] 2. Implement month selector functionality

  - Copy month options generation logic from BranchAreaChart
  - Implement formatMonthLabel function for Thai Buddhist year formatting
  - Add month selector dropdown component to header
  - Handle month selection state changes
  - _Requirements: 2.1, 2.2, 2.4_

- [x] 3. Implement data processing utilities

  - Copy and adapt task filtering logic from BranchAreaChart
  - Create function to extract date from created_at field (handle different formats)
  - Implement daily task counting by branch (combine pending + solved)
  - Add data validation for task structure
  - _Requirements: 2.2, 2.3, 5.2_

- [x] 4. Update chart data transformation

  - Replace desktop/mobile data structure with branch-based data
  - Process DashboardData.tasks to create daily data points per branch
  - Generate dynamic branch keys (e.g., "สาขาใหญ่_total")
  - Fill missing dates with zero values for complete month view
  - _Requirements: 1.2, 3.1, 5.2_

- [x] 5. Implement dynamic chart configuration

  - Create dynamic chartConfig based on available branches from data
  - Assign colors from chart color variables to each branch
  - Handle multiple branches with color cycling
  - Remove hardcoded desktop/mobile configuration
  - _Requirements: 1.1, 1.3_

- [x] 6. Update branch toggle functionality

  - Replace desktop/mobile toggles with dynamic branch toggles
  - Update active branch state to use branch names from data
  - Calculate and display total task counts for each branch
  - Ensure toggle buttons show proper branch names and totals
  - _Requirements: 1.3, 1.4, 4.2_

- [x] 7. Fix chart rendering and display

  - Update Line component to use dynamic branch data keys
  - Fix TypeScript errors in date formatters by properly typing parameters
  - Ensure chart displays selected branch data correctly
  - Update chart to show daily data points for selected month
  - _Requirements: 3.1, 3.2_

- [x] 8. Update tooltip and axis formatting

  - Implement Thai date formatting in tooltips (similar to BranchAreaChart)
  - Update X-axis to show day numbers for daily data

  - Ensure tooltip shows correct branch task counts
  - Fix labelFormatter and tickFormatter TypeScript errors
  - _Requirements: 3.2, 3.3, 3.4_

- [x] 9. Add loading and error state handling

  - Implement loading state display (copy from BranchAreaChart)
  - Add error state handling with proper error messages
  - Handle empty data state when no tasks available
  - Add empty state for selected month with no data
  - _Requirements: 5.4_

- [x] 10. Update component layout and styling


  - Update card title and description for task data context
  - Ensure month selector positioning matches BranchAreaChart
  - Maintain responsive layout for different screen sizes
  - Update component to match existing design system
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 11. Integrate with dashboard page






  - Update dashboard page to pass DashboardData to component
  - Ensure component receives data, loading, and error props correctly
  - Test integration with existing dashboard data flow
  - Verify component works with real API data
  - _Requirements: 5.1, 5.2_

- [x] 12. Add comprehensive error handling and validation




  - Implement task data validation (copy from BranchAreaChart)
  - Handle invalid date formats gracefully
  - Add fallback handling for missing branch names
  - Handle edge cases like empty months or invalid selections
  - _Requirements: 2.4, 5.2, 5.4_
