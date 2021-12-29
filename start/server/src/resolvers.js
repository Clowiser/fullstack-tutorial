module.exports = {
    Query: {
        launches: (_, __, { dataSources }) =>
            dataSources.launchAPI.getAllLaunches(),
        launch: (_, { id }, { dataSources }) =>
            dataSources.launchAPI.getLaunchById({ launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    },
    Mission: {
        // The default size is 'LARGE' if not provided
        missionPatch: (mission, { size } = { size: 'LARGE' }) => {
            return size === 'SMALL'
                ? mission.missionPatchSmall
                : mission.missionPatchLarge;
        },
    },
    Launch: {
        isBooked: async (launch, _, { dataSources }) =>
            dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
    },
    User: {
        trips: async (_, __, { dataSources }) => {
            // get ids of launches by user
            const launchIds = await dataSources.userAPI.getLaunchIdsByUser();
            if (!launchIds.length) return [];
            // look up those launches by their ids
            return (
                dataSources.launchAPI.getLaunchesByIds({
                    launchIds,
                }) || []
            );
        },
    },

    // ici, nous définissons nos résolveurs dans une carte avec un type Query et 3 champs (laucnhes, launch, me) de notre schéma
    /*
    * fieldName: (parent, args, context, info) => data;
    1 -
    => Les trois fonctions de résolveur attribuent leur premier argument de position (parent) à la variable _ , par convention pour indiquer qu'elles n'utilisent pas sa valeur.
    => Même raison pour les fonctions launches et me qui attribuent en deuxième argument (args) la variable __
        (la fonction launch n'utilise pas d'argument, mais elle possède un argument dans le schéma (schema.js))
    => les trois fonctions n'utilisent pas le troisième argument (context ?)
        (ils le destructurent pour accéder à ce qui nous avons défini dans contextdataSource - launch.js)
    => Aucune des fonctions n'inclut le quatrième argument (info), car ne l'utilisent pas et pas nécessaire de l'inclure.

    2 -
    => on ajoute un nouveau resolver Mission qui obtient un patch Large ou Small, qui est l'objet renvoyé par le resolveur par défaut pour le champ parent dans notre schema

    3 -
    Maintenant que nous savons comment ajouter des résolveurs pour les types en plus de Query,
    ajoutons quelques résolveurs pour les champs des types Launch et User.
    * Comment le serveur connait l'identité de l'utilisateur actuel lorsqu'il appelle des fonctions telles que getLaunchIdsByUser ? Ce n'est pas encore le cas.
    */
};