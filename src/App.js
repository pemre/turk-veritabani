import './App.css';
import './leaflet-config';
import { useEffect, useMemo, useState } from 'react';
import { generateGeoJSON } from './helpers/generate-geojson';
import { ItemDetails } from './components/ItemDetails'
import { Map } from './components/Map';
import { YearRangeSelector } from './components/YearRangeSelector';
import originalSource from './items.json';

// TODO Fix map fly on range change
// TODO Remove Modal dependency

const DEBUG = true;
const URL_GEOJSON = 'https://gist.githubusercontent.com/pemre/b8b4e44a5b0a9f6321b5b9d9cb5c939a/raw/c05b39cc3ab015a5dac31b8d0e669b95d1b3f8a6/my-test-map.geojson';

function App() {
  const [item, setItem] = useState(null);
  const [items, setItems] = useState({ features: [] });
  // Filters
  const [filterByStartYear, setFilterByStartYear] = useState();
  const [filterByEndYear, setFilterByEndYear] = useState();

  const filteredItems = useMemo(() => {
    const features = items.features.filter(item =>
      (!filterByStartYear || item.properties.year >= filterByStartYear) &&
      (!filterByEndYear || item.properties.year <= filterByEndYear));
    return { ...items, features };
  }, [items, filterByStartYear, filterByEndYear]);

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

  const handleYearRangeChange = ({ value }) => {
    const [start, end] = value;
    console.debug('handleYearRangeChange()', start, end);
    setFilterByStartYear(start);
    setFilterByEndYear(end);
  }

  const handleItemDetailsClose = () => {
    setItem(false);
  }

  return (
    <div className="App">
      <header className="App-header">

        <Map
          center={[50, 45]}
          zoom={4}
          items={filteredItems}
          onItemClick={handleMapItemClick}
        />

        <YearRangeSelector
          dataSource={originalSource.items}
          onValueChanged={handleYearRangeChange}
        />

        {item && <ItemDetails item={item} onClose={handleItemDetailsClose} />}

      </header>
    </div>
  );
}

export default App;
