import React, { useState, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import data from "../tdk-word-list-flat.json"; // JSON dosyanız

// Tüm olası kolon isimleri (JSON’daki anahtarlar)
const ALL_COLUMNS = ["tur", "aze", "bak", "kaz", "kir", "uzb", "tat", "tuk", "uig", "rus"];

// Satır bileşeni: Tıklama durumunda ilgili callback fonksiyonunu çağırır.
const Row = React.memo(({ index, style, data, visibleColumns }) => {
  // data: { items, onRowClick }
  const { items, onRowClick } = data;
  const row = items[index];

  return (
    <div
      style={{
        ...style,
        display: "flex",
        borderBottom: "1px solid #ccc",
        padding: "0 8px",
        alignItems: "center",
        cursor: "pointer", // Tıklanabilir olduğunu belirtir.
        width: 'calc(100% - 18px)'
      }}
      onClick={() => onRowClick && onRowClick(row)}
    >
      {visibleColumns.map((col) => (
        <div
          key={col}
          style={{
            flex: 1,
            padding: "0 4px",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {row[col]}
        </div>
      ))}
    </div>
  );
});

//
// VirtualizedWordTable Bileşeni
// onRowClick: Satır tıklaması gerçekleştiğinde çağrılacak callback fonksiyonudur.
//
const VirtualizedWordTable = ({ onRowClick }) => {
  // Filtreleme durumu
  const [filter, setFilter] = useState("");

  // Hangi kolonların gösterileceğini tutan durum (checkbox’lar için)
  const [visibleCols, setVisibleCols] = useState(
    ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: true }), {})
  );

  // Filtreleme: Arama terimine göre veriyi filtrele (veri kaynağı seviyesinde)
  const filteredData = useMemo(() => {
    if (!filter.trim()) return data;
    const lowerFilter = filter.toLowerCase();
    return data.filter((row) =>
      ALL_COLUMNS.some(
        (col) => row[col] && row[col].toLowerCase().includes(lowerFilter)
      )
    );
  }, [filter]);

  // Görünecek kolonları hesapla
  const visibleColumns = useMemo(
    () => ALL_COLUMNS.filter((col) => visibleCols[col]),
    [visibleCols]
  );

  // Checkbox değişiminde kolon durumunu güncelle
  const toggleColumn = (col) => {
    setVisibleCols((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  // react-window için gönderilecek veri: filtrelenmiş data ve onRowClick callback
  const listData = useMemo(() => ({ items: filteredData, onRowClick }), [filteredData, onRowClick]);

  return (
    <div style={{ padding: "16px", fontFamily: "sans-serif" }}>
      {/* Kontroller: Arama ve kolon seçim */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Arama..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "4px", width: "200px", marginRight: "16px" }}
        />
        {ALL_COLUMNS.map((col) => (
          <label key={col} style={{ marginRight: "8px", fontSize: "14px" }}>
            <input
              type="checkbox"
              checked={visibleCols[col]}
              onChange={() => toggleColumn(col)}
              style={{ marginRight: "4px" }}
            />
            {col.toUpperCase()}
          </label>
        ))}
      </div>

      {/* Tablo başlığı */}
      <div style={{ display: "flex", fontWeight: "bold", borderBottom: "1px solid #ccc", padding: "0 8px 8px 8px" }}>
        {visibleColumns.map((col) => (
          <div key={col} style={{ flex: 1, padding: "0 4px" }}>
            {col.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Liste ve toplam satır sayısı etiketi */}
      <div style={{ display: "flex", position: "relative" }}>
        <List
          height={250} // Liste yüksekliği
          itemCount={filteredData.length}
          itemSize={45} // Her satırın yüksekliği
          width="100%"
          itemData={listData} // { items: filteredData, onRowClick }
          overscanCount={5} // Overscan ayarı
        >
          {({ index, style, data }) => (
            <Row index={index} style={style} data={data} visibleColumns={visibleColumns} />
          )}
        </List>

        {/* Toplam satır sayısı etiketi */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: '-3.5rem',
            padding: "4px",
            // backgroundColor: "rgba(255,255,255,0.8)",
            // borderLeft: "1px solid #ccc",
            fontSize: "12px"
          }}
        >
          Toplam Satır: {filteredData.length}
        </div>
      </div>
    </div>
  );
};

export default VirtualizedWordTable;
