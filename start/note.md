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


###1 - Schema
// schema.js
* L'objet type Launch a une collection de champs + chaque champs à son propre type (type objet ou type scalaire)

= PatchSize : Lorsque vous recherchez un champ qui prend un argument, la valeur du champ peut varier en fonction de la valeur de l'argument fourni.
Dans ce cas, la valeur que vous fournissez déterminera quelle taille du patch associé à la mission est renvoyée (la taille SMALL ou la taille LARGE).

 = type Query : pour permettre aux clients de récupérer ces objets -> on définit des requêtes qu'ils peuvent exécuter sur le graphique
- launches : requête pour avoir un tableau de tous les launchs
- launch : requête pour avoir un seul launch par ID
- me : requête qui renverra les détails de l'utilisateur actuellement connecté

####Mutations : 
Les query permettent aux clients de récupérer des données mais pas de les modifier -> on utilise donc les mutations pour pouvoir les modifier
- booktrip : permet à utilisateur connecté de réserver un voyage sur un/pls lauches spécifiés
- canceltrip : // cxl
- login : // de se connecter en fournissant son adresse e-mail

-> ces 3 mutations renvoient le m type d'objet : TripUpdateResponse! (qui ne peut jamais être nulle)

###2 - Connecter une BDD
// launch.js

La classe RESTDatasource du package est une extension de DataSource qui gère la récupération de données à partir d'une API REST.
Pour utiliser cette classe = extend et lui fournir URL de l'API REST avec laquelle elle communiquera

Notre launchAPI a besoin de méthodes pour les requêtes :
- méthode pour obtenir la liste de tous les launches -> getAllLaunches()
- methode qui transforme les données de lancement envoyé dans le format attendu par notre schéma -> launchReducer()
- méthode pour obtenir un lancement par son id -> getLaunchByID()

Promise.all() : renvoie une promesse (est un objet qui représente l’état d’une opération asynchrone - avec les 3 états (en cours, résolue avec succès, résolue mais stoppé après un échec))
-> qui est résolue lorsque l'ensemble des promesses contenues dans l'itérable passé en argument ont été résolues ou qui échoue avec la raison de la première promesse qui échoue au sein de l'itérable.

= l'API SpaceX est en lecture seule ; nous avons aussi besoin d'une source de données accessibles en écriture afin de stocker les données d'application (identités des utilisateurs, réservations de sièges)
BDD objet -> ORM : Un mapping objet-relationnel (en anglais object-relational mapping ou ORM) est un type de programme informatique qui se place en interface entre un programme applicatif et une base de données relationnelle (table) pour simuler une base de données orientée objet.

= Si vous utilisez this.context dans une source de données, il est essentiel de créer une nouvelle instance de cette source de données dans la fonction dataSources, plutôt que de partager une seule instance. Sinon, initialize pourrait être appelé lors de l'exécution de code asynchrone pour un utilisateur particulier, en remplaçant this.context par le contexte d' un autre utilisateur.
\\ à revoir

TUTO = maintenant, nous avons connecté notre source de données à Apollo Server
- Pour la connexion : user.js et launch.js avec const { DataSource } = require('apollo-datasource'); ou const avec la DataSourceRest ; 

###3 - Résolveurs
//resolvers.js

Nous avons conçu le schéma (schema.js) et configuré nos sources de données (dossier datasources ; launch.js et user.js)
-> MAIS le serveur ne sait pas comment utiliser ses sources de donners pour remplir les champs de schéma => on utilise donc les résolveurs

####Un résolveur est une fonction chargée de renseigner les données d'un seul champ de votre schéma. 

Une fonction de résolution renvoie l'un des éléments suivants :
- Données du type requis par le champ de schéma correspondant du résolveur (chaîne, entier, objet, etc.)
- Une promesse qui tient avec des données du type requis

Dans ce tutoriel, le résolveur définit utilisera principalement context -> il permet à nos résolveurs de partager des instances de nos BDD LaunchAPIet UserAPI.

1 - le résolveur d'un champ parent s'exécute toujours avant les résolveurs des enfants de ce champ. 
Par conséquent, commençons par définir des résolveurs pour certains champs de niveau supérieur : les champs du type Query.

TUTO = maintenant, nous avons quelques résolveurs (//resolvers.js), il faut les ajouter à nos serveur. 

= Apollo Server définit un résolveur par défaut pout tout champ pour lequel on ne définit pas de résolveur personnalisé.
Pour la plupart (pas tous) des champs de notre schéma (schema.js), un r par def fait exactement ce que nous voulons qu'il fasse

Dans notre exo, le r de missionPatcb doit renvoyer une val différente selon qu'une requête spécifie LARGE ou SMALL pour l'argument size

####Paginer les résultats
Query.launches renvoi une longue liste d'objet launch = c'est beaucoup plus que le client n'en a besoin à la fois. 
De plus, la récupération d'autant de données peut être lente.
= Pour améliorer les performances de ce champs, nous pouvons implémenter la pagination.
- cela garantit que notre serveur envoie les données en petits morceaux.
- Recommandation de la pagination basée sur le curseur pour les pages numérotées car élément la possibilité de sauter un élément ou d'afficher le même élément plusieurs fois.
Dans la PBSC, un pointeur constant (ou curseur) est utilisé pour savoir ou commencer dans l'ensemble des données lors de la récup du prochain ensemble de résultat.

TUTO = nous allons config la PBSC.

- Changement du type Query avec deux paramètres pageSize et after et objet LaunchConnection (avec cursor, hasMore et laucnhes)

### 4 - les mutations
Après les résolveurs, écrivons les mutations - le processus est presque identique

resolvers.js
après ajout du resolvers mutation, nous devons ajouter une logique à notre serveur pour effectuer réellement l'authetification
 
Ex - essayons de réserver un voyage :
seul les users identifiés peuvent réserver un voyage donc avec une authorization

=> cette manière de faire est utile pour tester les API mais pour l'effectuer normalemet, il nécessite plus d'outils

### 5 - Connexion à Apollo Studio
- A présent, nous avons un serveur GraphQL en cours qui interagit avec des données provenant de plus sources (API)
il faut, avant de passer au côté client, activez Apollo Studio

Apollo Studio est une plate-forme cloud qui vous aide à chaque phase du développement de GraphQL, du prototypage au déploiement en passant par la surveillance.
 
Dans AS, chaque graphique à un schéma GraphQL correspondant.

CONNEXION OK avec mise en place des variables d'environnement côté server

### 6 - Côté client
index.tsx
Mise en place de variable d'environnement côté client

= nous sommes prêt à créer des composants React qui exécutent des requêtes GraphQL

#### 6a - launches.tsx
Détails de pagination :
Notez qu'en plus de récupérer une liste de launches, notre requête récupère hasMore et cursordes champs. 
En effet, la requête launches renvoie des résultats paginés :

- Le champ hasMore indique s'il existe des lancements supplémentaires au-delà de la liste renvoyée par le serveur.
- Le champ cursor indique la position actuelle du client dans la liste des lancements. Nous pouvons exécuter à nouveau la requête et fournir notre plus récent cursorcomme valeur de la $aftervariable pour récupérer le prochain ensemble de lancements dans la liste.

#### 6b - useQuery 
useQuery React Hook d'Apollo Client pour exécuter notre nouvelle requête dans le Launchescomposant. L'objet de résultat du hook fournit des propriétés qui nous aident à remplir et à afficher notre composant tout au long de l'exécution de la requête.

#### 6c - retour sur la pagination

AP fournit une fonction fetchMore d'assistance pour aider les requêtes paginées : il permet d'exécuter la même requête avec des valeurs différentes pour les variables

### 7 - afficher les détails d'un seul lancement
launch.tsx
mise en place d'une requête d'un seul launch via le launchId & utilisation du useQuery

### 8 - afficher le profil d'un utilisateur
but : la page de profil d'un utilisateur affiche la liste des lancements pour lesquels il a réservé une place. 

### 9 - personnalisation de a politique de récupération
AC stocke les résultats des requêtes dans son cache = donc si l'on cherche des données déjà présentes dans notre cache,
AC peut rencoyer ces données sans avoir à les récupérer sur le réseau. 
Cependant les données mises en cache peuvent devenir obsolètes ! 
- si quelques données obsolètes sont acceptables dans de nombreux cas, nous voulons
absolument que la liste des voyages réservés de nos users soit à jour.
= la politique de récupération pour notre requête GET_MY_TRIPS

Politique de récupération définit la façon dont AC utilise le cache pour une requête précise.
la politique par défaut est cache-first : AC vérifie le cache pour voir si le résultat est présent avant de faire une requête réseau.
s'il y a un résultat présent (vrai ou faux ?), aucune requête réseau n'est fourni.

En définissant la PdR de cette requête sur network-only, AC interroge TOUJOURS notre serveur
pour récupérer la liste la plus récente des voyages réservés par l'user

### 10 - MAJ avec les mutations
Après avori ajouté plusieurs requêtes, ajoutons les mutations
les mutations sont des opérations GraphQL qui peuvent modifier les données back-end (contrairement aux requêtes).
le schema.js a 3 mutations (les booktrip, les canceltrip et les login)

1 - la possibilité de se connecter 
login.tsx
le LOGIN_USER ressemble à une query sauf qu'à la place de query, c'est mutation
- le useMutation s'exécute que lorsque nous le voulons (ici lors de l'envoi du formulaire)

1a - conserver le jeton et l'id de son user
Nous pouvons inclure un rappel onCompleted : cela permet d'interagir avec les données 
de résultat de la mutation dès qu'elles sont dispos. (en exemple ici : on utilise ce rappel
pour conserver l'id et le token)

2 - Ajouter Authorization à toutes les requêtes
Notre client (Apollo) doit founir le jeton de l'utilisateur avec chaque opération graphQL qu'il envoie à notre serveur.
Cela permet au serveur de vérifier que l'utilisateur est autorisé à faire ce qu'il essaie de faire.

Nous avons fini de définir notre loginmutation, mais nous n'affichons pas encore le formulaire 
permettant à un utilisateur de l'exécuter. Étant donné que nous stockons le jeton 
utilisateur localement, nous utiliserons les API d'état local du client Apollo pour 
alimenter une partie de la logique du formulaire dans la section suivante.

### 11 - gérer l'état local

Comme la plupart des applications Web, notre application repose sur une combinaison de données 
récupérées à distance et de données stockées localement.
Nous pouvons utiliser Apollo Client pour gérer les deux types de données, ce qui en fait une 
source unique de vérité pour l'état de notre application. 
Nous pouvons même interagir avec les deux types de données en une seule opération.

1 - définir un schéma côté client dans index.tsx
- avec typeDefs ou nous étendons le type Query en ajoutons 2 nouveaux champs
- en fournissant le schéma client à AC
- 
### 12 - initaliser les variables réactives
Tout comme sur le serveur, nous pouvons remplir les champs de schéma côté client avec des
données provenant de n'importe quelle source souhaitée. AC fournit des options pour cela :
- le même cache en mémoire ou les résultats des requêtes côté serveur sont stockées
- variables réactives, qui peuvent stocker des données arbitraires en dehors du cache 
tout en mettant à jour les requêtes qui en dépendent.(variable dans un cache)

a - mettre à jour l'instruction d'import pour inclure la fonction makeVar
- si on appelle une fonction de variable réactive avec 0 argument, elle renvoie la valeur actuelle de la var
- si on appelle une fonction de VR avec n argument, elle remplace la valeur acutelle de la var par la valeur fournie
export const isLoggedInVar = makeVar<boolean>(!!localStorage.getItem(('token' || '')));

b - mettre à jour la logique de connexion
Maintenant que le statut de connexion est représentée avec une var réactive, nous  devons MAJ cette var chaque fois que l'utilisateur se connecte
login.tsx
Nous avons maintenant notre schéma côté client et nos sources de données côté client. 
- Côté serveur, nous définirions ensuite des résolveurs pour connecter les deux. 
- Côté client, cependant, nous définissons plutôt des politiques de champ.

### 13 - définir les politiques de terrain
Une stratégie de champ spécifie comment un seul champ GraphQL dans le cache du client Apollo est lu et écrit. 
La plupart des champs de schéma côté serveur n'ont pas besoin d'une stratégie de champ, car la stratégie par défaut fait ce qu'il faut:
elle écrit les résultats de la requête directement dans le cache et renvoie ces résultats sans aucune modification.

Cependant, nos champs côté client ne sont pas stockés dans le cache ! 
Nous devons définir des politiques de champ pour indiquer au client Apollo comment interroger ces champs.

### 14 - interroger les champs locaux
on peut inclure des champs côté client dans n'importe quelle requête GraphQL = @client à ajouter à chaque champs côté client
cela indique à Apollo de NE pas récupérer la valeur de ce champs sur notre serveur

1 - statut de connexion
index.tsx
2 - activer la déconnexion

### 15 - articles de Panier
stocker les lancements que les utilisateurs réservent

### 16 - activer la réservation de voyage
Nous avons attendu pour intégrer cette fonctionnalité car elle nécessite d'intéragir avec les données locales (le panier et l'utilisateur) 
et les données distantes.

### ENV
Dans les .env du client et server :
client :
- APOLLO_KEY=service:My-Graph-21qivo:U7g6mEUzREF7x5JRv9YbIw

server :
- APOLLO_KEY=service:My-Graph-21qivo:U7g6mEUzREF7x5JRv9YbIw 
- APOLLO_GRAPH_REF=My-Graph-21qivo@current 
- APOLLO_SCHEMA_REPORTING=true


###Rappel :
.map() : créer un nouveau tableau avec les résultats de l'appel d'une fonction
.then() : renvoie un objet promise (peut prendre jusqu'à 2 arguments qui sont deux fonctions callback) ; à utiliser en cas de complétion ou d'échec de la Promise.

###Note :
- type scalaire -> primitif (ID, String, Boolean, Int, Float)
- Un point d'exclamation (!) après le type d'un champ déclaré signifie que « la valeur de ce champ ne peut jamais être nulle ».
- await permet d'attendre la résolution d'une promesse. ne peut être utilisé qu'au sein d'une fonction asyncrhone
- les ... (spread truc/syntaxe de propagation) font une copie indépendante de la celle qui a été copié
- un fragement est utile pour déinifir un ensemble de champs que l'on peut inclure dans plusieurs requêtes sans les réécrires