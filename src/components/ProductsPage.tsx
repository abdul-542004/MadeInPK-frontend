import { useState, useMemo, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";
import { PromotionalBanner } from "./PromotionalBanner";
import { ProductDetailPage } from "./ProductDetailPage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination";
import { mockProducts, sortOptions, priceRanges, Product } from "../data/mockProducts";
import { X } from "lucide-react";
import { Button } from "./ui/button";

const PRODUCTS_PER_PAGE = 12;

interface ProductsPageProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export function ProductsPage({ searchQuery, onClearSearch }: ProductsPageProps = {}) {
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRegion, setSelectedRegion] = useState("All Regions");
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...mockProducts];

    // Search query filter (highest priority)
    if (searchQuery && searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        return (
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.region.toLowerCase().includes(query)
        );
      });
    }

    // Category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Region filter
    if (selectedRegion !== "All Regions") {
      filtered = filtered.filter((p) => p.region === selectedRegion);
    }

    // Price range filter
    const priceRange = priceRanges[selectedPriceRange];
    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );

    // In stock filter
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // On sale filter
    if (onSaleOnly) {
      filtered = filtered.filter((p) => p.originalPrice !== undefined);
    }

    // Sort products
    switch (sortBy) {
      case "featured":
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedRegion, selectedPriceRange, inStockOnly, onSaleOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedRegion("All Regions");
    setSelectedPriceRange(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setCurrentPage(1);
  };

  // If a product is selected, show the detail page
  if (selectedProduct) {
    return (
      <ProductDetailPage 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)}
        onProductClick={setSelectedProduct}
      />
    );
  }

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
                  ({filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'})
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
                  selectedCategory={selectedCategory}
                  onCategoryChange={(value) => {
                    setSelectedCategory(value);
                    handleFilterChange();
                  }}
                  selectedRegion={selectedRegion}
                  onRegionChange={(value) => {
                    setSelectedRegion(value);
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
                  <span className="text-gray-900">{filteredAndSortedProducts.length}</span> {filteredAndSortedProducts.length === 1 ? 'product' : 'products'} found
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
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product}
                      onProductClick={setSelectedProduct}
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
