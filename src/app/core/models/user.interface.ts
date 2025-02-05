export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  phone: string;
  birthDate: string;
  profilePicture?: string;
  userType: 'particular' | 'collector';
  createdAt: string;
}
