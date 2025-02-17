import './App.css';
import {
  useEffect,
  useState,
  useRef,
} from 'react';
// import { generateGeoJSON } from '@/helpers/generate-geojson';
// import { ItemDetails } from './components/ItemDetails'
// import { YearRangeSelector } from './components/YearRangeSelector';
// import originalSource from './items.json';
import TranslationTable from "@/components/TranslationTable";
import { MapDynamic } from "@/components/MapDynamic";

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

// const DEBUG = true;
// const URL_GEOJSON = 'https://gist.githubusercontent.com/pemre/b8b4e44a5b0a9f6321b5b9d9cb5c939a/raw/c05b39cc3ab015a5dac31b8d0e669b95d1b3f8a6/my-test-map.geojson';

function App() {
  // const [item, setItem] = useState(null);
  // const [items, setItems] = useState({ features: [] });
  // Filters
  // const [filterByStartYear, setFilterByStartYear] = useState();
  // const [filterByEndYear, setFilterByEndYear] = useState();

  // const filteredItems = useMemo(() => {
  //   const features = items.features.filter(item =>
  //     (!filterByStartYear || item.properties.year >= filterByStartYear) &&
  //     (!filterByEndYear || item.properties.year <= filterByEndYear));
  //   return { ...items, features };
  // }, [items, filterByStartYear, filterByEndYear]);

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

  // useEffect(() => {
  //   if (DEBUG) {
  //     const generatedGeoJSON = generateGeoJSON(originalSource.items);
  //     setItems(generatedGeoJSON);
  //   } else {
  //     fetch(URL_GEOJSON)
  //       .then((response) => response.json())
  //       .then((geoJson) => {
  //         console.log('ONCE useEffect() geoJson', geoJson);
  //         setItems(geoJson);
  //       });
  //   }
  // }, []);

  // const handleMapItemClick = (item) => {
  //   setItem(item);
  // }

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
    <div>
      <DraggableSlider initialHeight={400} minHeight={200} maxHeight={800} persistKey="panelHeight">
        {(height) => (
            <MapDynamic height={height} word={word} />
        )}
      </DraggableSlider>

      <div className="mt-8"></div>

      <TranslationTable onRowClick={handleTranslationRowClick}/>

      {/*<YearRangeSelector*/}
      {/*  dataSource={originalSource.items}*/}
      {/*  onValueChanged={handleYearRangeChange}*/}
      {/*/>*/}

      {/*{item && <ItemDetails item={item} onClose={handleItemDetailsClose} />}*/}
    </div>
  );
}

export default App;


// ---------------------------------------------------------------------------------

// TODO Move to another file
//
// Generic DraggableSlider Component
// Props:
// - children: the content to be displayed inside the sliding panel
// - initialHeight: the default panel height (default is 400px)
// - minHeight: the minimum allowed height (default is 200px)
// - maxHeight: the maximum allowed height (default is 800px)
// - persistKey: (optional) a localStorage key to save/retrieve the height
//
function DraggableSlider({
                           children,
                           initialHeight = 400,
                           minHeight = 200,
                           maxHeight = 800,
                           persistKey = null
                         }) {
  const containerRef = useRef(null);
  // Load saved height from localStorage on mount
  const [height, setHeight] = useState(() => {
    if (persistKey && localStorage.getItem(persistKey)) {
      return parseInt(localStorage.getItem(persistKey), 10);
    }
    return initialHeight;
  });
  const [isDragging, setIsDragging] = useState(false);

  // Persist height if a persistKey is provided and dragging has stopped
  useEffect(() => {
    if (!isDragging && persistKey) {
      localStorage.setItem(persistKey, height);
    }
  }, [height, isDragging, persistKey]);

  // Update the cursor when dragging
  useEffect(() => {
    document.body.style.cursor = isDragging ? 'grabbing' : 'default';
    return () => {
      document.body.style.cursor = 'default';
    };
  }, [isDragging]);

  const onMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (containerRef.current) {
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const newHeight = e.clientY - containerTop;
      const clampedHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);
      setHeight(clampedHeight);
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <div ref={containerRef}>
      {/* Content area whose height is controlled by dragging */}
      <div style={{ height: `${height}px`, overflow: 'auto', transition: isDragging ? 'none' : 'height 0.2s ease-out' }}>
        {typeof children === 'function' ? children(height) : children}
      </div>
      {/* Draggable slider handle */}
      <div
        onMouseDown={onMouseDown}
        className={`${isDragging ? "cursor-grabbing" : "cursor-row-resize"}
               relative h-2 bg-gray-400 rounded-b flex items-center justify-center hover:bg-gray-300`}
      >
        <div className="w-6 h-1 bg-gray-600 rounded"></div>
      </div>
    </div>
  );
}