// downloads the bike facilities data from ArcGIS sources

const fs = require("fs");
const fetch = require('node-fetch');

// Function to help build a query string for querying the ArcGIS REST service
function queryString(queryProperties) {
    let queryString = '';
    for (let property in queryProperties) {
        queryString += `${property}=${queryProperties[property].toString()}&`
    }
    return queryString.slice(0, -1)
}

// REST endpoint for a dataset published to an ArcGIS Server. In this case, it was published to an ArcGIS Online ArcGIS Server 
let existingGreenwaysURL = 'https://services.arcgis.com/v400IkDOw1ad7Yad/ArcGIS/rest/services/Greenway_Trails_All/FeatureServer/0';
let existingBikeFacilities = 'https://services.arcgis.com/v400IkDOw1ad7Yad/ArcGIS/rest/services/Existing_Bike_Facilities/FeatureServer/6';
let programmedBikeFacilities = 'https://services.arcgis.com/v400IkDOw1ad7Yad/ArcGIS/rest/services/Programmed_Bike_Facilities/FeatureServer/6';

// Create the query string. These are the minimum parameters needed to return valid GeoJSON of a dataset, but addtional parameters could be added to refine the query
let queryParams = queryString({
    where: "1=1",
    outSR: 4326,
    outFields: "*",
    f: "geojson"
}); 

dl(existingGreenwaysURL, "raleighExistingGreenways.geojson");
dl(existingBikeFacilities, "raleighExistingBikeFacilities.geojson");
dl(programmedBikeFacilities, "raleighProgrammedBikeFacilities.geojson");

function dl(url, filename) {
    fetch(`${url}/query?${queryParams}`)
    .then(resp => {
        resp.json()
            .then(data => {
                fs.writeFileSync(filename, JSON.stringify(data));
            })
            .catch(x => {
                console.error(x);
            });
    })
    .catch(x => {
        console.error(x);
    });
}
