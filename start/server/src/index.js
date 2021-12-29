require('dotenv').config();
const { ApolloServer } = require('apollo-server');
//importe la classe spécifique ApolloServer de Apollo-Server (bibliothèque)
const typeDefs = require('./schema');
//importe un schéma défini
const resolvers = require("./resolvers");
//importe les resolvers

const LaunchAPI = require("./datasources/launch");
const UserAPI = require("./datasources/user");
//importe les deux fichiers en relation avec la BDD de launch et de user

const {createStore} = require("./utils");
const store = createStore();
//importation et appel de la méthode createStore() pour configurer notre BDD SQlite

const server = new ApolloServer({
    typeDefs,
//création d'instance de AS et lui transmet le schéma importé via typeDefs
    resolvers,
//on fournit la carte de resolveurs à AS, il sait comment appeler les fonctions (launches, launch et me) selon les besoins pour rep aux requêtes entrantes
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        // on utilise this.context dans notre BDD (en global) -> essentiel de créer une new instance de cette source de donnée de la méthode DataSources
        userAPI: new UserAPI({ store})
    })
});

server.listen().then(() => {
    //serveur qui écoute sur le port défini (4000) et renvoi du console.log si la promise fonctionne
    console.log(`
    Server is running!
    Listening on port 4000
    Explore at https://studio.apollographql.com/sandbox
    test server - OK au VN
  `);
});