import React, { useState } from 'react';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [name, setName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const handleGeneratePDF = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/generate-pdf', { name }, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Generate Your Certificate</h1>
      <form onSubmit={handleGeneratePDF} className="mb-4">
        <div className="form-group">
          <center>
          <label htmlFor="name">Name to be displayed on the certificate</label>
          </center>
          <input 
            type="text" 
            id="name" 
            className="form-control w-25 mx-auto" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary mt-2">Generate PDF</button>
        </div>
      </form>
      {pdfUrl && (
        <div className="text-center" style={{marginBottom : '20px'}}>
          <h2>Preview Your Certificate</h2>
          <Worker workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}>
            <div style={{ height: '600px', width: '900px', margin: '0 auto' }}>
              <Viewer fileUrl={pdfUrl} />
            </div>
          </Worker>
          <br />
            <a href={pdfUrl} className="btn btn-success" download="certificate.pdf">Download Your Certificate</a>
        </div>
      )}
    </div>
  );
}

export default App;

