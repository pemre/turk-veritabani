import React, { useState, useMemo, useCallback } from "react";
import { VariableSizeList as List } from "react-window";
import data from "@/data/tdk-word-list-flat.json";
import { useTranslations } from "next-intl";

// TODO Get from a common config
// Tüm olası kolon isimleri (JSON’daki anahtarlar)
const ALL_COLUMNS = [
  "tur",
  "aze",
  "bak",
  "kaz",
  "kir",
  "uzb",
  "tat",
  "tuk",
  "uig",
  "rus"
];

// TODO Get from a common config
const languageMap = {
  tur: { abbr: "Tür", full: "Türkiye Türkçesi", flag: "🇹🇷" },
  aze: { abbr: "Aze", full: "Azerbaycan Türkçesi", flag: "🇦🇿" },
  bak: { abbr: "Bak", full: "Başkurt Türkçesi", flag: "🇷🇺" },
  kaz: { abbr: "Kaz", full: "Kazak Türkçesi", flag: "🇰🇿" },
  kir: { abbr: "Kir", full: "Kırgız Türkçesi", flag: "🇰🇬" },
  uzb: { abbr: "Uzb", full: "Özbek Türkçesi", flag: "🇺🇿" },
  tat: { abbr: "Tat", full: "Tatar Türkçesi", flag: "🇷🇺" },
  tuk: { abbr: "Tuk", full: "Türkmen Türkçesi", flag: "🇹🇲" },
  uig: { abbr: "Uig", full: "Uygur Türkçesi", flag: "🇨🇳" },
  rus: { abbr: "Rus", full: "Rusça", flag: "🇷🇺" },
};

const Row = React.memo(({ index, style, data, visibleColumns }) => {
  const { items, onRowClick } = data;
  const row = items[index];

  return (
    <div
      className="flex items-center border-b border-gray-700 px-2 cursor-pointer hover:bg-gray-700"
      style={style}
      onClick={() => onRowClick && onRowClick(row)}
    >
      {visibleColumns.map((col) => (
        <div
          key={col}
          style={{
            flex: 1,
            // padding: "0 4px",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
          className="flex-1 overflow-hidden overflow-ellipsis"
        >
          {row[col]}
        </div>
      ))}
    </div>
  );
});

Row.displayName = "Row";

const VirtualizedWordTable = ({ onRowClick }) => {
  const t = useTranslations("languages");
  const [filter, setFilter] = useState("");
  const [visibleCols, setVisibleCols] = useState(
    ALL_COLUMNS.reduce((acc, col) => ({ ...acc, [col]: true }), {})
  );

  const filteredData = useMemo(() => {
    if (!filter.trim()) return data;
    const lowerFilter = filter.toLowerCase();
    return data.filter((row) =>
      ALL_COLUMNS.some(
        (col) => row[col] && row[col].toLowerCase().includes(lowerFilter)
      )
    );
  }, [filter]);

  const visibleColumns = useMemo(
    () => ALL_COLUMNS.filter((col) => visibleCols[col]),
    [visibleCols]
  );

  const toggleColumn = (col) => {
    setVisibleCols((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const listData = useMemo(() => ({ items: filteredData, onRowClick }), [filteredData, onRowClick]);

  // Define a function to calculate row height dynamically.
  // This example uses the maximum string length among visible columns to decide extra height.
  const getItemSize = useCallback(
    (index) => {
      const row = filteredData[index];
      // Base height for a row.
      let baseHeight = 30;
      // Determine the longest content among the visible columns.
      const maxLength = Math.max(
        ...visibleColumns.map((col) => (row[col] ? row[col].length : 0))
      );
      // For example, add 20px for each 20 characters (adjust as needed).
      const extraHeight = Math.floor(maxLength / 10) * 14;
      return baseHeight + extraHeight + 5;
    },
    [filteredData, visibleColumns]
  );

  return (
    <div>
      {/* Controls: Search and column selection */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        {/* Search and Column Selection */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="🈯 Arama..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded focus:outline-none focus:ring focus:border-blue-300"
          />
          <LanguageDropdown
            ALL_COLUMNS={ALL_COLUMNS}
            languageMap={languageMap}
            visibleCols={visibleCols}
            toggleColumn={toggleColumn}
          />
        </div>
        {/* Row Count Display */}
        <div className="text-xs text-gray-600 dark:text-gray-400">
          🈯 Toplam kavram: {filteredData.length}
        </div>
      </div>


      {/* Table header */}
      <div className="flex pr-[24px] mb-2">
        {visibleColumns.map((col) => {
          const { abbr, flag } = languageMap[col];

          return (
            <label
              key={col}
              className="flex-1 items-center cursor-pointer relative group"
            >

              <span className="ml-1 flex items-center">
                    <span className="mr-1">{flag}</span>
                    <span>{abbr}</span>
                  </span>
              {/* Tooltip on hover */}
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {t(col)}
                  </span>
            </label>
          );
        })}
      </div>

      {/* Virtualized List */}
      <div style={{ display: "flex", position: "relative" }} className="border border-gray-700">
        <List
          height={250}
          itemCount={filteredData.length}
          itemSize={getItemSize}  // Use dynamic row height
          width="100%"
          itemData={listData}
          overscanCount={5}
        >
          {({ index, style, data }) => (
            <Row index={index} style={style} data={data} visibleColumns={visibleColumns} />
          )}
        </List>
      </div>
    </div>
  );
};

export default VirtualizedWordTable;




const LanguageDropdown = ({ ALL_COLUMNS, languageMap, visibleCols, toggleColumn }) => {
  const t = useTranslations("languages");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownFilter] = useState('');

  // Filter the languages based on the dropdown search input (matching abbreviation or full name)
  const filteredColumns = ALL_COLUMNS.filter((col) => {
    const { abbr, full } = languageMap[col];
    const search = dropdownFilter.toLowerCase();
    return abbr.toLowerCase().includes(search) || full.toLowerCase().includes(search);
  });

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        type="button"
        className="inline-flex items-center px-2 py-1 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        🛠️
        <svg
          className="w-2.5 h-2.5 ms-2.5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="z-10 absolute mt-2 bg-white rounded-lg shadow-sm w-60 dark:bg-gray-700">
          <ul
            className="h-48 px-3 p-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownSearchButton"
          >
            {filteredColumns.map((col) => {
              const { flag } = languageMap[col];
              return (
                <li key={col}>
                  <div className="flex items-center p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      id={`checkbox-${col}`}
                      type="checkbox"
                      checked={visibleCols[col]}
                      onChange={() => toggleColumn(col)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label
                      htmlFor={`checkbox-${col}`}
                      className="w-full ms-2 text-sm font-medium text-gray-900 rounded-sm dark:text-gray-300"
                    >
                      <span className="mr-1">{flag}</span>
                      {t(col)}
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
