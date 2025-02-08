export interface CollectionRequest {
  id?: number;
  wasteType: ('plastique' | 'verre' | 'papier' | 'metal')[];
  photos?: string[];
  estimatedWeight: number;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  preferredDate: Date;
  preferredTimeSlot: string;
  additionalNotes?: string;
  status: 'pending' | 'occupied' | 'in_progress' | 'validated' | 'rejected';
}
