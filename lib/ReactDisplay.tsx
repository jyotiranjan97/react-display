import { FC } from 'react';
import ExcelDocViewer from './ExcelDocViewer';
import PdfDocViewer from './PdfViewer';
import { FileType } from './types';
import WordDocViewer from './WordDocViewer';

interface ReactDisplayProps {
  fileName: string;
  fileType: FileType;
  fileContent: Blob;
}

const ReactDisplay: FC<ReactDisplayProps> = ({
  fileName,
  fileType,
  fileContent
}) => {
  function ViewerRenderer() {
    switch (fileType) {
      case 'pdf':
        return <PdfDocViewer fileContent={fileContent} />;
      case 'docx':
      case 'doc':
        return <WordDocViewer fileContent={fileContent} />;
      case 'xlsx':
        return <ExcelDocViewer fileContent={fileContent} />;
      default:
        return <div>File type not supported</div>;
    }
  }

  return (
    <div className="w-[80vw] h-[80vh]">
      <div
        className="bg-slate-50 h-10 text-black items-center 
      align-middle flex justify-center shadow-lg"
      >
        {fileName}
      </div>
      <div className="overflow-scroll h-[90%] bg-gray-600">
        <ViewerRenderer />
      </div>
    </div>
  );
};

export default ReactDisplay;
