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
  useEffect(() => {
    setDocuments([
      {
          "id": 100206276,
          "size": 539569,
          "docdate": "2025-02-28T00:00:00.000000Z",
          "urll": "file:///emrdocs/current/documents/1004596/istockphoto_1403500817_2048x2048.jpg",
          "url": "https://qa-phoenix.drcloudemr.com/api/documents/image?file_path=%2Femrdocs%2Fcurrent%2Fdocuments%2F1004596%2Fistockphoto_1403500817_2048x2048.jpg",
          "status": true
      },
      {
          "id": 100206275,
          "size": 135946,
          "docdate": "2025-02-28T00:00:00.000000Z",
          "urll": "file:///emrdocs/current/documents/1004596/chain.jpg",
          "url": "https://qa-phoenix.drcloudemr.com/api/documents/image?file_path=%2Femrdocs%2Fcurrent%2Fdocuments%2F1004596%2Fchain.jpg",
          "status": true
      },
      {
          "id": 100206258,
          "size": 235339,
          "docdate": "2025-02-21T00:00:00.000000Z",
          "urll": "file:///emrdocs/current/documents/1004596/LabResult_20241225_120700.pdf",
          "url": "https://qa-phoenix.drcloudemr.com/api/documents/image?file_path=%2Femrdocs%2Fcurrent%2Fdocuments%2F1004596%2FLabResult_20241225_120700.pdf",
          "status": true
      }
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

  const filteredDocuments = documents.filter((doc) =>
    doc.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex gap-4 ">
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
          <button className="px-3 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600">
            + New Document
          </button>
          <button className="px-3 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600">
            Upload
          </button>
          <button className="px-3 py-2 text-sm text-white bg-gray-500 rounded hover:bg-gray-600">
            Download
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-4 gap-2 pb-2 text-sm font-semibold sm:grid-cols-6">
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
              className="grid grid-cols-4 gap-2 pb-2 text-sm sm:grid-cols-6"
            >
              <span className="truncate">{decodeURIComponent(doc.url.split("/").pop() || "")}</span>
              <span className="hidden sm:block">Patient Forms</span>
              <span>{new Date(doc.docdate).toLocaleDateString()}</span>
              <span className="hidden sm:block">Patient Portal</span>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  doc.status ? " text-green-800" : "bg-orange-100 text-orange-800"
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
