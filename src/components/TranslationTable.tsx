import React, {useState, useMemo, useCallback, createContext, useContext} from "react";
import { VariableSizeList as List } from "react-window";
import data from "@/data/tdk-word-list-flat.json";
import { useTranslations } from "next-intl";

import 'react-data-grid/lib/styles.css';
import {Column, ColumnOrColumnGroup, DataGrid, RenderHeaderCellProps, SortColumn} from 'react-data-grid';
import {useDirection} from "@/contexts/direction-context";
import {className} from "postcss-selector-parser";
import DraggableSlider from "@/components/DraggableSlider";

type Language = 'aze'|'bak'|'eng'|'kaz'|'kir'|'rus'|'tat'|'tuk'|'tur'|'uig'|'uzb'

interface Row {
  // readonly id: number;
  readonly aze: string;
  readonly bak: string;
  readonly eng: string;
  readonly kaz: string;
  readonly kir: string;
  readonly rus: string;
  readonly tat: string;
  readonly tuk: string;
  readonly tur: string;
  readonly uig: string;
  readonly uzb: string;
}

interface Filter extends Omit<Row, 'id' | 'complete'> {
  complete: number | undefined;
  enabled: boolean;
  languages: {
    aze: string;
    bak: string;
    eng: string;
    kaz: string;
    kir: string;
    rus: string;
    tat: string;
    tuk: string;
    tur: string;
    uig: string;
    uzb: string;
  }
}

// TODO Get from a common config
// TODO Sort differently per country
const languages: Language[] = [
  "tur",
  "aze",
  "bak",
  "kaz",
  "kir",
  "uzb",
  "tat",
  "tuk",
  "uig",
  "rus",
  "eng",
];

// Context is needed to read filter values otherwise columns are
// re-created when filters are changed and filter loses focus
const FilterContext = createContext<Filter | undefined>(undefined);

function inputStopPropagation(event: React.KeyboardEvent<HTMLInputElement>) {
  if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
    event.stopPropagation();
  }
}

function selectStopPropagation(event: React.KeyboardEvent<HTMLSelectElement>) {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
    event.stopPropagation();
  }
}

const rows = data;

const VirtualizedWordTable = ({ onRowClick }) => {
  const t = useTranslations("languages");

  const [filters, setFilters] = useState(
      (): Filter => ({
        complete: undefined,
        enabled: true,
        languages: {
          aze: '',
          bak: '',
          eng: '',
          kaz: '',
          kir: '',
          rus: '',
          tat: '',
          tuk: '',
          tur: '',
          uig: '',
          uzb: ''
        }
      })
  );

  const [filter, setFilter] = useState("");
  const [visibleCols, setVisibleCols] = useState(
      languages.reduce((acc, col) => ({ ...acc, [col]: true }), {})
  );

  const filteredData = useMemo(() => {
    if (!filter.trim()) return data;
    const lowerFilter = filter.toLowerCase();
    return data.filter((row) =>
        languages.some(
            (col) => row[col] && row[col].toLowerCase().includes(lowerFilter)
        )
    );
  }, [filter]);

  const visibleColumns = useMemo(
      () => languages.filter((col) => visibleCols[col]),
      [visibleCols]
  );

  console.log('coli coli', visibleColumns);

  const toggleColumn = (col) => {
    setVisibleCols((prev) => ({ ...prev, [col]: !prev[col] }));
  };


  const columns: Column<Row>[] = [];

  for (let i = 0; i < languages.length; i++) {
    const key = languages[i];

    if (!visibleColumns.includes(key)) return;

    columns.push({
      key: key,
      // name: t(key),
      name: t(key),
      headerCellClass: "bg-gray-900",
      // frozen: i < 5,
      draggable: true,
      // editable: true,
      resizable: true,
      sortable: true,
      // renderCell: renderCoordinates,
      renderHeaderCell: (p) => (
          <FilterRenderer<Row> {...p}>
            {({ filters, ...rest }) => (
                <>
                  <label htmlFor="default-search"
                         className="text-sm font-normal text-gray-900 sr-only dark:text-white">Search</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                           xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                      </svg>
                    </div>
                    <input type="search"
                           className="block w-full p-1 ps-7 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Search..."
                           {...rest}
                        // className={filterClassname}
                           value={filters[key]}
                           onChange={(e) =>
                               setFilters({
                                 ...filters,
                                 [key]: e.target.value
                               })
                           }
                           onKeyDown={inputStopPropagation}
                    />
                  </div>

                </>


            )
            }
          </FilterRenderer>
      )
    })
    ;
  }

  const direction = useDirection();
  const [columnsOrder, setColumnsOrder] = useState((): readonly number[] =>
      columns.map((_, index) => index)
  );
  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([]);
  const onSortColumnsChange = useCallback((sortColumns: SortColumn[]) => {
    setSortColumns(sortColumns.slice(-1));
  }, []);

  const reorderedColumns = useMemo(() => {
    return columnsOrder.map((index) => columns[index]);
  }, [columnsOrder]);

  const sortedRows = useMemo((): readonly Row[] => {
    if (sortColumns.length === 0) return rows;
    const {columnKey, direction} = sortColumns[0];

    let sortedRows: Row[] = [...rows];
    // sortedRows = sortedRows.sort((a, b) => a[columnKey] - b[columnKey]);
    // TODO localeCompare() uses TR local, may be expanded to other langs
    sortedRows = sortedRows.sort((a, b) => a[columnKey]?.localeCompare(b[columnKey], 'tr'));
    return direction === 'DESC' ? sortedRows.reverse() : sortedRows;
  }, [rows, sortColumns]);

  function onColumnsReorder(sourceKey: string, targetKey: string) {
    setColumnsOrder((columnsOrder) => {
      const sourceColumnOrderIndex = columnsOrder.findIndex(
          (index) => columns[index].key === sourceKey
      );
      const targetColumnOrderIndex = columnsOrder.findIndex(
          (index) => columns[index].key === targetKey
      );
      const sourceColumnOrder = columnsOrder[sourceColumnOrderIndex];
      const newColumnsOrder = columnsOrder.toSpliced(sourceColumnOrderIndex, 1);
      newColumnsOrder.splice(targetColumnOrderIndex, 0, sourceColumnOrder);
      return newColumnsOrder;
    });
  }

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      return (
          (filters.tur ? r.tur.includes(filters.tur) : true) &&
          (filters.aze ? r.aze.includes(filters.aze) : true) // &&
      );
    });
  }, [rows, filters]);

  function toggleFilters() {
    setFilters((filters) => ({
      ...filters,
      enabled: !filters.enabled
    }));
  }

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
                languages={languages}
                visibleCols={visibleCols}
                toggleColumn={toggleColumn}
            />
            <div className="">
              <button type="button" onClick={toggleFilters}>
                Toggle Filters
              </button>{' '}
              <button type="button">
                Clear Filters
              </button>
            </div>

          </div>
          {/* Row Count Display */}
          <div className="text-xs text-gray-600 dark:text-gray-400">
            🈯 Toplam kavram: {filteredData.length}
          </div>
        </div>

        {/*<TurkicFamilyTable />*/}

        <DraggableSlider initialHeight={400} minHeight={200} maxHeight={800} persistKey="height-translation-table">
          {(height: unknown) => (
              // <div className="h-[605px] rounded overflow-hidden border border-gray-800">
              <FilterContext value={filters}>
                <DataGrid
                    columns={reorderedColumns}
                    // rows={sortedRows}
                    sortColumns={sortColumns}
                    onSortColumnsChange={onSortColumnsChange}
                    direction={direction}
                    // defaultColumnOptions={{ width: '1fr' }}
                    onColumnsReorder={onColumnsReorder}
                    defaultColumnOptions={{
                      draggable: true,
                      resizable: true,
                      sortable: true,
                      // editable: true,
                      // renderCell: renderCoordinates
                    }}
                    style={{ height: height }}
                    className="rounded-t border border-gray-800"


                    // className={filters.enabled ? filterContainerClassname : undefined}
                    rows={filteredRows}
                    headerRowHeight={filters.enabled ? 70 : undefined}
                    // direction={direction}
                />
              </FilterContext>
              // </div>
          )}
        </DraggableSlider>



      </div>
  );
};

export default VirtualizedWordTable;




// @ts-ignore
const LanguageDropdown = ({ languages, visibleCols, toggleColumn } : { toggleColumn: func }) => {
  const t = useTranslations("languages");
  const [dropdownOpen, setDropdownOpen] = useState(true);

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
                {languages.map((col) => {
                  // const { flag } = languageMap[col];
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
                            {/*<span className="mr-1">{flag}</span>*/}
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



function FilterRenderer<R>({
                             tabIndex,
                             column,
                             children
                           }: RenderHeaderCellProps<R> & {
  children: (args: { tabIndex: number; filters: Filter }) => React.ReactElement;
}) {
  const filters = useContext(FilterContext)!;
  return (
      <>
        <div>{column.name}</div>
        {filters.enabled && <div className="mt-1">{children({ tabIndex, filters })}</div>}
      </>
  );
}

