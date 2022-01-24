import React from 'react';
import styled from 'react-emotion';
import { useApolloClient } from '@apollo/client';

import { menuItemClassName } from '../components/menu-item';
import { isLoggedInVar } from '../cache';
import { ReactComponent as ExitIcon } from '../assets/icons/exit.svg';

const LogoutButton = () => {
  const client = useApolloClient();
  return (
      <StyledButton
          data-testid="logout-button"

          onClick={() => {
            //1 - supprimer et ramasser l'objet utilisateur mis en cache
            client.cache.evict({ fieldName: 'me' });
            client.cache.gc();
            //méthodes evict et gc pour purger le champ Query.me de notre cache en mémoire
            //ce champs comprends des données spécifiques à l'utilisateur co qui doivent supprimées du cache lors que ce dernier se déconnecte
            //2 - supprimer les détails des utilisateurs du localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            //il efface localStorage, ou sont conservés le token et le userID
            //3 - définissez le statut de connexion sur false
            isLoggedInVar(false);
            //il définit la variable réactive isLoggedInVar à false qui envoie à chaque requête ce message de déco et affiche donc la page de connexion
          }}
      >
        <ExitIcon />
        Logout
      </StyledButton>
  );
}
//lorsque la var reactive change, ce changement est automatiquement diffucé à chaque requête qui dépends de la valeur de la variable (IS_LOGGED_IN)
//pour cette raison, lorsqu'un utilisateur clique sur le bouton de déco, le composant isLoggedIn se met à jour pour afficher l'écran de connexion

export default LogoutButton;

const StyledButton = styled('button')(menuItemClassName, {
  background: 'none',
  border: 'none',
  padding: 0,
});
