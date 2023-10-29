import React from 'react';
import './dropdown.css'

export default function Dropdown({ dates, onChange }) {
    return (
        <select onChange={onChange}>
            <option value="" disabled selected>Select a date</option>
            {dates.map((date, index) => (
                <option key={index} value={date}>
                    {date}
                </option>
            ))}
        </select>
    );
}

