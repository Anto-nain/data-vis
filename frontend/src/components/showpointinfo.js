import React from 'react';


const showPointInfo = (point,currentDate) => {
    var point_data = point.point;
    //console.log(point_data);
    //console.log(currentDate);

    if (!point_data) {
        point_data = {
            river: "Unknown",
            country: "Unknown",
            basin: "Unknown"
        };
      }

    return (<div className="right-panel">
    <div className="top-right">
    <h2 style={{ textAlign: 'center' }}>Metadata</h2>          
          <p><strong>River:</strong> {point_data.river}zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz</p>
          <p><strong>Country:</strong> {point_data.country}</p>
          <p><strong>Basin:</strong> {point_data.basin}</p>
          <p><strong>Basin:</strong> {point_data.basin}</p>
          <p><strong>Basin:</strong> {point_data.basin}</p>
    </div>

    <div className="bottom-right">
      {/* Affichage du SVG */}
        <svg width="100%" height="100%">

          <rect x="0" y="40" height="100" width="10"></rect>
          <rect x="20" y="10" height="400" width="10"></rect>
          <rect x="40" y="30" height="200" width="1000"></rect>
          <p><strong>Basin:</strong> {point_data.basin}</p>
          <p><strong>Basin:</strong> {point_data.basin}</p>
  

        </svg>
    </div>
  </div>
);
};

export default showPointInfo;