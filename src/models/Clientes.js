/**
 * Modelo de dados (coleção)
 * Clientes
 */

// importação da biblioteca
const { model, Schema } = require('mongoose')

// criação da estrutura de dados ("coleção") que será usada no banco
const clienteSchema = new Schema({
    nomeCliente: {
        type: String
    },
    foneCliente: {
        type: String
    },
    cpf: {
        type: String,
        unique: true,
        index: true
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
}, {versionKey: false})

// importação do modelo de dados
// obs: Clientes será o nome da coleção (mongdb -> clientes)
module.exports = model('Clientes', clienteSchema)