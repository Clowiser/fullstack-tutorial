require('dotenv').config();

const { ApolloServer } = require('apollo-server');
//importe la classe ApolloServer de AS

const typeDefs = require('./schema');
//importe un schéma encore non défini

const server = new ApolloServer({ typeDefs });
//création d'instance de AS et lui transmet le schéma importé via typeDefs

server.listen().then(() => {
    console.log(`
    Server is running!
    Listening on port 4000
    Explore at https://studio.apollographql.com/sandbox
  `);
});