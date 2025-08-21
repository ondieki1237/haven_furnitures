const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

export interface ApiResponse<T> {
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

export const api = {
  // Get all products with optional filtering
  async getProducts(params?: {
    category?: string;
    search?: string;
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set("category", params.category);
    if (params?.search) searchParams.set("search", params.search);
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.page) searchParams.set("page", params.page.toString());

    const response = await fetch(`${API_BASE_URL}/products?${searchParams}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
    return response.json();
  },

  // Get single product
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Failed to fetch product: ${response.statusText}`);
    return response.json();
  },

  // Create product (expects imageUrl directly)
  async createProduct(
    product: Omit<Product, "_id" | "createdAt" | "updatedAt">
  ): Promise<ApiResponse<Product>> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error(`Failed to create product: ${response.statusText}`);
    return response.json();
  },

  // Update product (expects imageUrl directly)
  async updateProduct(
    id: string,
    product: Partial<Product>
  ): Promise<ApiResponse<Product>> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error(`Failed to update product: ${response.statusText}`);
    return response.json();
  },

  // Delete product
  async deleteProduct(id: string): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Failed to delete product: ${response.statusText}`);
    return response.json();
  },

  // Search products
  async searchProducts(query: string, limit = 10): Promise<ApiResponse<Product[]>> {
    return this.getProducts({ search: query, limit });
  },

  // Submit customer interest
  async submitInterest(interest: {
    name: string;
    email: string;
    phone: string;
    productId: string;
    message?: string;
  }): Promise<ApiResponse<Interest>> {
    const response = await fetch(`${API_BASE_URL}/interests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(interest),
    });
    if (!response.ok) throw new Error(`Failed to submit interest: ${response.statusText}`);
    return response.json();
  },

  // Get all interests (admin)
  async getInterests(params?: {
    limit?: number;
    page?: number;
  }): Promise<ApiResponse<Interest[]>> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.page) searchParams.set("page", params.page.toString());

    const response = await fetch(`${API_BASE_URL}/interests?${searchParams}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`Failed to fetch interests: ${response.statusText}`);
    return response.json();
  },

  // (Optional) delete image via backend
  async deleteImage(publicId: string): Promise<{ success: boolean; message?: string }> {
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ public_id: publicId }),
    });
    if (!response.ok) throw new Error(`Failed to delete image: ${response.statusText}`);
    return response.json();
  },
};
