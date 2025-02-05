export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  birthDate: string;
  profilePicture?: string;
  userType: 'particular' | 'collector';
  createdAt: string;
  updatedAt: string;
}
