import React from 'react';
import Navbar from '../../Components/webgis/Navbar';
import MapView from '../../Components/webgis/MapView';
// import Sidebar from '../../Components/webgis/Sidebar';
import GlobalStyle from '../../Components/webgis/WebStyle';

export default function Layout({ setPlantId, setYear, setMonth }) {
    return (
        <>
            <GlobalStyle />
            <Navbar setPlantId={setPlantId} setYear={setYear} setMonth={setMonth} />
            <MapView />
            {/* <Sidebar /> */}
        </>
    );
}
