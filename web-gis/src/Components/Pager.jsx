import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

export default function Pager({ metadata, onPageChange }) {
    // Component's props
    const { pageCount, hasNextPage, hasPreviousPage } = metadata;

    return (
        <>
            {pageCount > 1 && (
                <div className="my-4 text-center">
                    {hasPreviousPage ? (
                        <button className="btn btn-info" onClick={() => onPageChange(-1)}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                            &nbsp;Trang trước
                        </button>
                    ) : (
                        <Button variant="outline-secondary" disabled>
                            <FontAwesomeIcon icon={faArrowLeft} />
                            &nbsp;Trang trước
                        </Button>
                    )}
                    {hasNextPage ? (
                        <button className="btn btn-info ms-1" onClick={() => onPageChange(1)}>
                            Trang sau&nbsp;
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    ) : (
                        <Button variant="outline-secondary" className="ms-1" disabled>
                            Trang sau&nbsp;
                            <FontAwesomeIcon icon={faArrowRight} />
                        </Button>
                    )}
                </div>
            )}
        </>
    );
}
