const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {ApolloServer, gql} = require('apollo-server-express');

mongoose.connect('mongodb+srv://Amaro_Alvial:tl3ikbcYqOwqZjDW@cluster0.4w6mw.mongodb.net/FukusukeSushi?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const Dueno = require('./models/dueno');

const typeDefs = gql`
type Dueno{
    id: ID!
    nombre: String!
    pass: String!
}
input DuenoInput{
    nombre: String!
    pass: String!
}
type Alert{
    message: String!
}
type Query{
    getDuenos: [Dueno]
    getDuenoByID(id: ID!): Dueno
}
type Mutation{
    addDueno(input:DuenoInput): Dueno
    updDueno(id: ID!, input:DuenoInput): Dueno
    delDueno(id: ID!): Alert
}
`;

const resolvers = {
    Query:{
        async getDuenos(obj){
            duenos = await Dueno.find();
            return duenos;
        },
        async getDuenoByID(obj, {id}){
            dueno = await Dueno.findById(id);
            return dueno;
        }
    },
    Mutation:{
        async addDueno(obj, {input}){
            dueno = new Dueno(input);
            await dueno.save();
            return dueno;
        },
        async updDueno(obj, {id, input}){
            dueno = await Dueno.findByIdAndUpdate(id, input, { new: true });
            return dueno;
        },
        async delDueno(obj, {id}){
            await Dueno.deleteOne({_id: id});
            return {
                message: "Dueño eliminado"};
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
})

