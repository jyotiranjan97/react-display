import { FC } from 'react';
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
        return <>Excel Viewer</>;
      default:
        return <div>File type not supported</div>;
    }
  }

  return (
    <div>
      <div>{fileName}</div>
      <div className="h-[80vh] w-[60vw] overflow-auto flex justify-center p-10">
        <ViewerRenderer />
      </div>
    </div>
  );
};

export default ReactDisplay;
