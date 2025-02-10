import React from 'react';


const showPointInfo = (point,currentDate) => {
    const point_data = point.point;
    //console.log(point_data);
    //console.log(currentDate);

    if (!point_data) {
        return <p>Select a point on the map to see its details.</p>;
      }

    return (<div className="right-panel">
    <div className="top-right">
    <h2>Metadata</h2>
      
        <div className="metadata-box">
          
          <p><strong>River:</strong> {point_data.river}</p>
          <p><strong>Country:</strong> {point_data.country}</p>
          <p><strong>Basin:</strong> {point_data.basin}</p>
        </div>
    </div>

    <div className="bottom-right">
      {/* Affichage du SVG */}
      <h2>SVG Visualization</h2>
      <div className="svg-box">
        <svg width="100%" height="100%">
          {/* Afficher le contenu de ton SVG ici */}
        </svg>
      </div>
    </div>
  </div>
);
};

export default showPointInfo;