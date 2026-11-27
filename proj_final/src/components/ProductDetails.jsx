export default function ProductDetails({ brand, category }) {
  return (
    <section className="product-details">
      <h2>Detalhes do produto</h2>
      <dl>
        <div>
          <dt>Categoria</dt>
          <dd>{category}</dd>
        </div>
        <div>
          <dt>Marca</dt>
          <dd>{brand}</dd>
        </div>
      </dl>
    </section>
  )
}
