import React, { useRef, useState, useCallback, memo } from 'react';
import { 
  FaFileCirclePlus, 
  FaFolderPlus, 
  FaFolder, 
  FaFolderOpen,
  FaFileCode,
  FaChevronRight,
  FaChevronDown
} from 'react-icons/fa6';
import { MdModeEdit } from 'react-icons/md';
import { RiDeleteBin6Fill } from 'react-icons/ri';
import type { FileItem, NewItem } from './types';


interface PropsInterface {
  data: FileItem;
  handleNewNode: (newNode: NewItem) => void;
  handleDeleteNode: (id: string) => void;
  handleEditNode: (newNode: NewItem) => void;
  depth?: number;
}

const FolderAndFile: React.FC<PropsInterface> = memo(({
  data,
  handleNewNode,
  handleDeleteNode,
  handleEditNode,
  depth = 0
}) => {
  const [showChildNode, setShowChildNode] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const selectedIsFolder = useRef<boolean>(false);
  const isEditing = useRef<boolean>(false);

  const handleAdd = useCallback((e: React.MouseEvent<HTMLElement>, isFolder: boolean) => {
    e.stopPropagation();
    setShowInput(true);
    setShowChildNode(true);
    selectedIsFolder.current = isFolder;
    isEditing.current = false;
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newNode: NewItem = {
      name: inputValue.trim(),
      id,
      isFolder: selectedIsFolder.current
    };
    setShowInput(false);
    setInputValue('');
    isEditing.current ? handleEditNode(newNode) : handleNewNode(newNode);
  }, [inputValue, handleEditNode, handleNewNode]);

  const handleEdit = useCallback((e: React.MouseEvent, node: FileItem) => {
    e.stopPropagation();
    setInputValue(node.name);
    setShowInput(true);
    isEditing.current = true;
    selectedIsFolder.current = node.isFolder;
  }, []);

  const handleDelete = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this item?')) {
      handleDeleteNode(id);
    }
  }, [handleDeleteNode]);

  const toggleExpanded = useCallback(() => {
    if (data.isFolder) {
      setShowChildNode(prev => !prev);
    }
  }, [data.isFolder]);

  const { id, name, isFolder, items } = data;
  const hasChildren = isFolder && items.length > 0;

  return (
    <div className="file-item-container">
      <div 
        className={`file-item ${isFolder ? 'folder' : 'file'} ${isHovered ? 'hovered' : ''}`}
        onClick={toggleExpanded}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <div className="file-item-content">
          <div className="file-item-icon">
            {isFolder && hasChildren && (
              <span className="expand-icon">
                {showChildNode ? <FaChevronDown /> : <FaChevronRight />}
              </span>
            )}
            <span className="type-icon">
              {isFolder ? 
                (showChildNode ? <FaFolderOpen /> : <FaFolder />) : 
                <FaFileCode />
              }
            </span>
          </div>
          <span className="file-name">{name}</span>
        </div>
        
        {isHovered && (
          <div className="file-actions">
            {isFolder && (
              <>
                <button 
                  className="action-btn" 
                  onClick={(e) => handleAdd(e, true)}
                  title="Add Folder"
                >
                  <FaFolderPlus />
                </button>
                <button 
                  className="action-btn" 
                  onClick={(e) => handleAdd(e, false)}
                  title="Add File"
                >
                  <FaFileCirclePlus />
                </button>
              </>
            )}
            <button 
              className="action-btn edit" 
              onClick={(e) => handleEdit(e, data)}
              title="Rename"
            >
              <MdModeEdit />
            </button>
            <button 
              className="action-btn delete" 
              onClick={(e) => handleDelete(e, id)}
              title="Delete"
            >
              <RiDeleteBin6Fill />
            </button>
          </div>
        )}
      </div>

      {showInput && (
        <div className="input-container" style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}>
          <form onSubmit={(e) => handleSubmit(e, id)} className="input-form">
            <input
              className="file-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={(e) => !inputValue.trim() ? setShowInput(false) : handleSubmit(e, id)}
              placeholder={selectedIsFolder.current ? 'Folder name' : 'File name'}
              autoFocus
            />
          </form>
        </div>
      )}

      {showChildNode && hasChildren && (
        <div className="children-container">
          {items.map(child => (
            <FolderAndFile
              key={child.id}
              data={child}
              handleNewNode={handleNewNode}
              handleDeleteNode={handleDeleteNode}
              handleEditNode={handleEditNode}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
});

FolderAndFile.displayName = 'FolderAndFile';

export default FolderAndFile;
