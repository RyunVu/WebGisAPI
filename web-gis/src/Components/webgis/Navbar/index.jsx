import styles from './Navbar.module.scss';
import React, { useState, useEffect, useRef } from 'react';
import { getCommunes } from '../../../Services/communes';
import { getPlants } from '../../../Services/plants';

export default function Navbar({ setCommuneId, setPlantId, setYear, setMonth }) {
    const [communes, setCommunes] = useState([]);
    const [plants, setPlants] = useState([]);
    const [selectedCommune, setSelectedCommune] = useState('');
    const [selectedPlant, setSelectedPlant] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // Component's refs
    const communeRef = useRef();
    const plantRef = useRef();
    const yearRef = useRef();
    const monthRef = useRef();

    // Component's event handlers
    const handleFilter = (e) => {
        e.preventDefault();
        setCommuneId(communeRef.current.value);
        setPlantId(plantRef.current.value);
        setYear(yearRef.current.value);
        setMonth(monthRef.current.value);
    };

    const handleClearFilter = () => {
        setSelectedCommune('');
        setSelectedPlant('');
        setSelectedDate('');
        setCommuneId('');
        setPlantId('');
        setYear('');
        setMonth('');
    };

    // Fetch communes and plants when the component mounts
    useEffect(() => {
        async function fetchData() {
            const communesData = await getCommunes();
            if (communesData && Array.isArray(communesData.items)) {
                setCommunes(communesData.items);
            } else {
                console.error('Communes data is not in the expected format:', communesData);
            }

            const plantsData = await getPlants();
            if (plantsData && Array.isArray(plantsData.items)) {
                setPlants(plantsData.items);
            } else {
                console.error('Plants data is not in the expected format:', plantsData);
            }
        }

        fetchData();
    }, []);

    const executeQuery = () => {
        // Define your execute query logic here
    };

    return (
        <div className={styles.navbar}>
            <div className={styles.selectContainer}>
                {/* Commune selection */}
                <select
                    className={styles.select}
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}>
                    <option value="">-- Chọn Xã --</option>
                    {Array.isArray(communes) &&
                        communes.map((commune) => (
                            <option key={commune.id} value={commune.id}>
                                {commune.name}
                            </option>
                        ))}
                </select>
            </div>

            <div className={styles.selectContainer}>
                {/* Category selection */}
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

            <div className={styles.datePicker}>
                {/* Date selection */}
                <input
                    className={styles.dateInput}
                    type="month"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </div>

            {/* Button to execute query */}
            <button className={styles.executeButton} onClick={handleFilter}>
                Xử lý
            </button>

            <button className={styles.executeButton} onClick={handleClearFilter}>
                Bỏ lọc
            </button>
        </div>
    );
}
