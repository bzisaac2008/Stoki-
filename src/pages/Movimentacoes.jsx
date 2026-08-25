import { useEffect, useState } from "react";

function Movimentacoes() {
    const [
        movimentacoes,
        setMovimentacoes
    ] = useState([]);

    const [
        erro,
        setErro
    ] = useState("");


    function carregarMovimentacoes() {
        try {
            const dados =
                localStorage.getItem(
                    "movimentacoes"
                );

            if (!dados) {
                setMovimentacoes([]);
                return;
            }

            const lista =
                JSON.parse(dados);

            setMovimentacoes(
                Array.isArray(lista)
                    ? lista
                    : []
            );

        } catch (error) {
            console.error(
                "Erro ao carregar movimentações:",
                error
            );

            setErro(
                "Não foi possível carregar o histórico."
            );

            setMovimentacoes([]);
        }
    }


    useEffect(() => {
        carregarMovimentacoes();

        function atualizar() {
            carregarMovimentacoes();
        }

        window.addEventListener(
            "focus",
            atualizar
        );

        return () => {
            window.removeEventListener(
                "focus",
                atualizar
            );
        };
    }, []);


    function formatarData(data) {
        if (!data) {
            return "-";
        }

        const dataObj =
            new Date(data);

        if (
            Number.isNaN(
                dataObj.getTime()
            )
        ) {
            return "-";
        }

        return dataObj.toLocaleString(
            "pt-BR"
        );
    }


    function limparHistorico() {
        const confirmar =
            window.confirm(
                "Deseja realmente apagar todo o histórico de movimentações?"
            );

        if (!confirmar) {
            return;
        }

        localStorage.removeItem(
            "movimentacoes"
        );

        setMovimentacoes([]);

        setErro("");
    }


    const movimentacoesOrdenadas =
        [...movimentacoes].sort(
            (a, b) =>
                new Date(
                    b.data
                ).getTime() -
                new Date(
                    a.data
                ).getTime()
        );


    return (
        <section className="movimentacoes-page">

            <div className="page-title">

                <div>

                    <h2>
                        Movimentações
                    </h2>

                    <p>
                        Histórico de entradas
                        e saídas do estoque
                    </p>

                </div>


                {movimentacoes.length >
                    0 && (
                    <button
                        type="button"
                        onClick={
                            limparHistorico
                        }
                    >
                        Limpar histórico
                    </button>
                )}

            </div>


            {erro && (
                <div className="error-message">
                    {erro}
                </div>
            )}


            {movimentacoesOrdenadas.length ===
            0 ? (

                <div className="movimentacoes-empty">

                    <h3>
                        Nenhuma movimentação registrada
                    </h3>

                    <p>
                        Quando você registrar
                        uma entrada ou saída,
                        ela aparecerá neste
                        histórico.
                    </p>

                </div>

            ) : (

                <div className="movimentacoes-container">

                    {movimentacoesOrdenadas.map(
                        (movimentacao) => {

                            const isEntrada =
                                movimentacao.tipo ===
                                "entrada";

                            return (
                                <div
                                    className="movimentacao-card"
                                    key={
                                        movimentacao.id
                                    }
                                >

                                    <div className="movimentacao-header">

                                        <div>

                                            <h3>
                                                {
                                                    movimentacao.produtoNome
                                                }
                                            </h3>

                                            <span>
                                                SKU:{" "}
                                                {
                                                    movimentacao.sku ||
                                                    "-"
                                                }
                                            </span>

                                        </div>


                                        <span
                                            className={
                                                isEntrada
                                                    ? "movimentacao-tipo entrada"
                                                    : "movimentacao-tipo saida"
                                            }
                                        >
                                            {isEntrada
                                                ? "Entrada"
                                                : "Saída"}
                                        </span>

                                    </div>


                                    <div className="movimentacao-info">

                                        <div>

                                            <span>
                                                Quantidade
                                            </span>

                                            <strong>
                                                {
                                                    movimentacao.quantidade
                                                }{" "}
                                                un.
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Estoque anterior
                                            </span>

                                            <strong>
                                                {
                                                    movimentacao.estoqueAnterior ??
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Estoque atual
                                            </span>

                                            <strong>
                                                {
                                                    movimentacao.estoqueAtual ??
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Data
                                            </span>

                                            <strong>
                                                {formatarData(
                                                    movimentacao.data
                                                )}
                                            </strong>

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>

            )}

        </section>
    );
}

export default Movimentacoes;