require('dotenv').config();
const { ApolloServer } = require('apollo-server');
//importe la classe spécifique ApolloServer de Apollo-Server (bibliothèque)
const typeDefs = require('./schema');
//importe un schéma défini
const resolvers = require("./resolvers");
//importe les resolvers
const isEmail = require('isemail');
//import de la fonction isEmail (de la librairie) + ajout d'une fonction context au constructeur de ApolloServer

const LaunchAPI = require("./datasources/launch");
const UserAPI = require("./datasources/user");
//importe les deux fichiers en relation avec la BDD de launch et de user

const {createStore} = require("./utils");
const store = createStore();
//importation et appel de la méthode createStore() pour configurer notre BDD SQlite

const server = new ApolloServer({
    context: async ({ req }) => {
        // vérification de l'authentification
        const auth = req.headers && req.headers.authorization || '';
        const email = Buffer.from(auth, 'base64').toString('ascii');
        if (!isEmail.validate(email)) return { user: null };
        // trouver un utilisateur par son mail
        const users = await store.users.findOrCreate({ where: { email } });
        const user = users && users[0] || null;
        return { user: { ...user.dataValues } };
    },
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
//la fonction context est appelé une fois pour chaque opération Grapql que les clients envoient au serveur
//la valeur de retour devient l'argument context passé à chaque résolveur qui s'exécute dans el cadre de cette oépration
// par la création de cet objet context au début de l'exécution, tous les résolveurs peuvent accéder aux détails de l'utilisateur connecté et effectuer des actions spécifique QUE pour celui-ci

/*const server = new ApolloServer({
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
*/


server.listen().then(() => {
    //serveur qui écoute sur le port défini (4000) et renvoi du console.log si la promise fonctionne
    console.log(`
    Server is running!
    Listening on port 4000
    Explore at https://studio.apollographql.com/sandbox
    test server - OK au VN
  `);
});