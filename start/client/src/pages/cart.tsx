//ici, nous interrogeont un champ côté client et utilisons le résultat de la reque GET_CART_ITEMS pour remplir notre interface utilisateur
import React, { Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Header, Loading } from '../components';
import { CartItem, BookTrips } from '../containers';
import { RouteComponentProps } from '@reach/router';
import { GetCartItems } from './__generated__/GetCartItems';

//Requête exportable pour être utilisable dans le projet
export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems @client
  }
`;
//@client à ajouter à chaque champs côté client = cela indique à Apollo de NE pas récupérer la valeur de ce champs sur notre serveur

//RouteComponent Props contient tout les informations que nous attendons d'une route path, location, navigate, etc.
interface CartProps extends RouteComponentProps {}

//fonction pour la requête qui défini la manière d'affichage
const Cart: React.FC<CartProps> = () => {
  const { data, loading, error } = useQuery<GetCartItems>(
      GET_CART_ITEMS
  );

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;

  return (
      //condition
      <Fragment>
        <Header>My Cart</Header>
        {data?.cartItems.length === 0 ? (
            <p data-testid="empty-message">No items in your cart</p>
        ) : (
            <Fragment>
              {data?.cartItems.map((launchId: any) => (
                  <CartItem key={launchId} launchId={launchId} />
              ))}
              <BookTrips cartItems={data?.cartItems || []} />
            </Fragment>
        )}
      </Fragment>
  );
}

export default Cart;
