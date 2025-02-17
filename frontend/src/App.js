import React, { useState, useEffect } from 'react';
import './App.css';
import Map from './components/Map';
import DateSlider from "./components/DateSlider";
import ShowPointInfo from "./components/showpointinfo";
import ColorLegend from './components/colorlegend';
import * as d3 from 'd3';

import worldgeomap from './data/carte_light.geo.json';
import metadatacsv from './data/metadata.csv';
import datacsv from './data/data.csv';

const App = () => {
  const [metadata, setMetadata] = useState([]);
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
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
      const maxDate = d3.max(data, d => d.date);
      setSelectedDate(maxDate);
    }
  }, [data]);

  // Fonction pour sélectionner un point sur la carte
  const handlePointClick = (point) => {
    setSelectedPoint(point); // Mise à jour du point sélectionné
    //console.log(point);
  };
  


  // Afficher la carte quand les données sont disponibles
  return (
    <div className="app-container">
      <div className="left-panel">
        <div className="top-left">
          <h1 style={{ textAlign: 'center' }}>World Map Visualization</h1>
          <DateSlider selectedDate={selectedDate} setSelectedDate={setSelectedDate} data={data} />
        </div>
  
        <div className="bottom-left">
        {worldgeomap && metadata.length > 0 && data.length > 0 ? (
          <div className="map-wrapper">
            <div className="map-container">
              <Map 
                worldData={worldgeomap} 
                metadata={metadata} 
                data={data} 
                selectedDate={selectedDate}
                onPointClick={handlePointClick}
              />
            </div>
            <div className="legend-container">
              <ColorLegend />
            </div>
          </div>
        ) : (
          <p>Loading map data...</p>
        )}
      </div>
      </div>
  
      <div className="right-panel">
        <ShowPointInfo point={selectedPoint} selectedDate={selectedDate} />
      </div>
    </div>
  );
};

export default App;
