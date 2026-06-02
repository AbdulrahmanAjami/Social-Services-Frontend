import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// خريطة إحداثيات المحافظات الأردنية (حسب الاسم)
const countyNameCoordinates = {
  "العبدلي": [31.9539, 35.9106],
  "عبدون": [31.9754, 35.8656],
  "الرصيفة": [32.0500, 36.0600],
  "إربد": [32.5556, 35.8500],
  "الكورة": [32.5000, 35.7000],
  "معان": [30.1988, 35.7348],
  "العقبة": [29.5266, 35.0063],
  "مأدبا": [31.7157, 35.7936],
  "الزرقاء": [32.0728, 36.0878],
  "السلط": [32.0391, 35.7273],
  "الكرك": [31.1826, 35.7054],
  "عجلون": [32.3325, 35.7508],
  "جرش": [32.2750, 35.8969],
  "المفرق": [32.3426, 36.2042],
  "الطفيلة": [30.8374, 35.6072],
  "بصيرا": [30.7500, 35.6000],
  "تلاع العلي": [31.9800, 35.8800],
};

// أيقونات جميلة للـ markers
const createServiceIcon = () => {
  return L.divIcon({
    className: 'custom-service-icon',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background-color: #2E7D32;
        color: white;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        font-size: 20px;
        font-weight: bold;
      ">
        📍
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-icon',
    html: `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 45px;
        height: 45px;
        background-color: #1976D2;
        color: white;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 3px 10px rgba(0,0,0,0.4);
        font-size: 24px;
        font-weight: bold;
      ">
        📌
      </div>
    `,
    iconSize: [45, 45],
    iconAnchor: [22, 22],
    popupAnchor: [0, -25],
  });
};

const MapPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [services, setServices] = useState([]);

  // حساب المسافة بين نقطتين (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // الحصول على موقع المستخدم
  const getUserLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        // موقع افتراضي (عمّان)
        const defaultLocation = { lat: 31.9454, lng: 35.9284 };
        setUserLocation(defaultLocation);
        resolve(defaultLocation);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          resolve(location);
        },
        () => {
          // استخدم موقع افتراضي عند فشل التحديد
          const defaultLocation = { lat: 31.9454, lng: 35.9284 };
          setUserLocation(defaultLocation);
          resolve(defaultLocation);
        }
      );
    });
  };

  // جلب المنشورات من API
  const fetchPosts = async (lat, lng) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return [];
      }

      const url = new URL('https://localhost:7244/api/Posts/Get Filtered Posts');
      url.searchParams.append('latitude', lat);
      url.searchParams.append('longitude', lng);
      url.searchParams.append('radius', 50); // 50 km

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        navigate('/login');
        return [];
      }

      if (!response.ok) {
        throw new Error('فشل جلب المنشورات');
      }

      let posts = await response.json();
      
      // معالجة استجابة API (قد تكون بصيغ مختلفة)
      if (!Array.isArray(posts)) {
        if (posts.data && Array.isArray(posts.data)) {
          posts = posts.data;
        } else if (posts.posts && Array.isArray(posts.posts)) {
          posts = posts.posts;
        } else {
          posts = [];
        }
      }

      console.log('Posts:', posts);

      // ترتيب حسب المسافة (إذا توفرت coordinates)
      const postsWithDistance = posts.map((post) => {
        let distance = 999999;
        if (post.latitude && post.longitude) {
          distance = calculateDistance(lat, lng, post.latitude, post.longitude);
        }
        return {
          ...post,
          distance,
        };
      }).sort((a, b) => a.distance - b.distance);

      return postsWithDistance;
    } catch (err) {
      console.error('خطأ في جلب المنشورات:', err);
      setError('فشل جلب المنشورات');
      return [];
    }
  };

  // تحميل البيانات عند تحميل المكون
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // الحصول على موقع المستخدم
        const location = await getUserLocation();
        
        // جلب المنشورات
        const posts = await fetchPosts(location.lat, location.lng);
        setServices(posts);
        
        setLoading(false);
      } catch (err) {
        console.error('خطأ:', err);
        setError(err.message || 'حدث خطأ ما');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p>جاري تحميل الخريطة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
        <div style={{ textAlign: 'center' }}>
          <p>خطأ: {error}</p>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>جاري الحصول على الموقع...</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      {/* زر الرجوع للرئيسية */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '10px 16px',
          backgroundColor: 'white',
          color: '#333',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          fontFamily: 'Arial',
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = '#f5f5f5';
          e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = 'white';
          e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
        }}
      >
        ← الرئيسية
      </button>

      <MapContainer
        center={[userLocation.lat, userLocation.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
          maxZoom={19}
        />

        {/* Marker على موقع المستخدم */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()}>
          <Popup>
            <div style={{ textAlign: 'center', fontFamily: 'Arial', direction: 'rtl' }}>
              <strong>موقعك الحالي</strong>
            </div>
          </Popup>
        </Marker>

        {/* Markers للخدمات */}
        {services.map((service, index) => {
          console.log('Marker:', service.postID, service.countyName);
          
          // احصل على إحداثيات المحافظة من countyName
          let markerLat = 31.9539;  // عمّان (افتراضي)
          let markerLng = 35.9106;

          if (service.countyName) {
            // ابحث عن أي key في countyNameCoordinates يكون substring من countyName
            const matchedKey = Object.keys(countyNameCoordinates).find(
              (key) => service.countyName.includes(key)
            );
            
            if (matchedKey) {
              const coords = countyNameCoordinates[matchedKey];
              markerLat = coords[0];
              markerLng = coords[1];
            } else if (service.latitude && service.longitude) {
              // fallback إذا كانت coordinates متوفرة
              markerLat = service.latitude;
              markerLng = service.longitude;
            }
          } else if (service.latitude && service.longitude) {
            // fallback إذا كانت coordinates متوفرة
            markerLat = service.latitude;
            markerLng = service.longitude;
          }

          console.log('Coordinates:', markerLat, markerLng);

          // حساب المسافة بين موقع المستخدم والخدمة
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            markerLat,
            markerLng
          );

          const distanceText = `المسافة: ${distance.toFixed(1)} كم`;

          return (
            <Marker key={index} position={[markerLat, markerLng]} icon={createServiceIcon()}>
              <Popup>
                <div style={{ direction: 'rtl', textAlign: 'right', fontFamily: 'Arial', width: '250px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#2E7D32', fontSize: '14px', fontWeight: 'bold' }}>
                    {service.postTitle || 'بدون عنوان'}
                  </h3>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: '#666' }}>
                    {service.description || 'بدون وصف'}
                  </p>
                  <p style={{ margin: '8px 0', fontSize: '12px' }}>
                    <strong>المنطقة:</strong> {service.countyName || 'غير محددة'}
                  </p>
                  <p style={{ margin: '8px 0', fontSize: '12px' }}>
                    <strong>المقدم:</strong> {service.authorName || 'مستخدم'}
                  </p>
                  <p style={{ margin: '8px 0', fontSize: '12px', color: '#1976D2', fontWeight: 'bold' }}>
                    {distanceText}
                  </p>
                  <button
                    onClick={() => {
                      alert(`تم الضغط على: ${service.postTitle}`);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#2E7D32',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontFamily: 'Arial',
                      marginTop: '8px',
                    }}
                  >
                    تقدم للخدمة
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* بطاقة أقرب خدمة */}
      {services.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            zIndex: 999,
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            fontFamily: 'Arial',
            direction: 'rtl',
          }}
        >
          {(() => {
            const closestService = services[0]; // المصفوفة مرتبة حسب المسافة
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              (countyNameCoordinates[closestService.countyName] || [31.9539, 35.9106])[0],
              (countyNameCoordinates[closestService.countyName] || [31.9539, 35.9106])[1]
            );

            return (
              <>
                <h2
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    color: '#2E7D32',
                    fontWeight: 'bold',
                  }}
                >
                  🎯 أقرب خدمة
                </h2>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '15px',
                    color: '#333',
                    fontWeight: 'bold',
                  }}
                >
                  {closestService.postTitle || 'بدون عنوان'}
                </h3>
                <p
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '13px',
                    color: '#666',
                    lineHeight: '1.4',
                  }}
                >
                  {closestService.description || 'بدون وصف'}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ color: '#666' }}>
                    <strong>المنطقة:</strong> {closestService.countyName || 'غير محددة'}
                  </span>
                  <span style={{ color: '#1976D2', fontWeight: 'bold' }}>
                    {distance.toFixed(1)} كم
                  </span>
                </div>
                <button
                  onClick={() => {
                    alert(`تم الضغط على: ${closestService.postTitle}`);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#2E7D32',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontFamily: 'Arial',
                    fontSize: '14px',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = '#1d5620')}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = '#2E7D32')}
                >
                  تقدم للخدمة
                </button>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MapPage;
