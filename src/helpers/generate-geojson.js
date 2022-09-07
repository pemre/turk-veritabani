export const generateGeoJSON = (items = []) => {
  return {
    type: 'FeatureCollection',
    features: items.map((item) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: item.coordinates
      },
      properties: item
    }))
  }
};
