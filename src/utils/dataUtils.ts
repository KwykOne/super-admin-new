
export function convertNumber(number: number): string {
    // Truncate the number
    const truncated = Math.trunc(number);

    // Convert to Indian numbering format
    return truncated.toLocaleString('en-IN');
}

export const formatNumberWithCommas = (number) => {
  return number.toLocaleString();
}

export function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };
  
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', options);
}
  
export function formatDateTime(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
  
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', options);
}

export function downloadTableAsCSV(tableData: any[], filename: string): void {
  if (!tableData || tableData.length === 0) {
    console.error('No data to export');
    return;
  }

  // Get headers from the first object's keys
  const headers = Object.keys(tableData[0]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  tableData.forEach(item => {
    const row = headers.map(header => {
      // Handle value that might contain commas or quotes
      const value = item[header] === null || item[header] === undefined ? '' : String(item[header]);
      const escapedValue = value.includes(',') || value.includes('"') 
        ? `"${value.replace(/"/g, '""')}"` 
        : value;
      return escapedValue;
    }).join(',');
    csvContent += row + '\n';
  });
  
  // Create a blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatTableDataForDownload(data: any[]): any[] {
  if (!data || data.length === 0) return [];
  
  // Create a deep copy of the data to avoid modifying the original
  return data.map(item => {
    const formattedItem = { ...item };
    
    // Remove any HTML or React components
    Object.keys(formattedItem).forEach(key => {
      // If the value is not a primitive type, convert to string
      if (typeof formattedItem[key] === 'object' && formattedItem[key] !== null) {
        formattedItem[key] = JSON.stringify(formattedItem[key]);
      }
      
      // Clean up HTML content if present in strings
      if (typeof formattedItem[key] === 'string') {
        formattedItem[key] = formattedItem[key]
          .replace(/<[^>]*>?/gm, '') // Remove HTML tags
          .replace(/&nbsp;/g, ' '); // Replace HTML entities
      }
    });
    
    return formattedItem;
  });
}
