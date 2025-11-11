import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { priceRanges } from "../data/mockProducts";
import type { Category } from "../types/product";
import type { Province } from "../services/addressService";

interface ProductFiltersProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
  provinces: Province[];
  selectedProvinceId: number | null;
  onProvinceChange: (provinceId: number | null) => void;
  selectedPriceRange: number;
  onPriceRangeChange: (index: number) => void;
  inStockOnly: boolean;
  onInStockChange: (checked: boolean) => void;
  onSaleOnly: boolean;
  onOnSaleChange: (checked: boolean) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  categories,
  selectedCategoryId,
  onCategoryChange,
  provinces,
  selectedProvinceId,
  onProvinceChange,
  selectedPriceRange,
  onPriceRangeChange,
  inStockOnly,
  onInStockChange,
  onSaleOnly,
  onOnSaleChange,
  onClearFilters
}: ProductFiltersProps) {
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-emerald-700">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
        >
          <X className="h-4 w-4 mr-1" />
          Clear All
        </Button>
      </div>

      <Separator />

      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-emerald-700">Category</h4>
        <RadioGroup
          value={selectedCategoryId !== null ? selectedCategoryId.toString() : "all"}
          onValueChange={(value) => {
            if (value === "all") {
              onCategoryChange(null);
            } else {
              onCategoryChange(Number(value));
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="category-all" />
            <Label htmlFor="category-all" className="cursor-pointer text-gray-600 hover:text-emerald-700">
              All Categories
            </Label>
          </div>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <RadioGroupItem value={category.id.toString()} id={`category-${category.id}`} />
              <Label
                htmlFor={`category-${category.id}`}
                className="cursor-pointer text-gray-600 hover:text-emerald-700"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Price Range Filter */}
      <div className="space-y-3">
        <h4 className="text-emerald-700">Price Range</h4>
        <RadioGroup
          value={selectedPriceRange.toString()}
          onValueChange={(value) => onPriceRangeChange(parseInt(value))}
        >
          {priceRanges.map((range, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`price-${index}`} />
              <Label
                htmlFor={`price-${index}`}
                className="cursor-pointer text-gray-600 hover:text-emerald-700"
              >
                {range.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Region Filter */}
      <div className="space-y-3">
        <h4 className="text-emerald-700">Province</h4>
        <RadioGroup
          value={selectedProvinceId !== null ? selectedProvinceId.toString() : "all"}
          onValueChange={(value) => {
            if (value === "all") {
              onProvinceChange(null);
            } else {
              onProvinceChange(Number(value));
            }
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="province-all" />
            <Label htmlFor="province-all" className="cursor-pointer text-gray-600 hover:text-emerald-700">
              All Provinces
            </Label>
          </div>
          {provinces.map((province) => (
            <div key={province.id} className="flex items-center space-x-2">
              <RadioGroupItem value={province.id.toString()} id={`province-${province.id}`} />
              <Label
                htmlFor={`province-${province.id}`}
                className="cursor-pointer text-gray-600 hover:text-emerald-700"
              >
                {province.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      {/* Availability & Special Filters */}
      <div className="space-y-3">
        <h4 className="text-emerald-700">Availability</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => onInStockChange(checked as boolean)}
            />
            <Label htmlFor="in-stock" className="cursor-pointer text-gray-600 hover:text-emerald-700">
              In Stock Only
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-sale"
              checked={onSaleOnly}
              onCheckedChange={(checked) => onOnSaleChange(checked as boolean)}
            />
            <Label htmlFor="on-sale" className="cursor-pointer text-gray-600 hover:text-emerald-700">
              On Sale
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full sm:w-auto border-emerald-700 text-emerald-700 hover:bg-emerald-50"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
        </SheetHeader>
        <div className="mt-6 px-2">
          <FilterContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}