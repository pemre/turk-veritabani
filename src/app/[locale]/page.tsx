"use client";

import './App.css'; // TODO delete
import { useState } from 'react';
// import { generateGeoJSON } from '@/helpers/generate-geojson';
// import { ItemDetails } from './components/ItemDetails'
// import { YearRangeSelector } from './components/YearRangeSelector';
// import originalSource from './items.json';
import TranslationTable from "@/components/TranslationTable";
import { MapDynamic } from "@/components/MapDynamic";
import DraggableSlider from "@/components/DraggableSlider";

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


// import { useTranslations } from 'next-intl';
import Header from "@/components/Header";

export default function Home() {
  // const t = useTranslations('navigation');

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

    // TODO Better typing
    const handleTranslationRowClick = (thing: unknown) => {
        // @ts-expect-error TODO Improve pseudo code
        setWord(thing);
        console.log('thing  ', thing);
    }

  return (
    <main className="p-8">
        <Header />
      {/* Rest of your content */}

        <div>
            <DraggableSlider initialHeight={400} minHeight={200} maxHeight={800} persistKey="panelHeight">
                {(height: unknown) => (
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
    </main>
  );
}
