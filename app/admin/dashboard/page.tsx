"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api" // <-- Make sure this points to your real API helpers
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Package, ShoppingCart, Users, TrendingUp, LogOut, Plus, Eye } from "lucide-react"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [productCount, setProductCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [userCount, setUserCount] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [interestsToday, setInterestsToday] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const authenticated = localStorage.getItem("admin_authenticated")
    const email = localStorage.getItem("admin_email")

    if (authenticated === "true" && email) {
      setIsAuthenticated(true)
      setAdminEmail(email)

      // Fetch real data
      api.getProducts().then(res => setProductCount(res.total || res.data.length))
      api.getOrders?.().then(res => setOrderCount(res.total || res.data.length)) // if you have orders API
      api.getUsers?.().then(res => setUserCount(res.total || res.data.length))   // if you have users API
      api.getRevenue?.().then(res => setRevenue(res.total || 0))                 // if you have revenue API
      api.getInterests().then(res => {
        const today = new Date().toISOString().slice(0, 10);
        const count = res.data.filter(
          (i: any) => i.createdAt && i.createdAt.slice(0, 10) === today
        ).length;
        setInterestsToday(count);
      });
    } else {
      router.push("/admin")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    localStorage.removeItem("admin_email")
    router.push("/admin")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-amber-900">Haven Furnitures Admin</h1>
              <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                Dashboard
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {adminEmail}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-amber-700 hover:text-amber-800"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{productCount}</p>
                </div>
                <Package className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Orders Today</p>
                  <p className="text-2xl font-bold text-gray-900">{orderCount}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{userCount}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${revenue}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Package className="w-5 h-5 mr-2 text-amber-600" />
                Product Management
              </CardTitle>
              <CardDescription>
                Manage your furniture inventory, add new products, and update existing ones.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => router.push("/admin/products")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Product
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-amber-200 text-amber-700 hover:bg-amber-50 bg-transparent"
                onClick={() => router.push("/admin/products")}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Manage Products
              </Button>
            </CardContent>
          </Card>

          {/* <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Promotions & Offers
              </CardTitle>
              <CardDescription>Create special offers, manage sales campaigns, and promotional content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                onClick={() => router.push("/admin/promotions")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start border-green-200 text-green-700 hover:bg-green-50 bg-transparent"
                onClick={() => router.push("/admin/promotions")}
              >
                <Eye className="w-4 h-4 mr-2" />
                View All Offers
              </Button>
            </CardContent>
          </Card> */}
        </div>

        {/* Interests Today Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Interests Today</p>
                  <p className="text-2xl font-bold text-gray-900">{interestsToday}</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
