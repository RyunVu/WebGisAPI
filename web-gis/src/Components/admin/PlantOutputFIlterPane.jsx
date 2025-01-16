import { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getActivedCommunes } from '../../Services/communes';
import { getActivedPlants } from '../../Services/plants';

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function PlantOutputFilterPane({
    setKeyword,
    setPlantId,
    setCommuneId,
    setYear,
    setMonth,
    setActived,
    actived,
}) {
    const [plants, setPlants] = useState([]);
    const [communes, setCommunes] = useState([]);

    const keywordRef = useRef();
    const plantRef = useRef();
    const communeRef = useRef();
    const yearRef = useRef();
    const monthRef = useRef();

    // Component's event handlers
    const handleFilterPlants = (e) => {
        e.preventDefault();
        setKeyword(keywordRef.current.value);
        setPlantId(plantRef.current.value);
        setCommuneId(communeRef.current.value);
        setYear(yearRef.current.value);
        setMonth(monthRef.current.value);
    };

    const handleClearFilter = () => {
        setKeyword('');
        setPlantId('');
        setCommuneId('');
        keywordRef.current.value = '';
        plantRef.current.value = '';
        communeRef.current.value = '';
        yearRef.current.value = '';
        monthRef.current.value = '';
    };

    useEffect(() => {
        fetchPlants();
        fetchCommunes();

        async function fetchPlants() {
            const plants = await getActivedPlants();
            if (plants) setPlants(plants.items);
        }

        async function fetchCommunes() {
            const communes = await getActivedCommunes();
            if (communes) setCommunes(communes.items);
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
                <Form.Label className="visually-hidden">Cây</Form.Label>
                <Form.Select ref={plantRef} title="Chủ đề" name="plantId">
                    <option value="">-- Chọn cây --</option>
                    {plants.map((plant) => (
                        <option key={plant.id} value={plant.id}>
                            {plant.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="col-auto">
                <Form.Label className="visually-hidden">Xã</Form.Label>
                <Form.Select ref={communeRef} title="Chủ đề" name="communeId">
                    <option value="">-- Chọn xã --</option>
                    {communes.map((commune) => (
                        <option key={commune.id} value={commune.id}>
                            {commune.name}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="col-auto">
                <Form.Label className="visually-hidden">Tháng</Form.Label>
                <Form.Select ref={monthRef} title="Tháng" name="month">
                    <option value="">-- Chọn tháng --</option>
                    {months.map((month) => (
                        <option key={month} value={month}>
                            Tháng {month}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Form.Group className="col-auto">
                <Form.Label className="visually-hidden">Năm</Form.Label>
                <Form.Control ref={yearRef} type="text" placeholder="Năm..." name="year" />
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
                <Link to="/admin/plantoutputs/edit" className="btn btn-success">
                    Thêm mới
                </Link>
            </Form.Group>
        </Form>
    );
}
