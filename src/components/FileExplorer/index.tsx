import React, { useState, useRef, useCallback, useMemo } from 'react';
import './style.css';
import FolderAndFile from './FolderAndFile';
import explorer from './data';
import { useTreeOperations } from './hooks';
import { FaFolder, FaSearch } from 'react-icons/fa';
import type { FileItem, NewItem } from './types';

const FileExplorer: React.FC = () => {
    const [sidebarWidth, setSidebarWidth] = useState<number>(300);
    const [fileData, setFileData] = useState<FileItem>(explorer);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const isResizing = useRef<boolean>(false);
    
    const { addNewNodeToTree, deleteNodeFromTree, editNodeFromTree, filterTree } = useTreeOperations(fileData);

    const filteredData = useMemo(() => {
        return filterTree(fileData, searchTerm) || fileData;
    }, [fileData, searchTerm, filterTree]);

    const handleMouseDown = useCallback(() => {
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing.current) return;
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 600) {
            setSidebarWidth(newWidth);
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    const handleNewNode = useCallback((newNode: NewItem) => {
        const newTree = addNewNodeToTree(newNode, fileData);
        setFileData(newTree);
    }, [fileData]);

    const handleDeleteNode = useCallback((id: string) => {
        const newTree = deleteNodeFromTree(id, fileData);
        if (newTree) setFileData(newTree);
    }, [fileData]);

    const handleEditNode = useCallback((newNode: NewItem) => {
        const newTree = editNodeFromTree(newNode, fileData);
        setFileData(newTree);
    }, [fileData]);

    return (
        <div className="file-explorer">
            <div className="sidebar" style={{ width: `${sidebarWidth}px` }}>
                <div className="sidebar-header">
                    <div className="header-title">
                        <FaFolder className="header-icon" />
                        <h3>Explorer</h3>
                    </div>
                    <div className="search-container">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
                <div className="file-tree">
                    <FolderAndFile
                        data={filteredData}
                        handleNewNode={handleNewNode}
                        handleDeleteNode={handleDeleteNode}
                        handleEditNode={handleEditNode}
                    />
                </div>
            </div>
            <div
                onMouseDown={handleMouseDown}
                className="resizer"
                style={{ left: `${sidebarWidth}px` }}
            />
            <div className="main-content">
                <div className="content-placeholder">
                    <h2>Welcome to File Explorer</h2>
                    <p>Select a file from the sidebar to view its contents</p>
                </div>
            </div>
        </div>
    );
};

export default FileExplorer;
