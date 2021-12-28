module.exports = {
    Query: {
        launches: (_, __, { dataSources }) =>
            dataSources.launchAPI.getAllLaunches(),
        launch: (_, { id }, { dataSources }) =>
            dataSources.launchAPI.getLaunchById({ launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    }

    // ici, nous définissons nos résolveurs dans une carte avec un type Query et 3 champs (laucnhes, launch, me) de notre schéma
};