const { RESTDataSource } = require('apollo-datasource-rest');
/*
const [...] -> obtient la propriété RESTDataSource de apollo-datasource-rest et la met dans une variable nommée RESTDatasource.
Ce serait la même chose que :
const RESTDataSource = require('apollo-datasource-rest').RESTDataSource;
 */

//class LaunchAPI -> launch
class LaunchAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.spacexdata.com/v2/';
    }

    async getAllLaunches() {
        //Une fonction asynchrone est une fonction qui s'exécute de façon asynchrone grâce à la boucle d'évènement en utilisant une promesse (Promise) comme valeur de retour.
        const response = await this.get('launches');
        return Array.isArray(response)
            ? response.map(launch => this.launchReducer(launch))
            : [];
    }

    launchReducer(launch) {
        // méthode launchReducer qui a pour paramètre launch -> trasnforme les données de lancement de l'API REST en ce schéma
        return {
            id: launch.flight_number || 0,
            cursor: `${launch.launch_date_unix}`,
            site: launch.launch_site && launch.launch_site.site_name,
            mission: {
                name: launch.mission_name,
                missionPatchSmall: launch.links.mission_patch_small,
                missionPatchLarge: launch.links.mission_patch,
            },
            rocket: {
                id: launch.rocket.rocket_id,
                name: launch.rocket.rocket_name,
                type: launch.rocket.rocket_type,
            },
        };
    }

    async getLaunchByID({ launchID }) {
        //méthode par un id -> un numéro de vol de lancement et renvoir les données associées à ce lancement
        const response = await this.get ('launches', { flight_number: launchID})
        return this.launchReducer(response[0]);
    }

    async getLaunchByIDs({launchIDs}) {
        // méthode par plusieurs id
        return Promise.all(
            //Promise.all renvoie une promesse qui est résolue quand l'ensemble des promesses qui sont dans l'itérable passé en argument ont été résolu / ou qui échoue avec la raison de la première promesse qui échoue au sein de l'itérable
            launchIDs.map(launchId => this.getLaunchByID( {launchID} )),
        );

    }
}

module.exports = LaunchAPI;
