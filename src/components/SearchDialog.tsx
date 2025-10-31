import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Product, mockProducts } from "../data/mockProducts";
import { FixedPriceListing } from "../types/product";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { productService } from "../services/productService";
import { toast } from "sonner";
import { MOCK_MODE, mockDelay } from "../lib/mockMode";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductSelect?: (product: Product) => void;
  onListingSelect?: (listing: FixedPriceListing) => void;
  onNavigateToProducts?: () => void;
  onSearchSubmit?: (query: string) => void;
}

export function SearchDialog({ 
  open, 
  onOpenChange, 
  onProductSelect,
  onListingSelect,
  onNavigateToProducts,
  onSearchSubmit
}: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        
        if (MOCK_MODE) {
          // Use mock data when backend is not available
          await mockDelay(300);
          const query = searchQuery.toLowerCase();
          const results = mockProducts.filter((product) => {
            return (
              product.name.toLowerCase().includes(query) ||
              product.category.toLowerCase().includes(query) ||
              product.description.toLowerCase().includes(query)
            );
          });
          setSearchResults(results);
        } else {
          // Use backend API
          const response = await productService.getFixedPriceListings({
            search: searchQuery.trim(),
            page_size: 10,
          });
          setSearchResults(response.results);
        }
      } catch (error) {
        console.error('Search failed:', error);
        toast.error('Search failed - using mock data');
        // Fallback to mock data on error
        const query = searchQuery.toLowerCase();
        const results = mockProducts.filter((product) => {
          return (
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
          );
        });
        setSearchResults(results);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleListingClick = (listing: FixedPriceListing) => {
    if (onListingSelect) {
      onListingSelect(listing);
      onOpenChange(false);
      setSearchQuery("");
    }
  };

  const handleViewAll = () => {
    if (onNavigateToProducts) {
      onNavigateToProducts();
      onOpenChange(false);
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() !== "" && onSearchSubmit) {
      onSearchSubmit(searchQuery);
      onOpenChange(false);
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  // Reset search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search products, categories... (Press Enter to see all results)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 outline-none text-gray-900 placeholder:text-gray-400"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Search Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {searchQuery === "" ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Start typing to search for products</p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  Try: "carpet"
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  Try: "jewelry"
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  Try: "textile"
                </span>
              </div>
            </div>
          ) : loading ? (
            <div className="p-8 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p className="mb-2">No products found for "{searchQuery}"</p>
              <p className="text-sm">Try different keywords or browse all products</p>
              <button
                onClick={handleViewAll}
                className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition-colors"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div>
              <div className="px-4 py-2 text-sm text-gray-500 border-b flex items-center justify-between">
                <span>
                  {searchResults.length} {searchResults.length === 1 ? "result" : "results"} found
                </span>
                {searchResults.length > 0 && (
                  <button
                    onClick={handleSearchSubmit}
                    className="text-emerald-700 hover:text-emerald-800 text-xs px-2 py-1 rounded hover:bg-emerald-50"
                  >
                    View all results →
                  </button>
                )}
              </div>
              <div className="divide-y">
                {searchResults.map((item) => {
                  // Handle both mock Product and backend FixedPriceListing
                  const isMockProduct = 'name' in item;
                  const id = item.id;
                  const image = isMockProduct ? item.image : item.product.images?.[0]?.image_url || '';
                  const name = isMockProduct ? item.name : item.product.name;
                  const category = isMockProduct ? item.category : item.product.category_name;
                  const price = isMockProduct ? item.price : parseFloat(item.price);
                  
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        if (isMockProduct && onProductSelect) {
                          onProductSelect(item);
                        } else if (!isMockProduct && onListingSelect) {
                          onListingSelect(item);
                        }
                        onOpenChange(false);
                        setSearchQuery("");
                      }}
                      className="w-full p-4 flex gap-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden bg-gray-100">
                        <ImageWithFallback
                          src={image}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-gray-900 truncate mb-1">
                          {name}
                        </h4>
                        <p className="text-sm text-gray-500 mb-1">
                          {category}
                        </p>
                        <p className="text-emerald-700">
                          Rs. {price.toLocaleString()}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {searchResults.length > 5 && (
                <div className="p-4 border-t bg-gray-50">
                  <button
                    onClick={handleViewAll}
                    className="w-full px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    View All Products
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
