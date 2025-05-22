import React from 'react';

interface Service {
  code: string;
  available_units: number;
}

interface Authorization {
  authorization_number: string;
  authorized_amount: number;
  from_date: string;
  to_date: string;
  insurance_company: string;
  num_of_sessions: number;
  facilities: string;
  services: Service[];
  status?: string; // Added status field
}

interface BillingData {
  priorauthorizations: Authorization[];
}

interface PriorAuthorizationsProps {
  billingData?: BillingData;
}

const formatDate = (dateString: string): string => {
  // You may want to implement your own date formatting logic here
  // or import a library like date-fns
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const PriorAuthorizations: React.FC<PriorAuthorizationsProps> = ({ billingData }) => {
  if (!billingData) return null;
  
  return (
    <div className="min-w-full display-table">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-normal">Prior Authorizations</h3>
          {/* <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#00A0C9]/50 focus-visible:ring-offset-2 border border-[#00A0C9] text-[#00A0C9] bg-white hover:bg-accent hover:text-accent-foreground h-7 rounded-md px-3 text-xs gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"></path>
            </svg>
            New Request
          </button> */}
        </div>

        <div className="space-y-4">
          {billingData.priorauthorizations.map((auth, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-normal">
                      Auth #{auth.authorization_number}
                    </h4>
                    {auth.status && (
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-gray-200 ${
                          auth.status.toLowerCase() === "denied"
                            ? "bg-orange-100 text-gray-700"
                            : auth.status.toLowerCase() === "approved"
                              ? "bg-green-100 text-gray-700"
                              : "bg-blue-100 text-gray-700"
                        }`}
                      >
                        {auth.status}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-[#020817]">
                    {auth.services.map((service) => service.code).join(", ")}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-[#020817] mb-1 font-normal">
                      Service Date
                    </div>
                    <div className="font-light">
                      {formatDate(auth.from_date)} - {formatDate(auth.to_date)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[#020817] mb-1 font-normal">
                      Insurance
                    </div>
                    <div className="font-light">{auth.insurance_company}</div>
                  </div>

                  {/* <div>
                    <div className="text-[#020817] mb-1 font-normal">Sessions</div>
                    <div className="font-light">{auth.num_of_sessions}</div>
                  </div> */}

                  {/* <div>
                    <div className="text-[#020817] mb-1 font-normal">Facilities</div>
                    <div className="font-light">{auth.facilities}</div>
                  </div> */}

                  {/* <div>
                    <div className="text-primary flex items-center gap-1 font-normal">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                      </svg>
                      Prior Authorization Required
                    </div>
                  </div> */}

                  {auth.services.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-[#020817] mb-1 font-normal">
                        Appeal Status
                      </div>
                      {/* {auth.services.map((service, i) => (
                        <div key={i} className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-light transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-gray-700 border border-gray-200 hover:bg-gray-50 mt-1 mr-2">
                          {service.code} - {service.available_units} units
                        </div>
                      ))} */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriorAuthorizations;