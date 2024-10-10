// Structure de données pour les projets
const projects = [
    
    {
        name: "Discord_TenshiBot",
        description: "Un bot discord de modération avancée principalement.",
        technologies: ["Golang", "API REST", "Postgresql", "Script Bash", "Makefile"],
        link: "https://github.com/Luthor91/Discord_TenshiBot"
    },
    {
        name: "SelfActu",
        description: "Un petit site web statique permettant de se mettre à jour sur les dernières actualités.",
        technologies: ["HTML", "CSS", "Javascript", "Makefile"],
        link: "https://luthor91.github.io/aboutme/public/news/"
    },
    {
        name: "gameEngine2d",
        description: "Un moteur de jeu en cours de développement se concentrant sur la facilité d'utilisation.",
        technologies: ["C", "Makefile", "SDL2"],
        link: "https://github.com/Luthor91/gameEngine2d"
    },
    {
        name: "Password_Manager",
        description: "Un gestionnaire et générateur de mot de passe.",
        technologies: ["Python", "SQLite", "tkinter", "chiffrement"],
        link: "https://github.com/Luthor91/Password_Manager"
    },
    {
        name: "Utilitaire_Database_PGSQL",
        description: "Utilitaire de gestion de base de données et de visualisation de données.",
        technologies: ["Godot Engine", "Postgresql"],
        link: "https://github.com/Luthor91/Utilitaire_Database_PGSQL"
    },
    {
        name: "AppWebVMAzure",
        description: "Application permettant de créer des machines virtuelles personnalisées sur le cloud Azure.",
        technologies: ["Python", "PHP", "Azure", "Cloud"],
        link: "https://github.com/Luthor91/AppWebVMAzure"
    },
    {
        name: "AppGestionCours",
        description: "Application permettant de gérer des inscriptions et des planifications de cours.",
        technologies: ["Golang", "Postgresql", "Redis", "Cache", "API REST"],
        link: "https://github.com/Luthor91/AppGestionCours"
    },
    // Projets en équipe
    {
        name: "Implic'Action",
        description: "Application en cours de développement permettant aux militaires de retrouver du travail dans le civil après leur service.",
        technologies: ["Java Spring", "Typescript", "Prisma", "CI/CD", "Authentification", "API REST"],
        link: "#"
    },
    {
        name: "Webradio MIDI",
        description: "Application permettant de gérer les playlists pour une chaîne d'hôtel en fonction de l'heure et du jour.",
        technologies: ["Golang", "React", "Docker", "API REST"],
        link: "#"
    }
];

// Fonction pour afficher la liste des projets
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

        projectItem.appendChild(projectTitle);
        projectItem.appendChild(projectDescription);
        projectItem.appendChild(projectTech);
        projectItem.appendChild(projectLink);

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