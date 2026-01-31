import { Suspense } from "react";
import { getProducts } from "@/actions/products";
import ProductsClient from "./ProductsClient";
import { ProductCardSkeleton } from "@/components/products/product-card";

interface ProductsPageProps {
    searchParams: {
        type?: string;
        count?: string;
        search?: string;
    };
}

async function ProductsList({ searchParams }: ProductsPageProps) {
    const products = await getProducts({
        type: searchParams.type,
        count: searchParams.count,
        search: searchParams.search,
    });

    return <ProductsClient products={products} />;
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
    return (
        <Suspense fallback={
            <div className="min-h-screen pt-32">
                <div className="container">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <ProductsList searchParams={searchParams} />
        </Suspense>
    );
}
