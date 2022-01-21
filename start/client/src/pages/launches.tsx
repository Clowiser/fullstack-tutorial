import React, { Fragment, useState }  from 'react';
import { RouteComponentProps } from '@reach/router';
import { gql, useQuery } from '@apollo/client'
import {LaunchTile, Header, Button, Loading} from "../components";
import * as GetLaunchListTypes from './__generated__/GetLaunchList';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

//définir la forme de la requète utilisé pour récupérer une liste paginée de lancement
export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;
//le LaunchTile est inclut dans la requête, sans l'avoir réécrit en entière mais simplement en la préfixant des ...
//pagination : hasMore & cursor
//hasMore : indique s'il existe des launches supplémentaire au-dela de la liste renvoyée par le serveur (+ qui sont affiché sur la page)
//cursor : indique la position actuel du client dans les listes des lancements
//on pourrait fournir la valeur de la variable after pour récupérer le prochain ensembe des lancements dans la liste (after: $after)

interface LaunchesProps extends RouteComponentProps {}

//ce composant transmet notre requête GET_LAUNCHES à UseQuerry et obient data, loading & error à partir du résultat
//selon l'état de ces propriétés, nous affichons une liste de lancement (data), un indicateur de chargement ("chargement en cours" - loading) ou un message d'erreur (error)
const Launches: React.FC<LaunchesProps> = () => {
  const {
    data,
    loading,
    error,
    fetchMore
      //ajout de fetchMore pour aider dans les requêtes paginées = ici c'est pour la suite de la liste de launches
  } = useQuery<
      GetLaunchListTypes.GetLaunchList,
      GetLaunchListTypes.GetLaunchListVariables
      >(GET_LAUNCHES);
  const [isLoadingMore, setIsLoadingMore] = useState(false); //variable d'état

  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
      <Fragment>
        <Header />
        {data.launches &&
            data.launches.launches &&
            data.launches.launches.map((launch: any) => (
                <LaunchTile key={launch.id} launch={launch} />
            ))}
        {data.launches && data.launches.hasMore && (isLoadingMore ? <Loading/> : <Button onClick={async () => {
          setIsLoadingMore(true)
          await fetchMore({
            variables: {
              after: data.launches.cursor,
            },
          });
          setIsLoadingMore(false);
        }}
          >
          Load More Launches
        </Button>
        )}
      </Fragment>
  );
}

// Au re-lancement du serveur et du client avec npm start : affichage des 20 lancementss (220 par défaut) YAHOU!!!

//le bouton "Load More Launches"
//après MAJ de FetchMore, nous pouvons connecter ce dernier à un bouton dans le launches.tsx qui récupère les lancement supplémentaires lorsqu'il est cliqué
//lorsque le bouton est cliqué, il appelle FetchMore (en passant le cursor courant comme valeur de la variable after) et affiche un avis de chargement jusqu'à ce que la reque renvoie des résultats
//Par contre, à ce stade, en cliquant sur le bouton, aucun lancement n'apparait... la requête est bien envoyée, elle réponds avec une liste de lancement.
//Cependant, AC garde ces listes séparées car elles représentent les résultats de requêtes avec différentes caleurs de variables (dans ce cas, la valeur de after)
//Nous avons besoin de AC pour fusionner les lancements de notre requête fetchMore avec les lancements de notre requêtes d'origines et c'est ou?.... dans le CACHE!!
export default Launches;
