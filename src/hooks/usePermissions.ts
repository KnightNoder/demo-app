import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types';
import axiosClient from '../api/axiosClient';

/**
 * Custom hook to fetch and manage user permissions
 * @returns {Object} Object containing permission states and loading/error states
 */
export const usePermissions = () => {
  const [insuranceWritePermission, setInsuranceWritePermission] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsurancePermissions = async () => {
      setLoading(true);
      setError(null);

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
        const response = await axiosClient.get(`/acl?username=${username}`);

        const hasPermission = response.data.permissions.some(
          (permission: any) =>
            permission.section === "patients" && permission.object === "insurance"
        );
        
        setInsuranceWritePermission(hasPermission);
      } catch (err) {
        console.error("Error fetching permissions:", err);
        setError("Failed to fetch permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchInsurancePermissions();
  }, []);

  return { insuranceWritePermission, loading, error };
};