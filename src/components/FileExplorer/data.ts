import type { FileItem } from "./types";


const explorer: FileItem = {
  id: "1",
  name: "root",
  isFolder: true,
  items: [
    {
      id: "2",
      name: "public",
      isFolder: true,
      items: [
        {
          id: "3",
          name: "components",
          isFolder: true,
          items: [
            {
              id: "4",
              name: "index.html",
              isFolder: false,
              items: []
            },
            {
              id: "5",
              name: "favicon.ico",
              isFolder: false,
              items: []
            }
          ]
        },
        {
          id: "6",
          name: "manifest.json",
          isFolder: false,
          items: []
        }
      ]
    },
    {
      id: "7",
      name: "src",
      isFolder: true,
      items: [
        {
          id: "8",
          name: "App.tsx",
          isFolder: false,
          items: []
        },
        {
          id: "9",
          name: "main.tsx",
          isFolder: false,
          items: []
        },
        {
          id: "10",
          name: "index.css",
          isFolder: false,
          items: []
        }
      ]
    },
    {
      id: "11",
      name: "package.json",
      isFolder: false,
      items: []
    },
    {
      id: "12",
      name: "tsconfig.json",
      isFolder: false,
      items: []
    }
  ]
};

export default explorer;