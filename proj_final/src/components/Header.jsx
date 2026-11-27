import { NavLink } from 'react-router-dom'
import Logo from './Logo.jsx'
import './Header.css'
import cartIcon from '../assets/mini-cart.svg'

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__top">
        <a className="site-header__logo" href="/" aria-label="Digital Store - início">
          <Logo />
        </a>

        <form className="site-header__search" action="/produtos" method="get" role="search">
          <label className="visually-hidden" htmlFor="header-search">
            Buscar produtos
          </label>
          <input
            id="header-search"
            type="search"
            name="filter"
            placeholder="Pesquisar produto..."
          />
          <button type="submit" aria-label="Buscar produtos">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </button>
        </form>

        <div className="site-header__account">
          <a className="site-header__signup" href="/register">
            Cadastre-se
          </a>
          <a className="site-header__login" href="/login">
            Entrar
          </a>
          <img className="site-header__cart" src={cartIcon} alt="Carrinho de compras" />
        </div>
      </div>

      <nav className="site-header__nav" aria-label="Navegação principal">
        <NavLink end to="/">
          Home
        </NavLink>
        <NavLink to="/produtos">Produtos</NavLink>
        <NavLink to="/categorias">Categorias</NavLink>
        <NavLink to="/pedidos">Meus Pedidos</NavLink>
      </nav>
    </header>
  )
}
