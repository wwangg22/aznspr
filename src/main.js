import { NavLink, Routes, Route } from 'react-router-dom';
import Amazon, { SelectedOptionsProvider } from './options'
import CenteredMenu from './centermenu';
import AddKeywords from './addKeywords';
import React from 'react';
import ReRunBtn from './rerun'
import Headers from './headers';


export default function Main() {
    const wsocket = new WebSocket("ws://" + "aznspr.com" + "/ws/");

    return (
        <>
            <Headers
                socket = {wsocket}
            />
            <CenteredMenu/>
        </>

    );
}