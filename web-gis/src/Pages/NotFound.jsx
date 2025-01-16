import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <>
            <div className="d-flex flex-column align-items-center mt-5 pt-5">
                <h1 className="mt-4 fw-bold">404</h1>
                <p className="mb-3 fs-3">Không tìm thấy trang</p>
                <Link to="/" className="btn btn-dark">
                    Quay về trang chủ
                </Link>
            </div>
        </>
    );
};

export default NotFound;
