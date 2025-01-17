import { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function CategoryFilterPane({ setKeyword, setActived, actived }) {
    const keywordRef = useRef();

    // Component's event handlers
    const handleFilterCategories = (e) => {
        e.preventDefault();
        setKeyword(keywordRef.current.value);
    };

    const handleClearFilter = () => {
        setKeyword('');
        keywordRef.current.value = '';
    };

    const toggleActived = () => {
        setActived(!actived);
    };

    return (
        <Form method="get" onSubmit={handleFilterCategories} className="row gx-3 gy-2 align-items-center py-2">
            <Form.Group className="col-auto">
                <Form.Label className="visually-hidden">Từ khóa</Form.Label>
                <Form.Control ref={keywordRef} type="text" placeholder="Nhập từ khóa..." name="keyword" />
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
                <Link to="/admin/categories/edit" className="btn btn-success">
                    Thêm mới
                </Link>
            </Form.Group>
        </Form>
    );
}
