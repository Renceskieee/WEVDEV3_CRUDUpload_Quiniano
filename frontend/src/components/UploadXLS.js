import React, { useState } from 'react';
import axios from 'axios';

const UploadXLS = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/upload-xls', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('File upload failed');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Upload XLS File</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Upload</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadXLS;
