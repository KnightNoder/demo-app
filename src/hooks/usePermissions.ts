import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types';

/**
 * Custom hook to fetch and manage user permissions
 */
export const usePermissions = () => {
  const [insuranceWritePermission, setInsuranceWritePermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsurancePermissions = async () => {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append("sitename", "current");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow" as RequestRedirect,
      };

      const token = localStorage.getItem("JWT_AUTH_TOKEN");
      let username = "";
      
      if (token) {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          username = decoded.username || '';
        } catch (err) {
          console.error("Error decoding JWT token:", err);
          setError("Invalid authentication token");
          setLoading(false);
          return;
        }
      } else {
        console.error("No JWT token found in localStorage");
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://qa-phoenix.drcloudemr.com/api/acl?username=${username}`,
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result, "permissions");

        const hasPermission = result.permissions.some(
          (permission: any) =>
            permission.section === "patients" && permission.object === "insurance"
        );
        
        setInsuranceWritePermission(hasPermission);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setError("Failed to fetch permissions");
        setLoading(false);
      }
    };

    fetchInsurancePermissions();
  }, []);

  return { insuranceWritePermission, loading, error };
};