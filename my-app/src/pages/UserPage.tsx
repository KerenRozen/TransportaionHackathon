import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import { FeatureCollection } from "geojson";


mapboxgl.accessToken = 'pk.eyJ1Ijoia2VyZW5yb3plbiIsImEiOiJjbGlubTllZWQwMGVuM2VvY2s0aG5nYjJ2In0.e2PYx0rwRwVrMpWhnJ9XBA';

// interface UserPageProps {
//     paths: string,
//     roadblocks: string,
// }

// @ts-ignore
const UserPage = (props) => {
    let { lineNumber } = useParams();
    const [route, setRoute] = useState<{distance: any, time: any, points: any} | null>(null);

    const strPointToFloat = (point: string): [number, number] => {
        const floatPoint = point.split(',').map((item) => {
            return parseFloat(item)
        })
        return [floatPoint[1], floatPoint[0]]
    }

    const strBlockToFloat = (block: string): [number, number, number, number] => {
        const floatBlock = block.split(',').map((item) => {
            return parseFloat(item)
        })
        return [floatBlock[1], floatBlock[0], floatBlock[3], floatBlock[2]]
    }

    // Start point coordinates
    const startPoint = props.paths.startPoint;

    // End point coordinates
    const endPoint = props.paths.endPoint;

    // Intermediate stop coordinates (optional)
    const stops = props.paths.stops;

    // Blocked routes or areas (optional)
    // const blockedRoutes: string[] = [
    //     "32.05636785529443, 34.77621936177339, 100",
    // ];
    const blockedRoutesPolygon = props.roadblocks.blocks.map((block: string) => {return strBlockToFloat(block)})
    const blockedRoutes = blockedRoutesPolygon.map((block: number[]) => {
        let strBlock = [block[1], block[2]].join(",");
        strBlock += ',100';
        return strBlock;
    })

    const findRoute = async () => {
        try {
            // GraphHopper API endpoint
            const apiEndpoint = "https://graphhopper.com/api/1/route";

            // GraphHopper API key
            const apiKey = "5d65dcce-ad4e-46ce-82ef-754314bbb20b";

            // Construct the request URL
            let url = `${apiEndpoint}?key=${apiKey}&point=${startPoint}&points_encoded=false`;

            // Add intermediate stops to the URL
            for (const stop of stops) {
                url += `&point=${stop}`;
            }

            if (blockedRoutes.length > 0){
            // Add blocked routes to the URL
                url += `&block_area=`
                for (const route of blockedRoutes) {
                    url += `${route}%3B`;
                }
            }

            // add end point
            url += `&point=${endPoint}&ch.disable=true`


            // Send the API request
            const response = await axios.get(url);

            // Extract the route details
            const data = response.data;
            if (data.paths && data.paths.length > 0) {
                const routeData = data.paths[0];
                const distance = routeData.distance;
                const time = routeData.time;
                const points = routeData.points.coordinates;

                // Set the route details in the state
                setRoute({ distance, time, points });

            } else {
                console.log("No route found.");
            }
        } catch (error) {
            console.error("Error finding route:", error);
        }
    };

    useEffect(() => {
        // Initialize the map
        const map = new mapboxgl.Map({
            container: 'map', // HTML element ID where the map will be rendered
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [34.779127335872374, 32.06290467364886], // Center of the map (longitude, latitude)
            zoom: 11, // Initial zoom level
        });

        // Add navigation controls to the map
        map.addControl(new mapboxgl.NavigationControl());

        // Draw the route on the map
        if (route) {
            // @ts-ignore
            const coordinates = route.points.map(([lng, lat]) => [lng, lat]);

            // Create a GeoJSON feature collection
            const geojson: FeatureCollection = {
                type: 'FeatureCollection',
                features: [
                    {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates,
                    },
                      properties: []
                    },
                ],
                };

            new mapboxgl.Marker().setLngLat(strPointToFloat(startPoint)).addTo(map)
            for (const stop of stops) {
                new mapboxgl.Marker().setLngLat(strPointToFloat(stop)).addTo(map)
            }
            new mapboxgl.Marker().setLngLat(strPointToFloat(endPoint)).addTo(map)

            // Add the route to the map
            map.on('load', () => {
                map.addSource('route', {
                  type: 'geojson',
                  data: geojson,
                });

                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    paint: {
                    'line-color': '#007bff',
                    'line-width': 4,
                    },
                });

                for (let i = 0; i < blockedRoutesPolygon.length; i++){
                    let block = blockedRoutesPolygon[i]
                    map.addSource(`blocks${i}`, {
                        type: 'geojson',
                        data: {
                            type: 'FeatureCollection',
                            features: [
                                {
                                    type: 'Feature',
                                    properties: {
                                        color: '#F7455D'
                                    },
                                    geometry: {
                                        type: 'LineString',
                                        coordinates: [
                                            block.slice(0,2),
                                            block.slice(2,4)
                                        ]
                                    }
                                }
                            ]
                        }
                    });

                    map.addLayer({
                        id: `blocks${i}`,
                        type: 'line',
                        source: `blocks${i}`,
                        paint: {
                        'line-color': '#F7455D',
                        'line-width': 4,
                        },
                    });

                }
          });

        }

        // Clean up the map on component unmount
        return () => map.remove();
  }, [route]);

    return (
        <>
            <div style={{display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',}}>
                <h1>Line Number: {lineNumber}</h1>
            </div>

            <div>
                <div style={{display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',}} >
                    <button onClick={findRoute}>Find Route</button>
                </div>
                {/*{route && (*/}
                {/*<div>*/}
                {/*    <p>Distance: {route.distance} meters</p>*/}
                {/*    <p>Time: {route.time} seconds</p>*/}
                {/*</div>*/}
                {/*)}*/}
            </div>
            <div id="map" style={{ width: '100%', height: '400px' }}></div>
        </>

  );
};

export default UserPage;

