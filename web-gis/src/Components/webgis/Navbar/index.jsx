import styles from './Navbar.module.scss';
import React, { useState, useEffect } from 'react';
import { getPlants } from '../../../Services/plants';
import { getPlantOutputsWithPlantIdAndDate } from '../../../Services/plantoutputs';

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function Navbar({ setPlantId, setYear, setMonth }) {
    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    // Component's event handlers
    const handleFilter = (e) => {
        e.preventDefault();
        setPlantId(selectedPlant);
        setYear(selectedYear);
        setMonth(selectedMonth);

        fetchPlantOutputsWithPlantIdAndDate();
    };

    const handleClearFilter = () => {
        setSelectedPlant('');
        setSelectedYear('');
        setSelectedMonth('');
    };

    const fetchPlantOutputsWithPlantIdAndDate = async () => {
        const plantOutputs = await getPlantOutputsWithPlantIdAndDate(selectedPlant, selectedYear);
        console.log('Plant outputs:', plantOutputs);
    };

    // Fetch communes and plants when the component mounts
    useEffect(() => {
        async function fetchData() {
            const plantsData = await getPlants();
            if (plantsData && Array.isArray(plantsData.items)) {
                setPlants(plantsData.items);
            } else {
                console.error('Plants data is not in the expected format:', plantsData);
            }
        }

        fetchData();
    }, []);

    return (
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
    );
}
