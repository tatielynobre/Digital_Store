import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FilterGroup from '../components/FilterGroup.jsx'
import ProductListing from '../components/ProductListing.jsx'
import Section from '../components/Section.jsx'
import products from '../data/products.js'

const filterOptions = {
  brand: ['Adidas', 'Digital', 'Levis', 'Nike', 'Puma'],
  category: ['Acessórios', 'Bonés', 'Calças', 'Camisetas', 'Jaquetas', 'Moletons', 'Tênis'],
}

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export default function ProductListingPage() {
  const [searchParams] = useSearchParams()
  const searchTerm = normalizeText(searchParams.get('filter') ?? '').trim()
  const [filters, setFilters] = useState({ brand: [], category: [] })
  const [sortOrder, setSortOrder] = useState('relevance')

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        normalizeText(`${product.name} ${product.category} ${product.brand}`)
          .includes(searchTerm)
      const matchesBrand =
        filters.brand.length === 0 || filters.brand.includes(product.brand)
      const matchesCategory =
        filters.category.length === 0 ||
        filters.category.includes(product.category)

      return matchesSearch && matchesBrand && matchesCategory
    })

    if (sortOrder === 'price-asc') {
      return filtered.sort(
        (a, b) => (a.priceDiscount ?? a.price) - (b.priceDiscount ?? b.price),
      )
    }

    if (sortOrder === 'price-desc') {
      return filtered.sort(
        (a, b) => (b.priceDiscount ?? b.price) - (a.priceDiscount ?? a.price),
      )
    }

    return filtered
  }, [filters, searchTerm, sortOrder])

  function toggleFilter(group, value) {
    setFilters((current) => {
      const selectedValues = current[group]
      const nextValues = selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value]

      return { ...current, [group]: nextValues }
    })
  }

  return (
    <div className="page-container product-listing-page">
      <p className="breadcrumbs">
        <Link to="/">Home</Link> / Produtos
      </p>
      <aside className="product-listing-page__filters">
        <label className="product-listing-page__sort-label" htmlFor="sort-order">
          Ordenar por
        </label>
        <select
          id="sort-order"
          onChange={(event) => setSortOrder(event.target.value)}
          value={sortOrder}
        >
          <option value="relevance">Mais relevantes</option>
          <option value="price-asc">Menor preço</option>
          <option value="price-desc">Maior preço</option>
        </select>

        <div className="product-listing-page__filter-panel">
          <h2>Filtrar por</h2>
          <FilterGroup
            name="brand"
            onChange={(value) => toggleFilter('brand', value)}
            options={filterOptions.brand.map((text) => ({ text, value: text }))}
            selectedValues={filters.brand}
            title="Marca"
          />
          <FilterGroup
            name="category"
            onChange={(value) => toggleFilter('category', value)}
            options={filterOptions.category.map((text) => ({
              text,
              value: text,
            }))}
            selectedValues={filters.category}
            title="Categoria"
          />
        </div>
      </aside>

      <div className="product-listing-page__results">
        <Section title={`${visibleProducts.length} produtos encontrados`}>
          <ProductListing products={visibleProducts} />
        </Section>
      </div>
    </div>
  )
}
