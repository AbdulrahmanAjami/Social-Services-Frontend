import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import {
  Home, MapPin, Navigation, AlertCircle, Loader2,
  HeartHandshake, ArrowLeft, User, Briefcase,
} from 'lucide-react';



// ─── Fix Leaflet marker icons for Vite ────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconUrl: markerIcon, shadowUrl: markerShadow });

// ─── Custom map icons ─────────────────────────────────────────────────────────
const createServiceIcon = () =>
  L.divIcon({
    className: 'custom-service-icon',
    html: `
      <div style="
        display:flex;align-items:center;justify-content:center;
        width:42px;height:42px;
        background:linear-gradient(135deg,#059669,#0d9488);
        border-radius:50%;border:3px solid white;
        box-shadow:0 3px 10px rgba(0,0,0,0.25);
        font-size:20px;
      ">📍</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -24],
  });

const createUserIcon = () =>
  L.divIcon({
    className: 'custom-user-icon',
    html: `
      <div style="
        display:flex;align-items:center;justify-content:center;
        width:46px;height:46px;
        background:linear-gradient(135deg,#f59e0b,#d97706);
        border-radius:50%;border:4px solid white;
        box-shadow:0 4px 12px rgba(0,0,0,0.3);
        font-size:22px;
      ">📌</div>`,
    iconSize: [46, 46],
    iconAnchor: [23, 23],
    popupAnchor: [0, -26],
  });

// ─── Haversine distance ────────────────────────────────────────────────────────
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const MapPage = () => {
  
  const navigate = useNavigate();
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [services, setServices]         = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  // ── Get user location ────────────────────────────────────────────────────
  const getUserLocation = () =>
    new Promise((resolve) => {
      const fallback = { lat: 31.9454, lng: 35.9284 };
      if (!navigator.geolocation) { setUserLocation(fallback); resolve(fallback); return; }
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const loc = { lat: coords.latitude, lng: coords.longitude };
          setUserLocation(loc); resolve(loc);
        },
        () => { setUserLocation(fallback); resolve(fallback); }
      );
    });

  // ── Fetch posts from API (identical to original) ─────────────────────────
  const fetchPosts = async (lat, lng) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) { navigate('/login'); return []; }

      const url = new URL('https://localhost:7244/api/Posts/Get Filtered Posts');
      url.searchParams.append('latitude', lat);
      url.searchParams.append('longitude', lng);
      url.searchParams.append('radius', 50);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });

      if (response.status === 401) { navigate('/login'); return []; }
      if (!response.ok) throw new Error('فشل جلب المنشورات');

      let posts = await response.json();
      if (!Array.isArray(posts)) {
        posts = posts.data ?? posts.posts ?? [];
      }

      return posts
        .map((post) => ({
          ...post,
          distance:
            post.latitude && post.longitude
              ? calculateDistance(lat, lng, post.latitude, post.longitude)
              : 999999,
        }))
        .sort((a, b) => a.distance - b.distance);
    } catch (err) {
      setError('فشل جلب المنشورات');
      return [];
    }
  };

  // ── Load on mount (identical to original) ────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const location = await getUserLocation();
        const posts    = await fetchPosts(location.lat, location.lng);
        setServices(posts);
      } catch (err) {
        setError(err.message || 'حدث خطأ ما');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // ── Derived data ─────────────────────────────────────────────────────────
  const servicesWithCoords = services.filter(s => s.latitude != null && s.longitude != null);
  const closestService = servicesWithCoords[0] ?? null;


  const [showNearestList, setShowNearestList] = useState(true);
const nearest5 = servicesWithCoords.slice(0, 5);

  // ── Loading screen ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-white" dir="rtl">
        <div className="flex size-20 items-center justify-center rounded-full bg-emerald-50">
          <Loader2 className="size-10 animate-spin text-emerald-600" />
        </div>
        <p className="text-lg font-bold text-slate-700">جاري تحميل الخريطة...</p>
        <p className="text-sm text-slate-400">نحدد موقعك ونجلب أقرب الفرص التطوعية</p>
      </div>
    );
  }

  // ── Error screen ─────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-white" dir="rtl">
        <div className="flex size-20 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="size-10 text-red-500" />
        </div>
        <p className="text-lg font-bold text-red-600">حدث خطأ</p>
        <p className="text-slate-500">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="rounded-full bg-emerald-600 px-6 py-2.5 font-bold text-white transition hover:bg-emerald-700"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  // ── No location ──────────────────────────────────────────────────────────
  if (!userLocation) {
    return (
      <div className="flex h-screen items-center justify-center bg-white" dir="rtl">
        <div className="flex flex-col items-center gap-3">
          <Navigation className="size-10 animate-pulse text-emerald-600" />
          <p className="font-bold text-slate-700">جاري الحصول على موقعك...</p>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="relative h-screen w-full overflow-hidden bg-white" dir="rtl">

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <div className="absolute right-0 top-0 left-0 z-[1000] flex items-center justify-between gap-3 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-md border-b border-slate-100">
        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md">
            <HeartHandshake className="size-5 text-white" />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-black text-slate-900">
              Participate <span className="text-emerald-600">&amp;</span> Make
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">a change</span>
          </span>
        </button>

        {/* Center label */}
        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1.5">
          <MapPin className="size-4 text-emerald-600" />
          <span className="text-sm font-bold text-emerald-700">أقرب الخدمات التطوعية</span>
          {servicesWithCoords.length > 0 && (
            <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
              {servicesWithCoords.length}
            </span>
          )}
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:shadow-md"
        >
          <Home className="size-4" />
          <span className="hidden sm:inline">الرئيسية</span>
        </button>
      </div>


      {/* ── Nearest 5 Services Panel ─────────────────────────────────── */}
{nearest5.length > 0 && (
  <div className="absolute top-20 right-4 z-[999] w-72">
    {/* Toggle Button */}
    <button
      onClick={() => setShowNearestList(!showNearestList)}
      className="mb-2 flex w-full items-center justify-between rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-emerald-700"
    >
      <span className="flex items-center gap-2">
        <Navigation className="size-4" />
        أقرب 5 خدمات إليك
      </span>
      <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
        {showNearestList ? '▲ إخفاء' : '▼ عرض'}
      </span>
    </button>

    {/* List */}
    {showNearestList && (
      <div className="flex flex-col gap-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xl">
        {nearest5.map((service, index) => {
          const dist = calculateDistance(
            userLocation.lat, userLocation.lng,
            service.latitude, service.longitude
          );
          return (
            <div
              key={service.postID ?? index}
              className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-emerald-50 transition"
            >
              {/* Rank */}
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white">
                {index + 1}
              </div>

              {/* Info */}
              <div className="flex-1 text-right min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">
                  {service.postTitle || 'بدون عنوان'}
                </p>
                <div className="flex items-center justify-end gap-2 text-xs text-slate-400">
                  <span>{service.countyName || 'غير محددة'}</span>
                  <span className="font-bold text-emerald-600">{dist.toFixed(1)} كم</span>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={() => setSelectedService(service)}
                className="shrink-0 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700"
              >
                عرض
              </button>
            </div>
          );
        })}
      </div>
    )}
  </div>
)}

      {/* ── Map ──────────────────────────────────────────────────────────── */}
      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        className="h-full w-full"
        style={{ paddingTop: '60px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
          maxZoom={19}
        />

        {/* User marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()}>
          <Popup>
            <div style={{ direction: 'rtl', textAlign: 'right', fontFamily: 'system-ui', minWidth: '140px' }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#d97706' }}>📌 موقعك الحالي</p>
            </div>
          </Popup>
        </Marker>

        {/* Service markers */}
        {servicesWithCoords.map((service, index) => {
          const dist = calculateDistance(
            userLocation.lat, userLocation.lng,
            service.latitude, service.longitude
          );
          return (
            <Marker
              key={service.postID ?? index}
              position={[service.latitude, service.longitude]}
              icon={createServiceIcon()}
              eventHandlers={{ click: () => setSelectedService(service) }}
            >
              <Popup>
                <div style={{ direction: 'rtl', textAlign: 'right', fontFamily: 'system-ui', width: '240px' }}>
                  {/* Title */}
                  <p style={{ margin: '0 0 6px', fontWeight: '800', fontSize: '14px', color: '#065f46' }}>
                    {service.postTitle || 'بدون عنوان'}
                  </p>
                  {/* Description */}
                  <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#64748b', lineHeight: '1.5' }}>
                    {service.description || 'بدون وصف'}
                  </p>
                  {/* Meta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px', fontSize: '12px' }}>
                    <span style={{ color: '#64748b' }}>📍 {service.countyName || 'غير محددة'}</span>
                    <span style={{ color: '#64748b' }}>👤 {service.authorName || 'مستخدم'}</span>
                    <span style={{ color: '#059669', fontWeight: '700' }}>🗺 {dist.toFixed(1)} كم</span>
                  </div>
                  {/* CTA */}
                  <button
                    onClick={() => setSelectedService(service)}
                    style={{
                      width: '100%', padding: '8px 0',
                      background: 'linear-gradient(135deg,#059669,#0d9488)',
                      color: 'white', border: 'none', borderRadius: '10px',
                      cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                      fontFamily: 'system-ui',
                    }}
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* ── Closest service card (bottom) ───────────────────────────────── */}
      {closestService && !selectedService && (
        <div className="absolute bottom-6 right-4 left-4 z-[999] mx-auto max-w-sm">
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl shadow-slate-900/10">
            {/* Card header */}
            <div className="flex items-center gap-2 bg-emerald-600 px-5 py-3">
              <Navigation className="size-4 text-white" />
              <span className="text-sm font-bold text-white">أقرب خدمة إليك</span>
              <span className="mr-auto rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white">
                {calculateDistance(
                  userLocation.lat, userLocation.lng,
                  closestService.latitude, closestService.longitude
                ).toFixed(1)} كم
              </span>
            </div>

            {/* Card body */}
            <div className="p-4 text-right">
              <h3 className="mb-1 text-base font-extrabold text-slate-800 line-clamp-1">
                {closestService.postTitle || 'بدون عنوان'}
              </h3>
              <p className="mb-3 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {closestService.description || 'بدون وصف'}
              </p>
              <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 text-amber-500" />
                  {closestService.countyName || 'غير محددة'}
                </span>
                {closestService.authorName && (
                  <span className="flex items-center gap-1">
                    <User className="size-3 text-emerald-500" />
                    {closestService.authorName}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedService(closestService)}
                className="w-full rounded-2xl bg-emerald-600 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/20"
              >
                عرض التفاصيل والتقديم
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Service detail panel (slide-in) ─────────────────────────────── */}
      {selectedService && (
        <div
          className="absolute inset-0 z-[1100] flex items-end justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setSelectedService(null)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-emerald-600 px-6 py-4">
              <h2 className="text-lg font-black text-white line-clamp-1">
                {selectedService.postTitle || 'بدون عنوان'}
              </h2>
              <button
                onClick={() => setSelectedService(null)}
                className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 text-right">
              <p className="mb-5 leading-relaxed text-slate-600">
                {selectedService.description || 'بدون وصف'}
              </p>

              <div className="mb-5 flex flex-col gap-2 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 text-amber-500" />
                  {selectedService.countyName || 'غير محددة'}
                </span>
                {selectedService.authorName && (
                  <span className="flex items-center gap-2">
                    <User className="size-4 text-emerald-500" />
                    {selectedService.authorName}
                  </span>
                )}
                {selectedService.professionName && (
                  <span className="flex items-center gap-2">
                    <Briefcase className="size-4 text-emerald-500" />
                    {selectedService.professionName}
                  </span>
                )}
                {selectedService.latitude && (
                  <span className="flex items-center gap-2 font-bold text-emerald-700">
                    <Navigation className="size-4" />
                    {calculateDistance(
                      userLocation.lat, userLocation.lng,
                      selectedService.latitude, selectedService.longitude
                    ).toFixed(1)} كم منك
                  </span>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    alert(`تم الضغط على: ${selectedService.postTitle}`);
                  }}
                  className="flex-1 rounded-2xl bg-emerald-600 py-3 font-bold text-white transition hover:bg-emerald-700 hover:shadow-md"
                >
                  تقدم للخدمة
                </button>
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 rounded-2xl bg-slate-100 py-3 font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Stats badge (top-left) ───────────────────────────────────────── */}
      {servicesWithCoords.length === 0 && !loading && (
        <div className="absolute bottom-6 right-4 left-4 z-[999] mx-auto max-w-sm">
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-xl">
            <span className="text-4xl">🗺</span>
            <p className="font-bold text-slate-700">لا توجد خدمات قريبة منك</p>
            <p className="text-sm text-slate-400">جرّب توسيع نطاق البحث أو تصفّح جميع الخدمات</p>
            <button
              onClick={() => navigate('/posts')}
              className="rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              تصفّح جميع الخدمات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapPage;