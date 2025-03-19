export default function HealthcareDocuments() {
  const documents = [
    {
      title: "Living Will",
      description: "Patient's wishes regarding life-sustaining treatment",
      verifiedBy: "Dr. Smith",
      lastReviewed: "03/15/2025",
      status: "Active",
      type: "default",
    },
    {
      title: "Healthcare POA",
      description: "Durable Power of Attorney for Healthcare Decisions",
      verifiedBy: "Dr. Johnson",
      lastReviewed: "03/10/2025",
      status: "Active",
      type: "default",
    },
    {
      title: "DNR Order",
      description: "Do Not Resuscitate Order",
      verifiedBy: "Dr. Wilson",
      lastReviewed: "03/20/2025",
      status: "Active",
      type: "alert",
    },
  ];

  return (
    <div className="max-w-full px-12 mx-auto space-y-4">
      {documents.map((doc, index) => (
        <div
          key={index}
          className={`p-4 border rounded-lg shadow-sm ${
            doc.type === "alert"
              ? "border-red-300 bg-red-50 text-red-600"
              : "border-gray-300 bg-white text-gray-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{doc.title}</h3>
            <span
              className={`px-2 py-1 text-sm rounded-md ${
                doc.type === "alert"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {doc.status}
            </span>
          </div>
          <p className="text-sm text-gray-600">{doc.description}</p>
          <p className="mt-2 text-xs text-gray-500">
            Verified by: {doc.verifiedBy}
          </p>
          <p className="text-xs text-gray-500">Last reviewed: {doc.lastReviewed}</p>
        </div>
      ))}
    </div>
  );
}
