
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, ChevronDown } from "lucide-react";

interface FilterState {
  cities: string[];
  categories: string[];
  storeStatuses: string[];
  statuses: string[];
  plans: string[];
}

interface SellerFiltersProps {
  filters: FilterState;
  cities: string[];
  categories: string[];
  storeStatuses: string[];
  statuses: string[];
  plans: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterChange: (filterName: keyof FilterState, item: string) => void;
  onResetFilters: () => void;
}

export function SellerFilters({
  filters,
  cities,
  categories,
  storeStatuses,
  statuses,
  plans,
  searchQuery,
  onSearchChange,
  onFilterChange,
  onResetFilters
}: SellerFiltersProps) {
  const renderSelectedItems = (items: string[], allItems: string[], label: string) => {
    if (items.length === 0) return `All ${label}`;
    if (items.length === 1) return items[0];
    if (items.length === allItems.length) return `All ${label}`;
    return `${items.length} ${label} selected`;
  };



  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input 
            placeholder="Search sellers by name, owner, or registration number..." 
            value={searchQuery} 
            onChange={(e) => onSearchChange(e.target.value)} 
            className="pl-8" 
          />
        </div>
        <Button onClick={onResetFilters} variant="outline" className="shrink-0">
          <Filter className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="truncate">{renderSelectedItems(filters.cities, cities, "Cities")}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 h-60 overflow-y-auto">
            <DropdownMenuLabel>Filter by City</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {cities.map(city => (
              <DropdownMenuCheckboxItem
                key={city}
                checked={filters.cities.includes(city)}
                onCheckedChange={() => onFilterChange('cities', city)}
              >
                {city}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="truncate">{renderSelectedItems(filters.categories, categories, "Categories")}</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 h-60 overflow-y-auto">
            <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map(category => (
              <DropdownMenuCheckboxItem
              className=""
                key={category}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => onFilterChange('categories', category)}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="truncate">
                {renderSelectedItems(filters.storeStatuses, storeStatuses, "Stages")}
              </span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Onboarding Stage</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {storeStatuses.map(stage => (
              <DropdownMenuCheckboxItem
                key={stage}
                checked={filters.storeStatuses.includes(stage)}
                onCheckedChange={() => onFilterChange('storeStatuses', stage)}
              >
                {stage}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {Object.values(filters).some(arr => arr.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, values]) => 
            values.map(value => (
              <Badge
                key={`${key}-${value}`}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {value}
                <X
                  size={14}
                  className="cursor-pointer"
                  onClick={() => onFilterChange(key as keyof FilterState, value)}
                />
              </Badge>
            ))
          )}
        </div>
      )}
    </div>
  );
}
