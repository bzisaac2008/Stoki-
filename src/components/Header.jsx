import { useNavigate } from 'react-router-dom'

function Header() {
  const navigate = useNavigate()

  const usuarioNome =
    localStorage.getItem('usuarioNome') ||
    'Administrador'

  function sair() {
    localStorage.removeItem('usuarioAutenticado')
    localStorage.removeItem('usuarioNome')

    navigate('/login')
  }

  return (
    <header className="header">
      <div>
        <h1>Stoki</h1>
        <p>Sistema de Gestão de Estoque</p>
      </div>

      <div className="header-user">
        <div className="user-avatar">U</div>

        <div>
          <strong>{usuarioNome}</strong>
          <span>Administrador</span>
        </div>

        <button
          type="button"
          className="logout-button"
          onClick={sair}
        >
          Sair
        </button>
      </div>
    </header>
  )
}

export default Header