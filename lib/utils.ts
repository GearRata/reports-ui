import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============ Export File CSV Branch ============
export async function exportFileBranch() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/dashboard/data/branchcsv`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the blob data from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename (you can customize this)
    const filename = `branches_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'File downloaded successfully' };
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============ Export File CSV Deparment ============
export async function exportFileDepartment() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/dashboard/data/departmetcsv`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the blob data from response
    const blob = await response.blob();
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Set filename (you can customize this)
    const filename = `department_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: 'File downloaded successfully' };
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============ Export File CSV Phone ============
export async function exportFilePhone() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/dashboard/data/phonecsv`);

    if (!response.ok) {
      throw new Error('HTTP error! status: ${reponse.state}')
    }

    // Get the blob data from response
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Set filename
    const filename = `phone_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.download = filename;

     // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'File downloaded successfully' };
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============ Export File System  ============
export async function exportFileSystem() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/dashboard/data/systemcsv`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the blob data from response
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Set filename (you can customize this)
    const filename = `system_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'File downloaded successfully' };
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============ Export File CSV Tasks ============
export async function exportFileTask() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/v1/dashboard/data/csv`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the blob data from response
    const blob = await response.blob();

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Set filename (you can customize this)
    const filename = `task_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'File downloaded successfully' };
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============ Export File CSV Tasks with Date Range ============
export async function exportFileTaskWithDateRange(startDate?: Date, endDate?: Date) {
  try {
    const params = new URLSearchParams()
    
    if (startDate) {
      const year = startDate.getFullYear()
      const month = String(startDate.getMonth() + 1).padStart(2, '0')
      const day = String(startDate.getDate()).padStart(2, '0')
      params.append('start_date', `${year}-${month}-${day}`)
    }
    
    if (endDate) {
      const year = endDate.getFullYear()
      const month = String(endDate.getMonth() + 1).padStart(2, '0')
      const day = String(endDate.getDate()).padStart(2, '0')
      params.append('end_date', `${year}-${month}-${day}`)
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE}/api/v1/dashboard/data/taskscsv${params.toString() ? '?' + params.toString() : ''}`
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the blob data from response
    const blob = await response.blob();

    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;

    // Set filename with date range
    let filename = 'tasks_export';
    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
    
    if (startDate && endDate) {
      filename += `_${formatDate(startDate)}_to_${formatDate(endDate)}`;
    } else if (startDate) {
      filename += `_from_${formatDate(startDate)}`;
    } else if (endDate) {
      filename += `_until_${formatDate(endDate)}`;
    } else {
      filename += `_${formatDate(new Date())}`;
    }
    filename += '.csv';
    
    link.download = filename;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return { success: true, message: 'File downloaded successfully' };
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
