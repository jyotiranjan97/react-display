import {
  getDocument,
  GlobalWorkerOptions,
  PDFDocumentProxy,
  PDFPageProxy,
  RenderTask
} from 'pdfjs-dist';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ViewerProps } from './types';

GlobalWorkerOptions.workerSrc =
  '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs';

const InfiniteScrollPDFViewer: FC<ViewerProps> = ({ fileContent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [pages, setPages] = useState<number[]>([1]);

  useEffect(() => {
    loadPDF();
  }, [fileContent]);

  const loadPDF = async () => {
    try {
      const loadingTask = getDocument({
        data: await fileContent.arrayBuffer()
      });
      const pdf = await loadingTask.promise;
      setPdfDocument(pdf);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  };

  const renderPage = useCallback(
    async (pageNumber: number) => {
      if (!pdfDocument || !containerRef.current) return;

      try {
        const page: PDFPageProxy = await pdfDocument.getPage(pageNumber);

        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const context = canvas.getContext('2d');
        const renderContext = {
          canvasContext: context!,
          viewport: viewport
        };

        const renderTask: RenderTask = page.render(renderContext);
        await renderTask.promise;

        containerRef.current.appendChild(canvas);
      } catch (error) {
        console.error(`Error rendering page ${pageNumber}:`, error);
      }
    },
    [pdfDocument]
  );

  const loadMorePages = useCallback(async () => {
    if (!pdfDocument || isLoadingRef.current) return;

    isLoadingRef.current = true;
    const nextPage = pages.length + 1;

    if (nextPage <= pdfDocument.numPages) {
      await renderPage(nextPage);
      setPages((prevPages) => [...prevPages, nextPage]);
    }

    isLoadingRef.current = false;
  }, [pdfDocument, pages, renderPage]);

  const onScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      loadMorePages();
    }
  }, [loadMorePages]);

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener('scroll', onScroll);

    return () => {
      container?.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  useEffect(() => {
    if (pages.length === 1 && pdfDocument) {
      renderPage(1);
    }
  }, [pdfDocument, pages, renderPage]);

  return (
    <div className="flex justify-center bg-stone-600 h-[100%] w-[100%]">
      <div ref={containerRef} className="overflow-y-scroll">
        {/* Pages will be rendered into this container */}
      </div>
    </div>
  );
};

export default InfiniteScrollPDFViewer;
