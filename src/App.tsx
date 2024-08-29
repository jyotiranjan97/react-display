import { useState } from 'react';
import ReactDisplay from '../lib/ReactDisplay';

function App() {
  const [docBlob, setDocBlob] = useState<Blob | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const blob = new Blob([file], { type: file.type });
      setDocBlob(blob);
    } else {
      alert('Please upload a valid Word document.');
    }
  };

  return (
    <div>
      <h1>Upload and Preview Word Document</h1>
      <input type="file" accept=".docx" onChange={handleFileChange} />
      {docBlob && (
        <ReactDisplay fileName="DOcx" fileType="docx" fileContent={docBlob} />
      )}
    </div>
  );
}

export default App;
