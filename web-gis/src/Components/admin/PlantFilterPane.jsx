import { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { getActivedCategories } from '../../Services/categories';
import { Link } from 'react-router-dom';

export default function PlantFilterPane({ setKeyword, setCategoryId, setActived, actived }) {
    const [categories, setCategories] = useState([]);

    const keywordRef = useRef();
    const categoryRef = useRef();

    // Component's event handlers
    const handleFilterPlants = (e) => {
        e.preventDefault();
        setKeyword(keywordRef.current.value);
        setCategoryId(categoryRef.current.value);
    };

    const handleClearFilter = () => {
        setKeyword('');
        setCategoryId('');
        keywordRef.current.value = '';
        categoryRef.current.value = '';
    };

    useEffect(() => {
        fetchCategories();

        async function fetchCategories() {
            const categories = await getActivedCategories();
            if (categories) setCategories(categories.items);
        }
    }, []);

    const toggleActived = () => {
        setActived(!actived);
    };

    return (
        <Form method="get" onSubmit={handleFilterPlants} className="row gx-3 gy-2 align-items-center py-2">
            <Form.Group className="col-auto">
                <Form.Label className="visually-hidden">Từ khóa</Form.Label>
                <Form.Control ref={keywordRef} type="text" placeholder="Nhập từ khóa..." name="keyword" />
            </Form.Group>

            <Form.Group className="col-auto">
                <Form.Label className="visually-hidden">Loại cây</Form.Label>
                <Form.Select ref={categoryRef} title="Chủ đề" name="categoryId">
                    <option value="">-- Chọn loại sản phẩm --</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group className="col-auto">
                <Button variant="primary mx-2" type="submit">
                    Tìm/Lọc
                </Button>
                <Button variant="warning" onClick={handleClearFilter}>
                    Bỏ lọc
                </Button>
                <Button variant="secondary mx-2" onClick={toggleActived}>
                    {!actived ? 'DS Hiện' : 'DS Ẩn'}
                </Button>
                <Link to="/admin/plants/edit" className="btn btn-success">
                    Thêm mới
                </Link>
            </Form.Group>
        </Form>
    );
}
