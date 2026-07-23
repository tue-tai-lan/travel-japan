import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronUp, 
  MapPin, 
  ExternalLink, 
  Clock, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Compass,
  CheckSquare,
  Square,
  Info,
  RefreshCw,
  Heart,
  Plane,
  Hotel
} from 'lucide-react';
import { 
  TRIP_DATES, 
  FLIGHTS, 
  HOTEL, 
  DAYS, 
  USJ_RIDES, 
  USJ_EXPRESS_MATRIX, 
  POCKET_FOODS, 
  WISHLIST_ITEMS, 
  WIKIMEDIA_GALLERY, 
  getWikimediaUrl 
} from './data';

export default function App() {
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeGalleryKey, setActiveGalleryKey] = useState<string>('');
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxCaption, setLightboxCaption] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  // Tabs container ref for auto-scrolling active day
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: false });

  // Interactive Checklist States
  const [usjCompleted, setUsjCompleted] = useState<Record<string, boolean>>({});
  const [wishlistState, setWishlistState] = useState<Array<{ id: string; text: string; done: boolean }>>([]);

  // JPY ⇌ TWD Currency Converter
  const [exchangeRate, setExchangeRate] = useState<number>(0.21);
  const [jpyAmount, setJpyAmount] = useState<string>('10000');
  const [twdAmount, setTwdAmount] = useState<string>('2100');
  const [isFetchingRate, setIsFetchingRate] = useState<boolean>(false);
  const [rateUpdatedTime, setRateUpdatedTime] = useState<string>('');

  const fetchLiveExchangeRate = async () => {
    setIsFetchingRate(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/JPY');
      if (res.ok) {
        const data = await res.json();
        if (data && data.rates && data.rates.TWD) {
          const rate = Number(data.rates.TWD);
          setExchangeRate(rate);
          setTwdAmount((Number(jpyAmount || '10000') * rate).toFixed(0));
          const now = new Date();
          setRateUpdatedTime(now.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }));
        }
      }
    } catch (err) {
      console.warn('Unable to fetch live exchange rate, using fallback rate:', err);
    } finally {
      setIsFetchingRate(false);
    }
  };

  // Mobile optimization states
  const [selectedDayTab, setSelectedDayTab] = useState<number>(0); // 0 = All Days, 1 = Day 1, etc.
  const [isCompactMode, setIsCompactMode] = useState<boolean>(false);
  const [infoTab, setInfoTab] = useState<'outbound' | 'inbound' | 'stay'>('outbound');

  // Load local storage values on mount
  useEffect(() => {
    // Default to compact mode on small screens for better readability and vertical space saving
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setIsCompactMode(true);
    }

    // Wishlist
    const savedWishlist = localStorage.getItem('kansai_wishlist_v2');
    if (savedWishlist) {
      try {
        setWishlistState(JSON.parse(savedWishlist));
      } catch (e) {
        setWishlistState(WISHLIST_ITEMS);
      }
    } else {
      setWishlistState(WISHLIST_ITEMS);
    }

    // USJ Rides
    const savedUsj = localStorage.getItem('kansai_usj_rides_v2');
    if (savedUsj) {
      try {
        setUsjCompleted(JSON.parse(savedUsj));
      } catch (e) {}
    }

    // Fetch live currency rate on mount
    fetchLiveExchangeRate();
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(TRIP_DATES.countdownTarget) - +new Date();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isPassed: false
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scrollspy to automatically update selectedDayTab as the user scrolls
  useEffect(() => {
    let isScrolling = false;
    const handleScroll = () => {
      if (isScrolling) return;
      isScrolling = true;
      requestAnimationFrame(() => {
        const sections = DAYS.map((_, idx) => document.getElementById(`day-section-${idx + 1}`));
        const scrollPosition = window.scrollY + 180; // offset for sticky header

        // Check if we are inside the itinerary section
        const itineraryEl = document.getElementById('itinerary');
        if (itineraryEl) {
          const rect = itineraryEl.getBoundingClientRect();
          // If we haven't reached the itinerary section yet, set active tab to 0 ("全部")
          if (rect.top > 200) {
            setSelectedDayTab(0);
            isScrolling = false;
            return;
          }
        }

        let currentActiveDay = 0;
        for (let i = sections.length - 1; i >= 0; i--) {
          const sec = sections[i];
          if (sec) {
            const top = sec.offsetTop;
            if (scrollPosition >= top) {
              currentActiveDay = i + 1;
              break;
            }
          }
        }
        setSelectedDayTab(currentActiveDay);
        isScrolling = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Automatically scroll the active day tab into view within the horizontal tabs container
  useEffect(() => {
    if (tabsContainerRef.current) {
      const activeBtn = tabsContainerRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [selectedDayTab]);

  const handleDayTabClick = (dayIdx: number) => {
    setSelectedDayTab(dayIdx);
    if (dayIdx === 0) {
      const el = document.getElementById('itinerary-control-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const el = document.getElementById(`day-section-${dayIdx}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, activeGalleryKey, lightboxIndex]);

  // Wishlist toggle helper
  const toggleWishlistItem = (id: string) => {
    const updated = wishlistState.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    );
    setWishlistState(updated);
    localStorage.setItem('kansai_wishlist_v2', JSON.stringify(updated));
  };

  // USJ ride toggle helper
  const toggleUsjRide = (no: string) => {
    const updated = { ...usjCompleted, [no]: !usjCompleted[no] };
    setUsjCompleted(updated);
    localStorage.setItem('kansai_usj_rides_v2', JSON.stringify(updated));
  };

  // JPY input changer
  const handleJpyChange = (val: string) => {
    setJpyAmount(val);
    if (isNaN(Number(val))) {
      setTwdAmount('');
    } else {
      setTwdAmount((Number(val) * exchangeRate).toFixed(0));
    }
  };

  // TWD input changer
  const handleTwdChange = (val: string) => {
    setTwdAmount(val);
    if (isNaN(Number(val)) || exchangeRate === 0) {
      setJpyAmount('');
    } else {
      setJpyAmount((Number(val) / exchangeRate).toFixed(0));
    }
  };

  const handleRateChange = (rate: number) => {
    setExchangeRate(rate);
    if (!isNaN(Number(jpyAmount))) {
      setTwdAmount((Number(jpyAmount) * rate).toFixed(0));
    }
  };

  // Lightbox Actions
  const openLightbox = (key: string, caption: string) => {
    const gallery = WIKIMEDIA_GALLERY[key] || [];
    if (!gallery.length) return;
    setActiveGalleryKey(key);
    setLightboxIndex(0);
    setLightboxCaption(caption);
    setImageLoading(true);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const prevImage = () => {
    const gallery = WIKIMEDIA_GALLERY[activeGalleryKey] || [];
    if (!gallery.length) return;
    setImageLoading(true);
    setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const nextImage = () => {
    const gallery = WIKIMEDIA_GALLERY[activeGalleryKey] || [];
    if (!gallery.length) return;
    setImageLoading(true);
    setLightboxIndex((prev) => (prev + 1) % gallery.length);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const activeGalleryFiles = WIKIMEDIA_GALLERY[activeGalleryKey] || [];

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-[#2b2b2b] pb-20 relative selection:bg-shu/10 selection:text-shu" id="app-root">
      {/* Top Crimson Accent Bar */}
      <div className="h-2 w-full bg-shu" />

      {/* ============ 封面 HERO ============ */}
      <header className="relative min-h-[66vh] md:min-h-[72vh] flex items-end bg-gradient-to-br from-[#1a2438] via-[#22375a] to-[#40567c] overflow-hidden text-white" id="cover-section">
        {/* Background Image with optimized opacity */}
        <img 
          className="absolute inset-0 w-full h-full object-cover opacity-55 brightness-95" 
          src="https://commons.wikimedia.org/wiki/Special:FilePath/Dotonbori,_Osaka,_at_night,_November_2016.jpg?width=1600" 
          alt="道頓堀夜景"
          referrerPolicy="no-referrer"
        />
        {/* Elegant Bottom Shadow Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent z-10" />

        {/* Hero Content Container */}
        <div className="relative z-20 w-[92%] max-w-[1020px] mx-auto pb-12 pt-28 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div className="flex-1">
            <p className="font-serif text-[#e8e3d5] text-xs sm:text-sm tracking-[0.25em] uppercase font-bold mb-2">
              FAMILY TRIP TO KANSAI ・ 家族旅行企劃書
            </p>
            <h1 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-wider leading-tight text-white drop-shadow-md">
              2026 大阪・京都
              <br />
              六日漫遊
            </h1>
            
            {/* Year & Date Tag Line */}
            <div className="mt-6 inline-flex flex-wrap items-center gap-3 bg-white/12 backdrop-blur-md border border-white/25 px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-[#fbfbf9]">
              <span>9/11 (五) — 9/16 (三)</span>
              <span className="opacity-50">|</span>
              <span>6天5夜</span>
              <span className="opacity-50">|</span>
              <span>星宇航空直飛</span>
            </div>
          </div>

          {/* Red Traditional Hanko Seal */}
          <div className="flex-none self-end md:self-auto transform -rotate-6 transition-all duration-300 hover:rotate-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-shu text-white flex items-center justify-center font-serif font-black text-2xl sm:text-3xl shadow-xl border-4 border-white/20 tracking-wider [writing-mode:vertical-rl] leading-none py-1">
              旅の栞
            </div>
          </div>
        </div>
      </header>

      {/* ============ COUNTDOWN TIMER (倒數) ============ */}
      <div className="w-full bg-[#fbfaf8] border-y border-[#dfe3e9] py-5 px-4" id="countdown-banner">
        <div className="max-w-[1020px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-shu">
            <Clock className="w-5 h-5 stroke-[2.5]" />
            <span className="font-serif font-bold text-sm tracking-widest text-[#1c1c1e] uppercase">
              KIX FLIGHT COUNTDOWN 啟程倒數
            </span>
          </div>

          {timeLeft.isPassed ? (
            <span className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1">
              ✈️ 精彩旅程進行中！全家玩的開心、平安順利！
            </span>
          ) : (
            <div className="flex items-center gap-2.5 font-mono">
              {[
                { label: '天', val: timeLeft.days },
                { label: '時', val: timeLeft.hours },
                { label: '分', val: timeLeft.minutes },
                { label: '秒', val: timeLeft.seconds }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <div className="bg-ai text-[#fff] font-bold px-2.5 py-1.5 rounded-md text-sm sm:text-base min-w-[36px] text-center shadow-sm">
                    {String(item.val).padStart(2, '0')}
                  </div>
                  <span className="text-[11px] font-bold text-[#555] font-sans">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============ 航班與住宿資訊 STRIP ============ */}
      <section className="bg-ai text-white py-8 sm:py-12 px-4 shadow-inner" id="flight-hotel-info">
        <div className="max-w-[1020px] mx-auto">
          {/* Mobile Tab Selectors (visible only on mobile) */}
          <div className="flex md:hidden bg-white/5 p-1 rounded-xl border border-white/10 mb-6 justify-between gap-1">
            <button 
              onClick={() => setInfoTab('outbound')}
              className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all ${
                infoTab === 'outbound' ? 'bg-shu text-white shadow-sm' : 'text-[#c8d2e4] hover:text-white'
              }`}
            >
              🛫 去程航班
            </button>
            <button 
              onClick={() => setInfoTab('inbound')}
              className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all ${
                infoTab === 'inbound' ? 'bg-shu text-white shadow-sm' : 'text-[#c8d2e4] hover:text-white'
              }`}
            >
              🛬 回程航班
            </button>
            <button 
              onClick={() => setInfoTab('stay')}
              className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all ${
                infoTab === 'stay' ? 'bg-shu text-white shadow-sm' : 'text-[#c8d2e4] hover:text-white'
              }`}
            >
              🏨 旅宿 STAY
            </button>
          </div>

          {/* Desktop Layout (visible only on desktop) */}
          <div className="hidden md:grid grid-cols-3 gap-0 divide-x divide-white/15">
            {/* Outbound Flight Info */}
            <div className="pb-6 md:pb-0 md:px-6 first:pl-0">
              <span className="block text-[10px] text-[#c8d2e4] font-bold tracking-[0.2em] mb-2 uppercase">去程 OUTBOUND</span>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif font-bold text-lg text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-shu" />
                  {FLIGHTS[0].airline} {FLIGHTS[0].flightNumber}
                </h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#c8d2e4] leading-relaxed">
                <div className="flex items-center justify-between font-mono font-semibold text-white mb-1.5">
                  <span>08:30 TPE</span>
                  <span className="text-[10px] text-shu font-bold px-1.5 py-0.5 bg-shu/10 rounded">3h 45m</span>
                  <span>12:15 KIX</span>
                </div>
                <p className="text-[11px]">2026/09/11 (五) • 請提早 2.5 小時至桃機辦理託運</p>
              </div>
            </div>

            {/* Inbound Flight Info */}
            <div className="py-6 md:py-0 md:px-6">
              <span className="block text-[10px] text-[#c8d2e4] font-bold tracking-[0.2em] mb-2 uppercase">回程 INBOUND</span>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif font-bold text-lg text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-shu" />
                  {FLIGHTS[1].airline} {FLIGHTS[1].flightNumber}
                </h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-[#c8d2e4] leading-relaxed">
                <div className="flex items-center justify-between font-mono font-semibold text-white mb-1.5">
                  <span>15:10 KIX</span>
                  <span className="text-[10px] text-shu font-bold px-1.5 py-0.5 bg-shu/10 rounded">2h 55m</span>
                  <span>17:05 TPE</span>
                </div>
                <p className="text-[11px]">2026/09/16 (三) • 預計 12:00–13:00 抵達 KIX 機場報到</p>
              </div>
            </div>

            {/* Accommodation Stay */}
            <div className="pt-6 md:pt-0 md:px-6 last:pr-0">
              <span className="block text-[10px] text-[#c8d2e4] font-bold tracking-[0.2em] mb-2 uppercase">住宿 STAY</span>
              <h3 className="font-serif font-bold text-lg text-white mb-2 flex items-center gap-1.5">
                <Hotel className="w-4.5 h-4.5 text-shu" />
                {HOTEL.name}
              </h3>
              <p className="text-xs text-[#c8d2e4] leading-relaxed mb-3">
                {HOTEL.address}
                <br />
                <span className="bg-shu text-white text-[10px] font-bold px-2 py-0.5 rounded mr-2 inline-block mt-1">
                  {HOTEL.features}
                </span>
              </p>
              <div className="flex flex-wrap gap-3 mt-1.5 text-xs">
                <a 
                  href={HOTEL.airbnbUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#ffd9a8] hover:text-white hover:underline flex items-center gap-1 font-semibold"
                >
                  Airbnb 房源頁面 <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-white/25">|</span>
                <a 
                  href={HOTEL.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#ffd9a8] hover:text-white hover:underline flex items-center gap-1 font-semibold"
                >
                  地圖位置 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Layout Tab Contents (visible only on mobile) */}
          <div className="block md:hidden min-h-[140px] bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 transition-all duration-300">
            {infoTab === 'outbound' && (
              <div>
                <span className="block text-[9px] text-[#c8d2e4] font-bold tracking-[0.2em] mb-1.5 uppercase">去程 OUTBOUND</span>
                <h3 className="font-serif font-bold text-base text-white flex items-center gap-1.5 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-shu" />
                  {FLIGHTS[0].airline} {FLIGHTS[0].flightNumber}
                </h3>
                <div className="flex items-center justify-between font-mono font-bold text-white mb-2 text-sm">
                  <span>08:30 TPE</span>
                  <span className="text-[10px] text-shu font-bold px-2 py-0.5 bg-shu/10 rounded">3小時 45分鐘</span>
                  <span>12:15 KIX</span>
                </div>
                <p className="text-[11px] text-[#c8d2e4]">2026/09/11 (五) • 請提早 2.5 小時至桃園機場第一航廈報到</p>
              </div>
            )}

            {infoTab === 'inbound' && (
              <div>
                <span className="block text-[9px] text-[#c8d2e4] font-bold tracking-[0.2em] mb-1.5 uppercase">回程 INBOUND</span>
                <h3 className="font-serif font-bold text-base text-white flex items-center gap-1.5 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-shu" />
                  {FLIGHTS[1].airline} {FLIGHTS[1].flightNumber}
                </h3>
                <div className="flex items-center justify-between font-mono font-bold text-white mb-2 text-sm">
                  <span>15:10 KIX</span>
                  <span className="text-[10px] text-shu font-bold px-2 py-0.5 bg-shu/10 rounded">2小時 55分鐘</span>
                  <span>17:05 TPE</span>
                </div>
                <p className="text-[11px] text-[#c8d2e4]">2026/09/16 (三) • 預計 12:00–13:00 前往關西機場第一航廈報到</p>
              </div>
            )}

            {infoTab === 'stay' && (
              <div>
                <span className="block text-[9px] text-[#c8d2e4] font-bold tracking-[0.2em] mb-1.5 uppercase">住宿 STAY</span>
                <h3 className="font-serif font-bold text-base text-white mb-1.5 flex items-center gap-1.5">
                  <Hotel className="w-4 h-4 text-shu shrink-0" />
                  {HOTEL.name}
                </h3>
                <p className="text-[11px] text-[#c8d2e4] leading-relaxed mb-3">
                  {HOTEL.address}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-shu text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    {HOTEL.features}
                  </span>
                </div>
                <div className="flex gap-4 text-xs font-bold pt-1.5 border-t border-white/5">
                  <a 
                    href={HOTEL.airbnbUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#ffd9a8] hover:text-white hover:underline flex items-center gap-1"
                  >
                    Airbnb 房源 <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-white/20">|</span>
                  <a 
                    href={HOTEL.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[#ffd9a8] hover:text-white hover:underline flex items-center gap-1"
                  >
                    Google 地圖導航 <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============ MAIN WRAPPER ============ */}
      <main className="w-[92%] max-w-[1020px] mx-auto pt-14 pb-16">
        
        {/* ============ SECTION 1: 每日行程 ITINERARY ============ */}
        <section id="itinerary" className="py-0 mb-16">
          <div className="flex items-baseline gap-4 border-b border-[#dfe3e9] pb-5 mb-8">
            <span className="text-shu text-xs tracking-[0.35em] font-extrabold uppercase font-mono">Itinerary</span>
            <h2 className="font-serif font-black text-2xl sm:text-3.5xl tracking-wide">每日行程</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-6 -mt-2">
            💡 小提示：點擊任何一張照片可以開啟全螢幕精美燈箱，並支援左右切換、鍵盤與手機滑動瀏覽更多現場實景照片。
          </p>

          {/* Scroll Anchor for Tab Click feedback */}
          <div id="itinerary-control-anchor" className="scroll-mt-6" />

          {/* Sticky Controller Panel */}
          <div className="sticky top-2 sm:top-4 z-30 bg-white/95 backdrop-blur-md border border-gray-200/80 rounded-full px-2 sm:px-3 py-1.5 mb-6 shadow-md flex items-center justify-between gap-2 transition-all">
            {/* Horizontal Day Tabs */}
            <div ref={tabsContainerRef} className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5 flex-1 min-w-0 pr-1">
              <button
                onClick={() => handleDayTabClick(0)}
                data-active={selectedDayTab === 0}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedDayTab === 0
                    ? 'bg-ai text-white shadow-xs'
                    : 'bg-[#f2f4f7] text-[#5b6470] hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {DAYS.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDayTabClick(idx + 1)}
                  data-active={selectedDayTab === idx + 1}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    selectedDayTab === idx + 1
                      ? 'bg-shu text-white shadow-xs'
                      : 'bg-[#f2f4f7] text-[#5b6470] hover:bg-gray-200'
                  }`}
                >
                  {day.dayText.replace('DAY ', 'D')}
                </button>
              ))}
            </div>

            {/* Compact Mode switch separator & toggle */}
            <div className="h-5 w-[1px] bg-gray-200 shrink-0" />

            <button
              onClick={() => setIsCompactMode(!isCompactMode)}
              className="w-7 h-7 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 flex items-center justify-center sm:justify-start gap-1 rounded-full bg-[#f2f4f7] hover:bg-gray-200 text-[#5b6470] hover:text-ai shrink-0 transition-all text-[11px] font-bold select-none"
              title={isCompactMode ? "切換為圖文卡片" : "切換為精簡列表"}
            >
              {isCompactMode ? (
                <>
                  <Compass className="w-3.5 h-3.5 text-shu shrink-0" />
                  <span className="hidden sm:inline">圖文</span>
                </>
              ) : (
                <>
                  <CheckSquare className="w-3.5 h-3.5 text-[#22375a] shrink-0" />
                  <span className="hidden sm:inline">精簡</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-12">
            {DAYS.map((day, dIdx) => {
              return (
                <article key={dIdx} id={`day-section-${dIdx + 1}`} className="scroll-mt-24">
                  {/* Day Banner */}
                  <div className="flex items-stretch rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-6">
                    {/* Vertical Tab */}
                    <div className={`flex-none w-14 sm:w-16 text-white text-center font-serif font-black text-sm sm:text-lg tracking-widest uppercase py-4 sm:py-6 flex items-center justify-center [writing-mode:vertical-rl] ${
                      day.isEven ? 'bg-shu' : 'bg-[#22375a]'
                    }`}>
                      {day.dayText}
                    </div>
                    {/* Banner content */}
                    <div className="flex-1 bg-[#f2f4f7] p-4 sm:p-6 flex flex-col justify-center">
                      <span className="text-shu font-bold tracking-widest text-[10px] sm:text-xs mb-1">
                        {day.dateText}
                      </span>
                      <h3 className="font-serif font-black text-base sm:text-2xl text-[#1c1c1e] tracking-wide">
                        {day.title}
                      </h3>
                      <p className="text-[11px] sm:text-sm text-[#5b6470] mt-1 leading-relaxed">
                        {day.desc}
                      </p>
                    </div>
                  </div>

                  {/* Stops list under this Day */}
                  <div className="flex flex-col">
                    {day.stops.map((stop, sIdx) => {
                      const gallery = WIKIMEDIA_GALLERY[stop.gKey] || [];
                      const firstImage = gallery.length > 0 ? getWikimediaUrl(gallery[0], 600) : '';

                      return (
                        <div key={sIdx} className={`border-b border-dashed border-[#dfe3e9] last:border-0 ${
                          isCompactMode 
                            ? 'py-3.5 flex gap-4 items-start' 
                            : 'grid grid-cols-1 sm:grid-cols-[190px_1fr] gap-6 py-6 items-start'
                        }`}>
                          {isCompactMode ? (
                            <>
                              {/* Left: Compact photo thumbnail */}
                              <div 
                                onClick={() => openLightbox(stop.gKey, stop.cap)}
                                className="relative rounded-lg overflow-hidden w-20 h-14 sm:w-28 sm:h-20 shrink-0 bg-gradient-to-br from-[#33486d] to-[#22375a] cursor-pointer shadow-sm group transition-transform duration-300 hover:scale-[1.03] select-none"
                              >
                                {firstImage && (
                                  <img 
                                    src={firstImage} 
                                    alt={stop.cap} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                                {/* Count badge */}
                                {gallery.length > 1 && (
                                  <div className="absolute right-1 bottom-1 z-10 bg-black/85 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md border border-white/5">
                                    {gallery.length}張
                                  </div>
                                )}
                              </div>

                              {/* Right: Compact Stop info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center flex-wrap gap-1.5 mb-1">
                                  <span className="text-[10px] font-bold text-[#22375a] bg-[#eef1f6] px-1.5 py-0.5 rounded tracking-wider">
                                    {stop.time || stop.tag}
                                  </span>
                                  {stop.typeBadge && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                      stop.typeBadge.type === 'opt' 
                                        ? 'bg-gray-100 text-[#5b6470]' 
                                        : 'bg-[#fbeceb] text-shu'
                                    }`}>
                                      {stop.typeBadge.text}
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-serif font-bold text-sm sm:text-base text-[#1c1c1e] tracking-wide flex items-center gap-1">
                                  {stop.title}
                                </h4>

                                <p className="text-[11px] sm:text-xs text-[#5b6470] leading-relaxed mt-1 line-clamp-2 sm:line-clamp-none">
                                  {stop.desc}
                                </p>

                                {/* Notes badge */}
                                {stop.notes && (
                                  <div className="mt-1.5 bg-[#fbf1f0] border border-red-100/30 rounded-lg p-2 text-[10px] text-shu-deep font-semibold leading-normal">
                                    ⚠️ {stop.notes}
                                  </div>
                                )}

                                {/* Links row */}
                                {stop.links && stop.links.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {stop.links.map((link, lIdx) => (
                                      <a
                                        key={lIdx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                                          link.isBuy 
                                            ? 'bg-[#fbeceb] border-[#ecc9c5] text-[#8f2620]' 
                                            : 'bg-[#eef1f6] border-[#d5dce8] text-[#22375a]'
                                        }`}
                                      >
                                        {link.label}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </>
                          ) : (
                            <>
                              {/* Left Side: Photo Thumbnail with Lightbox Hook */}
                              <div 
                                onClick={() => openLightbox(stop.gKey, stop.cap)}
                                className="relative rounded-lg overflow-hidden h-36 bg-gradient-to-br from-[#33486d] to-[#22375a] cursor-pointer shadow-md group transition-all duration-300 hover:scale-[1.03] select-none"
                              >
                                {firstImage && (
                                  <img 
                                    src={firstImage} 
                                    alt={stop.cap} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                    referrerPolicy="no-referrer"
                                  />
                                )}
                                <div className="absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors" />

                                {/* Time/Tag Overlay Badge */}
                                <div className="absolute left-0 top-3 z-10 bg-[#22375a] text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-r-md shadow-sm">
                                  {stop.tag || stop.time}
                                </div>

                                {/* Multiple Images Indicator Badge */}
                                {gallery.length > 1 && (
                                  <div className="absolute right-2 bottom-2 z-10 bg-black/75 text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full border border-white/10">
                                    {gallery.length} 張照片
                                  </div>
                                )}
                              </div>

                              {/* Right Side: Stop Body Info */}
                              <div className="flex flex-col justify-center">
                                <div className="flex items-center flex-wrap gap-2 mb-1.5">
                                  {stop.time && stop.tag && (
                                    <span className="text-xs font-bold text-[#22375a] tracking-wider">
                                      {stop.time}
                                    </span>
                                  )}
                                  {stop.typeBadge && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                      stop.typeBadge.type === 'opt' 
                                        ? 'bg-[#eef1f6] text-[#22375a]' 
                                        : 'bg-[#fbeceb] text-shu'
                                    }`}>
                                      {stop.typeBadge.text}
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-serif font-black text-lg text-[#1c1c1e] tracking-wide flex items-center gap-1.5">
                                  {stop.title}
                                </h4>

                                <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed mt-2">
                                  {stop.desc}
                                </p>

                                {/* Highlight Tip / Notes Box */}
                                {stop.notes && (
                                  <div className="mt-3 bg-[#fbf1f0] border border-red-100/50 rounded-lg p-3 text-xs text-shu-deep leading-relaxed font-semibold">
                                    ⚠️ {stop.notes}
                                  </div>
                                )}

                                {/* Action Links Pill Row */}
                                {stop.links && stop.links.length > 0 && (
                                  <div className="flex flex-wrap gap-2.5 mt-4">
                                    {stop.links.map((link, lIdx) => (
                                      <a
                                        key={lIdx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`inline-flex items-center gap-1 text-xs font-bold px-4 py-1.5 rounded-full border transition-all hover:scale-[1.02] ${
                                          link.isBuy 
                                            ? 'bg-[#fbeceb] border-[#ecc9c5] text-[#8f2620] hover:bg-shu hover:text-white hover:border-shu' 
                                            : 'bg-[#eef1f6] border-[#d5dce8] text-[#22375a] hover:bg-[#22375a] hover:text-white hover:border-[#22375a]'
                                        }`}
                                      >
                                        {link.label}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ============ SECTION 2: 環球影城攻略 USJ STRATEGY ============ */}
        <section id="usj" className="bg-wash rounded-xl p-6 sm:p-10 mb-16 scroll-mt-24">
          <div className="flex items-baseline gap-4 border-b border-[#dfe3e9] pb-5 mb-8">
            <span className="text-shu text-xs tracking-[0.35em] font-extrabold uppercase font-mono">USJ Strategy</span>
            <h2 className="font-serif font-black text-2xl sm:text-3.5xl tracking-wide">環球影城攻略</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Box: Ride Checklist with toggle */}
            <div className="bg-white border border-[#dfe3e9] rounded-lg p-6 lg:col-span-5 shadow-sm">
              <h4 className="font-serif font-black text-base text-ai tracking-wider pb-3 border-b-2 border-shu mb-4 flex justify-between items-center">
                <span>必玩設施打卡清單</span>
                <span className="text-xs text-gray-400 font-sans font-normal">可手動打勾記錄</span>
              </h4>

              <ul className="flex flex-col divide-y divide-[#dfe3e9]">
                {USJ_RIDES.map((ride) => {
                  const isChecked = !!usjCompleted[ride.no];
                  return (
                    <li 
                      key={ride.no} 
                      onClick={() => toggleUsjRide(ride.no)}
                      className="py-3 flex items-center justify-between cursor-pointer select-none group transition-colors hover:bg-gray-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-shu text-[13px] tracking-widest">
                          {ride.no}
                        </span>
                        <span className={`text-xs sm:text-sm font-semibold transition-all ${
                          isChecked ? 'line-through text-gray-400 font-normal' : 'text-[#2b2b2b]'
                        }`}>
                          {ride.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {ride.tag && (
                          <span className="bg-shu/10 text-shu text-[9px] font-bold px-2 py-0.5 rounded shrink-0">
                            {ride.tag}
                          </span>
                        )}
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isChecked 
                            ? 'bg-ai border-ai text-white' 
                            : 'border-gray-300 group-hover:border-shu'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Right Box: Express Matrix comparison */}
            <div className="bg-white border border-[#dfe3e9] rounded-lg p-6 lg:col-span-7 shadow-sm overflow-x-auto">
              <h4 className="font-serif font-black text-base text-ai tracking-wider pb-3 border-b-2 border-shu mb-4">
                快速通關方案比較(kkday)
              </h4>

              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-ai text-white font-bold text-center">
                    <th className="p-2.5 text-left font-serif">項目 / 設施名稱</th>
                    <th className="p-2.5">快通 5<br /><span className="text-[9px] font-normal opacity-85">Race & Minecart<br />NT$5,500</span></th>
                    <th className="p-2.5">快通 4<br /><span className="text-[9px] font-normal opacity-85"><br />NT$5,100</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfe3e9]">
                  {USJ_EXPRESS_MATRIX.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="p-2.5 font-semibold text-[#2b2b2b]">{row.name}</td>
                      <td className={`p-2.5 text-center font-black ${row.fp5 === '●' ? 'text-shu text-sm' : 'text-gray-300 font-mono'}`}>
                        {row.fp5}
                      </td>
                      <td className={`p-2.5 text-center font-black ${row.fp4 === '●' ? 'text-shu text-sm' : 'text-gray-400 font-semibold'}`}>
                        {row.fp4}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 pt-4 border-t border-[#dfe3e9] text-right">
                <a 
                  href="https://www.kkday.com/zh-tw/product/18618-universal-studios-japan-express-pass-osaka" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1 bg-shu text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-shu-deep transition-all"
                >
                  前往 kkday 快速通關購票 <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Golden Highlight Warning Banner */}
          <div className="mt-6 bg-[#fff8ec] border border-[#ecd9ad] border-l-4 border-l-gold rounded-r-lg p-5 text-xs sm:text-sm leading-relaxed text-[#5c4a24]">
            <p>
              💡 <strong>行前確認：</strong> 若沒有買到快速通關券，
              <strong>一入園請務必當場打開官方 APP 抽取「超級任天堂世界」區域入場整理券</strong>
              。每日額滿即止，建議開園後第一時間處理，快通方案內容以 kkday 頁面最新資訊為準。
            </p>
          </div>
        </section>

        {/* ============ SECTION 3: 口袋美食 & 願望清單 GOURMET MEMO & WISH LIST ============ */}
        <section id="food" className="py-0 mb-16">
          <div className="flex items-baseline gap-4 border-b border-[#dfe3e9] pb-5 mb-8">
            <span className="text-shu text-xs tracking-[0.35em] font-extrabold uppercase font-mono">Gourmet Memo</span>
            <h2 className="font-serif font-black text-2xl sm:text-3.5xl tracking-wide">口袋美食清單</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-8 -mt-2">
            沒排進大餐的候補美食名單——路過、嘴饞、肚子還有空間或想喝一杯時，隨時翻看地圖出動！
          </p>

          {/* Gourmet grid cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {POCKET_FOODS.map((food, idx) => (
              <div key={idx} className="bg-white border border-[#dfe3e9] rounded-lg p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                <div>
                  <h4 className="font-serif font-black text-base text-ai border-l-3 border-l-shu pl-3 leading-tight mb-2">
                    {food.name}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {food.desc}
                  </p>
                </div>
                
                {/* Specific link layouts */}
                {food.name.includes("HARBS") ? (
                  <div className="flex gap-2">
                    <a 
                      href="https://share.google/uXhrdl6Wn2amZHpB2" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-bold text-ai bg-gray-100 hover:bg-ai hover:text-white px-3 py-1 rounded-full border border-gray-200 flex items-center gap-0.5"
                    >
                      afternoon
                    </a>
                    <a 
                      href="https://share.google/hWB2iYB2cvlQomMFq" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs font-bold text-ai bg-gray-100 hover:bg-ai hover:text-white px-3 py-1 rounded-full border border-gray-200 flex items-center gap-0.5"
                    >
                      HARBS
                    </a>
                  </div>
                ) : food.mapUrl ? (
                  <div>
                    <a 
                      href={food.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-0.5 text-xs font-bold text-ai bg-gray-100 hover:bg-ai hover:text-white px-3.5 py-1 rounded-full border border-gray-200"
                    >
                      地圖導航 <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Interactive Wishlist */}
          <div className="scroll-mt-24">
            <div className="flex items-baseline gap-4 border-b border-[#dfe3e9] pb-5 mb-8">
              <span className="text-shu text-xs tracking-[0.35em] font-extrabold uppercase font-mono">Wish List</span>
              <h2 className="font-serif font-black text-2xl sm:text-3.5xl tracking-wide">這趟一定要完成的事</h2>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {wishlistState.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleWishlistItem(item.id)}
                  className={`text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full border flex items-center gap-2 transition-all cursor-pointer select-none active:scale-95 ${
                    item.done
                      ? 'bg-shu border-shu text-white shadow-sm'
                      : 'bg-white border-shu text-shu hover:bg-shu/5'
                  }`}
                >
                  <span>{item.text}</span>
                  {item.done ? (
                    <span className="bg-white/20 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      ✓ 已打勾
                    </span>
                  ) : (
                    <span className="bg-shu/10 text-[10px] font-medium px-2 py-0.5 rounded-full">
                      待收集
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SECTION 4: 交通備忘 & 實用匯率工具 JPY CONVERTER ============ */}
        <section id="notes" className="bg-wash rounded-xl p-6 sm:p-10 scroll-mt-24">
          <div className="flex items-baseline gap-4 border-b border-[#dfe3e9] pb-5 mb-8">
            <span className="text-shu text-xs tracking-[0.35em] font-extrabold uppercase font-mono">Tools & Notes</span>
            <h2 className="font-serif font-black text-2xl sm:text-3.5xl tracking-wide">實用工具與備忘</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Box: Exchange rate tool */}
            <div className="bg-white border border-[#dfe3e9] rounded-lg p-6 lg:col-span-5 shadow-sm">
              <h4 className="font-serif font-black text-base text-ai tracking-wider pb-3 border-b-2 border-shu mb-4 flex justify-between items-center">
                <span>日幣/台幣 即時換算</span>
                <button
                  onClick={fetchLiveExchangeRate}
                  disabled={isFetchingRate}
                  title="重新抓取最新匯率"
                  className="p-1 rounded hover:bg-gray-100 text-shu transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1 text-xs font-sans font-normal cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRate ? 'animate-spin' : ''}`} />
                  <span className="text-[11px] text-gray-500 hidden sm:inline">重新整理</span>
                </button>
              </h4>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#555] uppercase block mb-1">
                    日圓金額 (JPY)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">¥</span>
                    <input 
                      type="text" 
                      value={jpyAmount}
                      onChange={(e) => handleJpyChange(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-[#dfe3e9] rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-shu"
                      placeholder="請輸入日元"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#555] uppercase block mb-1">
                    新台幣金額 (TWD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">$</span>
                    <input 
                      type="text" 
                      value={twdAmount}
                      onChange={(e) => handleTwdChange(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border border-[#dfe3e9] rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:border-shu"
                      placeholder="請輸入台幣"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                    <span>當前即時匯率：1 JPY ≈ {exchangeRate.toFixed(4)} TWD</span>
                  </div>
                  {rateUpdatedTime && (
                    <span className="text-[10px] text-gray-400 font-normal">
                      更新於 {rateUpdatedTime}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Box: Notes documents list */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Airport接送 */}
              <div className="bg-white border border-[#dfe3e9] rounded-lg p-5 shadow-sm">
                <h4 className="font-serif font-black text-base text-ai tracking-wider pb-2 border-b border-gray-100 mb-3">
                  機場接送方案優缺點對比
                </h4>
                <ul className="text-xs sm:text-sm text-[#4b5563] space-y-2.5 list-disc pl-4">
                  <li>
                    <strong>Kkday 包車方案（第一首選）：</strong> 平均一人約 <strong>$350 台幣</strong>。
                  </li>
                  <li>
                    <strong>阿姨友人九人座車：</strong> 單趟 <strong>¥22,000 日幣</strong>，全家直達不折騰。
                  </li>
                  <li>
                    <strong>機場大巴接駁：</strong> 最省，但下車後需要步行一公里拖著大件行李比較吃力。
                  </li>
                </ul>
              </div>

              {/* 行前準備 */}
              <div className="bg-white border border-[#dfe3e9] rounded-lg p-5 shadow-sm">
                <h4 className="font-serif font-black text-base text-ai tracking-wider pb-2 border-b border-gray-100 mb-3">
                  出發前核心預約核對清單
                </h4>
                <ul className="text-xs sm:text-sm text-[#4b5563] space-y-2.5 list-disc pl-4">
                  <li>
                    和服體驗 Wargo — <a href="https://kyotokimonorental.com/zh-tw" target="_blank" rel="noopener noreferrer" className="text-shu font-bold hover:underline">線上預約</a> (Day 2)
                  </li>
                  <li>
                    環球影城門票+快通 — <a href="https://www.kkday.com/zh-tw/product/18618-universal-studios-japan-express-pass-osaka" target="_blank" rel="noopener noreferrer" className="text-shu font-bold hover:underline">kkday 提前購買</a> (Day 4)
                  </li>
                  <li>
                    京都一日遊 — <a href="https://www.klook.com/zh-TW/activity/142228-kyoto-nara-arashiyama-spring-cherry-blossom-day-tour-from-osaka/" target="_blank" rel="noopener noreferrer" className="text-shu font-bold hover:underline">Klook 行程方案</a> (Day 3)
                  </li>
                  <li>
                    敘敘苑 LUCUA 大阪店 — 商業午餐 11:30–14:30 (Day 5)
                  </li>
                  <li>
                    最終日 12:00–13:00 必須抵達關西機場，前一晚打包完成
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* ============ FOOTER ============ */}
      <footer className="bg-ai text-[#c8d2e4] text-center py-10 px-4">
        <div className="font-serif font-black text-white text-lg tracking-[0.25em] mb-2 uppercase">
          2026 OSAKA ・ KYOTO
        </div>
        <p className="text-xs sm:text-sm">一起吃好、玩好、平平安安回家</p>
        <p className="text-[10px] text-[#8a97b0] mt-4 max-w-xl mx-auto leading-normal">
          實景照片取自 Wikimedia Commons (CC 授權)，主要為景點/料理示意，實際情況以現場為準。
        </p>
      </footer>

      {/* Mobile Floating Sticky Bottom Navigation Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-ai/90 backdrop-blur-md border border-white/10 rounded-full py-2.5 px-6 shadow-2xl flex items-center text-gray-300 max-w-[90%] w-[310px] justify-between md:hidden">
        <button 
          onClick={() => scrollToSection('itinerary')}
          className="flex flex-col items-center gap-0.5 text-white/70 hover:text-white transition-colors"
        >
          <Compass className="w-4 h-4 text-shu" />
          <span className="text-[9px] font-bold">日程</span>
        </button>
        <button 
          onClick={() => scrollToSection('usj')}
          className="flex flex-col items-center gap-0.5 text-white/70 hover:text-white transition-colors"
        >
          <CheckSquare className="w-4 h-4 text-shu" />
          <span className="text-[9px] font-bold">環球</span>
        </button>
        <button 
          onClick={() => scrollToSection('food')}
          className="flex flex-col items-center gap-0.5 text-white/70 hover:text-white transition-colors"
        >
          <Heart className="w-4 h-4 text-shu" />
          <span className="text-[9px] font-bold">美食</span>
        </button>
        <button 
          onClick={() => scrollToSection('notes')}
          className="flex flex-col items-center gap-0.5 text-white/70 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-shu" />
          <span className="text-[9px] font-bold">備忘</span>
        </button>
      </div>

      {/* Floating back to top button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 p-3 rounded-full bg-ai text-white shadow-lg border border-white/10 hover:bg-shu active:scale-95 transition-all cursor-pointer z-40"
        title="返回頂部"
      >
        <ChevronUp className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* ============ INTERACTIVE LIGHTBOX MODAL ============ */}
      {lightboxOpen && activeGalleryFiles.length > 0 && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 transition-all duration-300"
          onClick={closeLightbox}
        >
          {/* Close Action */}
          <button 
            className="absolute top-4 right-4 text-white hover:text-shu bg-white/10 hover:bg-white/20 p-2.5 rounded-full border border-white/20 transition-all cursor-pointer z-50"
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left / Prev trigger */}
          {activeGalleryFiles.length > 1 && (
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-shu bg-white/10 hover:bg-white/20 p-3 rounded-full border border-white/20 transition-all cursor-pointer z-50"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Core Image Container */}
          <div 
            className="relative max-w-full max-h-[72vh] flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/40">
                <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}
            
            <img 
              src={getWikimediaUrl(activeGalleryFiles[lightboxIndex], 1400)} 
              alt={lightboxCaption} 
              onLoad={() => setImageLoading(false)}
              className="max-w-full max-h-[72vh] rounded-md shadow-2xl object-contain bg-[#111] transition-opacity duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right / Next trigger */}
          {activeGalleryFiles.length > 1 && (
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-shu bg-white/10 hover:bg-white/20 p-3 rounded-full border border-white/20 transition-all cursor-pointer z-50"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <ChevronRight className="w-6 h-6 stroke-[2.5]" />
            </button>
          )}

          {/* Info Details Footer under modal */}
          <div 
            className="text-center mt-5 text-white max-w-2xl px-4 select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-serif font-bold text-lg tracking-wide text-white">
              {lightboxCaption}
            </h4>
            <p className="text-xs text-[#9fb0cc] tracking-widest mt-1.5 font-semibold">
              圖片 {lightboxIndex + 1} / {activeGalleryFiles.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
