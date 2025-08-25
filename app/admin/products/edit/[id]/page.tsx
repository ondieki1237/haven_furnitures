"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save } from "lucide-react"
import { api, type Product as BackendProduct } from "@/lib/api"
import { toast, Toaster } from "sonner"

type Product = BackendProduct

export default function EditProduct() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    inStock: false,
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const authenticated = localStorage.getItem("admin_authenticated")
    if (authenticated !== "true") {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)

    const fetchProduct = async () => {
      try {
        const id = params.id as string
        const res = await api.getProduct(id)
        if (res.success && res.data) {
          setProduct(res.data)
          setFormData({
            name: res.data.name,
            category: res.data.category,
            price: res.data.price.toString(),
            description: res.data.description || "",
            imageUrl: res.data.imageUrl || "",
            inStock: res.data.inStock ?? false,
          })
        } else {
          toast.error(res.message || "Product not found.")
          router.push("/admin/products")
        }
      } catch (e: any) {
        console.error(e)
        toast.error(e.message || "Failed to fetch product details.")
        router.push("/admin/products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [router, params.id])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) newErrors.name = "Product name is required."
    if (!formData.category.trim()) newErrors.category = "Category is required."
    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Valid price is required."
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required."
    } else if (formData.description.length < 10 || formData.description.length > 1000) {
      newErrors.description = "Description must be between 10 and 1000 characters."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error("Please fix the form errors before saving.")
      return
    }

    try {
      const id = params.id as string
      const updatedProduct = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        imageUrl: formData.imageUrl,
        inStock: formData.inStock,
      }
      const res = await api.updateProduct(id, updatedProduct)
      if (res.success) {
        toast.success(`Product "${formData.name}" updated successfully.`)
        router.push("/admin/products")
      } else {
        toast.error(res.message || "Failed to update product.")
      }
    } catch (e: any) {
      console.error(e)
      // Parse backend validation errors if available
      try {
        const errorData = JSON.parse(e.message.split(" - ")[1] || "{}")
        if (errorData.errors) {
          const validationErrors = errorData.errors.map((err: any) => err.msg).join(", ")
          toast.error(`Validation failed: ${validationErrors}`)
        } else {
          toast.error(e.message || "An error occurred while updating the product.")
        }
      } catch {
        toast.error(e.message || "An error occurred while updating the product.")
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  if (!isAuthenticated || isLoading || !product) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading product...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Toaster richColors position="top-right" />
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
              <h1 className="text-xl font-bold text-amber-900">Edit Product: {product.name}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Edit Product</CardTitle>
            <CardDescription>Update the details of this product.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className={errors.name ? "text-red-600" : ""}>
                  Product Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="category" className={errors.category ? "text-red-600" : ""}>
                  Category
                </Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Enter category (e.g., Sofa, Bed)"
                  className={errors.category ? "border-red-500" : ""}
                />
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>

              <div>
                <Label htmlFor="price" className={errors.price ? "text-red-600" : ""}>
                  Price (Ksh)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <Label htmlFor="description" className={errors.description ? "text-red-600" : ""}>
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description (10-1000 characters)"
                  rows={4}
                  className={errors.description ? "border-red-500" : ""}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <Label htmlFor="inStock">In Stock</Label>
                <div className="mt-2">
                  <Checkbox
                    id="inStock"
                    name="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, inStock: !!checked }))
                    }
                  />
                  <span className="ml-2 text-sm text-gray-600">Check if the product is in stock</span>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/products")}
                  className="hover:bg-amber-50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}