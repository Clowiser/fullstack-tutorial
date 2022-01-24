//un resolveur est une fonction chargée de remplir les données d'un champ unique du schéma (ex : schéma avec pomme : nom, type, prix - le r remplit un seul champ, celui spécifié)

const { paginateResults } = require('./utils');
//import de la fonction paginateResults
//la paginate, si elle est définit, nous donne le nombre de résultat souhaité dans une même page

module.exports = {
    Query: {
        launches: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allLaunches = await dataSources.launchAPI.getAllLaunches();
            // we want these in reverse chronological order
            allLaunches.reverse();
            const launches = paginateResults({
                after,
                pageSize,
                results: allLaunches
            });
            return {
                launches,
                cursor: launches.length ? launches[launches.length - 1].cursor : null,
                // if the cursor at the end of the paginated results is the same as the
                // last item in _all_ results, then there are no more results after this
                hasMore: launches.length
                    ? launches[launches.length - 1].cursor !==
                    allLaunches[allLaunches.length - 1].cursor
                    : false
            };
        },
        launch: (_, { id }, { dataSources }) =>
            dataSources.launchAPI.getLaunchById({ launchId: id }),
        me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    },
    Mutation : {
        //mutation: ce qui peut être modidié (ok user, booktrip & canceltrip)
        login: async (_, {email}, {dataSources}) => {
            const user = await dataSources.userAPI.findOrCreateUser({email});
            if (user) {
                user.token = Buffer.from(email).toString('base64');
                return user;
            }
        },
        //ce resolver prend une adresse e-mail et renvoie les données d'un utilisateur correspondant à notre APIuser
        //ajout d'un champ token à l'objet pour représenter la session active de l'utilisateur
        //!! attention, cette méthode n'est pas du tout sécurité et ne doit pas être utilisée pour les app de production

        bookTrips: async (_, {launchIds}, {dataSources}) => {
            const result = await dataSources.userAPI.bookTrips({launchIds});
            const launches = await dataSources.launchAPI.getLaunchByIds({
                launchIds
            });
            return {
                success: result && result.length === launchIds.length,
                message:
                    result.length === launchIds.length
                        ? 'trips booked successfully / la réservation est un succes'
                        : `the following launches couldn't be booked: ${launchIds.filter(
                            id => !result.includes(id),
                        )}`,
                launches,
            }
        },
        cancelTrip : async (_, {launchIds}, {dataSources}) => {
            const result = await dataSources.userAPI.cancelTrip({launchIds});

            if(!result)
                return {
                success: false,
                    message: 'failed to cancel trip',
                }
            //si le result est différent retourne faux et le message

            const launch = await dataSources.launchAPI.getLaunchById({launchIds})
            return {
                success: true,
                message: 'trip cancel / voyage annulé',
                launches : [launch],
            }
        }
        //pour correspondre au shcéma, ces  r renvoient tous les deux un objet conforme à la structure du type TripUpdateResponse avec un indicateur success,
        // un message de statut et un tableau launches indiquant que la mutation a été réservé ou annulé
    },


    Mission: {
        // The default size is 'LARGE' if not provided
        missionPatch: (mission, { size } = { size: 'LARGE' }) => {
            return size === 'SMALL'
                ? mission.missionPatchSmall
                : mission.missionPatchLarge;
            //condition ? exprSiVrai : exprSiFaux
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
                await dataSources.launchAPI.getLaunchByIds({
                    launchIds,
                }) || []
            );
        },
    },

    // ici, nous définissons nos résolveurs dans une carte avec un type Query et 3 champs (laucnhes, launch, me) de notre schéma
    /*
    * fieldName: (parent, args, context, info) => data;
    1 -
    => Les trois fonctions de résolveur attribuent leur premier argument de position (parent) à la variable _ ,
    par convention pour indiquer qu'elles n'utilisent pas sa valeur.
    => Même raison pour les fonctions launches et me qui attribuent en deuxième argument (args) la variable __
        (la fonction launch n'utilise pas d'argument, mais elle possède un argument dans le schéma (schema.js))
    => les trois fonctions n'utilisent pas le troisième argument (context ?)
        (ils le destructurent pour accéder à ce qui nous avons défini dans contextdataSource - launch.js)
    => Aucune des fonctions n'inclut le quatrième argument (info), car ne l'utilisent pas et pas nécessaire de l'inclure.

    2 -
    => on ajoute un nouveau resolver Mission qui obtient un patch Large ou Small, qui est l'objet renvoyé par le resolveur par défaut
    pour le champ parent dans notre schema

    3 -
    Maintenant que nous savons comment ajouter des résolveurs pour les types en plus de Query,
    ajoutons quelques résolveurs pour les champs des types Launch et User.
    * Comment le serveur connait l'identité de l'utilisateur actuel lorsqu'il appelle des fonctions telles que getLaunchIdsByUser ? Ce n'est pas encore le cas.
    */
};