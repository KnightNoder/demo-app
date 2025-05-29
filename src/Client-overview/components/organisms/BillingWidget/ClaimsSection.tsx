import React from 'react';

// Updated interface to match BillingWidget's claim structure
interface Claim {
  encounter: number;
  service_date: string;
  billing_id: number | null;
  facility: string;
  provider: string;
  category: string;
  payer_id: number | null;
  claimid: string | null;
  bill_to: string;
  billed_codes: string | null;
  total_fee: string;
  insurance: {
    primary: string;
  };
}

interface BillingData {
  claims?: Claim[];
}

interface ClaimsProps {
  billingData?: BillingData | null;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// Helper function to get status color classes
const getStatusClasses = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'denied':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to determine claim status based on the data available
const determineClaimStatus = (claim: Claim): 'pending' | 'completed' | 'denied' => {
  // This is a simplified logic - adjust according to your business rules
  if (claim.bill_to === "Patient") {
    return 'pending';
  } else if (claim.claimid) {
    return 'completed';
  } else {
    return 'pending';
  }
};

const Claims: React.FC<ClaimsProps> = ({ billingData }) => {
  if (!billingData || !billingData.claims || billingData.claims.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Claims</h3>
        <p className="text-gray-600 text-sm font-light">No claims available</p>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Claims</h3>
      <div className="space-y-4">
        {billingData.claims.map((claim, index) => {
          const status = determineClaimStatus(claim);
          
          return (
            <div key={index} className="rounded-lg border border-gray-200 p-3 space-y-1.5 bg-white">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-gray-600 font-normal text-base">Encounter: {claim.encounter}</h4>
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClasses(status)}`}>
                      {status}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 font-light">{claim.category || 'General Service'}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-3.5 h-3.5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"></path>
                      </svg>
                      <div className="flex gap-1">
                        <span className="text-xs text-gray-600 font-light">Claim ID:</span>
                        <span className="text-xs text-gray-800 font-light">{claim.claimid || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-3.5 h-3.5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"></path>
                      </svg>
                      <div className="flex gap-1">
                        <span className="text-xs text-gray-600 font-light">Service Date:</span>
                        <span className="text-xs text-gray-800 font-light">{formatDate(claim.service_date)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-3.5 h-3.5 text-gray-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                      </svg>
                      <div className="flex gap-1">
                        <span className="text-xs text-gray-600 font-light">Bill to:</span>
                        <span className="text-xs text-gray-800 font-light">{claim.bill_to} - {status === 'completed' ? 'Processed' : status === 'denied' ? 'Denied' : 'In Network'}</span>
                      </div>
                    </div>
                    {status === 'denied' && (
                      <div className="flex items-center gap-1.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-3.5 h-3.5 text-red-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                        </svg>
                        <span className="text-xs text-red-500 font-light">Claim processing denied</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">${claim.total_fee}</span>
                  <span className="text-xs text-gray-600 font-light mt-1">{claim.insurance.primary || 'No Insurance'}</span>
                </div>
              </div>
              
              <div className="flex justify-between mt-3 pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-600 font-light">
                  <div>Facility: {claim.facility || 'N/A'}</div>
                  <div className="mt-2">Provider: {claim.provider || 'N/A'}</div>
                </div>
                <div className="text-xs text-gray-600 text-right font-light">
                  <div>Billing ID: {claim.billing_id || 'N/A'}</div>
                  <div className="mt-2">Billed Codes: {claim.billed_codes || 'N/A'}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Claims;