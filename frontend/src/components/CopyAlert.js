import { useEffect } from 'react';
import { Alert } from 'react-bootstrap';


import "../assets/styling/PostCard.css";

export function CopyAlert({showAlert, setShowAlert}) {
    useEffect(() => {
        const timeId = setTimeout(() => {
            setShowAlert(false);
        }, 3000)

        return () => {
            clearTimeout(timeId);
        }
        // eslint-disable-next-line
    }, [showAlert])

    return (
        <>
            <Alert variant="success" className="copy-alert">
                <Alert.Heading>Copied to clipboard.</Alert.Heading>
            </Alert>
        </>
    )

}


export default CopyAlert;