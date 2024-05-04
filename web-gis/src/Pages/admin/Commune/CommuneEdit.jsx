import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { decode } from '../../../Utils/utils';

import { getCommuneById, updateCommune } from '../../../Services/communes';
import { getActivedDistricts } from '../../../Services/districts';

export default function CommuneEdit() {
    // Hooks
    const navigate = useNavigate();

    const initialState = {
        id: '',
        name: '',
        urlSlug: '',
        description: '',
        area: 0,
        districtId: '',
        district: {},
    };

    const [districts, setDistricts] = useState([]);
    const [commune, setCommune] = useState(initialState);
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
                const data = await updateCommune(id, commune);
                if (data && !data.isSuccess) isSuccess = false;
            }
            if (isSuccess) alert('Đã lưu thành công!');
            else alert('Đã xảy ra lỗi!');
            navigate('/admin/communes');
        }
    };

    useEffect(() => {
        document.title = 'Thêm/cập nhật loại sản phẩm';

        fetchDistricts();
        fetchCommunes();

        async function fetchDistricts() {
            try {
                const data = await getActivedDistricts();
                if (data) {
                    setDistricts(data.items);
                    console.log('Fetched districts:', districts);
                } else {
                    // Handle case when data is null or empty
                    // console.log('No districts fetched.');
                    setDistricts(initialState);
                }
            } catch (error) {
                console.error('Error fetching districts:', error);
                // Handle error state appropriately, e.g., show error message to user
                setDistricts(initialState);
            }
        }

        async function fetchCommunes() {
            const data = await getCommuneById(id);
            // console.log(data);
            if (data) {
                setCommune(data);
            } else setCommune(initialState);
        }
        // eslint-disable-next-line
    }, [id]);

    return (
        <>
            <h1 className="px-4 py-3 text-danger">Thêm/cập nhật loại</h1>
            <Form className="mb-5 px-4" onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Control type="hidden" name="id" value={commune.id} />
                <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">Chủ đề</Form.Label>
                    <div className="col-sm-10">
                        <Form.Control
                            type="text"
                            name="name"
                            required
                            value={commune.name || ''}
                            onChange={(e) =>
                                setCommune({
                                    ...commune,
                                    name: e.target.value,
                                })
                            }
                        />
                        <Form.Control.Feedback type="invalid">Không được bỏ trống</Form.Control.Feedback>
                    </div>
                </div>

                <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">Mô tả</Form.Label>
                    <div className="col-sm-10">
                        <Form.Control
                            as="textarea"
                            type="text"
                            name="description"
                            title="description"
                            value={decode(commune.description || '')}
                            onChange={(e) =>
                                setCommune({
                                    ...commune,
                                    description: e.target.value,
                                })
                            }
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">Diện tích</Form.Label>
                    <div className="col-sm-10">
                        <Form.Control
                            type="number"
                            name="area"
                            title="area"
                            value={commune.area || ''}
                            onChange={(e) =>
                                setCommune({
                                    ...commune,
                                    description: e.target.value,
                                })
                            }
                        />
                        <Form.Control.Feedback type="invalid">Không được bỏ trống</Form.Control.Feedback>
                    </div>
                </div>

                <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">Huyện</Form.Label>
                    <div className="col-sm-10">
                        <Form.Select
                            name="districtId"
                            title="District Id"
                            value={commune.districtId ? commune.districtId : commune.district.id}
                            required
                            onChange={(e) =>
                                setCommune({
                                    ...commune,
                                    districtId: e.target.value,
                                })
                            }>
                            <option value="">-- Chọn huyện --</option>
                            {districts.length > 0 &&
                                districts.map((district) => (
                                    <option key={district.id} value={district.id}>
                                        {district.name}
                                    </option>
                                ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Không được bỏ trống</Form.Control.Feedback>
                    </div>
                </div>
                <div className="text-center">
                    <Button variant="primary" type="submit">
                        Lưu các thay đổi
                    </Button>
                    <Link to="/admin/communes" className="btn btn-danger ms-2">
                        Hủy và quay lại
                    </Link>
                </div>
            </Form>
        </>
    );
}
