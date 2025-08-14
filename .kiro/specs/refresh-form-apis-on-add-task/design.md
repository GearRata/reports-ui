# Design Document

## Overview

This design implements a mechanism to refresh specific API data (`useIPPhonesForDropdown` and `useProgramsForDropdown`) when the user clicks the "AddTask" button, ensuring the form displays the most current data available.

## Architecture

### Current State Analysis

**Existing API Usage in Tasks Page:**
- `useTasksNewPaginated` - Main tasks data
- `useBranchesForDropdown` - Filter dropdown (branches)
- `useDepartmentsForDropdown` - Filter dropdown (departments) 
- `useProgramsForDropdown` - Filter dropdown + Form dropdown (programs)
- `useIPPhonesForDropdown` - Form dropdown only (IP phones)
- `useAssign` - Form dropdown (assign to)

**Key Insight:** `useProgramsForDropdown` is used in both filter and form, while `useIPPhonesForDropdown` is only used in form.

### Design Approach

**Strategy: Conditional API Refresh**
- Keep existing API hooks for filters (no change to current behavior)
- Add refresh capability to form-specific APIs when AddTask is triggered
- Implement loading states during refresh
- Maintain backward compatibility

## Components and Interfaces

### 1. Enhanced API Hooks

**Modified Hook Interface:**
```typescript
interface RefreshableHookOptions {
  enabled?: boolean;
  refreshTrigger?: number; // Increment to trigger refresh
}

interface RefreshableHookReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}
```

**Enhanced Hooks:**
```typescript
// Enhanced useIPPhonesForDropdown
export function useIPPhonesForDropdown(options?: RefreshableHookOptions) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const refresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  // Implementation with refresh capability
  return { ipPhones, loading, error, refresh };
}

// Enhanced useProgramsForDropdown  
export function useProgramsForDropdown(options?: RefreshableHookOptions) {
  // Similar implementation
  return { programs, loading, error, refresh };
}
```

### 2. Tasks Page Component Updates

**State Management:**
```typescript
const [formDataRefreshTrigger, setFormDataRefreshTrigger] = useState(0);

// Existing hooks (unchanged)
const { programs: filterPrograms } = useProgramsForDropdown();
const { branches } = useBranchesForDropdown();
const { departments } = useDepartmentsForDropdown();

// Form-specific hooks with refresh capability
const { 
  ipPhones: formIPPhones, 
  loading: ipPhonesLoading,
  refresh: refreshIPPhones 
} = useIPPhonesForDropdown({ refreshTrigger: formDataRefreshTrigger });

const { 
  programs: formPrograms, 
  loading: programsLoading,
  refresh: refreshPrograms 
} = useProgramsForDropdown({ refreshTrigger: formDataRefreshTrigger });
```

**Enhanced handleAddTask:**
```typescript
const handleAddTask = async () => {
  // Trigger API refresh for form data
  refreshIPPhones();
  refreshPrograms();
  
  // Open form immediately (don't wait for refresh)
  setEditingTask(null);
  setIsTaskFormOpen(true);
};
```

### 3. Form Component Updates

**TaskNewForm Props Enhancement:**
```typescript
interface TaskNewFormProps {
  // ... existing props
  ipPhones: IPPhone[];
  programs: Program[];
  assignTo: AssignData[];
  
  // New loading states
  ipPhonesLoading?: boolean;
  programsLoading?: boolean;
}
```

**Loading State Handling:**
```typescript
export function TaskNewForm({
  // ... existing props
  ipPhonesLoading = false,
  programsLoading = false,
}: TaskNewFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ... existing content */}
      
      <Select value={phoneId} onValueChange={setPhoneId}>
        <SelectTrigger className="col-span-3">
          <SelectValue 
            placeholder={ipPhonesLoading ? "Loading IP phones..." : "Select IP phone"} 
          />
        </SelectTrigger>
        <SelectContent>
          {ipPhonesLoading ? (
            <SelectItem value="" disabled>Loading...</SelectItem>
          ) : (
            ipPhones.map((phone) => (
              <SelectItem key={phone.id} value={phone.id.toString()}>
                {phone.number} - {phone.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {/* Similar pattern for programs dropdown */}
    </Dialog>
  );
}
```

## Data Models

### API Hook State Model
```typescript
interface RefreshableAPIState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  lastRefresh: number;
  refreshInProgress: boolean;
}
```

### Form Loading State Model
```typescript
interface FormLoadingStates {
  ipPhones: boolean;
  programs: boolean;
  assign: boolean;
}
```

## Error Handling

### API Refresh Errors
```typescript
const handleAddTask = async () => {
  try {
    // Trigger refreshes
    refreshIPPhones();
    refreshPrograms();
    
    // Open form regardless of refresh status
    setEditingTask(null);
    setIsTaskFormOpen(true);
  } catch (error) {
    console.error('Error refreshing form data:', error);
    // Still open form with existing data
    setIsTaskFormOpen(true);
  }
};
```

### Form Error States
- Display error messages in dropdown if refresh fails
- Fallback to cached data if available
- Allow form submission even if refresh fails

## Testing Strategy

### Unit Tests
1. **API Hook Tests:**
   - Test refresh functionality
   - Test loading states during refresh
   - Test error handling during refresh

2. **Component Tests:**
   - Test handleAddTask triggers refresh
   - Test form opens immediately
   - Test loading states display correctly

### Integration Tests
1. **End-to-End Flow:**
   - Click AddTask → APIs refresh → Form shows loading → Data updates
   - Test with network delays
   - Test with API failures

### Performance Tests
1. **Refresh Performance:**
   - Measure API refresh time
   - Test concurrent refresh handling
   - Test memory usage during refresh

## Implementation Phases

### Phase 1: API Hook Enhancement
- Modify `useIPPhonesForDropdown` to support refresh
- Modify `useProgramsForDropdown` to support refresh
- Add loading and error states

### Phase 2: Tasks Page Integration
- Update handleAddTask to trigger refreshes
- Pass loading states to form component
- Test refresh functionality

### Phase 3: Form Component Updates
- Add loading state handling to dropdowns
- Implement loading indicators
- Test user experience during refresh

### Phase 4: Error Handling & Polish
- Add comprehensive error handling
- Implement fallback mechanisms
- Add user feedback for refresh status