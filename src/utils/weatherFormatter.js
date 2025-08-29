export const fixWeatherSpacing = (text) => {
  if (!text) return '';

  return text
    .replace(/(\d)°C/g, '$1°C')
    .replace(/of(\d+\.?\d*°C)/g, 'of $1')
    .replace(/is(\d+\.?\d*°C)/g, 'is $1')
    .replace(/like(\d+\.?\d*°C)/g, 'like $1')

    .replace(/at(\d+%)/g, 'at $1')
    .replace(/is(\d+%)/g, 'is $1')

    .replace(/of(\d+\.?\d*)\s*km\/h/g, 'of $1 km/h')
    .replace(/speed(\d+\.?\d*)\s*km\/h/g, 'speed $1 km/h')
    .replace(/at(\d+\.?\d*)\s*km\/h/g, 'at $1 km/h')
    .replace(/gusts(\d+\.?\d*)\s*km\/h/g, 'gusts $1 km/h')

    .replace(/(\d)km\/h/g, '$1 km/h')
    .replace(/,(\s*gusts)/g, ', $1');
};
