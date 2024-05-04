import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { decode } from '../../../Utils/utils';

import { createPlantOutput, getPlantOutputById, updatePlantOutput } from '../../../Services/plantoutputs';
import { getActivedPlants } from '../../../Services/plants';
import { getActivedCommunes } from '../../../Services/communes';

export default function PlantOutputEdit() {
    // Hooks
    const navigate = useNavigate();

    const initialState = {
        id: '',
        quantity: 0,
        unit: '',
        urlSlug: '',
        time: '',
        plantId: '',
        plant: {},
        communeId: '',
        commune: {},
    };

    const [plants, setPlants] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [plantoutput, setPlantOutput] = useState(initialState);
    const [validated, setValidated] = useState(false);

    const { id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (e.currentTarget.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
        } else {
            let isSuccess = true;
            if (id) {
                const plantOutputData = {
                    id,
                    quantity: plantoutput.quantity,
                    unit: plantoutput.unit,
                    time: plantoutput.time,
                    plantId: plantoutput.plant.id,
                    communeId: plantoutput.commune.id,
                };
                console.log(plantoutput);
                const data = await updatePlantOutput(id, plantOutputData);
                if (data && !data.isSuccess) isSuccess = false;
            } else {
                const data = await createPlantOutput(plantoutput);
                if (data && !data.isSuccess) isSuccess = false;
            }
            if (isSuccess) alert('Đã lưu thành công!');
            else alert('Đã xảy ra lỗi!');
            navigate('/admin/plantoutputs');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        document.title = 'Thêm/cập nhật loại sản phẩm';

        fetchPlants();
        fetchCommunes();
        fetchPlantOutputs();

        async function fetchPlants() {
            try {
                const data = await getActivedPlants();
                if (data) {
                    setPlants(data.items);
                } else {
                    setPlants(initialState);
                }
            } catch (error) {
                console.error('Error fetching Plants:', error);
                setPlants(initialState);
            }
        }
        async function fetchCommunes() {
            try {
                const data = await getActivedCommunes();
                if (data) {
                    setCommunes(data.items);
                } else {
                    setCommunes(initialState);
                }
            } catch (error) {
                console.error('Error fetching Communes:', error);
                setCommunes(initialState);
            }
        }

        async function fetchPlantOutputs() {
            const data = await getPlantOutputById(id);
            // console.log(data);
            if (data) {
                setPlantOutput(data);
            } else setPlantOutput(initialState);
        }
        // eslint-disable-next-line
    }, [id]);

    return (
        <>
            <h1 className="px-4 py-3 text-danger">Thêm/cập nhật sản lượng</h1>
            <Form className="mb-5 px-4" onSubmit={handleSubmit} noValidate validated={validated}>
                <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">Cây</Form.Label>
                    <div className="col-sm-10">
                        <Form.Select
                            name="plantId"
                            title="Plant Id"
                            value={plantoutput.plantId ? plantoutput.plantId : plantoutput.plant.id}
                            onChange={(e) => {
                                console.log('Selected plant ID:', e.target.value);
                                setPlantOutput({
                                    ...plantoutput,
                                    plantId: e.target.value,
                                    plant: {
                                        id: e.target.value,
                                    },
                                });
                            }}>
                            <option value="">-- Chọn cây --</option>
                            {plants.length > 0 &&
                                plants.map((plant) => (
                                    <option key={plant.id} value={plant.id}>
                                        {plant.name}
                                    </option>
                                ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Không được bỏ trống</Form.Control.Feedback>
                    </div>
                </div>

                <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">Xã</Form.Label>
                    <div className="col-sm-10">
                        <Form.Select
                            name="communeId"
                            title="Commune Id"
                            value={plantoutput.communeId ? plantoutput.communeId : plantoutput.commune.id}
                            onChange={(e) => {
                                console.log('Selected commune ID:', e.target.value);
                                setPlantOutput({
                                    ...plantoutput,
                                    communeId: e.target.value,
                                    commune: {
                                        id: e.target.value,
                                    },
                                });
                            }}>
                            <option value="">-- Chọn xã --</option>
                            {communes.length > 0 &&
                                communes.map((commune) => (
                                    <option key={commune.id} value={commune.id}>
                                        {commune.name}
                                    </option>
                                ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Không được bỏ trống</Form.Control.Feedback>
                    </div>
                </div>

                <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">Sản lượng</Form.Label>
                    <div className="col-sm-10">
                        <Form.Control
                            type="number"
                            name="quantity"
                            title="quantity"
                            value={plantoutput.quantity || 0}
                            onChange={(e) =>
                                setPlantOutput({
                                    ...plantoutput,
                                    quantity: e.target.value,
                                })
                            }
                        />
                        <Form.Control.Feedback type="invalid">Không được bỏ trống</Form.Control.Feedback>
                    </div>
                </div>

                <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">Đơn vị</Form.Label>
                    <div className="col-sm-10">
                        <Form.Control
                            type="text"
                            name="unit"
                            title="unit"
                            value={decode(plantoutput.unit || '')}
                            onChange={(e) =>
                                setPlantOutput({
                                    ...plantoutput,
                                    unit: e.target.value,
                                })
                            }
                        />
                        <Form.Control.Feedback type="invalid">Không được bỏ trống</Form.Control.Feedback>
                    </div>
                </div>

                <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">Thời gian</Form.Label>
                    <div className="col-sm-10">
                        <Form.Control
                            type="date"
                            name="time"
                            title="time"
                            value={formatDate(plantoutput.time)}
                            onChange={(e) =>
                                setPlantOutput({
                                    ...plantoutput,
                                    time: e.target.value + 'T00:00:00Z',
                                })
                            }
                        />
                        <Form.Control.Feedback type="invalid">Không được bỏ trống</Form.Control.Feedback>
                    </div>
                </div>

                <div className="text-center">
                    <Button variant="primary" type="submit">
                        Lưu các thay đổi
                    </Button>
                    <Link to="/admin/plantoutputs" className="btn btn-danger ms-2">
                        Hủy và quay lại
                    </Link>
                </div>
            </Form>
        </>
    );
}
