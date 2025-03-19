import React, { useEffect, useState } from "react";

interface Document {
  id: number;
  size: number;
  docdate: string;
  urll: string;
  url: string;
  status: boolean;
}

const DocumentsComponent: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedDocs, setSelectedDocs] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setDocuments([
      {
        id: 100206276,
        size: 539569,
        docdate: "2025-02-28T00:00:00.000000Z",
        urll: "file:///emrdocs/current/documents/1004596/istockphoto_1403500817_2048x2048.jpg",
        url: "https://qa-phoenix.drcloudemr.com/api/documents/image?file_path=%2Femrdocs%2Fcurrent%2Fdocuments%2F1004596%2Fistockphoto_1403500817_2048x2048.jpg",
        status: true,
      },
      {
        id: 100206275,
        size: 135946,
        docdate: "2025-02-28T00:00:00.000000Z",
        urll: "file:///emrdocs/current/documents/1004596/chain.jpg",
        url: "https://qa-phoenix.drcloudemr.com/api/documents/image?file_path=%2Femrdocs%2Fcurrent%2Fdocuments%2F1004596%2Fchain.jpg",
        status: true,
      },
      {
        id: 100206258,
        size: 235339,
        docdate: "2025-02-21T00:00:00.000000Z",
        urll: "file:///emrdocs/current/documents/1004596/LabResult_20241225_120700.pdf",
        url: "https://qa-phoenix.drcloudemr.com/api/documents/image?file_path=%2Femrdocs%2Fcurrent%2Fdocuments%2F1004596%2FLabResult_20241225_120700.pdf",
        status: true,
      },
    ]);
  }, []);

  const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${sizes[i]}`;
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(documents.map((doc) => doc.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectDocument = (id: number) => {
    const newSelection = new Set(selectedDocs);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedDocs(newSelection);
    setSelectAll(newSelection.size === documents.length);
  };

  const handleDownload = () => {
    selectedDocs.forEach((id) => {
      const doc = documents.find((d) => d.id === id);
      if (doc) {
        const link = document.createElement("a");
        link.href = doc.url;
        link.download = decodeURIComponent(doc.url.split("/").pop() || "");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 p-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 w-[150px] text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Documents</option>
            <option value="Insurance">Insurance</option>
            <option value="Patient">Patient Forms</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 hover:brightness-110 dark:hover:brightness-125 h-7 text-xs gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200">
            + New Document
          </button>
          <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 border border-gray-400 text-[#0093D3] bg-white hover:text-accent-foreground h-7 text-xs gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
            Upload
          </button>
          <button
            className={`inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 border border-gray-400 text-[#0093D3] bg-white hover:text-accent-foreground h-7 text-xs gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 ${
              selectedDocs.size > 0
                ? "bg-gray-500 hover:bg-gray-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleDownload}
            disabled={selectedDocs.size === 0}
          >
            Download
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-5 gap-2 pb-2 text-sm font-semibold sm:grid-cols-7">
          <span>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="w-4 h-4"
            />
          </span>
          <span>Document</span>
          <span className="hidden sm:block">Category</span>
          <span>Date</span>
          <span className="hidden sm:block">Uploaded By</span>
          <span>Status</span>
          <span className="hidden sm:block">Size</span>
        </div>
        <div className="mt-3 space-y-3">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="grid items-center grid-cols-5 gap-2 pb-2 text-sm sm:grid-cols-7"
            >
              <input
                type="checkbox"
                checked={selectedDocs.has(doc.id)}
                onChange={() => handleSelectDocument(doc.id)}
                className="w-4 h-4"
              />
              <span className="truncate">
                {decodeURIComponent(doc.url.split("/").pop() || "")}
              </span>
              <span className="hidden sm:block">Patient Forms</span>
              <span>{new Date(doc.docdate).toLocaleDateString()}</span>
              <span className="hidden sm:block">Patient Portal</span>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  doc.status
                    ? "text-green-800"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                {doc.status ? "Approved" : "Pending"}
              </span>
              <span className="hidden sm:block">{formatBytes(doc.size)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsComponent;
