//c'est le cache (la ou sont "stockés" les données déjà chargés par le navigateur du client) qui va nous servir pour le fetchmore
//En modifiant l'initialisation du cache pour ajouter une fonction merge pour le champ launch

import {InMemoryCache, makeVar, Reference} from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
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
//RIEN COMPRIS DU CODE XD
//cette fonction merge prend les lancements existants en cache et les lancements incomings (entrant) et les combine en une seule liste, qu'elle renvoie ensuite.
//maintenant en cliquant sur le bouton, cela affiche la suite des lancements

export const cartItemsVar = makeVar<string[]>([]);