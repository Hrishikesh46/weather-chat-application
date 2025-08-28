// src/utils/weatherFormatter.js
export const fixWeatherSpacing = (text) => {
  if (!text) return '';

  return (
    text
      // Fix missing spaces before temperature units
      .replace(/(\d)°C/g, '$1°C')
      .replace(/of(\d+\.?\d*°C)/g, 'of $1')
      .replace(/is(\d+\.?\d*°C)/g, 'is $1')
      .replace(/like(\d+\.?\d*°C)/g, 'like $1')

      // Fix missing spaces with percentages
      .replace(/at(\d+%)/g, 'at $1')
      .replace(/is(\d+%)/g, 'is $1')

      // Fix missing spaces with wind speeds
      .replace(/of(\d+\.?\d*)\s*km\/h/g, 'of $1 km/h')
      .replace(/speed(\d+\.?\d*)\s*km\/h/g, 'speed $1 km/h')
      .replace(/at(\d+\.?\d*)\s*km\/h/g, 'at $1 km/h')
      .replace(/gusts(\d+\.?\d*)\s*km\/h/g, 'gusts $1 km/h')

      // Fix general spacing issues
      .replace(/(\d)km\/h/g, '$1 km/h')
      .replace(/,(\s*gusts)/g, ', $1')
  );
};
