const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

let projects = JSON.parse(localStorage.getItem('projects')) || [];
let project = projects.find(p => p.id === projectId);
if (!project) {
    alert('Project not found!');
    window.location.href = 'index.html';
}
let selectedVersionID = null;

document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'index.html';
});


if (project) {
    document.getElementById('projectTitle').textContent = project.name;
} else {
    document.getElementById('projectTitle').textContent = 'Project Not Found';
}


function DisplayVersions() {
    const versionList = document.getElementById('versionList');
    versionList.innerHTML = '';

    if (!project || !project.versions || project.versions.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No versions available';
        li.className = 'version-item empty';
        versionList.appendChild(li);
        return;
    }

    project.versions.forEach((version) => {
        const li = document.createElement('li');
        li.className = 'version-item';
        li.textContent = version.name || `Version ${version.id}`;
        li.dataset.id = version.id;

        if (selectedVersionID === version.id) {
            li.style.backgroundColor = '#7abbfcff'; // Highlight selected version
        } else {
            li.style.backgroundColor = versionList.style.backgroundColor; // Reset background for unselected versions
        }

        li.addEventListener('click', () => {
            selectedVersionID = version.id;
            document.getElementById('removeVersion').disabled = false;
            DisplayVersions();
            DisplayVersionsDetails();
        });

        li.addEventListener('dblclick', () => {
            window.location.href = `version.html?id=${version.id}`;
        });

        versionList.appendChild(li);
    });
}

function DisplayVersionsDetails() {
    const versionDetails = document.getElementById('versionDetails');
    const dataTable = document.getElementById('dataTable');
    dataTable.innerHTML = '';

    if (!project || !project.versions || project.versions.length === 0 || !selectedVersionID) {
        versionDetails.textContent = 'Select a version to see details.';
        return;
    }

    const version = project.versions.find(v => v.id === selectedVersionID);
    if (!version) {
        return;
    }

    versionDetails.style.display = 'block';

    if (!version.data) {
        version.data = [];
    }

    version.data.forEach((dataItem, index) => {
        const row = document.createElement('tr');

        const keyCell = document.createElement('td');
        keyCell.textContent = dataItem.key || `Key ${index + 1}`;

        const valueCell = document.createElement('td');
        valueCell.textContent = dataItem.value || 'No value';

        const actionCell = document.createElement('td');
        actionCell.classList.add('action-cell');
        const editButton = document.createElement('button');
        editButton.className = 'scondary';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            editDataItem(index);
        });

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            deleteDataItem(index);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(keyCell);
        row.appendChild(valueCell);
        row.appendChild(actionCell);

        dataTable.appendChild(row);

    });
}

document.getElementById('addVersion').addEventListener('click', () => {
    if (!project) {
      return;
    }
   
    const versionName = prompt('Enter version name:');
    if (versionName) {
        const newVersion = {
            id: Date.now().toString(),
            name: versionName,
            data: []
        };
        project.versions.push(newVersion);
        localStorage.setItem('projects', JSON.stringify(projects));
        DisplayVersions();
    }
});

document.getElementById('removeVersion').addEventListener('click', () => {

    if (!project || !selectedVersionID) {
        return;
    }

    if (confirm('Are you sure you want to remove this version?')) {
        project.versions = project.versions.filter(version => version.id !== selectedVersionID);
        localStorage.setItem('projects', JSON.stringify(projects));
        selectedVersionID = null;
        document.getElementById('removeVersion').disabled = true;
        DisplayVersions();
        DisplayVersionsDetails();
    }
});

document.getElementById('addDataItem').addEventListener('click', () => {
    if (!project || !selectedVersionID) {
        return;
    }

    const key = prompt('Enter data key:');
    if (!key) {
        return;
    }

    const value = prompt('Enter data value:');

    const version = project.versions.find(v => v.id === selectedVersionID);

    if (version) {
        version.data.push({ key, value });
        localStorage.setItem('projects', JSON.stringify(projects));
        DisplayVersionsDetails();
    }
});

function editDataItem(index) {
    if (!project || !selectedVersionID) {
        return;
    }

    const version = project.versions.find(v => v.id === selectedVersionID);
    if (!version || !version.data || index < 0 || index >= version.data.length) {
        return;
    }

    const dataItem = version.data[index];
    const newKey = prompt('Edit data key:', dataItem.key);
    if (newKey === null) {
        return; // User cancelled
    }
    const newValue = prompt('Edit data value:', dataItem.value);

    dataItem.key = newKey;
    dataItem.value = newValue;
    localStorage.setItem('projects', JSON.stringify(projects));
    DisplayVersionsDetails();
}

function deleteDataItem(index) {
    if (!project || !selectedVersionID) {
        return;
    }

    const version = project.versions.find(v => v.id === selectedVersionID);
    if (!version || !version.data || index < 0 || index >= version.data.length) {
        return;
    }

    if (confirm('Are you sure you want to delete this data item?')) {
        version.data.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        DisplayVersionsDetails();
    }
}

DisplayVersions();