// ==========================================================================
// SYSTEM DATABASE: Authentic Islamic Content Models
// ==========================================================================
const MORNING_AZKAR_DATA = [
    { id: "m1", text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", ref: "رواه مسلم", count: 1, reward: "من قالها حين يصبح حُفظ حتى يمسي" },
    { id: "m2", text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.", ref: "رواه الترمذي", count: 1 },
    { id: "m3", text: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.", ref: "رواه البخاري (سيد الاستغفار)", count: 1, reward: "من قالها موقناً بها ومات من يومه دخل الجنة" },
    { id: "m4", text: "سُبْحَانَ اللهِ وَبِحَمْدِهِ: عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ.", ref: "رواه مسلم", count: 3 }
];

const EVENING_AZKAR_DATA = [
    { id: "e1", text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.", ref: "رواه مسلم", count: 1, reward: "من قالها حين يمسي حُفظ حتى يصبح" },
    { id: "e2", text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.", ref: "رواه الترمذي", count: 1 },
    { id: "e3", text: "أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.", ref: "رواه مسلم", count: 3, reward: "من قالها حين يمسي لم تضره حمة تلك الليلة" },
    { id: "e4", text: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.", ref: "رواه الحاكم", count: 3 }
];

// State Manager (Memory Architecture mapped directly to LocalStorage)
let appState = {
    theme: 'light',
    morningProgress: {},
    eveningProgress: {},
    quranGoalName: 'لم يحدد بعد',
    quranGoalPages: 0,
    quranCurrentCount: 0,
    salawatCount: 0,
    istighfarCount: 0,
    tasbihMemory: { subhan: 0, hamd: 0, allah_akbar: 0, tawheed: 0, hawqala: 0, subhan_bihamdihi: 0 }
};

// ==========================================================================
// CORE APPLICATION LIFE-CYCLE CONTROLLER
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    loadStateFromStorage();
    initializeTheme();
    setupEventListeners();
    renderAzkarLists();
    
    // Smooth Application Entrance Dismissing the Loader Frame
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.style.opacity = '0';
        setTimeout(() => loader.style.visibility = 'hidden', 500);
    }, 600);
});

// Sync State Manager with Native LocalStorage Subsystems
function loadStateFromStorage() {
    const savedState = localStorage.getItem('al_athar_salih_state');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            appState = { ...appState, ...parsed };
        } catch (e) { console.error("Memory parsing failure. Resetting engine.", e); }
    }
}

function saveStateToStorage() {
    localStorage.setItem('al_athar_salih_state', JSON.stringify(appState));
}

// ==========================================================================
// THEME CORE INTERFACE MANAGEMENT
// ==========================================================================
function initializeTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#theme-toggle i');
    if (appState.theme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        themeIcon.className = 'fa-solid fa-moon';
    }
}

function setupEventListeners() {
    // Theme Switch Trigger Logic
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const body = document.body;
        const themeIcon = document.querySelector('#theme-toggle i');
        
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            themeIcon.className = 'fa-solid fa-sun';
            appState.theme = 'dark';
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            themeIcon.className = 'fa-solid fa-moon';
            appState.theme = 'light';
        }
        saveStateToStorage();
    });

    // Hero Action System Anchor
    document.getElementById('start-btn').addEventListener('click', () => {
        document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
    });
}

// ==========================================================================
// ROUTING LAYER / DYNAMIC MULTI-VIEW OVERLAYS SYSTEM
// ==========================================================================
function openPage(pageId) {
    const overlay = document.getElementById('sub-page-overlay');
    const allPages = document.querySelectorAll('.sub-page');
    
    allPages.forEach(p => p.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Lock primary root window axis

    // Run custom contextual UI Sync
    if(pageId === 'quran-wird-page') syncQuranUI();
    if(pageId === 'salawat-page') syncSimpleCounterUI('salawat');
    if(pageId === 'istighfar-page') syncSimpleCounterUI('istighfar');
    if(pageId === 'tasbih-page') onTasbihDhikrChange();
}

function closeActivePage() {
    document.getElementById('sub-page-overlay').classList.add('hidden');
    document.body.style.overflow = 'auto'; // Release viewport constraint
}

// ==========================================================================
// AZKAR PROCESSING ENGINE
// ==========================================================================
function renderAzkarLists() {
    renderSingleAzkarType(MORNING_AZKAR_DATA, 'morning-list', 'morningProgress', updateMorningProgressBar);
    renderSingleAzkarType(EVENING_AZKAR_DATA, 'evening-list', 'eveningProgress', updateEveningProgressBar);
}

function renderSingleAzkarType(dataset, targetContainerId, stateKey, progressCallback) {
    const container = document.getElementById(targetContainerId);
    container.innerHTML = '';

    dataset.forEach(item => {
        const remaining = appState[stateKey][item.id] !== undefined ? appState[stateKey][item.id] : item.count;
        const isCompleted = remaining === 0;

        const card = document.createElement('div');
        card.className = `azkar-card ${isCompleted ? 'completed' : ''}`;
        card.id = `card-${item.id}`;

        let rewardHTML = item.reward ? `<p class="azkar-reward">${item.reward}</p>` : '';

        card.innerHTML = `
            <p class="azkar-text">${item.text}</p>
            <p class="azkar-ref">${item.ref}</p>
            ${rewardHTML}
            <div class="azkar-footer-row">
                <span id="badge-${item.id}" class="azkar-badge-complete ${isCompleted ? '' : 'hidden'}">
                    <i class="fa-solid fa-circle-check"></i> تم الذكر
                </span>
                <span id="pill-${item.id}" class="azkar-counter-pill">المتبقي: ${remaining}</span>
            </div>
        `;

        // Interactive Click Engine bound to specific card reference
        card.addEventListener('click', () => {
            let currentRemaining = appState[stateKey][item.id] !== undefined ? appState[stateKey][item.id] : item.count;
            if (currentRemaining > 0) {
                currentRemaining--;
                appState[stateKey][item.id] = currentRemaining;
                
                // Active Pulse feedback animation trigger
                card.style.transform = 'scale(0.97)';
                setTimeout(() => card.style.transform = 'none', 100);

                if (currentRemaining === 0) {
                    card.classList.add('completed');
                    document.getElementById(`badge-${item.id}`).classList.remove('hidden');
                    // Smooth structural translation down the axis to allow next element perception
                    setTimeout(() => {
                        card.parentNode.appendChild(card);
                    }, 400);
                }
                
                document.getElementById(`pill-${item.id}`).innerText = `المتبقي: ${currentRemaining}`;
                saveStateToStorage();
                progressCallback();
            }
        });

        container.appendChild(card);
    });
    progressCallback();
}

function updateMorningProgressBar() {
    calculateAndRenderProgress(MORNING_AZKAR_DATA, 'morningProgress', 'morning-progress', 'morning-progress-text');
}

function updateEveningProgressBar() {
    calculateAndRenderProgress(EVENING_AZKAR_DATA, 'eveningProgress', 'evening-progress', 'evening-progress-text');
}

function calculateAndRenderProgress(dataset, stateKey, progressBarId, progressTextId) {
    let totalTarget = dataset.length;
    let totalDone = 0;

    dataset.forEach(item => {
        const rem = appState[stateKey][item.id] !== undefined ? appState[stateKey][item.id] : item.count;
        if(rem === 0) totalDone++;
    });

    const percentage = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0;
    document.getElementById(progressBarId).style.width = `${percentage}%`;
    document.getElementById(progressTextId).innerText = `${percentage}%`;
}

// ==========================================================================
// QURAN WORKFLOW MANAGER
// ==========================================================================
function syncQuranUI() {
    document.getElementById('current-wird-goal').innerText = appState.quranGoalName;
    document.getElementById('quran-page-count').innerText = appState.quranCurrentCount;
    
    // Highlight Active configured UI State buttons safely
    const buttons = document.querySelectorAll('.wird-opt-btn');
    buttons.forEach(btn => {
        if(btn.innerText === appState.quranGoalName) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function setWirdGoal(goalName, pages) {
    appState.quranGoalName = goalName;
    appState.quranGoalPages = pages;
    saveStateToStorage();
    syncQuranUI();
}

function changeWirdCount(val) {
    appState.quranCurrentCount += val;
    if(appState.quranCurrentCount < 0) appState.quranCurrentCount = 0;
    saveStateToStorage();
    syncQuranUI();
    
    // Interactive feedback context mapping
    const display = document.getElementById('quran-page-count');
    display.style.transform = 'scale(1.2)';
    setTimeout(() => display.style.transform = 'none', 150);
}

function resetWirdCount() {
    appState.quranCurrentCount = 0;
    saveStateToStorage();
    syncQuranUI();
}

// ==========================================================================
// GENERALIZED COUNTERS PATTERN UTILITIES (Salawat & Istighfar Framework)
// ==========================================================================
function syncSimpleCounterUI(type) {
    const view = document.getElementById(`${type}-counter-view`);
    if(type === 'salawat') view.innerText = appState.salawatCount;
    if(type === 'istighfar') view.innerText = appState.istighfarCount;
}

function incrementCounter(type) {
    const view = document.getElementById(`${type}-counter-view`);
    if (type === 'salawat') appState.salawatCount++;
    if (type === 'istighfar') appState.istighfarCount++;
    
    saveStateToStorage();
    syncSimpleCounterUI(type);

    view.style.transform = 'scale(1.1)';
    setTimeout(() => view.style.transform = 'none', 80);
}

function resetCounter(type) {
    if (type === 'salawat') appState.salawatCount = 0;
    if (type === 'istighfar') appState.istighfarCount = 0;
    saveStateToStorage();
    syncSimpleCounterUI(type);
}

// ==========================================================================
// ADVANCED TASBIH CORE ENGINE
// ==========================================================================
function getCurrentSelectedTasbihKey() {
    return document.getElementById('tasbih-select').value;
}

function onTasbihDhikrChange() {
    const currentKey = getCurrentSelectedTasbihKey();
    const currentCount = appState.tasbihMemory[currentKey] || 0;
    document.getElementById('tasbih-counter-view').innerText = currentCount;
}

function incrementTasbih() {
    const currentKey = getCurrentSelectedTasbihKey();
    appState.tasbihMemory[currentKey] = (appState.tasbihMemory[currentKey] || 0) + 1;
    saveStateToStorage();
    
    const view = document.getElementById('tasbih-counter-view');
    view.innerText = appState.tasbihMemory[currentKey];
    
    view.style.transform = 'scale(1.1)';
    setTimeout(() => view.style.transform = 'none', 80);
}

function resetTasbih() {
    const currentKey = getCurrentSelectedTasbihKey();
    appState.tasbihMemory[currentKey] = 0;
    saveStateToStorage();
    document.getElementById('tasbih-counter-view').innerText = 0;
}// ==========================================================================
// SYSTEM DATABASE: Authentic Islamic Content Models (Extracted from Images)
// ==========================================================================
const MORNING_AZKAR_DATA = [
    { id: "m1", text: "قراءة آية الكرسي: (اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...)", ref: "مرة واحدة", count: 1 },
    { id: "m2", text: "قراءة: سورة الإخلاص، سورة الفلق، سورة الناس.", ref: "3 مرات", count: 3 },
    { id: "m3", text: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، رب أسألك خير ما في هذا اليوم وخير ما بعده، وأعوذ بك من شر هذا اليوم وشر ما بعده، رب أعوذ بك من الكسل وسوء الكبر، رب أعوذ بك من عذاب في النار وعذاب في القبر.", ref: "مرة واحدة", count: 1 },
    { id: "m4", text: "اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور.", ref: "مرة واحدة", count: 1 },
    { id: "m5", text: "اللهم إني أسألك العافية في الدنيا والآخرة، اللهم إني أسألك العفو والعافية في ديني ودنياي وأهلي ومالي، اللهم استر عوراتي، وآمن روعاتي، اللهم احفظني من بين يدي، ومن خلفي، وعن يميني، وعن شمالي، ومن فوقي، وأعوذ بعظمتك أن أغتال من تحتي.", ref: "مرة واحدة", count: 1 },
    { id: "m6", text: "اللهم فاطر السماوات والأرض، عالم الغيب والشهادة، لا إله إلا أنت، رب كل شيء ومليكه، أعوذ بك من شر نفسي ومن شر الشيطان وشركه، وأن أقترف على نفسي سوءاً، أو أجره إلى مسلم.", ref: "مرة واحدة", count: 1 },
    { id: "m7", text: "اللهم ما أصبح بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك، فلك الحمد، ولك الشكر.", ref: "مرة واحدة", count: 1 },
    { id: "m8", text: "اللهم إني أصبحت أشهدك، وأشهد حملة عرشك، وملائكتك، وجميع خلقك، أنك أنت الله لا إله إلا أنت، وحدك لا شريك لك، وأن محمداً عبدك ورسولك.", ref: "4 مرات", count: 4 },
    { id: "m9", text: "أصبحنا وأصبح الملك لله رب العالمين، اللهم إني أسألك خير هذا اليوم: فتحه، ونصره، ونوره، وبركته، وهداه، وأعوذ بك من شر ما فيه وشر ما بعده.", ref: "مرة واحدة", count: 1 },
    { id: "m10", text: "أصبحنا على فطرة الإسلام، وعلى كلمة الإخلاص، وعلى دين نبينا محمد ﷺ، وعلى ملة أبينا إبراهيم حنيفاً مسلماً وما كان من المشركين.", ref: "مرة واحدة", count: 1 },
    { id: "m11", text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت، اللهم إني أعوذ بك من الكفر والفقر، وأعوذ بك من عذاب القبر لا إله إلا أنت.", ref: "3 مرات", count: 3 },
    { id: "m12", text: "اللهم أنت ربي، لا إله إلا أنت خلقتني وأنا عبدك (أمتك)، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي فاغفر لي، فإنه لا يغفر الذنوب إلا أنت.", ref: "مرة واحدة (سيد الاستغفار)", count: 1 },
    { id: "m13", text: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم.", ref: "3 مرات", count: 3 },
    { id: "m14", text: "أعوذ بكلمات الله التامات من شر ما خلق.", ref: "3 مرات", count: 3 },
    { id: "m15", text: "رضيت بالله رباً، وبالإسلام ديناً، وبمحمد ﷺ نبياً.", ref: "3 مرات", count: 3 },
    { id: "m16", text: "سبحان الله وبحمده: عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته.", ref: "3 مرات", count: 3 },
    { id: "m17", text: "يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله، ولا تكلني إلى نفسي طرفة عين.", ref: "مرة واحدة", count: 1 },
    { id: "m18", text: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.", ref: "7 مرات", count: 7 },
    { id: "m19", text: "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملًا متقبلاً.", ref: "مرة واحدة", count: 1 },
    { id: "m20", text: "سبحان الله وبحمده.", ref: "100 مرة", count: 100 },
    { id: "m21", text: "أستغفر الله وأتوب إليه.", ref: "تم تعديلها إلى 10 مرات بناءً على طلبك", count: 10 },
    { id: "m22", text: "اللهم صلِ وسلم وبارك على نبينا محمد.", ref: "15 مرة", count: 15 }
];

const EVENING_AZKAR_DATA = [
    { id: "e1", text: "قراءة آية الكرسي: (اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...)", ref: "مرة واحدة", count: 1 },
    { id: "e2", text: "قراءة: سورة الإخلاص، سورة الفلق، سورة الناس.", ref: "3 مرات", count: 3 },
    { id: "e3", text: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير، رب أسألك خير ما في هذه الليلة وخير ما بعدها، وأعوذ بك من شر هذه الليلة وشر ما بعدها، رب أعوذ بك من الكسل وسوء الكبر، رب أعوذ بك من عذاب في النار وعذاب في القبر.", ref: "مرة واحدة", count: 1 },
    { id: "e4", text: "أمن الرسول بما أنزل إليه من ربه والمؤمنون كُلٌّ آمن بالله وملائكته وكتبه ورسله لا نفرق بين أحد من رسله وقالوا سمعنا وأطعنا غفرانك ربنا وإليك المصير لا يكلف الله نفساً إلا وسعها لها ما كسبت وعليها ما اكتسبت ربنا لا تؤاخذنا إن نسينا أو أخطأنا ربنا ولا تحمل علينا إصراً كما حملته على الذين من قبلنا ربنا ولا تحملنا ما لا طاقة لنا به واعف عنا واغفر لنا وارحمنا أنت مولانا فانصرنا على القوم الكافرين.", ref: "مرة واحدة (أواخر سورة البقرة)", count: 1 },
    { id: "e5", text: "أمسينا وأمسى الملك لله رب العالمين، اللهم إني أسألك خير هذه الليلة: فتحها، ونصرها، ونورها، وبركتها، وهداها، وأعوذ بك من شر ما فيها وشر ما بعدها.", ref: "مرة واحدة", count: 1 },
    { id: "e6", text: "أمسينا على فطرة الإسلام، وعلى كلمة الإخلاص، وعلى دين نبينا محمد ﷺ، وعلى ملة أبينا إبراهيم حنيفاً مسلماً وما كان من المشركين.", ref: "مرة واحدة", count: 1 },
    { id: "e7", text: "اللهم ما أمسى بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك، فلك الحمد، ولك الشكر.", ref: "مرة واحدة", count: 1 },
    { id: "e8", text: "اللهم إني أمسيت أشهدك، وأشهد حملة عرشك، وملائكتك، وجميع خلقك، أنك أنت الله لا إله إلا أنت، وحدك لا شريك لك، وأن محمداً عبدك ورسولك.", ref: "4 مرات", count: 4 },
    { id: "e9", text: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت، اللهم إني أعوذ بك من الكفر والفقر، وأعوذ بك من عذاب القبر لا إله إلا أنت.", ref: "3 مرات", count: 3 },
    { id: "e10", text: "اللهم أنت ربي، لا إله إلا أنت خلقتني وأنا عبدك (أمتك)، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي فاغفر لي، فإنه لا يغفر الذنوب إلا أنت.", ref: "مرة واحدة (سيد الاستغفار)", count: 1 },
    { id: "e11", text: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم.", ref: "3 مرات", count: 3 },
    { id: "e12", text: "اللهم إني أسألك العافية في الدنيا والآخرة، اللهم إني أسألك العفو والعافية في ديني ودنياي وأهلي ومالي، اللهم استر عوراتي، وآمن روعاتي، اللهم احفظني من بين يدي، ومن خلفي، وعن يميني، وعن شمالي، ومن فوقي، وأعوذ بعظمتك أن أغتال من تحتي.", ref: "مرة واحدة", count: 1 },
    { id: "e13", text: "اللهم فاطر السماوات والأرض، عالم الغيب والشهادة، لا إله إلا أنت، رب كل شيء ومليكه، أعوذ بك من شر نفسي ومن شر الشيطان وشركه، وأن أقترف على نفسي سوءاً، أو أجره إلى مسلم.", ref: "مرة واحدة", count: 1 },
    { id: "e14", text: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.", ref: "7 مرات", count: 7 },
    { id: "e15", text: "أعوذ بكلمات الله التامات من شر ما خلق.", ref: "3 مرات", count: 3 },
    { id: "e16", text: "رضيت بالله رباً، وبالإسلام ديناً، وبمحمد ﷺ نبياً.", ref: "3 مرات", count: 3 },
    { id: "e17", text: "سبحان الله وبحمده: عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته.", ref: "3 مرات", count: 3 },
    { id: "e18", text: "يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله، ولا تكلني إلى نفسي طرفة عين.", ref: "مرة واحدة", count: 1 },
    { id: "e19", text: "اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير.", ref: "مرة واحدة", count: 1 },
    { id: "e20", text: "سبحان الله وبحمده.", ref: "100 مرة", count: 100 },
    { id: "e21", text: "أستغفر الله وأتوب إليه.", ref: "تم تعديلها إلى 10 مرات بناءً على طلبك", count: 10 },
    { id: "e22", text: "اللهم صلِ وسلم وبارك على نبينا محمد.", ref: "15 مرة", count: 15 }
];