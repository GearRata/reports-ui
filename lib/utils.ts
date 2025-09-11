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
