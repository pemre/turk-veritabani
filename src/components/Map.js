import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import * as ReactDOMServer from 'react-dom/server'
import { Summary } from './Summary'
import { GeoJsonWithUpdates as GeoJSON } from './GeoJsonWithUpdates'

export const Map = ({ center, zoom, items, onItemClick }) => {
  const [coordinates, setCoordinates] = useState(center);

  const FlyMapTo = () => {
    const map = useMap();

    useEffect(() => {
      const [y, x] = coordinates;
      // We need to reverse it, why?!
      map.panTo([x, y]);
    }, [coordinates])

    return null;
  }

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        setCoordinates(feature.properties.coordinates);
        onItemClick(feature.properties);
        console.log('-------feature', feature)
      },
    });

    const content = ReactDOMServer.renderToString(
      <Summary properties={feature.properties} />
    );

    layer.bindTooltip(content, {
      // permanent: true, // For debugging
      direction: 'left',
      offset: [-5, 12]
    });
  }

  return (
    <div className="map">
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={2}
        scrollWheelZoom={true}
      >
        <FlyMapTo />
        <TileLayer
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className='map-tiles'
        />
        {items && <GeoJSON data={items} onEachFeature={onEachFeature} />}
      </MapContainer>
    </div>
  );
};
