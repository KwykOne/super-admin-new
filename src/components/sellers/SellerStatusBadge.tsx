
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Info, Paintbrush, Phone, Wifi } from "lucide-react";

interface SellerStatusBadgeProps {
  status: string;
}

export const SellerStatusBadge = ({ status }: SellerStatusBadgeProps) => {
  const getOnboardingStageIcon = (stage: string) => {
    switch (stage) {
      case "DETAILS":
        return <Info size={16} className="mr-1 text-red-500" />;
      case "BRANDING":
        return <Paintbrush size={16} className="mr-1 text-yellow-500" />;
      case "CONTACT":
        return <Phone size={16} className="mr-1 text-blue-500" />;
      case "ONLINE":
        return <Wifi size={16} className="mr-1 text-green-600" />;
      default:
        return null;
    }
  };

  const getBadgeBgColor = (status: string) => {
    switch (status) {
      case "DETAILS":
        return "bg-red-100 text-red-700";
      case "BRANDING":
        return "bg-yellow-100 text-yellow-700";
      case "CONTACT":
        return "bg-blue-100 text-blue-600";
      case "ONLINE":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Badge
      variant="secondary"
      className={`flex items-center justify-center ${
        getBadgeBgColor(status)
      }`}
    >
      {getOnboardingStageIcon(status)}
      {status}
    </Badge>
  );
};
