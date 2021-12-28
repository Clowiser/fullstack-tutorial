##Tutoriel Apollo Client
(Projet GitHub - https://github.com/apollographql/fullstack-tutorial)

Un schéma GQL définit les types de données qu'un client peut lire et écrire.

La structure de votre schéma doit prendre en charge les actions que vos clients entreprendront. Notre exemple d'application doit être capable de :
* Récupérez une liste de tous les lancements de fusées à venir
* Récupérer un lancement spécifique par son ID
* Connectez-vous à l'utilisateur
* Réserver un lancement pour un utilisateur connecté
* Annuler un lancement précédemment réservé pour un utilisateur connecté


###Schema.js
* l'objet type Launch a une collection de champs + chaque champs à son propre type (type objet ou type scalaire)

-> PatchSize : Lorsque vous recherchez un champ qui prend un argument, la valeur du champ peut varier en fonction de la valeur de l'argument fourni.
Dans ce cas, la valeur que vous fournissez sizedéterminera quelle taille du patch associé à la mission est renvoyée (la taille SMALL ou la taille LARGE).

-> type Query : pour permettre aux clients de récupérer ces objets -> on définit des requêtes qu'ils peuvent exécuter sur le graphique
- launches : requête pour avoir un tableau de tous les launchs
- launch : requête pour avoir un seul launch par ID
- me : requête qui renverra les détails de l'utilisateur actuellement connecté

-> mutations : les query permettent aux clients de récupérer des données mais pas de les modifier -> on utilise donc les mutations pour pouvoir les modifier
- booktrip : permet à utilisateur connecté de réserver un voyage sur un/pls lauches spécifiés
- canceltrip : // cxl
- login : // de se connecter en fournissant son adresse e-mail

-> ces 3 mutations renvoient le m type d'objet : TripUpdateResponse! (qui ne peut ajamais être nulle)

###Note :
- type scalaire -> primitif (ID, String, Boolean, Int, Float)
- Un point d'exclamation (!) après le type d'un champ déclaré signifie que « la valeur de ce champ ne peut jamais être nulle ».
