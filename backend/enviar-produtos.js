const fs = require("fs");
const supabase = require("./supabase");

const produtos = JSON.parse(
    fs.readFileSync("./produto.json", "utf8")
);

async function enviarProdutos() {

    for (const produto of produtos) {

        const { data, error } = await supabase
            .from("produtos")
            .insert([produto])
            .select()
            .single();

        if (error) {
            console.error("Erro ao enviar produto:");
            console.error(error.message);
            continue;
        }

        console.log("Produto enviado com sucesso:");
        console.log(data);
    }
}

enviarProdutos();