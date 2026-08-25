require("dotenv").config();
const express = require("express");
const cors = require("cors");
const supabase = require("./supabase");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensagem: "API funcionando"
    });
});

app.get("/api/produtos", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("produtos")
            .select("*");

        if (error) {
            throw error;
        }

        res.json(data);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: error.message
        });
    }
});

app.get("/api/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("produtos")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            return res.status(404).json({
                erro: "Produto não encontrado"
            });
        }

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao buscar produto",
            detalhes: error.message
        });
    }
});

app.post("/api/produtos", async (req, res) => {
    try {
        const {
            nome,
            sku,
            descricao,
            preco,
            quantidade,
            estoque_minimo,
            categoria_id,
            fornecedor_id,
            ativo
        } = req.body;

        if (!nome || !sku || preco === undefined) {
            return res.status(400).json({
                erro: "Nome, SKU e preço são obrigatórios"
            });
        }

        const produto = {
            nome,
            sku,
            descricao: descricao || null,
            preco,
            quantidade: quantidade ?? 0,
            estoque_minimo: estoque_minimo ?? 0,
            categoria_id: categoria_id || null,
            fornecedor_id: fornecedor_id || null,
            ativo: ativo ?? true
        };

        const { data, error } = await supabase
            .from("produtos")
            .insert([produto])
            .select()
            .single();

        if (error) {
            console.error("Erro Supabase:", error);

            return res.status(500).json({
                erro: "Erro ao criar produto",
                detalhes: error.message
            });
        }

        res.status(201).json(data);

    } catch (error) {
        console.error("Erro:", error);

        res.status(500).json({
            erro: "Erro interno do servidor",
            detalhes: error.message
        });
    }
});

app.get("/api/categorias", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("categorias")
            .select("*");

        if (error) {
            throw error;
        }

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            erro: "Erro ao listar categorias",
            detalhes: error.message
        });
    }
});
app.post("/api/categorias", async (req, res) => {
    try {
        const {
            nome,
            descricao,
            ativo
        } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(400).json({
                erro: "Nome da categoria é obrigatório"
            });
        }

        const categoria = {
            nome: nome.trim(),
            descricao: descricao?.trim() || null,
            ativo: ativo ?? true
        };

        const { data, error } = await supabase
            .from("categorias")
            .insert([categoria])
            .select()
            .single();

        if (error) {
            console.error("Erro Supabase:", error);

            return res.status(500).json({
                erro: "Erro ao criar categoria",
                detalhes: error.message
            });
        }

        res.status(201).json(data);

    } catch (error) {
        console.error("Erro ao criar categoria:", error);

        res.status(500).json({
            erro: "Erro interno do servidor",
            detalhes: error.message
        });
    }
});

  app.delete("/api/categorias/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("categorias")
            .delete()
            .eq("id", id)
            .select();

        if (error) {
            console.error("Erro Supabase ao excluir categoria:", error);

            return res.status(500).json({
                erro: "Erro ao excluir categoria",
                detalhes: error.message
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                erro: "Categoria não encontrada"
            });
        }

        return res.status(200).json({
            mensagem: "Categoria excluída com sucesso",
            categoria: data[0]
        });

    } catch (error) {
        console.error("Erro ao excluir categoria:", error);

        return res.status(500).json({
            erro: "Erro interno do servidor",
            detalhes: error.message
        });
    }
});
app.put("/api/categorias/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, ativo } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(400).json({
                erro: "Nome da categoria é obrigatório"
            });
        }

        const categoriaAtualizada = {
            nome: nome.trim(),
            descricao: descricao?.trim() || null,
            ativo: ativo ?? true
        };

        const { data, error } = await supabase
            .from("categorias")
            .update(categoriaAtualizada)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Erro Supabase:", error);

            return res.status(500).json({
                erro: "Erro ao editar categoria",
                detalhes: error.message
            });
        }

        if (!data) {
            return res.status(404).json({
                erro: "Categoria não encontrada"
            });
        }

        res.json(data);

    } catch (error) {
        console.error("Erro ao editar categoria:", error);

        res.status(500).json({
            erro: "Erro interno do servidor",
            detalhes: error.message
        });
    }
});

// ==========================================
// USUÁRIOS & AUTENTICAÇÃO
// ==========================================

// POST - Criar usuário
app.post("/api/usuarios", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                erro: "Nome, email e senha são obrigatórios"
            });
        }
        
        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        const usuario = {
            nome,
            email,
            senha: senhaCriptografada,
        };

        const { data, error } = await supabase
            .from("usuarios")
            .insert([usuario])
            .select("id, nome, email, created_at")
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ erro: "Erro ao criar usuário", detalhes: error.message });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ erro: "Email e senha são obrigatórios" });
        }

        const { data: usuario, error } = await supabase
            .from("usuarios")
            .select("*")
            .eq("email", email)
            .single();

        if (error || !usuario) {
            return res.status(401).json({ erro: "Credenciais inválidas" });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Credenciais inválidas" });
        }

        delete usuario.senha;

        res.json({
            mensagem: "Login realizado com sucesso",
            usuario: usuario
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ erro: "Erro interno do servidor", detalhes: error.message });
    }
});

// ==========================================
// MOVIMENTAÇÕES DE ESTOQUE
// ==========================================

// POST - Entrada ou saída de estoque
app.post("/api/movimentacoes", async (req, res) => {
    try {
        const { produto_id, tipo, quantidade } = req.body;

        // Validação dos campos
        if (!produto_id || !tipo || quantidade === undefined) {
            return res.status(400).json({
                erro: "produto_id, tipo e quantidade são obrigatórios"
            });
        }

        // Validação do tipo
        if (!["entrada", "saida"].includes(tipo)) {
            return res.status(400).json({
                erro: "tipo deve ser 'entrada' ou 'saida'"
            });
        }

        // Converter quantidade para número
        const quantidadeNumerica = Number(quantidade);

        if (!Number.isFinite(quantidadeNumerica) || quantidadeNumerica <= 0) {
            return res.status(400).json({
                erro: "Quantidade deve ser um número maior que zero"
            });
        }

        // Buscar o produto pelo ID
        const { data: produto, error: erroProduto } = await supabase
            .from("produtos")
            .select("id, nome, quantidade")
            .eq("id", produto_id)
            .single();

        if (erroProduto || !produto) {
            return res.status(404).json({
                erro: "Produto não encontrado"
            });
        }

        // Quantidade atual
        const quantidadeAtual = Number(produto.quantidade) || 0;

        // Calcular nova quantidade
        let novaQuantidade;

        if (tipo === "entrada") {
            novaQuantidade = quantidadeAtual + quantidadeNumerica;
        } else {
            novaQuantidade = quantidadeAtual - quantidadeNumerica;

            // Não permitir estoque negativo
            if (novaQuantidade < 0) {
                return res.status(400).json({
                    erro: "Estoque insuficiente",
                    estoque_atual: quantidadeAtual,
                    quantidade_solicitada: quantidadeNumerica
                });
            }
        }

        // Atualizar tabela produtos
        const { data: produtoAtualizado, error: erroAtualizacao } =
            await supabase
                .from("produtos")
                .update({
                    quantidade: novaQuantidade,
                    atualizado_em: new Date().toISOString()
                })
                .eq("id", produto_id)
                .select("id, nome, quantidade")
                .single();

        if (erroAtualizacao) {
            console.error("Erro ao atualizar estoque:", erroAtualizacao);

            return res.status(500).json({
                erro: "Erro ao atualizar estoque",
                detalhes: erroAtualizacao.message
            });
        }

        // Resposta
        return res.status(200).json({
            mensagem: `Movimentação de ${tipo} realizada com sucesso`,
            tipo: tipo,
            quantidade_movimentada: quantidadeNumerica,
            produto: produtoAtualizado
        });

    } catch (error) {
        console.error("Erro na movimentação:", error);

        return res.status(500).json({
            erro: "Erro interno do servidor",
            detalhes: error.message
        });
    }
});
// ==========================================
// ATUALIZAR ESTOQUE - ENTRADA / SAÍDA
// ==========================================

app.put("/api/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            operacao,
            quantidade_movimentada
        } = req.body;

        // Validar operação
        if (!["entrada", "saida"].includes(operacao)) {
            return res.status(400).json({
                erro: "Operação deve ser 'entrada' ou 'saida'."
            });
        }

        // Converter quantidade
        const quantidadeMovimentada =
            Number(quantidade_movimentada);

        if (
            !Number.isFinite(quantidadeMovimentada) ||
            quantidadeMovimentada <= 0
        ) {
            return res.status(400).json({
                erro: "A quantidade movimentada deve ser maior que zero."
            });
        }

        // Buscar produto atual
        const { data: produto, error: erroProduto } =
            await supabase
                .from("produtos")
                .select("id, nome, sku, quantidade")
                .eq("id", id)
                .single();

        if (erroProduto || !produto) {
            return res.status(404).json({
                erro: "Produto não encontrado."
            });
        }

        const estoqueAnterior =
            Number(produto.quantidade) || 0;

        // Calcular novo estoque
        let estoqueAtual;

        if (operacao === "entrada") {
            estoqueAtual =
                estoqueAnterior + quantidadeMovimentada;
        } else {
            estoqueAtual =
                estoqueAnterior - quantidadeMovimentada;

            // Impedir estoque negativo
            if (estoqueAtual < 0) {
                return res.status(400).json({
                    erro: "Estoque insuficiente para realizar esta saída.",
                    estoque_atual: estoqueAnterior,
                    quantidade_solicitada:
                        quantidadeMovimentada
                });
            }
        }

        // Atualizar diretamente a tabela produtos
        const { data: produtoAtualizado, error: erroAtualizacao } =
            await supabase
                .from("produtos")
                .update({
                    quantidade: estoqueAtual,
                    atualizado_em:
                        new Date().toISOString()
                })
                .eq("id", id)
                .select("*")
                .single();

        if (erroAtualizacao) {
            console.error(
                "Erro ao atualizar estoque:",
                erroAtualizacao
            );

            return res.status(500).json({
                erro: "Erro ao atualizar estoque.",
                detalhes:
                    erroAtualizacao.message
            });
        }

        // Resposta usada pelo Produtos.jsx
        return res.status(200).json({
            mensagem:
                operacao === "entrada"
                    ? "Entrada realizada com sucesso."
                    : "Saída realizada com sucesso.",

            operacao,

            quantidade_movimentada:
                quantidadeMovimentada,

            estoque_anterior:
                estoqueAnterior,

            estoque_atual:
                estoqueAtual,

            produto:
                produtoAtualizado
        });

    } catch (error) {
        console.error(
            "Erro na atualização do estoque:",
            error
        );

        return res.status(500).json({
            erro: "Erro interno do servidor.",
            detalhes: error.message
        });
    }
});
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});