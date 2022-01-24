import React from 'react';
import {
  gql,
  useMutation,
  useReactiveVar,
  Reference
} from '@apollo/client';

import { GET_LAUNCH_DETAILS } from '../pages/launch';
import Button from '../components/button';
import { cartItemsVar } from '../cache';
import * as LaunchDetailTypes from '../pages/__generated__/LaunchDetails';

export { GET_LAUNCH_DETAILS };

//requête = mutation car modifiable
export const CANCEL_TRIP = gql`
  mutation cancelTrip($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

interface ActionButtonProps extends Partial<LaunchDetailTypes.LaunchDetails_launch> {}
//permet de copier des propriétés et des méthodes d'une interface à une autre (héritage)

const CancelTripButton: React.FC<ActionButtonProps> = ({ id }) => {
    console.log(id);
  const [mutate, { loading, error }] = useMutation(
      CANCEL_TRIP,
      {
        variables: { launchId: id },
        update(cache, { data: { cancelTrip } }) {
          // Mettre à jour la liste des trajets en cache de l'utilisateur pour supprimer le trajet qui vient d'être annulé.
          const launch = cancelTrip.launches[0];
          cache.modify({
            id: cache.identify({
              __typename: 'User',
              id: localStorage.getItem('userId'),
            }),
            fields: {
              trips(existingTrips: Reference[], { readField }) {
                return existingTrips.filter(
                    tripRef => readField("id", tripRef) !== launch.id
                );
              }
            }
          });
        }
      }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>An error occurred - TEST JR</p>;

  return (
      <div>
        <Button
            onClick={() => mutate()}
            data-testid={'action-button'}
        >
          Cancel This Trip
        </Button>
      </div>
  );
};

const ToggleTripButton: React.FC<ActionButtonProps> = ({ id }) => {
  const cartItems = useReactiveVar(cartItemsVar);
  const isInCart = id ? cartItems.includes(id) : false;
  return (
      <div>
        <Button
            onClick={() => {
              if (id) {
                cartItemsVar(
                    isInCart
                        ? cartItems.filter(itemId => itemId !== id)
                        : [...cartItems, id]
                );
              }
            }}
            data-testid={'action-button'}
        >
          {isInCart ? 'Remove from Cart - Test JR' : 'Add to Cart - Test JR'}
        </Button>
      </div>
  );
}

const ActionButton: React.FC<ActionButtonProps> =
    ({ isBooked, id }) => (
        isBooked ? <CancelTripButton id={id} /> : <ToggleTripButton id={id} />
    );

export default ActionButton;
