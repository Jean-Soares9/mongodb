/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 */

// importação do módulo de coneção (database.js)
const { conectar, desconectar } = require('./database')

// importação do modelo de dados de clientes
const clienteModel = require('./src/models/Clientes')

// importação do pacote string-similarity para aprimorar a busca por nome
const stringSimilarity = require('string-similarity')

// CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            }
        )
        // a linha abaixo salva os dados do cliente no banco
        await novoCliente.save()
        console.log("Cliente adicionado com sucesso.")

    } catch (error) {
        // tratamento de exceções especificas
        if (error.code = 11000) {
            console.log(`Erro: O CPF ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }

    }
}

// CRUD Read - Função para listar todos os clientes cadastrados
const listarClientes = async () => {
    try {
        // a linha abaixo lista todos os clientes cadastrados por ordem alfabética
        const clientes = await clienteModel.find().sort(
            {
                nomeCliente: 1
            }
        )
        console.log(clientes)
    } catch (error) {
        console.log(error)
    }
}

// CRUD Read - Função para buscar um cliente especifico
const buscarCliente = async (nome) => {
    try {
        // find() buscar
        // nomeCliente: new RegExp(nome) filtro pelo nome (partes que contenham (expressão regular))
        // 'i' insensitive (ignorar letras maiúsculas ou minúsculas)
        const cliente = await clienteModel.find(
            {
                nomeCliente: new RegExp(nome, 'i')
            }
        )
        // calcular a similaridade entre os nomes retornados e o nome pesquisado
        const nomesClientes = cliente.map(cliente => cliente.nomeCliente)

        // validação (se não existir o cliente pesquisado)
        if (nomesClientes.length === 0) {
            console.log("Cliente não cadastrado")
        } else {
            const match = stringSimilarity.findBestMatch(nome, nomesClientes)
            // cliente com melhor similaridade
            const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)
            // formatação da data
            const clienteFormatado = {
                nomeCliente: melhorCliente.nomeCliente,
                foneCliente: melhorCliente.foneCliente,
                cpf: melhorCliente.cpf,
                dataCadastro: melhorCliente.dataCadastro.toLocaleDateString('pt-BR')
            }
            console.log(clienteFormatado)
        }

    } catch (error) {
        console.log(error)
    }
}

// execução da aplicação
const app = async () => {
    await conectar()
    // CRUD - Create
    //await criarCliente("Neimar Junior", "11912345678", "123.456.789-02")
    //await criarCliente("Roberto Carlos", "11912345678", "123.456.789-03")
    //await criarCliente("Ronaldo Fenomeno", "11912345678", "123.456.789-04")
    //await criarCliente("Ronaldinho Gaucho", "11912345678", "123.456.789-05")
    //await criarCliente("Carlito Tevez", "11912345678", "123.456.789-06")

    // CRUD - Read (Exemplo 1 - listar clientes)
    // await listarClientes()

    // CRUD - Read (Exemplo 2 - buscar cliente)
    await buscarCliente("Ronaldo Fenomeno")

    await desconectar()
}

console.clear()
app()