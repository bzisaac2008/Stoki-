import { useEffect, useState } from 'react'
import './Categorias.css'

function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [ativa, setAtiva] = useState(true)
  const [busca, setBusca] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  const API_URL = 'http://localhost:3000/api/categorias'

  async function carregarCategorias() {
    try {
      setErro('')

      const resposta = await fetch(API_URL)

      if (!resposta.ok) {
        throw new Error('Erro ao carregar categorias')
      }

      const data = await resposta.json()

      setCategorias(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error(error)
      setErro(error.message)
    }
  }

  useEffect(() => {
    carregarCategorias()
  }, [])

  async function cadastrarCategoria(e) {
    e.preventDefault()

    if (!nome.trim()) {
      setErro('Informe o nome da categoria.')
      return
    }

    try {
      setCarregando(true)
      setErro('')

      const resposta = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: nome.trim(),
          descricao: descricao.trim(),
          ativa
        })
      })

      const data = await resposta.json()

      if (!resposta.ok) {
        throw new Error(data.erro || 'Erro ao cadastrar categoria')
      }

      setNome('')
      setDescricao('')
      setAtiva(true)

      await carregarCategorias()
    } catch (error) {
      console.error(error)
      setErro(error.message)
    } finally {
      setCarregando(false)
    }
  }

  async function excluirCategoria(id) {
    const confirmar = window.confirm(
      'Deseja realmente excluir esta categoria?'
    )

    if (!confirmar) return

    try {
      setErro('')

      const resposta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      const data = await resposta.json()

      if (!resposta.ok) {
        throw new Error(data.erro || 'Erro ao excluir categoria')
      }

      await carregarCategorias()
    } catch (error) {
      console.error(error)
      setErro(error.message)
    }
  }

  async function editarCategoria(categoria) {
    const novoNome = window.prompt(
      'Digite o novo nome da categoria:',
      categoria.nome
    )

    if (novoNome === null) return

    if (!novoNome.trim()) {
      setErro('O nome da categoria não pode ficar vazio.')
      return
    }

    const novaDescricao = window.prompt(
      'Digite a descrição da categoria:',
      categoria.descricao || ''
    )

    if (novaDescricao === null) return

    try {
      setErro('')

      const resposta = await fetch(`${API_URL}/${categoria.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: novoNome.trim(),
          descricao: novaDescricao.trim(),
          ativa: categoria.ativa
        })
      })

      const data = await resposta.json()

      if (!resposta.ok) {
        throw new Error(data.erro || 'Erro ao editar categoria')
      }

      await carregarCategorias()
    } catch (error) {
      console.error(error)
      setErro(error.message)
    }
  }

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nome
      ?.toLowerCase()
      .includes(busca.toLowerCase())
  )

  function formatarData(data) {
    if (!data) return '-'

    const dataObj = new Date(data)

    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="categorias-page">

      <div className="categorias-header">
        <div className="categorias-header-icon">
          📁
        </div>

        <div>
          <h1>Categorias</h1>
          <p>
            Gerenciamento das categorias dos produtos.
          </p>
        </div>
      </div>

      {erro && (
        <div className="categorias-erro">
          {erro}
        </div>
      )}

      <section className="categoria-card">

        <div className="card-title">
          <span>▣</span>
          <h2>Cadastrar categoria</h2>
        </div>

        <form onSubmit={cadastrarCategoria}>

          <div className="categoria-form">

            <div className="form-left">

              <label>
                Nome da categoria
              </label>

              <input
                type="text"
                placeholder="Ex.: Eletrônicos"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />

              <label className="checkbox-label">
                Categoria ativa
              </label>

              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={ativa}
                  onChange={(e) => setAtiva(e.target.checked)}
                />

                <span className="custom-checkbox">
                  {ativa ? '✓' : ''}
                </span>

                <span>Sim</span>
              </label>

            </div>

            <div className="form-right">

              <label>
                Descrição <span>(opcional)</span>
              </label>

              <textarea
                placeholder="Descrição da categoria"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

            </div>

          </div>

          <button
            type="submit"
            className="btn-adicionar"
            disabled={carregando}
          >
            <span>＋</span>

            {carregando
              ? 'Cadastrando...'
              : 'Adicionar categoria'}
          </button>

        </form>

      </section>

      <section className="categoria-card lista-card">

        <div className="card-title">
          <span>▣</span>
          <h2>Categorias cadastradas</h2>
        </div>

        <div className="lista-top">

          <div className="busca-container">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Buscar categoria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className="contador">
            {categoriasFiltradas.length} categoria(s) cadastrada(s)
          </div>

        </div>

        <div className="tabela-container">

          <table>

            <thead>
              <tr>
                <th>Nome da categoria ↕</th>
                <th>Descrição ↕</th>
                <th>Status ↕</th>
                <th>Data de criação ↕</th>
                <th>Ações ↕</th>
              </tr>
            </thead>

            <tbody>

              {categoriasFiltradas.map((categoria, index) => (

                <tr key={categoria.id}>

                  <td>
                    <div className="nome-categoria">

                      <div className={`categoria-icon icon-${index % 3}`}>
                        {index === 0
                          ? '▯'
                          : index === 1
                            ? '▣'
                            : '♙'}
                      </div>

                      <strong>
                        {categoria.nome}
                      </strong>

                    </div>
                  </td>

                  <td>
                    {categoria.descricao || '-'}
                  </td>

                  <td>

                    <span
                      className={
                        categoria.ativa
                          ? 'status ativa'
                          : 'status inativa'
                      }
                    >
                      {categoria.ativa
                        ? 'Ativa'
                        : 'Inativa'}
                    </span>

                  </td>

                  <td>
                    {formatarData(categoria.criado_em)}
                  </td>

                  <td>

                    <div className="acoes">

                      <button
                        className="btn-editar"
                        onClick={() =>
                          editarCategoria(categoria)
                        }
                      >
                        ✎ Editar
                      </button>

                      <button
                        className="btn-excluir"
                        onClick={() =>
                          excluirCategoria(categoria.id)
                        }
                      >
                        ♙ Excluir
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

              {categoriasFiltradas.length === 0 && (

                <tr>
                  <td
                    colSpan="5"
                    className="sem-categorias"
                  >
                    Nenhuma categoria encontrada.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

        <div className="paginacao">

          <select defaultValue="10">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>

          <span>itens por página</span>

          <div className="paginas">

            <button disabled>
              ‹
            </button>

            <button className="pagina-atual">
              1
            </button>

            <button disabled>
              ›
            </button>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Categorias