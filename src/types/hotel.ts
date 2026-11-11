export type RoomType = 'room' | 'apartment';

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled';

export interface RoomCategory {
  id: string;
  name: string;
  type: RoomType;
  totalUnits: number;
  availableUnits: number;
  pricePerNight: string; // Editable by admin (e.g. "₦35,000 / Night" or editable placeholder)
  priceAmount?: number;
  description: string;
  facilities: string[];
  bedType: string;
  maxGuests: number;
  image: string;
  status: 'Available' | 'Limited' | 'Fully Booked';
}

export interface FacilityItem {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  iconName: string;
  image: string;
  highlight?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Exterior' | 'Rooms' | 'Apartments' | 'Club Room & Snooker' | 'Restaurant' | 'Surroundings';
  image: string;
  caption: string;
}

export interface Reservation {
  id: string;
  bookingRef: string;
  guestName: string;
  phone: string;
  email: string;
  roomId: string;
  roomName: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt?: string;
  adminNotes?: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'New' | 'Replied' | 'Archived';
}

export interface HotelInfo {
  name: string;
  slogan: string;
  address: string;
  street: string;
  landmark: string;
  cityState: string;
  country: string;
  established: string;
  phonePlaceholder: string;
  emailPlaceholder: string;
  whatsappPlaceholder: string;
  tiktokHandle: string;
  tiktokUrl: string;
  totalGuestRooms: number;
  totalApartments: number;
  checkInTime: string;
  checkOutTime: string;
  electricityStatus: string;
  announcement?: string;
}
