//c'est le cache (la ou sont "stockés" les données déjà chargées par le navigateur du client) qui va nous servir pour le fetchmore
//En modifiant l'initialisation du cache pour ajouter une fonction merge pour le champ launch

import {InMemoryCache, makeVar, Reference} from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                isLoggedIn:{
                    read() {
                        return isLoggedInVar();
                    }
                },
                cartItems: {
                    read() {
                        return cartItemsVar();
                    }
                },
                launches: {
                    keyArgs: false,
                    merge(existing, incoming) {
                        let launches: Reference[] = [];
                        if (existing && existing.launches) {
                            launches = launches.concat(existing.launches);
                        }
                        if(incoming && incoming.launches) {
                            launches = launches.concat(incoming.launches)
                        }
                        return {
                            ...incoming,
                            launches,
                        };
                    }
                }
            }
        }
    }
});
//1 - RIEN COMPRIS DU CODE XD
//cette fonction merge prend les lancements existants en cache et les lancements incomings (entrant) et les combine en une seule liste, qu'elle renvoie ensuite.
//maintenant en cliquant sur le bouton, cela affiche la suite des lancements

//2 - Ajoutons des politiques de champs pour Query.isLoogegIn et Query.cartItems
// Nos deux politiques de champ comprennent chacune un seul champ : une readfonction . Apollo Client appelle la fonction read d'un champ chaque fois que ce champ est interrogé.
// Le résultat de la requête utilise la valeur de retour de la fonction comme valeur du champ,
// quelle que soit la valeur dans le cache ou sur votre serveur GraphQL.


export const isLoggedInVar = makeVar<boolean>(!!localStorage.getItem(('token' || '')));
export const cartItemsVar = makeVar<string[]>([]);
//ici, nous définissons 2 variables réactives, une pour chacun de nos champs de schéma côté client (dans index.tsx).
//la valeur à chaque appel makeVar définit la valeur initiale de la variable.
//les valeurs de ces 2 variables sont des fonctions :
//si on appelle une fonction de variable réactive avec 0 argument, elle renvoie la valeur actuelle de la var
//si on appelle une fonction de VR avec n argument, elle remplace la valeur acutelle de la var par la valeur fournie
