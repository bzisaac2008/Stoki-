const express = require("express");
const cors = require("cors");
const supabase = require("./supabase");

const app = express();
const PORT = 3000;

// ===============================
// MIDDLEWARES
// ===============================

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());

// ===============================
// ROTA PRINCIPAL
// ===============================

app.get("/", (req, res) => {
    res.json({
        mensagem: "API funcionando"
    });
});

// ===============================
// PRODUTOS - LISTAR
// ===============================

app.get("/api/produtos", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("produtos")
            .select("*");

        if (error) {
            console.error("Erro Supabase:", error);

            return res.status(500).json({
                erro: "Erro ao buscar produtos",
                detalhes: error.message
            });
        }

        res.json(data);
    } catch (error) {
        console.error("Erro interno:", error);

        res.status(500).json({
            erro: "Erro interno do servidor",
            detalhes: error.message
        });
    }
});

// ===============================
// PRODUTO - BUSCAR POR ID
// ===============================

app.get("/api/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("produtos")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error("Erro Supabase:", error);

            return res.status(404).json({
                erro: "Produto não encontrado"
            });
        }

        res.json(data);
    } catch (error) {
        console.error("Erro interno:", error);

        res.status(500).json({
            erro: "Erro ao buscar produto",
            detalhes: error.message
        });
    }
});

// ===============================
// PRODUTO - CADASTRAR
// ===============================

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
        console.error("Erro interno:", error);

        res.status(500).json({
            erro: "Erro interno do servidor",
            detalhes: error.message
        });
    }
});

// ===============================
// PRODUTO - ATUALIZAR
// ===============================

app.put("/api/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;

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

        const atualizacao = {};

        if (nome !== undefined) {
            atualizacao.nome = nome;
        }

        if (sku !== undefined) {
            atualizacao.sku = sku;
        }

        if (descricao !== undefined) {
            atualizacao.descricao = descricao;
        }

        if (preco !== undefined) {
            atualizacao.preco = preco;
        }

        if (quantidade !== undefined) {
            atualizacao.quantidade = quantidade;
        }

        if (estoque_minimo !== undefined) {
            atualizacao.estoque_minimo = estoque_minimo;
        }

        if (categoria_id !== undefined) {
            atualizacao.categoria_id = categoria_id;
        }

        if (fornecedor_id !== undefined) {
            atualizacao.fornecedor_id = fornecedor_id;
        }

        if (ativo !== undefined) {
            atualizacao.ativo = ativo;
        }

        if (Object.keys(atualizacao).length === 0) {
            return res.status(400).json({
                erro: "Informe pelo menos um campo para atualizar"
            });
        }

        const { data, error } = await supabase
            .from("produtos")
            .update(atualizacao)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Erro Supabase:", error);

            return res.status(500).json({
                erro: "Erro ao atualizar produto",
                detalhes: error.message
            });
        }

        res.json(data);
    } catch (error) {
        console.error("Erro interno:", error);

        res.status(500).json({
            erro: "Erro ao editar produto",
            detalhes: error.message
        });
    }
});

// ===============================
// PRODUTO - EXCLUIR
// ===============================

app.delete("/api/produtos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("produtos")
            .delete()
            .eq("id", id)
            .select()
            .single();

        if (error) {
            console.error("Erro Supabase:", error);

            return res.status(500).json({
                erro: "Erro ao excluir produto",
                detalhes: error.message
            });
        }

        res.json({
            mensagem: "Produto excluído com sucesso",
            produto: data
        });
    } catch (error) {
        console.error("Erro interno:", error);

        res.status(500).json({
            erro: "Erro ao excluir produto",
            detalhes: error.message
        });
    }
});

// ===============================
// CATEGORIAS - LISTAR
// ===============================

app.get("/api/categorias", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("categorias")
            .select("*");

        if (error) {
            console.error("Erro Supabase:", error);

            return res.status(500).json({
                erro: "Erro ao listar categorias",
                detalhes: error.message
            });
        }

        res.json(data);
    } catch (error) {
        console.error("Erro interno:", error);

        res.status(500).json({
            erro: "Erro ao listar categorias",
            detalhes: error.message
        });
    }
});

// ===============================
// INICIAR SERVIDOR
// ===============================

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});