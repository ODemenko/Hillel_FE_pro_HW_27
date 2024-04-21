document.addEventListener('DOMContentLoaded', () => {
    const swapiBaseURL = 'https://swapi.dev/api/';

    setupToggle('characters-link', 'characters-list', 'people/');
    setupToggle('planets-link', 'planets-list', 'planets/');
    setupToggle('transports-link', 'transports-list', 'starships/');
    
    function setupToggle(navLinkId, listId, apiEndpoint) {
        const navLink = document.getElementById(navLinkId);
        const list = document.getElementById(listId);

        navLink.addEventListener('click', (event) => {
            event.preventDefault();
            list.classList.toggle('d-none');

            if (!list.dataset.loaded && !list.classList.contains('d-none')) {
                fetchList(list, apiEndpoint);
                list.dataset.loaded = true;
            }
        });
    }

    function fetchList(list, endpoint) {
        fetch(`${swapiBaseURL}${endpoint}`)
            .then((response) => response.json())
            .then((data) => {
                data.results.forEach((item) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.textContent = item.name;
                    listItem.addEventListener('click', () => displayDetails(item));
                    list.appendChild(listItem);
                });
            })
            .catch((error) => console.error('Error fetching data:', error));
    }

    function displayDetails(item) {
        const modal = document.getElementById('entityModal');
        const modalLabel = document.getElementById('entityModalLabel');
        const modalDetails = document.getElementById('entityDetails');

        modalLabel.textContent = item.name;

        let details = `<strong>Name:</strong> ${item.name}`;

        if (item.url.includes('people')) {
            fetch(item.homeworld)
                .then((response) => response.json())
                .then((planet) => {
                    details += `<br><strong>Homeworld:</strong> ${planet.name}`;

                    return fetchTransports(item.starships);
                })
                .then((starships) => {
                    if (starships.length > 0) {
                        details += `<br><strong>Starships:</strong> ${starships.join(', ')}`;
                    }

                    modalDetails.innerHTML = details;
                    const bootstrapModal = new bootstrap.Modal(modal);
                    bootstrapModal.show();
                })
                .catch((error) => console.error('Error fetching additional data:', error));
        } else if (item.url.includes('planets')) {
            modalDetails.innerHTML = details;
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        } else {
            modalDetails.innerHTML = details;
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    }

    function fetchTransports(urls) {
        const promises = urls.map((url) => fetch(url).then((res) => res.json()));
        return Promise.all(promises).then((data) => data.map((d) => d.name));
    }
});
