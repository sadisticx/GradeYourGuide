import React, { useState } from "react";
import { Search, Filter, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";

interface FilterPanelProps {
  onFilterChange?: (filters: FilterState) => void;
  className?: string;
}

interface FilterState {
  section: string;
  course: string;
  faculty: string;
  searchTerm: string;
  dateRange:
    | {
        from?: Date;
        to?: Date;
      }
    | undefined;
}

const FilterPanel = ({
  onFilterChange,
  className = "",
}: FilterPanelProps = {}) => {
  const [filters, setFilters] = useState<FilterState>({
    section: "all-sections",
    course: "all-courses",
    faculty: "all-faculty",
    searchTerm: "",
    dateRange: undefined,
  });

  // Mock data for dropdowns
  const sections = [
    { value: "section-a", label: "Section A" },
    { value: "section-b", label: "Section B" },
    { value: "section-c", label: "Section C" },
  ];

  const courses = [
    { value: "cs101", label: "CS 101: Introduction to Programming" },
    { value: "cs201", label: "CS 201: Data Structures" },
    { value: "math101", label: "MATH 101: Calculus I" },
  ];

  const faculties = [
    { value: "prof-smith", label: "Prof. Smith" },
    { value: "prof-johnson", label: "Prof. Johnson" },
    { value: "prof-williams", label: "Prof. Williams" },
  ];

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      section: "all-sections",
      course: "all-courses",
      faculty: "all-faculty",
      searchTerm: "",
      dateRange: undefined,
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-end md:space-x-4">
        <div className="space-y-2 w-full md:w-1/5">
          <Label htmlFor="section">Section</Label>
          <Select
            value={filters.section}
            onValueChange={(value) => handleFilterChange("section", value)}
          >
            <SelectTrigger id="section">
              <SelectValue placeholder="All Sections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-sections">All Sections</SelectItem>
              {sections.map((section) => (
                <SelectItem key={section.value} value={section.value}>
                  {section.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full md:w-1/5">
          <Label htmlFor="course">Course</Label>
          <Select
            value={filters.course}
            onValueChange={(value) => handleFilterChange("course", value)}
          >
            <SelectTrigger id="course">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-courses">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.value} value={course.value}>
                  {course.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full md:w-1/5">
          <Label htmlFor="faculty">Faculty</Label>
          <Select
            value={filters.faculty}
            onValueChange={(value) => handleFilterChange("faculty", value)}
          >
            <SelectTrigger id="faculty">
              <SelectValue placeholder="All Faculty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-faculty">All Faculty</SelectItem>
              {faculties.map((faculty) => (
                <SelectItem key={faculty.value} value={faculty.value}>
                  {faculty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full md:w-1/5">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search evaluations..."
              className="pl-8"
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            />
          </div>
        </div>

        <div className="flex space-x-2 w-full md:w-auto">
          <Button variant="outline" size="icon" onClick={handleReset}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </div>

      <div className="mt-4">
        <Label>Date Range</Label>
        <div className="mt-2">
          <DatePickerWithRange />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
