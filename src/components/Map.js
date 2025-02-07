import { useEffect, useState } from 'react'
import {MapContainer, Polygon, TileLayer, Tooltip, useMap} from 'react-leaflet'
import * as ReactDOMServer from 'react-dom/server'
import { Summary } from './Summary'
import { GeoJsonWithUpdates as GeoJSON } from './GeoJsonWithUpdates'
import {
  lowPolyEastTurkistan,
  lowPolyKazakhstan,
  lowPolyKhakassia,
  lowPolyKyrgyzstan,
  lowPolyUzbekistan
} from '../low-poly-maps';

// Test
const word = {
  tur: 'kurultay',
  aze: 'gurultay',
  bas: 'koroltay',
  kaz: 'kurıltay',
  kir: 'kurultay',
  ozb: 'kurultày',
  tat: 'korıltay',
  trm: 'gurultay',
  uyg: 'kurultay, syezd',
  rus: 'kurultay, kongress'
};

// Test
const wordKing = {
  tur: 'kral',
  aze: 'kral',
  bas: 'korol\'',
  kaz: 'korol\'',
  kir: 'korol',
  ozb: 'kıràl',
  tat: 'korol\'',
  trm: 'korol',
  uyg: 'korol\'',
  rus: 'korol\''
};

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

        <Polygon pathOptions={{ color: '#87CEFA' }} positions={lowPolyEastTurkistan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            {word.uyg}
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: '#40E0D0', fillColor: 'blue' }} positions={lowPolyKazakhstan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            🇰🇿 {word.kaz}
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: 'lightgreen' }} positions={lowPolyKhakassia.coordinates}>
          {/*<Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >*/}
          {/*  {word.uyg}*/}
          {/*</Tooltip>*/}
        </Polygon>
        <Polygon pathOptions={{ color: '#FF6347' }} positions={lowPolyKyrgyzstan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            🇰🇬 {word.kir}
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: 'yellow' }} positions={lowPolyUzbekistan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            🇺🇿 {word.ozb}
          </Tooltip>
        </Polygon>

        {items && <GeoJSON data={items} onEachFeature={onEachFeature} />}
      </MapContainer>
    </div>
  );
};
