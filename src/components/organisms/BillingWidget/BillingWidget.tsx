import React, { useState, useEffect } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import axiosClient from "../../../api/axiosClient"; // Make sure this path is correct
import TabListHeader from "../../molecules/TabListHeader/TabListHeader";
import TransactionsSection from "./TransactionsSection";
import CreditCardSection from "./CreditCardSection";
import PriorAuthorizations from "./PriorAuthorizationSection";
import Claims from "./ClaimsSection";
import Statements from "./StatementsSection";
import InsuranceCard from "../InsuranceCard/InsuranceCard";

// Define types for our API response data
interface Insurance {
  deductible_met: number;
  deductible_total: number;
  oop_met: number;
  oop_total: number;
  coinsurance: number;
}

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

interface Payment {
  status: string;
  reference: string;
  amount: number;
  payment_date: string;
  payment_method: string;
}

interface Service {
  code: string;
  available_units: number;
}

interface PriorAuthorization {
  authorization_number: string;
  from_date: string;
  to_date: string;
  facilities: string;
  insurance_company: string;
  num_of_sessions: number;
  authorized_amount: number;
  services: Service[];
}

interface PatientCard {
  label: string;
  expiry: string;
  type: string;
}

interface BillingData {
  balance_due: string;
  last_payment: string;
  insurance: Insurance;
  claims: Claim[];
  statements: Statement[];
  payments: Payment[];
  priorauthorizations: PriorAuthorization[];
  patientcards: PatientCard[];
}

interface BillingWidgetProps {
  patientId: string | null;
  isAnyModalOpen?: boolean;
}

const BillingWidget: React.FC<BillingWidgetProps> = ({patientId}) => {
  const [activeTab, setActiveTab] = useState("Transactions");
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBillingData = async () => {
      if (!patientId) {
        setLoading(false);
        setError("No patient ID provided");
        return;
      }

      try {
        setLoading(true);
        const response = await axiosClient.get(`/patients/${patientId}/dashboard`);
        setBillingData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching billing data:', err);
        setError("Failed to load billing data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, [patientId]);

  // Format date to display in a cleaner format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Update tabs with counts from the data
  const getTabs = () => {
  if (!billingData) return [];

  const tabs = [];

  tabs.push({ label: "Transactions" });

  
  if ('claims' in billingData) {
    tabs.push({ label: "Claims" });
  }
  
  if ('statements' in billingData) {
    tabs.push({ label: "Statements" });
  }
  
  if ('insurance' in billingData) {
    tabs.push({ label: "Insurance"}); // Hardcoded count
  }

  if ('payments' in billingData) {
    tabs.push({ label: "Payment Receipts" });
  }

  if ('priorauthorizations' in billingData) {
    tabs.push({ label: "Prior Authorization" });
  }

  if ('patientcards' in billingData) {
    tabs.push({ label: "Credit Cards"});
  }

  return tabs;
};


  // Render transaction list
  const renderTransactions = (billingData: BillingData) => {
    return <TransactionsSection billingData={billingData} />
  };

  // Render claims list
  const renderClaims = () => {
    return <Claims billingData={billingData || undefined}/>
  };

  // Render statements list
  const renderStatements = () => {
    return <Statements billingData={billingData}/>
  };

  // Render insurance details
  const renderInsurance = () => {
    return <InsuranceCard patientId={patientId}/>
  };

  // Render payment receipts
  const renderPaymentReceipts = () => {
  if (!billingData) return null;
  
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Receipts</h3>
      
      {billingData.payments.map((payment, index) => (
        <div key={index} className="border border-gray-200 rounded-md p-4 mb-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-medium text-gray-700">Payment Receipt #{payment.reference}</h4>
            <span className="text-lg font-semibold text-gray-900">${payment.amount}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
            <div>
              <span className="font-medium">Date:</span> {formatDate(payment.payment_date)}
            </div>
            <div>
              <span className="font-medium">Method:</span> {payment.payment_method}
            </div>
            <div>
              <span className="font-medium">Status:</span> {payment.status}
            </div>
          </div>
          
          <button 
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Download Receipt
          </button>
        </div>
      ))}
    </div>
  );
};

  // Render prior authorizations
  const renderPriorAuthorizations = () => {
   return <PriorAuthorizations billingData={billingData || undefined}/>
  };

  // Render credit cards
  const renderCreditCards = () => {
    if (!billingData) return null;
    return <CreditCardSection billingData={billingData} />
  };

  // Render the active tab content
  const renderTabContent = () => {
    if (loading) {
      return <div className="p-4">Loading...</div>;
    }

    if (error) {
      return <div className="p-4 text-red-500">{error}</div>;
    }

    if (!billingData) {
      return <div className="p-4">No billing data available</div>;
    }

    switch (activeTab) {
      case "Transactions":
        return renderTransactions(billingData);
      case "Claims":
        return renderClaims();
      case "Statements":
        return renderStatements();
      case "Insurance":
        return renderInsurance();
      case "Payment Receipts":
        return renderPaymentReceipts();
      case "Prior Authorization":
        return renderPriorAuthorizations();
      case "Credit Cards":
        return renderCreditCards();
      default:
        return <div className="p-4">Select a tab to view billing information</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <TabListHeader
        tabs={getTabs()}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <div className="mt-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BillingWidget;