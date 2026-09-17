
export function formatCurrency(amount: number, currency = "INR"): string {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
}

export function formatDate(date: Date | string): string {
  if (typeof date === "string") {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatShortNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

export function formatDateTime(dateString: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const pad = (n: number) => n.toString().padStart(2, "0");
  let hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  return (
    `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ` +
    `${pad(hours)}:${minutes} ${ampm}`
  );
}

export function NewformatDateTime(dateString: string) {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "-";
    }
    
    const pad = (n: number) => n.toString().padStart(2, "0");
    
    // Use UTC methods to avoid timezone conversion
    const day = pad(date.getUTCDate());
    const month = pad(date.getUTCMonth() + 1);
    const year = date.getUTCFullYear();
    
    let hours = date.getUTCHours();
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
    const ampm = hours >= 12 ? "PM" : "AM";
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    const formattedHours = pad(hours);
    
    return `${day}/${month}/${year}, ${formattedHours}:${minutes}:${seconds} ${ampm} UTC`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}

// Shows exact time in a specific timezone
export function formatDateTimeInTimezone(dateString: string, timezone = 'Asia/Kolkata') {
  if (!dateString) return "-";
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "-";
    }
    
    // Use Intl.DateTimeFormat with specific timezone
    const formatter = new Intl.DateTimeFormat("en-IN", {
      timeZone: timezone,
      day: "2-digit",
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    
    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "-";
  }
}
