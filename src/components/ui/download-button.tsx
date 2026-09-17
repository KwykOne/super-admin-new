
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadTableAsCSV, formatTableDataForDownload } from "@/utils/dataUtils";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  data: any[];
  filename: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  customDownload?:()=>void
}

export function DownloadButton({ 
  data, 
  filename, 
  className,
 customDownload,
  variant = "outline" 
}: DownloadButtonProps) {
  const handleDownload = () => {
   
    const formattedData = formatTableDataForDownload(data);
    downloadTableAsCSV(formattedData, filename);
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={customDownload ? customDownload : handleDownload}
      className={cn("gap-1", className)}
      disabled={!data || data.length === 0}
    >
      <Download className="h-4 w-4" />
      <span>Download</span>
    </Button>
  );
}
