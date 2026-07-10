/* =========================================================
   SADAQAH JARIYAH — APP LOGIC
   ========================================================= */

/* =========================================================
   CONFIGURATION — عدّل اسم المتوفى هنا مباشرة من الكود
   ========================================================= */
const DECEASED_NAME = "محمود منصور عوض ابو العباس"; // ⬅️ غيّر الاسم هنا فقط

/* ---------- Storage helpers ---------- */
const Store = {
  get(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    }catch(e){ return fallback; }
  },
  set(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){}
  }
};

const todayKey = () => new Date().toISOString().slice(0,10);

/* =========================================================
   CONTENT DATA — MORNING AZKAR (أذكار الصباح)
   ========================================================= */
const MORNING_AZKAR = [
  { text:"أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", ref:"رواه مسلم", reward:"ذكر الصباح", count:1 },
  { text:"اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ", ref:"رواه الترمذي", count:1 },
  { text:"اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ", ref:"سيد الاستغفار - رواه البخاري", reward:"من قالها موقنًا بها ومات من يومه دخل الجنة", count:1 },
  { text:"اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", ref:"رواه أبو داود", count:4 },
  { text:"حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", ref:"رواه أبو داود", reward:"كفاه الله ما أهمه", count:7 },
  { text:"بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", ref:"رواه الترمذي", reward:"لم يضره شيء", count:3 },
  { text:"رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", ref:"رواه أبو داود والترمذي", reward:"كان حقًا على الله أن يرضيه", count:3 },
  { text:"يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلاَ تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ", ref:"رواه الحاكم والنسائي", count:1 },
  { text:"أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلاَمِ، وَعَلَى كَلِمَةِ الإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ", ref:"رواه أحمد", count:1 },
  { text:"﴿ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ ﴾", ref:"آية الكرسي - سورة البقرة", reward:"من قالها حين يصبح أُجير من الجن حتى يمسي", count:1 },
  { text:"﴿ قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴾", ref:"سورة الإخلاص", count:3 },
  { text:"﴿ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴾", ref:"سورة الفلق", count:3 },
  { text:"﴿ قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ ﴾", ref:"سورة الناس", count:3 },
  { text:"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", ref:"رواه مسلم", reward:"حُطَّت خطاياه وإن كانت مثل زبد البحر", count:100 },
  { text:"لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", ref:"رواه البخاري ومسلم", reward:"كانت له عدل عشر رقاب وكتبت له مائة حسنة", count:10 },
  { text:"اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ", ref:"رواه أبو داود", count:3 },
  { text:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ", ref:"رواه أبو داود والنسائي", count:3 },
  { text:"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ", ref:"رواه مسلم", count:3 },
  { text:"اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ", ref:"رواه ابن ماجه", count:1 },
  { text:"اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ: فَتْحَهُ، وَنَصْرَهُ، وَنُورَهُ، وَبَرَكَتَهُ، وَهُدَاهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ", ref:"رواه أبو داود", count:1 },
  { text:"اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ", ref:"رواه الترمذي وأبو داود", count:1 },
  { text:"أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", ref:"رواه مسلم", count:3 },
  { text:"اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً", ref:"رواه ابن ماجه", count:1 },
  { text:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْجُبْنِ وَالْبُخْلِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", ref:"رواه البخاري", count:1 },
  { text:"﴿ آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ * لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ ﴾", ref:"خواتيم سورة البقرة", reward:"من قرأهما كفتاه", count:1 },
];

/* =========================================================
   CONTENT DATA — EVENING AZKAR (أذكار المساء)
   ========================================================= */
const EVENING_AZKAR = [
  { text:"أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", ref:"رواه مسلم", reward:"ذكر المساء", count:1 },
  { text:"اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ", ref:"رواه الترمذي", count:1 },
  { text:"اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ", ref:"سيد الاستغفار - رواه البخاري", reward:"من قالها موقنًا بها ومات من ليلته دخل الجنة", count:1 },
  { text:"اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ، وَمَلاَئِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ", ref:"رواه أبو داود", count:4 },
  { text:"حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ", ref:"رواه أبو داود", reward:"كفاه الله ما أهمه", count:7 },
  { text:"بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ", ref:"رواه الترمذي", reward:"لم يضره شيء", count:3 },
  { text:"رَضِيتُ بِاللَّهِ رَبًّا، وَبِالإِسْلاَمِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا", ref:"رواه أبو داود والترمذي", reward:"كان حقًا على الله أن يرضيه", count:3 },
  { text:"اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ، فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ", ref:"رواه أبو داود", count:1 },
  { text:"أَمْسَيْنَا عَلَى فِطْرَةِ الإِسْلاَمِ، وَعَلَى كَلِمَةِ الإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ، حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ", ref:"رواه أحمد", count:1 },
  { text:"﴿ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَن ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ ﴾", ref:"آية الكرسي - سورة البقرة", reward:"من قالها حين يمسي أُجير من الجن حتى يصبح", count:1 },
  { text:"﴿ قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴾", ref:"سورة الإخلاص", count:3 },
  { text:"﴿ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ * مِن شَرِّ مَا خَلَقَ * وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ * وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ * وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴾", ref:"سورة الفلق", count:3 },
  { text:"﴿ قُلْ أَعُوذُ بِرَبِّ النَّاسِ * مَلِكِ النَّاسِ * إِلَٰهِ النَّاسِ * مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ * الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ * مِنَ الْجِنَّةِ وَالنَّاسِ ﴾", ref:"سورة الناس", count:3 },
  { text:"سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", ref:"رواه مسلم", reward:"حُطَّت خطاياه وإن كانت مثل زبد البحر", count:100 },
  { text:"لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", ref:"رواه البخاري ومسلم", count:10 },
  { text:"اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ، وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ", ref:"رواه أبو داود والنسائي", count:3 },
  { text:"اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ", ref:"رواه ابن ماجه", count:1 },
  { text:"اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ: فَتْحَهَا، وَنَصْرَهَا، وَنُورَهَا، وَبَرَكَتَهَا، وَهُدَاهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهَا وَشَرِّ مَا بَعْدَهَا", ref:"رواه أبو داود", count:1 },
  { text:"اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لاَ إِلَهَ إِلاَّ أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ", ref:"رواه الترمذي وأبو داود", count:1 },
  { text:"أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ", ref:"رواه مسلم", count:3 },
  { text:"﴿ آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ * لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا إِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنتَ مَوْلَانَا فَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ ﴾", ref:"خواتيم سورة البقرة", reward:"من قرأهما في ليلة كفتاه", count:1 },
];

/* =========================================================
   SALAWAT FORMULAS
   ========================================================= */
const SALAWAT_FORMULAS = [
  "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
  "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
  "اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
  "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
  "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ عَبْدِكَ وَرَسُولِكَ النَّبِيِّ الأُمِّيِّ، وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ",
];

/* =========================================================
   ISTIGHFAR FORMULAS
   ========================================================= */
const ISTIGHFAR_FORMULAS = [
  "أَسْتَغْفِرُ اللَّهَ",
  "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لاَ إِلَهَ إِلاَّ هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ",
  "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
  "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي",
];

/* =========================================================
   TASBIH MODES
   ========================================================= */
const TASBIH_MODES = [
  "سُبْحَانَ اللَّهِ",
  "الْحَمْدُ لِلَّهِ",
  "اللَّهُ أَكْبَرُ",
  "لاَ إِلَهَ إِلاَّ اللَّهُ",
  "لاَ حَوْلَ وَلاَ قُوَّةَ إِلاَّ بِاللَّهِ",
  "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
];

/* (aggregate "hasanat" counter removed per request — per-activity progress badges remain on each card) */
function refreshHasanatDisplay(){ /* no-op: aggregate counter removed */ }

/* =========================================================
   INIT ON LOAD
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Loader ---- */
  window.addEventListener('load', () => {
    setTimeout(()=> document.getElementById('loader').classList.add('hidden'), 500);
  });

  /* ---- Dark mode ---- */
  const themeToggle = document.getElementById('themeToggle');
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  };
  let theme = Store.get('theme', 'light');
  applyTheme(theme);
  themeToggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    Store.set('theme', theme);
    applyTheme(theme);
  });

  /* ---- Deceased name (set from DECEASED_NAME config constant above) ---- */
  document.getElementById('deceasedName').textContent = DECEASED_NAME;

  /* ---- Hero CTA scroll ---- */
  document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('dashboard').scrollIntoView({ behavior:'smooth' });
  });

  /* ---- Dashboard card navigation ---- */
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', () => openSubPage(card.dataset.target));
  });
  document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', closeSubPage);
  });

  function openSubPage(id){
    document.querySelectorAll('.sub-page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById(id);
    page.classList.add('active');
    document.getElementById('mainContent').dataset.current = id;
    // scroll to the top of the opened page itself, not the top of the whole document
    requestAnimationFrame(() => {
      page.scrollIntoView({ behavior:'auto', block:'start' });
    });
  }
  function closeSubPage(){
    document.querySelectorAll('.sub-page').forEach(p => p.classList.remove('active'));
    document.getElementById('dashboard').scrollIntoView({ behavior:'smooth' });
  }

  /* =====================================================
     AZKAR ENGINE (shared for morning & evening)
     ===================================================== */
  function buildAzkarPage(kind, data){
    const listEl = document.querySelector(`[data-list="${kind}"]`);
    const fillEl = document.querySelector(`[data-fill="${kind}"]`);
    const doneEl = document.querySelector(`[data-done="${kind}"]`);
    const progressBadge = document.querySelector(`[data-progress="${kind}"]`);
    const storageKey = `azkar_${kind}_state_${todayKey()}`;

    let state = Store.get(storageKey, data.map(item => ({ remaining: item.count })));
    // if data length changed, rebuild
    if(state.length !== data.length){ state = data.map(item => ({ remaining: item.count })); }

    function persist(){ Store.set(storageKey, state); updateProgress(); }

    function updateProgress(){
      const totalReps = data.reduce((s,it)=> s + it.count, 0);
      const doneReps = state.reduce((s,it,idx)=> s + (data[idx].count - it.remaining), 0);
      const pct = Math.round((doneReps/totalReps)*100);
      fillEl.style.width = pct + '%';
      progressBadge.textContent = pct + '%';

      const allDone = state.every(s => s.remaining <= 0);
      doneEl.classList.toggle('show', allDone);

      // store a "completions" counter used for the global hasanat tally (once per full completion per day)
      const completionFlagKey = `azkar_${kind}_completion_flag_${todayKey()}`;
      if(allDone && !Store.get(completionFlagKey, false)){
        Store.set(completionFlagKey, true);
        const totalKey = `azkar_${kind}_done_count`;
        Store.set(totalKey, Store.get(totalKey,0) + totalReps);
        refreshHasanatDisplay();
      }
    }

    function render(){
      listEl.innerHTML = '';
      data.forEach((item, idx) => {
        const remaining = state[idx].remaining;
        const completed = remaining <= 0;
        const card = document.createElement('div');
        card.className = 'azkar-card' + (completed ? ' completed' : '');
        card.innerHTML = `
          <p class="azkar-text">${item.text}</p>
          <div class="azkar-meta">
            <span class="azkar-ref"><i class="fa-solid fa-book"></i> ${item.ref}</span>
            ${item.reward ? `<span class="azkar-reward"><i class="fa-solid fa-star"></i> ${item.reward}</span>` : ''}
          </div>
          <div class="azkar-footer-row">
            <button class="azkar-count-btn" data-idx="${idx}" ${completed ? 'disabled style="opacity:.4;pointer-events:none;"' : ''}>
              <i class="fa-solid fa-hand-pointer"></i>
              <span>${completed ? 'تم' : 'اضغط (' + remaining + ')'}</span>
            </button>
            <span class="azkar-remaining">المتبقي: ${Math.max(remaining,0)} / ${item.count}</span>
            <i class="fa-solid fa-circle-check azkar-check"></i>
          </div>
        `;
        listEl.appendChild(card);
      });

      listEl.querySelectorAll('.azkar-count-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = +btn.dataset.idx;
          if(state[idx].remaining > 0){
            state[idx].remaining -= 1;
            persist();
            render();
            // auto-scroll to next incomplete card softly
            if(state[idx].remaining <= 0){
              const nextCard = listEl.children[idx+1];
              if(nextCard) nextCard.scrollIntoView({ behavior:'smooth', block:'center' });
            }
          }
        });
      });
    }

    render();
    updateProgress();

    document.querySelector(`[data-reset="${kind}"]`)?.addEventListener('click', () => {
      state = data.map(item => ({ remaining: item.count }));
      Store.set(`azkar_${kind}_completion_flag_${todayKey()}`, false);
      persist();
      render();
    });
  }

  buildAzkarPage('morning', MORNING_AZKAR);
  buildAzkarPage('evening', EVENING_AZKAR);

  /* =====================================================
     QURAN WIRD
     ===================================================== */
  (function initWird(){
    const chips = document.querySelectorAll('.wird-chip');
    const goalLabel = document.getElementById('wirdGoalLabel');
    const todayValue = document.getElementById('wirdTodayValue');
    const todayUnit = document.getElementById('wirdTodayUnit');
    const ringFill = document.getElementById('wirdRingFill');
    const stepLabel = document.getElementById('wirdStep');
    const totalValueEl = document.getElementById('wirdTotalValue');
    const RING_CIRCUM = 2 * Math.PI * 60;

    const unitLabels = { page:'صفحة', hizb:'حزب', juz:'جزء' };
    const unitToPages = { page:1, hizb:20, juz:20 }; // approx pages per hizb/juz portion for aggregate tally (1 hizb ≈ 1 juz ≈ 20 pages)

    let goal = Store.get('wird_goal', null); // {unit, amount}
    let todayProgress = Store.get(`wird_progress_${todayKey()}`, 0); // in "units" chosen
    let totalPages = Store.get('wird_total_pages', 0);

    function refreshChipsUI(){
      chips.forEach(c => {
        const match = goal && c.dataset.unit === goal.unit && +c.dataset.amount === goal.amount;
        c.classList.toggle('active', !!match);
      });
    }
    function refreshUI(){
      if(goal){
        goalLabel.textContent = `${goal.amount} ${unitLabels[goal.unit]}${goal.amount>1 && goal.unit==='page' ? '' : ''}`;
        stepLabel.textContent = `قراءة وحدة واحدة (${unitLabels[goal.unit]})`;
      } else {
        goalLabel.textContent = 'لم يُحدد بعد';
        stepLabel.textContent = 'اختر وردك أولاً';
      }
      todayValue.textContent = todayProgress;
      todayUnit.textContent = goal ? unitLabels[goal.unit] : '';
      const pct = goal ? Math.min(todayProgress / goal.amount, 1) : 0;
      ringFill.style.strokeDashoffset = RING_CIRCUM * (1 - pct);
      totalValueEl.textContent = totalPages;
      refreshChipsUI();
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        goal = { unit: chip.dataset.unit, amount: +chip.dataset.amount };
        Store.set('wird_goal', goal);
        refreshUI();
      });
    });

    document.getElementById('wirdPlus').addEventListener('click', () => {
      if(!goal) return;
      todayProgress += 1;
      Store.set(`wird_progress_${todayKey()}`, todayProgress);
      const pagesEquivalent = unitToPages[goal.unit];
      totalPages += pagesEquivalent;
      Store.set('wird_total_pages', totalPages);
      refreshHasanatDisplay();
      refreshUI();
    });
    document.getElementById('wirdMinus').addEventListener('click', () => {
      if(!goal || todayProgress <= 0) return;
      todayProgress -= 1;
      Store.set(`wird_progress_${todayKey()}`, todayProgress);
      const pagesEquivalent = unitToPages[goal.unit];
      totalPages = Math.max(0, totalPages - pagesEquivalent);
      Store.set('wird_total_pages', totalPages);
      refreshHasanatDisplay();
      refreshUI();
    });

    refreshUI();
  })();

  /* =====================================================
     GENERIC TAP-COUNTER FACTORY (Salawat / Istighfar / Tasbih)
     ===================================================== */
  function buildFormulaList(container, formulas){
    container.innerHTML = formulas.map(f => `<div class="formula-card"><p>${f}</p></div>`).join('');
  }

  /* ---- Salawat ---- */
  buildFormulaList(document.getElementById('salawatFormulas'), SALAWAT_FORMULAS);
  (function initSalawat(){
    const numEl = document.getElementById('salawatNumber');
    const btn = document.getElementById('salawatCounter');
    let count = Store.get('salawat_count', 0);
    numEl.textContent = count;
    document.querySelector('[data-progress="salawat"]').textContent = count;

    btn.addEventListener('click', () => {
      count += 1;
      Store.set('salawat_count', count);
      numEl.textContent = count;
      document.querySelector('[data-progress="salawat"]').textContent = count;
      btn.classList.remove('pulse'); void btn.offsetWidth; btn.classList.add('pulse');
      refreshHasanatDisplay();
    });
    document.getElementById('salawatReset').addEventListener('click', () => {
      count = 0; Store.set('salawat_count', 0);
      numEl.textContent = 0;
      document.querySelector('[data-progress="salawat"]').textContent = 0;
      refreshHasanatDisplay();
    });
  })();

  /* ---- Istighfar ---- */
  buildFormulaList(document.getElementById('istighfarFormulas'), ISTIGHFAR_FORMULAS);
  (function initIstighfar(){
    const numEl = document.getElementById('istighfarNumber');
    const btn = document.getElementById('istighfarCounter');
    const flash = document.getElementById('istighfarFlash');
    let count = Store.get('istighfar_count', 0);
    numEl.textContent = count;
    document.querySelector('[data-progress="istighfar"]').textContent = count;

    btn.addEventListener('click', () => {
      count += 1;
      Store.set('istighfar_count', count);
      numEl.textContent = count;
      document.querySelector('[data-progress="istighfar"]').textContent = count;
      btn.classList.remove('pulse'); void btn.offsetWidth; btn.classList.add('pulse');
      if(count % 33 === 0){
        flash.classList.add('show');
        setTimeout(()=> flash.classList.remove('show'), 1800);
      }
      refreshHasanatDisplay();
    });
    document.getElementById('istighfarReset').addEventListener('click', () => {
      count = 0; Store.set('istighfar_count', 0);
      numEl.textContent = 0;
      document.querySelector('[data-progress="istighfar"]').textContent = 0;
      refreshHasanatDisplay();
    });
  })();

  /* ---- Digital Tasbih (multi-mode, separate counts per mode) ---- */
  (function initTasbih(){
    const modesWrap = document.getElementById('dhikrModes');
    const numEl = document.getElementById('tasbihNumber');
    const textEl = document.getElementById('tasbihCurrentText');
    const btn = document.getElementById('tasbihCounter');

    let counts = Store.get('tasbih_counts', TASBIH_MODES.map(()=>0));
    if(counts.length !== TASBIH_MODES.length) counts = TASBIH_MODES.map(()=>0);
    let activeIdx = Store.get('tasbih_active_idx', 0);

    modesWrap.innerHTML = TASBIH_MODES.map((m,i) => `<button class="dhikr-chip" data-idx="${i}">${m}</button>`).join('');

    function refreshTotalBadge(){
      const total = counts.reduce((a,b)=>a+b,0);
      Store.set('tasbih_total_count', total);
      document.querySelector('[data-progress="tasbih"]').textContent = total;
    }

    function render(){
      modesWrap.querySelectorAll('.dhikr-chip').forEach((c,i) => c.classList.toggle('active', i===activeIdx));
      textEl.textContent = TASBIH_MODES[activeIdx];
      numEl.textContent = counts[activeIdx];
      refreshTotalBadge();
    }

    modesWrap.querySelectorAll('.dhikr-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        activeIdx = +chip.dataset.idx;
        Store.set('tasbih_active_idx', activeIdx);
        render();
      });
    });

    btn.addEventListener('click', () => {
      counts[activeIdx] += 1;
      Store.set('tasbih_counts', counts);
      btn.classList.remove('pulse'); void btn.offsetWidth; btn.classList.add('pulse');
      render();
      refreshHasanatDisplay();
    });
    document.getElementById('tasbihReset').addEventListener('click', () => {
      counts[activeIdx] = 0;
      Store.set('tasbih_counts', counts);
      render();
      refreshHasanatDisplay();
    });

    render();
  })();

  /* ---- Sticky header shrink on scroll (subtle) ---- */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 20 ? '0 6px 24px rgba(11,77,60,0.06)' : 'none';
  });

  /* ---- Initial hasanat display ---- */
  refreshHasanatDisplay();
});