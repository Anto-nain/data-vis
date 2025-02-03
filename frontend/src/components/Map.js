import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import getHeightColorScale from './heightcolorscale';

// worldData est la géomap du monde
// metadata est la metadata

const Map = ({ worldData, metadata, data}) => { 
  console.log(metadata) 
  console.log(data);

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

      // Draw the world map
      g.append("g")
        .selectAll("path")
        .data(worldData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", "#ccc")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5);
      
      // Echelle de couleur pour nos points
      const colorScale = d3.scaleLinear()
        .domain([-1, 0, 1])  // Correspond à : (bien en dessous, à la moyenne, bien au dessus)
        .range(["red", "white", "blue"]); // Rouge pour -1, blanc pour 0, bleu pour 1

      // Calculer la hauteur actuelle et la couleur de chaque point
      const pointsData = metadata.map((point) => {
        const pointData = data.filter(d => d.point_id == point.point_id);

        // Hauteur sélectionnée par date (la plus récente pour l'instant)
        const selectedData = d3.max(pointData, d => d.date);        
        const currentHeight = pointData.find(d => d.date == selectedData).height;

        // série des hauteurs
        const heightSerie = pointData.map(d => d.height);
      
        return {
          ...point,
          currentHeight,
          heightSerie,
        };
      });
    


        
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
        .append("title")
        .text(d => `Point ID: ${d.point_id}`);
  
    }, [worldData, metadata]); // Runs when data updates
  
    return <svg id="map"></svg>;
  };
  
  export default Map;