import { useCallback, useMemo } from 'react';

interface NewItem {
  id: string;
  name: string;
  isFolder: boolean;
}

interface FileItem {
  id: string;
  name: string;
  isFolder: boolean;
  items: FileItem[];
}


export const useTreeOperations = (fileData: FileItem) => {
  const addNewNodeToTree = useCallback((newNode: NewItem, nodeTree: FileItem): FileItem => {
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
  }, []);

  const deleteNodeFromTree = useCallback((id: string, nodeTree: FileItem): FileItem | null => {
    if (id === nodeTree.id) return null;

    const updatedItems = nodeTree.items
      .map(child => deleteNodeFromTree(id, child))
      .filter(Boolean) as FileItem[];

    return { ...nodeTree, items: updatedItems };
  }, []);

  const editNodeFromTree = useCallback((newNode: NewItem, nodeTree: FileItem): FileItem => {
    if (newNode.id === nodeTree.id) {
      return { ...nodeTree, name: newNode.name };
    }

    return {
      ...nodeTree,
      items: nodeTree.items.map(child => editNodeFromTree(newNode, child))
    };
  }, []);

  const filterTree = useCallback((node: FileItem, searchTerm: string): FileItem | null => {
    if (!searchTerm) return node;
    
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase());
    const filteredItems = node.items
      .map(child => filterTree(child, searchTerm))
      .filter(Boolean) as FileItem[];
    
    if (matchesSearch || filteredItems.length > 0) {
      return { ...node, items: filteredItems };
    }
    
    return null;
  }, []);

  return useMemo(() => ({
    addNewNodeToTree,
    deleteNodeFromTree,
    editNodeFromTree,
    filterTree
  }), [addNewNodeToTree, deleteNodeFromTree, editNodeFromTree, filterTree]);
};