import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  LogOut,
  BedDouble,
  Home,
  CalendarCheck,
  Clock,
  CheckCircle2,
  Users,
  Settings,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  Edit2,
  Trash2,
  Plus,
  Save,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  AlertCircle,
  Check,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import {
  HotelInfo,
  RoomCategory,
  FacilityItem,
  GalleryItem,
  Reservation,
  ContactEnquiry,
  ReservationStatus,
} from '../types/hotel';
import { storage } from '../services/storage';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  hotelInfo: HotelInfo;
  rooms: RoomCategory[];
  facilities: FacilityItem[];
  gallery: GalleryItem[];
  reservations: Reservation[];
  enquiries: ContactEnquiry[];
  onDataRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  hotelInfo,
  rooms,
  facilities,
  gallery,
  reservations,
  enquiries,
  onDataRefresh,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(storage.isAdminLoggedIn());
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active tab in dashboard
  const [activeTab, setActiveTab] = useState<
    'overview' | 'reservations' | 'rooms' | 'facilities' | 'gallery' | 'enquiries' | 'settings'
  >('overview');

  // Reservation filter
  const [resFilter, setResFilter] = useState<'All' | ReservationStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected reservation for status update & notes modal
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [resNotes, setResNotes] = useState('');

  // Editing Room state
  const [editingRoom, setEditingRoom] = useState<RoomCategory | null>(null);
  const [isNewRoom, setIsNewRoom] = useState(false);

  // Editing Hotel info state
  const [infoForm, setInfoForm] = useState<HotelInfo>(hotelInfo);
  const [infoSavedMessage, setInfoSavedMessage] = useState(false);

  // New gallery item state
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryCategory, setNewGalleryCategory] = useState<GalleryItem['category']>('Exterior');
  const [newGalleryImage, setNewGalleryImage] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');

  useEffect(() => {
    setInfoForm(hotelInfo);
  }, [hotelInfo]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (username === 'admin' || username === 'admin@countrysidehotel.ng') &&
      (password === 'countryside2024' || password === 'admin')
    ) {
      storage.setAdminLoggedIn(true);
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid administrator credentials. (Hint: password is countryside2024)');
    }
  };

  const handleLogout = () => {
    storage.setAdminLoggedIn(false);
    setIsAuthenticated(false);
    setPassword('');
  };

  // Calculations for dashboard KPIs
  const totalRoomsCount = rooms
    .filter((r) => r.type === 'room')
    .reduce((acc, r) => acc + r.totalUnits, 0);

  const totalApartmentsCount = rooms
    .filter((r) => r.type === 'apartment')
    .reduce((acc, r) => acc + r.totalUnits, 0);

  const totalReservations = reservations.length;
  const pendingReservations = reservations.filter((r) => r.status === 'Pending').length;
  const confirmedReservations = reservations.filter((r) => r.status === 'Confirmed').length;
  const checkedInReservations = reservations.filter((r) => r.status === 'Checked In').length;
  const availableRoomsCount = rooms.reduce((acc, r) => acc + r.availableUnits, 0);

  // Filtered reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesFilter = resFilter === 'All' || r.status === resFilter;
    const matchesSearch =
      r.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.roomName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle Reservation status update
  const handleUpdateStatus = (id: string, status: ReservationStatus) => {
    storage.updateReservationStatus(id, status, resNotes);
    onDataRefresh();
    if (selectedRes && selectedRes.id === id) {
      setSelectedRes({ ...selectedRes, status, adminNotes: resNotes });
    }
  };

  // Handle Save Room
  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    if (isNewRoom) {
      storage.addRoom(editingRoom);
    } else {
      storage.updateRoom(editingRoom.id, editingRoom);
    }
    setEditingRoom(null);
    setIsNewRoom(false);
    onDataRefresh();
  };

  // Handle Delete Room
  const handleDeleteRoom = (id: string) => {
    if (window.confirm('Are you sure you want to remove this room category?')) {
      storage.deleteRoom(id);
      onDataRefresh();
    }
  };

  // Handle Save Hotel Info
  const handleSaveHotelInfo = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateHotelInfo(infoForm);
    setInfoSavedMessage(true);
    setTimeout(() => setInfoSavedMessage(false), 3000);
    onDataRefresh();
  };

  // Handle Add Gallery
  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryTitle || !newGalleryImage) return;

    storage.addGalleryItem({
      title: newGalleryTitle,
      category: newGalleryCategory,
      image: newGalleryImage,
      caption: newGalleryCaption,
    });

    setNewGalleryTitle('');
    setNewGalleryImage('');
    setNewGalleryCaption('');
    onDataRefresh();
  };

  // Export reservations to CSV
  const handleExportCSV = () => {
    const headers = ['Booking Ref', 'Guest Name', 'Phone', 'Email', 'Room', 'Check-In', 'Check-Out', 'Status', 'Notes'];
    const rows = reservations.map((r) => [
      r.bookingRef,
      `"${r.guestName}"`,
      `"${r.phone}"`,
      r.email,
      `"${r.roomName}"`,
      r.checkInDate,
      r.checkOutDate,
      r.status,
      `"${r.adminNotes || ''}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `countryside_reservations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div
        className="bg-neutral-900 border border-neutral-700 text-white rounded-2xl w-full max-w-7xl h-[95vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#0B2214] px-6 py-4 border-b border-[#C5A059]/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Countryside Hotel & Lounge Logo"
              className="w-10 h-10 object-cover rounded-full border border-[#C5A059]/50 bg-black shadow-md shrink-0"
            />
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-white tracking-wide">
                Countryside Hotel & Lounge · Management Console
              </h2>
              <div className="text-xs text-[#DFC794]">
                Ijoko Road, Ogun State · Established October 2024
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-3 py-1.5 rounded border border-white/20 hover:border-white/40 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Barrier Screen */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-neutral-950">
            <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl text-center">
              <img
                src="/logo.jpg"
                alt="Countryside Hotel & Lounge Crest"
                className="w-20 h-20 mx-auto mb-4 object-cover rounded-full border-2 border-[#C5A059] shadow-xl bg-black"
              />
              <h3 className="font-serif text-2xl font-bold text-center text-white mb-1">
                Hotel Administrator Login
              </h3>
              <p className="text-xs text-neutral-400 text-center mb-6">
                Enter your credentials to access room rates, reservations, and management settings.
              </p>

              {loginError && (
                <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-xs text-rose-300">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Username / Email
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#C5A059] hover:bg-[#DFC794] text-[#143621] font-semibold text-xs sm:text-sm uppercase tracking-wider rounded transition-colors shadow"
                >
                  Enter Management Dashboard
                </button>

                <div className="p-3 bg-neutral-800/80 rounded border border-neutral-700/60 text-[11px] text-neutral-400">
                  <div className="font-semibold text-neutral-300 mb-1">Default Credentials:</div>
                  <div>User: <code className="text-[#DFC794]">admin</code></div>
                  <div>Pass: <code className="text-[#DFC794]">countryside2024</code></div>
                  <button
                    type="button"
                    onClick={() => {
                      setUsername('admin');
                      setPassword('countryside2024');
                    }}
                    className="mt-2 text-xs text-[#C5A059] underline hover:text-[#DFC794]"
                  >
                    Auto-Fill Demo Credentials
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-neutral-950">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 p-4 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-[#143621] text-[#DFC794] border border-[#C5A059]/40'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Overview & KPIs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reservations')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'reservations'
                    ? 'bg-[#143621] text-[#DFC794] border border-[#C5A059]/40'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4" />
                  <span>Reservations</span>
                </div>
                {pendingReservations > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-neutral-950">
                    {pendingReservations}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('rooms')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'rooms'
                    ? 'bg-[#143621] text-[#DFC794] border border-[#C5A059]/40'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <BedDouble className="w-4 h-4" />
                <span>Rooms & Rates</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('facilities')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'facilities'
                    ? 'bg-[#143621] text-[#DFC794] border border-[#C5A059]/40'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Hotel Facilities</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'gallery'
                    ? 'bg-[#143621] text-[#DFC794] border border-[#C5A059]/40'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photo Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('enquiries')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'enquiries'
                    ? 'bg-[#143621] text-[#DFC794] border border-[#C5A059]/40'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>Guest Enquiries</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {enquiries.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-[#143621] text-[#DFC794] border border-[#C5A059]/40'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Hotel Info & Contact</span>
              </button>

              <div className="hidden md:block mt-auto pt-4 border-t border-neutral-800 text-[11px] text-neutral-500">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all demo bookings, rooms, and hotel info to factory default?')) {
                      storage.resetAllData();
                      onDataRefresh();
                    }
                  }}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {/* TAB 1: OVERVIEW & KPIS */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-1">
                      Hotel Performance & Capacity
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Real-time inventory and booking statistics for Countryside Hotel.
                    </p>
                  </div>

                  {/* 7 Required Statistics KPI Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
                      <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                        <span>Total Rooms</span>
                        <BedDouble className="w-4 h-4 text-[#C5A059]" />
                      </div>
                      <div className="font-mono text-3xl font-bold text-white tabular-nums">
                        {totalRoomsCount}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">20 Guest Rooms Specified</div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
                      <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                        <span>Total Apartments</span>
                        <Home className="w-4 h-4 text-[#C5A059]" />
                      </div>
                      <div className="font-mono text-3xl font-bold text-white tabular-nums">
                        {totalApartmentsCount}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">3 Spacious Apartments</div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
                      <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                        <span>Total Reservations</span>
                        <CalendarCheck className="w-4 h-4 text-[#C5A059]" />
                      </div>
                      <div className="font-mono text-3xl font-bold text-white tabular-nums">
                        {totalReservations}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">All time bookings</div>
                    </div>

                    <div className="bg-neutral-900 border border-amber-900/50 p-5 rounded-xl bg-amber-950/10">
                      <div className="flex items-center justify-between text-amber-400 text-xs mb-2">
                        <span>Pending Approval</span>
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="font-mono text-3xl font-bold text-amber-400 tabular-nums">
                        {pendingReservations}
                      </div>
                      <div className="text-[11px] text-amber-500/80 mt-1">Requires confirmation</div>
                    </div>

                    <div className="bg-neutral-900 border border-emerald-900/50 p-5 rounded-xl bg-emerald-950/10">
                      <div className="flex items-center justify-between text-emerald-400 text-xs mb-2">
                        <span>Confirmed Bookings</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="font-mono text-3xl font-bold text-emerald-400 tabular-nums">
                        {confirmedReservations}
                      </div>
                      <div className="text-[11px] text-emerald-500/80 mt-1">Approved by hotel</div>
                    </div>

                    <div className="bg-neutral-900 border border-blue-900/50 p-5 rounded-xl bg-blue-950/10">
                      <div className="flex items-center justify-between text-blue-400 text-xs mb-2">
                        <span>Current Check-Ins</span>
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="font-mono text-3xl font-bold text-blue-400 tabular-nums">
                        {checkedInReservations}
                      </div>
                      <div className="text-[11px] text-blue-500/80 mt-1">Currently in-house</div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl col-span-2 sm:col-span-1">
                      <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
                        <span>Available Units</span>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      </div>
                      <div className="font-mono text-3xl font-bold text-white tabular-nums">
                        {availableRoomsCount} / 23
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-1">Instant availability</div>
                    </div>
                  </div>

                  {/* Quick Action Banner */}
                  <div className="bg-[#143621] border border-[#C5A059]/40 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#DFC794]">
                        Reservation & Booking Inquiries
                      </h4>
                      <p className="text-xs text-white/80 max-w-xl mt-1">
                        Review pending reservation submissions, confirm room allocations, and notify guests via WhatsApp or phone.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('reservations')}
                      className="px-5 py-2.5 bg-[#C5A059] hover:bg-[#DFC794] text-[#143621] font-semibold text-xs uppercase tracking-wider rounded transition-colors whitespace-nowrap"
                    >
                      Manage Reservations ({pendingReservations} Pending)
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: RESERVATIONS */}
              {activeTab === 'reservations' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white mb-1">
                        Guest Reservations Management
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Confirm, reject, check in, and update reservation status for all guest bookings.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleExportCSV}
                        className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-700"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="Search ref, guest name, phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-800 border border-neutral-700 rounded text-white focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex flex-wrap gap-1 w-full sm:w-auto">
                      {(['All', 'Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled'] as const).map(
                        (st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setResFilter(st)}
                            className={`px-3 py-1 text-xs rounded font-medium transition-colors ${
                              resFilter === st
                                ? 'bg-[#C5A059] text-[#143621] font-semibold'
                                : 'bg-neutral-800 text-neutral-400 hover:text-white'
                            }`}
                          >
                            {st}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Reservations Table */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-neutral-300">
                        <thead className="bg-neutral-800/60 uppercase tracking-wider text-[11px] text-neutral-400 border-b border-neutral-800">
                          <tr>
                            <th className="p-3.5">Reference</th>
                            <th className="p-3.5">Guest & Contact</th>
                            <th className="p-3.5">Accommodation</th>
                            <th className="p-3.5">Dates</th>
                            <th className="p-3.5">Status</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                          {filteredReservations.map((res) => (
                            <tr key={res.id} className="hover:bg-neutral-800/40 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-white">
                                {res.bookingRef}
                              </td>
                              <td className="p-3.5">
                                <div className="font-semibold text-white">{res.guestName}</div>
                                <div className="text-[11px] text-neutral-400">{res.phone}</div>
                                <div className="text-[11px] text-neutral-500">{res.email}</div>
                              </td>
                              <td className="p-3.5">
                                <div className="font-medium text-neutral-200">{res.roomName}</div>
                                <div className="text-[11px] text-neutral-400">{res.numberOfGuests} Guest(s)</div>
                              </td>
                              <td className="p-3.5">
                                <div>In: {res.checkInDate}</div>
                                <div>Out: {res.checkOutDate}</div>
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold ${
                                    res.status === 'Confirmed'
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : res.status === 'Pending'
                                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                      : res.status === 'Checked In'
                                      ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                      : res.status === 'Checked Out'
                                      ? 'bg-neutral-800 text-neutral-400'
                                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                                  }`}
                                >
                                  {res.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Quick status actions */}
                                  {res.status === 'Pending' && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateStatus(res.id, 'Confirmed')}
                                        className="px-2 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                                        title="Approve & Confirm"
                                      >
                                        Confirm
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateStatus(res.id, 'Cancelled')}
                                        className="px-2 py-1 bg-rose-900/80 hover:bg-rose-800 text-white rounded text-[11px]"
                                        title="Decline"
                                      >
                                        Decline
                                      </button>
                                    </>
                                  )}

                                  {res.status === 'Confirmed' && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateStatus(res.id, 'Checked In')}
                                      className="px-2 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded text-[11px] font-semibold"
                                    >
                                      Check In
                                    </button>
                                  )}

                                  {res.status === 'Checked In' && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateStatus(res.id, 'Checked Out')}
                                      className="px-2 py-1 bg-neutral-700 hover:bg-neutral-600 text-white rounded text-[11px]"
                                    >
                                      Check Out
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedRes(res);
                                      setResNotes(res.adminNotes || '');
                                    }}
                                    className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                                    title="View & Edit Notes"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {filteredReservations.length === 0 && (
                      <div className="p-8 text-center text-neutral-500 text-xs">
                        No reservations match the search criteria.
                      </div>
                    )}
                  </div>

                  {/* Reservation Details & Management Notes Modal */}
                  {selectedRes && (
                    <div className="p-6 bg-neutral-900 border border-[#C5A059]/40 rounded-xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <div>
                          <span className="text-xs uppercase text-neutral-400">Editing Reservation</span>
                          <h4 className="font-mono text-lg font-bold text-white">
                            {selectedRes.bookingRef} — {selectedRes.guestName}
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedRes(null)}
                          className="p-1 text-neutral-400 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                          <label className="block text-neutral-400 mb-1">Status Override</label>
                          <select
                            value={selectedRes.status}
                            onChange={(e) =>
                              handleUpdateStatus(selectedRes.id, e.target.value as ReservationStatus)
                            }
                            className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Checked In">Checked In</option>
                            <option value="Checked Out">Checked Out</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-neutral-400 mb-1">Guest Phone</label>
                          <div className="p-2 bg-neutral-800 rounded text-white flex items-center justify-between">
                            <span>{selectedRes.phone}</span>
                            <a
                              href={`https://wa.me/${selectedRes.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-400 hover:underline"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>

                        <div>
                          <label className="block text-neutral-400 mb-1">Accommodation</label>
                          <div className="p-2 bg-neutral-800 rounded text-white">
                            {selectedRes.roomName} ({selectedRes.checkInDate} to {selectedRes.checkOutDate})
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-400 mb-1">
                          Staff Notes & Communication Log
                        </label>
                        <textarea
                          rows={3}
                          value={resNotes}
                          onChange={(e) => setResNotes(e.target.value)}
                          placeholder="Add internal notes (e.g. called guest, special room setup, confirmed payment upon arrival)..."
                          className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-white text-xs focus:outline-none focus:border-[#C5A059]"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            storage.updateReservationStatus(selectedRes.id, selectedRes.status, resNotes);
                            onDataRefresh();
                            setSelectedRes(null);
                          }}
                          className="px-4 py-2 bg-[#C5A059] text-[#143621] font-semibold text-xs rounded hover:bg-[#DFC794]"
                        >
                          Save Notes
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ROOMS & RATES */}
              {activeTab === 'rooms' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white mb-1">
                        Room Categories & Price Management
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Edit room names, descriptions, prices per night, unit allocation, and availability status.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingRoom({
                          id: `room-${Date.now()}`,
                          name: 'New Room Category',
                          type: 'room',
                          totalUnits: 1,
                          availableUnits: 1,
                          pricePerNight: 'Rate on Request',
                          description: 'Description of the room category...',
                          facilities: ['Orthopaedic Bed', 'Smart TV', '24h Electricity', 'Wi-Fi'],
                          bedType: 'Orthopaedic Bed',
                          maxGuests: 2,
                          image: '/src/assets/images/room_luxury_bedroom_1794315268668.jpg',
                          status: 'Available',
                        });
                        setIsNewRoom(true);
                      }}
                      className="px-4 py-2 bg-[#C5A059] hover:bg-[#DFC794] text-[#143621] font-semibold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Room Category</span>
                    </button>
                  </div>

                  {/* Room Editor Form */}
                  {editingRoom && (
                    <div className="p-6 bg-neutral-900 border border-[#C5A059] rounded-xl space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <h4 className="font-serif text-lg font-bold text-[#DFC794]">
                          {isNewRoom ? 'Create New Category' : `Edit: ${editingRoom.name}`}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setEditingRoom(null)}
                          className="p-1 text-neutral-400 hover:text-white"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-neutral-400 mb-1">Category Name</label>
                            <input
                              type="text"
                              required
                              value={editingRoom.name}
                              onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                              className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-neutral-400 mb-1">Type</label>
                            <select
                              value={editingRoom.type}
                              onChange={(e) =>
                                setEditingRoom({ ...editingRoom, type: e.target.value as 'room' | 'apartment' })
                              }
                              className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white"
                            >
                              <option value="room">Guest Room</option>
                              <option value="apartment">Spacious Apartment</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-neutral-400 mb-1">
                              Price Per Night (Editable Rate)
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. ₦35,000 / Night or Rate on Request"
                              value={editingRoom.pricePerNight}
                              onChange={(e) =>
                                setEditingRoom({ ...editingRoom, pricePerNight: e.target.value })
                              }
                              className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div>
                            <label className="block text-neutral-400 mb-1">Total Units</label>
                            <input
                              type="number"
                              min={1}
                              value={editingRoom.totalUnits}
                              onChange={(e) =>
                                setEditingRoom({ ...editingRoom, totalUnits: Number(e.target.value) })
                              }
                              className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-neutral-400 mb-1">Available Units</label>
                            <input
                              type="number"
                              min={0}
                              value={editingRoom.availableUnits}
                              onChange={(e) =>
                                setEditingRoom({ ...editingRoom, availableUnits: Number(e.target.value) })
                              }
                              className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white font-mono"
                            />
                          </div>

                          <div>
                            <label className="block text-neutral-400 mb-1">Bed Configuration</label>
                            <input
                              type="text"
                              value={editingRoom.bedType}
                              onChange={(e) =>
                                setEditingRoom({ ...editingRoom, bedType: e.target.value })
                              }
                              className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white"
                            />
                          </div>

                          <div>
                            <label className="block text-neutral-400 mb-1">Availability Status</label>
                            <select
                              value={editingRoom.status}
                              onChange={(e) =>
                                setEditingRoom({
                                  ...editingRoom,
                                  status: e.target.value as RoomCategory['status'],
                                })
                              }
                              className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white"
                            >
                              <option value="Available">Available</option>
                              <option value="Limited">Limited</option>
                              <option value="Fully Booked">Fully Booked</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-neutral-400 mb-1">Room Description</label>
                          <textarea
                            rows={3}
                            value={editingRoom.description}
                            onChange={(e) =>
                              setEditingRoom({ ...editingRoom, description: e.target.value })
                            }
                            className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white resize-y"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingRoom(null)}
                            className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded hover:bg-neutral-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-[#C5A059] text-[#143621] font-semibold rounded hover:bg-[#DFC794]"
                          >
                            Save Room Category
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Rooms List Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rooms.map((room) => (
                      <div
                        key={room.id}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#DFC794]">
                                {room.type === 'apartment' ? 'Apartment' : 'Guest Room'} · {room.totalUnits} Units
                              </span>
                              <h4 className="font-serif text-lg font-bold text-white">{room.name}</h4>
                            </div>
                            <div className="text-right">
                              <span className="font-mono text-sm font-bold text-[#DFC794]">
                                {room.pricePerNight}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                            {room.description}
                          </p>

                          <div className="text-[11px] text-neutral-500 flex items-center gap-3">
                            <span>Bed: {room.bedType}</span>
                            <span>·</span>
                            <span>Available: {room.availableUnits} of {room.totalUnits}</span>
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRoom(room);
                              setIsNewRoom(false);
                            }}
                            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Rate & Info</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoom(room.id)}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 rounded hover:bg-neutral-800"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: FACILITIES */}
              {activeTab === 'facilities' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-1">
                      Hotel Facilities & Services
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Manage the descriptions and highlights of hotel amenities presented to guests.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {facilities.map((fac) => (
                      <div key={fac.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-4 h-4 text-[#C5A059]" />
                            <h4 className="font-semibold text-white text-sm">{fac.title}</h4>
                          </div>
                          <p className="text-xs text-neutral-400">{fac.description}</p>
                        </div>
                        <div className="pt-3 mt-3 border-t border-neutral-800 text-[11px] text-[#DFC794]">
                          {fac.shortDesc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PHOTO GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white mb-1">
                        Hotel Photo Gallery
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Upload or configure photography across Exterior, Guest Rooms, Apartments, Club Room, Snooker, and Restaurant.
                      </p>
                    </div>
                  </div>

                  {/* Add Image Form */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#DFC794] mb-3">
                      Add New Photo to Gallery
                    </h4>
                    <form onSubmit={handleAddGalleryItem} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Photo Title"
                          value={newGalleryTitle}
                          onChange={(e) => setNewGalleryTitle(e.target.value)}
                          className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white"
                        />
                      </div>
                      <div>
                        <select
                          value={newGalleryCategory}
                          onChange={(e) => setNewGalleryCategory(e.target.value as GalleryItem['category'])}
                          className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white"
                        >
                          <option value="Exterior">Exterior</option>
                          <option value="Rooms">Rooms</option>
                          <option value="Apartments">Apartments</option>
                          <option value="Club Room & Snooker">Club Room & Snooker</option>
                          <option value="Restaurant">Restaurant</option>
                          <option value="Surroundings">Surroundings</option>
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Image URL or Asset Path"
                          value={newGalleryImage}
                          onChange={(e) => setNewGalleryImage(e.target.value)}
                          className="w-full p-2 bg-neutral-800 border border-neutral-700 rounded text-white"
                        />
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="w-full py-2 bg-[#C5A059] text-[#143621] font-semibold rounded hover:bg-[#DFC794] transition-colors"
                        >
                          Add to Gallery
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Gallery Items Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.map((item) => (
                      <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden group">
                        <div className="h-32 bg-neutral-800 relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              storage.deleteGalleryItem(item.id);
                              onDataRefresh();
                            }}
                            className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-rose-900 text-white rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-3">
                          <div className="text-[10px] uppercase text-[#DFC794] font-semibold">{item.category}</div>
                          <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: GUEST ENQUIRIES */}
              {activeTab === 'enquiries' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-1">
                      Customer Messages & Enquiries
                    </h3>
                    <p className="text-xs text-neutral-400">
                      View all inbound messages submitted via the website contact form.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {enquiries.map((enq) => (
                      <div key={enq.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                          <div>
                            <div className="font-semibold text-white text-sm">{enq.name}</div>
                            <div className="text-xs text-neutral-400 flex items-center gap-3">
                              <span>{enq.email}</span>
                              <span>·</span>
                              <span>{enq.phone}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                enq.status === 'New'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {enq.status}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                storage.updateEnquiryStatus(
                                  enq.id,
                                  enq.status === 'New' ? 'Replied' : 'New'
                                );
                                onDataRefresh();
                              }}
                              className="px-2 py-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded"
                            >
                              Toggle Replied
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-neutral-200">
                          <strong className="text-white block mb-1">{enq.subject}</strong>
                          <p className="text-neutral-300 leading-relaxed bg-neutral-950 p-3 rounded border border-neutral-800/80">
                            {enq.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: HOTEL SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-white mb-1">
                      Hotel Information & Official Contacts
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Update telephone number, WhatsApp line, email address, address landmarks, and announcements.
                    </p>
                  </div>

                  {infoSavedMessage && (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Hotel information saved successfully and updated live on the website!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveHotelInfo} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">
                          Hotel Name
                        </label>
                        <input
                          type="text"
                          required
                          value={infoForm.name}
                          onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                          className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">
                          Brand Slogan
                        </label>
                        <input
                          type="text"
                          required
                          value={infoForm.slogan}
                          onChange={(e) => setInfoForm({ ...infoForm, slogan: e.target.value })}
                          className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">
                          Official Phone (Editable Placeholder)
                        </label>
                        <input
                          type="text"
                          required
                          value={infoForm.phonePlaceholder}
                          onChange={(e) => setInfoForm({ ...infoForm, phonePlaceholder: e.target.value })}
                          className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">
                          Official WhatsApp Number
                        </label>
                        <input
                          type="text"
                          required
                          value={infoForm.whatsappPlaceholder}
                          onChange={(e) => setInfoForm({ ...infoForm, whatsappPlaceholder: e.target.value })}
                          className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">
                          Official Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={infoForm.emailPlaceholder}
                          onChange={(e) => setInfoForm({ ...infoForm, emailPlaceholder: e.target.value })}
                          className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">
                        Full Physical Address
                      </label>
                      <input
                        type="text"
                        required
                        value={infoForm.address}
                        onChange={(e) => setInfoForm({ ...infoForm, address: e.target.value })}
                        className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">
                          Check-In Policy Time
                        </label>
                        <input
                          type="text"
                          value={infoForm.checkInTime}
                          onChange={(e) => setInfoForm({ ...infoForm, checkInTime: e.target.value })}
                          className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">
                          Check-Out Policy Time
                        </label>
                        <input
                          type="text"
                          value={infoForm.checkOutTime}
                          onChange={(e) => setInfoForm({ ...infoForm, checkOutTime: e.target.value })}
                          className="w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-400 mb-1 font-semibold uppercase tracking-wider">
                        TikTok Profile URL & Handle
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={infoForm.tiktokHandle}
                          onChange={(e) => setInfoForm({ ...infoForm, tiktokHandle: e.target.value })}
                          className="p-2.5 bg-neutral-800 border border-neutral-700 rounded text-white"
                          placeholder="@countrysidehote"
                        />
                        <input
                          type="text"
                          value={infoForm.tiktokUrl}
                          onChange={(e) => setInfoForm({ ...infoForm, tiktokUrl: e.target.value })}
                          className="p-2.5 bg-neutral-800 border border-neutral-700 rounded text-white"
                          placeholder="https://www.tiktok.com/@countrysidehote"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#DFC794] text-[#143621] font-semibold rounded uppercase tracking-wider transition-colors flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Hotel Information</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
