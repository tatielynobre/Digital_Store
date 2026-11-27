import { Link } from 'react-router-dom'
import { formatCurrency } from '../utils/formatCurrency.js'

export default function ProductCard({
  id,
  image,
  name,
  price,
  priceDiscount,
}) {
  return (
    <article className="product-card">
      <Link className="product-card__link" to={`/product/${id}`}>
        <img className="product-card__image" src={image} alt={name} />
        <p className="product-card__name">{name}</p>
        <div className="product-card__prices">
          {priceDiscount !== undefined ? (
            <>
              <span className="product-card__price product-card__price--original">
                {formatCurrency(price)}
              </span>
              <span className="product-card__price">
                {formatCurrency(priceDiscount)}
              </span>
            </>
          ) : (
            <span className="product-card__price">{formatCurrency(price)}</span>
          )}
        </div>
      </Link>
    </article>
  )
}
