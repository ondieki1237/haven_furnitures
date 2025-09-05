import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Fetch the product by ID
  const res = await api.getProductById(params.id);
  if (!res.success || !res.data) return <div>Product not found.</div>;
  const product = res.data;

  // Fetch other products in the same category (excluding the current one)
  const allRes = await api.getProducts();
  const related = allRes.success && allRes.data
    ? allRes.data.filter((p: any) => p.category === product.category && p._id !== product._id)
    : [];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        <Image src={product.imageUrl || "/placeholder.svg"} alt={product.name} width={400} height={400} className="rounded-lg" />
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="mb-4">{product.description}</p>
          <div className="text-lg font-semibold mb-2">Ksh {product.price}</div>
          <div className="mb-2">Category: {product.category}</div>
          {/* Add to cart or interest form here if needed */}
        </div>
      </div>
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Other products in {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {related.map((p: any) => (
              <Link key={p._id} href={`/product/${p._id}`}>
                <div className="border rounded-lg p-4 hover:shadow-lg transition">
                  <Image src={p.imageUrl || "/placeholder.svg"} alt={p.name} width={200} height={200} className="rounded mb-2" />
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-muted-foreground">Ksh {p.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}