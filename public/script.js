(function () {
    const noaaForm = document.getElementById('noaa-form')
    const noaaTable = document.getElementById('noaa-table');
    const noaaTableHead = document.getElementById('noaa-table-head');
    const noaaTableBody = document.getElementById('noaa-table-body');

    noaaForm.addEventListener("submit", async event => {
        event.preventDefault();

        // Convert form data to get selected endpoint
        const formData = new FormData(noaaForm);

        const endpoint = formData.get('endpoints');

        formData.delete('endpoints');

        await getEndpoint(endpoint);
    })

    async function getEndpoint(endpoint) {
        try {
            // Async getting response from express server
            const response = await fetch(`/${endpoint}`);
            
            // Async getting json from the response from server
            const data = await response.json();
            
            noaaTableHead.innerHTML = '';
            noaaTableBody.innerHTML = '';

            // Get existing column names from first data element
            const columns = Object.keys(data.results[0]);

            noaaTable.style.display = 'table';


            // Create the header row
            const headerRow = document.createElement('tr');
            columns.forEach(columnName => {
                const cell = document.createElement('th');
                cell.innerHTML = columnName;
                headerRow.appendChild(cell);
            });
            noaaTableHead.appendChild(headerRow);


            // Create a normal row for each data element
            data.results.forEach(item => {
                const row = document.createElement('tr');
                
                columns.forEach(columnName => {
                    const cell = document.createElement('td');
                    // If data doesn't exist put -
                    cell.innerHTML = item[columnName] ?? '-';
                    row.appendChild(cell);
                });
                noaaTableBody.appendChild(row);
            });



            if (!response.ok) {
                throw new Error(
                    `HTTP error: ${response.status} - ${JSON.stringify(data)}`
                );
            }
        }
        catch (error){
            console.log(`Error: ${error}`);
        }
    }
})();