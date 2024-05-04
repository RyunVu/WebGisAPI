import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { decode } from '../../../Utils/utils';

import { createPlant, getPlantById, updatePlant } from '../../../Services/plants';
import { getActivedCategories } from '../../../Services/categories';

export default function PlantEdit() {
    // Hooks
    const navigate = useNavigate();

    const initialState = {
        id: '',
        name: '',
        urlSlug: '',
        description: '',
        categoryId: '',
        category: {},
    };

    const [categories, setCategories] = useState([]);
    const [plant, setPlant] = useState(initialState);
    const [validated, setValidated] = useState(false);

    const { id } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (e.currentTarget.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
        } else {
            console.log(plant);
            let isSuccess = true;
            if (id) {
                const plantData = {
                    id,
                    name: plant.name,
                    description: plant.description,
                    categoryId: plant.category.id,
                };
                const data = await updatePlant(id, plantData);
                if (data && !data.isSuccess) isSuccess = false;
            } else {
                const data = await createPlant(plant);
                if (data && !data.isSuccess) isSuccess = false;
            }
            if (isSuccess) alert('Đã lưu thành công!');
            else alert('Đã xảy ra lỗi!');
            navigate('/admin/plants');
        }
    };

    useEffect(() => {
        document.title = 'Thêm/cập nhật loại sản phẩm';

        fetchCategories();
        fetchPlants();

        async function fetchCategories() {
            try {
                const data = await getActivedCategories();
                if (data) {
                    setCategories(data.items);
                } else {
                    setCategories(initialState);
                }
            } catch (error) {
                console.error('Error fetching Categories:', error);
                setCategories(initialState);
            }
        }

        async function fetchPlants() {
            const data = await getPlantById(id);
            // console.log(data);
            if (data) {
                setPlant(data);
            } else setPlant(initialState);
        }
        // eslint-disable-next-line
    }, [id]);

    return (
        <>
            <h1 className="px-4 py-3 text-danger">Thêm/cập nhật loại</h1>
            <Form className="mb-5 px-4" onSubmit={handleSubmit} noValidate validated={validated}>
                <Form.Control type="hidden" name="id" value={plant.id} />
                <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">Chủ đề</Form.Label>
                    <div className="col-sm-10">
                        <Form.Control
                            type="text"
                            name="name"
                            value={plant.name || ''}
                            onChange={(e) => {
                                const newName = e.target.value;
                                setPlant((prevPlant) => ({
                                    ...prevPlant,
                                    name: newName,
                                }));
                            }}
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
                            value={decode(plant.description || '')}
                            onChange={(e) => {
                                const newDescription = e.target.value;
                                setPlant((prevPlant) => ({
                                    ...prevPlant,
                                    description: newDescription,
                                }));
                            }}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <Form.Label className="col-sm-2 col-form-label">Cây</Form.Label>
                    <div className="col-sm-10">
                        <Form.Select
                            name="categoryId"
                            title="Category Id"
                            value={plant.category?.id || ''}
                            onChange={(e) => {
                                const selectedCategoryId = e.target.value;
                                setPlant((prevPlant) => {
                                    return {
                                        ...prevPlant,
                                        categoryId:
                                            selectedCategoryId !== '' ? selectedCategoryId : prevPlant.categoryId,
                                        category: {
                                            id:
                                                selectedCategoryId !== ''
                                                    ? selectedCategoryId
                                                    : prevPlant.category?.id || '',
                                        },
                                    };
                                });
                            }}>
                            <option value="">-- Chọn loại cây --</option>
                            {categories.length > 0 &&
                                categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
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
                    <Link to="/admin/plants" className="btn btn-danger ms-2">
                        Hủy và quay lại
                    </Link>
                </div>
            </Form>
        </>
    );
}
