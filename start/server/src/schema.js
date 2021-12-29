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
        launches: [Launch]!
        launch(id: ID!): Launch
        me: User
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
module.exports = typeDefs;