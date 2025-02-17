import dynamic from "next/dynamic";
import {useMemo} from "react";

export const MapDynamic = ({ height, word }) => {
  const Map = useMemo(() => dynamic(
    () => import('@/components/Map'),
    {
      loading: () => (
        <div className="flex items-center justify-center rounded-t border border-gray-400/50"
             style={{height: `${height}px`}}
        >
          Harita yükleniyor...
        </div>
      ),
      ssr: false
    }
  ), [height]);

  return (
    <Map
      center={[55, 45]}
      zoom={4}
      // items={filteredItems}
      // onItemClick={handleMapItemClick}
      word={word}
      height={height}
    />
  );
};
