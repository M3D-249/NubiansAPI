document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => {
            const updatesList = document.getElementById('updates-list');
            data.updates.forEach(update => {
                const listItem = document.createElement('li');
                listItem.textContent = `${update.title}: ${update.content}`;
                updatesList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching updates:', error);
        });
});

let projects = JSON.parse(localStorage.getItem('projects')) || [];
let selectedProjectID = null;

function DisplayProjects() {
    const projectList = document.getElementById('projectList');
    projectList.innerHTML = '';
    
    projects.forEach((project) => {

        const li = document.createElement('li');
        li.className = 'project-item';
        li.textContent = project.name;
        li.dataset.id = project.id;

        if (selectedProjectID === project.id) {
            li.classList.add('selected');
            li.style.backgroundColor = '#7abbfcff'; // Highlight selected project
        } 
        else {
            li.classList.remove('selected');
            li.style.backgroundColor = projectList.style.backgroundColor; // Reset background for unselected projects
        }
        
        li.addEventListener('click', () => {
            if (li.classList.contains('selected'))
            {
                console.log('selected');
                li.style.backgroundColor = projectList.style.backgroundColor; // Reset background for unselected projects
                document.getElementById('removeProject').disabled = true;
                li.classList.remove('selected');
                selectedProjectID = null;
            }
            else {
                selectedProjectID = project.id;
                document.getElementById('removeProject').disabled = false;
                DisplayProjects();
            }
        });

        li.addEventListener('dblclick', () => {
            window.location.href = `project.html?id=${project.id}`;
        });

        projectList.appendChild(li);
    });
}

document.getElementById('addProject').addEventListener('click', () => {
    const projectName = prompt('Enter project name:');
    if (projectName) {

        if (!projects.find(p => p.name == projectName)) {
         
            const newProject = {
                id: Date.now().toString(),
                name: projectName,
                versions: []
            };
            projects.push(newProject);
            localStorage.setItem('projects', JSON.stringify(projects));
            DisplayProjects();
            console.log(newProject);
        } else {
            alert('Project is already defined!')
        }
    }
});

document.getElementById('removeProject').addEventListener('click', () => {
    if (selectedProjectID && confirm('Are you sure you want to remove this project?')) {
        projects = projects.filter(project => project.id !== selectedProjectID);
        localStorage.setItem('projects', JSON.stringify(projects));
        selectedProjectID = null;
        document.getElementById('removeProject').disabled = true;
        DisplayProjects();
    }
});

DisplayProjects();
document.getElementById('removeProject').disabled = true; // Disable initially