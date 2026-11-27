import { Link, useParams } from 'react-router-dom'
import BuyBox from '../components/BuyBox.jsx'
import Gallery from '../components/Gallery.jsx'
import ProductDetails from '../components/ProductDetails.jsx'
import ProductListing from '../components/ProductListing.jsx'
import ProductOptions from '../components/ProductOptions.jsx'
import Section from '../components/Section.jsx'
import products from '../data/products.js'

export default function ProductViewPage() {
  const { id } = useParams()
  const product = products.find((item) => item.id === id)

  if (!product) {
    return (
      <div className="page-container not-found">
        <h1>Produto não encontrado</h1>
        <Link to="/produtos">Voltar para produtos</Link>
      </div>
    )
  }

  const imageOffset = (Number(id) - 1) % 5
  const images = Array.from({ length: 5 }, (_, index) => ({
    src: `/produc-image-${((imageOffset + index) % 5) + 1}.jpeg`,
    alt: `${product.name} - imagem ${index + 1}`,
  }))

  return (
    <div className="page-container product-view-page">
      <p className="breadcrumbs">
        <Link to="/">Home</Link> / <Link to="/produtos">Produtos</Link> /{' '}
        {product.name}
      </p>

      <div className="product-view-page__main">
        <Gallery
          className="product-view-page__gallery"
          height={570}
          images={images}
          radius="4px"
          showThumbs
          width={700}
        />
        <BuyBox
          description={product.description}
          name={product.name}
          price={product.price}
          priceDiscount={product.priceDiscount}
          rating={128}
          reference={`DR-${product.id.padStart(4, '0')}`}
          stars="4.7"
        >
          <ProductOptions
            options={['#C92071', '#1F1F1F', '#B5B6F2']}
            shape="circle"
            title="Escolha a cor"
            type="color"
          />
          <ProductOptions
            options={['P', 'M', 'G', 'GG']}
            radius="4px"
            shape="square"
            title="Escolha o tamanho"
            type="text"
          />
        </BuyBox>
      </div>

      <ProductDetails brand={product.brand} category={product.category} />

      <Section
        title="Produtos recomendados"
        link={{ text: 'Ver todos', href: '/produtos' }}
      >
        <ProductListing
          products={products.filter((item) => item.id !== product.id).slice(0, 4)}
        />
      </Section>
    </div>
  )
}
