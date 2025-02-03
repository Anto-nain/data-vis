import * as d3 from 'd3';

// Cette fonction prend en entrée la hauteur actuelle et la série temporelle des hauteurs, et retourne une couleur en fonction de la hauteur actuelle. La moyenne est calibrée pour être à 0
function getHeightColorScale(currentHeight, heightSeries) {
    // Calculer la moyenne et l'écart-type de la série temporelle
    const mean = d3.mean(heightSeries);
    const stdDev = d3.deviation(heightSeries);
  
    // Calculer le score z de la valeur actuelle
    const z = (currentHeight - mean) / stdDev;
  
    // Convertir ce score z dans l'intervalle [-1, 1]
    const normalizedValue = 2 * (z / (Math.abs(z) + 1));
  
    return normalizedValue;
  }

export default getHeightColorScale;
  