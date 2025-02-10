import React from "react";

const formatDateLocal = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Mois entre 01 et 12
    const day = String(d.getDate()).padStart(2, "0"); // Jour entre 01 et 31
    return `${year}-${month}-${day}`;
  };
  

const DateSlider = ({ selectedDate, setSelectedDate, data }) => {
    // Extraire toutes les dates uniques sans UTC
    const uniqueDates = [...new Set(data.map(d => formatDateLocal(d.date)))].sort();
  
    return (
      <div>
        <input
          type="date"
          min={uniqueDates[0]}
          max={uniqueDates[uniqueDates.length - 1]}
          value={selectedDate ? formatDateLocal(selectedDate) : ""}
          onChange={(e) => {
            const [year, month, day] = e.target.value.split("-");
            const newDate = new Date(year, month - 1, day); // Création en heure locale
            setSelectedDate(newDate);
          }}
          onKeyDown={(e) => e.preventDefault()} // Empêche la saisie directe
        />
      </div>
    );
  };
  

export default DateSlider;
