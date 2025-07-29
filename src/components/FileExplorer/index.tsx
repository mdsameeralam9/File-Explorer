import React, { useState, useRef } from 'react';
import './style.css';
import FolderAndFile, { type FileItem, type NewItem } from './FolderAndFile';
import explorer from './data';

const addNewNodeToTree = (newNode: NewItem, nodeTree: FileItem): FileItem => {
    if (newNode.id === nodeTree.id) {
        return {
            ...nodeTree,
            items: [...nodeTree.items, { ...newNode, id: crypto.randomUUID(), items: [] }]
        };
    }

    return {
        ...nodeTree,
        items: nodeTree.items.map(child => addNewNodeToTree(newNode, child))
    };
};

const deleteNodeFromTree = (id: string, nodeTree: FileItem): FileItem | null => {
    if (id === nodeTree.id) return null;

    const updatedItems = nodeTree.items
        .map(child => deleteNodeFromTree(id, child))
        .filter(Boolean) as FileItem[];

    return { ...nodeTree, items: updatedItems };
};

const editNodeFromTree = (newNode: NewItem, nodeTree: FileItem): FileItem => {
    if (newNode.id === nodeTree.id) {
        return { ...nodeTree, name: newNode.name };
    }

    return {
        ...nodeTree,
        items: nodeTree.items.map(child => editNodeFromTree(newNode, child))
    };
};

const FileExplorer: React.FC = () => {
    const [sidebarWidth, setSidebarWidth] = useState<number>(300);
    const [fileData, setFileData] = useState<FileItem>(explorer);
    const isResizing = useRef<boolean>(false);

    const handleMouseDown = () => {
        isResizing.current = true;
        document.body.style.cursor = 'col-resize';
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current) return;
        const newWidth = e.clientX;
        if (newWidth > 100 && newWidth < 600) {
            setSidebarWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.body.style.cursor = 'default';
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleNewNode = (newNode: NewItem) => {
        const newTree = addNewNodeToTree(newNode, fileData);
        setFileData({ ...newTree });
    };

    const handleDeleteNode = (id: string) => {
        const newTree = deleteNodeFromTree(id, fileData);
        if (newTree) setFileData({ ...newTree });
    };

    const handleEditNode = (newNode: NewItem) => {
        const newTree = editNodeFromTree(newNode, fileData);
        setFileData({ ...newTree });
    };

    return (
        <div className="fileExplorerWraps">
            <div className="sidebar" style={{ width: `${sidebarWidth}px` }}>
                <h3>File Explorer</h3>
                <FolderAndFile
                    data={fileData}
                    handleNewNode={handleNewNode}
                    handleDeleteNode={handleDeleteNode}
                    handleEditNode={handleEditNode}
                />
            </div>
            <div
                onMouseDown={handleMouseDown}
                className="resizer"
                style={{ left: `${sidebarWidth - 1}px` }}
            />
            <div className="mainContent">mainContent</div>
        </div>
    );
};

export default FileExplorer;
