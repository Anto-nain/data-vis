import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import DateSlider from "./components/DateSlider";
import * as d3 from 'd3';

import worldgeomap from './data/world.json';
import metadatacsv from './data/metadata.csv';
import datacsv from './data/data.csv';

const App = () => {
  const [metadata, setMetadata] = useState([]);
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  //console.log(selectedDate);
  
  
  useEffect(() => {
    // Charger les données
    d3.csv(datacsv).then(data => {
      const parsedData = data.map(d => ({
        date: new Date(d.datetime.split(" ")[0]), // Garder la date (sans l'heure)
        height: +d.height,                                      // Convertir en nombre
        point_id: +d.point_id,                                  // Convertir en nombre
      }));
      setData(parsedData); // Mettre à jour l'état avec les nouvelles données
      //console.log(parsedData);
    });
  }, []);

  // Charger la métadata
  useEffect(() => {
    d3.csv(metadatacsv).then(data => {
      const parsedMetadata = data.map(d => ({
        link: d.link,
        river: d.river,
        country: d.country,
        basin: d.basin,
        point_id: +d.point_id,   // Convertir en nombre
        geometry0: +d.geometry0, // Longitude
        geometry1: +d.geometry1  // Latitude
      }));
      setMetadata(parsedMetadata); // Mettre à jour l'état avec les nouvelles données
      //console.log(parsedMetadata);
    });
  }, []);

  // Sélectionner la première date disponible
  useEffect(() => {
    if (data.length > 0) {
      const minDate = d3.min(data, d => d.date);
      setSelectedDate(minDate);
    }
  }, [data]);


  // Afficher la carte quand les données sont disponibles
  return (
    <div>
      <h1>World Map Visualization</h1>
      <DateSlider selectedDate={selectedDate} setSelectedDate={setSelectedDate} data={data} />
      {worldgeomap && metadata.length > 0 && data.length > 0 ? (
        <Map worldData={worldgeomap} metadata={metadata} data={data} selectedDate={selectedDate} />
      ) : (
        <p>Loading map data...</p>
      )}
    </div>
  );
};

export default App;
