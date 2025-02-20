const projects = [
    {
        name: "Discord_TenshiBot",
        description: "Un bot discord de modération avancée principalement.",
        extendedDescription: "Discord_TenshiBot est un bot de modération avancée pour Discord, permettant de gérer efficacement les serveurs via des commandes personnalisées. Le projet utilise des techniques de parsing pour interpréter les commandes des utilisateurs et intègre les API Discord et Riot Games pour des données du jeu. L'installation sur une machine Linux est automatisée via un script bash, et la compilation du projet est facilitée par un Makefile. De plus, le bot prend en charge des actions asynchrones pour répondre aux commandes sans interruption des autres tâches.",
        technologies: ["Golang", "API REST", "Postgresql", "Shell", "Makefile"],
        link: "https://github.com/Luthor91/Discord_TenshiBot"
    },
    {
        name: "RPG 2D",
        description: "Un jeu RPG en 2d.",
        extendedDescription: "Projet encore en cours, compétences en gestion de projet employés.",
        technologies: ["GdScript", "OOP", "Godot Engine", "LLMS"],
        link: "/"
    },
    {
        name: "SelfActu",
        description: "Un petit site web statique permettant de se mettre à jour sur les dernières actualités.",
        extendedDescription: "SelfActu est un site web statique qui permet aux utilisateurs de consulter les dernières actualités grâce à un processus de mise à jour automatisé. Le site utilise un script Python pour effectuer du web scraping sur plusieurs sources d'informations, et un Makefile permet de déclencher les mises à jour de manière régulière et sans intervention manuelle. Grâce à son design simple et épuré, SelfActu fonctionne efficacement sans base de données dynamique, offrant un contenu mis à jour avec un minimum de ressources.  Liens de l'application : https://luthor91.github.io/aboutme/news/",
        technologies: ["JavaScript", "Python", "Makefile", "Web Scrapping"],
        link: "https://luthor91.github.io/aboutme/docs/news/"
    },
    {
        name: "Maze_Solver",
        description: "Un générateur et solveur de labyrinthes utilisant 3 algorithmes de recherches, DFS, BFS et A*.",
        extendedDescription: "Maze_Solver est un projet combinant génération et résolution de labyrinthes, avec la possibilité de comparer les performances des algorithmes DFS, BFS, et A*. L'interface permet de régler la taille visuelle du labyrinthe, de manière à adapter le nombre de cases à la taille de la fenêtre, assurant ainsi une visualisation optimale. Le labyrinthe est généré de manière aléatoire à chaque lancement, et des statistiques sont affichées pour comparer le temps d'exécution des différents algorithmes de recherche.",
        technologies: ["Golang", "Raylib", "Makefile"],
        link: "https://github.com/Luthor91/Maze_Solver"
    },
    {
        name: "gameEngine2d",
        description: "Un moteur de jeu en cours de développement se concentrant sur la facilité d'utilisation.",
        extendedDescription: "gameEngine2d est un moteur de jeu 2D en cours de développement, conçu autour d'une architecture ECS (Entity Component System) pour une gestion flexible des entités dans le jeu. Il inclut un algorithme de rendu optimisé pour afficher les entités, ainsi qu'une gestion des collisions pour un environnement interactif. Le moteur supporte également l'implémentation d'événements dynamiques, permettant une gestion fluide des interactions entre entités. Ce projet vise à offrir une solution simple et performante pour les développeurs souhaitant créer des jeux 2D.",
        technologies: ["C", "Makefile", "SDL2"],
        link: "https://github.com/Luthor91/gameEngine2d"
    },
    {
        name: "Password_Manager",
        description: "Un gestionnaire et générateur de mot de passe.",
        extendedDescription: "Password_Manager est une application sécurisée permettant de stocker et gérer des mots de passe pour différents services. Le gestionnaire utilise un mot de passe maître pour chiffrer toutes les données, avec une approche 'pepper' pour renforcer la sécurité du chiffrement. L'application génère également des mots de passe robustes que l'utilisateur peut copier automatiquement dans le presse-papiers pour les coller dans d'autres applications. Conçue avec des principes solides de cybersécurité, l'application protège les informations sensibles de l'utilisateur.",
        technologies: ["Python", "SQLite", "tkinter", "chiffrement"],
        link: "https://github.com/Luthor91/Password_Manager"
    },
    {
        name: "Utilitaire_Database_PGSQL",
        description: "Utilitaire de gestion de base de données et de visualisation de données.",
        extendedDescription: "Utilitaire_Database_PGSQL est une application graphique permettant de gérer une base de données PostgreSQL de manière visuelle. L'utilisateur peut créer, modifier et supprimer des tables, ainsi que gérer les utilisateurs et leurs permissions. En outre, l'application inclut des fonctionnalités de visualisation graphique des données, permettant de créer des graphiques à partir des résultats des requêtes SQL pour une analyse visuelle plus intuitive.",
        technologies: ["Godot Engine", "Postgresql"],
        link: "https://github.com/Luthor91/Utilitaire_Database_PGSQL"
    },
    {
        name: "AppWebVMAzure",
        description: "Application permettant de créer des machines virtuelles personnalisées sur le cloud Azure.",
        extendedDescription: "AppWebVMAzure est une application web qui permet de créer et configurer des machines virtuelles personnalisées sur le cloud Azure. En utilisant PHP pour la gestion de l'interface et un script Python pour interagir avec les API d'Azure, cette application supporte la création de machines Windows et Ubuntu. L'application est compatible avec les systèmes Linux et Windows, offrant une flexibilité dans les environnements de développement.",
        technologies: ["Python", "PHP", "Azure", "Cloud"],
        link: "https://github.com/Luthor91/AppWebVMAzure"
    },
    {
        name: "AppGestionCours",
        description: "Application permettant de gérer des inscriptions et des planifications de cours.",
        extendedDescription: "AppGestionCours est une application conçue pour faciliter la gestion des inscriptions et la planification des cours. Elle utilise une architecture MVC pour séparer les différentes couches du projet et exploite Redis pour le cache afin d'améliorer la performance des requêtes. L'application permet aux administrateurs d'organiser les cours, de gérer les inscrits, et de générer des horaires en fonction des disponibilités, tout en assurant un accès rapide grâce au cache.",
        technologies: ["Golang", "Postgresql", "Redis", "API REST"],
        link: "https://github.com/Luthor91/AppGestionCours"
    },
    {
        name: "NetworkScanner",
        description: "Application permettant de gérer d'avoir des informations sur les machines présent sur son réseau.",
        extendedDescription: "NetworkScanner est une application encore en cours de développement permettant d'avoir des informations sur son réseau, l'application sort un fichier .json qui sera amené à être analysé par une page Web.",
        technologies: ["Java", "Swing", "Maven", "Réseau"],
        link: "https://github.com/Luthor91/NetworkScanner"
    },
    {
        name: "WakfuTeamBuilder",
        description: "Application Web simple permettant d'aider les joueurs de Wakfu à construire leur équipe.",
        extendedDescription: "WakfuTeamBuilder est une application encore en cours d'amélioration permettant d'avoir des informations sur son équipe de personnage sur le MMORPG Wakfu, l'application permet de lister les points fort et faible de l'équipe. Liens de l'application : https://luthor91.github.io/WakfuTeamBuilder/builder/",
        technologies: ["Javascript", "Makefile"],
        link: "https://github.com/Luthor91/WakfuTeamBuilder"
    },
    // Projets en équipe
    {
        name: "Implic'Action",
        description: "Application en cours de développement permettant aux militaires de retrouver du travail dans le civil après leur service.",
        extendedDescription: "Implic'Action est un projet académique de deuxième année de Master, développé en Java et NextJS. L'application aide les militaires en fin de service à trouver un emploi civil. Mon rôle principal était de mettre en place l'authentification SSO, permettant une connexion sécurisée des utilisateurs via des services tiers. Le projet utilise des technologies modernes comme Prisma et un pipeline CI/CD pour garantir des déploiements efficaces et une expérience utilisateur fluide.",
        technologies: ["Java Spring", "Typescript", "Prisma", "CI/CD", "Authentification", "API REST"],
        link: "#"
    },
    {
        name: "Webradio MIDI",
        description: "Application permettant de gérer les playlists pour une chaîne d'hôtel en fonction de l'heure et du jour.",
        extendedDescription: "Webradio MIDI est une application développée dans le cadre d'un hackathon de trois jours, permettant de gérer la diffusion des playlists pour une chaîne d'hôtel. L'application est structurée autour du modèle MVC, offrant une gestion fluide des playlists en fonction de l'heure et du jour. Le projet a été testé rigoureusement pour respecter les normes de cybersécurité et peut être facilement installé et déployé via Docker.",
        technologies: ["Golang", "React", "Docker", "API REST"],
        link: "#"
    }
];

// Fonction pour afficher la liste des projets avec des descriptions extensibles
function displayProjects(projectsToDisplay) {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = '';

    projectsToDisplay.forEach(project => {
        const projectItem = document.createElement('li');
        projectItem.classList.add('project-item');

        const projectTitle = document.createElement('h3');
        projectTitle.textContent = project.name;
        
        const projectLink = document.createElement('a');
        projectLink.href = project.link !== '#' ? project.link : '#';
        projectLink.textContent = project.link === '#' ? 'Lien inexistant' : 'Voir le projet sur GitHub';

        if (project.link === '#') {
            projectLink.style.pointerEvents = 'none';
            projectLink.style.color = 'gray';
        }

        const projectDescription = document.createElement('p');
        projectDescription.textContent = project.description;

        const projectTech = document.createElement('p');
        projectTech.textContent = `Technologies : ${project.technologies.join(', ')}`;

        // Description étendue (cachée par défaut)
        const extendedDescription = document.createElement('p');
        extendedDescription.textContent = project.extendedDescription;
        extendedDescription.classList.add('extended-description');
        extendedDescription.style.display = 'none';

        // Bouton pour dérouler ou cacher la description étendue
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Voir plus';
        toggleButton.classList.add('toggle-button', 'see-more-btn');
        toggleButton.addEventListener('click', () => {
            const isHidden = extendedDescription.style.display === 'none';
            extendedDescription.style.display = isHidden ? 'block' : 'none';
            toggleButton.textContent = isHidden ? 'Voir moins' : 'Voir plus';
        });

        // Ajout des éléments au DOM dans l'ordre souhaité
        projectItem.appendChild(projectTitle);
        projectItem.appendChild(projectDescription);
        projectItem.appendChild(projectTech);
        projectItem.appendChild(projectLink); // Ajouter le lien d'abord
        projectItem.appendChild(toggleButton); // Ensuite, ajouter le bouton
        projectItem.appendChild(extendedDescription);

        projectList.appendChild(projectItem);
    });
}


// Fonction de filtrage des projets par nom
function filterProjectsByName() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredProjects = projects.filter(project => {
        return project.name.toLowerCase().includes(searchTerm);
    });
    displayProjects(filteredProjects);
}

// Fonction de filtrage des projets par technologies (via le menu déroulant)
function filterProjectsByTech() {
    const selectedTech = document.getElementById('techDropdown').value.toLowerCase();
    const filteredProjects = projects.filter(project => {
        return project.technologies.some(tech => tech.toLowerCase() === selectedTech);
    });
    displayProjects(filteredProjects);
}

// Extraire toutes les technologies avec leur fréquence
function getTechnologiesWithFrequency() {
    const techFrequency = {};

    projects.forEach(project => {
        project.technologies.forEach(tech => {
            tech = tech.toLowerCase();  // On uniformise en minuscules
            if (techFrequency[tech]) {
                techFrequency[tech]++;
            } else {
                techFrequency[tech] = 1;
            }
        });
    });

    // Transformer l'objet en tableau et trier par fréquence décroissante
    return Object.entries(techFrequency).sort((a, b) => b[1] - a[1]);
}

// Remplir le menu déroulant avec les technologies triées par fréquence
function populateTechDropdown() {
    const techDropdown = document.getElementById('techDropdown');
    const technologies = getTechnologiesWithFrequency();

    // Ajouter les options au menu déroulant
    technologies.forEach(([tech, frequency]) => {
        const option = document.createElement('option');
        option.value = tech; // On garde les minuscules
        option.textContent = `${tech.charAt(0).toUpperCase() + tech.slice(1)} (${frequency})`; // Afficher avec la fréquence
        techDropdown.appendChild(option);
    });
}

// Afficher la liste initiale des projets
displayProjects(projects);
// Remplir le menu déroulant au démarrage
populateTechDropdown();