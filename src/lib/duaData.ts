export interface Dua {
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  title?: string;
}

export const morningDuas: Dua[] = [
  {
    title: 'Ayat Kursi',
    arabic:
      'اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضِ وَلاَ يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration:
      "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta'khudhuhū sinatuw-wa lā naum, lahū mā fis-samāwāti wa mā fil-arḍ, man dhal-ladhī yashfa'u 'indahū illā bi'idhnih, ya'lamu mā baina aidīhim wa mā khalfahum, wa lā yuḥīṭūna bishay'im-min 'ilmihī illā bimā shā', wasi'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhū ḥifẓuhumā, wa huwal-'aliyyul-'aẓīm",
    translation:
      'Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa\'at di sisi Allah tanpa izin-Nya. Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.',
    source: 'QS. Al-Baqarah: 255',
  },
  {
    title: 'Surat Al-Ikhlas',
    arabic:
      'قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    transliteration:
      "Qul huwallāhu aḥad, Allāhuṣ-ṣamad, lam yalid wa lam yūlad, wa lam yakul-lahū kufuwan aḥad",
    translation:
      'Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorangpun yang setara dengan Dia.',
    source: 'QS. Al-Ikhlas: 1-4 (dibaca 3x)',
  },
  {
    title: 'Surat Al-Falaq',
    arabic:
      'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ، وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    transliteration:
      'Qul a\'ūdhu birabbil-falaq, min sharri mā khalaq, wa min sharri ghāsiqin idhā waqab, wa min sharrin-naffāthāti fil-\'uqad, wa min sharri ḥāsidin idhā ḥasad',
    translation:
      'Katakanlah: Aku berlindung kepada Tuhan Yang Menguasai subuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan pendengki bila ia dengki.',
    source: 'QS. Al-Falaq: 1-5 (dibaca 3x)',
  },
  {
    title: 'Surat An-Nas',
    arabic:
      'قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ',
    transliteration:
      'Qul a\'ūdhu birabbin-nās, malikin-nās, ilāhin-nās, min sharril-waswāsil-khannās, alladhī yuwaswisu fī ṣudūrin-nās, minal-jinnati wan-nās',
    translation:
      'Katakanlah: Aku berlindung kepada Tuhan (yang memelihara dan menguasai) manusia, Raja manusia, Sembahan manusia, dari kejahatan (bisikan) syaitan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari (golongan) jin dan manusia.',
    source: 'QS. An-Nas: 1-6 (dibaca 3x)',
  },
  {
    arabic:
      'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration:
      'Aṣbaḥnā wa aṣbaḥal-mulku lillāh, walḥamdu lillāh, lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa \'alā kulli shay\'in qadīr, rabbi as\'aluka khaira mā fī hādhal-yawmi wa khaira mā ba\'dah, wa a\'ūdhu bika min sharri mā fī hādhal-yawmi wa sharri mā ba\'dah, rabbi a\'ūdhu bika minal-kasali wa sū\'il-kibar, rabbi a\'ūdhu bika min \'adhābin fin-nāri wa \'adhābin fil-qabr',
    translation:
      'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada ilah (yang berhak disembah) kecuali Allah semata, tiada sekutu bagi-Nya. Milik Allah kerajaan dan bagi-Nya segala pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Wahai Rabbku, aku mohon kepada-Mu kebaikan di hari ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan hari ini dan kejahatan sesudahnya. Wahai Rabbku, aku berlindung kepada-Mu dari kemalasan dan kejelekan di hari tua. Wahai Rabbku, aku berlindung kepada-Mu dari siksaan di neraka dan siksaan di alam kubur.',
    source: 'HR. Muslim',
  },
  {
    arabic:
      'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ',
    transliteration:
      'Allāhumma bika aṣbaḥnā, wa bika amsainā, wa bika naḥyā, wa bika namūtu, wa ilaykan-nushūr',
    translation:
      'Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu petang. Dengan rahmat dan pertolongan-Mu kami hidup dan dengan rahmat dan kehendak-Mu kami mati. Dan kepada-Mu kebangkitan (kami).',
    source: 'HR. Tirmidzi',
  },
  {
    arabic:
      'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ',
    transliteration:
      'Allāhumma anta rabbī lā ilāha illā ant, khalaqtanī wa ana \'abduk, wa ana \'alā \'ahdika wa wa\'dika mas-taṭa\'tu, a\'ūdhu bika min sharri mā ṣana\'tu, abū\'u laka bini\'matika \'alayya, wa abū\'u bidhanbī faghfir lī fa\'innahū lā yaghfirudh-dhunūba illā ant',
    translation:
      'Ya Allah, Engkau adalah Rabbku, tidak ada ilah (yang berhak disembah) kecuali Engkau, Engkaulah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku pada-Mu (yaitu aku akan mentauhidkan-Mu) semampuku dan aku yakin akan janji-Mu (berupa surga untukku). Aku berlindung kepada-Mu dari kejelekan yang kuperbuat. Aku mengakui nikmat-Mu yang Engkau berikan kepadaku dan aku mengakui dosaku. Oleh karena itu, ampunilah aku. Sesungguhnya tidak ada yang mengampuni dosa kecuali Engkau.',
    source: 'HR. Bukhari (Sayyidul Istighfar)',
  },
  {
    arabic:
      'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لاَ إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    transliteration:
      'Allāhumma innī aṣbaḥtu ushhiduk, wa ushhidu ḥamalata \'arshik, wa malā\'ikatak, wa jamī\'a khalqik, annaka antallāhu lā ilāha illā anta waḥdaka lā sharīka lak, wa anna muḥammadan \'abduka wa rasūluk',
    translation:
      'Ya Allah, sesungguhnya aku di pagi hari ini mempersaksikan Engkau, malaikat yang memikul \'Arsy-Mu, malaikat-malaikat-Mu dan seluruh makhluk-Mu, bahwa sesungguhnya Engkau adalah Allah, tiada ilah yang berhak disembah kecuali Engkau semata, tiada sekutu bagi-Mu dan sesungguhnya Muhammad adalah hamba dan utusan-Mu.',
    source: 'HR. Abu Daud (dibaca 4x)',
  },
];

export const eveningDuas: Dua[] = [
  {
    title: 'Ayat Kursi',
    arabic:
      'اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ الْحَيُّ الْقَيُّومُ لاَ تَأْخُذُهُ سِنَةٌ وَلاَ نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلاَّ بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلاَ يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلاَّ بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالأَرْضِ وَلاَ يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration:
      "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta'khudhuhū sinatuw-wa lā naum, lahū mā fis-samāwāti wa mā fil-arḍ, man dhal-ladhī yashfa'u 'indahū illā bi'idhnih, ya'lamu mā baina aidīhim wa mā khalfahum, wa lā yuḥīṭūna bishay'im-min 'ilmihī illā bimā shā', wasi'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhū ḥifẓuhumā, wa huwal-'aliyyul-'aẓīm",
    translation:
      'Allah, tidak ada Tuhan (yang berhak disembah) melainkan Dia Yang Hidup kekal lagi terus menerus mengurus (makhluk-Nya); tidak mengantuk dan tidak tidur. Kepunyaan-Nya apa yang di langit dan di bumi. Tiada yang dapat memberi syafa\'at di sisi Allah tanpa izin-Nya. Allah mengetahui apa-apa yang di hadapan mereka dan di belakang mereka, dan mereka tidak mengetahui apa-apa dari ilmu Allah melainkan apa yang dikehendaki-Nya. Kursi Allah meliputi langit dan bumi. Dan Allah tidak merasa berat memelihara keduanya, dan Allah Maha Tinggi lagi Maha Besar.',
    source: 'QS. Al-Baqarah: 255',
  },
  {
    title: 'Surat Al-Ikhlas',
    arabic:
      'قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ',
    transliteration:
      "Qul huwallāhu aḥad, Allāhuṣ-ṣamad, lam yalid wa lam yūlad, wa lam yakul-lahū kufuwan aḥad",
    translation:
      'Katakanlah: Dialah Allah, Yang Maha Esa. Allah adalah Tuhan yang bergantung kepada-Nya segala sesuatu. Dia tiada beranak dan tidak pula diperanakkan, dan tidak ada seorangpun yang setara dengan Dia.',
    source: 'QS. Al-Ikhlas: 1-4 (dibaca 3x)',
  },
  {
    title: 'Surat Al-Falaq',
    arabic:
      'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ، وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ',
    transliteration:
      'Qul a\'ūdhu birabbil-falaq, min sharri mā khalaq, wa min sharri ghāsiqin idhā waqab, wa min sharrin-naffāthāti fil-\'uqad, wa min sharri ḥāsidin idhā ḥasad',
    translation:
      'Katakanlah: Aku berlindung kepada Tuhan Yang Menguasai subuh, dari kejahatan makhluk-Nya, dan dari kejahatan malam apabila telah gelap gulita, dan dari kejahatan wanita-wanita tukang sihir yang menghembus pada buhul-buhul, dan dari kejahatan pendengki bila ia dengki.',
    source: 'QS. Al-Falaq: 1-5 (dibaca 3x)',
  },
  {
    title: 'Surat An-Nas',
    arabic:
      'قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ',
    transliteration:
      'Qul a\'ūdhu birabbin-nās, malikin-nās, ilāhin-nās, min sharril-waswāsil-khannās, alladhī yuwaswisu fī ṣudūrin-nās, minal-jinnati wan-nās',
    translation:
      'Katakanlah: Aku berlindung kepada Tuhan (yang memelihara dan menguasai) manusia, Raja manusia, Sembahan manusia, dari kejahatan (bisikan) syaitan yang biasa bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari (golongan) jin dan manusia.',
    source: 'QS. An-Nas: 1-6 (dibaca 3x)',
  },
  {
    arabic:
      'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ',
    transliteration:
      'Amsainā wa amsal-mulku lillāh, walḥamdu lillāh, lā ilāha illallāhu waḥdahū lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa \'alā kulli shay\'in qadīr, rabbi as\'aluka khaira mā fī hādhihil-laylati wa khaira mā ba\'dahā, wa a\'ūdhu bika min sharri mā fī hādhihil-laylati wa sharri mā ba\'dahā, rabbi a\'ūdhu bika minal-kasali wa sū\'il-kibar, rabbi a\'ūdhu bika min \'adhābin fin-nāri wa \'adhābin fil-qabr',
    translation:
      'Kami telah memasuki waktu petang dan kerajaan hanya milik Allah, segala puji bagi Allah. Tidak ada ilah (yang berhak disembah) kecuali Allah semata, tiada sekutu bagi-Nya. Milik Allah kerajaan dan bagi-Nya segala pujian. Dia-lah Yang Mahakuasa atas segala sesuatu. Wahai Rabbku, aku mohon kepada-Mu kebaikan di malam ini dan kebaikan sesudahnya. Aku berlindung kepada-Mu dari kejahatan malam ini dan kejahatan sesudahnya. Wahai Rabbku, aku berlindung kepada-Mu dari kemalasan dan kejelekan di hari tua. Wahai Rabbku, aku berlindung kepada-Mu dari siksaan di neraka dan siksaan di alam kubur.',
    source: 'HR. Muslim',
  },
  {
    arabic:
      'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ',
    transliteration:
      'Allāhumma bika amsainā, wa bika aṣbaḥnā, wa bika naḥyā, wa bika namūtu, wa ilaykal-maṣīr',
    translation:
      'Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu petang, dan dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi. Dengan rahmat dan pertolongan-Mu kami hidup dan dengan rahmat dan kehendak-Mu kami mati. Dan kepada-Mu tempat kembali (kami).',
    source: 'HR. Tirmidzi',
  },
  {
    arabic:
      'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ',
    transliteration:
      'Allāhumma anta rabbī lā ilāha illā ant, khalaqtanī wa ana \'abduk, wa ana \'alā \'ahdika wa wa\'dika mas-taṭa\'tu, a\'ūdhu bika min sharri mā ṣana\'tu, abū\'u laka bini\'matika \'alayya, wa abū\'u bidhanbī faghfir lī fa\'innahū lā yaghfirudh-dhunūba illā ant',
    translation:
      'Ya Allah, Engkau adalah Rabbku, tidak ada ilah (yang berhak disembah) kecuali Engkau, Engkaulah yang menciptakanku. Aku adalah hamba-Mu. Aku akan setia pada perjanjianku pada-Mu (yaitu aku akan mentauhidkan-Mu) semampuku dan aku yakin akan janji-Mu (berupa surga untukku). Aku berlindung kepada-Mu dari kejelekan yang kuperbuat. Aku mengakui nikmat-Mu yang Engkau berikan kepadaku dan aku mengakui dosaku. Oleh karena itu, ampunilah aku. Sesungguhnya tidak ada yang mengampuni dosa kecuali Engkau.',
    source: 'HR. Bukhari (Sayyidul Istighfar)',
  },
  {
    arabic:
      'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ، وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ، وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللهُ لاَ إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ',
    transliteration:
      'Allāhumma innī amsaytu ushhiduk, wa ushhidu ḥamalata \'arshik, wa malā\'ikatak, wa jamī\'a khalqik, annaka antallāhu lā ilāha illā anta waḥdaka lā sharīka lak, wa anna muḥammadan \'abduka wa rasūluk',
    translation:
      'Ya Allah, sesungguhnya aku di petang hari ini mempersaksikan Engkau, malaikat yang memikul \'Arsy-Mu, malaikat-malaikat-Mu dan seluruh makhluk-Mu, bahwa sesungguhnya Engkau adalah Allah, tiada ilah yang berhak disembah kecuali Engkau semata, tiada sekutu bagi-Mu dan sesungguhnya Muhammad adalah hamba dan utusan-Mu.',
    source: 'HR. Abu Daud (dibaca 4x)',
  },
];

