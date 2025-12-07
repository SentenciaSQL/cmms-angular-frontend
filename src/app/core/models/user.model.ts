export interface User {
  id?: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  roles: string[];
  isActive?: boolean;
}
