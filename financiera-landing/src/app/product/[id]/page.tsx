import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ClientProductDetail from '@/components/ClientProductDetail';
import products from '@/data/products';

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const product = products.find(p => p.id === params.id);
  
  if (!product) {
    return {
      title: 'Producto no encontrado | FinBank',
    };
  }
  
  return {
    title: `${product.name} | FinBank`,
    description: product.description,
  };
}

export default function ProductPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const product = products.find(p => p.id === params.id);
  
  if (!product) {
    notFound();
  }
  
  return <ClientProductDetail product={product} />;
} 