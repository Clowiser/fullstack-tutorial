##Tutoriel Apollo Client
(Projet GitHub - https://github.com/apollographql/fullstack-tutorial)

* Queries = useQuery -> récupérer les données
* Mutations = useMutation -> mettre à jour les données
* Refetching queries
* Caching overview
* Managing local stat
* Basic HTTP networking
* Testing React components


Un schéma GQL définit les types de données qu'un client peut lire et écrire.

La structure de votre schéma doit prendre en charge les actions que vos clients entreprendront. Notre exemple d'application doit être capable de :
* Récupérez une liste de tous les lancements de fusées à venir
* Récupérer un lancement spécifique par son ID
* Connectez-vous à l'utilisateur
* Réserver un lancement pour un utilisateur connecté
* Annuler un lancement précédemment réservé pour un utilisateur connecté


###1 - Schema.js
* L'objet type Launch a une collection de champs + chaque champs à son propre type (type objet ou type scalaire)

-> PatchSize : Lorsque vous recherchez un champ qui prend un argument, la valeur du champ peut varier en fonction de la valeur de l'argument fourni.
Dans ce cas, la valeur que vous fournissez edéterminera quelle taille du patch associé à la mission est renvoyée (la taille SMALL ou la taille LARGE).

-> type Query : pour permettre aux clients de récupérer ces objets -> on définit des requêtes qu'ils peuvent exécuter sur le graphique
- launches : requête pour avoir un tableau de tous les launchs
- launch : requête pour avoir un seul launch par ID
- me : requête qui renverra les détails de l'utilisateur actuellement connecté

####Mutations : 
Les query permettent aux clients de récupérer des données mais pas de les modifier -> on utilise donc les mutations pour pouvoir les modifier
- booktrip : permet à utilisateur connecté de réserver un voyage sur un/pls lauches spécifiés
- canceltrip : // cxl
- login : // de se connecter en fournissant son adresse e-mail

-> ces 3 mutations renvoient le m type d'objet : TripUpdateResponse! (qui ne peut ajamais être nulle)

###2 - launch.js 
La classe RESTDatasource du package est une extension de DataSource qui gère la récupération de données à partir d'une API REST.
Pour utiliser cette classe = extend et lui fournir URL de l'API REST avec laquelle elle communiquera

Notre launchAPI a besoin de méthodes pour les requêtes :
- méthode pour obtenir la liste de tous les launches -> getAllLaunches()
- methode qui transforme les données de lancement envoé dans le format attendu par notre schéma -> launchReducer()
- méthode pour obtenir un lancement par son id -> getLaunchByID()

Promise.all() : renvoie une promesse (est un objet qui représente l’état d’une opération asynchrone - avec les 3 états (en cours, résolue avec succès, résolue mais stoppé après un échec))
-> qui est résolue lorsque l'ensemble des promesses contenues dans l'itérable passé en argument ont été résolues ou qui échoue avec la raison de la première promesse qui échoue au sein de l'itérable.


###3 - connecter une BDD 
-> l'API SpaceX est en lecture seule ; nous avons aussi besoin d'une source de données accessibles en écriture afin de stocker les données d'application (identités des utilisateurs, réservations de sièges)
BDD objet -> ORM : Un mapping objet-relationnel (en anglais object-relational mapping ou ORM) est un type de programme informatique qui se place en interface entre un programme applicatif et une base de données relationnelle (table) pour simuler une base de données orientée objet.

-> Si vous utilisez this.contextdans une source de données, il est essentiel de créer une nouvelle instance de cette source de données dans la dataSourcesfonction, plutôt que de partager une seule instance. Sinon, initializepourrait être appelé lors de l'exécution de code asynchrone pour un utilisateur particulier, en remplaçant this.contextpar le contexte d' un autre utilisateur.
//Pas compris

-> maintenant, nous avons connecté notre source de données à Apollo Server

###4 - Requête
Nous avons conçu le schéma (schema.js) et configuré nos sources de données (dossier datasources ; launch.js et user.js)
-> MAIS le serveur ne sait pas comment utiliser ses sources de donners pour remplir les champs de schéma => les résolveurs

####Un résolveur est une fonction chargée de renseigner les données d'un seul champ de votre schéma. 

Une fonction de résolution renvoie l'un des éléments suivants :
- Données du type requis par le champ de schéma correspondant du résolveur (chaîne, entier, objet, etc.)
- Une promesse qui tient avec des données du type requis

Dans ce tutoriel, le résolveur définit utilisera principalement context -> il permet à nos résolveurs de partager des instances de nos BDD LaunchAPIet UserAPI.

1 - le résolveur d'un champ parent s'exécute toujours avant les résolveurs des enfants de ce champ. 
Par conséquent, commençons par définir des résolveurs pour certains champs de niveau supérieur : les champs du type Query.

###Rappel :
.map() : créer un nouveau tableau avec les résultats de l'appel d'une fonction
.then() : renvoie un objet promise (peut prendre jusqu'à 2 arguments qui sont deux fonctions callback) ; à utiliser en cas de complétion ou d'échec de la Promise.

###Note :
- type scalaire -> primitif (ID, String, Boolean, Int, Float)
- Un point d'exclamation (!) après le type d'un champ déclaré signifie que « la valeur de ce champ ne peut jamais être nulle ».
