// site.js - dynamic content loader for news, credits, gallery
document.addEventListener('DOMContentLoaded', () => {
  loadNewsPreview(); loadNewsPage(); loadGalleryPreview(); loadGalleryPage(); loadCreditsPage(); updateBuildTime();
});

async function fetchJson(path){
  try {
    const res = await fetch(path + '?_=' + Date.now());
    if(!res.ok) throw new Error('fetch failed: ' + res.status);
    return await res.json();
  } catch(e) {
    console.error(e);
    return null;
  }
}

/* ---------- NEWS ---------- */
async function loadNewsPreview(){
  const el = document.getElementById('newsGrid');
  if(!el) return;
  const data = await fetchJson('news.json');
  if(!data) { el.innerHTML = '<div class="muted">No news found.</div>'; return; }
  el.innerHTML = '';
  data.slice(0,3).forEach(item => {
    const node = document.createElement('div'); node.className = 'news-item';
    node.innerHTML = `<h3>${escapeHtml(item.title)}</h3><div class="muted">${new Date(item.date).toLocaleString()}</div><p>${escapeHtml(item.content)}</p>`;
    el.appendChild(node);
  });
}

async function loadNewsPage(){
  const el = document.getElementById('newsList');
  if(!el) return;
  const data = await fetchJson('news.json');
  if(!data) { el.innerHTML = '<div class="muted">No news available.</div>'; return; }
  el.innerHTML = '';
  data.forEach(item => {
    const n = document.createElement('div'); n.className = 'news-item';
    n.innerHTML = `<h3>${escapeHtml(item.title)}</h3><div class="muted">${new Date(item.date).toLocaleString()}</div><p>${escapeHtml(item.content)}</p>`;
    el.appendChild(n);
  });
}

/* ---------- GALLERY ---------- */
async function loadGalleryPreview(){
  const el = document.getElementById('galleryGrid');
  if(!el) return;
  const data = await fetchJson('gallery.json');
  if(!data) { el.innerHTML = '<div class="muted">No gallery yet.</div>'; return; }
  el.innerHTML = '';
  data.slice(0,6).forEach(g => {
    const img = document.createElement('img');
    img.src = g.image; img.alt = g.caption || 'gallery'; img.loading = 'lazy';
    el.appendChild(img);
  });
}

async function loadGalleryPage(){
  const el = document.getElementById('galleryList');
  if(!el) return;
  const data = await fetchJson('gallery.json');
  if(!data) { el.innerHTML = '<div class="muted">No gallery yet.</div>'; return; }
  el.innerHTML = '';
  data.forEach(g => {
    const card = document.createElement('div'); card.className = 'news-item';
    card.innerHTML = `<img src="${escapeHtml(g.image)}" alt="${escapeHtml(g.caption||'gallery')}" style="width:100%;border-radius:8px"/><div style="padding-top:8px">${escapeHtml(g.caption||'')}</div>`;
    el.appendChild(card);
  });
}

/* ---------- CREDITS ---------- */
async function loadCreditsPage(){
  const el = document.getElementById('creditsGrid');
  if(!el) return;
  const data = await fetchJson('credits.json');
  if(!data) { el.innerHTML = '<div class="muted">No credits found.</div>'; return; }
  el.innerHTML = '';
  data.forEach(group => {
    (group.people||[]).forEach(p => {
      const c = document.createElement('div'); c.className = 'person-card';
      const avatar = `<div class="avatar">${escapeHtml((p.name||' ')[0].toUpperCase())}</div>`;
      const body = `<div><div style="font-weight:800">${escapeHtml(p.name)}</div><div class="muted">${escapeHtml(group.role)}</div><div style="margin-top:8px">${escapeHtml(p.credit||'')}</div></div>`;
      c.innerHTML = avatar + body;
      el.appendChild(c);
    });
  });
}

/* ---------- BUILD TIME ---------- */
async function updateBuildTime(){
  const el = document.getElementById('lastUpdate');
  if(el){
    // check latest news date as last update fallback
    const data = await fetchJson('news.json');
    if(data && data.length) el.textContent = new Date(data[0].date).toLocaleString();
    else el.textContent = new Date().toLocaleString();
  }
}

/* ---------- UTIL ---------- */
function escapeHtml(s){ if(!s) return ''; return s.replace ? s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])) : String(s); }
