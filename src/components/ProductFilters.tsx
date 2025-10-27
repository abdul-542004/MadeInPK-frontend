import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { categories, regions, priceRanges } from "../data/mockProducts";

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  selectedPriceRange: number;
  onPriceRangeChange: (index: number) => void;
  inStockOnly: boolean;
  onInStockChange: (checked: boolean) => void;
  onSaleOnly: boolean;
  onOnSaleChange: (checked: boolean) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  selectedCategory,
  onCategoryChange,
  selectedRegion,
  onRegionChange,
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
        <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <RadioGroupItem value={category} id={`category-${category}`} />
              <Label
                htmlFor={`category-${category}`}
                className="cursor-pointer text-gray-600 hover:text-emerald-700"
              >
                {category}
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
        <h4 className="text-emerald-700">Region</h4>
        <RadioGroup value={selectedRegion} onValueChange={onRegionChange}>
          {regions.map((region) => (
            <div key={region} className="flex items-center space-x-2">
              <RadioGroupItem value={region} id={`region-${region}`} />
              <Label
                htmlFor={`region-${region}`}
                className="cursor-pointer text-gray-600 hover:text-emerald-700"
              >
                {region}
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