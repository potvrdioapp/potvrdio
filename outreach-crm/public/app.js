// Potvrdio Outreach CRM Frontend Logic

let allStores = [];
let currentStore = null;
let allTemplates = [];
let activeFollowUpFilter = 'all';
let activeStatusFilter = 'all';
let activePriorityFilter = 'all';
let searchQuery = '';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const clearSearch = document.getElementById('clearSearch');
const storeList = document.getElementById('storeList');
const storesCountLabel = document.getElementById('storesCountLabel');
const activeFilterBadge = document.getElementById('activeFilterBadge');
const followUpFilterLabel = document.getElementById('followUpFilterLabel');

// Filters
const followUpTabButtons = document.querySelectorAll('.followup-tab-btn');
const statusFilterSelect = document.getElementById('statusFilterSelect');
const priorityFilterSelect = document.getElementById('priorityFilterSelect');
const statFollowUpBadgeBtn = document.getElementById('statFollowUpBadgeBtn');
const statFollowUpDue = document.getElementById('statFollowUpDue');
const badgeFollowUpToday = document.getElementById('badgeFollowUpToday');
const badgeFollowUpTomorrow = document.getElementById('badgeFollowUpTomorrow');

const emptyDetailsState = document.getElementById('emptyDetailsState');
const storeDetailsContent = document.getElementById('storeDetailsContent');

// Store Details Elements
const detailStoreName = document.getElementById('detailStoreName');
const detailStoreWebsite = document.getElementById('detailStoreWebsite');
const detailStoreWebsiteLink = document.getElementById('detailStoreWebsiteLink');
const detailStorePriority = document.getElementById('detailStorePriority');
const detailStoreSector = document.getElementById('detailStoreSector');
const detailStoreCity = document.getElementById('detailStoreCity');
const detailStatusSelect = document.getElementById('detailStatusSelect');
const quickStatusActiveBadge = document.getElementById('quickStatusActiveBadge');
const quickStatusButtonsGroup = document.getElementById('quickStatusButtonsGroup');

// Follow-up Date Controls in Details
const detailFollowUpStatusBadge = document.getElementById('detailFollowUpStatusBadge');
const detailFollowUpInput = document.getElementById('detailFollowUpInput');
const detailSaveFollowUpBtn = document.getElementById('detailSaveFollowUpBtn');
const quickDateButtons = document.querySelectorAll('.quick-date-btn');

const detailHookNote = document.getElementById('detailHookNote');
const detailEmail = document.getElementById('detailEmail');
const detailEmailLink = document.getElementById('detailEmailLink');
const detailPhone = document.getElementById('detailPhone');
const detailPhoneLink = document.getElementById('detailPhoneLink');
const copyPhoneBtn = document.getElementById('copyPhoneBtn');
const directChatBox = document.getElementById('directChatBox');
const detailWhatsAppLink = document.getElementById('detailWhatsAppLink');
const detailViberLink = document.getElementById('detailViberLink');

const headerDirectChatGroup = document.getElementById('headerDirectChatGroup');
const headerWhatsAppBtn = document.getElementById('headerWhatsAppBtn');
const headerViberBtn = document.getElementById('headerViberBtn');

const detailLegalEntity = document.getElementById('detailLegalEntity');
const detailNotesInput = document.getElementById('detailNotesInput');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const communicationsFeed = document.getElementById('communicationsFeed');
const commCountBadge = document.getElementById('commCountBadge');
const detailTechStackText = document.getElementById('detailTechStackText');
const detailOpportunitiesInput = document.getElementById('detailOpportunitiesInput');
const saveOpportunitiesBtn = document.getElementById('saveOpportunitiesBtn');

// Modals
const commModal = document.getElementById('commModal');
const closeCommModal = document.getElementById('closeCommModal');
const cancelCommBtn = document.getElementById('cancelCommBtn');
const commForm = document.getElementById('commForm');
const btnAddCommunication = document.getElementById('btnAddCommunication');
const btnQuickAddLog = document.getElementById('btnQuickAddLog');

const templatesModal = document.getElementById('templatesModal');
const closeTemplatesModal = document.getElementById('closeTemplatesModal');
const btnOpenTemplates = document.getElementById('btnOpenTemplates');
const templateSelector = document.getElementById('templateSelector');
const templateEmailOutput = document.getElementById('templateEmailOutput');
const copyEmailBtn = document.getElementById('copyEmailBtn');
const copyEmailInputBtn = document.getElementById('copyEmailInputBtn');
const templateSubjectOutput = document.getElementById('templateSubjectOutput');
const templateBodyOutput = document.getElementById('templateBodyOutput');
const copySubjectBtn = document.getElementById('copySubjectBtn');
const copyBodyBtn = document.getElementById('copyBodyBtn');
const btnOpenMailClient = document.getElementById('btnOpenMailClient');
const btnOpenWhatsAppTemplate = document.getElementById('btnOpenWhatsAppTemplate');
const btnMarkSentAndLog = document.getElementById('btnMarkSentAndLog');

const newStoreModal = document.getElementById('newStoreModal');
const btnNewStore = document.getElementById('btnNewStore');
const closeNewStoreModal = document.getElementById('closeNewStoreModal');
const cancelNewStoreBtn = document.getElementById('cancelNewStoreBtn');
const newStoreForm = document.getElementById('newStoreForm');

// Status Map for Styling & Labels
const STATUS_CONFIG = {
  not_contacted: { label: 'Bekliyor', badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  email_sent: { label: 'E-posta Gönderildi', badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  waiting_reply: { label: 'Yanıt Bekleniyor', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  replied: { label: 'Yanıt Alındı', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  call_scheduled: { label: 'Görüşme Planlandı', badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  closed_beta: { label: 'Beta Tasarım Ortağı', badgeClass: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30' },
  on_hold: { label: 'Beklemede', badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  rejected: { label: 'İlgilenmiyor / Pas', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20' }
};

const CHANNEL_CONFIG = {
  email: { label: 'E-posta', icon: 'mail', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  whatsapp: { label: 'WhatsApp', icon: 'message-square', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  viber: { label: 'Viber', icon: 'message-circle', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  phone: { label: 'Telefon', icon: 'phone-call', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  sms: { label: 'SMS', icon: 'smartphone', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  note: { label: 'Dahili Not', icon: 'file-text', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  in_person: { label: 'Görüşme', icon: 'users', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
};

// Serbian Phone Normalization to E.164 without leading plus for URLs
function formatSerbianPhoneE164(phone) {
  if (!phone) return null;
  let digits = phone.replace(/[^0-9]/g, '');
  if (!digits) return null;
  if (digits.startsWith('381')) {
    return digits;
  }
  if (digits.startsWith('0')) {
    return '381' + digits.substring(1);
  }
  if (digits.length >= 8 && digits.length <= 9) {
    return '381' + digits;
  }
  return digits;
}

// Toast notification
function showToast(msg) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  toastMessage.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Format Date
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr.replace(' ', 'T'));
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Local YYYY-MM-DD Date Helper
function getLocalDateString(offsetDays = 0) {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Date Short TR Helper
function formatDateShortTR(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const dayNum = parseInt(parts[2], 10);
  const monthName = monthNames[parseInt(parts[1], 10) - 1] || parts[1];
  return `${dayNum} ${monthName}`;
}

// Follow-up Badge Helper
function formatFollowUpBadge(dateStr) {
  if (!dateStr) return null;
  const today = getLocalDateString(0);
  const tomorrow = getLocalDateString(1);

  const shortDate = formatDateShortTR(dateStr);

  if (dateStr < today) {
    return {
      text: `🚨 ${shortDate} (Gecikti)`,
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold',
      isOverdue: true
    };
  } else if (dateStr === today) {
    return {
      text: `⚡ Bugün (${shortDate})`,
      badgeClass: 'bg-amber-500/25 text-amber-300 border-amber-500/40 font-bold',
      isToday: true
    };
  } else if (dateStr === tomorrow) {
    return {
      text: `⏳ Yarın (${shortDate})`,
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-medium',
      isTomorrow: true
    };
  } else {
    return {
      text: `📅 ${shortDate}`,
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-700 font-mono',
      isFuture: true
    };
  }
}

// ---------------- INITIAL FETCH & STATS ----------------

async function fetchStats() {
  try {
    const res = await fetch('/api/stats');
    const data = await res.json();
    document.getElementById('statTotal').textContent = data.totalStores;
    document.getElementById('statP1').textContent = data.p1Count;
    document.getElementById('statContacted').textContent = data.contactedCount;
    document.getElementById('statClosedBeta').textContent = `${data.closedBetaCount} / 5`;
    if (statFollowUpDue) statFollowUpDue.textContent = data.followUpTodayAndPrior ?? '-';
    if (badgeFollowUpToday) badgeFollowUpToday.textContent = data.followUpTodayAndPrior ?? '-';
    if (badgeFollowUpTomorrow) badgeFollowUpTomorrow.textContent = data.followUpTomorrowAndPrior ?? '-';

    // Overdue Triage Bar Sync
    const overdueBar = document.getElementById('overdueTriageBar');
    const overdueLabel = document.getElementById('overdueCountLabel');
    if (overdueBar && overdueLabel) {
      const overdueCount = data.followUpTodayAndPrior || 0;
      if (overdueCount > 0) {
        overdueLabel.textContent = `${overdueCount} Takip Gecikmiş / Bugün`;
        overdueBar.classList.remove('hidden');
      } else {
        overdueBar.classList.add('hidden');
      }
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err);
  }
}

async function fetchTemplates() {
  try {
    const res = await fetch('/api/templates');
    allTemplates = await res.json();
    populateTemplateSelector();
  } catch (err) {
    console.error('Failed to fetch templates:', err);
  }
}

function getStoreSlug(store) {
  if (!store || !store.website) return '';
  return store.website.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/www\./, '').split('.')[0].toLowerCase();
}

function populateTemplateSelector() {
  if (!allTemplates.length) return;
  const storeSlug = currentStore ? getStoreSlug(currentStore) : '';
  const customSlug = 'custom-' + storeSlug;

  const customTemplate = allTemplates.find(t => t.slug === customSlug);
  const otherCustoms = allTemplates.filter(t => t.category === 'custom_tailored' && t.slug !== customSlug);
  const generalTemplates = allTemplates.filter(t => t.category !== 'custom_tailored');

  let html = '';

  if (customTemplate) {
    html += `
      <optgroup label="🌟 Bu Mağazaya Özel Kişiselleştirilmiş E-posta (Önerilen)">
        <option value="${customTemplate.slug}" selected>🎯 ${customTemplate.title}</option>
      </optgroup>
    `;
  }

  html += `
    <optgroup label="📋 Genel Outreach & Takip Şablonları">
      ${generalTemplates.map(t => `
        <option value="${t.slug}">${t.title}</option>
      `).join('')}
    </optgroup>
  `;

  if (otherCustoms.length > 0) {
    html += `
      <optgroup label="🏬 Diğer Mağaza Özel Şablonları">
        ${otherCustoms.map(t => `
          <option value="${t.slug}">${t.title}</option>
        `).join('')}
      </optgroup>
    `;
  }

  templateSelector.innerHTML = html;
}

async function fetchStores() {
  try {
    let url = `/api/stores?search=${encodeURIComponent(searchQuery)}`;
    
    if (activePriorityFilter !== 'all') {
      url += `&priority=${encodeURIComponent(activePriorityFilter)}`;
    }
    if (activeStatusFilter !== 'all') {
      url += `&status=${encodeURIComponent(activeStatusFilter)}`;
    }
    if (activeFollowUpFilter !== 'all') {
      url += `&follow_up=${encodeURIComponent(activeFollowUpFilter)}`;
    }

    const res = await fetch(url);
    allStores = await res.json();
    renderStoreList();

    // Auto-select first store if none selected or if current store not in list
    if (!currentStore && allStores.length > 0) {
      selectStore(allStores[0].id);
    } else if (currentStore) {
      const stillExists = allStores.find(s => s.id === currentStore.id);
      if (stillExists) {
        selectStore(currentStore.id, false);
      }
    }
  } catch (err) {
    console.error('Failed to fetch stores:', err);
  }
}

// ---------------- RENDER STORE LIST ----------------

function renderStoreList() {
  storesCountLabel.textContent = `${allStores.length} Mağaza Listeleniyor`;

  if (activeFilterBadge) {
    let badgeText = 'Tümü';
    if (activeFollowUpFilter === 'today_and_prior') badgeText = '🚨 Bugün & Öncesi';
    else if (activeFollowUpFilter === 'tomorrow_and_prior') badgeText = '⏳ Yarın & Öncesi';
    else if (activeFollowUpFilter === 'this_week') badgeText = '📅 Bu Hafta';
    else if (activeFollowUpFilter === 'has_follow_up') badgeText = '📌 Takipli';
    else if (activeFollowUpFilter === 'no_follow_up') badgeText = '⚪ Takipsiz';
    else if (activeStatusFilter !== 'all') badgeText = STATUS_CONFIG[activeStatusFilter]?.label || activeStatusFilter;
    else if (activePriorityFilter !== 'all') badgeText = activePriorityFilter === 'p1_verified' ? 'P1' : 'P2';
    activeFilterBadge.textContent = badgeText;
  }

  if (allStores.length === 0) {
    storeList.innerHTML = `
      <div class="p-8 text-center text-slate-500 text-xs space-y-1">
        <p class="font-medium text-slate-400">Eşleşen mağaza bulunamadı.</p>
        <p class="text-[11px] text-slate-500">Arama veya filtre kriterlerini değiştirin.</p>
      </div>
    `;
    return;
  }

  storeList.innerHTML = allStores.map(store => {
    const statusCfg = STATUS_CONFIG[store.status] || STATUS_CONFIG.not_contacted;
    const isSelected = currentStore && currentStore.id === store.id;
    const cleanDomain = store.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const followUpInfo = formatFollowUpBadge(store.follow_up_due);

    // Border highlight for urgent follow-ups
    const isUrgent = followUpInfo && (followUpInfo.isOverdue || followUpInfo.isToday);
    const borderClass = isSelected
      ? 'border-brand-500 bg-brand-500/10'
      : (isUrgent ? 'border-rose-500/35 bg-rose-950/15 hover:border-rose-500/50' : 'border-transparent hover:bg-darkHover');

    return `
      <div 
        data-store-id="${store.id}" 
        class="store-card p-3 rounded-xl cursor-pointer border transition-all ${borderClass} ${isSelected ? 'active' : ''}"
      >
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <h4 class="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>${store.name}</span>
              ${store.priority === 'p1_verified' 
                ? '<span class="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono">P1</span>' 
                : '<span class="text-[9px] px-1 py-0.2 rounded bg-slate-700/50 text-slate-400 font-mono">P2</span>'
              }
            </h4>
            <span class="text-[11px] text-slate-400 font-mono truncate block mt-0.5">${cleanDomain}</span>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full border font-medium whitespace-nowrap ${statusCfg.badgeClass}">
            ${statusCfg.label}
          </span>
        </div>

        <!-- Follow-up Alert Bar (Clickable to Reschedule / Set) -->
        <div class="mt-2 pt-1.5 flex items-center justify-between border-t border-darkBorder/40">
          ${followUpInfo ? `
            <button type="button" class="btn-card-reschedule text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1 font-semibold ${followUpInfo.badgeClass} hover:ring-1 hover:ring-brand-400 transition-all text-left" data-store-id="${store.id}" title="Takip tarihini güncelle / ertele">
              <i data-lucide="${followUpInfo.isOverdue ? 'alert-circle' : (followUpInfo.isToday ? 'clock' : 'calendar')}" class="w-3 h-3"></i>
              <span>${followUpInfo.text}</span>
              <i data-lucide="edit-3" class="w-2.5 h-2.5 opacity-60 ml-0.5"></i>
            </button>
          ` : `
            <button type="button" class="btn-card-reschedule text-[10px] px-1.5 py-0.5 rounded border border-darkBorder/70 text-slate-500 hover:text-brand-300 hover:border-brand-500/40 hover:bg-brand-500/10 flex items-center gap-1 transition-all" data-store-id="${store.id}" title="Bu mağazaya takip tarihi belirle">
              <i data-lucide="calendar-plus" class="w-3 h-3 text-slate-400"></i>
              <span>+ Takip Belirle</span>
            </button>
          `}
          <span class="text-[10px] text-slate-500 font-mono">${store.city || ''}</span>
        </div>

        <div class="flex items-center justify-between mt-2 pt-1.5 border-t border-darkBorder/40 text-[10px] text-slate-400">
          <div class="flex items-center gap-1.5 truncate max-w-[170px]">
            <span class="truncate text-slate-400">${store.sector || 'E-ticaret'}</span>
            ${store.phone ? `
              <span class="inline-flex items-center gap-0.5 text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.2 rounded font-mono shrink-0" title="WhatsApp & Viber Mevcut (${store.phone})">
                <i data-lucide="phone-call" class="w-2.5 h-2.5"></i>
                <span>Chat</span>
              </span>
            ` : ''}
          </div>
          <div class="flex items-center gap-2 font-mono">
            ${store.comm_count > 0 ? `
              <span class="flex items-center gap-1 text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                <i data-lucide="message-square" class="w-2.5 h-2.5"></i>
                <span>${store.comm_count}</span>
              </span>
            ` : ''}
            <span>${store.city || 'Sırbistan'}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();

  // Attach card reschedule button events
  storeList.querySelectorAll('.btn-card-reschedule').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Don't trigger selectStore
      const id = parseInt(btn.dataset.storeId, 10);
      openCardRescheduleModal(id);
    });
  });

  // Attach click events
  storeList.querySelectorAll('.store-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.storeId, 10);
      selectStore(id);
    });
  });
}

// ---------------- SELECT & DISPLAY STORE ----------------

async function selectStore(id, fetchComms = true) {
  try {
    const res = await fetch(`/api/stores/${id}`);
    if (!res.ok) return;
    
    currentStore = await res.json();

    // Toggle active class on cards
    storeList.querySelectorAll('.store-card').forEach(c => {
      c.classList.toggle('active', parseInt(c.dataset.storeId, 10) === id);
    });

    emptyDetailsState.classList.add('hidden');
    storeDetailsContent.classList.remove('hidden');

    // Populate Right Panel Header
    detailStoreName.textContent = currentStore.name;
    const cleanDomain = currentStore.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
    detailStoreWebsite.textContent = cleanDomain;
    detailStoreWebsiteLink.href = currentStore.website;

    detailStorePriority.textContent = currentStore.priority === 'p1_verified' ? 'P1 · Doğrulanmış WooCommerce' : 'P2 · İkincil Havuz';
    detailStorePriority.className = currentStore.priority === 'p1_verified' 
      ? 'text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-indigo-500/10 text-indigo-300 border-indigo-500/20' 
      : 'text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-800 text-slate-400 border-slate-700';

    detailStoreSector.querySelector('span').textContent = currentStore.sector || 'Genel E-Ticaret';
    detailStoreCity.querySelector('span').textContent = currentStore.city || 'Sırbistan Geneli';
    
    // Status Select & Quick Buttons Sync
    detailStatusSelect.value = currentStore.status;
    const stCfg = STATUS_CONFIG[currentStore.status] || STATUS_CONFIG.not_contacted;
    if (quickStatusActiveBadge) {
      quickStatusActiveBadge.textContent = stCfg.label;
      quickStatusActiveBadge.className = `text-[10px] font-semibold px-2 py-0.2 rounded-full border ${stCfg.badgeClass}`;
    }
    if (quickStatusButtonsGroup) {
      quickStatusButtonsGroup.querySelectorAll('button').forEach(btn => {
        const isAct = btn.dataset.statusBtn === currentStore.status;
        btn.classList.toggle('ring-2', isAct);
        btn.classList.toggle('ring-brand-500', isAct);
        btn.classList.toggle('bg-brand-600/30', isAct);
        btn.classList.toggle('border-brand-500', isAct);
        btn.classList.toggle('text-white', isAct);
      });
    }

    // Follow-up Date Controls Sync
    syncDetailFollowUpUI(currentStore.follow_up_due);

    // Hook Note & Contact Info
    detailHookNote.textContent = currentStore.hook_note || 'Henüz özel saha notu girilmemiş.';
    detailEmail.textContent = currentStore.email || '(Açık E-posta Yok)';
    detailEmailLink.href = currentStore.email ? `mailto:${currentStore.email}` : '#';
    
    detailPhone.textContent = currentStore.phone || '(Telefon Belirtilmemiş)';
    detailPhoneLink.href = currentStore.phone ? `tel:${currentStore.phone}` : '#';

    // Direct WhatsApp & Viber Actions
    if (currentStore.phone) {
      const e164 = formatSerbianPhoneE164(currentStore.phone);
      if (e164) {
        const waUrl = `https://wa.me/${e164}`;
        const viberUrl = `viber://chat?number=%2B${e164}`;

        detailWhatsAppLink.href = waUrl;
        detailViberLink.href = viberUrl;
        directChatBox.classList.remove('hidden');

        headerWhatsAppBtn.href = waUrl;
        headerViberBtn.href = viberUrl;
        headerDirectChatGroup.classList.remove('hidden');
        headerDirectChatGroup.classList.add('flex');
      } else {
        directChatBox.classList.add('hidden');
        headerDirectChatGroup.classList.add('hidden');
        headerDirectChatGroup.classList.remove('flex');
      }
    } else {
      directChatBox.classList.add('hidden');
      headerDirectChatGroup.classList.add('hidden');
      headerDirectChatGroup.classList.remove('flex');
    }

    detailLegalEntity.textContent = currentStore.legal_entity || currentStore.city || '-';
    detailNotesInput.value = currentStore.notes || '';

    // Populate Tech Stack & Opportunities
    detailTechStackText.textContent = currentStore.tech_stack || 'WooCommerce Standart';
    detailOpportunitiesInput.value = currentStore.growth_opportunities || '';

    // Render Timeline Feed
    renderTimeline(currentStore.communications || []);

    lucide.createIcons();
  } catch (err) {
    console.error('Failed to select store:', err);
  }
}

// ---------------- RENDER TIMELINE ----------------

function renderTimeline(communications) {
  commCountBadge.textContent = communications.length;

  if (communications.length === 0) {
    communicationsFeed.innerHTML = `
      <div class="relative z-10 bg-darkBg/60 border border-darkBorder rounded-xl p-5 text-center text-xs text-slate-500 space-y-1">
        <p class="font-medium text-slate-400">Henüz kayıtlı bir iletişim veya mesaj bulunmuyor.</p>
        <p class="text-[11px]">Yukarıdaki "Outreach Şablonu" veya "İletişim Kaydet" butonu ile ilk e-posta veya görüşmeyi kaydedin.</p>
      </div>
    `;
    return;
  }

  communicationsFeed.innerHTML = communications.map(c => {
    const channelCfg = CHANNEL_CONFIG[c.channel] || CHANNEL_CONFIG.email;
    const isOutbound = c.direction === 'outbound';
    const directionBadge = isOutbound
      ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-semibold uppercase">Giden</span>'
      : (c.direction === 'inbound' 
        ? '<span class="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold uppercase">Gelen Yanıt</span>'
        : '<span class="text-[9px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300 font-semibold uppercase">Not</span>');

    return `
      <div class="relative z-10 pl-8 pb-4">
        <!-- Timeline Icon Node -->
        <div class="absolute left-3 top-1 -translate-x-1/2 w-6 h-6 rounded-full ${channelCfg.color} border flex items-center justify-center shadow-md">
          <i data-lucide="${channelCfg.icon}" class="w-3 h-3"></i>
        </div>

        <div class="bg-darkBg/90 border border-darkBorder rounded-xl p-4 shadow-sm hover:border-darkBorder/80 transition-all space-y-2">
          <!-- Card Header -->
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-2">
              ${directionBadge}
              <span class="text-xs font-bold text-white">${c.subject || channelCfg.label}</span>
            </div>
            <div class="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>${formatDate(c.timestamp)}</span>
              <button data-delete-comm="${c.id}" title="Kaydı Sil" class="text-slate-600 hover:text-rose-400 p-0.5 transition-colors">
                <i data-lucide="trash-2" class="w-3 h-3"></i>
              </button>
            </div>
          </div>

          <!-- Message Body -->
          <div class="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed bg-darkBg/50 p-3 rounded-lg border border-darkBorder/50 max-h-60 overflow-y-auto">
            ${escapeHtml(c.content)}
          </div>

          <!-- Follow-up Notice if due -->
          ${c.follow_up_due ? `
            <div class="flex items-center gap-1.5 text-[11px] text-amber-400 font-medium pt-1">
              <i data-lucide="calendar" class="w-3 h-3"></i>
              <span>Takip Tarihi: ${c.follow_up_due}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Attach delete handlers
  communicationsFeed.querySelectorAll('[data-delete-comm]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const commId = btn.dataset.deleteComm;
      if (confirm('Bu iletişim kaydını silmek istediğinizden emin misiniz?')) {
        await fetch(`/api/communications/${commId}`, { method: 'DELETE' });
        showToast('Kayıt silindi.');
        selectStore(currentStore.id);
        fetchStats();
      }
    });
  });

  lucide.createIcons();
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------------- EVENT LISTENERS ----------------

// 1. Search & Filter Input
searchInput.addEventListener('input', (e) => {
  searchQuery = e.target.value;
  clearSearch.classList.toggle('hidden', !searchQuery);
  fetchStores();
});

clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  clearSearch.classList.add('hidden');
  fetchStores();
});

// Helper: Update filter summary label
function updateFilterLabel() {
  if (followUpFilterLabel) {
    let lbl = 'Tüm takipler';
    if (activeFollowUpFilter === 'today_and_prior') lbl = 'Bugün ve öncesi';
    else if (activeFollowUpFilter === 'tomorrow_and_prior') lbl = 'Yarın ve öncesi';
    else if (activeFollowUpFilter === 'this_week') lbl = 'Bu hafta';
    else if (activeFollowUpFilter === 'has_follow_up') lbl = 'Tüm takipli olanlar';
    else if (activeFollowUpFilter === 'no_follow_up') lbl = 'Takipsiz mağazalar';
    followUpFilterLabel.textContent = lbl;
  }
}

// 2. Follow-Up Tab Filter Buttons
followUpTabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    followUpTabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFollowUpFilter = btn.dataset.followup;
    updateFilterLabel();
    fetchStores();
  });
});

// 2b. Top Bar Urgent Follow-up Badge Button Click -> Filter to Today & Prior
if (statFollowUpBadgeBtn) {
  statFollowUpBadgeBtn.addEventListener('click', () => {
    activeFollowUpFilter = 'today_and_prior';
    followUpTabButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.followup === 'today_and_prior');
    });
    updateFilterLabel();
    fetchStores();
    showToast('🚨 Bugün ve öncesi takipleri filtrelendi.');
  });
}

// 2c. Status & Priority Dropdown Filters
if (statusFilterSelect) {
  statusFilterSelect.addEventListener('change', () => {
    activeStatusFilter = statusFilterSelect.value;
    fetchStores();
  });
}

if (priorityFilterSelect) {
  priorityFilterSelect.addEventListener('change', () => {
    activePriorityFilter = priorityFilterSelect.value;
    fetchStores();
  });
}

// 3. Status Management Functions & Listeners
async function updateStoreStatus(newStatus) {
  if (!currentStore) return;
  try {
    const res = await fetch(`/api/stores/${currentStore.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      currentStore.status = newStatus;
      detailStatusSelect.value = newStatus;
      
      const stCfg = STATUS_CONFIG[newStatus] || STATUS_CONFIG.not_contacted;
      if (quickStatusActiveBadge) {
        quickStatusActiveBadge.textContent = stCfg.label;
        quickStatusActiveBadge.className = `text-[10px] font-semibold px-2 py-0.2 rounded-full border ${stCfg.badgeClass}`;
      }
      if (quickStatusButtonsGroup) {
        quickStatusButtonsGroup.querySelectorAll('button').forEach(btn => {
          const isAct = btn.dataset.statusBtn === newStatus;
          btn.classList.toggle('ring-2', isAct);
          btn.classList.toggle('ring-brand-500', isAct);
          btn.classList.toggle('bg-brand-600/30', isAct);
          btn.classList.toggle('border-brand-500', isAct);
          btn.classList.toggle('text-white', isAct);
        });
      }

      showToast(`Durum güncellendi: ${stCfg.label}`);

      const idx = allStores.findIndex(s => s.id === currentStore.id);
      if (idx !== -1) {
        allStores[idx].status = newStatus;
      }
      renderStoreList();
      fetchStats();
    } else {
      showToast('Durum güncellenemedi.');
    }
  } catch (err) {
    console.error('Failed to update status:', err);
    showToast('Hata: Durum güncellenemedi.');
  }
}

// Header Dropdown Status Change
detailStatusSelect.addEventListener('change', () => {
  updateStoreStatus(detailStatusSelect.value);
});

// Quick Action Bar Status Buttons
if (quickStatusButtonsGroup) {
  quickStatusButtonsGroup.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const st = btn.dataset.statusBtn;
      if (st) updateStoreStatus(st);
    });
  });
}

// 3b. Follow-Up Date Management Functions & Listeners

function highlightActiveQuickDateBtn(dateVal) {
  if (!quickDateButtons) return;
  quickDateButtons.forEach(btn => {
    const act = btn.dataset.quickDate;
    let target = null;
    if (act === 'today') target = getLocalDateString(0);
    else if (act === 'tomorrow') target = getLocalDateString(1);
    else if (act === '+2') target = getLocalDateString(2);
    else if (act === '+3') target = getLocalDateString(3);
    else if (act === '+7') target = getLocalDateString(7);
    else if (act === '+14') target = getLocalDateString(14);

    const isMatch = !!dateVal && !!target && dateVal === target;
    btn.classList.toggle('ring-1', isMatch);
    btn.classList.toggle('ring-brand-400', isMatch);
    btn.classList.toggle('bg-brand-600/30', isMatch);
    btn.classList.toggle('text-white', isMatch);
  });
}

function syncDetailFollowUpUI(dateVal) {
  if (detailFollowUpInput) {
    detailFollowUpInput.value = dateVal || '';
  }

  if (detailFollowUpStatusBadge) {
    const fuInfo = formatFollowUpBadge(dateVal);
    if (fuInfo) {
      detailFollowUpStatusBadge.textContent = fuInfo.text;
      detailFollowUpStatusBadge.className = `text-[10px] font-mono px-2 py-0.5 rounded-full border ${fuInfo.badgeClass}`;
    } else {
      detailFollowUpStatusBadge.textContent = 'Takip Planlanmamış';
      detailFollowUpStatusBadge.className = 'text-[10px] font-mono px-2 py-0.5 rounded-full border border-darkBorder text-slate-500';
    }
  }

  highlightActiveQuickDateBtn(dateVal);
}

async function updateStoreFollowUp(newDate) {
  if (!currentStore) return;
  try {
    const val = newDate || null;
    const res = await fetch(`/api/stores/${currentStore.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ follow_up_due: val })
    });

    if (res.ok) {
      currentStore.follow_up_due = val;
      syncDetailFollowUpUI(val);

      // Flash feedback indicator
      const feedbackEl = document.getElementById('detailFollowUpFeedback');
      if (feedbackEl) {
        feedbackEl.classList.remove('hidden');
        feedbackEl.classList.add('flex');
        setTimeout(() => {
          feedbackEl.classList.add('hidden');
          feedbackEl.classList.remove('flex');
        }, 2200);
      }

      showToast(val ? `Takip tarihi güncellendi: ${formatDateShortTR(val)} (${val})` : 'Takip tarihi kaldırıldı.');

      const idx = allStores.findIndex(s => s.id === currentStore.id);
      if (idx !== -1) {
        allStores[idx].follow_up_due = val;
      }
      renderStoreList();
      fetchStats();
    } else {
      showToast('Takip tarihi kaydedilemedi.');
    }
  } catch (err) {
    console.error('Failed to update follow-up date:', err);
    showToast('Hata: Takip tarihi kaydedilemedi.');
  }
}

// Auto-save on datepicker change
if (detailFollowUpInput) {
  detailFollowUpInput.addEventListener('change', () => {
    updateStoreFollowUp(detailFollowUpInput.value);
  });
  detailFollowUpInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      updateStoreFollowUp(detailFollowUpInput.value);
      detailFollowUpInput.blur();
    }
  });
}

// Manual Save Follow-Up Button
if (detailSaveFollowUpBtn) {
  detailSaveFollowUpBtn.addEventListener('click', () => {
    const val = detailFollowUpInput?.value;
    updateStoreFollowUp(val);
  });
}

// Quick Follow-Up Date Buttons in Detail View
quickDateButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.quickDate;
    if (action === 'today') {
      updateStoreFollowUp(getLocalDateString(0));
    } else if (action === 'tomorrow') {
      updateStoreFollowUp(getLocalDateString(1));
    } else if (action === '+2') {
      updateStoreFollowUp(getLocalDateString(2));
    } else if (action === '+3') {
      updateStoreFollowUp(getLocalDateString(3));
    } else if (action === '+7') {
      updateStoreFollowUp(getLocalDateString(7));
    } else if (action === '+14') {
      updateStoreFollowUp(getLocalDateString(14));
    } else if (action === 'clear') {
      updateStoreFollowUp(null);
    }
  });
});

// ---------------- CARD QUICK RESCHEDULE MODAL LOGIC ----------------
let targetRescheduleStore = null;

function openCardRescheduleModal(storeId) {
  const store = allStores.find(s => s.id === storeId);
  if (!store) return;
  targetRescheduleStore = store;

  const modal = document.getElementById('cardRescheduleModal');
  const nameEl = document.getElementById('cardRescheduleStoreName');
  const badgeEl = document.getElementById('cardRescheduleCurrentBadge');
  const customInput = document.getElementById('cardRescheduleCustomDate');

  if (nameEl) nameEl.textContent = store.name;
  if (badgeEl) {
    if (store.follow_up_due) {
      const fu = formatFollowUpBadge(store.follow_up_due);
      badgeEl.textContent = `Mevcut: ${fu ? fu.text : store.follow_up_due}`;
    } else {
      badgeEl.textContent = 'Mevcut: Takip planlanmamış';
    }
  }

  if (customInput) {
    customInput.value = store.follow_up_due || getLocalDateString(1);
  }

  // Update button sub-labels with actual dates
  const lToday = document.getElementById('labelQuickToday');
  const lTomorrow = document.getElementById('labelQuickTomorrow');
  const lPlus2 = document.getElementById('labelQuickPlus2');
  const lPlus3 = document.getElementById('labelQuickPlus3');
  const lPlus7 = document.getElementById('labelQuickPlus7');
  const lPlus14 = document.getElementById('labelQuickPlus14');

  if (lToday) lToday.textContent = formatDateShortTR(getLocalDateString(0));
  if (lTomorrow) lTomorrow.textContent = formatDateShortTR(getLocalDateString(1));
  if (lPlus2) lPlus2.textContent = formatDateShortTR(getLocalDateString(2));
  if (lPlus3) lPlus3.textContent = formatDateShortTR(getLocalDateString(3));
  if (lPlus7) lPlus7.textContent = formatDateShortTR(getLocalDateString(7));
  if (lPlus14) lPlus14.textContent = formatDateShortTR(getLocalDateString(14));

  if (modal) modal.classList.remove('hidden');
  lucide.createIcons();
}

async function applyCardReschedule(newDate) {
  if (!targetRescheduleStore) return;
  const storeId = targetRescheduleStore.id;
  const storeName = targetRescheduleStore.name;
  const val = newDate || null;

  try {
    const res = await fetch(`/api/stores/${storeId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ follow_up_due: val })
    });

    if (res.ok) {
      const modal = document.getElementById('cardRescheduleModal');
      if (modal) modal.classList.add('hidden');

      const idx = allStores.findIndex(s => s.id === storeId);
      if (idx !== -1) {
        allStores[idx].follow_up_due = val;
      }

      if (currentStore && currentStore.id === storeId) {
        currentStore.follow_up_due = val;
        syncDetailFollowUpUI(val);
      }

      showToast(val ? `${storeName}: Takip tarihi ${formatDateShortTR(val)} olarak ayarlandı!` : `${storeName}: Takip tarihi kaldırıldı.`);
      renderStoreList();
      fetchStats();
    } else {
      showToast('Takip tarihi güncellenemedi.');
    }
  } catch (err) {
    console.error('Failed to update follow-up from modal:', err);
    showToast('Hata: Takip tarihi güncellenemedi.');
  }
}

// Card Reschedule Modal listeners
document.querySelectorAll('.card-quick-date-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const act = btn.dataset.cardQuick;
    if (act === 'today') applyCardReschedule(getLocalDateString(0));
    else if (act === 'tomorrow') applyCardReschedule(getLocalDateString(1));
    else if (act === '+2') applyCardReschedule(getLocalDateString(2));
    else if (act === '+3') applyCardReschedule(getLocalDateString(3));
    else if (act === '+7') applyCardReschedule(getLocalDateString(7));
    else if (act === '+14') applyCardReschedule(getLocalDateString(14));
  });
});

const cardRescheduleSaveCustomBtn = document.getElementById('cardRescheduleSaveCustomBtn');
if (cardRescheduleSaveCustomBtn) {
  cardRescheduleSaveCustomBtn.addEventListener('click', () => {
    const customDate = document.getElementById('cardRescheduleCustomDate')?.value;
    applyCardReschedule(customDate);
  });
}

const cardRescheduleClearBtn = document.getElementById('cardRescheduleClearBtn');
if (cardRescheduleClearBtn) {
  cardRescheduleClearBtn.addEventListener('click', () => {
    applyCardReschedule(null);
  });
}

const closeCardRescheduleModal = document.getElementById('closeCardRescheduleModal');
if (closeCardRescheduleModal) {
  closeCardRescheduleModal.addEventListener('click', () => {
    document.getElementById('cardRescheduleModal')?.classList.add('hidden');
  });
}

const cardRescheduleCancelBtn = document.getElementById('cardRescheduleCancelBtn');
if (cardRescheduleCancelBtn) {
  cardRescheduleCancelBtn.addEventListener('click', () => {
    document.getElementById('cardRescheduleModal')?.classList.add('hidden');
  });
}

// ---------------- OVERDUE TRIAGE BULK RESCHEDULE ----------------
async function executeBulkPostpone(days, actionName) {
  try {
    const res = await fetch('/api/stores/bulk-follow-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'postpone_overdue', days })
    });
    const result = await res.json();
    if (res.ok) {
      showToast(`${result.updatedCount} geciken mağazanın takip tarihi ${actionName} ertelendi!`);
      await fetchStores();
      await fetchStats();
      if (currentStore) selectStore(currentStore.id);
    } else {
      showToast('Toplu erteleme işlemi başarısız oldu.');
    }
  } catch (err) {
    console.error('Bulk postpone error:', err);
    showToast('Hata: Toplu erteleme gerçekleştirilemedi.');
  }
}

const btnTriageToday = document.getElementById('btnTriageToday');
if (btnTriageToday) {
  btnTriageToday.addEventListener('click', () => executeBulkPostpone(0, 'Bugüne'));
}

const btnTriageTomorrow = document.getElementById('btnTriageTomorrow');
if (btnTriageTomorrow) {
  btnTriageTomorrow.addEventListener('click', () => executeBulkPostpone(1, 'Yarına'));
}

const btnTriage3Days = document.getElementById('btnTriage3Days');
if (btnTriage3Days) {
  btnTriage3Days.addEventListener('click', () => executeBulkPostpone(3, '+3 Güne'));
}

// 4. Save Internal Notes
saveNotesBtn.addEventListener('click', async () => {
  if (!currentStore) return;
  const newNotes = detailNotesInput.value.trim();
  try {
    const res = await fetch(`/api/stores/${currentStore.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: newNotes })
    });
    if (res.ok) {
      currentStore.notes = newNotes;
      showToast('Dahili notlar kaydedildi.');
    }
  } catch (err) {
    console.error('Failed to save notes:', err);
  }
});

// 4b. Save Growth Opportunities
saveOpportunitiesBtn.addEventListener('click', async () => {
  if (!currentStore) return;
  const newOpp = detailOpportunitiesInput.value.trim();
  try {
    const res = await fetch(`/api/stores/${currentStore.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ growth_opportunities: newOpp })
    });
    if (res.ok) {
      currentStore.growth_opportunities = newOpp;
      showToast('Geliştirme ve fırsat alanları kaydedildi.');
    }
  } catch (err) {
    console.error('Failed to save opportunities:', err);
  }
});

// 5. Copy Email & Phone buttons
document.getElementById('copyEmailBtn').addEventListener('click', () => {
  if (!currentStore?.email) return;
  navigator.clipboard.writeText(currentStore.email);
  showToast('E-posta kopyalandı: ' + currentStore.email);
});

document.getElementById('copyPhoneBtn').addEventListener('click', () => {
  if (!currentStore?.phone) return;
  navigator.clipboard.writeText(currentStore.phone);
  showToast('Telefon kopyalandı: ' + currentStore.phone);
});

// 6. Communication Modal
function openCommModal() {
  if (!currentStore) return;
  commForm.reset();
  
  // Default current date/time in local format
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('modalCommTimestamp').value = now.toISOString().slice(0, 16);
  
  // Default follow-up date in 2 days
  document.getElementById('modalCommFollowUp').value = getLocalDateString(2);
  
  document.getElementById('modalCommSubject').value = `Potvrda adrese za porudžbine pouzećem, ${currentStore.name}`;
  commModal.classList.remove('hidden');
}

// Modal Quick Date Buttons
document.querySelectorAll('.modal-quick-date-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const act = btn.dataset.modalQuickDate;
    const input = document.getElementById('modalCommFollowUp');
    if (!input) return;
    if (act === 'today') input.value = getLocalDateString(0);
    else if (act === 'tomorrow') input.value = getLocalDateString(1);
    else if (act === '+2') input.value = getLocalDateString(2);
    else if (act === '+3') input.value = getLocalDateString(3);
    else if (act === '+7') input.value = getLocalDateString(7);
    else if (act === 'clear') input.value = '';
  });
});

btnAddCommunication.addEventListener('click', openCommModal);
btnQuickAddLog.addEventListener('click', openCommModal);
closeCommModal.addEventListener('click', () => commModal.classList.add('hidden'));
cancelCommBtn.addEventListener('click', () => commModal.classList.add('hidden'));

commForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentStore) return;

  const payload = {
    channel: document.getElementById('modalCommChannel').value,
    direction: document.getElementById('modalCommDirection').value,
    timestamp: document.getElementById('modalCommTimestamp').value.replace('T', ' ') + ':00',
    follow_up_due: document.getElementById('modalCommFollowUp').value || null,
    subject: document.getElementById('modalCommSubject').value.trim(),
    content: document.getElementById('modalCommContent').value.trim(),
    update_status: document.getElementById('modalCommStatusUpdate').value || null
  };

  try {
    const res = await fetch(`/api/stores/${currentStore.id}/communications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      commModal.classList.add('hidden');
      showToast('İletişim başarıyla kaydedildi.');
      selectStore(currentStore.id);
      fetchStores();
      fetchStats();
    }
  } catch (err) {
    console.error('Failed to log communication:', err);
  }
});

// 7. Templates Modal
btnOpenTemplates.addEventListener('click', () => {
  if (!currentStore) return;
  populateTemplateSelector();
  renderTemplatePreview();

  // Reset template follow-up planner to +2 days by default
  const tplFollowUpInput = document.getElementById('templateFollowUpInput');
  const tplPreview = document.getElementById('templateFollowUpPreviewText');
  if (tplFollowUpInput) {
    const defaultDate = getLocalDateString(2);
    tplFollowUpInput.value = defaultDate;
    if (tplPreview) tplPreview.textContent = `${formatDateShortTR(defaultDate)} (+2 Gün)`;
  }
  document.querySelectorAll('.tpl-quick-date-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tplQuick === '+2');
    b.classList.toggle('bg-brand-600', b.dataset.tplQuick === '+2');
    b.classList.toggle('text-white', b.dataset.tplQuick === '+2');
  });

  templatesModal.classList.remove('hidden');
  lucide.createIcons();
});

// Template Quick Date Buttons
document.querySelectorAll('.tpl-quick-date-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const act = btn.dataset.tplQuick;
    const input = document.getElementById('templateFollowUpInput');
    const preview = document.getElementById('templateFollowUpPreviewText');
    if (!input) return;

    document.querySelectorAll('.tpl-quick-date-btn').forEach(b => {
      b.classList.remove('active', 'bg-brand-600', 'text-white');
      b.classList.add('bg-darkCard', 'text-slate-300');
    });
    btn.classList.add('active', 'bg-brand-600', 'text-white');
    btn.classList.remove('bg-darkCard', 'text-slate-300');

    if (act === '+1') {
      const d = getLocalDateString(1);
      input.value = d;
      if (preview) preview.textContent = `${formatDateShortTR(d)} (Yarın)`;
    } else if (act === '+2') {
      const d = getLocalDateString(2);
      input.value = d;
      if (preview) preview.textContent = `${formatDateShortTR(d)} (+2 Gün)`;
    } else if (act === '+3') {
      const d = getLocalDateString(3);
      input.value = d;
      if (preview) preview.textContent = `${formatDateShortTR(d)} (+3 Gün)`;
    } else if (act === '+7') {
      const d = getLocalDateString(7);
      input.value = d;
      if (preview) preview.textContent = `${formatDateShortTR(d)} (+1 Hafta)`;
    } else if (act === 'none') {
      input.value = '';
      if (preview) preview.textContent = 'Takip Planlanmadı';
    }
  });
});

const templateFollowUpInput = document.getElementById('templateFollowUpInput');
if (templateFollowUpInput) {
  templateFollowUpInput.addEventListener('change', () => {
    const preview = document.getElementById('templateFollowUpPreviewText');
    if (preview) {
      preview.textContent = templateFollowUpInput.value ? formatDateShortTR(templateFollowUpInput.value) : 'Takip Yok';
    }
  });
}

closeTemplatesModal.addEventListener('click', () => templatesModal.classList.add('hidden'));

templateSelector.addEventListener('change', renderTemplatePreview);

function renderTemplatePreview() {
  if (!currentStore) return;
  const slug = templateSelector.value;
  const template = allTemplates.find(t => t.slug === slug);
  if (!template) return;

  const subject = template.subject.replace(/{{STORE_NAME}}/g, currentStore.name);
  const body = template.body.replace(/{{STORE_NAME}}/g, currentStore.name);

  if (templateEmailOutput) {
    templateEmailOutput.value = currentStore.email || '';
  }
  templateSubjectOutput.value = subject;
  templateBodyOutput.value = body;

  // Setup mailto button
  if (currentStore.email) {
    const mailtoUrl = `mailto:${encodeURIComponent(currentStore.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    btnOpenMailClient.href = mailtoUrl;
    btnOpenMailClient.classList.remove('opacity-50', 'pointer-events-none');
  } else {
    btnOpenMailClient.href = '#';
    btnOpenMailClient.classList.add('opacity-50', 'pointer-events-none');
  }

  // Setup WhatsApp button in template preview
  if (currentStore.phone) {
    const e164 = formatSerbianPhoneE164(currentStore.phone);
    if (e164) {
      const waText = `${subject}\n\n${body}`;
      btnOpenWhatsAppTemplate.href = `https://wa.me/${e164}?text=${encodeURIComponent(waText)}`;
      btnOpenWhatsAppTemplate.classList.remove('hidden');
      btnOpenWhatsAppTemplate.classList.add('inline-flex');
    } else {
      btnOpenWhatsAppTemplate.classList.add('hidden');
      btnOpenWhatsAppTemplate.classList.remove('inline-flex');
    }
  } else {
    btnOpenWhatsAppTemplate.classList.add('hidden');
    btnOpenWhatsAppTemplate.classList.remove('inline-flex');
  }
}

function copyStoreEmail() {
  if (!templateEmailOutput || !templateEmailOutput.value) {
    showToast('Kayıtlı e-posta adresi bulunmuyor.', 'warning');
    return;
  }
  navigator.clipboard.writeText(templateEmailOutput.value);
  showToast(`E-posta (${templateEmailOutput.value}) kopyalandı.`);
}

if (copyEmailBtn) copyEmailBtn.addEventListener('click', copyStoreEmail);
if (copyEmailInputBtn) copyEmailInputBtn.addEventListener('click', copyStoreEmail);
if (templateEmailOutput) {
  templateEmailOutput.addEventListener('click', () => {
    templateEmailOutput.select();
    copyStoreEmail();
  });
}

copySubjectBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(templateSubjectOutput.value);
  showToast('Konu panoya kopyalandı.');
});

copyBodyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(templateBodyOutput.value);
  showToast('E-posta metni panoya kopyalandı.');
});

// 1-Click "Mark as Sent & Log into DB"
btnMarkSentAndLog.addEventListener('click', async () => {
  if (!currentStore) return;
  const subject = templateSubjectOutput.value;
  const content = templateBodyOutput.value;

  const followUpDue = document.getElementById('templateFollowUpInput')?.value || null;

  const payload = {
    channel: 'email',
    direction: 'outbound',
    subject,
    content,
    follow_up_due: followUpDue,
    update_status: 'email_sent'
  };

  try {
    const res = await fetch(`/api/stores/${currentStore.id}/communications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      templatesModal.classList.add('hidden');
      showToast(`${currentStore.name} için e-posta gönderildi olarak kaydedildi! ${followUpDue ? '(Takip: ' + formatDateShortTR(followUpDue) + ')' : ''}`);
      selectStore(currentStore.id);
      fetchStores();
      fetchStats();
    }
  } catch (err) {
    console.error('Failed to log sent email:', err);
  }
});

// Direct PrivateEmail SMTP Send & Log
const btnSendSmtpAndLog = document.getElementById('btnSendSmtpAndLog');
if (btnSendSmtpAndLog) {
  btnSendSmtpAndLog.addEventListener('click', async () => {
    if (!currentStore) return;
    const to = (templateEmailOutput?.value || currentStore.email || '').trim();
    const subject = templateSubjectOutput.value.trim();
    const content = templateBodyOutput.value.trim();
    const followUpDue = document.getElementById('templateFollowUpInput')?.value || null;

    if (!to) {
      showToast('Bu mağaza için kayıtlı e-posta adresi yok.');
      return;
    }

    const origHtml = btnSendSmtpAndLog.innerHTML;
    btnSendSmtpAndLog.disabled = true;
    btnSendSmtpAndLog.innerHTML = '<span>Gönderiliyor...</span>';

    try {
      const res = await fetch(`/api/stores/${currentStore.id}/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, content, follow_up_due: followUpDue, update_status: 'email_sent' })
      });
      const data = await res.json();
      if (res.ok) {
        templatesModal.classList.add('hidden');
        showToast(`✅ ${to} adresine doğrudan gönderildi ve kaydedildi!`);
        selectStore(currentStore.id);
        fetchStores();
        fetchStats();
      } else {
        showToast('Gönderim hatası: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (err) {
      console.error('SMTP send error:', err);
      showToast('Sunucu bağlantı hatası: ' + err.message);
    } finally {
      btnSendSmtpAndLog.disabled = false;
      btnSendSmtpAndLog.innerHTML = origHtml;
      lucide.createIcons();
    }
  });
}

// 8. New Store Modal
btnNewStore.addEventListener('click', () => {
  newStoreForm.reset();
  const addFu = document.getElementById('addStoreFollowUp');
  if (addFu) addFu.value = '';
  newStoreModal.classList.remove('hidden');
});

const btnAddStoreToday = document.getElementById('btnAddStoreToday');
if (btnAddStoreToday) {
  btnAddStoreToday.addEventListener('click', () => {
    const addFu = document.getElementById('addStoreFollowUp');
    if (addFu) addFu.value = getLocalDateString(0);
  });
}

const btnAddStoreTomorrow = document.getElementById('btnAddStoreTomorrow');
if (btnAddStoreTomorrow) {
  btnAddStoreTomorrow.addEventListener('click', () => {
    const addFu = document.getElementById('addStoreFollowUp');
    if (addFu) addFu.value = getLocalDateString(1);
  });
}

closeNewStoreModal.addEventListener('click', () => newStoreModal.classList.add('hidden'));
cancelNewStoreBtn.addEventListener('click', () => newStoreModal.classList.add('hidden'));

newStoreForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const payload = {
    name: document.getElementById('addStoreName').value.trim(),
    website: document.getElementById('addStoreWebsite').value.trim(),
    sector: document.getElementById('addStoreSector').value.trim(),
    city: document.getElementById('addStoreCity').value.trim(),
    email: document.getElementById('addStoreEmail').value.trim() || null,
    phone: document.getElementById('addStorePhone').value.trim() || null,
    hook_note: document.getElementById('addStoreHook').value.trim(),
    priority: document.getElementById('addStorePriority').value,
    status: 'not_contacted',
    follow_up_due: document.getElementById('addStoreFollowUp')?.value || null
  };

  try {
    const res = await fetch('/api/stores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const created = await res.json();
      newStoreModal.classList.add('hidden');
      showToast(`"${created.name}" başarıyla eklendi!`);
      await fetchStores();
      fetchStats();
      selectStore(created.id);
    }
  } catch (err) {
    console.error('Failed to add store:', err);
  }
});

// ---------------- STARTUP ----------------
let lastSeenDripSent = 0;

async function pollDripStatus() {
  try {
    const res = await fetch('/api/drip/status');
    const st = await res.json();
    const dot = document.getElementById('dripStatusDot');
    const bar = document.getElementById('dripProgressBar');
    const cnt = document.getElementById('dripCountText');
    const detail = document.getElementById('dripDetailText');
    const btnStart = document.getElementById('btnDripStart');
    const btnStop = document.getElementById('btnDripStop');
    if (!dot || !bar || !cnt || !detail) return;

    const total = st.total || 24;
    const pct = total > 0 ? Math.min(100, Math.round((st.sent / total) * 100)) : 0;
    bar.style.width = `${pct}%`;
    cnt.textContent = `${st.sent} / ${total} Gönderildi`;

    if (st.sent !== lastSeenDripSent) {
      lastSeenDripSent = st.sent;
      fetchStores();
      fetchStats();
      if (currentStore) selectStore(currentStore.id, false);
    }

    if (st.running) {
      dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0';
      btnStart?.classList.add('hidden');
      btnStop?.classList.remove('hidden');
      const secLeft = st.nextSendAt ? Math.max(0, Math.ceil((st.nextSendAt - Date.now()) / 1000)) : 0;
      const mm = String(Math.floor(secLeft / 60)).padStart(2, '0');
      const ss = String(secLeft % 60).padStart(2, '0');
      detail.textContent = `${st.lastSentStore ? 'Son: ' + st.lastSentStore + ' • ' : ''}Sıradaki: ${st.nextStore || '-'} (${mm}:${ss} sonra)`;
    } else {
      dot.className = st.lastError
        ? 'w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0'
        : 'w-2.5 h-2.5 rounded-full bg-slate-500 shrink-0';
      btnStart?.classList.toggle('hidden', st.remaining === 0);
      btnStop?.classList.add('hidden');
      if (st.lastError) {
        detail.textContent = `Hata: ${st.lastError}`;
      } else if (st.remaining === 0) {
        detail.textContent = '🎉 Tüm bekleyen mağazalara e-posta gönderildi!';
      } else {
        detail.textContent = `Sıradaki: ${st.nextStore || '-'} (${st.remaining} mağaza bekliyor)`;
      }
    }
  } catch (_) {}
}

document.getElementById('btnDripStart')?.addEventListener('click', async () => {
  await fetch('/api/drip/start', { method: 'POST' });
  showToast('🚀 Otomatik aralıklı gönderim kuyruğu başlatıldı!');
  pollDripStatus();
});

document.getElementById('btnDripStop')?.addEventListener('click', async () => {
  await fetch('/api/drip/stop', { method: 'POST' });
  showToast('⏸ Kuyruk duraklatıldı.');
  pollDripStatus();
});

async function init() {
  await fetchStats();
  await fetchTemplates();
  await fetchStores();
  await pollDripStatus();
  setInterval(pollDripStatus, 1000);
}

init();
