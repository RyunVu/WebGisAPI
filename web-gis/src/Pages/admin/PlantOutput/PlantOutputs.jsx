import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

import PlantOutputFilterPane from '../../../Components/admin/PlantOutputFIlterPane';

import {
    getPlantOutputsByQueries,
    deletePlantOutputById,
    toggleActivedPlantOutputById,
} from '../../../Services/plantoutputs';

import Loading from '../../../Components/Loading';
import Pager from '../../../Components/Pager';

import styles from '../Layout/layout.module.scss';

export default function PlantOutputs() {
    // Component's states
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');
    // const [showActivedList, setShowActivedList] = useState(false);

    const [actived, setActived] = useState(true);
    const [plantId, setPlantId] = useState();
    const [communeId, setCommuneId] = useState();
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [metadata, setMetadata] = useState({});
    const [plantOutputs, setPlantOutputs] = useState([]);

    const [isChangeStatus, setIsChangeStatus] = useState(false);

    // Component's event handlers
    const handleChangePage = (value) => {
        setPageNumber((current) => current + value);
        window.scroll(0, 0);
    };

    // Cập nhật hiện - ẩn
    const handleToggleActivedPlantOutput = async (e, id) => {
        if (window.confirm('Bạn chắc chắn muốn cập nhập mục này?')) {
            const data = await toggleActivedPlantOutputById(id);
            if (data) {
                alert('Cập nhập thành công!!!');
                setIsChangeStatus(!isChangeStatus);
            } else alert('Có lỗi!!!');
        }
    };

    // Xóa
    const handleDeletePlantOutput = async (e, id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa khỏi danh sách?')) {
            const data = await deletePlantOutputById(id);
            if (data) {
                alert('Xóa thành công!!!');
                setIsChangeStatus(!isChangeStatus);
            } else alert('Có lỗi!!!');
        }
    };

    useEffect(() => {
        document.title = 'Danh sách sản lượng';
        fetchPlantOutputs();

        async function fetchPlantOutputs() {
            const queries = new URLSearchParams({
                pageNumber: pageNumber || 1,
                PageSize: 12,
                actived: actived,
            });
            keyword && queries.append('Keyword', keyword);
            plantId && queries.append('PlantId', plantId);
            communeId && queries.append('CommuneId', communeId);
            selectedYear && queries.append('year', selectedYear);
            selectedMonth && queries.append('month', selectedMonth);

            const data = await getPlantOutputsByQueries(queries);
            // console.log(data);
            if (data) {
                setPlantOutputs(data.items);
                setMetadata(data.metadata);
            } else {
                setPlantOutputs([]);
                setMetadata({});
            }
            setIsLoading(false);
        }
    }, [pageNumber, keyword, plantId, communeId, selectedYear, selectedMonth, actived, isChangeStatus]);

    return (
        <div className="mb-5">
            <div className={styles.text}>Danh sách cây</div>
            <PlantOutputFilterPane
                setKeyword={setKeyword}
                setPlantId={setPlantId}
                setCommuneId={setCommuneId}
                setYear={setSelectedYear}
                setMonth={setSelectedMonth}
                setActived={setActived}
                actived={actived}
            />
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Table striped responsive bordered>
                        <thead>
                            <tr>
                                <th>Xã</th>
                                <th>Cây</th>
                                <th>Sản lượng</th>
                                <th>Đơn vị</th>
                                <th>Thời gian</th>
                                {!actived ? (
                                    <>
                                        <th>Chỉnh hiện</th>
                                        <th>Xóa</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Ẩn</th>
                                    </>
                                )}
                                <th>Cập nhập</th>
                            </tr>
                        </thead>
                        <tbody>
                            {plantOutputs.length > 0 ? (
                                plantOutputs.map((plantOutput) =>
                                    actived ? (
                                        <tr key={plantOutput.id}>
                                            <td
                                                style={{
                                                    maxWidth: '100px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {plantOutput.commune.name}
                                            </td>
                                            <td
                                                style={{
                                                    maxWidth: '100px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {plantOutput.plant.name}
                                            </td>
                                            <td
                                                style={{
                                                    maxWidth: '100px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {plantOutput.quantity}
                                            </td>{' '}
                                            <td
                                                style={{
                                                    maxWidth: '100px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {plantOutput.unit}
                                            </td>
                                            <td
                                                style={{
                                                    maxWidth: '100px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {new Date(plantOutput.time).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={(e) => handleToggleActivedPlantOutput(e, plantOutput.id)}>
                                                    Ẩn
                                                </button>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/admin/plantoutputs/edit/${plantOutput.id}`}
                                                    className="text-bold">
                                                    <button className="btn btn-light" type="button">
                                                        Cập nhập
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={plantOutput.id}>
                                            <td
                                                style={{
                                                    maxWidth: '100px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {plantOutput.commune.name}
                                            </td>
                                            <td
                                                style={{
                                                    maxWidth: '100px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {plantOutput.plant.name}
                                            </td>
                                            <td
                                                style={{
                                                    maxWidth: '100px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {plantOutput.quantity}
                                            </td>{' '}
                                            <td
                                                style={{
                                                    maxWidth: '100px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {plantOutput.unit}
                                            </td>
                                            <td
                                                style={{
                                                    maxWidth: '100px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {new Date(plantOutput.time).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={(e) => handleToggleActivedPlantOutput(e, plantOutput.id)}>
                                                    Hiện
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={(e) => handleDeletePlantOutput(e, plantOutput.id)}>
                                                    Xóa
                                                </button>
                                            </td>
                                            <td>
                                                <Link
                                                    to={`/admin/plantoutputs/edit/${plantOutput.id}`}
                                                    className="text-bold">
                                                    <button className="btn btn-light" type="button">
                                                        Cập nhập
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td colSpan={7}>
                                        <h4 className="text-center text-danger">Không tìm thấy cây</h4>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Pager metadata={metadata} onPageChange={handleChangePage} />
                </>
            )}
        </div>
    );
}
