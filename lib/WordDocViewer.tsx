import { renderAsync } from 'docx-preview';
import { FC, useEffect, useRef } from 'react';
import { ViewerProps } from './types';

const WordDocViewer: FC<ViewerProps> = ({ fileContent }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (fileContent && containerRef.current) {
      renderAsync(fileContent, containerRef.current, undefined, {
        inWrapper: true
      })
        .then(() => console.log('docx: finished'))
        .catch((err) => console.error('docx: error', err));
    }
  }, [fileContent]);

  return <div className="bg-white" ref={containerRef}></div>;
};

export default WordDocViewer;
