// DirectChat Multi-Platform Logic with Identity star66, Date & Time

// Current State
let currentPlatform = 'whatsapp'; // 'whatsapp' | 'instagram' | 'snapchat' | 'messenger' | 'sms'
let selectedCountry = COUNTRIES[0]; // Default India (+91)
let chatHistory = [];

// DOM Elements
const platformTabs = document.querySelectorAll('.platform-tab');
const senderNameInput = document.getElementById('sender-name-input');
const includeSenderCheckbox = document.getElementById('include-sender-checkbox');
const includeDatetimeCheckbox = document.getElementById('include-datetime-checkbox');
const insertTimeChip = document.getElementById('insert-time-chip');
const liveClockText = document.getElementById('live-clock-text');

const phoneInputContainer = document.getElementById('phone-input-container');
const socialInputContainer = document.getElementById('social-input-container');
const socialIdInput = document.getElementById('social-id-input');
const socialLabelText = document.getElementById('social-label-text');
const socialLabelIcon = document.getElementById('social-label-icon');
const socialHelperText = document.getElementById('social-helper-text');
const socialPreview = document.getElementById('social-preview');

const countryDropdownBtn = document.getElementById('country-dropdown-btn');
const countryMenu = document.getElementById('country-menu');
const countrySearchInput = document.getElementById('country-search-input');
const countryList = document.getElementById('country-list');
const selectedFlag = document.getElementById('selected-flag');
const selectedDial = document.getElementById('selected-dial');

const phoneInput = document.getElementById('phone-input');
const clearPhoneBtn = document.getElementById('clear-phone-btn');
const formatPreview = document.getElementById('format-preview');

const messageInput = document.getElementById('message-input');
const charCounter = document.getElementById('char-counter');
const liveMessagePreview = document.getElementById('live-message-preview');

const mainSendBtn = document.getElementById('main-send-btn');
const mainSendLabel = document.getElementById('main-send-label');
const mainSendIcon = document.getElementById('main-send-icon');

const copyMsgBtn = document.getElementById('copy-msg-btn');
const copyLinkBtn = document.getElementById('copy-link-btn');
const showQrBtn = document.getElementById('show-qr-btn');

// QR Modal
const qrModal = document.getElementById('qr-modal');
const closeQrModal = document.getElementById('close-qr-modal');
const qrDoneBtn = document.getElementById('qr-done-btn');
const qrCanvas = document.getElementById('qrcode-canvas');
const qrTargetText = document.getElementById('qr-target-text');

// History Modal
const toggleHistoryBtn = document.getElementById('toggle-history-btn');
const historyModal = document.getElementById('history-modal');
const closeHistoryModal = document.getElementById('close-history-modal');
const historyListContainer = document.getElementById('history-list-container');
const clearAllHistoryBtn = document.getElementById('clear-all-history-btn');
const historyCountBadge = document.getElementById('history-count-badge');

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const toastContainer = document.getElementById('toast-container');

// Date & Time Formatter
function formatDateTime(d = new Date()) {
  const day = d.getDate();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
}

// Live Clock Ticker
function startLiveClock() {
  function tick() {
    if (liveClockText) {
      liveClockText.textContent = formatDateTime();
    }
  }
  tick();
  setInterval(() => {
    tick();
    // Refresh preview if time changed
    updateLiveMessagePreview();
  }, 1000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCountrySelector();
  initHistory();
  setupEventListeners();
  autoDetectCountry();
  startLiveClock();
  updateLiveMessagePreview();
  updatePlatformUI(currentPlatform);

  if (window.lucide) {
    lucide.createIcons();
  }
});

// Auto-detect country based on browser timezone
function autoDetectCountry() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('Asia/Colombo')) {
        setCountryByCode('IN');
      } else if (tz.includes('New_York') || tz.includes('Chicago') || tz.includes('Los_Angeles') || tz.includes('Denver')) {
        setCountryByCode('US');
      } else if (tz.includes('London')) {
        setCountryByCode('GB');
      } else if (tz.includes('Dubai')) {
        setCountryByCode('AE');
      } else if (tz.includes('Riyadh')) {
        setCountryByCode('SA');
      } else if (tz.includes('Toronto') || tz.includes('Vancouver')) {
        setCountryByCode('CA');
      } else if (tz.includes('Sydney') || tz.includes('Melbourne')) {
        setCountryByCode('AU');
      }
    }
  } catch (e) {
    // Keep default
  }
}

function setCountryByCode(code) {
  const match = COUNTRIES.find(c => c.code === code);
  if (match) {
    selectCountry(match);
  }
}

// Country Selector Setup
function initCountrySelector() {
  renderCountries(COUNTRIES);

  countryDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = countryMenu.classList.contains('hidden');
    if (isHidden) {
      countryMenu.classList.remove('hidden');
      countrySearchInput.value = '';
      renderCountries(COUNTRIES);
      countrySearchInput.focus();
    } else {
      countryMenu.classList.add('hidden');
    }
  });

  countrySearchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.dial.includes(query) || 
      c.code.toLowerCase().includes(query)
    );
    renderCountries(filtered);
  });

  document.addEventListener('click', (e) => {
    if (!countryMenu.contains(e.target) && !countryDropdownBtn.contains(e.target)) {
      countryMenu.classList.add('hidden');
    }
  });
}

function renderCountries(list) {
  countryList.innerHTML = '';
  if (list.length === 0) {
    countryList.innerHTML = `<div class="p-3 text-xs text-center text-slate-400">No countries found</div>`;
    return;
  }

  list.forEach(country => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'country-item w-full px-3 py-2 text-left text-xs flex items-center justify-between rounded-lg transition-colors';
    btn.innerHTML = `
      <div class="flex items-center space-x-2.5 truncate">
        <span class="text-base">${country.flag}</span>
        <span class="font-medium text-slate-800 dark:text-slate-200 truncate">${country.name}</span>
      </div>
      <span class="font-mono text-slate-500 dark:text-slate-400 font-semibold ml-2">${country.dial}</span>
    `;
    btn.addEventListener('click', () => {
      selectCountry(country);
      countryMenu.classList.add('hidden');
      phoneInput.focus();
    });
    countryList.appendChild(btn);
  });
}

function selectCountry(country) {
  selectedCountry = country;
  selectedFlag.textContent = country.flag;
  selectedDial.textContent = country.dial;
  updatePhonePreview();
}

// Format message with sender identity "star66", Date and Time
function getFormattedMessage() {
  const userMsg = messageInput.value.trim();
  const sender = (senderNameInput.value.trim()) || 'star66';
  const includeSender = includeSenderCheckbox ? includeSenderCheckbox.checked : true;
  const includeDatetime = includeDatetimeCheckbox ? includeDatetimeCheckbox.checked : true;

  const tagParts = [];
  if (includeSender) {
    tagParts.push(`Sent by ${sender}`);
  }
  if (includeDatetime) {
    tagParts.push(formatDateTime());
  }

  const tag = tagParts.length > 0 ? `— ${tagParts.join(' • ')}` : '';

  if (!tag) {
    return userMsg || '';
  }

  if (!userMsg) {
    return tag;
  }

  return `${userMsg}\n\n${tag}`;
}

function updateLiveMessagePreview() {
  const formatted = getFormattedMessage();
  liveMessagePreview.textContent = formatted || '(Empty message)';
}

// Switch between platforms
function updatePlatformUI(platform) {
  currentPlatform = platform;

  platformTabs.forEach(tab => {
    const tabPlatform = tab.getAttribute('data-platform');
    if (tabPlatform === platform) {
      tab.className = 'platform-tab active flex flex-col sm:flex-row items-center justify-center py-2 px-1 rounded-xl text-xs font-semibold transition-all space-y-1 sm:space-y-0 sm:space-x-1.5 bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-slate-700';
      if (platform === 'whatsapp') tab.classList.add('text-emerald-600', 'dark:text-emerald-400');
      else if (platform === 'instagram') tab.classList.add('text-pink-600', 'dark:text-pink-400');
      else if (platform === 'snapchat') tab.classList.add('text-yellow-500', 'dark:text-yellow-400');
      else if (platform === 'messenger') tab.classList.add('text-blue-500', 'dark:text-blue-400');
      else if (platform === 'sms') tab.classList.add('text-indigo-600', 'dark:text-indigo-400');
    } else {
      tab.className = 'platform-tab flex flex-col sm:flex-row items-center justify-center py-2 px-1 rounded-xl text-xs font-semibold transition-all space-y-1 sm:space-y-0 sm:space-x-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200';
    }
  });

  const sender = senderNameInput.value.trim() || 'star66';

  if (platform === 'whatsapp' || platform === 'sms') {
    phoneInputContainer.classList.remove('hidden');
    socialInputContainer.classList.add('hidden');
  } else {
    phoneInputContainer.classList.add('hidden');
    socialInputContainer.classList.remove('hidden');

    if (platform === 'instagram') {
      socialLabelText.textContent = 'Instagram Username / ID';
      socialIdInput.placeholder = 'username (e.g. zuck)';
      socialHelperText.textContent = `Directs to Instagram DM with message signed as ${sender} + timestamp.`;
    } else if (platform === 'snapchat') {
      socialLabelText.textContent = 'Snapchat Username';
      socialIdInput.placeholder = 'snapchat username';
      socialHelperText.textContent = `Directs to Snapchat chat with message signed as ${sender} + timestamp.`;
    } else if (platform === 'messenger') {
      socialLabelText.textContent = 'Facebook Messenger ID / Username';
      socialIdInput.placeholder = 'facebook username or ID';
      socialHelperText.textContent = `Opens Facebook Messenger chat with message signed as ${sender} + timestamp.`;
    }
  }

  // Update Main Send Button
  mainSendBtn.className = 'w-full py-4 px-6 rounded-2xl text-white font-bold text-base sm:text-lg flex items-center justify-center space-x-3 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer select-none';

  if (platform === 'whatsapp') {
    mainSendBtn.classList.add('bg-gradient-to-r', 'from-[#25D366]', 'to-[#128C7E]', 'hover:from-[#20bd5a]', 'hover:to-[#0f7a6e]', 'glow-whatsapp');
    mainSendLabel.textContent = `Send via WhatsApp (as ${sender})`;
    mainSendIcon.innerHTML = `<svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`;
  } else if (platform === 'instagram') {
    mainSendBtn.classList.add('bg-gradient-to-r', 'from-[#833ab4]', 'via-[#fd1d1d]', 'to-[#fcb045]', 'glow-instagram');
    mainSendLabel.textContent = `Open Instagram DM (as ${sender})`;
    mainSendIcon.innerHTML = `<i data-lucide="instagram" class="w-6 h-6"></i>`;
  } else if (platform === 'snapchat') {
    mainSendBtn.classList.add('bg-gradient-to-r', 'from-yellow-400', 'to-amber-500', 'text-slate-900', 'glow-snapchat');
    mainSendLabel.textContent = `Open Snapchat Chat (as ${sender})`;
    mainSendIcon.innerHTML = `<i data-lucide="ghost" class="w-6 h-6"></i>`;
  } else if (platform === 'messenger') {
    mainSendBtn.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-indigo-600', 'glow-messenger');
    mainSendLabel.textContent = `Open Messenger Chat (as ${sender})`;
    mainSendIcon.innerHTML = `<i data-lucide="message-circle" class="w-6 h-6"></i>`;
  } else if (platform === 'sms') {
    mainSendBtn.classList.add('bg-gradient-to-r', 'from-blue-600', 'to-cyan-600', 'glow-sms');
    mainSendLabel.textContent = `Send Normal SMS (as ${sender})`;
    mainSendIcon.innerHTML = `<i data-lucide="message-square" class="w-6 h-6"></i>`;
  }

  if (window.lucide) lucide.createIcons();
}

// Setup Event Listeners
function setupEventListeners() {
  platformTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const p = tab.getAttribute('data-platform');
      updatePlatformUI(p);
    });
  });

  senderNameInput.addEventListener('input', () => {
    updateLiveMessagePreview();
    updatePlatformUI(currentPlatform);
  });

  if (includeSenderCheckbox) {
    includeSenderCheckbox.addEventListener('change', () => {
      updateLiveMessagePreview();
    });
  }

  if (includeDatetimeCheckbox) {
    includeDatetimeCheckbox.addEventListener('change', () => {
      updateLiveMessagePreview();
    });
  }

  // Insert Time Stamp Chip
  if (insertTimeChip) {
    insertTimeChip.addEventListener('click', () => {
      const stamp = `[${formatDateTime()}]`;
      const start = messageInput.selectionStart;
      const end = messageInput.selectionEnd;
      const text = messageInput.value;
      if (text.trim() === '') {
        messageInput.value = stamp + ' ';
      } else {
        messageInput.value = text.substring(0, start) + ' ' + stamp + ' ' + text.substring(end);
      }
      messageInput.dispatchEvent(new Event('input'));
      messageInput.focus();
      showToast('Timestamp inserted into message! 🕒', 'info');
    });
  }

  // Phone input handling
  phoneInput.addEventListener('input', handlePhoneInput);
  clearPhoneBtn.addEventListener('click', () => {
    phoneInput.value = '';
    clearPhoneBtn.classList.add('hidden');
    formatPreview.classList.add('hidden');
    phoneInput.focus();
  });

  // Social ID input handling
  socialIdInput.addEventListener('input', () => {
    let raw = socialIdInput.value.trim().replace(/^@/, '');
    socialIdInput.value = raw;
    if (raw) {
      socialPreview.textContent = `@${raw}`;
    } else {
      socialPreview.textContent = '';
    }
  });

  // Message input handling
  messageInput.addEventListener('input', () => {
    const length = messageInput.value.length;
    charCounter.textContent = `${length} character${length === 1 ? '' : 's'}`;
    updateLiveMessagePreview();
  });

  // Preset chips
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.textContent.trim();
      if (messageInput.value.trim() === '') {
        messageInput.value = text;
      } else {
        messageInput.value = messageInput.value + ' ' + text;
      }
      messageInput.dispatchEvent(new Event('input'));
      messageInput.focus();
    });
  });

  // Quick Emoji buttons
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji');
      const start = messageInput.selectionStart;
      const end = messageInput.selectionEnd;
      const text = messageInput.value;
      messageInput.value = text.substring(0, start) + emoji + text.substring(end);
      messageInput.selectionStart = messageInput.selectionEnd = start + emoji.length;
      messageInput.dispatchEvent(new Event('input'));
      messageInput.focus();
    });
  });

  // Copy Full Message button
  copyMsgBtn.addEventListener('click', () => {
    const formatted = getFormattedMessage();
    if (!formatted) {
      showToast('Please type a message first', 'error');
      return;
    }
    copyToClipboard(formatted, 'Full message (with star66 & Time) copied! 📋');
  });

  // Copy Direct Link button
  copyLinkBtn.addEventListener('click', handleCopyDirectLink);

  // QR Code button
  showQrBtn.addEventListener('click', handleShowQR);
  closeQrModal.addEventListener('click', () => qrModal.classList.add('hidden'));
  qrDoneBtn.addEventListener('click', () => qrModal.classList.add('hidden'));
  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) qrModal.classList.add('hidden');
  });

  // History modal toggle
  toggleHistoryBtn.addEventListener('click', () => {
    renderHistoryModal();
    historyModal.classList.remove('hidden');
  });
  closeHistoryModal.addEventListener('click', () => historyModal.classList.add('hidden'));
  historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) historyModal.classList.add('hidden');
  });
  clearAllHistoryBtn.addEventListener('click', clearAllHistory);

  // Theme toggle
  themeToggleBtn.addEventListener('click', toggleTheme);
}

// Handle smart phone input
function handlePhoneInput() {
  let val = phoneInput.value;

  if (val.length > 0) {
    clearPhoneBtn.classList.remove('hidden');
  } else {
    clearPhoneBtn.classList.add('hidden');
    formatPreview.classList.add('hidden');
    return;
  }

  if (val.startsWith('+')) {
    const rawClean = val.replace(/[^\d+]/g, '');
    for (const country of COUNTRIES) {
      if (rawClean.startsWith(country.dial)) {
        selectCountry(country);
        const withoutDial = rawClean.slice(country.dial.length);
        phoneInput.value = withoutDial;
        val = withoutDial;
        break;
      }
    }
  }

  updatePhonePreview();
}

function updatePhonePreview() {
  const cleanNumber = phoneInput.value.replace(/\D/g, '');
  if (cleanNumber.length >= 3) {
    formatPreview.textContent = `${selectedCountry.dial} ${cleanNumber}`;
    formatPreview.classList.remove('hidden');
  } else {
    formatPreview.classList.add('hidden');
  }
}

// Get validated target and URL based on active platform
function getPlatformPayload() {
  const sender = senderNameInput.value.trim() || 'star66';
  const fullMessage = getFormattedMessage();

  if (currentPlatform === 'whatsapp' || currentPlatform === 'sms') {
    const rawNumber = phoneInput.value.replace(/\D/g, '');
    if (!rawNumber || rawNumber.length < 4) {
      showToast('Please enter a valid phone number', 'error');
      phoneInput.focus();
      return null;
    }

    const dialClean = selectedCountry.dial.replace(/\D/g, '');
    const fullNumber = dialClean + rawNumber;

    let directUrl = '';
    if (currentPlatform === 'whatsapp') {
      directUrl = `https://wa.me/${fullNumber}?text=${encodeURIComponent(fullMessage)}`;
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      const separator = isIOS ? '&' : '?';
      directUrl = `sms:+${fullNumber}${separator}body=${encodeURIComponent(fullMessage)}`;
    }

    return {
      platform: currentPlatform,
      target: `${selectedCountry.dial} ${rawNumber}`,
      targetRaw: rawNumber,
      fullNumber,
      sender,
      message: fullMessage,
      url: directUrl
    };

  } else {
    // Social platforms
    const username = socialIdInput.value.trim().replace(/^@/, '');
    if (!username) {
      showToast(`Please enter the ${currentPlatform} username or ID`, 'error');
      socialIdInput.focus();
      return null;
    }

    let directUrl = '';
    if (currentPlatform === 'instagram') {
      directUrl = `https://ig.me/m/${encodeURIComponent(username)}`;
    } else if (currentPlatform === 'snapchat') {
      directUrl = `https://www.snapchat.com/add/${encodeURIComponent(username)}`;
    } else if (currentPlatform === 'messenger') {
      directUrl = `https://m.me/${encodeURIComponent(username)}`;
    }

    return {
      platform: currentPlatform,
      target: `@${username}`,
      targetRaw: username,
      sender,
      message: fullMessage,
      url: directUrl
    };
  }
}

// Main Send Action
function handleSend() {
  const payload = getPlatformPayload();
  if (!payload) return;

  saveToHistory(payload);

  if (currentPlatform === 'whatsapp') {
    showToast(`Opening WhatsApp chat as ${payload.sender}...`, 'success');
    window.open(payload.url, '_blank', 'noopener,noreferrer');

  } else if (currentPlatform === 'sms') {
    showToast(`Launching SMS messaging app as ${payload.sender}...`, 'info');
    const link = document.createElement('a');
    link.href = payload.url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } else if (currentPlatform === 'instagram') {
    copyToClipboard(payload.message, `Message with ${payload.sender} & time copied! Opening Instagram DM...`);
    setTimeout(() => {
      window.open(payload.url, '_blank', 'noopener,noreferrer');
    }, 400);

  } else if (currentPlatform === 'snapchat') {
    copyToClipboard(payload.message, `Message with ${payload.sender} & time copied! Opening Snapchat...`);
    setTimeout(() => {
      window.open(payload.url, '_blank', 'noopener,noreferrer');
    }, 400);

  } else if (currentPlatform === 'messenger') {
    copyToClipboard(payload.message, `Message with ${payload.sender} & time copied! Opening Facebook Messenger...`);
    setTimeout(() => {
      window.open(payload.url, '_blank', 'noopener,noreferrer');
    }, 400);
  }
}

// Copy Direct Link
function handleCopyDirectLink() {
  const payload = getPlatformPayload();
  if (!payload) return;

  copyToClipboard(payload.url, `Direct link for ${payload.platform} copied! 📋`);
}

// Show QR Code
function handleShowQR() {
  const payload = getPlatformPayload();
  if (!payload) return;

  qrCanvas.innerHTML = '';
  qrTargetText.textContent = `${payload.platform.toUpperCase()}: ${payload.target} (From: ${payload.sender})`;

  if (typeof QRCode !== 'undefined') {
    new QRCode(qrCanvas, {
      text: payload.url,
      width: 190,
      height: 190,
      colorDark: '#0B141A',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  } else {
    const qrImg = document.createElement('img');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=190x190&data=${encodeURIComponent(payload.url)}`;
    qrImg.alt = 'QR Code';
    qrImg.className = 'w-[190px] h-[190px] rounded-lg';
    qrCanvas.appendChild(qrImg);
  }

  qrModal.classList.remove('hidden');
}

// Copy to Clipboard Utility
function copyToClipboard(text, successMessage) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage, 'success');
    }).catch(() => {
      fallbackCopy(text, successMessage);
    });
  } else {
    fallbackCopy(text, successMessage);
  }
}

function fallbackCopy(text, successMessage) {
  const temp = document.createElement('textarea');
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
  showToast(successMessage, 'success');
}

// History Handling
function initHistory() {
  try {
    const saved = localStorage.getItem('directchat_multi_history');
    if (saved) {
      chatHistory = JSON.parse(saved);
      updateHistoryBadge();
    }
  } catch (e) {
    chatHistory = [];
  }
}

function saveToHistory(item) {
  const entry = {
    id: Date.now().toString(),
    platform: item.platform,
    target: item.target,
    sender: item.sender || 'star66',
    message: item.message,
    timestamp: new Date().toISOString()
  };

  chatHistory = chatHistory.filter(h => !(h.target === entry.target && h.platform === entry.platform));
  chatHistory.unshift(entry);

  if (chatHistory.length > 25) {
    chatHistory = chatHistory.slice(0, 25);
  }

  try {
    localStorage.setItem('directchat_multi_history', JSON.stringify(chatHistory));
  } catch (e) {}

  updateHistoryBadge();
}

function updateHistoryBadge() {
  if (chatHistory.length > 0) {
    historyCountBadge.textContent = chatHistory.length;
    historyCountBadge.classList.remove('hidden');
  } else {
    historyCountBadge.classList.add('hidden');
  }
}

function renderHistoryModal() {
  historyListContainer.innerHTML = '';

  if (chatHistory.length === 0) {
    historyListContainer.innerHTML = `
      <div class="py-12 text-center text-slate-400">
        <i data-lucide="message-square-off" class="w-10 h-10 mx-auto mb-2 opacity-50"></i>
        <p class="text-sm font-medium">No recent messages yet</p>
        <p class="text-xs text-slate-500 mt-0.5">Your sent messages will appear here.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  chatHistory.forEach(item => {
    const card = document.createElement('div');
    card.className = 'group p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between hover:border-emerald-500/50 transition-all cursor-pointer';
    
    const sendDate = new Date(item.timestamp);
    const formattedDate = formatDateTime(sendDate);
    const timeAgo = formatTimeAgo(sendDate);
    
    let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300';
    let platLabel = item.platform.toUpperCase();
    if (item.platform === 'instagram') badgeColor = 'bg-pink-100 text-pink-800 dark:bg-pink-950/80 dark:text-pink-300';
    else if (item.platform === 'snapchat') badgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/80 dark:text-yellow-300';
    else if (item.platform === 'messenger') badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300';
    else if (item.platform === 'sms') badgeColor = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300';

    card.innerHTML = `
      <div class="flex items-center space-x-3 overflow-hidden pr-2">
        <div class="truncate">
          <div class="flex items-center space-x-1.5 flex-wrap">
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${badgeColor}">${platLabel}</span>
            <span class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-mono">${item.target}</span>
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">(from ${item.sender || 'star66'})</span>
          </div>
          <p class="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
            📅 ${formattedDate} (${timeAgo})
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
            ${item.message || '<span class="italic opacity-60">Blank message</span>'}
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-1 flex-shrink-0">
        <button type="button" class="use-history-btn p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors" title="Load into form">
          <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
        </button>
        <button type="button" class="delete-history-btn p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="Delete">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    `;

    card.querySelector('.use-history-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      loadHistoryItem(item);
    });

    card.addEventListener('click', () => {
      loadHistoryItem(item);
    });

    card.querySelector('.delete-history-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteHistoryItem(item.id);
    });

    historyListContainer.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

function loadHistoryItem(item) {
  updatePlatformUI(item.platform);

  if (item.platform === 'whatsapp' || item.platform === 'sms') {
    const rawDigits = item.target.replace(/\D/g, '');
    for (const country of COUNTRIES) {
      const dialDigits = country.dial.replace(/\D/g, '');
      if (rawDigits.startsWith(dialDigits)) {
        selectCountry(country);
        phoneInput.value = rawDigits.slice(dialDigits.length);
        break;
      }
    }
  } else {
    socialIdInput.value = item.target.replace(/^@/, '');
  }

  senderNameInput.value = item.sender || 'star66';
  
  let cleanMsg = item.message || '';
  if (cleanMsg.includes('\n\n— ')) {
    cleanMsg = cleanMsg.split('\n\n— ')[0];
  }
  messageInput.value = cleanMsg;

  updateLiveMessagePreview();
  historyModal.classList.add('hidden');
  showToast(`Loaded ${item.platform} destination ${item.target}`, 'info');
}

function deleteHistoryItem(id) {
  chatHistory = chatHistory.filter(h => h.id !== id);
  localStorage.setItem('directchat_multi_history', JSON.stringify(chatHistory));
  updateHistoryBadge();
  renderHistoryModal();
}

function clearAllHistory() {
  if (chatHistory.length === 0) return;
  chatHistory = [];
  localStorage.removeItem('directchat_multi_history');
  updateHistoryBadge();
  renderHistoryModal();
  showToast('History cleared', 'info');
}

function formatTimeAgo(date) {
  const diff = Math.floor((new Date() - date) / 1000);
  if (diff < 60) return 'just now';
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// Toast System
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  let bg = 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-700';
  let icon = 'info';

  if (type === 'success') {
    bg = 'bg-emerald-600 text-white border-emerald-500';
    icon = 'check-circle-2';
  } else if (type === 'error') {
    bg = 'bg-rose-600 text-white border-rose-500';
    icon = 'alert-triangle';
  }

  toast.className = `flex items-center space-x-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold transform transition-all duration-300 ease-out translate-y-3 opacity-0 ${bg}`;
  toast.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4 flex-shrink-0"></i><span>${message}</span>`;

  toastContainer.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  setTimeout(() => toast.classList.remove('translate-y-3', 'opacity-0'), 10);
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Theme handling
function initTheme() {
  const saved = localStorage.getItem('directchat_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcon(false);
  }
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('directchat_theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  if (themeIcon) {
    themeIcon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }
}
