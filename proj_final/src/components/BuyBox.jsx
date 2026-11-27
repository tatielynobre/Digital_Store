import starIcon from '../assets/star-icon.svg'
import { formatCurrency } from '../utils/formatCurrency.js'

export default function BuyBox({
  name,
  reference,
  stars,
  rating,
  price,
  priceDiscount,
  description,
  children,
}) {
  return (
    <section className="buy-box">
      <h1>{name}</h1>
      <p className="buy-box__reference">Casual | {reference}</p>
      <div className="buy-box__rating">
        <span className="buy-box__stars">
          {stars} <img src={starIcon} alt="" />
        </span>
        <span>{rating} avaliações</span>
      </div>
      <div className="buy-box__prices">
        {priceDiscount !== undefined && (
          <span className="buy-box__price buy-box__price--original">
            {formatCurrency(price)}
          </span>
        )}
        <span className="buy-box__price">
          {formatCurrency(priceDiscount ?? price)}
        </span>
      </div>
      <p className="buy-box__description">{description}</p>
      {children}
      <button className="buy-box__buy-button" type="button">
        Comprar
      </button>
    </section>
  )
}
