(function () {
    const stationsTable = document.getElementById('stations-table');
    const stationsTableBody = document.getElementById('stations-table-body');

    async function getStations() {
        try {
            // Async getting response from express server on localhost:3000/stations
            const response = await fetch("/stations");
            
            // Async getting json from the response from server
            const data = await response.json();
            

            if (!response.ok) {
                throw new Error(
                    `HTTP error: ${response.status} - ${JSON.stringify(data)}`
                );
            }
            
            stationsTable.style.display = 'flow';

            // Data is stored:
            // metadata: {...}
            // results: [{...},{...}...]
            // Data is an object so you have to loop through table results
            data.results.forEach(element => {
                let newRow = document.createElement('tr');
                let newID = document.createElement('td');
                let newName = document.createElement('td');
                let newLatitude = document.createElement('td');
                let newLongitude = document.createElement('td');

                newID.innerHTML = element.id;
                newName.innerHTML = element.name;
                newLatitude.innerHTML = element.latitude;
                newLongitude.innerHTML = element.longitude;

                stationsTableBody.appendChild(newRow);
                newRow.appendChild(newID);
                newRow.appendChild(newName);
                newRow.appendChild(newLatitude);
                newRow.appendChild(newLongitude);
                
            });
        }
        catch (error){
            console.log(`Error: ${error}`);
        }
    }
    getStations();
})();