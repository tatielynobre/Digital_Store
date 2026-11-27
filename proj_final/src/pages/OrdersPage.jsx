import { Link } from 'react-router-dom'

export default function OrdersPage() {
  return (
    <div className="page-container orders-page">
      <h1>Meus pedidos</h1>
      <p>Você ainda não possui pedidos.</p>
      <Link to="/produtos">Continuar comprando</Link>
    </div>
  )
}
