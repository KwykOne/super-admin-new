
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { Search, Download } from "lucide-react";

interface PartnersFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
  typeOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  filteredCount: number;
  totalCount: number;
}

export function PartnersFilters({
  searchQuery,
  setSearchQuery,
  selectedTypes,
  setSelectedTypes,
  selectedStatuses,
  setSelectedStatuses,
  typeOptions,
  statusOptions,
  filteredCount,
  totalCount
}: PartnersFiltersProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by partner name or contact person..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-1/4">
              <MultiSelectFilter
                options={typeOptions}
                selected={selectedTypes}
                onChange={setSelectedTypes}
                placeholder="Filter by Partner Type"
              />
            </div>
            <div className="w-full md:w-1/4">
              <MultiSelectFilter
                options={statusOptions}
                selected={selectedStatuses}
                onChange={setSelectedStatuses}
                placeholder="Filter by Status"
              />
            </div>
          </div>
          
          {/* Export Button */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {filteredCount} of {totalCount} partners
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
