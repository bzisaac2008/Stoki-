import { useEffect, useState } from "react";
import "./Produtos.css";

const API_URL = "http://localhost:3000/api";

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [nome, setNome] = useState("");
  const [sku, setSku] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [fornecedorId, setFornecedorId] = useState("");

  const [produtoEditando, setProdutoEditando] =
    useState(null);

  const [busca, setBusca] = useState("");

  const [carregando, setCarregando] =
    useState(false);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const [modalEstoque, setModalEstoque] =
    useState(null);

  const [tipoMovimentacao, setTipoMovimentacao] =
    useState("");

  const [quantidadeMovimentacao, setQuantidadeMovimentacao] =
    useState("");

  const [processandoMovimentacao, setProcessandoMovimentacao] =
    useState(false);

  useEffect(() => {
    carregarProdutos();
    carregarCategorias();
  }, []);

  /* =========================================================
     RESPOSTA DA API
  ========================================================= */

  async function lerResposta(resposta) {
    const texto = await resposta.text();

    if (!texto) {
      return {};
    }

    try {
      return JSON.parse(texto);
    } catch {
      throw new Error(
        `A API retornou uma resposta inválida (${resposta.status}). Verifique se o servidor está rodando em http://localhost:3000.`
      );
    }
  }

  /* =========================================================
     PRODUTOS
  ========================================================= */

  async function carregarProdutos() {
    try {
      setErro("");

      const resposta = await fetch(
        `${API_URL}/produtos`
      );

      const dados =
        await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados?.erro ||
            "Não foi possível carregar os produtos."
        );
      }

      setProdutos(
        Array.isArray(dados)
          ? dados
          : []
      );
    } catch (error) {
      console.error(error);
      setErro(error.message);
    }
  }

  async function carregarCategorias() {
    try {
      const resposta = await fetch(
        `${API_URL}/categorias`
      );

      const dados =
        await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados?.erro ||
            "Não foi possível carregar as categorias."
        );
      }

      setCategorias(
        Array.isArray(dados)
          ? dados
          : []
      );
    } catch (error) {
      console.error(error);
    }
  }

  function limparFormulario() {
    setNome("");
    setSku("");
    setDescricao("");
    setPreco("");
    setQuantidade("");
    setEstoqueMinimo("");
    setCategoriaId("");
    setFornecedorId("");
    setProdutoEditando(null);
  }

  function mostrarMensagem(texto) {
    setMensagem(texto);

    setTimeout(() => {
      setMensagem("");
    }, 3000);
  }

  /* =========================================================
     CADASTRAR / EDITAR PRODUTO
  ========================================================= */

  async function salvarProduto(event) {
    event.preventDefault();

    if (!nome.trim()) {
      setErro(
        "Informe o nome do produto."
      );
      return;
    }

    if (!sku.trim()) {
      setErro(
        "Informe o SKU do produto."
      );
      return;
    }

    if (preco === "") {
      setErro(
        "Informe o preço do produto."
      );
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const produto = {
        nome: nome.trim(),
        sku: sku.trim(),
        descricao:
          descricao.trim() || null,
        preco: Number(preco),
        quantidade:
          quantidade === ""
            ? 0
            : Number(quantidade),
        estoque_minimo:
          estoqueMinimo === ""
            ? 0
            : Number(estoqueMinimo),
        categoria_id:
          categoriaId || null,
        fornecedor_id:
          fornecedorId || null,
        ativo: true
      };

      const url = produtoEditando
        ? `${API_URL}/produtos/${produtoEditando.id}`
        : `${API_URL}/produtos`;

      const metodo =
        produtoEditando
          ? "PUT"
          : "POST";

      const resposta = await fetch(
        url,
        {
          method: metodo,
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(produto)
        }
      );

      const dados =
        await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados?.erro ||
            "Não foi possível salvar o produto."
        );
      }

      await carregarProdutos();

      mostrarMensagem(
        produtoEditando
          ? "Produto atualizado com sucesso."
          : "Produto cadastrado com sucesso."
      );

      limparFormulario();
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  function editarProduto(produto) {
    setProdutoEditando(produto);

    setNome(produto.nome || "");
    setSku(produto.sku || "");
    setDescricao(
      produto.descricao || ""
    );
    setPreco(
      produto.preco ?? ""
    );
    setQuantidade(
      produto.quantidade ?? ""
    );
    setEstoqueMinimo(
      produto.estoque_minimo ?? ""
    );
    setCategoriaId(
      produto.categoria_id || ""
    );
    setFornecedorId(
      produto.fornecedor_id || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function excluirProduto(id) {
    const confirmar =
      window.confirm(
        "Tem certeza que deseja excluir este produto?"
      );

    if (!confirmar) {
      return;
    }

    try {
      setErro("");

      const resposta = await fetch(
        `${API_URL}/produtos/${id}`,
        {
          method: "DELETE"
        }
      );

      const dados =
        await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados?.erro ||
            "Não foi possível excluir o produto."
        );
      }

      await carregarProdutos();

      mostrarMensagem(
        "Produto excluído com sucesso."
      );

      if (
        produtoEditando?.id === id
      ) {
        limparFormulario();
      }
    } catch (error) {
      console.error(error);
      setErro(error.message);
    }
  }

  /* =========================================================
     MODAL DE ENTRADA / SAÍDA
  ========================================================= */

  function abrirMovimentacao(
    produto,
    tipo
  ) {
    setErro("");

    setTipoMovimentacao(tipo);

    setQuantidadeMovimentacao("");

    setModalEstoque(produto);
  }

  function fecharMovimentacao() {
    if (processandoMovimentacao) {
      return;
    }

    setModalEstoque(null);
    setTipoMovimentacao("");
    setQuantidadeMovimentacao("");
  }

  /* =========================================================
     CONFIRMAR ENTRADA / SAÍDA
  ========================================================= */

  async function confirmarMovimentacao() {
    if (!modalEstoque) {
      return;
    }

    const quantidadeMovimentada =
      Number(quantidadeMovimentacao);

    if (
      quantidadeMovimentada <= 0 ||
      !Number.isFinite(
        quantidadeMovimentada
      )
    ) {
      setErro(
        "Informe uma quantidade maior que zero."
      );
      return;
    }

    const estoqueAnterior =
      Number(
        modalEstoque.quantidade || 0
      );

    if (
      tipoMovimentacao === "saida" &&
      quantidadeMovimentada >
        estoqueAnterior
    ) {
      setErro(
        "Estoque insuficiente para realizar esta saída."
      );
      return;
    }

    try {
      setProcessandoMovimentacao(
        true
      );

      setErro("");

      const resposta = await fetch(
        `${API_URL}/produtos/${modalEstoque.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            operacao:
              tipoMovimentacao,
            quantidade_movimentada:
              quantidadeMovimentada
          })
        }
      );

      const dados =
        await lerResposta(resposta);

      if (!resposta.ok) {
        throw new Error(
          dados?.erro ||
            "Não foi possível realizar a movimentação."
        );
      }

      /*
         Salvar histórico local.
         Não utiliza tabela movimentacoes.
      */

      const movimentacoesSalvas =
        localStorage.getItem(
          "movimentacoes"
        );

      let movimentacoes = [];

      try {
        const dadosSalvos =
          movimentacoesSalvas
            ? JSON.parse(
                movimentacoesSalvas
              )
            : [];

        if (
          Array.isArray(dadosSalvos)
        ) {
          movimentacoes =
            dadosSalvos;
        }
      } catch {
        movimentacoes = [];
      }

      movimentacoes.push({
        id: Date.now(),
        produtoId:
          modalEstoque.id,
        produtoNome:
          modalEstoque.nome,
        sku:
          modalEstoque.sku,
        tipo:
          tipoMovimentacao,
        quantidade:
          quantidadeMovimentada,
        estoqueAnterior:
          dados.estoque_anterior,
        estoqueAtual:
          dados.estoque_atual,
        data:
          new Date().toISOString()
      });

      localStorage.setItem(
        "movimentacoes",
        JSON.stringify(
          movimentacoes
        )
      );

      window.dispatchEvent(
        new Event(
          "movimentacoesAtualizadas"
        )
      );

      await carregarProdutos();

      mostrarMensagem(
        tipoMovimentacao ===
          "entrada"
          ? "Entrada realizada com sucesso."
          : "Saída realizada com sucesso."
      );

      fecharMovimentacao();
    } catch (error) {
      console.error(error);
      setErro(error.message);
    } finally {
      setProcessandoMovimentacao(
        false
      );
    }
  }

  /* =========================================================
     CATEGORIA
  ========================================================= */

  function obterNomeCategoria(
    categoriaId
  ) {
    if (!categoriaId) {
      return "Sem categoria";
    }

    const categoria =
      categorias.find(
        (item) =>
          String(item.id) ===
          String(categoriaId)
      );

    return (
      categoria?.nome ||
      "Sem categoria"
    );
  }

  /* =========================================================
     FILTRO
  ========================================================= */

  const produtosFiltrados =
    produtos.filter(
      (produto) => {
        const termo =
          busca
            .toLowerCase()
            .trim();

        if (!termo) {
          return true;
        }

        return (
          String(
            produto.nome || ""
          )
            .toLowerCase()
            .includes(termo) ||
          String(
            produto.sku || ""
          )
            .toLowerCase()
            .includes(termo)
        );
      }
    );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="produtos-page">

      <div className="produtos-page-header">
        <div className="produtos-title-icon">
          <span>▣</span>
        </div>

        <div>
          <h1>Produtos</h1>

          <p>
            Gerencie os produtos do seu estoque.
          </p>
        </div>
      </div>

      {erro && (
        <div className="produto-alert produto-alert-error">
          <span>!</span>
          {erro}
        </div>
      )}

      {mensagem && (
        <div className="produto-alert produto-alert-success">
          <span>✓</span>
          {mensagem}
        </div>
      )}

      {/* =====================================================
          CADASTRO
      ===================================================== */}

      <section className="produto-card">

        <div className="produto-card-header">

          <div className="produto-section-icon">
            ▣
          </div>

          <h2>
            {produtoEditando
              ? "Editar produto"
              : "Cadastrar produto"}
          </h2>

        </div>

        <form onSubmit={salvarProduto}>

          <div className="produto-form-grid">

            <div className="produto-form-group produto-form-wide">

              <label htmlFor="nome">
                Nome do produto{" "}
                <span>*</span>
              </label>

              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(event) =>
                  setNome(
                    event.target.value
                  )
                }
                placeholder="Ex: Notebook Dell Inspiron"
              />

            </div>

            <div className="produto-form-group">

              <label htmlFor="sku">
                SKU <span>*</span>
              </label>

              <input
                id="sku"
                type="text"
                value={sku}
                onChange={(event) =>
                  setSku(
                    event.target.value
                  )
                }
                placeholder="Ex: NOTE123"
              />

            </div>

            <div className="produto-form-group">

              <label htmlFor="preco">
                Preço <span>*</span>
              </label>

              <input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                value={preco}
                onChange={(event) =>
                  setPreco(
                    event.target.value
                  )
                }
                placeholder="0,00"
              />

            </div>

            <div className="produto-form-group">

              <label htmlFor="quantidade">
                Quantidade
              </label>

              <input
                id="quantidade"
                type="number"
                min="0"
                value={quantidade}
                onChange={(event) =>
                  setQuantidade(
                    event.target.value
                  )
                }
                placeholder="0"
              />

            </div>

            <div className="produto-form-group">

              <label htmlFor="estoqueMinimo">
                Estoque mínimo
              </label>

              <input
                id="estoqueMinimo"
                type="number"
                min="0"
                value={estoqueMinimo}
                onChange={(event) =>
                  setEstoqueMinimo(
                    event.target.value
                  )
                }
                placeholder="0"
              />

            </div>

            <div className="produto-form-group produto-form-category">

              <label htmlFor="categoria">
                Categoria
              </label>

              <select
                id="categoria"
                value={categoriaId}
                onChange={(event) =>
                  setCategoriaId(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Selecione uma categoria
                </option>

                {categorias.map(
                  (categoria) => (
                    <option
                      key={
                        categoria.id
                      }
                      value={
                        categoria.id
                      }
                    >
                      {categoria.nome}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="produto-form-group">

              <label htmlFor="fornecedor">
                Fornecedor ID
              </label>

              <input
                id="fornecedor"
                type="text"
                value={fornecedorId}
                onChange={(event) =>
                  setFornecedorId(
                    event.target.value
                  )
                }
                placeholder="ID do fornecedor"
              />

            </div>

            <div className="produto-form-group produto-form-description">

              <label htmlFor="descricao">
                Descrição{" "}
                <small>
                  (opcional)
                </small>
              </label>

              <textarea
                id="descricao"
                value={descricao}
                onChange={(event) =>
                  setDescricao(
                    event.target.value
                  )
                }
                placeholder="Descrição detalhada do produto..."
                rows="3"
              />

            </div>

          </div>

          <div className="produto-form-footer">

            <label className="produto-checkbox">

              <input
                type="checkbox"
                checked={true}
                readOnly
              />

              <span className="produto-checkmark">
                ✓
              </span>

              <strong>
                Produto ativo
              </strong>

            </label>

            <div className="produto-form-actions">

              {produtoEditando && (
                <button
                  type="button"
                  className="produto-btn produto-btn-secondary"
                  onClick={
                    limparFormulario
                  }
                >
                  ↻ Limpar formulário
                </button>
              )}

              <button
                type="submit"
                className="produto-btn produto-btn-primary"
                disabled={carregando}
              >
                {carregando
                  ? "Salvando..."
                  : produtoEditando
                  ? "✓ Atualizar produto"
                  : "+ Cadastrar produto"}
              </button>

            </div>

          </div>

        </form>

      </section>

      {/* =====================================================
          LISTA
      ===================================================== */}

      <section className="produto-card produto-list-card">

        <div className="produto-card-header produto-list-header">

          <div className="produto-list-title">

            <div className="produto-section-icon">
              ▣
            </div>

            <h2>
              Produtos cadastrados
            </h2>

          </div>

          <span className="produto-count">
            {produtosFiltrados.length}{" "}
            produto(s) encontrado(s)
          </span>

        </div>

        <div className="produto-list-toolbar">

          <div className="produto-search">

            <span>⌕</span>

            <input
              type="text"
              value={busca}
              onChange={(event) =>
                setBusca(
                  event.target.value
                )
              }
              placeholder="Buscar por nome ou SKU..."
            />

          </div>

        </div>

        {produtosFiltrados.length === 0 ? (

          <div className="produto-empty">

            <div>▣</div>

            <h3>
              Nenhum produto encontrado
            </h3>

            <p>
              Cadastre um produto ou
              altere os termos da busca.
            </p>

          </div>

        ) : (

          <div className="produto-table-wrapper">

            <table className="produto-table">

              <thead>

                <tr>
                  <th>Produto</th>
                  <th>SKU</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                  <th>Estoque mínimo</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>

              </thead>

              <tbody>

                {produtosFiltrados.map(
                  (produto, index) => {

                    const estoqueBaixo =
                      Number(
                        produto.quantidade ||
                          0
                      ) <=
                      Number(
                        produto.estoque_minimo ||
                          0
                      );

                    return (
                      <tr
                        key={
                          produto.id
                        }
                      >

                        <td>

                          <div className="produto-name-cell">

                            <div
                              className={`produto-avatar produto-avatar-${
                                index % 5
                              }`}
                            >
                              ▣
                            </div>

                            <div>

                              <strong>
                                {
                                  produto.nome
                                }
                              </strong>

                              {produto.descricao && (
                                <small>
                                  {
                                    produto.descricao
                                  }
                                </small>
                              )}

                            </div>

                          </div>

                        </td>

                        <td>
                          <span className="produto-sku">
                            {
                              produto.sku
                            }
                          </span>
                        </td>

                        <td>
                          {obterNomeCategoria(
                            produto.categoria_id
                          )}
                        </td>

                        <td className="produto-price">

                          R${" "}

                          {Number(
                            produto.preco ||
                              0
                          ).toLocaleString(
                            "pt-BR",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            }
                          )}

                        </td>

                        <td>

                          <span
                            className={
                              estoqueBaixo
                                ? "produto-stock produto-stock-low"
                                : "produto-stock"
                            }
                          >
                            {
                              produto.quantidade ??
                              0
                            }
                          </span>

                        </td>

                        <td>
                          {
                            produto.estoque_minimo ??
                            0
                          }
                        </td>

                        <td>

                          {produto.ativo !==
                          false ? (

                            <span className="produto-status produto-status-active">
                              Ativo
                            </span>

                          ) : (

                            <span className="produto-status produto-status-inactive">
                              Inativo
                            </span>

                          )}

                        </td>

                        <td>

                          <div className="produto-actions">

                            <button
                              type="button"
                              className="produto-action-entry"
                              onClick={() =>
                                abrirMovimentacao(
                                  produto,
                                  "entrada"
                                )
                              }
                            >
                              ↑ Entrada
                            </button>

                            <button
                              type="button"
                              className="produto-action-exit"
                              onClick={() =>
                                abrirMovimentacao(
                                  produto,
                                  "saida"
                                )
                              }
                            >
                              ↓ Saída
                            </button>

                            <button
                              type="button"
                              className="produto-action-edit"
                              onClick={() =>
                                editarProduto(
                                  produto
                                )
                              }
                            >
                              ✎ Editar
                            </button>

                            <button
                              type="button"
                              className="produto-action-delete"
                              onClick={() =>
                                excluirProduto(
                                  produto.id
                                )
                              }
                            >
                              ▣ Excluir
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* =====================================================
          MODAL
      ===================================================== */}

      {modalEstoque && (

        <div
          className="produto-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              fecharMovimentacao();
            }
          }}
        >

          <div
            className="produto-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <div className="produto-modal-header">

              <h2>
                {tipoMovimentacao ===
                "entrada"
                  ? "Entrada de estoque"
                  : "Saída de estoque"}
              </h2>

              <button
                type="button"
                className="produto-modal-close"
                onClick={
                  fecharMovimentacao
                }
                disabled={
                  processandoMovimentacao
                }
              >
                ×
              </button>

            </div>

            <div className="produto-modal-body">

              <div className="produto-modal-info">

                <div>
                  <span>
                    Produto
                  </span>

                  <strong>
                    {
                      modalEstoque.nome
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    SKU
                  </span>

                  <strong>
                    {
                      modalEstoque.sku
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Estoque atual
                  </span>

                  <strong>
                    {
                      modalEstoque.quantidade ??
                      0
                    }
                  </strong>
                </div>

              </div>

              <div className="produto-modal-field">

                <label>
                  Quantidade
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={
                    quantidadeMovimentacao
                  }
                  onChange={(event) =>
                    setQuantidadeMovimentacao(
                      event.target.value
                    )
                  }
                  placeholder="Digite a quantidade"
                  autoFocus
                />

              </div>

            </div>

            <div className="produto-modal-footer">

              <button
                type="button"
                className="produto-modal-cancel"
                onClick={
                  fecharMovimentacao
                }
                disabled={
                  processandoMovimentacao
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className={
                  tipoMovimentacao ===
                  "entrada"
                    ? "produto-modal-confirm entrada"
                    : "produto-modal-confirm saida"
                }
                onClick={
                  confirmarMovimentacao
                }
                disabled={
                  processandoMovimentacao
                }
              >
                {processandoMovimentacao
                  ? "Processando..."
                  : tipoMovimentacao ===
                    "entrada"
                  ? "Confirmar entrada"
                  : "Confirmar saída"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Produtos;