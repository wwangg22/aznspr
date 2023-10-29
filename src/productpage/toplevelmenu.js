import './toplevelmenu.css';
import { NavLink } from 'react-router-dom';
import React from 'react';

export default function TopLevelMenu() {
    return (
        <div className="menu-bar">
            <NavLink to="/" className="back-button">
                ← Back
            </NavLink>
            <h1 className="site-title">
                Amazon Tool
            </h1>
        </div>
    );
}
