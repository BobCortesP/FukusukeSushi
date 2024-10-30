require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {ApolloServer, gql} = require('apollo-server-express');

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_CLUSTER}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Cliente = require('./models/cliente');
const Dueno = require('./models/dueno');

const typeDefs = gql`
type Cliente{
    id: ID!
    run: String!
    nombreCompleto: String!
    direccion: String!
    comuna: String!
    provincia: String!
    region: String!
    fechaNacimiento: String!
    sexo: String!
    email: String!
    telefono: String!
}
input ClienteInput{
    run: String!
    nombreCompleto: String!
    direccion: String!
    comuna: String!
    provincia: String!
    region: String!
    fechaNacimiento: String!
    sexo: String!
    email: String!
    telefono: String!
}
type Dueno{
    id: ID!
    nombre: String!
}
input DuenoInput{
    nombre: String!
}
type Alert{
    message: String!
}
type Query{
    getClientes: [Cliente]
    getClienteByID(id: ID!): Cliente
    getClientesByRun(run: String!): [Cliente]
    getDuenos: [Dueno]
    getDuenoByID(id: ID!): Dueno
}
type Mutation{
    addCliente(input:ClienteInput): Cliente
    updCliente(id: ID!, input:ClienteInput): Cliente
    delCliente(id: ID!): Alert
    addDueno(input:DuenoInput): Dueno
    updDueno(id: ID!, input:DuenoInput): Dueno
    delDueno(id: ID!): Alert
}
`;

const resolvers = {
    Query:{
        async getDuenos(obj){
            let duenos = await Dueno.find();
            return duenos;
        },
        async getDuenoByID(obj, {id}){
            let dueno = await Dueno.findById(id);
            return dueno;
        },
        async getClientes(obj){
            let clientes = await Cliente.find();
            return clientes;
        },
        async getClienteByID(obj, {id}){
            let cliente = await Cliente.findById(id);
            return cliente;
        },
        async getClientesByRun(obj, {run}){
            let clientes = await Cliente.find({run: run});
            return clientes;
        }
    },
    Mutation:{
        async addCliente(obj, {input}){
            let cliente = new Cliente(input);
            await cliente.save();
            return cliente;
        },
        async updCliente(obj, {id, input}){
            let cliente = await Cliente.findByIdAndUpdate(id, input, { new: true });
            return cliente;
        },
        async delCliente(obj, {id}){
            await Cliente.deleteOne({_id: id});
            return {
                message: "Cliente eliminado"
            };
        },
        async addDueno(obj, {input}){
            let dueno = new Dueno(input);
            await dueno.save();
            return dueno;
        },
        async updDueno(obj, {id, input}){
            let dueno = await Dueno.findByIdAndUpdate(id, input, { new: true });
            return dueno;
        },
        async delDueno(obj, {id}){
            await Dueno.deleteOne({_id: id});
            return {
                message: "Dueño eliminado"
            };
        }
    }
}

let apolloServer = null;
const app = express();

const corsOptions = {
    origin: 'http://localhost:8091',
    credentials: false
}

async function startServer(){
    apolloServer = new ApolloServer({typeDefs, resolvers, corsOptions});
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: false });
}

startServer();
app.use(cors());
app.listen(8091, function(){
    console.log("Servidor iniciado");
});