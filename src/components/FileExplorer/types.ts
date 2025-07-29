// File Explorer Types
export interface NewItem {
  id: string;
  name: string;
  isFolder: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  isFolder: boolean;
  items: FileItem[];
}

export interface FileExplorerProps {
  initialData?: FileItem;
  onFileSelect?: (file: FileItem) => void;
  onFileCreate?: (file: FileItem) => void;
  onFileDelete?: (fileId: string) => void;
  onFileRename?: (file: FileItem) => void;
}

export interface TreeOperations {
  addNewNodeToTree: (newNode: NewItem, nodeTree: FileItem) => FileItem;
  deleteNodeFromTree: (id: string, nodeTree: FileItem) => FileItem | null;
  editNodeFromTree: (newNode: NewItem, nodeTree: FileItem) => FileItem;
  filterTree: (node: FileItem, searchTerm: string) => FileItem | null;
}