//utilisation de REACT
//Pour connecter Apollo Client à React, nous encapsulons notre application dans le ApolloProvider du package @apollo/client.
// Nous passons notre instance client au ApolloProvidercomposant via le prop client.
// AP est similaire au fournisseur de contexte de React : encapulse l'app React et place client sur le contexte = ce qui nous permet d'y accéder depuis n'importe ou dans notre arborescence de composant


import {
    ApolloClient,
    NormalizedCacheObject,
    ApolloProvider
} from '@apollo/client';
import { cache } from './cache';
import React from 'react';
import ReactDOM from 'react-dom';
import Pages from './pages';
import injectStyles from './styles';

// Initialize ApolloClient
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    uri: 'http://localhost:4000/graphql',
});

injectStyles();

// Pass the ApolloClient instance to the ApolloProvider component
ReactDOM.render(
    <ApolloProvider client={client}>
        <Pages />
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
