import React from 'react';

interface CreditCardSectionProps {
  billingData: {
    patientcards: Array<{
      label: string;
      expiry: string;
      type: string;
      isDefault?: boolean;
      lastUsed?: string;
    }>;
  };
}

const CreditCardSection: React.FC<CreditCardSectionProps> = ({ billingData }) => {
  if (!billingData) return null;
  
  return (
    <div className="min-w-full display-table">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-normal">Credit Cards on File</h3>
          <button className="inline-flex items-center justify-center whitespace-nowrap font-normal transform-gpu transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[#00A0C9]/50 focus-visible:ring-offset-2 border border-[#00A0C9] text-primary bg-white hover:bg-accent hover:text-accent-foreground h-7 rounded-md px-3 text-xs gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"></path>
            </svg>
            Add New Card
          </button>
        </div>
        
        <div className="grid gap-4">
          {billingData.patientcards.map((card, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"></path>
                  </svg>
                  <div>
                    <div className="font-normal">{card.label}</div>
                    <div className="text-sm text-[#020817]">{card.expiry}</div>
                  </div>
                </div>
                
                {card.isDefault && (
                  <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-gray-200 bg-green-100 text-gray-700">
                    Default
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="text-[#020817]">
                    {card.lastUsed ? `Last used on ${card.lastUsed}` : 'No recent usage'}
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center justify-center whitespace-nowrap font-normal transform-gpu transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-foreground h-7 rounded-md px-3 text-xs">
                      Edit
                    </button>
                    <button className="inline-flex items-center justify-center whitespace-nowrap font-normal transform-gpu transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 hover:bg-primary/5 dark:hover:bg-primary/10 hover:text-foreground h-7 rounded-md px-3 text-xs text-red-500">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreditCardSection;