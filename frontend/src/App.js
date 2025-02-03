import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import * as d3 from 'd3';

import worldgeomap from './data/world.json';
import metadatacsv from './data/metadata.csv';
import datacsv from './data/data.csv';

const App = () => {
  const [metadata, setMetadata] = useState([]);
  const [data, setData] = useState([]);
  
  // Charger les données
  useEffect(() => {
    d3.csv(datacsv).then(data => {
      const parseDate = d3.timeParse("%Y/%m/%d %H:%M");
      const parsedData = data.map(d => ({
        date: d3.timeFormat("%Y/%m/%d")(parseDate(d.datetime)), // Garder la date (sans l'heure)
        height: +d.height,                                      // Convertir en nombre
        point_id: +d.point_id,                                  // Convertir en nombre
      }));
      setData(parsedData); // Mettre à jour l'état avec les nouvelles données
    });
  }, []);

  // Charger la métadata
  useEffect(() => {
    d3.csv(metadatacsv).then(data => {
      const parsedData = data.map(d => ({
        link: d.link,
        river: d.river,
        country: d.country,
        basin: d.basin,
        point_id: +d.point_id,   // Convertir en nombre
        geometry0: +d.geometry0, // Longitude
        geometry1: +d.geometry1  // Latitude
      }));
      setMetadata(parsedData); // Mettre à jour l'état avec les nouvelles données
    });
  }, []);


  // Afficher la carte quand les données sont disponibles
  return (
    <div>
      <h1>World Map Visualization</h1>
      {worldgeomap && metadata.length > 0 ? (
        <Map worldData={worldgeomap} metadata={metadata} data={data} />
      ) : (
        <p>Loading map data...</p>
      )}
    </div>
  );
};

export default App;
