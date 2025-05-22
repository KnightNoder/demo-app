import React from 'react';

// Use the type definitions directly from BillingWidget
interface Statement {
  statement_id: string;
  category: string;
  date: string;
  charges: number;
  adjustments: number;
  insurance_payments: number;
  patient_portion: number;
  remaining_balance: number;
  status: string;
}

interface BillingData {
  statements: Statement[];
  // Other fields from BillingData omitted for brevity
}

interface StatementsProps {
  billingData?: BillingData | null;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const getStatusClasses = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-700';
    case 'partial':
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'unpaid':
    case 'denied':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const Statements: React.FC<StatementsProps> = ({ billingData }) => {
  if (!billingData) return null;
  
  // Generate a due date for each statement (30 days after the statement date)
  const getDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 30);
    return date.toISOString();
  };
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Billing Statements</h3>
        <div className="flex gap-2">
          {/* <button className="inline-flex items-center justify-center whitespace-nowrap font-medium transform-gpu transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#00A0C9]/50 focus-visible:ring-offset-2 border border-[#00A0C9] text-[#00A0C9] bg-white hover:bg-accent hover:text-accent-foreground h-7 rounded-md px-3 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"></path>
            </svg>
            Download Latest
          </button> */}
        </div>
      </div>

      {billingData.statements.map((statement, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg overflow-hidden bg-white"
        >
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center">
                <h4 className="text-gray-600 font-normal text-base">
                  Statement {statement.statement_id}
                </h4>
                <span
                  className={`ml-2 px-2 py-0.5 text-xs ${getStatusClasses(statement.status)} rounded-full`}
                >
                  {statement.status}
                </span>
              </div>
              <div className="text-xs text-gray-600 font-light">
                Due Date: {formatDate(getDueDate(statement.date))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600 font-light">
                Remaining Balance
              </div>
              <div
                className={`text-xs font-light ${statement.remaining_balance === 0 ? "text-green-700" : "text-red-700"}`}
              >
                ${statement.remaining_balance.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="divide-y">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 font-light">
                  {statement.category}
                </span>
                <span className="text-xs text-gray-600 font-light">
                  {formatDate(statement.date)}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-gray-600 font-light">
                    Charges
                  </div>
                  <div className="text-xs text-gray-800 font-light">
                    ${statement.charges.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 font-light">
                    Adjustments
                  </div>
                  <div className="text-xs text-blue-600 font-light">
                    ${statement.adjustments.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 font-light">
                    Insurance
                  </div>
                  <div className="text-xs text-green-700 font-light">
                    ${statement.insurance_payments.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 font-light">
                    Patient Portion
                  </div>
                  <div className="text-xs text-red-700 font-light">
                    ${statement.patient_portion.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statements;