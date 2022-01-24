const { gql } = require('apollo-server');
const typeDefs = gql`
    type Launch {
        id: ID!
        site: String
        mission: Mission
        rocket: Rocket
        isBooked: Boolean!
    }
    
    type Mission {
        name: String
        missionPatch(size: PatchSize): String
    }

    enum PatchSize {
        SMALL
        LARGE
    }
    
    type Rocket { 
        id: ID!
        name: String
        type: String
    }

    type User {
        id: ID!
        email: String!
        trips: [Launch]!
        token: String
    }
    
    type Query {
        launches(
            """
            The number of results to show. Must be >= 1. Default = 20
            """
            pageSize: Int
            """
            If you add a cursor here, it will only return results _after_ this cursor
            """
            after: String
        ): LaunchConnection!
        launch(id: ID!): Launch
        me: User
    }

        """
        Simple wrapper around our list of launches that contains a cursor to the
        last item in the list. Pass this cursor to the launches query to fetch results
        after these.
        """
        type LaunchConnection { # add this below the Query type as an additional type.
        cursor: String!
        hasMore: Boolean!
        launches: [Launch]!
    }
    

    type Mutation {
        bookTrips(launchIds: [ID]!): TripUpdateResponse!
        cancelTrip(launchId: ID!): TripUpdateResponse!
        login(email: String): User
    }
    
    type TripUpdateResponse {
        success : Boolean!
        message : String
        launches : [Launch]
    }
`;

//le type Query a trois type de champs launches, launch et me
//le type TripUpdateResponse est lié avec le type mutation avec les bookTrips, les cancel Trip et le login
module.exports = typeDefs;