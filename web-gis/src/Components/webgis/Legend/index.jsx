import React from 'react';
import styles from './Legend.module.scss';

export default function Legend({ colors }) {
    if (!colors || colors.length === 0) return null;

    return (
        <div className={styles.legend}>
            <div className={styles.legendBox}>
                <h3 className={styles.legendTitle}>Xếp hạng</h3>
                <ul className={styles.legendList}>
                    {colors &&
                        colors.length > 0 &&
                        colors.map((color, index) => (
                            <li key={index} className={styles.legendItem}>
                                <span className={styles.colorBox} style={{ backgroundColor: color.color }}></span>
                                <span className={styles.legendLabel}> - {color.communeName} - </span>
                                <span> Xếp hạng {index + 1} </span>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
