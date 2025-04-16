import Hero from '@/components/Hero';
import ProductList from '@/components/ProductList';
import products from '@/data/products';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductList products={products} />
    </>
  );
}
