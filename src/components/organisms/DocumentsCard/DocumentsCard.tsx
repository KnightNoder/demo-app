import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ErrorComponent from "../../atoms/States/Error";
import EmptyStateComponent from "../../atoms/States/Empty";

interface Category {
  id: number;
  name: string;
}

interface Document {
  id: number;
  size: number;
  docdate: string;
  url: string;
  status: boolean;
  filename: string;
  mimetype?: string;
  categories?: Category[];
  uploadedBy?: string;
}

interface DocumentsComponentProps {
  patientId: string | null;
  isAnyModalOpen?: boolean;
}

const DocumentsComponent: React.FC<DocumentsComponentProps> = ({
  patientId,
  isAnyModalOpen,
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedDocs, setSelectedDocs] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [expandedDocId, setExpandedDocId] = useState<number | null>(null);

  // Add responsive detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const fetchDocuments = async () => {
    if (!patientId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get(
        `/documents?patient_id=${patientId}`
      );
      const data = response.data;

      // Add uploadedBy to each document if it doesn't exist
      const enhancedData = data?.map((doc: Document) => ({
        ...doc,
        uploadedBy: doc.uploadedBy || "N/A",
      }));

      setDocuments(enhancedData);

      // Extract unique categories from all documents
      const categories = new Set<string>();
      enhancedData.forEach((doc: Document) => {
        if (doc.categories && doc.categories.length > 0) {
          doc.categories.forEach((category) => {
            categories.add(category.name);
          });
        }
      });

      setUniqueCategories(Array.from(categories).sort());
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch documents"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [patientId]);

  const formatBytes = (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(dm)} ${sizes[i]}`;
  };

  const formatCategoryString = (doc: Document): string => {
    if (!doc.categories || doc.categories.length === 0) {
      return "Uncategorized";
    }
    return doc.categories?.map((cat) => cat.name).join(", ");
  };

  const hasCategory = (doc: Document, filterCategory: string): boolean => {
    if (filterCategory === "All") return true;

    if (!doc.categories || doc.categories.length === 0) {
      return filterCategory === "Uncategorized";
    }

    return doc.categories.some((cat) =>
      cat.name.toLowerCase().includes(filterCategory.toLowerCase())
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(documents?.map((doc) => doc.id)));
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

  const toggleDocumentDetails = (id: number) => {
    if (expandedDocId === id) {
      setExpandedDocId(null);
    } else {
      setExpandedDocId(id);
    }
  };

  const handleDownload = async () => {
    if (selectedDocs.size === 0) return;

    const selectedFilePaths = documents
      ?.filter((doc) => selectedDocs.has(doc.id))
      ?.map((doc) => encodeURIComponent(doc.url));

    if (selectedFilePaths.length === 0) return;

    if (selectedFilePaths.length === 1) {
      const doc = documents.find((d) => selectedDocs.has(d.id));
      if (!doc) return;

      try {
        const filePath = doc.url;
        const response = await fetch(`${filePath}&dl=1`);

        if (!response.ok) {
          throw new Error(`Failed to download file: ${doc.filename}`);
        }

        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = doc.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download error:", error);
      }
    } else {
      const requestBody = new URLSearchParams();
      selectedFilePaths.forEach((path) => {
        const filePathUrl = decodeURIComponent(path);
        const params = new URL(filePathUrl).searchParams;
        const filePath = params.get("file_path") ?? ""; // Ensure it's a string

        if (filePath) {
          requestBody.append("file_paths[]", encodeURIComponent(filePath));
        }
      });

      try {
        const response = await axiosClient.post(
          "/download/patient/documents",
          requestBody.toString(),
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            responseType: "blob", // Ensure the response is treated as a binary file
          }
        );

        const blob = new Blob([response.data]);
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "documents.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error: any) {
        console.error("Download error:", error);
      }
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.filename
      ?.toLowerCase()
      ?.includes(searchQuery.toLowerCase());

    // Filter by category
    const matchesCategory = hasCategory(doc, categoryFilter);

    return matchesSearch && matchesCategory;
  });

  const DocumentIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2 flex-shrink-0"
    >
      <path
        d="M9 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V13C1 13.5304 1.21071 14.0391 1.58579 14.4142C1.96086 14.7893 2.46957 15 3 15H13C13.5304 15 14.0391 14.7893 14.4142 14.4142C14.7893 14.0391 15 13.5304 15 13V7M9 1L15 7M9 1V7H15"
        stroke="#718096"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-200"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="#718096"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Mobile card view for documents
  const MobileDocumentList = () => (
    <div className="flex flex-col space-y-3">
      {filteredDocuments?.map((doc) => (
        <div
          key={doc.id}
          className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden"
        >
          <div
            className="flex items-center justify-between p-3 cursor-pointer"
            onClick={() => toggleDocumentDetails(doc.id)}
          >
            <div className="flex items-center flex-1 min-w-0">
              <input
                type="checkbox"
                checked={selectedDocs.has(doc.id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectDocument(doc.id);
                }}
                className="mr-3 h-4 w-4 rounded border border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500"
              />
              <div className="flex items-center flex-1 min-w-0">
                <DocumentIcon />
                <span className="text-sm font-medium text-gray-900 truncate flex-1">
                  {doc.filename}
                </span>
              </div>
            </div>
            <div
              className={`transition-transform duration-200 ${expandedDocId === doc.id ? "rotate-180" : ""}`}
            >
              <ChevronDownIcon />
            </div>
          </div>

          {expandedDocId === doc.id && (
            <div className="px-3 pb-3 pt-1 border-t border-gray-100 text-xs text-gray-600">
              <div className="grid grid-cols-2 gap-y-2">
                <div>
                  <span className="font-medium">Category:</span>
                </div>
                <div>{formatCategoryString(doc)}</div>

                <div>
                  <span className="font-medium">Date:</span>
                </div>
                <div>{new Date(doc.docdate).toISOString().split("T")[0]}</div>

                <div>
                  <span className="font-medium">Uploaded By:</span>
                </div>
                <div>{doc.uploadedBy}</div>

                <div>
                  <span className="font-medium">Status:</span>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-normal ${
                      doc.status
                        ? "text-green-600 bg-green-50"
                        : "text-yellow-600 bg-yellow-50"
                    }`}
                  >
                    {doc.status ? "Approved" : "Pending"}
                  </span>
                </div>

                <div>
                  <span className="font-medium">Size:</span>
                </div>
                <div>{formatBytes(doc.size)}</div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 mx-auto bg-white rounded-lg">
        <div className="flex mb-4 gap-1.5 justify-between">
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
          <Skeleton height={40} width={220} />
        </div>

        <div className="mt-4">
          <Skeleton height={120} style={{ marginTop: "10px" }} />
          <Skeleton height={120} style={{ marginTop: "10px" }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorComponent
        title="Unable to Load Documents"
        message={
          typeof error === "string"
            ? error
            : "An unexpected error occurred while fetching data."
        }
        icon="error"
        onRetry={fetchDocuments}
      />
    );
  }

  if (!Array.isArray(documents)) {
    return (
      <ErrorComponent
        title="Data Format Error"
        message="Expected an array of documents but received a different format."
        icon="warning"
        onRetry={fetchDocuments}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Responsive search and filters */}
      <div
        className={`${isMobile ? "space-y-3" : "flex flex-wrap items-center justify-between gap-2"} mb-4`}
      >
        <div
          className={`${isMobile ? "space-y-3" : "flex items-center gap-4"}`}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 14L10 10M11.3333 6.66667C11.3333 9.244 9.244 11.3333 6.66667 11.3333C4.08934 11.3333 2 9.244 2 6.66667C2 4.08934 4.08934 2 6.66667 2C9.244 2 11.3333 4.08934 11.3333 6.66667Z"
                  stroke="#718096"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="searchDocuments"
              name="searchDocuments"
              className={`p-2 pl-10 text-xs border border-gray-300 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isMobile ? "w-full" : "w-64"}`}
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 4H15M1 8H15M1 12H15"
                  stroke="#0093D3"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              id="categoryFilter"
              name="categoryFilter"
              className={`pl-10 p-2 text-xs bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none ${isMobile ? "w-full" : "w-[180px]"}`}
            >
              <option value="All" className="font-medium text-blue-500">
                All Documents
              </option>
              {uniqueCategories?.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="Uncategorized">Uncategorized</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="#718096"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className={`${isMobile ? "flex space-x-2" : "flex gap-2"}`}>
          <button
            id="newDocument-btn"
            className={`inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#0093D3]/50 focus-visible:ring-offset-2 hover:brightness-110 dark:hover:brightness-125 h-8 text-xs gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 ${isMobile ? "flex-1" : ""}`}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path
                d="M6 2.5V9.5M2.5 6H9.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isMobile ? "New" : "New Document"}
          </button>
          <button
            id="upload-btn"
            className={`inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#0093D3]/50 focus-visible:ring-offset-2 border border-[#0093D3] text-[#0093D3] bg-white hover:text-accent-foreground h-8 text-xs gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 ${isMobile ? "flex-1" : ""}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              data-slot="icon"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m6.75 12-3-3m0 0-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
              ></path>
            </svg>
            Upload
          </button>
          <button
            className={`inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#0093D3]/50 focus-visible:ring-offset-2 border border-gray-300 text-[#0093D3] bg-white h-8 text-xs gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 ${
              selectedDocs.size === 0 ? "opacity-50 cursor-not-allowed" : ""
            } ${isMobile ? "flex-1" : ""}`}
            id="download-btn"
            onClick={handleDownload}
            disabled={selectedDocs.size === 0}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path
                d="M10.5 7.5V9.5C10.5 9.76522 10.3946 10.0196 10.2071 10.2071C10.0196 10.3946 9.76522 10.5 9.5 10.5H2.5C2.23478 10.5 1.98043 10.3946 1.79289 10.2071C1.60536 10.0196 1.5 9.76522 1.5 9.5V7.5M3.5 5L6 7.5M6 7.5L8.5 5M6 7.5V1.5"
                stroke="#0093D3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {isMobile ? "Download" : "Download"}
          </button>
        </div>
      </div>

      {filteredDocuments.length === 0 && !loading && !error && (
        <EmptyStateComponent
          title="No Documents Found"
          message={
            searchQuery || categoryFilter !== "All"
              ? "No documents match your search criteria."
              : "No documents are available for this patient."
          }
          isAnyModalOpen={isAnyModalOpen}
        />
      )}

      {!loading && !error && filteredDocuments.length > 0 && (
        <>
          {/* Desktop view with table */}
          {!isMobile && (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 sticky top-0 z-10">
                  <tr className="transition-colors hover:bg-muted/50 bg-gray-50 dark:bg-gray-800">
                    <th className="h-7 pr-2 text-[11px] font-normal text-gray-600 tracking-wide uppercase align-middle whitespace-nowrap w-[40px] pl-4">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          id="selectAllDocs"
                          name="selectAllDocs"
                          className="peer h-4 w-4 shrink-0 rounded border border-gray-300 dark:border-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-400 dark:data-[state=checked]:border-blue-400"
                        />
                      </div>
                    </th>
                    <th className="h-7 pl-1 pr-2 text-[11px] text-gray-600 tracking-wide uppercase align-middle whitespace-nowrap font-normal text-left">
                      Document Name
                    </th>
                    <th className="h-7 pl-1 pr-2 text-[11px] text-gray-600 tracking-wide uppercase align-middle whitespace-nowrap font-normal text-left">
                      Category
                    </th>
                    <th className="h-7 pl-1 pr-2 text-[11px] text-gray-600 tracking-wide uppercase align-middle whitespace-nowrap font-normal text-left">
                      Date Uploaded
                    </th>
                    <th className="h-7 pl-1 pr-2 text-[11px] text-gray-600 tracking-wide uppercase align-middle whitespace-nowrap font-normal text-left">
                      Uploaded By
                    </th>
                    <th className="h-7 pl-1 pr-2 text-[11px] text-gray-600 tracking-wide uppercase align-middle whitespace-nowrap font-normal text-left">
                      Status
                    </th>
                    <th className="h-7 pl-1 pr-2 text-[11px] text-gray-600 tracking-wide uppercase align-middle whitespace-nowrap font-normal text-left">
                      Size
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0 [&_tr:nth-child(even)]:bg-muted/30">
                  {filteredDocuments?.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                    >
                      <td className="pr-2 align-middle text-xs w-[40px] pl-4 py-4">
                        <div className="flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={selectedDocs.has(doc.id)}
                            onChange={() => handleSelectDocument(doc.id)}
                            id={`select-doc-${doc.id}`}
                            name={`select-doc-${doc.id}`}
                            className="peer h-4 w-4 shrink-0 rounded border border-gray-300 dark:border-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 dark:data-[state=checked]:bg-blue-400 dark:data-[state=checked]:border-blue-400"
                          />
                        </div>
                      </td>
                      <td className="pl-1 pr-2 align-middle text-xs font-normal py-4">
                        <div className="flex items-center gap-3">
                          <DocumentIcon />
                          <span className="text-xs font-normal text-[#020817]">
                            {doc?.filename}
                          </span>
                        </div>
                      </td>
                      <td className="pl-1 pr-2 align-middle text-xs text-gray-600 py-4">
                        {formatCategoryString(doc)}
                      </td>
                      <td className="pl-1 pr-2 align-middle text-xs text-gray-600 py-4">
                        {new Date(doc.docdate).toISOString().split("T")[0]}
                      </td>
                      <td className="pl-1 pr-2 align-middle text-xs text-gray-600 py-4">
                        {doc.uploadedBy || "N/A"}
                      </td>
                      <td className="pl-1 pr-2 align-middle text-xs py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-normal ${
                            doc.status
                              ? "text-green-600 bg-green-50"
                              : "text-yellow-600 bg-yellow-50"
                          }`}
                        >
                          {doc.status ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="pl-1 pr-2 align-middle text-xs text-gray-600 py-4">
                        {formatBytes(doc.size)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile view with cards */}
          {isMobile && <MobileDocumentList />}
        </>
      )}
    </div>
  );
};

export default DocumentsComponent;