"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, ArrowLeft, Package, ImageIcon } from "lucide-react"
import { api, type Product as BackendProduct } from "@/lib/api"
import { toast, Toaster } from "sonner"

type Product = BackendProduct

export default function ProductsManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const authenticated = localStorage.getItem("admin_authenticated")
    if (authenticated !== "true") {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)

    ;(async () => {
      try {
        const res = await api.getProducts()
        if (res.success && res.data) setProducts(res.data)
      } catch (e) {
        console.error(e)
        toast.error("Failed to fetch products. Please try again.")
      } finally {
        setIsLoading(false)
      }
    })()
  }, [router])

  const deleteProduct = async (id: string, name: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)
    if (!confirmed) return

    try {
      const res = await api.deleteProduct(id)
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id))
        toast.success(`Product "${name}" deleted successfully.`)
      } else {
        toast.error("Failed to delete product. Please try again.")
      }
    } catch (e) {
      console.error(e)
      toast.error("An error occurred while deleting the product.")
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Toaster richColors position="top-right" />
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/dashboard")}
                className="text-amber-700 hover:text-amber-800 hover:bg-amber-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-amber-900">Product Management</h1>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                {products.length} Products
              </Badge>
            </div>

            <Button
              onClick={() => router.push("/admin/products/add")}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-6 bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        {products.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-6">Get started by adding your first product or promotional offer.</p>
              <Button
                onClick={() => router.push("/admin/products/add")}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Package className="w-5 h-5 mr-2 text-amber-600" />
                Products & Offers
              </CardTitle>
              <CardDescription>Manage your furniture products, promotional offers, and special deals.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow key={product._id} className="hover:bg-amber-50">
                        <TableCell>
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-amber-200 text-amber-700">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">Ksh{product.price}</TableCell>
                        <TableCell className="max-w-xs truncate text-gray-600">{product.description}</TableCell>
                        <TableCell className="text-gray-500">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/admin/products/edit/${product._id}`)}
                            className="hover:bg-primary/10"
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteProduct(product._id, product.name)}
                            className="hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredProducts.length === 0 && searchTerm && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No products found matching "{searchTerm}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}