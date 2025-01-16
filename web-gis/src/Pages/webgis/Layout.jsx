import React from 'react';
import MapView from '../../Components/webgis/MapView';
import GlobalStyle from '../../Components/webgis/WebStyle';

export default function Layout() {
    return (
        <>
            <GlobalStyle />
            <MapView />
        </>
    );
}
