import { getBackendUrl } from "@/lib/getBackendUrl";

export async function getProducts() {
  const res = await fetch(`${getBackendUrl()}/api/products`);
  // ...rest of your code
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  inStock?: boolean;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Interest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  productName: string;
  productId: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Helper to get auth token from localStorage (adjust based on your auth mechanism)
function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

// Helper to validate product data
const validateProductData = (product: Partial<Product>): string[] => {
  const errors: string[] = [];
  if (!product.name?.trim()) errors.push("Product name is required.");
  if (!product.category?.trim()) errors.push("Category is required.");
  if (typeof product.price !== "number" || product.price <= 0) errors.push("Valid price is required.");
  return errors;
};

export const api = {
  // Get all products with optional filtering
  async getProducts(params?: {
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<PaginatedApiResponse<Product[]>> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set("category", params.category);
      if (params?.search) searchParams.set("search", params.search);
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      if (params?.page) searchParams.set("page", params.page.toString());

      const response = await fetch(`${getBackendUrl()}/api/products?${searchParams}`, {
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error: any) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  },

  // Get single product
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    try {
      if (!id) throw new Error("Product ID is required.");

      const response = await fetch(`${getBackendUrl()}/api/products/${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
        },
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Product not found.");
        const errorText = await response.text();
        throw new Error(`Failed to fetch product: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error: any) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  },

  // Create product
  async createProduct(
    product: Omit<Product, "_id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Product>> {
    try {
      const errors = validateProductData(product);
      if (errors.length > 0) throw new Error(`Invalid product data: ${errors.join(", ")}`);

      const response = await fetch(`${getBackendUrl()}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create product: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error: any) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  },

  // Update product
  async updateProduct(id: string, product: Partial<Product>): Promise<ApiResponse<Product>> {
    try {
      if (!id) throw new Error("Product ID is required.");
      const errors = validateProductData(product);
      if (errors.length > 0) throw new Error(`Invalid product data: ${errors.join(", ")}`);

      const response = await fetch(`${getBackendUrl()}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Product not found.");
        const errorText = await response.text();
        throw new Error(`Failed to update product: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error: any) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    try {
      if (!id) throw new Error("Product ID is required.");

      const response = await fetch(`${getBackendUrl()}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
        },
      });

      if (!response.ok) {
        if (response.status === 404) throw new Error("Product not found.");
        const errorText = await response.text();
        throw new Error(`Failed to delete product: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error: any) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  },

  // Search products
  async searchProducts(query: string, limit = 10): Promise<PaginatedApiResponse<Product[]>> {
    try {
      return await this.getProducts({ search: query, limit });
    } catch (error: any) {
      throw new Error(`Error searching products: ${error.message}`);
    }
  },

  // Submit customer interest
  async submitInterest(interest: {
    name: string;
    email: string;
    phone: string;
    productId: string;
    message?: string;
  }): Promise<ApiResponse<Interest>> {
    try {
      if (!interest.name?.trim()) throw new Error("Name is required.");
      if (!interest.email?.trim()) throw new Error("Email is required.");
      if (!interest.phone?.trim()) throw new Error("Phone is required.");
      if (!interest.productId) throw new Error("Product ID is required.");

      const response = await fetch(`${getBackendUrl()}/api/interests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(interest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit interest: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error: any) {
      throw new Error(`Error submitting interest: ${error.message}`);
    }
  },

  // Get all interests (admin)
  async getInterests(params?: {
    limit?: number;
    page?: number;
  }): Promise<PaginatedApiResponse<Interest[]>> {
    try {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      if (params?.page) searchParams.set("page", params.page.toString());

      const response = await fetch(`${getBackendUrl()}/api/interests?${searchParams}`, {
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch interests: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error: any) {
      throw new Error(`Error fetching interests: ${error.message}`);
    }
  },

  // Delete image via backend
  async deleteImage(publicId: string): Promise<ApiResponse<void>> {
    try {
      if (!publicId) throw new Error("Image public ID is required.");

      const response = await fetch(`${getBackendUrl()}/api/upload/image`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
        },
        body: JSON.stringify({ public_id: publicId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete image: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    } catch (error: any) {
      throw new Error(`Error deleting image: ${error.message}`);
    }
  },
};