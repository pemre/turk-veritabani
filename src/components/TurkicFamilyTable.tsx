import {useTranslations} from "next-intl";
import {DataGrid} from "react-data-grid";
import React from "react";

const TurkicFamilyTable = () => {
    const columnsForTurkicFamilyTable = [
        {
            name: 'Oghuz', // TR: Oğuz
            children: [
                // { key: 'Salar', name: 'Salar' }, // TR: Salarca
                {
                    name: 'West Oghuz',
                    children: [
                        { key: 'tur', name: 'Turkce' },
                        { key: 'aze', name: 'Azerb' }
                    ]
                },
                { name: 'East Oghuz',
                    children: [
                        { key: 'tuk', name: 'Turkmence' },
                    ]
                },
                // { key: 'South Oghuz', name: 'West Oghuz' },
            ]
        },
        {
            name: 'Kipchak', // TR: Kıpçak
            children: [
                {
                    name: 'Kipchak–Bulgar', // TR: Kıpçak–Bulgar
                    children: [
                        { key: 'bak', name: 'Baskirca' },
                        { key: 'tat', name: 'Tataristan' },
                    ]
                },
                // { name: 'Kipchak–Cuman' }, // TR: Kıpçak–Kuman
                {
                    name: 'Kipchak–Nogai', // TR: Kıpçak–Nogay
                    children: [
                        { key: 'kaz', name: 'Kazakca' },
                    ]
                },
                {
                    name: 'Kipchak–Kyrgyz', // TR: Kıpçak–Kırgız
                    children: [
                        { key: 'kir', name: 'Kırgızca' },
                    ]
                }
            ]
        },
        {
            name: 'Karluk', // TR: Karluk
            children: [
                {
                    name: 'West Karluk', // TR: Batı Karluk
                    children: [
                        { key: 'uzb', name: 'Ozbekce' },
                    ]
                },
                {
                    name: 'East Karluk', // TR: Doğu Karluk
                    children: [
                        { key: 'uig', name: 'Uygurca' },
                    ]
                },
            ]
        }
    ];
    const t = useTranslations("languages");

    const columns = columnsForTurkicFamilyTable.map((column) => ({
        ...column,
        headerCellClass: "bg-green-950",
        children: column.children.map((child) => ({
            ...child,
            headerCellClass: "bg-green-900",
            children: child.children.map((leaf) => ({
                ...leaf,
                name: t(leaf.key), // Dillerin adlarını t() fonksiyonu ile çeviriyoruz
                headerCellClass: "bg-gray-900",
            })),
        })),
    }));

    return (
        <div className="h-[105px] rounded overflow-hidden border border-gray-800">
            <DataGrid
                columns={columns}
                rows={[]}
                className="bg-transparent"
            />
        </div>
    );
};
