import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">S</div>
        <span>Stoki</span>
      </div>

      <nav className="sidebar-nav">
       
        <Link to="/" className="sidebar-link">
          <span>▦</span>
          Dashboard
        </Link>

        <Link to="/produtos" className="sidebar-link">
          <span>▣</span>
          Produtos
        </Link>

        <Link to="/categorias" className="sidebar-link">
          <span>▤</span>
          Categorias
        </Link>

        <Link to="/movimentacoes" className="sidebar-link">
          <span>↕</span>
          Movimentações
        </Link>
      </nav>

      <div className="sidebar-footer">
        <span>Sistema de Gestão</span>
        <small>v1.0.0</small>
      </div>
    </aside>
  )
}

export default Sidebar