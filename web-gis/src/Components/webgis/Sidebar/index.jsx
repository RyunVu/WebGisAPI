import React from 'react';
import styles from './Sidebar.module.scss';

export default function Sidebar({ commune, plantOutputs, isVisible }) {
    const sidebarClasses = isVisible ? `${styles.sidebar} ${styles.visible}` : styles.sidebar;

    function formatTime(timeString) {
        const date = new Date(timeString);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `Tháng ${month} - Năm ${year}`;
    }

    function sortPlantOutputs(outputs) {
        return outputs.sort((a, b) => {
            const dateA = new Date(a.time);
            const dateB = new Date(b.time);
            if (dateA.getFullYear() !== dateB.getFullYear()) {
                return dateA.getFullYear() - dateB.getFullYear();
            } else if (dateA.getMonth() !== dateB.getMonth()) {
                return dateA.getMonth() - dateB.getMonth();
            } else if (a.plant.name === b.plant.name) {
                return a.quantity - b.quantity;
            } else {
                return a.plant.name.localeCompare(b.plant.name);
            }
        });
    }

    return (
        <div className={sidebarClasses}>
            {commune ? (
                <>
                    <h2>{commune.name}</h2>
                    <p>{commune.description}</p>
                    <h3>Kết quả trồng trọt:</h3>
                    {plantOutputs && plantOutputs.items && plantOutputs.items.length > 0 ? (
                        <ul>
                            {sortPlantOutputs(plantOutputs.items).map((output, index) => (
                                <li key={index}>
                                    <strong>{output.plant.name}</strong>: {output.quantity} - Thời gian:{' '}
                                    {formatTime(output.time)}
                                </li>
                            ))}
                        </ul>
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
