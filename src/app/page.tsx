import { getFeaturedProducts } from "@/actions/products";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return <HomeClient featuredProducts={featuredProducts} />;
}
