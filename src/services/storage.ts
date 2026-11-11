import {
  HotelInfo,
  RoomCategory,
  FacilityItem,
  GalleryItem,
  Reservation,
  ContactEnquiry,
  ReservationStatus,
} from '../types/hotel';
import {
  INITIAL_HOTEL_INFO,
  INITIAL_ROOMS,
  INITIAL_FACILITIES,
  INITIAL_GALLERY,
  INITIAL_RESERVATIONS,
  INITIAL_ENQUIRIES,
} from '../data/initialData';

const KEYS = {
  HOTEL_INFO: 'countryside_hotel_info_v3',
  ROOMS: 'countryside_rooms_v3',
  FACILITIES: 'countryside_facilities_v3',
  GALLERY: 'countryside_gallery_v3',
  RESERVATIONS: 'countryside_reservations_v3',
  ENQUIRIES: 'countryside_enquiries_v3',
  ADMIN_AUTH: 'countryside_admin_auth_v1',
};

const notifyChange = (key: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('countryside_data_updated', { detail: { key } }));
  }
};

export const storage = {
  getHotelInfo(): HotelInfo {
    try {
      const data = localStorage.getItem(KEYS.HOTEL_INFO);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_HOTEL_INFO;
  },

  updateHotelInfo(info: Partial<HotelInfo>): HotelInfo {
    const current = this.getHotelInfo();
    const updated = { ...current, ...info };
    localStorage.setItem(KEYS.HOTEL_INFO, JSON.stringify(updated));
    notifyChange(KEYS.HOTEL_INFO);
    return updated;
  },

  getRooms(): RoomCategory[] {
    try {
      const data = localStorage.getItem(KEYS.ROOMS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_ROOMS;
  },

  saveRooms(rooms: RoomCategory[]) {
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(rooms));
    notifyChange(KEYS.ROOMS);
  },

  updateRoom(id: string, updates: Partial<RoomCategory>): RoomCategory[] {
    const rooms = this.getRooms().map((room) =>
      room.id === id ? { ...room, ...updates } : room
    );
    this.saveRooms(rooms);
    return rooms;
  },

  addRoom(newRoom: Omit<RoomCategory, 'id'>): RoomCategory[] {
    const rooms = this.getRooms();
    const room: RoomCategory = {
      ...newRoom,
      id: `room-${Date.now()}`,
    };
    const updated = [...rooms, room];
    this.saveRooms(updated);
    return updated;
  },

  deleteRoom(id: string): RoomCategory[] {
    const rooms = this.getRooms().filter((r) => r.id !== id);
    this.saveRooms(rooms);
    return rooms;
  },

  getFacilities(): FacilityItem[] {
    try {
      const data = localStorage.getItem(KEYS.FACILITIES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_FACILITIES;
  },

  updateFacility(id: string, updates: Partial<FacilityItem>): FacilityItem[] {
    const facilities = this.getFacilities().map((f) =>
      f.id === id ? { ...f, ...updates } : f
    );
    localStorage.setItem(KEYS.FACILITIES, JSON.stringify(facilities));
    notifyChange(KEYS.FACILITIES);
    return facilities;
  },

  getGallery(): GalleryItem[] {
    try {
      const data = localStorage.getItem(KEYS.GALLERY);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_GALLERY;
  },

  addGalleryItem(item: Omit<GalleryItem, 'id'>): GalleryItem[] {
    const current = this.getGallery();
    const newItem: GalleryItem = { ...item, id: `gal-${Date.now()}` };
    const updated = [newItem, ...current];
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(updated));
    notifyChange(KEYS.GALLERY);
    return updated;
  },

  deleteGalleryItem(id: string): GalleryItem[] {
    const current = this.getGallery().filter((g) => g.id !== id);
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(current));
    notifyChange(KEYS.GALLERY);
    return current;
  },

  getReservations(): Reservation[] {
    try {
      const data = localStorage.getItem(KEYS.RESERVATIONS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_RESERVATIONS;
  },

  createReservation(
    data: Omit<Reservation, 'id' | 'bookingRef' | 'status' | 'createdAt'>
  ): Reservation {
    const reservations = this.getReservations();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newReservation: Reservation = {
      ...data,
      id: `res-${Date.now()}`,
      bookingRef: `CSH-2024-${randomSuffix}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [newReservation, ...reservations];
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(updated));
    notifyChange(KEYS.RESERVATIONS);
    return newReservation;
  },

  updateReservationStatus(id: string, status: ReservationStatus, adminNotes?: string): Reservation[] {
    const reservations = this.getReservations().map((res) => {
      if (res.id === id) {
        return {
          ...res,
          status,
          updatedAt: new Date().toISOString(),
          adminNotes: adminNotes !== undefined ? adminNotes : res.adminNotes,
        };
      }
      return res;
    });
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(reservations));
    notifyChange(KEYS.RESERVATIONS);
    return reservations;
  },

  getEnquiries(): ContactEnquiry[] {
    try {
      const data = localStorage.getItem(KEYS.ENQUIRIES);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return INITIAL_ENQUIRIES;
  },

  createEnquiry(data: Omit<ContactEnquiry, 'id' | 'createdAt' | 'status'>): ContactEnquiry {
    const enquiries = this.getEnquiries();
    const newEnquiry: ContactEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'New',
    };
    const updated = [newEnquiry, ...enquiries];
    localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(updated));
    notifyChange(KEYS.ENQUIRIES);
    return newEnquiry;
  },

  updateEnquiryStatus(id: string, status: 'New' | 'Replied' | 'Archived'): ContactEnquiry[] {
    const enquiries = this.getEnquiries().map((e) =>
      e.id === id ? { ...e, status } : e
    );
    localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(enquiries));
    notifyChange(KEYS.ENQUIRIES);
    return enquiries;
  },

  // Admin authentication state
  isAdminLoggedIn(): boolean {
    try {
      return localStorage.getItem(KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  },

  setAdminLoggedIn(val: boolean) {
    if (val) {
      localStorage.setItem(KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(KEYS.ADMIN_AUTH);
    }
    notifyChange(KEYS.ADMIN_AUTH);
  },

  // Reset to initial demo data
  resetAllData() {
    localStorage.setItem(KEYS.HOTEL_INFO, JSON.stringify(INITIAL_HOTEL_INFO));
    localStorage.setItem(KEYS.ROOMS, JSON.stringify(INITIAL_ROOMS));
    localStorage.setItem(KEYS.FACILITIES, JSON.stringify(INITIAL_FACILITIES));
    localStorage.setItem(KEYS.GALLERY, JSON.stringify(INITIAL_GALLERY));
    localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify(INITIAL_RESERVATIONS));
    localStorage.setItem(KEYS.ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
    notifyChange('all');
  },
};
