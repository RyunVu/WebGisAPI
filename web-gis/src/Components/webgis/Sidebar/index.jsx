import React from 'react';
import styles from './Sidebar.module.scss';

export default function Sidebar({ commune, plantOutputs, isVisible }) {
    const sidebarClasses = isVisible ? `${styles.sidebar} ${styles.visible}` : styles.sidebar;

    function formatTime(timeString) {
        const date = new Date(timeString);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `Tháng ${month < 10 ? '0' + month : month} - Năm ${year}`;
    }

    function sortPlantOutputs(outputs) {
        // Group plant outputs by time
        const groupedOutputs = outputs.reduce((acc, output) => {
            const key = formatTime(output.time);
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(output);
            return acc;
        }, {});

        // Sort grouped outputs by time
        const sortedGroups = Object.keys(groupedOutputs).sort((a, b) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            return dateA - dateB;
        });

        // Ensure months are sorted from January to December
        sortedGroups.sort((a, b) => {
            const [monthA, yearA] = a.split(' - Năm ');
            const [monthB, yearB] = b.split(' - Năm ');
            if (yearA !== yearB) {
                return parseInt(yearA) - parseInt(yearB);
            } else {
                return parseInt(monthA.split(' ')[1]) - parseInt(monthB.split(' ')[1]);
            }
        });

        // Sort each group by plant name
        sortedGroups.forEach((group) => {
            groupedOutputs[group].sort((a, b) => {
                // Sort by plant name
                const plantNameA = a.plant.name.toLowerCase();
                const plantNameB = b.plant.name.toLowerCase();
                if (plantNameA < plantNameB) {
                    return -1;
                }
                if (plantNameA > plantNameB) {
                    return 1;
                }
                return 0;
            });
        });

        return { groupedOutputs, sortedGroups };
    }

    return (
        <div className={sidebarClasses}>
            {commune ? (
                <>
                    <h2>{commune.name}</h2>
                    <p>{commune.description}</p>
                    <h3>Kết quả trồng trọt:</h3>
                    {plantOutputs && plantOutputs.items && plantOutputs.items.length > 0 ? (
                        <>
                            {sortPlantOutputs(plantOutputs.items).sortedGroups.map((group, index) => (
                                <div key={index} style={{ width: '100%' }}>
                                    <h4>{group}</h4>
                                    <ul>
                                        {sortPlantOutputs(plantOutputs.items).groupedOutputs[group].map(
                                            (output, idx) => (
                                                <li key={idx}>
                                                    <strong>{output.plant.name}</strong>: {output.quantity}{' '}
                                                    {output.unit}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>Không có kết quả trồng trọt nào cho xã này.</p>
                    )}
                </>
            ) : (
                <p>Hãy chọn một xã trên bản đồ để xem chi tiết.</p>
            )}
        </div>
    );
}
