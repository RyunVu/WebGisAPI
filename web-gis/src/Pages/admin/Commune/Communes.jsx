import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import CommuneFilterPane from '../../../Components/admin/CommuneFilterPane';

import { getCommunesByQueries, deleteCommuneById, toggleActivedCommuneById } from '../../../Services/communes';
import Loading from '../../../Components/Loading';
import Pager from '../../../Components/Pager';

import styles from '../Layout/layout.module.scss';

export default function Communes() {
    // Component's states
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');
    // const [showActivedList, setShowActivedList] = useState(false);

    const [actived, setActived] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [metadata, setMetadata] = useState({});
    const [communes, setcommunes] = useState([]);

    const [isChangeStatus, setIsChangeStatus] = useState(false);

    // Component's event handlers
    const handleChangePage = (value) => {
        setPageNumber((current) => current + value);
        window.scroll(0, 0);
    };

    // Cập nhật hiện - ẩn
    const handleToggleActivedCommune = async (e, id) => {
        if (window.confirm('Bạn chắc chắn muốn cập nhập mục này?')) {
            const data = await toggleActivedCommuneById(id);
            if (data) {
                alert('Cập nhập thành công!!!');
                setIsChangeStatus(!isChangeStatus);
            } else alert('Có lỗi!!!');
        }
    };

    // Xóa
    const handleDeleteCommune = async (e, id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa khỏi danh sách?')) {
            const data = await deleteCommuneById(id);
            if (data) {
                alert('Xóa thành công!!!');
                setIsChangeStatus(!isChangeStatus);
            } else alert('Có lỗi!!!');
        }
    };

    useEffect(() => {
        document.title = 'Danh sách xã';
        fetchCommunes();

        async function fetchCommunes() {
            const queries = new URLSearchParams({
                pageNumber: pageNumber || 1,
                PageSize: 10,
                actived: actived,
            });
            keyword && queries.append('Keyword', keyword);

            const data = await getCommunesByQueries(queries);
            console.log(data);
            if (data) {
                setcommunes(data.items);
                setMetadata(data.metadata);
            } else {
                setcommunes([]);
                setMetadata({});
            }
            setIsLoading(false);
        }
    }, [pageNumber, keyword, actived, isChangeStatus]);

    return (
        <div className="mb-5">
            <div className={styles.text}>Danh sách xã</div>
            <CommuneFilterPane setKeyword={setKeyword} setActived={setActived} actived={actived} />
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Table striped responsive bordered>
                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>Diện tích</th>
                                <th>Thuộc tỉnh</th>
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
                            {communes.length > 0 ? (
                                communes.map((commune) => (
                                    <tr key={commune.id}>
                                        <td>
                                            <Link
                                                to={`/admin/communes/edit/${commune.id}`}
                                                className="text-bold"
                                                style={{
                                                    maxWidth: '150px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                {commune.name}
                                            </Link>
                                        </td>
                                        <td>{commune.area}</td>
                                        <td>{commune.district.name}</td>
                                        <td
                                            style={{
                                                maxWidth: '200px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                            {commune.description}
                                        </td>
                                        <td>
                                            {actived ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={(e) => handleToggleActivedCommune(e, commune.id)}>
                                                    Ẩn
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="btn btn-info"
                                                        onClick={(e) => handleToggleActivedCommune(e, commune.id)}>
                                                        Hiện
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={(e) => handleDeleteCommune(e, commune.id)}>
                                                        Xóa
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5}>
                                        <h4 className="text-center text-danger">Không tìm thấy xã</h4>
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
