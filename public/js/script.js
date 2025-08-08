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