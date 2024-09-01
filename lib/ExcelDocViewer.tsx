import React, { useEffect, useState } from 'react';
import Spreadsheet, { CellBase, Matrix } from 'react-spreadsheet';
import { read, utils, WorkBook, WorkSheet } from 'xlsx';

interface ExcelViewerProps {
  fileContent: Blob;
}

const ExcelDocViewer: React.FC<ExcelViewerProps> = ({ fileContent }) => {
  const [workbook, setWorkbook] = useState<WorkBook | null>(null);
  const [activeSheetName, setActiveSheetName] = useState<string | null>(null);
  const [sheetData, setSheetData] = useState<Matrix<CellBase>>([]);
  const [rowNames, setRowNames] = useState<string[]>([]);

  useEffect(() => {
    if (workbook && activeSheetName) {
      const sheet = workbook.Sheets[activeSheetName];
      parseSheetDataForSpreadsheet(sheet);
    }
  }, [workbook, activeSheetName]);

  useEffect(() => {
    handleFile(fileContent);
  }, [fileContent]);

  const handleFile = async (blob: Blob) => {
    const data = await blob.arrayBuffer();
    const wb = read(data, { type: 'array' });
    setWorkbook(wb);
    setActiveSheetName(wb.SheetNames[0]);
  };

  const parseSheetDataForSpreadsheet = (sheet: WorkSheet) => {
    const jsonData = utils.sheet_to_json<string[]>(sheet, { header: 1 });

    // Extract row names
    setRowNames(jsonData.map((_, index) => (index + 1).toString()));

    // Convert JSON data to Spreadsheet data
    const sheetData: Matrix<CellBase> = jsonData.map((row: string[]) => {
      return row.map((cell: string) => {
        return { value: cell, readOnly: true, className: 'text-black' };
      });
    });

    // Add 10 more empty rows
    for (let i = 0; i < 15; i++) {
      sheetData.push(
        Array(sheetData[0].length).fill({ value: '', readOnly: true })
      );
    }

    // Add 10 more empty columns
    sheetData.forEach((row) => {
      for (let i = 0; i < 10; i++) {
        row.push({ value: '', readOnly: true });
      }
    });

    setSheetData(sheetData);
  };

  return (
    <div className="w-full bg-white">
      {workbook && (
        <div className="flex flex-col h-[500px] overflow-hidden">
          <div className="flex-1 overflow-y-scroll overflow-x-auto">
            <Spreadsheet
              data={sheetData}
              rowLabels={rowNames}
              className="w-auto"
            />
          </div>

          {/* Sheet Tabs */}
          <ul className="flex list-none p-0">
            {workbook.SheetNames.map((name) => (
              <li
                key={name}
                onClick={() => setActiveSheetName(name)}
                className={`cursor-pointer px-2 py-1 border-[1px] border-gray-500 ${
                  name === activeSheetName
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-black'
                }`}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ExcelDocViewer;
