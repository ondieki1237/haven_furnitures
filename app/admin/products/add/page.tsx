"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Package } from "lucide-react";
import { api } from "@/lib/api";

export default function AddProduct() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    const authenticated = localStorage.getItem("admin_authenticated");
    if (authenticated !== "true") {
      router.push("/admin");
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setError("");
      setSuccess(false);
    }
  };

const uploadToCloudinary = async (file: File) => {
  try {
    console.log("Starting Cloudinary upload for file:", file.name, file.type, file.size);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "haven_furniture"); // Use the correct preset
    formData.append("folder", "haven"); // Match the asset folder
    formData.append("resource_type", "image"); // Explicitly set resource type
    console.log("Cloudinary upload config:", { cloudName: "diaceq8bv", uploadPreset: "haven_furniture", folder: "haven" });

    const response = await fetch(`https://api.cloudinary.com/v1_1/diaceq8bv/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary error response:", errorData);
      throw new Error(`Image upload failed: ${errorData.error?.message || "Unknown error"}`);
    }

    const data = await response.json();
    console.log("Cloudinary upload success:", data);
    return data.secure_url as string;
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!formData.name || !formData.price || !formData.description || !formData.category || !imageFile) {
      setError("Please fill in all required fields, including an image.");
      setIsLoading(false);
      return;
    }

    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      setError("Please enter a valid price.");
      setIsLoading(false);
      return;
    }

    try {
      // 1️⃣ Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(imageFile);

      // 2️⃣ Save product in backend with Cloudinary URL
      const productPayload = {
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        category: formData.category,
        imageUrl, // from Cloudinary
      };
      console.log("Submitting product:", productPayload);

      const response = await api.createProduct(productPayload);

      if (!response.success) {
        throw new Error(response.message || "Failed to create product");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to save product. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/products")}
                className="text-amber-700 hover:text-amber-800 hover:bg-amber-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
              <h1 className="text-xl font-bold text-amber-900">Add New Product</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900">
              <Package className="w-5 h-5 mr-2 text-amber-600" />
              Product Information
            </CardTitle>
            <CardDescription>
              Add a new furniture product, promotional offer, or special deal to your website.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <AlertDescription className="text-green-700">
                    Product added successfully! Redirecting to products page...
                  </AlertDescription>
                </Alert>
              )}

              {/* Product Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Product Image *</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Product Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Modern Oak Dining Table, December Sale - 50% Off"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category *
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-amber-500 focus:ring-amber-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sofa sets">Sofa Sets</SelectItem>
                    <SelectItem value="coffee tables">Coffee Tables</SelectItem>
                    <SelectItem value="stools">Stools</SelectItem>
                    <SelectItem value="consoles">Consoles</SelectItem>
                    <SelectItem value="dressing mirror">Dressing Mirror</SelectItem>
                    <SelectItem value="dinning sets">Dinning Sets</SelectItem>
                    <SelectItem value="beds">Beds</SelectItem>
                    <SelectItem value="tv stands">TV Stands</SelectItem>
                    <SelectItem value="shoe racks">Shoe Racks</SelectItem>
                    <SelectItem value="wall drobes">Wall Drobes</SelectItem>
                    <SelectItem value="kids beds">Kids Beds</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                  Price (Ksh) *
                </Label>
                <div className="relative">
                  {/* <span className="absolute left-3 top-3 text-gray-500">Ksh</span> */}
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="pl-8 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the product, its features, materials, or promotional details..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[100px] border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/products")}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-amber-600 hover:bg-amber-700 text-white">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Product
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
