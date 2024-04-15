import styles from './MapView.module.scss';
import React, { useEffect } from 'react';
import { Feature, Map, View } from 'ol';
import { Select } from 'ol/interaction';
import { fromLonLat } from 'ol/proj';
import { MousePosition } from 'ol/control';
import { Style, Stroke, Fill, Text } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { WKT } from 'ol/format';
// import LayerSwitcher from 'ol-layerswitcher';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { createStringXY } from 'ol/coordinate';
import { getCommunes } from '../../../Services/communes';

export default function MapView() {
    useEffect(() => {
        const map = new Map({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([108.551013, 12.130874]),
                zoom: 6,
            }),
            controls: [],
        });

        const LacDuongVectorSource = new VectorSource();

        getCommunes()
            .then((data) => {
                if (data && Array.isArray(data.items)) {
                    const features = data.items
                        .filter((item) => item.geometry)
                        .map((item) => {
                            const textStyle = new Text({
                                text: item.name,
                                font: '12px Calibri,sans-serif',
                                fill: new Fill({ color: '#000' }),
                                stroke: new Stroke({ color: '#fff', width: 2 }),
                                offsetY: -15,
                            });

                            const strokeStyle = new Stroke({
                                color: 'blue',
                                width: 1,
                            });

                            const fillStyle = new Fill({
                                color: 'rgba(0, 0, 255, 0.1)',
                            });

                            const hoverFillStyle = new Fill({
                                color: 'rgba(0, 0, 255, 0.3)',
                            });

                            const hoverInteraction = new Select({
                                condition: (e) => e.type === 'pointermove',
                                style: new Style({
                                    stroke: strokeStyle,
                                    fill: hoverFillStyle,
                                    text: textStyle,
                                }),
                            });

                            hoverInteraction.on('select', function (e) {
                                if (e.selected.length > 0) {
                                    var selectedFeature = e.selected[0];
                                    var selectedName = selectedFeature.get('name');
                                    var selectedTextStyle = new Text({
                                        text: selectedName,
                                        font: '12px Calibri,sans-serif',
                                        fill: new Fill({ color: '#000' }),
                                        stroke: new Stroke({ color: '#fff', width: 2 }),
                                        offsetY: -15,
                                    });
                                    selectedFeature.setStyle(
                                        new Style({
                                            stroke: strokeStyle,
                                            fill: hoverFillStyle,
                                            text: selectedTextStyle,
                                        }),
                                    );
                                }
                            });

                            hoverInteraction.on('deselect', function (e) {
                                if (e.deselected.length > 0) {
                                    var deselectedFeature = e.deselected[0];
                                    deselectedFeature.setStyle(
                                        new Style({
                                            stroke: strokeStyle,
                                            fill: fillStyle,
                                            text: textStyle,
                                        }),
                                    );
                                }
                            });

                            map.addInteraction(hoverInteraction);

                            const feature = new Feature({
                                geometry: new WKT().readGeometry(item.geometry, {
                                    dataProjection: 'EPSG:4326',
                                    featureProjection: 'EPSG:3857',
                                }),
                                name: item.name,
                                description: item.description,
                            });

                            feature.setStyle(
                                new Style({
                                    stroke: strokeStyle,
                                    fill: fillStyle,
                                    text: textStyle,
                                }),
                            );

                            return feature;
                        });

                    LacDuongVectorSource.addFeatures(features);

                    const vectorLayer = new VectorLayer({
                        source: LacDuongVectorSource,
                        title: 'Lac Duong Data',
                    });

                    map.addLayer(vectorLayer);

                    map.getView().fit(LacDuongVectorSource.getExtent());
                } else {
                    console.error('Error: Unexpected data structure');
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

        if (MousePosition) {
            const mousePosition = new MousePosition({
                coordinateFormat: createStringXY(6),
                projection: 'EPSG:4326',
                className: styles.mousePosition,
                target: document.getElementById(styles.popupContent),
                undefinedHTML: '&nbsp;',
            });
            map.addControl(mousePosition);
        }

        // const layerSwitcher = new LayerSwitcher();
        // map.addControl(layerSwitcher);

        return () => {
            map.getLayers().clear();
            map.getInteractions().clear();
            map.getControls().clear();
            // map.removeInteraction(hoverInteraction);
            map.setTarget(null);
        };
    }, []);

    return (
        <>
            <div id="map" style={{ width: '100vw', height: '95vh', position: 'absolute' }}></div>

            {/* <div className={styles.map}>
                    <div id="map" style={{ width: '100%', height: '100%' }}></div>
                    <div id={styles.popup} className={styles.olPopup}>
                        <button type="button" id={styles.popupCloser} className={styles.olPopupCloser}></button>
                        <div id={styles.popupContent}></div>
                    </div>
                </div> */}
        </>
    );
}
