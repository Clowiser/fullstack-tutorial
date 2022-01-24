import React from 'react';
import {gql, useMutation} from "@apollo/client";

import {cartItemsVar} from "../cache";
import * as GetCartItemsTypes from '../pages/__generated__/GetCartItems';
import * as BookTripsTypes from './__generated__/BookTrips';
import {Button} from "../components";

//dans notre requête, on cherche à savoir si notre book est un succès, un message (?? peut-être un message à afficher) et à récup le launch par son id et vérifier si true/false il est réservé
export const BOOK_TRIPS = gql`
    mutation BookTrips($launchIds: [ID]!) {
        bookTrips(launchIds: $launchIds) {
            success
            message
            launches {
                id
                isBooked
            }
        }
    }
`;

interface BookTripsProps extends GetCartItemsTypes.GetCartItems {}

const BookTrips: React.FC<BookTripsProps> = ({ cartItems }) => {
  const [bookTrips, { data }] = useMutation<
      BookTripsTypes.BookTrips,
      BookTripsTypes.BookTripsVariables
      >
  (
      BOOK_TRIPS,
      {
        variables: { launchIds: cartItems },
      }
  );
  //la mutation nécesste la liste des launchIds, qu'elle obtient à partir du panier stocké localiement de l'utilisateur

  //après le retour de la fonction bookTrips, nous appelons cartItemsVar([]) pour effacer le panier de l'utilisateur car les voyages du panier ont été réservé
  return data && data.bookTrips && !data.bookTrips.success
      ? <p data-testid="message">{data.bookTrips.message}</p>
      : (
          <Button
              onClick={async () => {
                await bookTrips();
                cartItemsVar([]);
              }}
              data-testid="book-button"
          >
            Book All
          </Button>
      );
}

//ce composant exécute la mutation BOOK_TRIPS lorsque le bouton est cliqué

export default BookTrips;
