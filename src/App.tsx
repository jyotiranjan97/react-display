import { useState } from 'react';
import ReactDisplay from '../lib/ReactDisplay';
import { FileType } from '../lib/types';

function App() {
  const [docBlob, setDocBlob] = useState<Blob | null>(null);
  const [fileType, setFileType] = useState<string>();
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const blob = new Blob([file], { type: file.type });
      setFileType(file.type);
      setFileName(file.name);
      setDocBlob(blob);
    } else {
      alert('Please upload a valid Word document.');
    }
  };

  function fileTypeMapper(fileType: string | undefined): FileType {
    switch (fileType) {
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'docx';
      case 'application/pdf':
        return 'pdf';
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        return 'xlsx';
      default:
        return 'pdf';
    }
  }

  return (
    <div>
      <h1>Upload and Preview Word Document</h1>
      <input
        type="file"
        accept=".docx, .pdf, .xlsx"
        onChange={handleFileChange}
      />
      {docBlob && (
        <ReactDisplay
          fileName={fileName}
          fileType={fileTypeMapper(fileType)}
          fileContent={docBlob}
        />
      )}
    </div>
  );
}

export default App;
