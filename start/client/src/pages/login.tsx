import React from 'react';
import {gql, useMutation } from "@apollo/client";

import { LoginForm, Loading } from '../components';
import * as LoginTypes from './__generated__/Login';
import { isLoggedInVar} from "../cache";
//isLoggedInVar = variable réactive du cache

//requête
export const LOGIN_USER = gql`
mutation Login($email: String!){
  login(email: $email){
    id
    token
  }
}
`;
//Nous recevons un objet User dans la réponse de login, qui comprend deux champs que nous utiliserons :
// L'utilisateur id, que nous utiliserons pour récupérer des données spécifiques à l'utilisateur dans les futures requêtes
// Une session token, que nous utiliserons pour "authentifier" les futures opérations GraphQL

export default function Login() {
const [login, {loading, error}] = useMutation<
    LoginTypes.Login,
    LoginTypes.LoginVariables
>(
    LOGIN_USER,
    {
    onCompleted({login}){
    if (login){
      localStorage.setItem('token', login.token as string);
      localStorage.setItem('userId', login.id as string);
      isLoggedInVar(true);
      //ici définit à vrai dans le login
    }
  },})
    if (loading) return <Loading />;
    if (error) return <p>An error</p>;

    return <LoginForm login={login} />;
    //loginForm = formulaire
  }
  //stocke l'ID unique et le jeton de session de l'utilisateur dans localStorage, afin
  //que nous puissions charger ces valeurs dans le cache en mémoire la prochaine fois que l'utilisateur visitera notre application.


//le premier objet (LoginTypes) du tuple (login) est la fonction de mutation que nous appelons pour exécuter la mutation.
//nous passons à cette fonction le composant LoginForm
//le second objet du tuple est similaire à l'objet de résultat envoyé par useQuery avec le loading et le error

//Désormais, chaque fois qu'un utilisateur soumet le formulaire de connexion, notre mutation login est appelée.
// Le token de l'utilisateur est stocké dans le cache en mémoire, mais nous voulons que ce jeton soit disponible lors de
// plusieurs visites dans le même navigateur.
