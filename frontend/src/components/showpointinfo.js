import React, { useEffect, useRef } from "react";
import getHeightColorScale from "./heightcolorscale";
import * as d3 from "d3";

const ShowPointInfo = ({ point, selectedDate }) => {
    const svgRef = useRef(); // Référence pour l'élément SVG

    if (!point) {
        point = {
            coordinates: "Unknown",
            river: "Unknown",
            country: "Unknown",
            basin: "Unknown",
            timeSerie: [],
            heightSerie: []
        };
    } else {
        point.coordinates = `${point.geometry1}, ${point.geometry0}`;
    }

    useEffect(() => {
        if (!point.timeSerie || !point.heightSerie || point.timeSerie.length === 0) return;

        console.log(point);
        console.log(selectedDate)

         // Filtrage des données selon la date sélectionnée
        const filteredData = point.timeSerie
        .map((d, i) => ({ date: new Date(d), height: point.heightSerie[i] }))
        .filter(d => d.date <= new Date(selectedDate)); // Ne conserver que les données avant ou égales à la date sélectionnée

        if (filteredData.length === 0) return; // Si aucune donnée valide, ne rien afficher

        // Trouver la dernière hauteur avant ou à la date sélectionnée
        const lastData = d3.max(filteredData, (d) => d.date);
        const currentHeight = filteredData.find(d => d.date.getTime() == lastData.getTime()).height;
        const currentDate = lastData;

        console.log(currentHeight);
        console.log(lastData);

        const width = 550, height = 400;
        const margin = { top: 30, right: 20, bottom: 40, left: 40 };

        // Sélection de l'élément SVG et nettoyage
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Conversion des données
        const parsedData = point.timeSerie.map((d, i) => ({
            date: new Date(d),
            height: point.heightSerie[i]
        }));

        const avgHeight = d3.mean(parsedData, (d) => d.height);

        // Échelles
        const x = d3.scaleTime()
            .domain(d3.extent(parsedData, (d) => d.date))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([d3.min(parsedData, (d) => d.height) - 0.5, d3.max(parsedData, (d) => d.height) + 0.5])
            .range([height - margin.bottom, margin.top]);

        // Color scale for gradient based on height
        const colorScale = d3.scaleLinear()
            .domain([d3.min(parsedData, d => d.height), avgHeight, d3.max(parsedData, d => d.height)]) 
            .range(["red", "white", "blue"]);

            
  // Création du premier gradient : du min à la moyenne
const gradient1 = svg.append("defs")
.append("linearGradient")
.attr("id", "gradient-min-to-avg")
.attr("x1", "0%")
.attr("y1", () => y(d3.min(parsedData, d => d.height))) // Commence au min
.attr("x2", "0%")
.attr("y2", () => y(avgHeight)) // Se termine à la moyenne
.attr("gradientUnits", "userSpaceOnUse");

gradient1.append("stop")
.attr("offset", "0%")
.attr("stop-color", "red")
.attr("stop-opacity", 1);

gradient1.append("stop")
.attr("offset", "100%")
.attr("stop-color", "red")
.attr("stop-opacity", 0);


// Création du deuxième gradient : de la moyenne au max
const gradient2 = svg.append("defs")
.append("linearGradient")
.attr("id", "gradient-avg-to-max")
.attr("x1", "0%")
.attr("y1", () => y(avgHeight)) // Commence à la moyenne
.attr("x2", "0%")
.attr("y2", () => y(d3.max(parsedData, d => d.height))) // Se termine au max
.attr("gradientUnits", "userSpaceOnUse");

gradient2.append("stop")
.attr("offset", "0%")
.attr("stop-color", "blue")
.attr("stop-opacity", 0);

gradient2.append("stop")
.attr("offset", "100%")
.attr("stop-color", "blue")
.attr("stop-opacity", 1);


// Application des gradients à la zone "area"
const area = d3.area()
.x(d => x(d.date))
.y0(d => y(avgHeight)) // Utilisation du minimum
.y1(d => y(d.height)) // Hauteur des points

// Zone de couleur entre le min et la moyenne
svg.append("path")
.datum(parsedData)
.attr("d", area)
.attr("fill", "url(#gradient-min-to-avg)");


// Application du deuxième gradient entre la moyenne et le maximum
const area2 = d3.area()
.x(d => x(d.date))
.y0(d => y(avgHeight)) // Ligne de base à la moyenne
.y1(d => y(d.height)) // Hauteur des points

svg.append("path")
.datum(parsedData)
.attr("d", area2)
.attr("fill", "url(#gradient-avg-to-max)");


      

        // Ajout des axes
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%b %Y")))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)");

        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y));

        // Ajout de la ligne de série temporelle
        const line = d3.line()
            .x((d) => x(d.date))
            .y((d) => y(d.height));

        svg.append("path")
            .datum(parsedData)
            .attr("fill", "none") // Remplissage avec le dégradé
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("d", line);

        // Ligne horizontale de la moyenne
        /*
        svg.append("line")
            .attr("x1", margin.left)
            .attr("x2", width - margin.right)
            .attr("y1", y(avgHeight))
            .attr("y2", y(avgHeight))
            .attr("stroke", "blue")
            .attr("stroke-width", 1);*/

        // Ajout de la légende
        svg.append("text")
            .attr("x", width - margin.right)
            .attr("y", height - margin.bottom - 10)
            .attr("text-anchor", "end")
            .style("font-size", "14px")
            .text("Date");

        svg.append("text")
            .attr("x", margin.left + 120)
            .attr("y", margin.top - 10)
            .attr("text-anchor", "end")
            .style("font-size", "14px")
            .text("Orthometric Height (m)");

        // Ajout du curseur fixe
        // Ligne verticale
            svg.append("line")
                .attr("x1", x(currentDate))
                .attr("x2", x(currentDate))
                .attr("y1", y(currentHeight))
                .attr("y2", height - margin.bottom)
                .attr("stroke", "black")
                .attr("stroke-width", 1)
                .attr("stroke-dasharray", "5,5");

            // Ligne horizontale
            svg.append("line")
            .attr("x1", margin.left)
            .attr("x2", x(currentDate))
            .attr("y1", y(currentHeight))
            .attr("y2", y(currentHeight))
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("stroke-dasharray", "5,5");

            // Ligne verticale de la croix
            svg.append("line")
            .attr("x1", x(currentDate))
            .attr("x2", x(currentDate))
            .attr("y1", y(currentHeight) - 5) // Longueur de la croix
            .attr("y2", y(currentHeight) + 5)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
            
            // Ligne horizontale de la croix
            svg.append("line")
            .attr("x1", x(currentDate) - 5) // Longueur de la croix
            .attr("x2", x(currentDate) + 5)
            .attr("y1", y(currentHeight))
            .attr("y2", y(currentHeight))
            .attr("stroke", "black")
            .attr("stroke-width", 2);

    }, [point, selectedDate]);

    return (
        <div className="right-panel">
            <div className="top-right">
                <h2 style={{ textAlign: "center" }}>Metadata</h2>
                <p><strong>Coordinates:</strong> {point.coordinates}</p>
                <p><strong>River:</strong> {point.river}</p>
                <p><strong>Basin:</strong> {point.basin}</p>
                <p><strong>Country:</strong> {point.country}</p>
            </div>

            <div className="bottom-right">
                <svg ref={svgRef} width="800" height="400"></svg>
            </div>
        </div>
    );
};

export default ShowPointInfo;
