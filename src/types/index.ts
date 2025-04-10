// GridItem interface for DnD functionality
export interface GridItem {
  id: string;
  order: number;
}

// Modal information interface
export interface ModalInfo {
  isOpen: boolean;
  url: string;
  title: string;
}

// JWT token structure
export interface DecodedToken {
  sub: string;
  username?: string;
  name?: string;
  email?: string;
  exp: number;
  iat: number;
  [key: string]: any; // For other possible claims
}

// Card action handler type
export type CardActionHandler = (action: string, category: string | null) => void;