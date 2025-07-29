import React, { useRef, useState } from 'react';
import { FaFileCirclePlus, FaFolderPlus, FaFolder, FaFileCode } from 'react-icons/fa6';
import { MdModeEdit } from 'react-icons/md';
import { RiDeleteBin6Fill } from 'react-icons/ri';

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

interface PropsInterface {
  data: FileItem;
  handleNewNode: (newNode: NewItem) => void;
  handleDeleteNode: (id: string) => void;
  handleEditNode: (newNode: NewItem) => void;
}

const FolderAndFile: React.FC<PropsInterface> = ({
  data,
  handleNewNode,
  handleDeleteNode,
  handleEditNode
}) => {
  const [showChildNode, setShowChildNode] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);
  const selectedIsFolder = useRef<boolean>(false);
  const isEditing = useRef<boolean>(false);

  const handleAdd = (e: React.MouseEvent<HTMLElement>, isFolder: boolean) => {
    e.stopPropagation();
    setShowInput(true);
    selectedIsFolder.current = isFolder;
    isEditing.current = false;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const newNode: NewItem = {
      name: inputValue,
      id,
      isFolder: selectedIsFolder.current
    };
    setShowInput(false);
    setInputValue('');
    isEditing.current ? handleEditNode(newNode) : handleNewNode(newNode);
  };

  const handleEdit = (e: React.MouseEvent, node: FileItem) => {
    e.stopPropagation();
    setInputValue(node.name);
    setShowInput(true);
    isEditing.current = true;
    selectedIsFolder.current = node.isFolder;
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    handleDeleteNode(id);
  };

  const { id = '', name = '', isFolder = false, items = [] } = data;

  return (
    <>
      <div className="FolderAndFile" onClick={() => setShowChildNode(p => !p)}>
        <div className="folderName">
          <span>{isFolder ? <FaFolder /> : <FaFileCode />}</span>
          <span>{name}</span>
        </div>
        <div className="folderAction">
          {isFolder && (
            <>
              <span className="folderActionItem" onClick={(e) => handleAdd(e, true)}><FaFolderPlus /></span>
              <span className="folderActionItem" onClick={(e) => handleAdd(e, false)}><FaFileCirclePlus /></span>
            </>
          )}
          <span className="folderActionItem" onClick={(e) => handleEdit(e, data)}><MdModeEdit /></span>
          <span className="folderActionItem" onClick={(e) => handleDelete(e, id)}><RiDeleteBin6Fill /></span>
        </div>
      </div>

      {showInput && (
        <form onSubmit={(e) => handleSubmit(e, id)}>
          <input
            style={{ width: '100%' }}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoFocus
          />
        </form>
      )}

      {showChildNode && isFolder && items.length > 0 && (
        <div className="childrenFileFolder" style={{ paddingLeft: '20px' }}>
          {items.map(child => (
            <FolderAndFile
              key={child.id}
              data={child}
              handleNewNode={handleNewNode}
              handleDeleteNode={handleDeleteNode}
              handleEditNode={handleEditNode}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default FolderAndFile;
