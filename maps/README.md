# Turkic languages maps

This directory contains maps of Turkic languages and countries where they are spoken.

* [🇦🇿 Azerbaijan](./original-polygons/azerbaijan-full.geojson)
* [Bashkortostan](./original-polygons/bashkortostan-full.geojson) republic in Russia
* [East Turkistan (Xinjiang)](./original-polygons/east-turkistan-full.geojson) region in China
* [🇰🇿 Kazakhstan](./original-polygons/kazakhstan-full.geojson)
* [Khakassia](./original-polygons/khakassia-full.geojson) republic in Russia
* [🇰🇬 Kyrgyzstan](./original-polygons/kyrgyzstan-full.geojson)
* [Tatarstan](./original-polygons/tatarstan-full.geojson) republic in Russia
* [🇹🇷 Türkiye](./original-polygons/turkiye-full.geojson)
* [🇹🇲 Turkmenistan](./original-polygons/turkmenistan-full.geojson)
* [🇺🇿 Uzbekistan](./original-polygons/uzbekistan-full.geojson)


# Getting country polygon boundaries in JSON format

To get the boundaries of a country as a polygon in JSON format for use with Leaflet, you can use OpenStreetMap.

Follow these steps:

1. Go to [OpenStreetMap](http://nominatim.openstreetmap.org/).
2. Search for a country/region, like "Uzbekistan".
3. Click on the "Details" button.
4. Find the OSM ID and copy it: For example: 2018776.
5. Paste the ID here: [Polygons OpenStreetMap](http://polygons.openstreetmap.fr/index.py).
6. Download the polygon data. You can get it in different formats like GeoJSON, WKT, poly or image.

That's it! Now you have the polygon boundaries in a format you can use.

For more information, check out this [source](https://gis.stackexchange.com/questions/183248/getting-polygon-boundaries-of-city-in-json-from-google-maps-api) or the [archive.org](https://web.archive.org/web/20240720060717/https://gis.stackexchange.com/questions/183248/getting-polygon-boundaries-of-city-in-json-from-google-maps-api) copy.

# Generating a simplified polygon

To generate and download a simplified polygon, you can use the [Polygons OpenStreetMap](http://polygons.openstreetmap.fr/index.py) page (the one we used to get the polygon), which lets you adjust the size and shape of the polygon using three settings: X, Y, and Z. By changing X, you can make the polygon bigger, smaller, or keep it the same size as the original. Y and Z control the level of detail, helping to simplify the shape without losing its general form. The SQL commands on the page help create a polygon with fewer points or nodes while keeping the overall structure intact.

# Swapping latitude and longitude values

OpenStreetMap (OSM) and many other mapping libraries (such as Leaflet and OpenLayers) expect coordinates in the format (latitude, longitude), but the polygons we exported are written as (longitude, latitude).

We need to swap the values in each pair. You can use a simple ChatGPT prompt to do this automatically.
