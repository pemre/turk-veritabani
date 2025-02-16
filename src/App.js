import './App.css';
import './leaflet-config';
import { useEffect, useMemo, useState } from 'react';
import { generateGeoJSON } from './helpers/generate-geojson';
// import { ItemDetails } from './components/ItemDetails'
import { Map } from './components/Map';
// import { YearRangeSelector } from './components/YearRangeSelector';
import originalSource from './items.json';
import TranslationTable from "./components/TranslationTable";

// TODO Fix map fly on range change
// TODO Remove Modal dependency
/* TODO Explain dependencies and their usage in README:
  "devextreme-react": "22.1.4",
  "leaflet": "^1.8.0",
  "react-click-outside-hook": "^1.1.1",
  "react-leaflet": "^4.0.2",
  "react-modal": "^3.15.1",
  "react-window": "^1.8.11",
*/

const DEBUG = true;
const URL_GEOJSON = 'https://gist.githubusercontent.com/pemre/b8b4e44a5b0a9f6321b5b9d9cb5c939a/raw/c05b39cc3ab015a5dac31b8d0e669b95d1b3f8a6/my-test-map.geojson';

function App() {
  // const [item, setItem] = useState(null);
  const [items, setItems] = useState({ features: [] });
  // Filters
  // const [filterByStartYear, setFilterByStartYear] = useState();
  // const [filterByEndYear, setFilterByEndYear] = useState();

  const filteredItems = useMemo(() => {
    const features = items.features.filter(item =>
      (!filterByStartYear || item.properties.year >= filterByStartYear) &&
      (!filterByEndYear || item.properties.year <= filterByEndYear));
    return { ...items, features };
  }, [items, filterByStartYear, filterByEndYear]);

  const [word, setWord] = useState({
    "tur": "abajur",
    "aze": "abajur",
    "bak": "abajur",
    "kaz": "abajur",
    "kir": "abajur",
    "uzb": "äbäjür",
    "tat": "abajur",
    "tuk": "abajur",
    "uig": "abajur; lampa kalpiği",
    "rus": "abajur"
  });

  useEffect(() => {
    if (DEBUG) {
      const generatedGeoJSON = generateGeoJSON(originalSource.items);
      setItems(generatedGeoJSON);
    } else {
      fetch(URL_GEOJSON)
        .then((response) => response.json())
        .then((geoJson) => {
          console.log('ONCE useEffect() geoJson', geoJson);
          setItems(geoJson);
        });
    }
  }, []);

  const handleMapItemClick = (item) => {
    setItem(item);
  }

  // const handleYearRangeChange = ({ value }) => {
  //   const [start, end] = value;
  //   console.debug('handleYearRangeChange()', start, end);
  //   setFilterByStartYear(start);
  //   setFilterByEndYear(end);
  // }

  // const handleItemDetailsClose = () => {
  //   setItem(false);
  // }

  const handleTranslationRowClick = (thing) => {
    setWord(thing);
    console.log('thing  ', thing);
  }

  return (
    <>
      <Map
        center={[55, 45]}
        zoom={4}
        items={filteredItems}
        onItemClick={handleMapItemClick}
        word={word}
      />

      <div className="mt-8"></div>

      <TranslationTable onRowClick={handleTranslationRowClick} />

      {/*<YearRangeSelector*/}
      {/*  dataSource={originalSource.items}*/}
      {/*  onValueChanged={handleYearRangeChange}*/}
      {/*/>*/}

      {/*{item && <ItemDetails item={item} onClose={handleItemDetailsClose} />}*/}
    </>
  );
}

export default App;
