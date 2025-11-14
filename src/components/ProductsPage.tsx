import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";
import { PromotionalBanner } from "./PromotionalBanner";
import { ProductDetailPage } from "./ProductDetailPage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { X, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { productService } from "../services/productService";
import { addressService } from "../services/addressService";
import type { FixedPriceListing, Category } from "../types/product";
import type { Province } from "../services/addressService";
import { toast } from "sonner";
import { priceRanges, sortOptions } from "../data/mockProducts";

const PRODUCTS_PER_PAGE = 12;

// Category name to ID mapping (based on backend categories)
const categoryMapping: Record<string, number> = {
  "Textiles": 1,
  "Carpets": 2,
  "Jewelry": 3,
  "Metalwork": 4,
  "Pottery": 5,
  "Accessories": 6,
  "Basketry": 7,
  "Woodwork": 8,
  "Stonework": 9,
  "Art": 10,
  "Footwear": 11
};

const getCategoryId = (categoryName: string): number | null => {
  return categoryMapping[categoryName] || null;
};

interface ProductsPageProps {
  searchQuery?: string;
  onClearSearch?: () => void;
  categoryId?: number | null;
  onCategoryChange?: (categoryId: number | null) => void;
  onListingClick?: (listing: FixedPriceListing) => void;
}

export function ProductsPage(props: ProductsPageProps = {}) {
  const {
    searchQuery,
    onClearSearch,
    categoryId = null,
    onCategoryChange,
    onListingClick,
  } = props;
  // Data states
  const [listings, setListings] = useState<FixedPriceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  // Filter states
  const [categories, setCategories] = useState<Category[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(categoryId);
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  // Load selectable filters from backend
  useEffect(() => {
    const loadFilterMetadata = async () => {
      try {
        const [categoryData, provinceData] = await Promise.all([
          productService.getCategories(),
          addressService.getProvinces(),
        ]);
        setCategories(categoryData);
        setProvinces(provinceData);
      } catch (error) {
        console.error("Failed to load filter metadata:", error);
        toast.error("Failed to load filters");
      }
    };

    void loadFilterMetadata();
  }, []);

  // Sync external category changes (e.g., from homepage)
  useEffect(() => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  }, [categoryId]);

  // Load listings from backend
  useEffect(() => {
    loadListings();
  }, [searchQuery, selectedCategoryId, selectedProvinceId, selectedPriceRange, inStockOnly, onSaleOnly, sortBy, currentPage]);

  const loadListings = async () => {
    try {
      setLoading(true);
      
      // Build filters
      const filters: any = {
        status: 'active',
        page: currentPage,
        page_size: PRODUCTS_PER_PAGE,
      };

      // Search
      if (searchQuery && searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      if (selectedCategoryId !== null) {
        filters.category = selectedCategoryId;
      }

      if (selectedProvinceId !== null) {
        filters.province = selectedProvinceId;
      }

      // Price range
      const priceRange = priceRanges[selectedPriceRange];
      if (priceRange.min > 0) {
        filters.min_price = priceRange.min;
      }
      if (priceRange.max < 999999) {
        filters.max_price = priceRange.max;
      }

      if (onSaleOnly) {
        filters.has_active_discount = 'true';
      }

      // Sorting
      switch (sortBy) {
        case "featured":
          filters.ordering = "-created_at";
          break;
        case "price-asc":
          filters.ordering = "price";
          break;
        case "price-desc":
          filters.ordering = "-price";
          break;
        case "newest":
          filters.ordering = "-created_at";
          break;
        default:
          filters.ordering = "-created_at";
      }

      const response = await productService.getFixedPriceListings(filters);

      let results = response.results;

      if (inStockOnly) {
        results = results.filter((listing) => listing.quantity > 0);
      }

      if (onSaleOnly) {
        results = results.filter((listing) => listing.has_active_discount);
      }

      const orderedResults = sortBy === "featured"
        ? [...results].sort((a, b) => {
            if (a.featured === b.featured) {
              return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return a.featured ? -1 : 1;
          })
        : results;

      setListings(orderedResults);
      setTotalCount(orderedResults.length);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategoryId(null);
    onCategoryChange?.(null);
    setSelectedProvinceId(null);
    setSelectedPriceRange(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-emerald-700">Products</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-emerald-700 mb-2">Handcrafted Pakistani Products</h1>
          <p className="text-gray-600">
            Discover authentic handmade treasures from skilled artisans across Pakistan
          </p>
        </div>
      </div>

      {/* Search Query Banner */}
      {searchQuery && searchQuery.trim() !== "" && (
        <div className="bg-emerald-50 border-b border-emerald-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-700">
                  Search results for:{" "}
                  <span className="text-emerald-700">"{searchQuery}"</span>
                </span>
                <span className="text-gray-500 text-sm">
                  ({totalCount} {totalCount === 1 ? 'product' : 'products'})
                </span>
              </div>
              {onClearSearch && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSearch}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear search
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Promotional Banner */}
      <div className="py-8">
        <PromotionalBanner />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Filter Button */}
                <ProductFilters
                  categories={categories}
                  selectedCategoryId={selectedCategoryId}
                  onCategoryChange={(value) => {
                    setSelectedCategoryId(value);
                    onCategoryChange?.(value);
                    handleFilterChange();
                  }}
                  provinces={provinces}
                  selectedProvinceId={selectedProvinceId}
                  onProvinceChange={(value) => {
                    setSelectedProvinceId(value);
                    handleFilterChange();
                  }}
                  selectedPriceRange={selectedPriceRange}
                  onPriceRangeChange={(value) => {
                    setSelectedPriceRange(value);
                    handleFilterChange();
                  }}
                  inStockOnly={inStockOnly}
                  onInStockChange={(value) => {
                    setInStockOnly(value);
                    handleFilterChange();
                  }}
                  onSaleOnly={onSaleOnly}
                  onOnSaleChange={(value) => {
                    setOnSaleOnly(value);
                    handleFilterChange();
                  }}
                  onClearFilters={clearFilters}
                />
                <p className="text-emerald-700">
                  <span className="text-gray-900">{totalCount}</span> {totalCount === 1 ? 'product' : 'products'} found
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-gray-700 hidden sm:inline">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
                <span className="ml-3 text-gray-600">Loading products...</span>
              </div>
            ) : listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                  {listings.map((listing) => (
                    <ProductCard 
                      key={listing.id} 
                      listing={listing}
                      onListingClick={onListingClick}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                {searchQuery && searchQuery.trim() !== "" ? (
                  <>
                    <p className="text-gray-600 mb-2">
                      No products found for "{searchQuery}"
                    </p>
                    <p className="text-gray-500 text-sm mb-4">
                      Try different keywords or browse all products
                    </p>
                    {onClearSearch && (
                      <Button
                        onClick={onClearSearch}
                        variant="outline"
                        className="mr-2"
                      >
                        Clear search
                      </Button>
                    )}
                    <button
                      onClick={clearFilters}
                      className="text-emerald-700 hover:text-emerald-800"
                    >
                      Clear all filters
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
                    <button
                      onClick={clearFilters}
                      className="text-emerald-700 hover:text-emerald-800"
                    >
                      Clear all filters
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
