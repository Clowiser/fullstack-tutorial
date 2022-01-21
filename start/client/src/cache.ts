import {InMemoryCache, makeVar, Reference} from '@apollo/client';

export const cache: InMemoryCache = new InMemoryCache({});

export const cartItemsVar = makeVar<string[]>([]);