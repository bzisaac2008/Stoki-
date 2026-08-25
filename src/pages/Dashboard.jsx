import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";

const API_URL = "http://localhost:3000/api";

function Dashboard() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarDashboard();

    function atualizarMovimentacoes() {
      carregarDashboard();
    }

    window.addEventListener(
      "movimentacoesAtualizadas",
      atualizarMovimentacoes
    );

    window.addEventListener(
      "storage",
      atualizarMovimentacoes
    );

    window.addEventListener(
      "focus",
      atualizarMovimentacoes
    );

    return () => {
      window.removeEventListener(
        "movimentacoesAtualizadas",
        atualizarMovimentacoes
      );

      window.removeEventListener(
        "storage",
        atualizarMovimentacoes
      );

      window.removeEventListener(
        "focus",
        atualizarMovimentacoes
      );
    };
  }, []);

  async function carregarDashboard() {
    try {
      setCarregando(true);
      setErro("");

      /*
       * Produtos e categorias vêm da API.
       * Movimentações vêm do localStorage.
       *
       * Não existe tabela movimentacoes no banco.
       */

      const [resProdutos, resCategorias] =
        await Promise.all([
          fetch(`${API_URL}/produtos`),
          fetch(`${API_URL}/categorias`)
        ]);

      if (!resProdutos.ok) {
        throw new Error(
          "Não foi possível carregar os produtos."
        );
      }

      if (!resCategorias.ok) {
        throw new Error(
          "Não foi possível carregar as categorias."
        );
      }

      const [
        dadosProdutos,
        dadosCategorias
      ] = await Promise.all([
        resProdutos.json(),
        resCategorias.json()
      ]);

      setProdutos(
        Array.isArray(dadosProdutos)
          ? dadosProdutos
          : []
      );

      setCategorias(
        Array.isArray(dadosCategorias)
          ? dadosCategorias
          : []
      );

      /*
       * Carregar histórico de movimentações
       * salvo pelo Produtos.jsx
       */
      const dadosMovimentacoes =
        localStorage.getItem(
          "movimentacoes"
        );

      if (!dadosMovimentacoes) {
        setMovimentacoes([]);
      } else {
        try {
          const lista =
            JSON.parse(
              dadosMovimentacoes
            );

          setMovimentacoes(
            Array.isArray(lista)
              ? lista
              : []
          );
        } catch (error) {
          console.error(
            "Erro ao ler movimentações:",
            error
          );

          setMovimentacoes([]);
        }
      }

    } catch (error) {
      console.error(
        "Erro ao carregar dashboard:",
        error
      );

      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  const totalProdutos =
    produtos.length;

  const totalCategorias =
    categorias.length;

  const estoqueTotal = useMemo(() => {
    return produtos.reduce(
      (total, produto) =>
        total +
        Number(
          produto.quantidade || 0
        ),
      0
    );
  }, [produtos]);

  const produtosEstoqueBaixo =
    useMemo(() => {
      return produtos.filter(
        (produto) => {
          const quantidade =
            Number(
              produto.quantidade || 0
            );

          const minimo =
            Number(
              produto.estoque_minimo || 0
            );

          return quantidade <= minimo;
        }
      );
    }, [produtos]);

  const produtosAtivos =
    useMemo(() => {
      return produtos.filter(
        (produto) =>
          produto.ativo !== false
      ).length;
    }, [produtos]);

  const entradas = useMemo(() => {
    return movimentacoes
      .filter(
        (movimentacao) =>
          movimentacao.tipo ===
          "entrada"
      )
      .reduce(
        (total, movimentacao) =>
          total +
          Number(
            movimentacao.quantidade || 0
          ),
        0
      );
  }, [movimentacoes]);

  const saidas = useMemo(() => {
    return movimentacoes
      .filter(
        (movimentacao) =>
          movimentacao.tipo ===
          "saida"
      )
      .reduce(
        (total, movimentacao) =>
          total +
          Number(
            movimentacao.quantidade || 0
          ),
        0
      );
  }, [movimentacoes]);

  /*
   * Ordenar movimentações da mais recente
   * para a mais antiga.
   */
  const movimentacoesOrdenadas =
    useMemo(() => {
      return [...movimentacoes].sort(
        (a, b) =>
          new Date(
            b.data
          ).getTime() -
          new Date(
            a.data
          ).getTime()
      );
    }, [movimentacoes]);

  function obterNomeProduto(
    movimentacao
  ) {
    return (
      movimentacao?.produtoNome ||
      movimentacao?.produtos?.nome ||
      movimentacao?.produto_nome ||
      "Produto"
    );
  }

  function formatarData(data) {
    if (!data) {
      return "-";
    }

    const dataFormatada =
      new Date(data);

    if (
      Number.isNaN(
        dataFormatada.getTime()
      )
    ) {
      return "-";
    }

    return dataFormatada.toLocaleString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  }

  if (carregando) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          Carregando informações do estoque...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>

          <h1>
            Dashboard
          </h1>

          <p>
            Visão geral do seu estoque e das movimentações.
          </p>

        </div>

        <button
          type="button"
          className="dashboard-refresh"
          onClick={
            carregarDashboard
          }
        >
          ↻ Atualizar
        </button>

      </div>

      {erro && (
        <div className="dashboard-alert">
          {erro}
        </div>
      )}

      <div className="dashboard-cards">

        <div className="dashboard-card">

          <div className="dashboard-card-icon blue">
            📦
          </div>

          <div>

            <span>
              Total de produtos
            </span>

            <strong>
              {totalProdutos}
            </strong>

            <small>
              {produtosAtivos} ativo(s)
            </small>

          </div>

        </div>

        <div className="dashboard-card">

          <div className="dashboard-card-icon purple">
            ▦
          </div>

          <div>

            <span>
              Categorias
            </span>

            <strong>
              {totalCategorias}
            </strong>

            <small>
              categoria(s) cadastrada(s)
            </small>

          </div>

        </div>

        <div className="dashboard-card">

          <div className="dashboard-card-icon green">
            ↕
          </div>

          <div>

            <span>
              Estoque total
            </span>

            <strong>
              {estoqueTotal}
            </strong>

            <small>
              unidade(s) em estoque
            </small>

          </div>

        </div>

        <div className="dashboard-card">

          <div className="dashboard-card-icon orange">
            !
          </div>

          <div>

            <span>
              Estoque baixo
            </span>

            <strong>
              {produtosEstoqueBaixo.length}
            </strong>

            <small>
              produto(s) precisam de atenção
            </small>

          </div>

        </div>

      </div>

      <div className="dashboard-summary">

        <div className="summary-card">

          <div className="summary-title">

            <span className="summary-icon entrada">
              ↓
            </span>

            <div>

              <h2>
                Entradas
              </h2>

              <p>
                Total movimentado
              </p>

            </div>

          </div>

          <strong>
            {entradas}
          </strong>

          <span>
            unidades
          </span>

        </div>

        <div className="summary-card">

          <div className="summary-title">

            <span className="summary-icon saida">
              ↑
            </span>

            <div>

              <h2>
                Saídas
              </h2>

              <p>
                Total movimentado
              </p>

            </div>

          </div>

          <strong>
            {saidas}
          </strong>

          <span>
            unidades
          </span>

        </div>

        <div className="summary-card">

          <div className="summary-title">

            <span className="summary-icon movimentacoes">
              ↕
            </span>

            <div>

              <h2>
                Movimentações
              </h2>

              <p>
                Registros realizados
              </p>

            </div>

          </div>

          <strong>
            {movimentacoes.length}
          </strong>

          <span>
            registro(s)
          </span>

        </div>

      </div>

      <div className="dashboard-grid">

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Produtos com estoque baixo
              </h2>

              <p>
                Produtos que atingiram o estoque mínimo.
              </p>

            </div>

            <span className="section-count">
              {produtosEstoqueBaixo.length}
            </span>

          </div>

          {produtosEstoqueBaixo.length === 0 ? (

            <div className="dashboard-empty">

              <div className="empty-icon">
                ✓
              </div>

              <strong>
                Estoque em dia
              </strong>

              <p>
                Nenhum produto está abaixo do estoque mínimo.
              </p>

            </div>

          ) : (

            <div className="low-stock-list">

              {produtosEstoqueBaixo
                .slice(0, 5)
                .map((produto) => (

                  <div
                    className="low-stock-item"
                    key={produto.id}
                  >

                    <div className="product-avatar">
                      {produto.nome
                        ?.charAt(0)
                        ?.toUpperCase() || "P"}
                    </div>

                    <div className="low-stock-info">

                      <strong>
                        {produto.nome}
                      </strong>

                      <span>
                        SKU:{" "}
                        {produto.sku || "-"}
                      </span>

                    </div>

                    <div className="stock-values">

                      <strong>
                        {produto.quantidade ?? 0}
                      </strong>

                      <span>
                        mín.{" "}
                        {produto.estoque_minimo ?? 0}
                      </span>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>

        <section className="dashboard-section">

          <div className="section-header">

            <div>

              <h2>
                Últimas movimentações
              </h2>

              <p>
                Movimentações mais recentes do estoque.
              </p>

            </div>

            <span className="section-count">
              {movimentacoes.length}
            </span>

          </div>

          {movimentacoesOrdenadas.length === 0 ? (

            <div className="dashboard-empty">

              <div className="empty-icon">
                ↕
              </div>

              <strong>
                Nenhuma movimentação
              </strong>

              <p>
                Ainda não existem movimentações registradas.
              </p>

            </div>

          ) : (

            <div className="movement-list">

              {movimentacoesOrdenadas
                .slice(0, 5)
                .map((movimentacao) => (

                  <div
                    className="movement-item"
                    key={movimentacao.id}
                  >

                    <div
                      className={`movement-icon ${
                        movimentacao.tipo ===
                        "entrada"
                          ? "movement-entry"
                          : "movement-exit"
                      }`}
                    >
                      {movimentacao.tipo ===
                      "entrada"
                        ? "↓"
                        : "↑"}
                    </div>

                    <div className="movement-info">

                      <strong>
                        {obterNomeProduto(
                          movimentacao
                        )}
                      </strong>

                      <span>
                        {movimentacao.tipo ===
                        "entrada"
                          ? "Entrada"
                          : "Saída"}

                        {" • "}

                        {formatarData(
                          movimentacao.data
                        )}
                      </span>

                    </div>

                    <strong
                      className={
                        movimentacao.tipo ===
                        "entrada"
                          ? "movement-positive"
                          : "movement-negative"
                      }
                    >
                      {movimentacao.tipo ===
                      "entrada"
                        ? "+"
                        : "-"}

                      {movimentacao.quantidade}
                    </strong>

                  </div>

                ))}

            </div>

          )}

        </section>

      </div>

      <section className="dashboard-section dashboard-products">

        <div className="section-header">

          <div>

            <h2>
              Produtos cadastrados
            </h2>

            <p>
              Resumo dos produtos atualmente no sistema.
            </p>

          </div>

          <span className="section-count">
            {produtos.length}
          </span>

        </div>

        <div className="dashboard-table-container">

          <table className="dashboard-table">

            <thead>

              <tr>

                <th>
                  Produto
                </th>

                <th>
                  SKU
                </th>

                <th>
                  Quantidade
                </th>

                <th>
                  Estoque mínimo
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {produtos
                .slice(0, 8)
                .map((produto) => {

                  const quantidade =
                    Number(
                      produto.quantidade || 0
                    );

                  const minimo =
                    Number(
                      produto.estoque_minimo || 0
                    );

                  const estoqueBaixo =
                    quantidade <= minimo;

                  return (

                    <tr
                      key={produto.id}
                    >

                      <td>

                        <div className="table-product">

                          <div className="product-avatar small">
                            {produto.nome
                              ?.charAt(0)
                              ?.toUpperCase() || "P"}
                          </div>

                          <div>

                            <strong>
                              {produto.nome}
                            </strong>

                            <span>
                              {produto.descricao ||
                                "Sem descrição"}
                            </span>

                          </div>

                        </div>

                      </td>

                      <td>
                        {produto.sku || "-"}
                      </td>

                      <td>
                        <strong>
                          {quantidade}
                        </strong>
                      </td>

                      <td>
                        {minimo}
                      </td>

                      <td>

                        {estoqueBaixo ? (

                          <span className="status-badge warning">
                            Estoque baixo
                          </span>

                        ) : (

                          <span className="status-badge active">
                            Estoque normal
                          </span>

                        )}

                      </td>

                    </tr>

                  );

                })}

            </tbody>

          </table>

          {produtos.length === 0 && (

            <div className="dashboard-empty">

              <strong>
                Nenhum produto cadastrado
              </strong>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default Dashboard;