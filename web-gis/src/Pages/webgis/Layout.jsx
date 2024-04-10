import Navbar from '../../Components/webgis/Navbar';
import MapView from '../../Components/webgis/MapView';
import Sidebar from '../../Components/webgis/Sidebar';
import GlobalStyle from '../../Components/webgis/WebStyle';

export default function Layout() {
    return (
        <>
            <GlobalStyle>
                <Navbar />
                <MapView />
                <Sidebar />
            </GlobalStyle>
        </>
    );
}
