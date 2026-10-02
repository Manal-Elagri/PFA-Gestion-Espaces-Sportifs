# Espace Sportif - Plateforme de Gestion Sportive

## Description

Espace Sportif est une plateforme web full-stack conçue pour la gestion des espaces sportifs de l'ENSAJ (École Nationale des Sciences Appliquées). Elle permet aux utilisateurs de réserver des terrains, participer à des compétitions, gérer des réservations, et offre des tableaux de bord pour les administrateurs et les responsables.

Le projet comprend :
- **Frontend** : Application Angular pour l'interface utilisateur.
- **Backend** : API REST développée avec Spring Boot.
- **Base de données** : MySQL gérée via XAMPP.

## Fonctionnalités

### Pour les Utilisateurs
- Réservation de terrains sportifs
- Participation à des compétitions
- Gestion du profil utilisateur
- Consultation des réservations et calendriers

### Pour les Administrateurs
- Tableau de bord d'administration
- Gestion des utilisateurs, terrains, compétitions et réservations
- Statistiques et rapports
- Gestion des rôles (étudiants, professeurs, responsables)

### Pour les Responsables
- Espace dédié pour la gestion des équipes et compétitions
- Inscription et gestion des étudiants/professeurs

## Technologies Utilisées

- **Frontend** : Angular 16, Angular Material, TypeScript
- **Backend** : Spring Boot (Java)
- **Base de données** : MySQL
- **Serveur de base de données** : XAMPP
- **Autres** : jQuery (pour certains plugins comme Magnific Popup)

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (version 16 ou supérieure)
- [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
- [Java JDK](https://adoptium.net/) (version 11 ou supérieure)
- [Maven](https://maven.apache.org/) 
- [XAMPP](https://www.apachefriends.org/) pour MySQL

## Installation et Configuration

### 1. Clonage du Repository

```bash
git clone <url-du-repository>
cd frontend-pfa-version
```

### 2. Configuration de la Base de Données

1. Lancez XAMPP et démarrez les services Apache et MySQL.
2. Ouvrez phpMyAdmin (http://localhost/phpmyadmin).
3. Créez une nouvelle base de données nommée `pfa_sportensaj` (ou le nom configuré dans votre backend).
4. Importez le fichier SQL fourni dans le dossier backend (si disponible) ou configurez les tables selon les entités Spring Boot.

### 3. Configuration du Backend (Spring Boot)

1. Naviguez vers le dossier backend :
   ```bash
   cd backend
   ```

2. Configurez la connexion à la base de données dans `application.properties` ou `application.yml` :
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/pfa_sportensaj
   spring.datasource.username=root
   spring.datasource.password=
   spring.jpa.hibernate.ddl-auto=update
   ```

3. Installez les dépendances et lancez l'application :
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   Le backend sera accessible sur `http://localhost:8080`.

### 4. Configuration du Frontend (Angular)

1. Naviguez vers le dossier frontend :
   ```bash
   cd frontend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez l'application en mode développement :
   ```bash
   ng serve
   ```
   L'application sera accessible sur `http://localhost:4200`.

## Utilisation

1. Ouvrez votre navigateur et allez sur `http://localhost:4200`.
2. Inscrivez-vous ou connectez-vous selon votre rôle (étudiant, professeur, administrateur).
3. Explorez les fonctionnalités : réservez un terrain, rejoignez une compétition, consultez votre tableau de bord.

## API Endpoints (Backend)

Le backend expose une API REST. Voici quelques endpoints principaux :
- `GET /api/terrains` : Liste des terrains
- `POST /api/reservations` : Créer une réservation
- `GET /api/competitions` : Liste des compétitions
- `POST /api/users/login` : Connexion utilisateur

Consultez la documentation Swagger (si configurée) sur `http://localhost:8080/swagger-ui.html` pour une liste complète.

## Tests

### Frontend
```bash
ng test
```

### Backend
```bash
mvn test
```

## Déploiement

Pour déployer en production :
- **Frontend** : `ng build --prod` puis déployez le dossier `dist/` sur un serveur web.
- **Backend** : Packagez avec `mvn package` et déployez le JAR sur un serveur Java.

## Contribution

1. Forkez le repository.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonction`).
3. Commitez vos changements (`git commit -am 'Ajout de nouvelle fonctionnalité'`).
4. Poussez vers la branche (`git push origin feature/nouvelle-fonction`).
5. Ouvrez une Pull Request.



