//utilisation de REACT
//Pour connecter Apollo Client à React, nous encapsulons notre application dans le ApolloProvider du package @apollo/client.
// Nous passons notre instance client au ApolloProvidercomposant via le prop client.
// AP est similaire au fournisseur de contexte de React : encapulse l'app React et place client sur le contexte = ce qui nous permet d'y accéder depuis n'importe ou dans notre arborescence de composant

import {
    ApolloClient,
    NormalizedCacheObject,
    ApolloProvider, gql, useQuery
} from '@apollo/client';
import { cache } from './cache';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';
import injectStyles from './styles';
import Login from "./pages/login";

//définir un schéma côté client
export const typeDefs = gql`
extend type Query {
    isLoggedIn : Boolean!
    cartItems: [ID!]!
}
`;
//ici nous étendons le type Query du schema.js déjà définit, en ajoutant 2 champs
//isLoggedIn, pour savoir si l'utilisateur a une session active
//cartItems, pour suivre les lancements que l'utilisateur a ajoutés à son panier

//statut de connexion - renvoie si le client est connecté
const IS_LOGGED_IN = gql`
query isUserLoggedIn{
    isLoggedIn @client
}
`;
function IsLoggedIn(){
    const {data} = useQuery(IS_LOGGED_IN);
    return data.isLoggedIn ? <Pages /> : <Login />;
}
// Le composant IsLoggedIn exécute la requête IS_LOGGED_IN et restitue différents composants en fonction du résultat :
// Si l'utilisateur n'est pas connecté, le composant affiche l'écran de connexion de notre application.
// Sinon, le composant affiche la page d'accueil de notre application.

// Initialise ApolloClient
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    uri: 'http://localhost:4000/graphql',
    headers: {
        authorization : localStorage.getItem("token") || '',
    },
    typeDefs,
});
//avec header: {...}, on définit un ensemble par défaut de headers qui est appliqué à chaque requête GraphQL
//notre serveur ne peut ignorer le jeton lors que la résolution d'opération qui n'en n'ont pas besoin (telles que la récup de la liste de lancements),
//il est donc normal que notre client (Apollo) inclue le jetoin dans chaque requête
//là, on vérifie que notre utilisateur peut faire ce qu'il est en train de faire.

//avec typeDefs, nous fournissons le schéma côté client.

injectStyles();

// Pass the ApolloClient instance to the ApolloProvider component
/*ReactDOM.render(
    <ApolloProvider client={client}>
        <Pages />
    </ApolloProvider>,
    document.getElementById('root')
);*/

ReactDOM.render(
    <ApolloProvider client={client}>
        <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById('root')
);















/*
//ANCIENNE VERSION
import React from 'react';

import {
    ApolloClient,
    NormalizedCacheObject,
    ApolloProvider,
    gql,
    useQuery
} from '@apollo/client';

//import Pages from './pages';
//import Login from './pages/login';
//import injectStyles from './styles';
import { cache } from './cache';

console.log("test - côté client");

// instal du apollo client
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    uri: 'http://localhost:4000/graphql',
});
//uri = adresse de notre serveur
//cache = instance de InMemoryCache, importer depuis cache.ts


//test d'une requète client à partir du client (et non du server)
client.query({
    query: gql`
        query TestFirstQuery {
            launch(id : 56){
                mission {
                    name
                }
                rocket {
                    name
                }
            }
        }
    `
}).then(result => console.log(result));
//OK Resultat dans la console
*/
