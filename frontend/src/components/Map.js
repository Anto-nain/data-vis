import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import getHeightColorScale from './heightcolorscale';
import showPointInfo from './showpointinfo';

// worldData est la géomap du monde
// metadata est la metadata

const Map = ({ worldData, metadata, data, selectedDate, onPointClick}) => { 
  //console.log(selectedDate);

  //console.log(metadata) 
  //console.log(data);

    useEffect(() => {
 
      const width = 800;
      const height = 600;
  
      // Select the SVG container
      const svg = d3.select("#map")
        .attr("viewBox", [0, 0, width, height])
        .attr("width", width)
        .attr("height", height);
  
      // Clear previous drawings
      svg.selectAll("*").remove();
  
      // Create a group for the map
      const g = svg.append("g");
  
      // Define the projection
      const projection = d3.geoMercator().fitSize([width, height], worldData);
      const path = d3.geoPath().projection(projection);
  
      // Add zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", (event) => {
          g.attr("transform", event.transform);
        });
  
      svg.call(zoom);

      
      // Echelle de couleur pour nos points
      const colorScale = d3.scaleLinear()
        .domain([-1, 0, 1])  // Correspond à : (bien en dessous, à la moyenne, bien au dessus)
        .range(["red", "white", "blue"]); // Rouge pour -1, blanc pour 0, bleu pour 1

      // Calculer la hauteur actuelle et la couleur de chaque point
      const pointsData = metadata.map((point) => {
        const pointData = data.filter(d => d.point_id == point.point_id);

        // Filtrer les données jusqu'à la date sélectionnée incluse
        //console.log(selectedDate);
        //console.log(pointData);
        const validData = pointData.filter(d => d.date <= new Date(selectedDate));
        //console.log(validData);

        if (validData.length === 0) {
          return null; // Exclure ce point s'il n'a pas de valeur avant ou à la date sélectionnée
        }

        // Trouver la dernière hauteur d'eau connue avant ou à la date sélectionnée
        const lastData = d3.max(validData, d => d.date);
        const currentHeight = pointData.find(d => d.date.getTime() === lastData.getTime()).height;

        // Série des hauteurs et des dates associées
        const heightSerie = pointData.map(d => d.height);
        const timeSerie = pointData.map(d => d.date);

        return {
          ...point,
          currentHeight,
          heightSerie,
          timeSerie,
        };
      }).filter(d => d !== null); // Supprimer les points sans données valides


      // Calculer la couleur moyenne pour chaque pays
      const countryColors = {};

      worldData.features.forEach(country => {
        const countryPoints = pointsData.filter(point => d3.geoContains(country, [point.geometry0, point.geometry1]));
        //console.log(countryPoints);
        if (countryPoints.length > 0) {
          // Calculer la couleur moyenne des points du pays
          const avgColor = d3.mean(countryPoints, point => getHeightColorScale(point.currentHeight, point.heightSerie));
          countryColors[country.properties.name] = colorScale(avgColor);
          console.log(country.properties.name);
        }
        else {
          countryColors[country.properties.name] = "#ccc"; // Couleur par défaut
        }
      });
      console.log(countryColors);

      // Dessiner les pays avec leur couleur moyenne calculée
      g.append("g")
        .selectAll("path")
        .data(worldData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", d => countryColors[d.properties.name])  // Utilise la couleur moyenne calculée
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5);

      // Plot data points
      g.selectAll("circle")
        .data(pointsData)
        .enter()
        .append("circle")
        .attr("cx", d => projection([d.geometry0, d.geometry1])[0])
        .attr("cy", d => projection([d.geometry0, d.geometry1])[1])
        .attr("r", 2)
        .attr("fill", d => colorScale(getHeightColorScale(d.currentHeight, d.heightSerie)))
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5)
        .attr("cursor","pointer")
        .on("click", (event, d) => onPointClick(d))
        .append("title")
        .text(d => `Point ID: ${d.point_id}`);
  
    }, [worldData, metadata, data, selectedDate]); // Runs when data updates
  
    return <svg id="map"></svg>;
  };
  
  export default Map;