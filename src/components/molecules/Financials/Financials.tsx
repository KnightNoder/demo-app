import React from 'react';

interface FinancialsProps {
  deductible: {
    individual: number;
    family: number;
    remaining: number;
  };
  outOfPocket: {
    individual: number;
    family: number;
    remaining: number;
  };
}

const Financials: React.FC<FinancialsProps> = ({ deductible, outOfPocket }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateProgress = (remaining: number, total: number) => {
    return ((total - remaining) / total) * 100;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Deductible Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Deductible</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Individual</p>
            <p className="text-lg font-medium">{formatCurrency(deductible.individual)}</p>
          </div>
          <div>
            <p className="text-gray-600">Family</p>
            <p className="text-lg font-medium">{formatCurrency(deductible.family)}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">Remaining</p>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${calculateProgress(deductible.remaining, deductible.individual)}%` }}
            />
          </div>
          <p className="text-lg font-medium">{formatCurrency(deductible.remaining)}</p>
        </div>
      </div>

      {/* Out of Pocket Maximum Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Out of Pocket Maximum</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Individual</p>
            <p className="text-lg font-medium">{formatCurrency(outOfPocket.individual)}</p>
          </div>
          <div>
            <p className="text-gray-600">Family</p>
            <p className="text-lg font-medium">{formatCurrency(outOfPocket.family)}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-gray-600">Remaining</p>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${calculateProgress(outOfPocket.remaining, outOfPocket.individual)}%` }}
            />
          </div>
          <p className="text-lg font-medium">{formatCurrency(outOfPocket.remaining)}</p>
        </div>
      </div>
    </div>
  );
};

export default Financials;