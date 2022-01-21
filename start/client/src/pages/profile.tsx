import React, {Fragment} from 'react';
import { RouteComponentProps } from '@reach/router';
import { gql, useQuery } from '@apollo/client'
import {LaunchTile, Header, Button, Loading} from "../components";
import { LAUNCH_TILE_DATA } from './launches';
import * as GetMyTripsTypes from './__generated__/GetMyTrips';

//définition de la query
export const GET_MY_TRIP = gql`
query GetMyTrip {
  me {
    id
    email
    trips {
      ...LaunchTile
    }
  }
}
${LAUNCH_TILE_DATA}
`;

interface ProfileProps extends RouteComponentProps {}

//défini la manière d'affichage
const Profile: React.FC<ProfileProps> = () => {
  const {
    data,
    error,
    loading
  } = useQuery<GetMyTripsTypes.GetMyTrips>(
      GET_MY_TRIP,
      {fetchPolicy: "network-only"}
  );
  if (loading) return <Loading />;
  if (error) return <p>ERROR : {error.message}</p>;
  if (data === undefined) return <p>ERROR</p>;

  return (
      <Fragment>
        <Header>My Trips</Header>
        {data.me && data.me.trips.length ? (data.me.trips.map((launch : any) => (
            <LaunchTile key={launch.id} launch={launch} />
          ))
        ) : (
            <p>You haven't booked any trips. Do you want to go space ?</p>
        )}
      </Fragment>
  );
}

export default Profile;