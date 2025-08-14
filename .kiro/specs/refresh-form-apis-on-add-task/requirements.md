# Requirements Document

## Introduction

ปรับปรุงหน้า Tasks ให้เมื่อผู้ใช้กดปุ่ม "AddTask" จะทำการเรียก API `useIPPhonesForDropdown` และ `useProgramsForDropdown` ใหม่อีกครั้งเพื่อให้ได้ข้อมูลล่าสุดสำหรับแสดงใน form dialog

## Requirements

### Requirement 1

**User Story:** As a user, I want the form to show the latest IP phones and programs data when I click AddTask, so that I can select from the most up-to-date options.

#### Acceptance Criteria

1. WHEN user clicks the "AddTask" button THEN the system SHALL trigger a refresh of `useIPPhonesForDropdown` API
2. WHEN user clicks the "AddTask" button THEN the system SHALL trigger a refresh of `useProgramsForDropdown` API  
3. WHEN the APIs are being refreshed THEN the system SHALL show loading indicators in the form
4. WHEN the API refresh is complete THEN the system SHALL display the updated data in the dropdown fields
5. WHEN the API refresh fails THEN the system SHALL show appropriate error messages

### Requirement 2

**User Story:** As a user, I want the form to open smoothly even while data is being refreshed, so that I don't experience delays in my workflow.

#### Acceptance Criteria

1. WHEN user clicks "AddTask" THEN the form dialog SHALL open immediately
2. WHEN APIs are being refreshed THEN the dropdown fields SHALL show loading states
3. WHEN API refresh completes THEN the dropdown options SHALL be populated with fresh data
4. IF API refresh takes longer than expected THEN the system SHALL show appropriate loading feedback

### Requirement 3

**User Story:** As a user, I want the existing filter functionality to remain unchanged, so that my current workflow is not disrupted.

#### Acceptance Criteria

1. WHEN the page loads THEN all existing filter dropdowns SHALL work as before
2. WHEN APIs are refreshed for the form THEN the filter functionality SHALL not be affected
3. WHEN the form is closed THEN the main page filters SHALL continue to work normally
4. WHEN data is refreshed THEN existing filter selections SHALL be preserved