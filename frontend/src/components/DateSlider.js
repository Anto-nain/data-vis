import React from "react";

const DateSlider = ({ selectedDate, setSelectedDate, data }) => {
    // Extraire toutes les dates uniques
    const uniqueDates = [...new Set(data.map(d => d.date.getTime()))].sort();
  
    return (
      <div>
        <input
          type="range"
          min={0}
          max={uniqueDates.length - 1}
          value={uniqueDates.findIndex(d => d === selectedDate?.getTime())}
          onChange={(e) => {
            const newDate = new Date(uniqueDates[e.target.value]);
            setSelectedDate(newDate);
          }}
        />
        <p>Date sélectionnée : {selectedDate ? selectedDate.toLocaleDateString("fr-FR") : "Chargement..."}</p>
      </div>
    );
  };

export default DateSlider;
