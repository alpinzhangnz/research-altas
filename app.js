import { articles, searchArticles, topTags } from './data/articles.js';
import { chitchatPatterns } from './data/chitchat.js';
import { Subscription, PLANS } from './data/subscription.js';
import { Vault } from './data/vault.js';

const searchInput = document.getElementById('searchInput');
const resultsEl = document.getElementById('results');
const localResultsEl = document.getElementById('localResults');
const webResultsEl = document.getElementById('webResults');
const tabs = resultsEl.querySelectorAll('.tab');
const detailEl = document.getElementById('articleDetail');
const quickTopicsEl = document.getElementById('quickTopics');
const chatBodyEl = document.getElementById('chatBody');
const chatInputEl = document.getElementById('chatInput');
const chatSendEl = document.getElementById('chatSend');
const chatStopEl = document.getElementById('chatStop');
const chatRegenEl = document.getElementById('chatRegen');
const chatUseWebEl = document.getElementById('chatUseWeb');
const chatUseLocalEl = document.getElementById('chatUseLocal');
const chatPersonaEl = document.getElementById('chatPersona');
const chatTempEl = document.getElementById('chatTemp');

function renderTagsInline(tags) {
  return `<div class="tags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>`;
}

function renderResultItem(a) {
  const meta = `${a.category} • ${new Date(a.publishedAt).getFullYear()}`;
  return `
    <div class="result-item" data-slug="${a.slug}">
      <h3 class="result-title">${a.title}</h3>
      <div class="result-meta">${meta}</div>
      <div class="result-summary">${a.summary}</div>
      ${renderTagsInline(a.tags)}
    </div>
  `;
}

function renderLocalResults(list) {
  if (!list.length) {
    localResultsEl.innerHTML = `<div class="empty-state">No local results. Try a broader query or pick a topic below.</div>`;
    return;
  }
  localResultsEl.innerHTML = list.map(renderResultItem).join('');
}

function renderDetail(a) {
  if (!a) {
    detailEl.innerHTML = `<div class="empty-state">Select an article to read its summary and sources.</div>`;
    return;
  }
  const sourcesHtml = a.sources && a.sources.length
    ? `<div class="sources"><strong>Sources:</strong><ul>${a.sources.map(s => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.title}</a></li>`).join('')}</ul></div>`
    : '';
  detailEl.innerHTML = `
    <h2 class="article-title">${a.title}</h2>
    <div class="article-summary">${a.summary}</div>
    ${renderTagsInline(a.tags)}
    <div class="article-content">${a.content}</div>
    ${sourcesHtml}
  `;
}

function attachResultEvents() {
  localResultsEl.querySelectorAll('.result-item').forEach(el => {
    el.addEventListener('click', () => {
      const slug = el.getAttribute('data-slug');
      const a = articles.find(x => x.slug === slug);
      renderDetail(a);
      // Scroll into view on mobile
      detailEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function refreshLocal(query) {
  if (!Subscription.hasAccess('local_search')) {
    localResultsEl.innerHTML = `<div class="empty-state">🔒 Local Search is locked. Please upgrade to Starter or higher.</div>`;
    return;
  }
  const list = searchArticles(articles, query || '');
  renderLocalResults(list);
  attachResultEvents();
}

// Simple debouncer for web fetch
let webTimer = null;
let webReqSeq = 0;

async function fetchWikipedia(query, seq) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srprop=snippet&format=json&origin=*&srsearch=${encodeURIComponent(query)}`;
  let lastErr = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status}`);
        // retry once on server-side hiccups
        if (res.status >= 500 && attempt === 0) { await new Promise(r => setTimeout(r, 400)); continue; }
        throw lastErr;
      }
      const data = await res.json();
      if (seq !== webReqSeq) return null; // superseded
      return data?.query?.search || [];
    } catch (e) {
      lastErr = e;
      // retry once on network failures
      if (attempt === 0) { await new Promise(r => setTimeout(r, 400)); continue; }
      throw lastErr;
    }
  }
  throw lastErr || new Error('Unknown web error');
}

function renderWebResults(items, query) {
  if (!query || query.trim().length < 2) {
    webResultsEl.innerHTML = `<div class="empty-state">Type 2+ letters to search the web.</div>`;
    return;
  }
  if (!items || items.length === 0) {
    webResultsEl.innerHTML = `<div class="empty-state">No web matches found.</div>`;
    return;
  }
  const html = items.map(it => {
    const title = it.title;
    const link = `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s/g, '_'))}`;
    // snippet comes as HTML fragments; display safely
    const snippet = it.snippet || '';
    return `
      <div class="web-item">
        <a class="web-title" href="${link}" target="_blank" rel="noopener">${title}</a>
        <div class="web-snippet">${snippet}…</div>
      </div>
    `;
  }).join('');
  webResultsEl.innerHTML = html;
}

function refreshWeb(query) {
  if (!Subscription.hasAccess('web_search')) {
    webResultsEl.innerHTML = `<div class="empty-state">🔒 Web Search is a Premium feature.<br>Upgrade to access live Wikipedia results.</div>`;
    return;
  }
  const q = (query || '').trim();
  if (webTimer) clearTimeout(webTimer);
  webTimer = setTimeout(async () => {
    if (!q || q.length < 2) {
      renderWebResults([], q);
      return;
    }
    webReqSeq++;
    const mySeq = webReqSeq;
    webResultsEl.innerHTML = `<div class="empty-state">Searching web…</div>`;
    try {
      const items = await fetchWikipedia(q, mySeq);
      if (items === null) return; // superseded
      renderWebResults(items, q);
    } catch (err) {
      webResultsEl.innerHTML = `<div class="empty-state">Web search temporarily unavailable. Try again later or toggle off “Use Web”. (${err.message})</div>`;
    }
  }, 250);
}

function renderQuickTopics() {
  const tags = topTags(articles);
  quickTopicsEl.innerHTML = tags.map(t => `<span class="chip" data-tag="${t}">${t}</span>`).join('');
  quickTopicsEl.querySelectorAll('.chip').forEach(el => {
    el.addEventListener('click', () => {
      const tag = el.getAttribute('data-tag');
      searchInput.value = tag;
      refreshLocal(tag);
      refreshWeb(tag);
    });
  });
}

// Events
searchInput.addEventListener('input', (e) => {
  const q = e.target.value;
  refreshLocal(q);
  refreshWeb(q);
});

// Initial render
// Tabs behavior
tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.getAttribute('data-tab');
    if (tab === 'local') {
      localResultsEl.classList.remove('hidden');
      webResultsEl.classList.add('hidden');
    } else {
      localResultsEl.classList.add('hidden');
      webResultsEl.classList.remove('hidden');
    }
  });
});

renderQuickTopics();
refreshLocal('');
refreshWeb('');
renderDetail(null);

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function addMessage(role, text) {
  const el = document.createElement('div');
  el.className = `msg ${role}`;
  
  let displayName = role === 'user' ? 'You' : 'Research Atlas AI';
  // Check for Ultra plan to upgrade the name
  if (role === 'assistant' && Subscription.getCurrentPlan().id === 'ultra') {
    displayName = '🌌 ULTRA ATLAS AI';
  }

  el.innerHTML = `<div class="role">${displayName}</div><div class="bubble">${text}</div>`;
  chatBodyEl.appendChild(el);
  chatBodyEl.scrollTop = chatBodyEl.scrollHeight;
}

const conversationHistory = [];

async function composeAnswer(prompt, useWeb, useLocal, persona = 'default', temp = 0) {
  let localData = [];
  let webData = [];

  // Add user prompt to history
  conversationHistory.push({ role: 'user', content: prompt });

  if (useLocal) {
    localData = searchArticles(articles, prompt).slice(0, 3);
  }

  if (useWeb) {
    const seqBefore = ++webReqSeq;
    try {
      const items = await fetchWikipedia(prompt, seqBefore);
      if (items && items.length) {
        webData = items.slice(0, 3);
      }
    } catch (e) {
      console.warn("Web search failed for chat", e);
    }
  }

  const response = generateNarrative(prompt, localData, webData, persona, temp);
  
  // Add assistant response to history
  conversationHistory.push({ role: 'assistant', content: response });
  
  return response;
}

function getChitchatResponse(prompt) {
  const p = prompt.toLowerCase().trim();

  for (const pattern of chitchatPatterns) {
    if (pattern.regex.test(p)) {
      const responses = pattern.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  return null;
}

function generateNarrative(prompt, local, web, persona, temp) {
  // 1. Check Chitchat first
  const chitchat = getChitchatResponse(prompt);
  if (chitchat) return chitchat;

  if (local.length === 0 && web.length === 0) {
    return "I couldn't find any specific information on that topic in my database or the web. Could you try rephrasing or asking about something else?";
  }

  const parts = [];
  
  // 1. Establish Persona Tone
  let intro = "";
  if (persona === 'coder') intro = "Analyzed the query. Here is the output:";
  else if (persona === 'teacher') intro = "That's a great question. Let's break it down.";
  else if (persona === 'explainer') intro = "Here is the core concept:";
  else intro = "Here is what I found:";
  
  // 2. Synthesize Local Content (Primary Source)
  if (local.length > 0) {
    const main = local[0];
    // Use content for a richer answer, falling back to summary
    const body = main.content || main.summary;
    
    let section = `**${main.title}**\n${body}`;
    
    // Mention others briefly
    if (local.length > 1) {
      const others = local.slice(1).map(a => a.title).join(", ");
      section += `\n\n(Related topics: ${others})`;
    }
    parts.push(section);
  }

  // 3. Synthesize Web Content (Secondary Source)
  if (web.length > 0) {
    // Pick the best snippet (usually the first)
    const bestWeb = web[0];
    let snippet = stripHtml(bestWeb.snippet || '').trim();
    // Clean up snippet
    snippet = snippet.replace(/\s+/g, ' ');
    if (snippet.endsWith('...')) snippet = snippet.slice(0, -3);
    if (!snippet.endsWith('.')) snippet += '.';

    // Connective phrase
    const connective = local.length > 0 ? "Additionally, external sources note that" : "From web sources, I found that";
    
    parts.push(`${connective} ${snippet}`);
  }

  // Combine
  let fullText = parts.join('\n\n');

  // Apply "Temperature" / Creativity (Simulated)
  if (temp > 0.7) {
    fullText += "\n\nIt's fascinating how this connects to broader themes in the field!";
  }

  // Final assembly
  if (persona === 'default') {
    return fullText; // Direct answer for default
  }
  return `${intro}\n\n${fullText}`;
}

function sendChat() {
  const text = (chatInputEl.value || '').trim();
  if (!text) return;

  // Gate: Basic Chat Access
  if (!Subscription.hasAccess('chat')) {
    addMessage('assistant', '🔒 Chat is locked. Please upgrade your plan.');
    return;
  }

  addMessage('user', text);
  chatInputEl.value = '';
  window.lastUserPrompt = text;

  // Feature Gating Checks
  let useWeb = !!chatUseWebEl.checked;
  let useLocal = !!chatUseLocalEl.checked;
  let persona = (chatPersonaEl && chatPersonaEl.value) || 'default';
  let temp = chatTempEl ? parseFloat(chatTempEl.value || '0') : 0;
  
  const notices = [];

  // Check Web Access
  if (useWeb && !Subscription.hasAccess('web_search')) {
    useWeb = false;
    notices.push("Web search disabled (Premium feature).");
  }

  // Check Persona Access
  if (persona !== 'default' && !Subscription.hasAccess('personas')) {
    persona = 'default';
    notices.push("Persona reset to Default (Premium feature).");
  }

  if (notices.length > 0) {
    addMessage('assistant', `<em>Notice: ${notices.join(' ')}</em>`);
  }

  addMessage('assistant', 'Thinking…');
  composeAnswer(text, useWeb, useLocal, persona, temp).then(ans => {
    const last = chatBodyEl.querySelector('.msg.assistant .bubble:last-child');
    if (!last) return;
    streamAnswer(last, ans);
  });
}

chatSendEl.addEventListener('click', sendChat);
chatInputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
});

// Streaming controls
let streaming = false;
let streamAbort = false;

function styleWrap(text, persona, temp){
  const spice = temp > 0.6 ? ' Here are a couple of creative angles.' : '';
  if (persona === 'coder') return `Developer mode:${spice}\n\n` + text;
  if (persona === 'teacher') return `Step-by-step explanation:${spice}\n\n` + text;
  if (persona === 'explainer') return `Concise breakdown:${spice}\n\n` + text;
  return text;
}

function streamAnswer(el, html){
  const plain = stripHtml(html);
  const chars = Array.from(plain);
  streaming = true; streamAbort = false;
  el.textContent = '';
  let i = 0;
  const tick = () => {
    if (streamAbort){ streaming = false; return; }
    if (i >= chars.length){
      el.innerHTML = html;
      streaming = false;
      return;
    }
    el.textContent += chars[i];
    i++;
    setTimeout(tick, 12);
  };
  tick();
}

if (chatStopEl) chatStopEl.addEventListener('click', () => { streamAbort = true; });
if (chatRegenEl) chatRegenEl.addEventListener('click', () => {
  const prompt = window.lastUserPrompt || '';
  if (!prompt) return;
  const useWeb = !!chatUseWebEl.checked;
  const useLocal = !!chatUseLocalEl.checked;
  const persona = (chatPersonaEl && chatPersonaEl.value) || 'default';
  const temp = chatTempEl ? Math.min(1, parseFloat(chatTempEl.value || '0') + 0.2) : 0.3;
  addMessage('assistant', 'Regenerating…');
  composeAnswer(prompt, useWeb, useLocal, persona, temp).then(ans => {
    const last = chatBodyEl.querySelector('.msg.assistant .bubble:last-child');
    if (!last) return;
    streamAnswer(last, ans);
  });
});


// Subscription & UI Logic
const loginBtn = document.getElementById('loginBtn');
const plansBtn = document.getElementById('plansBtn');
const signupLink = document.getElementById('signupLink');
const userMenu = document.getElementById('userMenu');
const planBadge = document.getElementById('planBadge');
const pricingOverlay = document.getElementById('pricingOverlay');
const loginModal = document.getElementById('loginModal');
const closeLogin = document.getElementById('closeLogin');
const closePricing = document.getElementById('closePricing');
const loginForm = document.getElementById('loginForm');
const planBtns = document.querySelectorAll('.plan-btn');
const googleBtn = document.querySelector('.google-btn');
const forgotPassBtn = document.querySelector('.forgot-pass');

// Forgot Password Modal Elements
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const closeForgotPassword = document.getElementById('closeForgotPassword');
const sendPasswordBtn = document.getElementById('sendPasswordBtn');

// Payment Modal Elements
const paymentModal = document.getElementById('paymentModal');
const paymentForm = document.getElementById('paymentForm');
const paymentPlanName = document.getElementById('paymentPlanName');
const closePayment = document.getElementById('closePayment');
const payNowBtn = document.getElementById('payNowBtn');

// Admin/Vault Elements
const adminLink = document.getElementById('adminLink');
const vaultModal = document.getElementById('vaultModal');
const closeVault = document.getElementById('closeVault');
const vaultBalance = document.getElementById('vaultBalance');
const withdrawForm = document.getElementById('withdrawForm');
const withdrawBtn = document.getElementById('withdrawBtn');

// Benefit Modal Elements
const benefitModal = document.getElementById('benefitModal');
const benefitTitle = document.getElementById('benefitTitle');
const benefitDescription = document.getElementById('benefitDescription');
const closeBenefit = document.getElementById('closeBenefit');
const benefitItems = document.querySelectorAll('.plan-features li');

// Benefit Descriptions Map
const benefitDetails = {
  'Instant AI Access': 'Start chatting with our AI immediately without any setup or waiting time.',
  'Public Research Library': 'Access a curated collection of public research papers and articles.',
  'Ad-Free Interface': 'Enjoy a clean, distraction-free reading and research environment.',
  'Deep Neural Search': 'Use advanced algorithms to find hidden connections in your local documents.',
  'Unlimited Local Analysis': 'Process as many local files as you need without any caps or limits.',
  'Smart Summarization': 'Get concise, accurate summaries of long documents in seconds.',
  'Real-Time Web Intelligence': 'Search the live web for the latest information and news updates.',
  'Multi-Persona Reasoning': 'Switch between different AI experts like Coder, Teacher, or Analyst.',
  'Turbo-Charged Speed': 'Experience faster response times on all your queries.',
  'Quantum-Speed Processing': 'Get instant answers with our fastest, lowest-latency processing tier.',
  'God Mode Access': 'Unlock unrestricted access to all system capabilities and hidden features.',
  'Enterprise-Grade Security': 'Your data is protected with military-grade encryption and privacy controls.',
  'Early Access to Future Models': 'Be the first to try our newest, experimental AI models before anyone else.',
  'Omniscient AI Core': 'Tap into a collective intelligence that spans all known knowledge bases simultaneously.',
  'Time-Travel Research': 'Analyze historical trends and project future outcomes with predictive temporal algorithms.',
  'Direct Neural Interface': 'Experience a seamless connection that anticipates your queries before you type them.',
  'Reality Simulation Engine': 'Model complex real-world scenarios in a safe, virtual sandbox environment.'
};

console.log('App.js initialized');
console.log('Login Form found:', loginForm);
console.log('Google Btn found:', googleBtn);
console.log('Forgot Pass Btn found:', forgotPassBtn);

let selectedPlanForPayment = null;

function updatePlanUI() {
  const plan = Subscription.getCurrentPlan();
  
  // Update Badge
  planBadge.textContent = plan.name;
  planBadge.className = 'plan-badge'; // reset
  if (plan.id === 'gold') {
    planBadge.classList.add('gold');
    document.body.classList.add('theme-gold');
    document.body.classList.remove('theme-ultra');
  } else if (plan.id === 'ultra') {
    planBadge.classList.add('ultra');
    document.body.classList.add('theme-ultra');
    document.body.classList.remove('theme-gold');
  } else {
    document.body.classList.remove('theme-gold');
    document.body.classList.remove('theme-ultra');
  }

  // Show/Hide Sponsored Ads (Visitor Only)
  const sponsoredAd = document.getElementById('sponsoredAd');
  const headerSponsor = document.querySelector('.header-sponsor');
  
  if (plan.id === 'visitor' || plan.id === 'guest') {
     if (sponsoredAd) sponsoredAd.classList.remove('hidden');
     if (headerSponsor) headerSponsor.classList.remove('hidden');
   } else {
     if (sponsoredAd) sponsoredAd.classList.add('hidden');
     if (headerSponsor) headerSponsor.classList.add('hidden');
   }

  // Update Buttons
  if (plan.id === 'free') {
    loginBtn.textContent = 'Log In';
  } else {
    loginBtn.textContent = 'Switch Plan';
  }
}

function showLogin() {
  loginModal.classList.remove('hidden');
}

function hideLogin() {
  loginModal.classList.add('hidden');
}

function showPricing() {
  pricingOverlay.classList.add('active');
}

function hidePricing() {
  pricingOverlay.classList.remove('active');
}

function showPayment(planId) {
  selectedPlanForPayment = planId;
  const planName = planId.charAt(0).toUpperCase() + planId.slice(1);
  let planPrice = '$25/mo';
  if (planId === 'gold') planPrice = '$115/mo';
  if (planId === 'premium') planPrice = '$50/mo';
  if (planId === 'visitor') planPrice = '$1/mo';
  
  if (paymentPlanName) {
    paymentPlanName.textContent = `Upgrading to ${planName} • ${planPrice}`;
  }
  
  paymentModal.classList.remove('hidden');
}

function hidePayment() {
  paymentModal.classList.add('hidden');
  paymentForm.reset();
  selectedPlanForPayment = null;
  if (payNowBtn) payNowBtn.innerHTML = 'Pay Now';
}

function showBenefitDetail(featureName) {
  // Remove emoji if present
  const cleanName = featureName.replace(/^[^\w\s]+/, '').trim();
  const desc = benefitDetails[cleanName] || 'Unlock this powerful feature to enhance your research capabilities.';
  
  benefitTitle.textContent = cleanName;
  benefitDescription.textContent = desc;
  benefitModal.classList.remove('hidden');
}

// Event Listeners
if (benefitItems) {
  benefitItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent card click
      showBenefitDetail(e.target.textContent);
    });
  });
}

if (closeBenefit) {
  closeBenefit.addEventListener('click', () => {
    benefitModal.classList.add('hidden');
  });
}

if (plansBtn) {
  plansBtn.addEventListener('click', showPricing);
}

if (signupLink) {
  signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    hideLogin();
    showPricing();
  });
}

if (loginBtn) {
  loginBtn.addEventListener('click', () => {
    const plan = Subscription.getCurrentPlan();
    if (plan.id === 'guest') {
      showLogin();
    } else {
      showPricing();
    }
  });
}

if (closeLogin) {
  closeLogin.addEventListener('click', hideLogin);
}

// Pricing close removed as per "no guest function" request
// if (closePricing) {
//   closePricing.addEventListener('click', hidePricing);
// }

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulate login -> upgrade to Starter
    Subscription.setPlan('starter');
    updatePlanUI();
    hideLogin();
    alert('Logged in successfully! You are now on the Starter Plan.');
    
    // Refresh UI to reflect new permissions
    refreshLocal(searchInput.value);
    refreshWeb(searchInput.value);
  });
}

if (googleBtn) {
  googleBtn.addEventListener('click', () => {
    console.log('Google Sign In clicked');
    // Simulate Google Login
    googleBtn.innerHTML = 'Signing in...';
    setTimeout(() => {
      Subscription.setPlan('starter');
      updatePlanUI();
      hideLogin();
      alert('Successfully signed in with Google! Welcome back.');
      googleBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.032-3.726H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.968 10.695a5.41 5.41 0 0 1-.282-1.695c0-.586.102-1.154.282-1.695V4.973H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.027l3.011-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.973L3.968 7.3C4.672 5.157 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Sign in with Google
      `; // Reset button text
      
      // Refresh UI
      refreshLocal(searchInput.value);
      refreshWeb(searchInput.value);
    }, 1500);
  });
}

if (forgotPassBtn) {
  forgotPassBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Forgot Password clicked');
    hideLogin();
    forgotPasswordModal.classList.remove('hidden');
  });
}

if (closeForgotPassword) {
  closeForgotPassword.addEventListener('click', () => {
    forgotPasswordModal.classList.add('hidden');
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = forgotPasswordForm.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    sendPasswordBtn.innerHTML = 'Sending...';
    
    setTimeout(() => {
      alert(`Password reset link sent to ${email}. Please check your inbox.`);
      sendPasswordBtn.innerHTML = 'Send Password';
      forgotPasswordModal.classList.add('hidden');
      forgotPasswordForm.reset();
      showLogin(); // Go back to login
    }, 1500);
  });
}

if (paymentForm) {
  paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate Processing
    payNowBtn.innerHTML = 'Processing...';
    
    setTimeout(() => {
      if (Subscription.setPlan(selectedPlanForPayment)) {
        // Add funds to Vault
        const plan = Subscription.getCurrentPlan();
        Vault.addFunds(plan.price);
        
        updatePlanUI();
        hidePayment();
        alert(`Payment successful! Welcome to the ${selectedPlanForPayment.charAt(0).toUpperCase() + selectedPlanForPayment.slice(1)} Plan.`);
        
        // Refresh UI
        refreshLocal(searchInput.value);
        refreshWeb(searchInput.value);
      }
    }, 1500);
  });
}

// Dictionary Logic
const dictBtn = document.getElementById('dictBtn');
const dictModal = document.getElementById('dictModal');
const closeDict = document.getElementById('closeDict');
const dictSearchBtn = document.getElementById('dictSearchBtn');
const dictInput = document.getElementById('dictInput');
const dictResults = document.getElementById('dictResults');

if (dictBtn) {
  dictBtn.addEventListener('click', (e) => {
    e.preventDefault();
    dictModal.classList.remove('hidden');
    dictInput.focus();
  });
}

if (closeDict) {
  closeDict.addEventListener('click', () => {
    dictModal.classList.add('hidden');
  });
}

async function fetchDefinition(word) {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) throw new Error('Word not found');
    const data = await res.json();
    return data[0];
  } catch (err) {
    return null;
  }
}

if (dictSearchBtn && dictInput) {
  const handleSearch = async () => {
    const word = dictInput.value.trim();
    if (!word) return;

    dictResults.innerHTML = '<div class="dict-placeholder">Searching the global knowledge base...</div>';
    
    const data = await fetchDefinition(word);
    
    if (!data) {
      dictResults.innerHTML = `
        <div class="dict-placeholder" style="color: #ef4444">
          Could not find definition for "${word}".<br>Please try another word.
        </div>`;
      return;
    }

    const phonetic = data.phonetic || (data.phonetics.find(p => p.text) || {}).text || '';
    
    let html = `
      <div class="dict-word">${data.word}</div>
      ${phonetic ? `<div class="dict-phonetic">${phonetic}</div>` : ''}
    `;

    data.meanings.forEach(meaning => {
      html += `
        <div class="dict-meaning">
          <div class="dict-part-of-speech">${meaning.partOfSpeech}</div>
          ${meaning.definitions.slice(0, 3).map(def => `
            <div class="dict-def">• ${def.definition}</div>
            ${def.example ? `<div class="dict-example">"${def.example}"</div>` : ''}
          `).join('')}
        </div>
      `;
    });

    dictResults.innerHTML = html;
  };

  dictSearchBtn.addEventListener('click', handleSearch);
  dictInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
  });
}

// Art Studio Logic
const artBtn = document.getElementById('artBtn');
const artModal = document.getElementById('artModal');
const closeArt = document.getElementById('closeArt');
const generateArtBtn = document.getElementById('generateArtBtn');
const artPrompt = document.getElementById('artPrompt');
const artDisplay = document.getElementById('artDisplay');
const artStatus = document.getElementById('artStatus');
const statusText = artStatus ? artStatus.querySelector('.status-text') : null;
const progressFill = artStatus ? artStatus.querySelector('.progress-fill') : null;

if (artBtn) {
  artBtn.addEventListener('click', (e) => {
    e.preventDefault();
    artModal.classList.remove('hidden');
  });
}

if (closeArt) {
  closeArt.addEventListener('click', () => {
    artModal.classList.add('hidden');
  });
}

async function simulateLearning(prompt) {
  artStatus.classList.remove('hidden');
  const steps = [
    { progress: '10%', text: `Connecting to Neural Web for "${prompt}"...` },
    { progress: '30%', text: 'Analyzing 42 million reference styles...' },
    { progress: '50%', text: 'Optimizing latent space geometry...' },
    { progress: '75%', text: 'Applying artistic style transfer...' },
    { progress: '90%', text: 'Finalizing high-resolution render...' }
  ];

  for (const step of steps) {
    progressFill.style.width = step.progress;
    statusText.textContent = step.text;
    await new Promise(r => setTimeout(r, 600)); // Simulate delay
  }
}

if (generateArtBtn) {
  generateArtBtn.addEventListener('click', async () => {
    const prompt = artPrompt.value.trim();
    if (!prompt) return;

    // Remove placeholder if present
    const placeholder = artDisplay.querySelector('.art-placeholder');
    if (placeholder) {
      placeholder.style.display = 'none';
    }

    generateArtBtn.disabled = true;
    generateArtBtn.textContent = 'Dreaming...';
    
    // Simulate "Learning from Web"
    await simulateLearning(prompt);

    // Finalize Progress
    if (progressFill) progressFill.style.width = '100%';
    if (statusText) statusText.textContent = 'Rendering...';

    // Fetch Image from Pollinations.ai (Free, No Auth)
    const encodedPrompt = encodeURIComponent(prompt);
    // Use timestamp + random for unique seed
    const seed = Date.now() + Math.floor(Math.random() * 100000);
    // Simplified, reliable URL structure
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=false&model=flux`;

    // Create Image Element
    const img = document.createElement('img');
    img.className = 'art-image';
    img.src = imageUrl;
    img.alt = prompt;

    img.onload = () => {
      // Prepend the new image to the top
      artDisplay.insertBefore(img, artDisplay.firstChild);
      
      // Scroll to top to see the new creation
      artDisplay.scrollTop = 0;
      
      artStatus.classList.add('hidden');
      generateArtBtn.disabled = false;
      generateArtBtn.textContent = 'Generate Art';
      progressFill.style.width = '0%';
    };

    img.onerror = () => {
      // Only show error if no images exist, otherwise alert
      if (artDisplay.children.length === 0 || (artDisplay.children.length === 1 && placeholder)) {
         artDisplay.innerHTML = '<div class="art-placeholder" style="color: #ef4444;">Failed to generate image. Try again.</div>';
      } else {
         alert('Failed to generate image. Please try again.');
      }
      
      artStatus.classList.add('hidden');
      generateArtBtn.disabled = false;
      generateArtBtn.textContent = 'Generate Art';
    };
  });
}

// Plan Selection
planBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const card = e.target.closest('.plan-card');
    const planId = card.getAttribute('data-plan');
    
    // Bypass payment for all plans (User request: "just press it and you get whatever you want")
    Subscription.setPlan(planId);
    updatePlanUI();
    hidePricing();
    
    const planName = planId.charAt(0).toUpperCase() + planId.slice(1);
    alert(`Successfully switched to ${planName} Plan!`);

    // Refresh UI
    refreshLocal(searchInput.value);
    refreshWeb(searchInput.value);

    /* Original Payment Logic (Bypassed)
    if (planId === 'guest') {
       Subscription.setPlan('guest');
       updatePlanUI();
       hidePricing();
    } else {
      hidePricing();
      showPayment(planId);
    }
    */
  });
});

// Initialize
updatePlanUI();

// Force show menu if on guest plan (default) to ensure "no guest function" access
if (Subscription.getCurrentPlan().id === 'guest') {
  showPricing();
}

