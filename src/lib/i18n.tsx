import { createContext, useContext, type ReactNode, useEffect } from 'react';
import { useAppStore, type Language } from './store';

export interface Translations {
  nav: {
    home: string;
    prayer: string;
    quran: string;
    doa: string;
    tasbih: string;
    about: string;
    masjid: string;
  };
  home: {
    title: string;
    subtitle: string;
    location: string;
    gpsLocation: string;
    nextPrayer: string;
    in: string;
    at: string;
    hijriDate: string;
    mainMenu: string;
    prayerTimes: string;
    alQuran: string;
    doaHadith: string;
    digitalTasbih: string;
    hilalStatusTitle: string;
    hilalUnityHeading: string;
    hilalWaitingHeading: string;
    hilalUnityStatus: string;
    hilalWaitingStatus: string;
  };
  prayer: {
    title: string;
    useGPS: string;
    selectCity: string;
    calculationMethod: string;
    selectMethod: string;
    hijriDate: string;
    todaySchedule: string;
    qiblaDirection: string;
    next: string;
    remindersTitle: string;
    enableReminders: string;
    disableReminders: string;
    remindersActive: string;
    remindersNotSupported: string;
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    nearbyMosques: string;
    minutes: string;
    noMosquesFound: string;
  };
  masjid: {
    title: string;
    subtitle: string;
    searchingLocation: string;
    fetchingMosques: string;
    distance: string;
    walkingTime: string;
    minutes: string;
    noMosquesFound: string;
    locationError: string;
    locationDenied: string;
    enableLocation: string;
    apiError: string;
  };
  quran: {
    title: string;
    search: string;
    surahList: string;
    bookmarks: string;
    noBookmarks: string;
    ayat: string;
    activateAudio: string;
    activateAudioDesc: string;
    audioError: string;
    surahComplete: string;
    bookmarkAdded: string;
    bookmarkRemoved: string;
  };
  doa: {
    title: string;
    subtitle: string;
    morningEvening: string;
    dailyDua: string;
    morning: string;
    evening: string;
    morningEveningDesc: string;
    meaning: string;
    source: string;
    beforeEating: string;
    afterEating: string;
    enterMosque: string;
    leaveMosque: string;
    beforeSleep: string;
    afterSleep: string;
    enterBathroom: string;
    leaveBathroom: string;
    traveling: string;
    rain: string;
  };
  tasbih: {
    title: string;
    subtitle: string;
    addCounter: string;
    newCounter: string;
    dhikrName: string;
    target: string;
    add: string;
    of: string;
    complete: string;
    tapToCount: string;
    targetReached: string;
  };
  about: {
    title: string;
    appName: string;
    appFullName: string;
    developer: string;
    author: string;
    description: string;
    featuresTitle: string;
    features: {
      hijriCalendar: string;
      prayerTimes: string;
      quran: string;
      dua: string;
      qibla: string;
      tasbih: string;
    };
    visionTitle: string;
    vision: string;
    copyright: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    reset: string;
    close: string;
  };
  methods: {
    mwl: string;
    mwlDesc: string;
    makkah: string;
    makkahDesc: string;
    kemenag: string;
    kemenagDesc: string;
    isna: string;
    isnaDesc: string;
    karachi: string;
    karachiDesc: string;
    egypt: string;
    egyptDesc: string;
    tehran: string;
    tehranDesc: string;
  };
  messages: {
    locationEnabled: string;
    locationFailed: string;
    locationDenied: string;
    methodUpdated: string;
    prayerTimesFailed: string;
    usingSelectedCity: string;
  };
}

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export const languages: LanguageOption[] = [
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
];

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useAppStore();
  const translations = getTranslations(language);
  const currentLang = languages.find((l) => l.code === language);
  const dir = currentLang?.dir || 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t: translations, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

function getTranslations(lang: Language): Translations {
  const translations: Record<Language, Translations> = {
    id: {
      nav: {
        home: 'Beranda',
        prayer: 'Sholat',
        quran: 'Quran',
        doa: 'Doa',
        tasbih: 'Tasbih',
        about: 'Tentang',
        masjid: 'Masjid',
      },
      home: {
        title: 'MITAS',
        subtitle: 'Islamic Companion',
        location: 'Lokasi',
        gpsLocation: 'Lokasi GPS',
        nextPrayer: 'Waktu Sholat Berikutnya',
        in: 'dalam',
        at: 'Pukul',
        hijriDate: 'Tanggal Hijriah',
        mainMenu: 'Menu Utama',
        prayerTimes: 'Waktu Sholat',
        alQuran: 'Al-Quran',
        doaHadith: 'Doa & Hadits',
        digitalTasbih: 'Tasbih Digital',
        hilalStatusTitle: 'Status Hilal Global MITAS',
        hilalUnityHeading: 'STATUS: GLOBAL UNITY (BERSATU)',
        hilalWaitingHeading: 'STATUS: MENUNGGU VERIFIKASI',
        hilalUnityStatus:
          'Berdasarkan data MITAS, hilal sudah tervalidasi di wilayah Barat. Wilayah timur yang sudah masuk malam disarankan mengikuti satu awal bulan global.',
        hilalWaitingStatus:
          'Saat ini hilal belum mencapai kriteria minimal di titik rujukan utama. Harap menunggu laporan rukyat fisik dari tim lapangan atau genapkan 30 hari.',
      },
      prayer: {
        title: 'Waktu Sholat',
        useGPS: 'Gunakan Lokasi GPS',
        selectCity: 'Pilih Kota',
        calculationMethod: 'Metode Perhitungan',
        selectMethod: 'Pilih Metode',
        hijriDate: 'Tanggal Hijriah',
        todaySchedule: 'Jadwal Sholat Hari Ini',
        qiblaDirection: 'Arah Kiblat',
        next: 'Berikutnya',
        remindersTitle: 'Pengingat Sholat',
        enableReminders: 'Aktifkan pengingat sholat hari ini',
        disableReminders: 'Nonaktifkan pengingat sholat',
        remindersActive: 'Pengingat sholat aktif untuk hari ini',
        remindersNotSupported: 'Perangkat tidak mendukung notifikasi.',
        fajr: 'Subuh',
        sunrise: 'Terbit',
        dhuhr: 'Dzuhur',
        asr: 'Ashar',
        maghrib: 'Maghrib',
        isha: 'Isya',
        nearbyMosques: 'Masjid Terdekat',
        minutes: 'menit',
        noMosquesFound: 'Tidak ada masjid ditemukan dalam radius 500m',
      },
      masjid: {
        title: 'Masjid Terdekat',
        subtitle: 'Temukan masjid dalam radius 1000 meter',
        searchingLocation: 'Mencari lokasi Anda...',
        fetchingMosques: 'Mencari masjid terdekat...',
        distance: 'Jarak',
        walkingTime: 'Waktu Jalan',
        minutes: 'menit',
        noMosquesFound: 'Tidak ada masjid ditemukan dalam radius 1000m',
        locationError: 'Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan.',
        locationDenied: 'Izin lokasi ditolak. Mohon aktifkan izin lokasi untuk menemukan masjid terdekat.',
        enableLocation: 'Aktifkan Lokasi',
        apiError: 'Terjadi kesalahan saat mencari masjid. Silakan coba lagi.',
      },
      quran: {
        title: 'Al-Quran',
        search: 'Cari surah...',
        surahList: 'Daftar Surah',
        bookmarks: 'Bookmark',
        noBookmarks: 'Belum ada bookmark',
        ayat: 'Ayat',
        activateAudio: 'Aktifkan Audio',
        activateAudioDesc:
          'Klik tombol di bawah untuk mengizinkan pemutaran murotal otomatis. Seluruh surah akan diputar secara berurutan.',
        audioError: 'Terjadi kesalahan saat memuat audio. Mencoba ayat berikutnya...',
        surahComplete: 'Surah selesai diputar',
        bookmarkAdded: 'Bookmark ditambahkan',
        bookmarkRemoved: 'Bookmark dihapus',
      },
      doa: {
        title: 'Doa Harian',
        subtitle: 'Kumpulan doa pagi, petang, dan doa harian',
        morningEvening: 'Pagi & Petang',
        dailyDua: 'Doa Harian',
        morning: 'Doa Pagi',
        evening: 'Doa Petang',
        morningEveningDesc: 'Kumpulan doa yang dibaca pada pagi dan petang hari',
        meaning: 'Artinya',
        source: 'Sumber',
        beforeEating: 'Doa Sebelum Makan',
        afterEating: 'Doa Sesudah Makan',
        enterMosque: 'Doa Masuk Masjid',
        leaveMosque: 'Doa Keluar Masjid',
        beforeSleep: 'Doa Sebelum Tidur',
        afterSleep: 'Doa Bangun Tidur',
        enterBathroom: 'Doa Masuk Kamar Mandi',
        leaveBathroom: 'Doa Keluar Kamar Mandi',
        traveling: 'Doa Bepergian',
        rain: 'Doa Ketika Hujan',
      },
      tasbih: {
        title: 'Tasbih Digital',
        subtitle: 'Hitung dzikir dengan mudah',
        addCounter: 'Tambah Counter',
        newCounter: 'Tambah Counter Baru',
        dhikrName: 'Nama Dzikir',
        target: 'Target',
        add: 'Tambah',
        of: 'dari',
        complete: 'Selesai',
        tapToCount: 'Tap untuk Hitung',
        targetReached: 'Alhamdulillah, target tercapai! 🎉',
      },
      about: {
        title: 'Tentang Aplikasi',
        appName: 'MITAS',
        appFullName: 'Media Informasi Tentang Islam',
        developer: 'MITAS Digital Solutions',
        author: 'Lucky Zamaludin Malik',
        description:
          'MITAS adalah platform digital komprehensif yang menjadi panduan ibadah harian umat Muslim, menggabungkan teknologi modern dengan nilai-nilai Al‑Qur\'an dan Sunnah autentik.',
        featuresTitle: 'Fitur Utama',
        features: {
          hijriCalendar: 'Kalender Hijriah Global',
          prayerTimes: 'Jadwal Shalat Otomatis dengan GPS',
          quran: 'Al-Qur\'an Digital lengkap Audio & Visual',
          dua: 'Doa Pagi‑Petang & Harian',
          qibla: 'Kiblat & Masjid Terdekat',
          tasbih: 'Tasbih Digital',
        },
        visionTitle: 'Visi Teknis',
        vision:
          'Menghadirkan teknologi yang memperkuat tali persatuan umat dan memudahkan akses Al‑Qur\'an serta ibadah harian, sejalan dengan pesan Surah Ali Imran ayat 103 tentang berpegang teguh pada tali Allah dan tidak bercerai-berai.',
        copyright: '© 2025. Dibuat oleh MITAS',
      },
      common: {
        loading: 'Memuat...',
        error: 'Terjadi kesalahan',
        success: 'Berhasil',
        cancel: 'Batal',
        save: 'Simpan',
        delete: 'Hapus',
        reset: 'Reset',
        close: 'Tutup',
      },
      methods: {
        mwl: 'Muslim World League',
        mwlDesc: 'Standar internasional',
        makkah: 'Umm al-Qura, Makkah',
        makkahDesc: 'Arab Saudi (default)',
        kemenag: 'Kemenag RI',
        kemenagDesc: 'Kementerian Agama Indonesia',
        isna: 'ISNA',
        isnaDesc: 'Islamic Society of North America',
        karachi: 'University of Islamic Sciences, Karachi',
        karachiDesc: 'Pakistan',
        egypt: 'Egyptian General Authority',
        egyptDesc: 'Mesir',
        tehran: 'Institute of Geophysics, Tehran',
        tehranDesc: 'Iran',
      },
      messages: {
        locationEnabled: 'Lokasi berhasil dideteksi',
        locationFailed: 'Gagal mendapatkan lokasi. Pastikan GPS aktif dan izin lokasi diberikan.',
        locationDenied: 'Gagal mendapatkan lokasi. Menggunakan kota terpilih.',
        methodUpdated: 'Metode perhitungan diperbarui',
        prayerTimesFailed: 'Gagal memuat jadwal shalat',
        usingSelectedCity: 'Menggunakan kota terpilih',
      },
    },
    en: {
      nav: {
        home: 'Home',
        prayer: 'Prayer',
        quran: 'Quran',
        doa: 'Dua',
        tasbih: 'Tasbih',
        about: 'About',
        masjid: 'Mosque',
      },
      home: {
        title: 'MITAS',
        subtitle: 'Islamic Companion',
        location: 'Location',
        gpsLocation: 'GPS Location',
        nextPrayer: 'Next Prayer',
        in: 'in',
        at: 'at',
        hijriDate: 'Hijri Date',
        mainMenu: 'Main Menu',
        prayerTimes: 'Prayer Times',
        alQuran: 'Al-Quran',
        doaHadith: 'Dua & Hadith',
        digitalTasbih: 'Digital Tasbih',
        hilalStatusTitle: 'MITAS Global Hilal Status',
        hilalUnityHeading: 'STATUS: GLOBAL UNITY',
        hilalWaitingHeading: 'STATUS: AWAITING VERIFICATION',
        hilalUnityStatus:
          'Based on MITAS data, the crescent has been validated in western reference regions. Eastern regions that have entered the night are recommended to follow a unified global start of the month.',
        hilalWaitingStatus:
          'The crescent has not yet reached the minimum criteria at key reference points. Please wait for physical sighting reports or complete 30 days.',
      },
      prayer: {
        title: 'Prayer Times',
        useGPS: 'Use GPS Location',
        selectCity: 'Select City',
        calculationMethod: 'Calculation Method',
        selectMethod: 'Select Method',
        hijriDate: 'Hijri Date',
        todaySchedule: "Today's Prayer Schedule",
        qiblaDirection: 'Qibla Direction',
        next: 'Next',
        remindersTitle: 'Prayer Reminders',
        enableReminders: 'Enable prayer reminders for today',
        disableReminders: 'Disable prayer reminders',
        remindersActive: 'Prayer reminders are active for today',
        remindersNotSupported: 'This device does not support notifications.',
        fajr: 'Fajr',
        sunrise: 'Sunrise',
        dhuhr: 'Dhuhr',
        asr: 'Asr',
        maghrib: 'Maghrib',
        isha: 'Isha',
        nearbyMosques: 'Nearby Mosques',
        minutes: 'min',
        noMosquesFound: 'No mosques found within 500m radius',
      },
      masjid: {
        title: 'Nearby Mosques',
        subtitle: 'Find mosques within 1000 meters',
        searchingLocation: 'Finding your location...',
        fetchingMosques: 'Searching for nearby mosques...',
        distance: 'Distance',
        walkingTime: 'Walking Time',
        minutes: 'min',
        noMosquesFound: 'No mosques found within 1000m radius',
        locationError:
          'Failed to get location. Make sure GPS is active and location permission is granted.',
        locationDenied:
          'Location permission denied. Please enable location permission to find nearby mosques.',
        enableLocation: 'Enable Location',
        apiError: 'An error occurred while searching for mosques. Please try again.',
      },
      quran: {
        title: 'Al-Quran',
        search: 'Search surah...',
        surahList: 'Surah List',
        bookmarks: 'Bookmarks',
        noBookmarks: 'No bookmarks yet',
        ayat: 'Verses',
        activateAudio: 'Activate Audio',
        activateAudioDesc:
          'Click the button below to enable automatic recitation playback. The entire surah will be played sequentially.',
        audioError: 'An error occurred while loading audio. Trying next verse...',
        surahComplete: 'Surah playback complete',
        bookmarkAdded: 'Bookmark added',
        bookmarkRemoved: 'Bookmark removed',
      },
      doa: {
        title: 'Daily Duas',
        subtitle: 'Collection of morning, evening, and daily prayers',
        morningEvening: 'Morning & Evening',
        dailyDua: 'Daily Duas',
        morning: 'Morning Duas',
        evening: 'Evening Duas',
        morningEveningDesc: 'Collection of duas recited in the morning and evening',
        meaning: 'Meaning',
        source: 'Source',
        beforeEating: 'Dua Before Eating',
        afterEating: 'Dua After Eating',
        enterMosque: 'Dua Entering Mosque',
        leaveMosque: 'Dua Leaving Mosque',
        beforeSleep: 'Dua Before Sleep',
        afterSleep: 'Dua After Waking Up',
        enterBathroom: 'Dua Entering Bathroom',
        leaveBathroom: 'Dua Leaving Bathroom',
        traveling: 'Dua for Traveling',
        rain: 'Dua When It Rains',
      },
      tasbih: {
        title: 'Digital Tasbih',
        subtitle: 'Count dhikr easily',
        addCounter: 'Add Counter',
        newCounter: 'Add New Counter',
        dhikrName: 'Dhikr Name',
        target: 'Target',
        add: 'Add',
        of: 'of',
        complete: 'Complete',
        tapToCount: 'Tap to Count',
        targetReached: 'Alhamdulillah, target reached! 🎉',
      },
      about: {
        title: 'About App',
        appName: 'MITAS',
        appFullName: 'Media Informasi Tentang Islam',
        developer: 'MITAS Digital Solutions',
        author: 'Lucky Zamaludin Malik',
        description:
          'MITAS is a comprehensive digital platform that serves as a daily worship guide for Muslims, combining modern technology with authentic Al-Qur\'an and Sunnah values.',
        featuresTitle: 'Key Features',
        features: {
          hijriCalendar: 'Global Hijri Calendar',
          prayerTimes: 'Automatic Prayer Times with GPS',
          quran: 'Complete Digital Al-Qur\'an with Audio & Visual',
          dua: 'Morning‑Evening & Daily Duas',
          qibla: 'Qibla & Nearby Mosques',
          tasbih: 'Digital Tasbih',
        },
        visionTitle: 'Technical Vision',
        vision:
          'Clean design, global support, and the spirit of amal jariyah for the ease of Muslim worship worldwide.',
        copyright: '© 2025. Built by MITAS',
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        reset: 'Reset',
        close: 'Close',
      },
      methods: {
        mwl: 'Muslim World League',
        mwlDesc: 'International standard',
        makkah: 'Umm al-Qura, Makkah',
        makkahDesc: 'Saudi Arabia (default)',
        kemenag: 'Kemenag RI',
        kemenagDesc: 'Indonesian Ministry of Religious Affairs',
        isna: 'ISNA',
        isnaDesc: 'Islamic Society of North America',
        karachi: 'University of Islamic Sciences, Karachi',
        karachiDesc: 'Pakistan',
        egypt: 'Egyptian General Authority',
        egyptDesc: 'Egypt',
        tehran: 'Institute of Geophysics, Tehran',
        tehranDesc: 'Iran',
      },
      messages: {
        locationEnabled: 'Location detected successfully',
        locationFailed:
          'Failed to get location. Make sure GPS is active and location permission is granted.',
        locationDenied: 'Failed to get location. Using selected city.',
        methodUpdated: 'Calculation method updated',
        prayerTimesFailed: 'Failed to load prayer times',
        usingSelectedCity: 'Using selected city',
      },
    },
    zh: {
      nav: {
        home: '主页',
        prayer: '祈祷',
        quran: '古兰经',
        doa: '祷告',
        tasbih: '念珠',
        about: '关于',
        masjid: '清真寺',
      },
      home: {
        title: 'MITAS',
        subtitle: '伊斯兰伴侣',
        location: '位置',
        gpsLocation: 'GPS位置',
        nextPrayer: '下次祈祷',
        in: '在',
        at: '于',
        hijriDate: '伊斯兰历日期',
        mainMenu: '主菜单',
        prayerTimes: '祈祷时间',
        alQuran: '古兰经',
        doaHadith: '祷告与圣训',
        digitalTasbih: '数字念珠',
        hilalStatusTitle: 'MITAS 新月状态',
        hilalUnityHeading: '状态：全球统一',
        hilalWaitingHeading: '状态：等待验证',
        hilalUnityStatus:
          '根据 MITAS 数据，新月已在西部参考区域得到验证。已入夜的东部地区建议遵循统一的全球月初。',
        hilalWaitingStatus:
          '目前新月在主要参考点尚未达到最低标准。请等待现场目视报告或满 30 天。',
      },
      prayer: {
        title: '祈祷时间',
        useGPS: '使用GPS位置',
        selectCity: '选择城市',
        calculationMethod: '计算方法',
        selectMethod: '选择方法',
        hijriDate: '伊斯兰历日期',
        todaySchedule: '今日祈祷时间表',
        qiblaDirection: '朝拜方向',
        next: '下一个',
        remindersTitle: '祈祷提醒',
        enableReminders: '开启今天的祈祷提醒',
        disableReminders: '关闭祈祷提醒',
        remindersActive: '今天的祈祷提醒已开启',
        remindersNotSupported: '设备不支持通知功能。',
        fajr: '晨礼',
        sunrise: '日出',
        dhuhr: '晌礼',
        asr: '晡礼',
        maghrib: '昏礼',
        isha: '宵礼',
        nearbyMosques: '附近清真寺',
        minutes: '分钟',
        noMosquesFound: '500米范围内未找到清真寺',
      },
      masjid: {
        title: '附近清真寺',
        subtitle: '查找500米范围内的清真寺',
        searchingLocation: '正在查找您的位置...',
        fetchingMosques: '正在搜索附近的清真寺...',
        distance: '距离',
        walkingTime: '步行时间',
        minutes: '分钟',
        noMosquesFound: '500米范围内未找到清真寺',
        locationError: '无法获取位置。请确保GPS已激活并授予位置权限。',
        locationDenied:
          '位置权限被拒绝。请启用位置权限以查找附近的清真寺。',
        enableLocation: '启用位置',
        apiError: '搜索清真寺时出错。请重试。',
      },
      quran: {
        title: '古兰经',
        search: '搜索章节...',
        surahList: '章节列表',
        bookmarks: '书签',
        noBookmarks: '还没有书签',
        ayat: '节',
        activateAudio: '激活音频',
        activateAudioDesc:
          '点击下面的按钮以启用自动诵读播放。整个章节将按顺序播放。',
        audioError: '加载音频时出错。正在尝试下一节...',
        surahComplete: '章节播放完成',
        bookmarkAdded: '已添加书签',
        bookmarkRemoved: '已删除书签',
      },
      doa: {
        title: '每日祷告',
        subtitle: '早晚祷告和日常祷告集',
        morningEvening: '早晚',
        dailyDua: '每日祷告',
        morning: '早晨祷告',
        evening: '晚间祷告',
        morningEveningDesc: '早晚诵读的祷告集',
        meaning: '含义',
        source: '来源',
        beforeEating: '饭前祷告',
        afterEating: '饭后祷告',
        enterMosque: '进入清真寺祷告',
        leaveMosque: '离开清真寺祷告',
        beforeSleep: '睡前祷告',
        afterSleep: '醒后祷告',
        enterBathroom: '进入浴室祷告',
        leaveBathroom: '离开浴室祷告',
        traveling: '旅行祷告',
        rain: '下雨时祷告',
      },
      tasbih: {
        title: '数字念珠',
        subtitle: '轻松计数赞词',
        addCounter: '添加计数器',
        newCounter: '添加新计数器',
        dhikrName: '赞词名称',
        target: '目标',
        add: '添加',
        of: '的',
        complete: '完成',
        tapToCount: '点击计数',
        targetReached: '感赞真主，目标达成！🎉',
      },
      about: {
        title: '关于应用',
        appName: 'MITAS',
        appFullName: 'Media Informasi Tentang Islam',
        developer: 'MITAS Digital Solutions',
        author: 'Lucky Zamaludin Malik',
        description:
          'MITAS是一个综合性数字平台，作为穆斯林日常礼拜指南，将现代技术与真实的古兰经和圣训价值相结合。',
        featuresTitle: '主要功能',
        features: {
          hijriCalendar: '全球伊斯兰历',
          prayerTimes: 'GPS自动祈祷时间',
          quran: '完整的数字古兰经音频和视觉',
          dua: '早晚和日常祷告',
          qibla: '朝拜方向和附近清真寺',
          tasbih: '数字念珠',
        },
        visionTitle: '技术愿景',
        vision:
          '简洁的设计、全球支持和善行精神，为全球穆斯林礼拜提供便利。',
        copyright: '© 2025. 由 MITAS 构建',
      },
      common: {
        loading: '加载中...',
        error: '发生错误',
        success: '成功',
        cancel: '取消',
        save: '保存',
        delete: '删除',
        reset: '重置',
        close: '关闭',
      },
      methods: {
        mwl: '穆斯林世界联盟',
        mwlDesc: '国际标准',
        makkah: '麦加乌姆古拉大学',
        makkahDesc: '沙特阿拉伯（默认）',
        kemenag: '印尼宗教部',
        kemenagDesc: '印度尼西亚宗教事务部',
        isna: 'ISNA',
        isnaDesc: '北美伊斯兰协会',
        karachi: '卡拉奇伊斯兰科学大学',
        karachiDesc: '巴基斯坦',
        egypt: '埃及总局',
        egyptDesc: '埃及',
        tehran: '德黑兰地球物理研究所',
        tehranDesc: '伊朗',
      },
      messages: {
        locationEnabled: '位置检测成功',
        locationFailed:
          '无法获取位置。请确保GPS已激活并授予位置权限。',
        locationDenied: '无法获取位置。使用选定的城市。',
        methodUpdated: '计算方法已更新',
        prayerTimesFailed: '无法加载祈祷时间',
        usingSelectedCity: '使用选定的城市',
      },
    },
    ar: {
      nav: {
        home: 'الرئيسية',
        prayer: 'الصلاة',
        quran: 'القرآن',
        doa: 'الدعاء',
        tasbih: 'التسبيح',
        about: 'حول',
        masjid: 'المسجد',
      },
      home: {
        title: 'MITAS',
        subtitle: 'رفيق إسلامي',
        location: 'الموقع',
        gpsLocation: 'موقع GPS',
        nextPrayer: 'الصلاة التالية',
        in: 'في',
        at: 'عند',
        hijriDate: 'التاريخ الهجري',
        mainMenu: 'القائمة الرئيسية',
        prayerTimes: 'أوقات الصلاة',
        alQuran: 'القرآن الكريم',
        doaHadith: 'الدعاء والحديث',
        digitalTasbih: 'التسبيح الرقمي',
        hilalStatusTitle: 'حالة الهلال العالمية (MITAS)',
        hilalUnityHeading: 'الحالة: وحدة عالمية',
        hilalWaitingHeading: 'الحالة: في انتظار التحقق',
        hilalUnityStatus:
          'استنادًا إلى بيانات MITAS، تم تحقق رؤية الهلال في المناطق المرجعية الغربية. يُنصح المناطق الشرقية التي دخل عليها الليل باتباع بداية شهر موحدة عالميًا.',
        hilalWaitingStatus:
          'لم يصل الهلال بعد إلى الحد الأدنى من المعايير في نقاط المرجع الرئيسية. يرجى انتظار تقارير الرؤية الميدانية أو إكمال ٣٠ يومًا.',
      },
      prayer: {
        title: 'أوقات الصلاة',
        useGPS: 'استخدام موقع GPS',
        selectCity: 'اختر المدينة',
        calculationMethod: 'طريقة الحساب',
        selectMethod: 'اختر الطريقة',
        hijriDate: 'التاريخ الهجري',
        todaySchedule: 'جدول الصلاة اليوم',
        qiblaDirection: 'اتجاه القبلة',
        next: 'التالي',
        remindersTitle: 'تنبيهات الصلاة',
        enableReminders: 'تفعيل تنبيهات الصلاة لليوم',
        disableReminders: 'إيقاف تنبيهات الصلاة',
        remindersActive: 'تنبيهات الصلاة مفعّلة لليوم',
        remindersNotSupported: 'هذا الجهاز لا يدعم الإشعارات.',
        fajr: 'الفجر',
        sunrise: 'الشروق',
        dhuhr: 'الظهر',
        asr: 'العصر',
        maghrib: 'المغرب',
        isha: 'العشاء',
        nearbyMosques: 'المساجد القريبة',
        minutes: 'دقيقة',
        noMosquesFound: 'لم يتم العثور على مساجد في نطاق 500 متر',
      },
      masjid: {
        title: 'المساجد القريبة',
        subtitle: 'ابحث عن المساجد في نطاق 1000 متر',
        searchingLocation: 'جارٍ العثور على موقعك...',
        fetchingMosques: 'جارٍ البحث عن المساجد القريبة...',
        distance: 'المسافة',
        walkingTime: 'وقت المشي',
        minutes: 'دقيقة',
        noMosquesFound: 'لم يتم العثور على مساجد في نطاق 1000 متر',
        locationError:
          'فشل الحصول على الموقع. تأكد من تفعيل GPS ومنح إذن الموقع.',
        locationDenied:
          'تم رفض إذن الموقع. يرجى تمكين إذن الموقع للعثور على المساجد القريبة.',
        enableLocation: 'تمكين الموقع',
        apiError: 'حدث خطأ أثناء البحث عن المساجد. يرجى المحاولة مرة أخرى.',
      },
      quran: {
        title: 'القرآن الكريم',
        search: 'ابحث عن سورة...',
        surahList: 'قائمة السور',
        bookmarks: 'الإشارات المرجعية',
        noBookmarks: 'لا توجد إشارات مرجعية بعد',
        ayat: 'آيات',
        activateAudio: 'تفعيل الصوت',
        activateAudioDesc:
          'انقر على الزر أدناه لتمكين التشغيل التلقائي للتلاوة. سيتم تشغيل السورة بأكملها بالتسلسل.',
        audioError: 'حدث خطأ أثناء تحميل الصوت. جارٍ تجربة الآية التالية...',
        surahComplete: 'اكتمل تشغيل السورة',
        bookmarkAdded: 'تمت إضافة الإشارة المرجعية',
        bookmarkRemoved: 'تمت إزالة الإشارة المرجعية',
      },
      doa: {
        title: 'الأدعية اليومية',
        subtitle:
          'مجموعة من أدعية الصباح والمساء والأدعية اليومية',
        morningEvening: 'الصباح والمساء',
        dailyDua: 'الأدعية اليومية',
        morning: 'أدعية الصباح',
        evening: 'أدعية المساء',
        morningEveningDesc:
          'مجموعة من الأدعية التي تُقرأ في الصباح والمساء',
        meaning: 'المعنى',
        source: 'المصدر',
        beforeEating: 'دعاء قبل الأكل',
        afterEating: 'دعاء بعد الأكل',
        enterMosque: 'دعاء دخول المسجد',
        leaveMosque: 'دعاء الخروج من المسجد',
        beforeSleep: 'دعاء قبل النوم',
        afterSleep: 'دعاء الاستيقاظ',
        enterBathroom: 'دعاء دخول الحمام',
        leaveBathroom: 'دعاء الخروج من الحمام',
        traveling: 'دعاء السفر',
        rain: 'دعاء المطر',
      },
      tasbih: {
        title: 'التسبيح الرقمي',
        subtitle: 'عد الأذكار بسهولة',
        addCounter: 'إضافة عداد',
        newCounter: 'إضافة عداد جديد',
        dhikrName: 'اسم الذكر',
        target: 'الهدف',
        add: 'إضافة',
        of: 'من',
        complete: 'مكتمل',
        tapToCount: 'اضغط للعد',
        targetReached: 'الحمد لله، تم الوصول إلى الهدف! 🎉',
      },
      about: {
        title: 'حول التطبيق',
        appName: 'MITAS',
        appFullName: 'Media Informasi Tentang Islam',
        developer: 'MITAS Digital Solutions',
        author: 'Lucky Zamaludin Malik',
        description:
          'MITAS هو منصة رقمية شاملة تعمل كدليل عبادة يومي للمسلمين، تجمع بين التكنولوجيا الحديثة وقيم القرآن والسنة الأصيلة.',
        featuresTitle: 'الميزات الرئيسية',
        features: {
          hijriCalendar: 'التقويم الهجري العالمي',
          prayerTimes: 'أوقات الصلاة التلقائية مع GPS',
          quran: 'القرآن الرقمي الكامل مع الصوت والمرئيات',
          dua: 'أدعية الصباح والمساء واليومية',
          qibla: 'القبلة والمساجد القريبة',
          tasbih: 'التسبيح الرقمي',
        },
        visionTitle: 'الرؤية التقنية',
        vision:
          'تصميم نظيف، دعم عالمي، وروح الصدقة الجارية لتسهيل عبادة المسلمين في جميع أنحاء العالم.',
        copyright:
          '© 2025. تم البناء بواسطة MITAS',
      },
      common: {
        loading: 'جارٍ التحميل...',
        error: 'حدث خطأ',
        success: 'نجح',
        cancel: 'إلغاء',
        save: 'حفظ',
        delete: 'حذف',
        reset: 'إعادة تعيين',
        close: 'إغلاق',
      },
      methods: {
        mwl: 'رابطة العالم الإسلامي',
        mwlDesc: 'المعيار الدولي',
        makkah: 'أم القرى، مكة',
        makkahDesc: 'المملكة العربية السعودية (افتراضي)',
        kemenag: 'وزارة الشؤون الدينية الإندونيسية',
        kemenagDesc: 'وزارة الشؤون الدينية الإندونيسية',
        isna: 'ISNA',
        isnaDesc: 'الجمعية الإسلامية لأمريكا الشمالية',
        karachi: 'جامعة العلوم الإسلامية، كراتشي',
        karachiDesc: 'باكستان',
        egypt: 'الهيئة المصرية العامة',
        egyptDesc: 'مصر',
        tehran: 'معهد الجيوفيزياء، طهران',
        tehranDesc: 'إيران',
      },
      messages: {
        locationEnabled: 'تم اكتشاف الموقع بنجاح',
        locationFailed:
          'فشل الحصول على الموقع. تأكد من تفعيل GPS ومنح إذن الموقع.',
        locationDenied: 'فشل الحصول على الموقع. استخدام المدينة المحددة.',
        methodUpdated: 'تم تحديث طريقة الحساب',
        prayerTimesFailed: 'فشل تحميل أوقات الصلاة',
        usingSelectedCity: 'استخدام المدينة المحددة',
      },
    },
  };

  return translations[lang];
}
