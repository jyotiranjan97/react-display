export type FileType = 'pdf' | 'docx' | 'doc' | 'xlsx' | 'jpg' | 'png';

export interface ViewerProps {
  fileContent: Blob;
}
