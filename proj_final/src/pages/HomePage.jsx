import { Link } from 'react-router-dom'
import Gallery from '../components/Gallery.jsx'
import ProductListing from '../components/ProductListing.jsx'
import Section from '../components/Section.jsx'
import products from '../data/products.js'

const slides = Array.from({ length: 8 }, (_, index) => ({
  src: `/home-slide-${index + 1}.jpeg`,
  alt: `Destaque da loja ${index + 1}`,
}))

const collections = [
  { title: 'Novo drop', image: '/collection-1.png', filter: 'jaqueta' },
  { title: 'Coleção especial', image: '/collection-2.png', filter: 'tenis' },
  { title: 'Destaques', image: '/collection-3.png', filter: 'moletom' },
]

export default function HomePage() {
  return (
    <div className="home-page">
      <Gallery
        className="home-page__hero"
        height={681}
        images={slides}
        width={1440}
      />

      <div className="page-container">
        <Section title="Coleções em destaque" titleAlign="center">
          <div className="home-page__collections">
            {collections.map((collection) => (
              <Link
                className="home-page__collection"
                key={collection.title}
                to={`/produtos?filter=${collection.filter}`}
              >
                <img src={collection.image} alt={collection.title} />
                <span>{collection.title}</span>
              </Link>
            ))}
          </div>
        </Section>

        <Section
          title="Produtos em alta"
          link={{ text: 'Ver todos', href: '/produtos' }}
        >
          <ProductListing products={products} />
        </Section>
      </div>
    </div>
  )
}
