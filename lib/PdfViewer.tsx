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

  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [pages, setPages] = useState<number[]>([1]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadPDF();
  }, [fileContent]);

  async function loadPDF() {
    try {
      const loadingTask = getDocument({
        data: await fileContent.arrayBuffer()
      });
      const pdf = await loadingTask.promise;
      setPdfDocument(pdf);
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }

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
        console.log(`Page ${pageNumber} rendered successfully.`);
      } catch (error) {
        console.error(`Error rendering page ${pageNumber}:`, error);
      }
    },
    [pdfDocument]
  );

  const loadMorePages = useCallback(() => {
    if (!pdfDocument || isLoading) return;

    setIsLoading(true);
    setPages((prevPages) => {
      const nextPage = prevPages.length + 1;
      if (nextPage <= pdfDocument.numPages) {
        renderPage(nextPage);
        return [...prevPages, nextPage];
      }
      return prevPages;
    });
    setIsLoading(false);
  }, [pdfDocument, isLoading, renderPage]);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMorePages();
      }
    };

    const container = containerRef.current;
    container?.addEventListener('scroll', onScroll);

    return () => {
      container?.removeEventListener('scroll', onScroll);
    };
  }, [loadMorePages]);

  useEffect(() => {
    if (pages.length === 1 && pdfDocument) {
      renderPage(1);
    }
  }, [pdfDocument, pages, renderPage]);

  return (
    <div className="px-12 py-5">
      <div ref={containerRef}>
        {/* Pages will be rendered into this container */}
      </div>
    </div>
  );
};

export default InfiniteScrollPDFViewer;
