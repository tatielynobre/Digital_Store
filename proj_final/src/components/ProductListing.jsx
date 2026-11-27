import ProductCard from './ProductCard.jsx'

export default function ProductListing({ products }) {
  if (products.length === 0) {
    return <p className="product-listing__empty">Nenhum produto encontrado.</p>
  }

  return (
    <div className="product-listing">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  )
}
