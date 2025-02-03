import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// worldData est la géomap du monde
// metadata est la metadata

const Map = ({ worldData, metadata, data}) => { 
  //console.log(metadata) 
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
  
      // Plot data points
      g.selectAll("circle")
        .data(metadata)
        .enter()
        .append("circle")
        .attr("cx", d => projection([d.geometry0, d.geometry1])[0])
        .attr("cy", d => projection([d.geometry0, d.geometry1])[1])
        .attr("r", 2)
        .attr("fill", "red")
        .attr("stroke", "#000")
        .attr("stroke-width", 0.5)
        .append("title")
        .text(d => `Point ID: ${d.point_id}`);
  
    }, [worldData, metadata]); // Runs when data updates
  
    return <svg id="map"></svg>;
  };
  
  export default Map;