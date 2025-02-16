import { React, useEffect, useState } from 'react'
import {MapContainer, Polygon, TileLayer, Tooltip, useMap} from 'react-leaflet'
import * as ReactDOMServer from 'react-dom/server'
import { Summary } from './Summary'
import { GeoJsonWithUpdates as GeoJSON } from './GeoJsonWithUpdates'
// TODO Create generic or specific flag component
// import FlagBashkortostan from './flags/flag-bashkortostan.svg'
// import FlagEastTurkistan from './flags/flag-east-turkistan.svg'
// import FlagKhakassia from './flags/flag-khakassia.svg'
// import FlagTatarstan from './flags/flag-tatarstan.svg'
import {
  lowPolyAzerbaijan,
  lowPolyBashkortostan,
  lowPolyEastTurkistan,
  lowPolyKazakhstan,
  lowPolyKhakassia,
  lowPolyKyrgyzstan,
  lowPolyTatarstan,
  lowPolyTurkiye,
  lowPolyTurkmenistan,
  lowPolyUzbekistan
} from '../low-poly-maps';
import Image from "next/image";

const FlagFormatter = ({flagEmoji}) => {
  return (
    <div className="absolute top-[-0.9rem] text-[1.2rem]">{flagEmoji}</div>
  );
};

const WordFormatter = ({ word }) => {
  if (!word) return;

  const items = word.split(";");

  return (
    <>
      {items.map((item, index) => (
        <div key={index}>
          {item}
          {index < items.length - 1 && <>,<br /></>}
        </div>
      ))}
    </>
  );
};

export const Map = ({ center, zoom, items, onItemClick, word }) => {
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

        <Polygon pathOptions={{ color: '#87CEFA' }} positions={lowPolyAzerbaijan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            <FlagFormatter flagEmoji="🇦🇿" />
            <WordFormatter word={word.aze} />
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: '#01aa0d' }} positions={lowPolyBashkortostan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            <Image aria-hidden src="/flags/flag-bashkortostan.svg" alt="Flag of Bashkortostan"
              width={20}
              height={20}
              className="absolute top-[-0.5rem]"
            />
            <WordFormatter word={word.bak} />
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: '#ff8800' }} positions={lowPolyEastTurkistan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            <Image aria-hidden src="/flags/flag-east-turkistan.svg" alt="Flag of East Turkistan"
                   width={20}
                   height={20}
                   className="absolute top-[-0.5rem]"
            />
            <WordFormatter word={word.uig} />
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: '#40E0D0', fillColor: 'blue' }} positions={lowPolyKazakhstan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            <FlagFormatter flagEmoji="🇰🇿" />
            <WordFormatter word={word.kaz} />
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: 'lightgreen' }} positions={lowPolyKhakassia.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            <Image aria-hidden src="/flags/flag-khakassia.svg" alt="Flag of Khakassia"
                   width={20}
                   height={20}
                   className="absolute top-[-0.5rem]"
            />
            <WordFormatter word={word.hak} />
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: '#FF6347' }} positions={lowPolyKyrgyzstan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            <FlagFormatter flagEmoji="🇰🇬" />
            <WordFormatter word={word.kir} />
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: 'white' }} positions={lowPolyTatarstan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            <Image aria-hidden src="/flags/flag-tatarstan.svg" alt="Flag of Tatarstan"
                   width={20}
                   height={20}
                   className="absolute top-[-0.5rem]"
            />
            <WordFormatter word={word.tat} />
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: 'red' }} positions={lowPolyTurkiye.coordinates} className="group">
          <Tooltip className="" direction="top" offset={[0, 0]} opacity={1} permanent >
            <FlagFormatter flagEmoji="🇹🇷" />
            <WordFormatter word={word.tur} />
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: '#2cf359' }} positions={lowPolyTurkmenistan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            <FlagFormatter flagEmoji="🇹🇲" />
            <WordFormatter word={word.tuk} />
          </Tooltip>
        </Polygon>
        <Polygon pathOptions={{ color: 'yellow' }} positions={lowPolyUzbekistan.coordinates}>
          <Tooltip className="EMRE" direction="top" offset={[0, 0]} opacity={1} permanent >
            <FlagFormatter flagEmoji="🇺🇿" />
            <WordFormatter word={word.uzb} />
          </Tooltip>
        </Polygon>

        {items && <GeoJSON data={items} onEachFeature={onEachFeature} />}
      </MapContainer>
    </div>
  );
};
