import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import ProductListingPage from './pages/ProductListingPage.jsx'
import ProductViewPage from './pages/ProductViewPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<ProductListingPage />} path="/produtos" />
          <Route element={<ProductListingPage />} path="/products" />
          <Route element={<ProductListingPage />} path="/categorias" />
          <Route element={<OrdersPage />} path="/pedidos" />
          <Route element={<ProductViewPage />} path="/product/:id" />
          <Route
            element={
              <div className="page-container not-found">
                <h1>Página não encontrada</h1>
              </div>
            }
            path="*"
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
