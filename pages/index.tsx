// components/UploadForm.tsx

import React, { useState } from 'react';
import axios from 'axios';

const UploadForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);  // Set the file state to the selected file
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const loader: HTMLElement | null=document.getElementById('loader')
        if(loader)
            loader.style.display='block'
        if (!file) {
            setUploadStatus('Please select a PDF file to upload.');  // Validation for file input
            return;
        }
        const formData = new FormData();
        formData.append('file', file);  // Append the file to FormData object

        try {
            const response = await axios.post('/api/extractpdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Handle the response by updating the upload status with the server's message
            setUploadStatus(`File uploaded successfully!`);
            const btn : HTMLElement | null=document.getElementById('chat');
            if(btn)    
            btn.style.visibility='visible';
            const loader: HTMLElement | null=document.getElementById('loader')
            if(loader)
            loader.style.display='none'
        } catch (error) {
            setUploadStatus('Error uploading file.');
            console.error('Upload error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='form'>
            <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className='input'
            />
            <button type="submit" className='button'>Upload PDF</button>
            <br></br>
            <button  id="chat"  style={{ visibility: 'hidden' }} className='button' onClick={()=>{
              window.location.href = '/chatbot';
            }}>chat now</button>
            {uploadStatus && <p className='status'>{uploadStatus}</p>}  // upload status
            <div className='loader' id="loader">

</div>
        </form>

    );
};

export default UploadForm;
