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
const Persona = require('./models/persona');
const Usuario = require('./models/usuario');

const typeDefs = gql`
type Persona{
    id: ID!
    run: String!
    nombreCompleto: String!
    direccion: String!
    comuna: String!
    provincia: String!
    region: String!
    fechaNacimiento: String!
    sexo: String!
    telefono: String!
}
input PersonaInput{
    run: String!
    nombreCompleto: String!
    direccion: String!
    comuna: String!
    provincia: String!
    region: String!
    fechaNacimiento: String!
    sexo: String!
    telefono: String!
}
type Usuario{
    id: ID!
    email: String!
    pass: String!
    nombreUsuario: String!
}
input UsuarioInput{
    email: String!
    pass: String!
    nombreUsuario: String!
}
type Cliente{
    id: ID!
    persona: String!
    usuario: String!
}
input ClienteInput{
    persona: String!
    usuario: String!
}
type Dueno{
    id: ID!
    persona: String!
    usuario: String!
}
input DuenoInput{
    persona: String!
    usuario: String!
}
type Alert{
    message: String!
}
type Query{
    getPersonas: [Persona]
    getPersonaById(id: ID!): Persona
    getPersonaByRun(run: String!): Persona
    getUsuarios: [Usuario]
    getUsuarioById(id: ID!): Usuario
    getClientes: [Cliente]
    getClienteById(id: ID!): Cliente
    getClienteByIdUsuario(id: ID!): Cliente
    getDuenos: [Dueno]
    getDuenoById(id: ID!): Dueno
}
type Mutation{
    addPersona(input:PersonaInput): Persona
    updPersona(id: ID!, input:PersonaInput): Persona
    delPersona(id: ID!): Alert
    addUsuario(input:UsuarioInput): Usuario
    updUsuario(id: ID!, input:UsuarioInput): Usuario
    delUsuario(id: ID!): Alert
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
        async getPersonas(obj){
            let personas = await Persona.find();
            return personas;
        },
        async getPersonaById(obj, {id}){
            let persona = await Persona.findById(id);
            return persona;
        },
        async getPersonaByRun(obj, {run}){
            let persona = await Persona.findOne({run: run});
            return persona;
        },
        async getUsuarios(obj){
            let usuarios = await Usuario.find();
            return usuarios;
        },
        async getUsuarioById(obj, {id}){
            let usuario = await Usuario.findById(id);
            return usuario;
        },
        async getClientes(obj){
            let clientes = await Cliente.find();
            return clientes;
        },
        async getClienteById(obj, {id}){
            let cliente = await Cliente.findById(id);
            return cliente;
        },
        async getClienteByIdUsuario(obj, {id}){
            let cliente = await Cliente.findById(id).populate('usuario');
            return cliente;
        },
        async getDuenos(obj){
            let duenos = await Dueno.find();
            return duenos;
        },
        async getDuenoById(obj, {id}){
            let dueno = await Dueno.findById(id);
            return dueno;
        }
    },
    Mutation:{
        async addPersona(obj, {input}){
            let persona = new Persona(input);
            await persona.save();
            return persona;
        },
        async updPersona(obj, {id, input}){
            let persona = await Persona.findByIdAndUpString(id, input, { new: true });
            return persona;
        },
        async delPersona(obj, {id}){
            await Persona.deleteOne({_id: id});
            return {
                message: "Persona eliminada"
            };
        },
        async addUsuario(obj, {input}){
            let usuario = new Usuario(input);
            await usuario.save();
            return usuario;
        },
        async updUsuario(obj, {id, input}){
            let usuario = await Usuario.findByIdAndUpString(id, input, { new: true });
            return usuario;
        },
        async delUsuario(obj, {id}){
            await Usuario.deleteOne({_id: id});
            return {
                message: "Usuario eliminado"
            };
        },
        async addCliente(obj, {input}){
            let usuarioBus = await Usuario.findById(input.usuario);
            let personaBus = await Persona.findById(input.persona);
            let cliente = new Cliente({usuario: usuarioBus._id, persona: personaBus._id});
            await cliente.save();
            return cliente;
        },
        async updCliente(obj, {id, input}){
            let usuarioBus = await Usuario.findById(input.usuario);
            let personaBus = await Persona.findById(input.persona);
            let cliente = await Cliente.findByIdAndUpString(id, {usuario: usuarioBus._id, persona: personaBus._id}, { new: true });
            return cliente;
        },
        async delCliente(obj, {id}){
            await Cliente.deleteOne({_id: id});
            return {
                message: "Cliente eliminado"
            };
        },
        async addDueno(obj, {input}){
            let usuarioBus = await Usuario.findById(input.usuario);
            let personaBus = await Persona.findById(input.persona);
            let dueno = await Dueno.findByIdAndUpString(id, {usuario: usuarioBus._id, persona: personaBus._id});
            await dueno.save();
            return dueno;
        },
        async updDueno(obj, {id, input}){
            let usuarioBus = await Usuario.findById(input.usuario);
            let personaBus = await Persona.findById(input.persona);
            let dueno = await Dueno.findByIdAndUpString(id, {usuario: usuarioBus._id, persona: personaBus._id}, { new: true });
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