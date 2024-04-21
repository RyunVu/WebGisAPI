import React, { useState, useEffect } from 'react';
import { getPlants } from '../../../Services/plants';
import { getPlantOutputsWithPlantIdAndDate } from '../../../Services/plantoutputs';
import Legend from '../Legend';

import { Feature } from 'ol';
import { WKT } from 'ol/format';
import VectorSource from 'ol/source/Vector';
import { Style, Fill } from 'ol/style';
import { Vector as VectorLayer } from 'ol/layer';

import styles from './Navbar.module.scss';

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function generateColors(size) {
    const colors = [];
    const initialHue = 0;
    const finalHue = 240;

    const hueStep = (finalHue - initialHue) / (size - 1);

    for (let i = 0; i < size; i++) {
        const hue = initialHue + i * hueStep;

        const color = `hsla(${hue}, 80%, 50%, 0.5)`;
        colors.push(color);
    }

    return colors;
}

export default function Navbar({ setPlantId, setYear, setMonth, map }) {
    const [plants, setPlants] = useState([]);
    const [plantOutputs, setPlantOutputs] = useState([]);

    const [selectedPlant, setSelectedPlant] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const [colorLayer, setColorLayer] = useState(null);
    const [showLegend, setShowLegend] = useState(false);
    const [colors, setColors] = useState([]);

    const handleFilter = async (e) => {
        e.preventDefault();
        setPlantId(selectedPlant);
        setYear(selectedYear);
        setMonth(selectedMonth);

        await fetchPlantOutputsWithPlantIdAndDate();
    };

    useEffect(() => {
        if (plantOutputs.length > 0) {
            updateColorLayer();
            setShowLegend(true);
        }
    }, [plantOutputs]);

    const handleClearFilter = () => {
        setSelectedPlant('');
        setSelectedYear('');
        setSelectedMonth('');
        setPlantOutputs([]);

        map.removeLayer(colorLayer);

        setColors(null);
        setColorLayer(null);
        setShowLegend(false);
    };

    const fetchPlantOutputsWithPlantIdAndDate = async () => {
        try {
            const plantOutputsData = await getPlantOutputsWithPlantIdAndDate(
                selectedPlant,
                selectedYear,
                selectedMonth,
            );
            setPlantOutputs(plantOutputsData.items);
        } catch (error) {
            console.error('Error fetching plant outputs:', error);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                const plantsData = await getPlants();
                if (plantsData && Array.isArray(plantsData.items)) {
                    setPlants(plantsData.items);
                } else {
                    console.error('Plants data is not in the expected format:', plantsData);
                }
            } catch (error) {
                console.error('Error fetching plants:', error);
            }
        }
        fetchData();
    }, []);

    const updateColorLayer = () => {
        if (!map || !plantOutputs || plantOutputs.length === 0) return;

        const newColors = generateColors(plantOutputs.length);
        setColors(newColors);

        const features = plantOutputs.map((item, index) => {
            const geometry = item.commune.geometry;
            const quantity = item.quantity;
            const fillColor = newColors[index];
            const feature = new Feature({
                geometry: new WKT().readGeometry(geometry, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857',
                }),
                quantity: quantity,
            });
            feature.setStyle(
                new Style({
                    fill: new Fill({
                        color: fillColor,
                    }),
                }),
            );
            return feature;
        });

        if (map && colorLayer) {
            colorLayer.setSource(
                new VectorSource({
                    features: features,
                }),
            );
        } else if (map) {
            const newColorLayer = new VectorLayer({
                source: new VectorSource({
                    features: features,
                }),
            });
            setColorLayer(newColorLayer);
            map.addLayer(newColorLayer);
        }
    };

    return (
        <>
            <div className={styles.navbar}>
                <div className={styles.selectContainer}>
                    {/* Plant selection */}
                    <select
                        className={styles.select}
                        value={selectedPlant}
                        onChange={(e) => setSelectedPlant(e.target.value)}>
                        <option value="">-- Chọn cây --</option>
                        {Array.isArray(plants) &&
                            plants.map((plant) => (
                                <option key={plant.id} value={plant.id}>
                                    {plant.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className={styles.inputContainer}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Nhập năm..."
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    />
                </div>
                <div className={styles.selectContainer}>
                    <select
                        className={styles.select}
                        title="Tháng"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}>
                        <option value="">-- Chọn tháng --</option>
                        {months.map((month) => (
                            <option key={month} value={month}>
                                Tháng {month}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Button to execute query */}
                <button className={styles.executeButton} onClick={handleFilter}>
                    Xử lý
                </button>
                <button className={styles.executeButton} onClick={handleClearFilter}>
                    Bỏ lọc
                </button>
            </div>
            <Legend colors={colors} />
        </>
    );
}
