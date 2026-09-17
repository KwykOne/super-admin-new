
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MultiSelectFilter } from "@/components/MultiSelectFilter";
import { Search, Download } from "lucide-react";

interface ReferralsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
  categoryOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
  filteredCount: number;
  totalCount: number;
  categoryLabel?: string;
  searchPlaceholder?: string;
}

export function ReferralsFilters({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedStatuses,
  setSelectedStatuses,
  categoryOptions,
  statusOptions,
  filteredCount,
  totalCount,
  categoryLabel = "Filter by Category",
  searchPlaceholder = "Search by name..."
}: ReferralsFiltersProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            {categoryOptions.length > 0 && (
              <div className="w-full md:w-1/4">
                <MultiSelectFilter
                  options={categoryOptions}
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                  placeholder={categoryLabel}
                />
              </div>
            )}
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
              Showing {filteredCount} referrers
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
