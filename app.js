/**
 * Arthawira Closed Beta Landing Page Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  loadSavedDiscoveryProgress();
  if (window.lucide) {
    window.lucide.createIcons();
  }
});

/* ==========================================================================
   1. AI ASSISTANT SIMULATOR
   ========================================================================== */

function handlePresetPrompt(text) {
  const inputEl = document.getElementById('ai-input');
  if (inputEl) {
    inputEl.value = text;
    processAiChat(text);
  }
}

function handleCustomChat(event) {
  event.preventDefault();
  const inputEl = document.getElementById('ai-input');
  if (!inputEl) return;
  const text = inputEl.value.trim();
  if (!text) return;
  processAiChat(text);
  inputEl.value = '';
}

function processAiChat(promptText) {
  const chatStream = document.getElementById('chat-stream');
  if (!chatStream) return;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // Add User Bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble bubble-user';
  userBubble.innerHTML = `<p>${escapeHtml(promptText)}</p><span class="bubble-time">${timeStr}</span>`;
  chatStream.appendChild(userBubble);
  chatStream.scrollTop = chatStream.scrollHeight;

  // Simulate AI Thinking & Parsing
  setTimeout(() => {
    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble bubble-ai';
    aiBubble.innerHTML = `<p>Saya telah mengekstrak transaksi berikut. Mohon periksa draft di samping kanan sebelum kamu konfirmasi ya!</p><span class="bubble-time">${timeStr}</span>`;
    chatStream.appendChild(aiBubble);
    chatStream.scrollTop = chatStream.scrollHeight;

    // Parse information from promptText
    parseAndDisplayExtraction(promptText);
  }, 400);
}

function parseAndDisplayExtraction(text) {
  const lower = text.toLowerCase();

  let type = 'Pengeluaran';
  let isExpense = true;
  let amount = 25000;
  let category = 'Makanan & Minuman';
  let wallet = 'Dompet Cash';
  let note = text;

  // Type & Category Heuristics
  if (lower.includes('gaji') || lower.includes('pendapatan') || lower.includes('transferan') || lower.includes('dapat')) {
    type = 'Pemasukan';
    isExpense = false;
    category = 'Gaji & Pendapatan';
  } else if (lower.includes('bensin') || lower.includes('pertamax') || lower.includes('ojol') || lower.includes('gojek') || lower.includes('grab')) {
    category = 'Transportasi';
  } else if (lower.includes('pulsa') || lower.includes('kuota') || lower.includes('token') || lower.includes('listrik')) {
    category = 'Tagihan & Utilitas';
  } else if (lower.includes('kopi') || lower.includes('padang') || lower.includes('makan') || lower.includes('naspad') || lower.includes('resto') || lower.includes('bakso')) {
    category = 'Makanan & Minuman';
  } else if (lower.includes('baju') || lower.includes('sepatu') || lower.includes('shopee') || lower.includes('tokopedia')) {
    category = 'Belanja & Hiburan';
  }

  // Amount parsing
  const regexJuta = /(\d+(?:[.,]\d+)?)\s*(?:juta|jt)/i;
  const regexK = /(\d+(?:[.,]\d+)?)\s*(?:k|ribu|rb)/i;
  const regexNum = /(?:rp\.?\s*)?(\d{1,3}(?:\.\d{3})+|\d+)/i;

  if (regexJuta.test(lower)) {
    const match = lower.match(regexJuta);
    const num = parseFloat(match[1].replace(',', '.'));
    amount = num * 1000000;
  } else if (regexK.test(lower)) {
    const match = lower.match(regexK);
    const num = parseFloat(match[1].replace(',', '.'));
    amount = num * 1000;
  } else if (regexNum.test(lower)) {
    const match = lower.match(regexNum);
    const cleanStr = match[1].replace(/\./g, '');
    const parsed = parseInt(cleanStr, 10);
    if (!isNaN(parsed) && parsed > 100) {
      amount = parsed;
    }
  }

  // Wallet parsing
  if (lower.includes('bca')) wallet = 'Rekening BCA';
  else if (lower.includes('mandiri')) wallet = 'Bank Mandiri';
  else if (lower.includes('gopay')) wallet = 'GoPay';
  else if (lower.includes('ovo')) wallet = 'OVO';
  else if (lower.includes('dana')) wallet = 'DANA';
  else if (lower.includes('shopeepay')) wallet = 'ShopeePay';
  else if (lower.includes('cash') || lower.includes('tunai')) wallet = 'Dompet Cash';

  // Update UI Elements
  const typeEl = document.getElementById('extract-type');
  const amountEl = document.getElementById('extract-amount');
  const categoryEl = document.getElementById('extract-category');
  const walletEl = document.getElementById('extract-wallet');
  const noteEl = document.getElementById('extract-note');
  const toastEl = document.getElementById('live-toast');

  if (typeEl) {
    typeEl.textContent = type;
    typeEl.className = `detail-val type-badge ${isExpense ? 'expense' : 'income'}`;
  }
  if (amountEl) {
    amountEl.textContent = formatRupiah(amount);
    amountEl.style.color = isExpense ? 'var(--color-expense)' : 'var(--color-income)';
  }
  if (categoryEl) categoryEl.textContent = category;
  if (walletEl) walletEl.textContent = wallet;
  if (noteEl) noteEl.textContent = note;
  if (toastEl) toastEl.classList.remove('show');
}

function simulateConfirmTransaction() {
  const toastEl = document.getElementById('live-toast');
  if (toastEl) {
    toastEl.classList.add('show');
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 4000);
  }
}

function simulateEditPrompt() {
  const currentAmount = document.getElementById('extract-amount');
  if (currentAmount) {
    const newAmount = prompt('Koreksi nominal yang benar (angka saja, contoh: 27000):', '25000');
    if (newAmount && !isNaN(parseInt(newAmount, 10))) {
      currentAmount.textContent = formatRupiah(parseInt(newAmount, 10));
    }
  }
}

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
}

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return String(string).replace(/[&<>"']/g, s => entityMap[s]);
}

/* ==========================================================================
   2. OFFLINE-FIRST & CLOUD SYNC SIMULATOR
   ========================================================================== */

function setNetworkSimulation(status) {
  const btnOffline = document.getElementById('btn-net-offline');
  const btnOnline = document.getElementById('btn-net-online');
  const badge = document.getElementById('sync-status-badge');
  const cloudDesc = document.getElementById('sync-cloud-desc');
  const terminalLog = document.getElementById('sync-terminal-log');

  if (status === 'offline') {
    btnOffline.classList.add('active');
    btnOnline.classList.remove('active');
    
    if (badge) {
      badge.textContent = 'Pending Sync (is_synced: false)';
      badge.style.background = 'rgba(217, 130, 43, 0.25)';
      badge.style.color = '#F8B26A';
    }
    if (cloudDesc) {
      cloudDesc.textContent = 'Menunggu koneksi internet aktif kembali.';
    }
    if (terminalLog) {
      terminalLog.innerHTML = `
        <div class="log-line text-muted">[08:45:00] App running on local Drift SQLite DB.</div>
        <div class="log-line text-warning">[08:45:02] Network status: DISCONNECTED. Local queue active.</div>
        <div class="log-line text-info">[08:45:05] Local wallet balance recalculated atomically: Rp 500.000 -> Rp 475.000.</div>
      `;
    }
  } else {
    btnOnline.classList.add('active');
    btnOffline.classList.remove('active');

    if (badge) {
      badge.textContent = 'Synced with Cloud (is_synced: true)';
      badge.style.background = 'rgba(46, 125, 78, 0.25)';
      badge.style.color = '#62D47E';
    }
    if (cloudDesc) {
      cloudDesc.textContent = 'Tersinkronisasi otomatis dengan server Supabase.';
    }
    if (terminalLog) {
      terminalLog.innerHTML = `
        <div class="log-line text-muted">[08:45:10] Internet Connection DETECTED (WiFi/Cellular).</div>
        <div class="log-line text-info">[08:45:11] SyncService triggered: Uploading 1 pending local record...</div>
        <div class="log-line text-success">[08:45:12] Remote sync SUCCESS! Remote ID assigned. is_synced=true.</div>
      `;
    }
  }
}

/* ==========================================================================
   3. GAMIFIED BETA DISCOVERY TRACKER
   ========================================================================== */

const DISCOVERY_KEY = 'arthawira_beta_discovery_v065';

function toggleDiscovery(el, itemId) {
  el.classList.toggle('checked');
  updateDiscoveryState();
}

function updateDiscoveryState() {
  const items = document.querySelectorAll('.discovery-item');
  const checkedItems = document.querySelectorAll('.discovery-item.checked');
  const count = checkedItems.length;
  const total = items.length;

  const countEl = document.getElementById('tracker-completed-count');
  const fillEl = document.getElementById('discovery-progress-fill');
  const levelTextEl = document.getElementById('explorer-level-text');

  if (countEl) countEl.textContent = count;
  const percent = Math.round((count / total) * 100);
  if (fillEl) fillEl.style.width = `${percent}%`;

  // Update level text
  if (levelTextEl) {
    if (count === 0) levelTextEl.textContent = 'Tester Pemula';
    else if (count <= 2) levelTextEl.textContent = 'Tester Penjelajah 🧭';
    else if (count <= 5) levelTextEl.textContent = 'Pakar Finansial 💼';
    else if (count < total) levelTextEl.textContent = 'Master Anggaran 🎯';
    else levelTextEl.textContent = 'Closed Beta Champion 🏆';
  }

  // Save indexes to localStorage
  const checkedIndexes = [];
  items.forEach((item, index) => {
    if (item.classList.contains('checked')) {
      checkedIndexes.push(index);
    }
  });
  localStorage.setItem(DISCOVERY_KEY, JSON.stringify(checkedIndexes));
}

function loadSavedDiscoveryProgress() {
  const saved = localStorage.getItem(DISCOVERY_KEY);
  if (!saved) return;
  try {
    const indexes = JSON.parse(saved);
    const items = document.querySelectorAll('.discovery-item');
    indexes.forEach(idx => {
      if (items[idx]) {
        items[idx].classList.add('checked');
      }
    });
    updateDiscoveryState();
  } catch (e) {
    console.error('Failed to parse discovery progress', e);
  }
}

function resetDiscoveryProgress() {
  localStorage.removeItem(DISCOVERY_KEY);
  const items = document.querySelectorAll('.discovery-item');
  items.forEach(item => item.classList.remove('checked'));
  updateDiscoveryState();
}

/* ==========================================================================
   4. FEEDBACK TEMPLATE COPY HELPER
   ========================================================================== */

function copyFeedbackTemplate() {
  const templateEl = document.getElementById('feedback-template-text');
  const labelEl = document.getElementById('copy-btn-label');
  if (!templateEl) return;

  navigator.clipboard.writeText(templateEl.innerText).then(() => {
    if (labelEl) {
      labelEl.textContent = 'Template Berhasil Disalin!';
      setTimeout(() => {
        labelEl.textContent = 'Salin Template';
      }, 2500);
    }
  });
}

/* ==========================================================================
   5. FAQ ACCORDION TOGGLE
   ========================================================================== */

function toggleFaq(buttonEl) {
  const item = buttonEl.closest('.faq-item');
  if (!item) return;

  const isActive = item.classList.contains('active');
  // Close all
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
  
  if (!isActive) {
    item.classList.add('active');
  }
}
