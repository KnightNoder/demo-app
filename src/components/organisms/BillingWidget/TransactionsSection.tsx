import React from "react";

interface InsuranceCardProps {
  billingData?: {
    balance_due: string;
    last_payment: string;
    insurance: {
      deductible_met: number;
      deductible_total: number;
      oop_met: number;
      oop_total: number;
      coinsurance: number;
    };
  };
}

const InsuranceCard: React.FC<InsuranceCardProps> = ({ billingData }) => {
  // Default values if billingData is not provided
  const data = billingData || {
    balance_due: "350.00",
    last_payment: "75.00",
    insurance: {
      deductible_met: 1500,
      deductible_total: 2000,
      oop_met: 3000,
      oop_total: 5000,
      coinsurance: 80
    }
  };

  // Calculate percentages for progress bars
  const deductiblePercentage = (data.insurance.deductible_met / data.insurance.deductible_total) * 100;
  const oopPercentage = (data.insurance.oop_met / data.insurance.oop_total) * 100;
  
  return (
    // Changed from grid-cols-2 to responsive grid
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Account Summary Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-500 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"></path>
            </svg>
            <span className="text-black font-normal text-base">Account Summary</span>
          </div>
          <button className="flex items-center text-xs bg-white font-light px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-50 w-full sm:w-auto justify-center sm:justify-start">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"></path>
            </svg>
            Pay Now
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600 font-light">Current Balance</span>
            <span className="text-gray-800 text-sm font-light">${data.balance_due}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <div className="flex justify-between">
            <div>
              <span className="text-xs text-gray-600 font-light block">Past Due</span>
              <span className="text-gray-800 text-xs font-light">$150.00</span>
            </div>
            <div className="text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
              </svg>
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <span className="text-xs text-gray-600 font-light block">Last Payment</span>
              <span className="text-gray-800 text-xs font-light">${data.last_payment}</span>
            </div>
            <div className="text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Insurance Status Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 text-gray-500 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"></path>
            </svg>
            <span className="text-black font-normal text-base">Insurance Status</span>
          </div>
          <div className="text-xs text-gray-600 font-light">In Network</div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1 gap-1">
              <span className="text-xs text-gray-600 font-light">Deductible Met</span>
              <div>
                <span className="text-gray-800 text-xs font-light">${data.insurance.deductible_met.toLocaleString()}</span>
                <span className="text-xs text-gray-600 font-light">/ ${data.insurance.deductible_total.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: `${deductiblePercentage}%` }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1 gap-1">
              <span className="text-xs text-gray-600 font-light">Out of Pocket</span>
              <div>
                <span className="text-gray-800 text-xs font-light">${data.insurance.oop_met.toLocaleString()}</span>
                <span className="text-xs text-gray-600 font-light">/ ${data.insurance.oop_total.toLocaleString()}</span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${oopPercentage}%` }}></div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 gap-2">
            <div>
              <span className="text-xs text-gray-600 font-light block">Coverage Split</span>
              <span className="text-gray-800 text-xs font-light">{data.insurance.coinsurance}% / {100 - data.insurance.coinsurance}%</span>
            </div>
            <div className="flex -space-x-1">
              <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                <span className="text-xs font-light text-blue-600">{data.insurance.coinsurance}</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                <span className="text-xs font-light text-gray-500">{100 - data.insurance.coinsurance}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceCard;