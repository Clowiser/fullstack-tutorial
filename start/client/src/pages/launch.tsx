import React, { Fragment } from 'react';
import { gql, useQuery } from '@apollo/client';
import { LAUNCH_TILE_DATA } from './launches';
import { Loading, Header, LaunchDetail } from '../components';
import { ActionButton } from '../containers';
import { RouteComponentProps } from '@reach/router';
import * as LaunchDetailsTypes from './__generated__/LaunchDetails';

//En lettres capitales = query
//on définit donc ici la query
export const GET_LAUNCH_DETAILS = gql`
  query LaunchDetails($launchId: ID!) {
    launch(id: $launchId) {
      site
      rocket{
        type
    }
        ...LaunchTile
      }
    }
  ${LAUNCH_TILE_DATA}
`;
//cette requête inclut tous les détails dont nous avons besoin pour la page
//Nous réutilisons le fragement LAUNCH_TILE_DATA déjà défini dans launches.tsx

interface LaunchProps extends RouteComponentProps {
  launchId?: any;
}

const Launch: React.FC<LaunchProps> = ({ launchId }) => {
  const {
    data,
    loading,
    error,
  } = useQuery<
      LaunchDetailsTypes.LaunchDetails,
      LaunchDetailsTypes.LaunchDetailsVariables
      >(GET_LAUNCH_DETAILS,
      { variables: { launchId } }
  );

  if (loading) return <Loading />;
  if (error) return <p>ERROR: {error.message}</p>;
  if (!data) return <p>Not found</p>;

  return (
      <Fragment>
        <Header image={data.launch && data.launch.mission && data.launch.mission.missionPatch}>
          {data && data.launch && data.launch.mission && data.launch.mission.name}
        </Header>
        <LaunchDetail {...data.launch} />
        <ActionButton {...data.launch} />
      </Fragment>
  );
}
//on a toujours la data, le loading et le error

export default Launch;