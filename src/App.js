import './App.css';
import './leaflet-config';
import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet';
import { generateGeoJSON } from './helpers/generate-geojson'
import { GeoJsonWithUpdates as GeoJSON } from './components/GeoJsonWithUpdates';
import { YearRangeSelector } from './components/YearRangeSelector';
import originalSource from './items.json';

const DEBUG = true;
const URL_GEOJSON = 'https://gist.githubusercontent.com/pemre/b8b4e44a5b0a9f6321b5b9d9cb5c939a/raw/c05b39cc3ab015a5dac31b8d0e669b95d1b3f8a6/my-test-map.geojson';

function App() {
  const [items, setItems] = useState({ features: [] });
  // Filters
  const [filterByStartYear, setFilterByStartYear] = useState();
  const [filterByEndYear, setFilterByEndYear] = useState();

  const filteredItems = useMemo(() => {
    const features = items.features.filter(item =>
      (!filterByStartYear || item.properties.year >= filterByStartYear) &&
      (!filterByEndYear || item.properties.year <= filterByEndYear));
    console.log('MEMOO')
    return { ...items, features };
  }, [items, filterByStartYear, filterByEndYear]);

  console.log('RENDER', filteredItems, filterByStartYear, filterByEndYear)

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

  const handleYearRangeChange = ({ value }) => {
    const [start, end] = value;
    console.debug('handleYearRangeChange()', start, end);
    setFilterByStartYear(start);
    setFilterByEndYear(end);
  }

  return (
    <div className="App">
      <header className="App-header">

        <MapContainer center={[40, 70]} zoom={4} scrollWheelZoom={true}>
          <TileLayer
            attribution=''
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            className='map-tiles'
          />
          {filteredItems && <GeoJSON data={filteredItems}/>}
        </MapContainer>

        <YearRangeSelector
          dataSource={originalSource.items}
          onValueChanged={handleYearRangeChange}
        />

      </header>
    </div>
  );
}

export default App;
