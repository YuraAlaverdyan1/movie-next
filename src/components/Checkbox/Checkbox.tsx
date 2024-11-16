'use client';
import React, { useState } from 'react';
import styles from './checkbox.module.scss';

interface CustomCheckboxPropsITF {
    checked?: boolean;
    label: string;
    onChange?: (checked: boolean) => void;
}

const Checkbox: React.FC<CustomCheckboxPropsITF> = ({ checked = false, label, onChange }) => {
    const [isChecked, setIsChecked] = useState<boolean>(checked);

    const handleChange = () => {
        const newCheckedState = !isChecked;
        setIsChecked(newCheckedState);
        if (onChange) {
            onChange(newCheckedState);
        }
    };

    return (
        <label className={styles.checkboxContainer}>
            <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={isChecked}
                onChange={handleChange}
            />
            <span className={styles.checkboxCustom}></span>
            <span className={styles.checkboxLabel}>{label}</span>
        </label>
    );
};

export default Checkbox;