import { getProductById } from "@/actions/products";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    // 2. Await the params to extract the ID
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return <ProductDetailClient product={product} />;
}
