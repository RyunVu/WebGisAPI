import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import PlantFilterPane from '../../../Components/admin/PlantFilterPane';

import { getPlantsByQueries, deletePlantById, toggleActivedPlantById } from '../../../Services/plants';
import Loading from '../../../Components/Loading';
import Pager from '../../../Components/Pager';

import styles from '../Layout/layout.module.scss';

export default function Plants() {
    // Component's states
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');
    // const [showActivedList, setShowActivedList] = useState(false);

    const [actived, setActived] = useState(true);
    const [categoryId, setCategoryId] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [metadata, setMetadata] = useState({});
    const [plants, setPlants] = useState([]);

    const [isChangeStatus, setIsChangeStatus] = useState(false);

    // Component's event handlers
    const handleChangePage = (value) => {
        setPageNumber((current) => current + value);
        window.scroll(0, 0);
    };

    // Cập nhật hiện - ẩn
    const handleToggleActivedPlant = async (e, id) => {
        if (window.confirm('Bạn chắc chắn muốn cập nhập mục này?')) {
            const data = await toggleActivedPlantById(id);
            if (data) {
                alert('Cập nhập thành công!!!');
                setIsChangeStatus(!isChangeStatus);
            } else alert('Có lỗi!!!');
        }
    };

    // Xóa
    const handleDeletePlant = async (e, id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa khỏi danh sách?')) {
            const data = await deletePlantById(id);
            if (data) {
                alert('Xóa thành công!!!');
                setIsChangeStatus(!isChangeStatus);
            } else alert('Có lỗi!!!');
        }
    };

    useEffect(() => {
        document.title = 'Danh sách cây';
        fetchPlants();

        async function fetchPlants() {
            const queries = new URLSearchParams({
                pageNumber: pageNumber || 1,
                PageSize: 10,
                actived: actived,
            });
            keyword && queries.append('Keyword', keyword);
            categoryId && queries.append('CategoryId', categoryId);

            const data = await getPlantsByQueries(queries);
            console.log(data);
            if (data) {
                setPlants(data.items);
                setMetadata(data.metadata);
            } else {
                setPlants([]);
                setMetadata({});
            }
            setIsLoading(false);
        }
    }, [pageNumber, keyword, categoryId, actived, isChangeStatus]);

    return (
        <div className="mb-5">
            <div className={styles.text}>Danh sách cây</div>
            <PlantFilterPane
                setKeyword={setKeyword}
                setCategoryId={setCategoryId}
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
                                <th>Tên</th>
                                {!actived ? (
                                    <>
                                        <th>Chỉnh hiện</th>
                                        <th>Xóa</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Mô tả</th>
                                        <th>Ẩn</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {plants.length > 0 ? (
                                plants.map((plant) =>
                                    actived ? (
                                        <tr key={plant.id}>
                                            <td>
                                                <Link
                                                    to={`/admin/categories/edit/${plant.id}`}
                                                    className="text-bold"
                                                    style={{
                                                        maxWidth: '150px',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                    {plant.name}
                                                </Link>
                                            </td>
                                            <td
                                                style={{
                                                    maxWidth: '200px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {plant.description}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={(e) => handleToggleActivedPlant(e, plant.id)}>
                                                    Ẩn
                                                </button>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={plant.id}>
                                            <td>
                                                <Link to={`/admin/categories/edit/${plant.id}`} className="text-bold">
                                                    {plant.name}
                                                </Link>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={(e) => handleToggleActivedPlant(e, plant.id)}>
                                                    Hiện
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={(e) => handleDeletePlant(e, plant.id)}>
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td colSpan={4}>
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
