# Requirements Document

## Introduction

This feature enhances the existing line chart component to display branch-specific task data using the DashboardData structure. The chart will show task counts for different branches with the ability to filter by month and display data by day, similar to the BranchAreaChart but as a line chart with branch toggle functionality.

## Requirements

### Requirement 1

**User Story:** As a business analyst, I want to view task data by branch location, so that I can compare task volumes between different branch locations.

#### Acceptance Criteria

1. WHEN the chart loads THEN the system SHALL display data for available branches from the DashboardData
2. WHEN displaying branch data THEN the system SHALL show total task counts (pending + solved) for each branch
3. WHEN a user clicks on a branch toggle button THEN the system SHALL switch the active chart to display that branch's data
4. WHEN displaying branch totals THEN the system SHALL calculate and show the sum of all tasks for each branch

### Requirement 2

**User Story:** As a user, I want to select different months to view data, so that I can analyze trends across different time periods.

#### Acceptance Criteria

1. WHEN the chart loads THEN the system SHALL provide a month selector dropdown with Thai labels
2. WHEN a user selects a month THEN the system SHALL filter tasks by created_at field for that specific month
3. WHEN month data is displayed THEN the system SHALL show daily data points for the selected month
4. WHEN no month is selected THEN the system SHALL display data for the current month by default

### Requirement 3

**User Story:** As a user, I want to see daily task data, so that I can identify daily patterns and trends.

#### Acceptance Criteria

1. WHEN displaying chart data THEN the system SHALL show data points for each day of the selected month
2. WHEN hovering over data points THEN the system SHALL display a tooltip with the exact date and task count
3. WHEN formatting dates on the X-axis THEN the system SHALL display dates in a readable format (day number)
4. WHEN displaying tooltip dates THEN the system SHALL show the full date in Thai format including year

### Requirement 4

**User Story:** As a user, I want the chart to maintain responsive design, so that I can view it on different screen sizes.

#### Acceptance Criteria

1. WHEN viewing on mobile devices THEN the system SHALL adapt the layout to fit smaller screens
2. WHEN displaying branch toggle buttons THEN the system SHALL arrange them appropriately for the screen size
3. WHEN showing the month selector THEN the system SHALL position it accessibly on all screen sizes
4. WHEN rendering the chart THEN the system SHALL maintain readability across different viewport sizes

### Requirement 5

**User Story:** As a user, I want to see task data from the dashboard API, so that I can view real-time task statistics.

#### Acceptance Criteria

1. WHEN receiving DashboardData THEN the system SHALL process tasks array to extract branch and date information
2. WHEN calculating totals THEN the system SHALL count tasks with status 0 (pending) and status 1 (solved)
3. WHEN switching between branches THEN the system SHALL update both the chart line and the total count
4. WHEN displaying loading or error states THEN the system SHALL show appropriate feedback messages