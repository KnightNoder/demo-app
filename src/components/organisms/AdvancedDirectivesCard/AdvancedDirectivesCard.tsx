import Icons from "../../../assets/Icons/Icons";

interface HealthcareDocument {
  title: string;
  description: string;
  verifiedBy: string;
  lastReviewed: string;
  status: string;
  type: "default" | "alert";
}

export default function HealthcareDocuments() {
  const documents: HealthcareDocument[] = [
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
    <div className="max-w-full mx-auto space-y-4">
      {documents.map((doc, index) => (
        <div
          key={index}
          className={`p-4 border rounded-lg shadow-sm ${
            doc.type === "alert"
              ? "border-red-200 bg-red-50"
              : "border-gray-200 bg-white"
          }`}
        >
          {/* Header - Title and Status */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-normal text-[#020817]">{doc.title}</h2>
            <div className="flex justify-end">
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  doc.type === "alert"
                    ? "bg-red-100 text-red-600"
                    : "text-green-700 bg-green-100"
                }`}
              >
                {doc.status}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="mt-2 text-xs text-gray-600 font-light">
            {doc.description}
          </p>

          {/* Verification Info */}
          <div className="mt-2">
            {/* Verified By */}
            <p className="flex items-center gap-2 text-xs font-light text-gray-500">
              <Icons variant="doctor" />
              <span className="text-[#020817]">
                Verified by: {doc.verifiedBy}
              </span>
            </p>

            {/* Last Reviewed */}
            <p className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <Icons variant="appointment-calender" className="!w-3 !h-3" />
              <span className="text-[#020817] font-extralight">
                Last reviewed: {doc.lastReviewed}
              </span>
            </p>
          </div>

          {/* Document Type Indicator */}
          {doc.type === "alert" && (
            <div className="p-2 mt-3 text-[10px] text-red-500 bg-red-50 rounded-md w-fit">
              <span className="font-extralight">
                Important medical directive
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
