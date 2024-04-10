import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import {
    WebGisLayout,
    BadRequest,
    NotFound,
    AdminLayout,
    AdminHome,
    Communes,
    CommuneEdit,
    Categories,
    CategoryEdit,
    Plants,
    PlantEdit,
    PlantOutputs,
    PlantOutputEdit,
} from './Pages';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WebGisLayout />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminHome />} />

                    <Route path="/admin/communes" element={<Communes />} />
                    <Route path="/admin/communes/edit" element={<CommuneEdit />} />
                    <Route path="/admin/communes/edit/:id" element={<CommuneEdit />} />

                    <Route path="/admin/categories" element={<Categories />} />
                    <Route path="/admin/categories/edit" element={<CategoryEdit />} />
                    <Route path="/admin/categories/edit/:id" element={<CategoryEdit />} />

                    <Route path="/admin/plants" element={<Plants />} />
                    <Route path="/admin/plants/edit" element={<PlantEdit />} />
                    <Route path="/admin/plants/edit/:id" element={<PlantEdit />} />

                    <Route path="/admin/plantoutputs" element={<PlantOutputs />} />
                    <Route path="/admin/plantoutputs/edit" element={<PlantOutputEdit />} />
                    <Route path="/admin/plantoutputs/edit/:id" element={<PlantOutputEdit />} />
                </Route>
                <Route path="/400" element={<BadRequest />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
