import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const ColorLegend = () => {
  const legendRef = useRef();

  useEffect(() => {
    const legendHeight = 220;
    const legendWidth = 20;

    const svg = d3.select(legendRef.current)
      .attr("width", 80)
      .attr("height", legendHeight + 40);

    // Définition de l'échelle de couleur statique
    const colorScale = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(["red", "white", "blue"]);

    // Création du dégradé
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "static-color-gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "100%")
      .attr("y2", "0%");

    // Ajout des couleurs au dégradé
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "red");
    gradient.append("stop").attr("offset", "50%").attr("stop-color", "white");
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "blue");

    // Dessiner le rectangle coloré
    svg.append("rect")
      .attr("x", 20)
      .attr("y", 30)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#static-color-gradient)");

    // Ajout des labels
    const scale = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range([legendHeight, 0]);

    const axis = d3.axisRight(scale)
      .ticks(3)
      .tickFormat(d => {
        if (d === -1) return "Min";
        if (d === 0) return "Max";
        if (d === -0.5) return "Avg";
        return d;
      });

    svg.append("g")
      .attr("transform", `translate(${20 + legendWidth}, 30)`)
      .call(axis);

    // Ajouter un titre
    svg.append("text")
      .attr("x", 10)
      .attr("y", 10)
      .attr("font-size", "12px")
      .text("Orthometric");

    svg.append("text")
      .attr("x", 10)
      .attr("y", 22)
      .attr("font-size", "12px")
      .text("Height");

  }, []);

  return <svg ref={legendRef} ></svg>;
};

export default ColorLegend;
