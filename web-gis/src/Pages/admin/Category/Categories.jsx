import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import CategoryFilterPane from '../../../Components/admin/CategoryFilterPane';

import { getCategoriesByQueries, deleteCategoryById, toggleActivedCategoryById } from '../../../Services/categories';
import Loading from '../../../Components/Loading';
import Pager from '../../../Components/Pager';

import styles from '../Layout/layout.module.scss';

export default function Categories() {
    // Component's states
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState('');
    // const [showActivedList, setShowActivedList] = useState(false);

    const [actived, setActived] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [metadata, setMetadata] = useState({});
    const [categories, setCategories] = useState([]);

    const [isChangeStatus, setIsChangeStatus] = useState(false);

    // Component's event handlers
    const handleChangePage = (value) => {
        setPageNumber((current) => current + value);
        window.scroll(0, 0);
    };

    // Cập nhật hiện - ẩn
    const handleToggleActivedCategory = async (e, id) => {
        if (window.confirm('Bạn chắc chắn muốn cập nhập mục này?')) {
            const data = await toggleActivedCategoryById(id);
            if (data) {
                alert('Cập nhập thành công!!!');
                setIsChangeStatus(!isChangeStatus);
            } else alert('Có lỗi!!!');
        }
    };

    // Xóa
    const handleDeleteCategory = async (e, id) => {
        if (window.confirm('Bạn chắc chắn muốn xóa khỏi danh sách?')) {
            const data = await deleteCategoryById(id);
            if (data) {
                alert('Xóa thành công!!!');
                setIsChangeStatus(!isChangeStatus);
            } else alert('Có lỗi!!!');
        }
    };

    useEffect(() => {
        document.title = 'Danh sách chủ đề';
        fetchCategories();

        async function fetchCategories() {
            const queries = new URLSearchParams({
                pageNumber: pageNumber || 1,
                PageSize: 10,
                actived: actived,
            });
            keyword && queries.append('Keyword', keyword);

            const data = await getCategoriesByQueries(queries);
            console.log(data);
            if (data) {
                setCategories(data.items);
                setMetadata(data.metadata);
            } else {
                setCategories([]);
                setMetadata({});
            }
            setIsLoading(false);
        }
    }, [pageNumber, keyword, actived, isChangeStatus]);

    return (
        <div className="mb-5">
            <div className={styles.text}>Danh sách loại cây</div>
            <CategoryFilterPane setKeyword={setKeyword} setActived={setActived} actived={actived} />
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <Table striped responsive bordered>
                        <thead>
                            <tr>
                                <th>Chủ đề</th>
                                <th>Số nông sản</th>
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
                            {categories.length > 0 ? (
                                categories.map((category) =>
                                    actived ? (
                                        <tr key={category.id}>
                                            <td>
                                                <Link
                                                    to={`/admin/categories/edit/${category.id}`}
                                                    className="text-bold">
                                                    {category.name}
                                                </Link>
                                            </td>
                                            <td>{category.plantsCount}</td>
                                            <td>{category.description}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={(e) => handleToggleActivedCategory(e, category.id)}>
                                                    Ẩn
                                                </button>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={category.id}>
                                            <td>
                                                <Link
                                                    to={`/admin/categories/edit/${category.id}`}
                                                    className="text-bold">
                                                    {category.name}
                                                </Link>
                                            </td>
                                            <td>{category.plantsCount}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-info"
                                                    onClick={(e) => handleToggleActivedCategory(e, category.id)}>
                                                    Hiện
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-danger"
                                                    onClick={(e) => handleDeleteCategory(e, category.id)}>
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ),
                                )
                            ) : (
                                <tr>
                                    <td colSpan={4}>
                                        <h4 className="text-center text-danger">Không tìm thấy chủ đề</h4>
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
