import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleSwitch } from "./toggle-switch";
import type { SearchParams } from "@/types";

const SENIORITY_LEVELS = ["Junior", "Mid", "Senior", "Lead", "Executive"];

interface FeedFiltersProps {
  filters: SearchParams;
  onChange: (filters: SearchParams) => void;
}

export function FeedFilters({ filters, onChange }: FeedFiltersProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#353535]/60 dark:text-[#d9d9d9]/60">
          Filters
        </h3>
        <ToggleSwitch
          label="Remote only"
          checked={filters.remote ?? false}
          onChange={(remote) =>
            onChange({ ...filters, remote: remote ? true : undefined })
          }
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Seniority</Label>
        {SENIORITY_LEVELS.map((level) => {
          const value = level.toLowerCase();
          const checked = filters.seniority?.includes(value) ?? false;
          return (
            <label
              key={level}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  const next = e.target.checked
                    ? [...(filters.seniority || []), value]
                    : (filters.seniority || []).filter((s) => s !== value);
                  onChange({ ...filters, seniority: next });
                }}
                className="h-4 w-4 cursor-pointer accent-[#3c6e71]"
              />
              <span className="text-sm text-[#353535] dark:text-[#d9d9d9]">
                {level}
              </span>
            </label>
          );
        })}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Location</Label>
        <Input
          placeholder="City, country, or remote"
          value={filters.location || ""}
          onChange={(e) =>
            onChange({
              ...filters,
              location: e.target.value || undefined,
            })
          }
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Salary Range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.salaryMin || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                salaryMin: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <span className="text-[#353535]/40 dark:text-[#d9d9d9]/40">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.salaryMax || ""}
            onChange={(e) =>
              onChange({
                ...filters,
                salaryMax: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>

      <Button
        variant="ghost"
        className="w-full text-[#3c6e71] hover:bg-[#3c6e71]/10 hover:text-[#284b63]"
        onClick={() =>
          onChange({
            q: filters.q,
            page: 1,
            limit: filters.limit,
          })
        }
      >
        Clear all filters
      </Button>
    </div>
  );
}
