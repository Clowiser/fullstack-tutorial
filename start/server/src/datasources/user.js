const { DataSource } = require('apollo-datasource');
const isEmail = require('isemail');

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    // -> pour passer des options de configurations à la sous-classe (DataSource)
    this.context = config.context;
    // -> Le contexte d'une API graphique est un objet partagé entre tous les résolveurs d'une requête GraphQL.
    // -> c'est que le contexte est utile pour stocker et partager les informations des utilisateurs.
  }

  async findOrCreateUser({ email: emailArg } = {}) {
    // méthode qui recherche ou créer un utilisateur avec un e-mail donné dans la BDD
    const email =
      this.context && this.context.user ? this.context.user.email : emailArg;
    if (!email || !isEmail.validate(email)) return null;

    const users = await this.store.users.findOrCreate({ where: { email } });
    return users && users[0] ? users[0] : null;
  }

  async bookTrips({ launchIds }) {
    // méthode de réservation de voyage avec un tableau de launchID pour le user connecté (userId)
    const userId = this.context.user.id;
    if (!userId) return;

    let results = [];

    // for each launch id, try to book the trip and add it to the results array
    // if successful
    for (const launchId of launchIds) {
      const res = await this.bookTrip({ launchId });
      if (res) results.push(res);
    }

    return results;
  }

  async bookTrip({ launchId }) {
    const userId = this.context.user.id;
    const res = await this.store.trips.findOrCreate({
      where: { userId, launchId },
    });
    return res && res.length ? res[0].get() : false;
  }
  // A REVOIR

  /*async cancelTrip({ launchId }) {
    // M d'annulation de lancement pour le user connecté (userId) avec un launchID
    const userId = this.context.user.id;
    return !!this.store.trips.destroy({ where: { userId, launchId } });
  }*/

  async cancelTrip({ launchId }) {
    const userId = this.context.user.id;
    const numberOfDeletedTrips = await this.store.trips.destroy({ where: { userId, launchId:105} });
    return numberOfDeletedTrips !== 0;
  }
//erreur dans le code d'annulation


  async getLaunchIdsByUser() {
    // M qui renvoie tous les voyages réservés pour le user connecté (userId)
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId },
    });
    return found && found.length
      ? found.map(l => l.dataValues.launchId).filter(l => !!l)
      : [];
  }

  async isBookedOnLaunch({ launchId }) {
    // M qui détermine si le user connecté (userId) a réservé un voyage sur un lancement particulier
    if (!this.context || !this.context.user) return false; // si différent des infos stockées et partagées du lancement OU différent des infos stockées et partagées du user -> return false
    const userId = this.context.user.id;
    const found = await this.store.trips.findAll({
      where: { userId, launchId },
    });
    return found && found.length > 0;
  }
}

module.exports = UserAPI;
