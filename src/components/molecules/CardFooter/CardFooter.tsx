import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Button from "../../atoms/Button/Button";
import Icons from "../../../assets/Icons/Icons";
import axiosClient from "../../../api/axiosClient"; // Make sure this path is correct

interface DecodedToken {
  user_id: string;
  // Add other properties as needed
}

interface ACLButton {
  name: string;
  visible: boolean;
}

interface ACLResponse {
  widgets: Array<{
    name: string;
    visible: boolean;
  }>;
  buttons: ACLButton[];
  user_flags: {
    is_strict_auditor: boolean;
  };
}

interface CardFooterProps {
  category?: string | null | undefined;
  patientId?: string | null;
  onAction?: (action: "add" | "view", category: string | null) => void;
  hasWritePermission?: boolean;
  isStrictAuditor?: boolean;
}

const CardFooter: React.FC<CardFooterProps> = ({
  category,
  onAction,
  // hasWritePermission,
  isStrictAuditor,
}) => {
  const [aclData, setAclData] = useState<ACLResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchACLData = async () => {
      try {
        const token = localStorage.getItem("JWT_AUTH_TOKEN");
        if (!token) {
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token) as DecodedToken;
        const userId = decoded.user_id;

        // Fetch ACL matrix from API
        const response = await axiosClient.get(
          `/acl/ui-matrix?user_id=${userId}`
        );

        setAclData(response.data);
      } catch (error) {
        console.error("Error fetching ACL data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchACLData();
  }, []);

  const isAddButtonVisible = (): boolean => {
    if (!category || !aclData || loading) {
      return true; // Default to showing the button if data is not loaded yet
    }

    // Convert category to lowercase for comparison
    const categoryLower = category.toLowerCase();

    // Find the corresponding button permission
    const buttonPermission = aclData.buttons.find((button) => {
      // Remove "add_" prefix from button name for comparison
      const buttonName = button.name.replace(/^add_/, "");
      return categoryLower.includes(buttonName);
    });

    // If no matching button permission found, show the button (default behavior)
    if (!buttonPermission) {
      return true;
    }

    // Return the visibility based on the ACL permission
    return buttonPermission.visible;
  };

  const handleAddClick = () => {
    if (onAction) {
      // This will trigger the parent's handleAddAction which sets isFooterModalOpen
      onAction("add", category ?? null);

      // Dispatch a custom event to notify that a footer modal is open
      const modalOpenEvent = new CustomEvent("modalStateChange", {
        detail: { isOpen: true, modalType: "footer" },
      });
      document.dispatchEvent(modalOpenEvent);
    }
  };

  const shouldShowAddButton = () => {
    // Existing conditions
    if (category === "Billing" || isStrictAuditor) {
      return false;
    }

    // New ACL-based condition
    return isAddButtonVisible();
  };

  return (
    <div role="contentinfo" data-testid="card-content" className="w-full">
      <div className="footer h-14 bg-white/95 backdrop-blur rounded-b-lg">
        <div className="relative h-full">
          <div className="absolute inset-0 flex items-center gap-2 px-4 overflow-x-auto">
            {shouldShowAddButton() && (
              <Button
                variant="primary"
                dataCy="data-primary"
                onClick={handleAddClick}
              >
                <Icons variant="add" />
                Add {category}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardFooter;
