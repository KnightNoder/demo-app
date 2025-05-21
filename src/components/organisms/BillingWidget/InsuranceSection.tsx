import React from "react";

interface InsuranceCardProps {
  patientId: string | null;
  insuranceData?: {
    deductible_met: number;
    deductible_total: number;
    oop_met: number;
    oop_total: number;
    coinsurance: number;
  };
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ insuranceData }) => {
  // Default values if insuranceData is not provided
  const insurance = insuranceData || {
    deductible_met: 1500,
    deductible_total: 2000,
    oop_met: 3000,
    oop_total: 5000,
    coinsurance: 80,
  };

  // Calculate percentages for progress bars
  const deductiblePercentage = (insurance.deductible_met / insurance.deductible_total) * 100;
  const oopPercentage = (insurance.oop_met / insurance.oop_total) * 100;
  
  return (
    <div className="p-3 grid grid-cols-2 gap-3 mb-4">
      {/* Insurance Status Card */}
      <div className="rounded-lg border bg-white hover:bg-gray-50/50 transition-colors p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-4 h-4 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"></path>
            </svg>
            Insurance Status
          </h4>
          <div className="inline-flex items-center rounded-full py-0.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-gray-500 border border-gray-200 text-xs px-1.5 h-5 hover:bg-blue-50">In Network</div>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-gray-500">Deductible Met</span>
              <div>
                <span className="font-medium text-sm">${insurance.deductible_met.toFixed(2)}</span>
                <span className="text-xs text-gray-400 ml-0.5">/ ${insurance.deductible_total.toFixed(2)}</span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: `${deductiblePercentage}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-xs text-gray-500">Out of Pocket</span>
              <div>
                <span className="font-medium text-sm">${insurance.oop_met.toFixed(2)}</span>
                <span className="text-xs text-gray-400 ml-0.5">/ ${insurance.oop_total.toFixed(2)}</span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: `${oopPercentage}%` }}></div>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <span className="text-xs text-gray-500 block">Coverage Split</span>
              <div className="font-medium text-sm">80% / 20%</div>
            </div>
            <div className="flex -space-x-0.5">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center ring-1 ring-blue-100">
                <span className="text-xs font-medium text-blue-600">80</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center ring-1 ring-gray-100">
                <span className="text-xs font-medium text-gray-500">20</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Insurance Benefits Card */}
      <div className="rounded-lg border bg-white hover:bg-gray-50/50 transition-colors p-4 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-4 h-4 text-gray-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Insurance Benefits
          </h4>
          <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 dark:hover:bg-primary/10 hover:text-foreground rounded-md text-xs h-7 px-2.5 hover:bg-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-3.5 h-3.5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
            </svg>
            View ID Card
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col bg-blue-50/50 rounded-md p-2">
              <span className="text-xs text-gray-500 block">Primary Insurance</span>
              <span className="font-medium text-sm">BEACON</span>
            </div>
            <div className="flex flex-col bg-gray-50/50 rounded-md p-2">
              <span className="text-xs text-gray-500 block">Member ID</span>
              <span className="font-medium text-sm">BEA123456789</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col bg-gray-50/50 rounded-md p-2">
              <span className="text-xs text-gray-500 block">Group Number</span>
              <span className="font-medium text-sm">GRP876543</span>
            </div>
            <div className="flex flex-col bg-green-50/50 rounded-md p-2">
              <span className="text-xs text-gray-500 block">Effective Date</span>
              <span className="font-medium text-sm">Jan 1, 2025</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <span className="text-xs text-gray-500 block">Plan Type</span>
              <div className="font-medium text-sm">PPO Plan</div>
            </div>
            <div className="inline-flex items-center rounded-full bg-green-100 py-0.5 font-medium text-green-700 text-xs px-2 h-5">
              Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCard;