import { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function CommuneFilterPane({ setKeyword, setActived, actived }) {
    const keywordRef = useRef();

    // Component's event handlers
    const handleFilterCommunes = (e) => {
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
        <Form method="get" onSubmit={handleFilterCommunes} className="row gx-3 gy-2 align-items-center py-2">
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
            </Form.Group>
        </Form>
    );
}
