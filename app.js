'use strict';
const ui = Object.fromEntries(['search', 'category', 'reset', 'count', 'resources', 'empty'].map(id => [id, document.getElementById(id)]));
let resources = [];
const colors = [['#147b45','#e0f2e7'],['#c4501b','#fce9da'],['#7932bc','#efe2fa'],['#176abb','#e0eefb'],['#bd326b','#f9e2ec'],['#087d87','#ddf2f1'],['#997000','#fbf1d2'],['#a63c43','#f9e4e2']];
const categoryPalette = {
  'Shelter (Overnight)': ['#176abb','#e0eefb'],
  'Shelter (Day Center)': ['#147b45','#e0f2e7'],
  'Food Resources': ['#c4501b','#fce9da'],
  'Food': ['#c4501b','#fce9da'],
  'Behavioral & Mental Health Services': ['#7932bc','#efe2fa'],
  'Behavioral & Mental Health Services for Youth': ['#7932bc','#efe2fa'],
  'Substance Use Treatment': ['#a63c43','#f9e4e2'],
  'Medical Care': ['#087d87','#ddf2f1'],
  'Medical and Respite': ['#087d87','#ddf2f1']
};
const culturalCategory = 'BIPOC Services';
const reentryCategory = 'Re-entry & Felon Friendly Resources';
let quickCategory = '';
function matchesCategory(r) {
  if (quickCategory === 'Food Resources') return ['Food', 'Food Resources'].includes(r.category);
  if (quickCategory === 'Behavioral & Mental Health Services') return r.category.startsWith('Behavioral & Mental Health Services');
  if (quickCategory === 'Medical Care') return ['Medical Care', 'Medical and Respite'].includes(r.category);
  if (ui.category.value === culturalCategory) return r.culturallySpecific === true;
  if (ui.category.value === reentryCategory) return r.category === reentryCategory || r.reentryRelated === true;
  return !ui.category.value || r.displayCategory === ui.category.value || r.additionalCategories?.includes(ui.category.value);
}
function node(tag, text, className) { const el = document.createElement(tag); if (text) el.textContent = text; if (className) el.className = className; return el; }
function websiteUrl(value) {
  if (!value || /\s/.test(value)) return null;
  try { const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`); return ['https:', 'http:'].includes(url.protocol) && url.hostname.includes('.') ? url.href : null; } catch { return null; }
}
function link(label, href, provider, external = false) {
  const a = node('a', '');
  a.href = href;

  if (external) {
    a.classList.add(label === 'Map' ? 'map-link' : 'website-link');
    const arrow = node('span', '↗', 'new-tab-arrow');
    arrow.setAttribute('aria-hidden', 'true');
    a.append(label + ' ', arrow);
    a.setAttribute('aria-label', `${label} for ${provider} (opens in a new tab)`);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  } else {
    const icon = node('span', '☎', 'phone-icon');
    icon.setAttribute('aria-hidden', 'true');
    a.classList.add('call-provider');
    a.append(icon, ' ' + label);
    a.setAttribute('aria-label', `${label} for ${provider}`);
  }

  return a;
}
function card(r) {
  const el = node('article', '', 'card');
  const hash = [...r.displayCategory].reduce((total, char) => total + char.charCodeAt(0), 0);
  const palette = categoryPalette[r.displayCategory] || colors[hash % colors.length]; el.style.setProperty('--accent', palette[0]); el.style.setProperty('--tint', palette[1]);
  if (r.category === 'Shelter (Overnight)') el.classList.add('night-card');
  if (r.category === 'Shelter (Day Center)') el.classList.add('day-card');
  if (r.name.trim().toLowerCase() === 'transgender center of the rockies') el.classList.add('trans-card');
  else if (r.category.includes('LGBTQ') || r.name.trim().toLowerCase() === 'youth seen') el.classList.add('rainbow-card');
  el.append(node('span', r.displayCategory || 'Other resources', 'badge'), node('h3', r.name));
  if (r.services) el.append(node('p', r.services, 'description'));
  const meta = node('div', '', 'metadata');
  const address = [r.streetAddress, r.city, [r.state, r.zipCode].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  if (address) meta.append(node('p', `Location: ${address}`));
  if (r.hours) meta.append(node('p', `Hours: ${r.hours}`));
  if (r.phone) meta.append(node('p', `Phone: ${r.phone}`)); el.append(meta);
  const actions = node('div', '', 'actions');
  const digits = r.phone.replace(/\D/g, '');
  
  const website = websiteUrl(r.website); if (website) actions.append(link('Website', website, r.name, true));
  if (r.streetAddress) actions.append(link('Map', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, r.name, true));
  if (/^[+\d().\s-]+$/.test(r.phone) && [10,11].includes(digits.length)) actions.append(link('Call provider', `tel:${digits}`, r.name));
  el.append(actions);
  const details = node('details'); details.append(node('summary', 'Intake, eligibility & notes'));
const publicNotes = (r.notes || '').replace(/\s*(?:Online sources? checked|Food audit|City routing checked) \d{4}-\d{2}-\d{2}(?::\s*https?:\/\/\S+(?:\s+and\s+https?:\/\/\S+)?|\.)/gi, '').trim();
for (const [label, value] of [['Intake', r.intake], ['Eligibility', r.eligibility], ['Notes', publicNotes]]) {    if (value) { details.append(node('p', label, 'detail-label'), node('p', value)); }
  }
  if (r.website && !website) details.append(node('p', `Website reference in guide: ${r.website}`));
  el.append(details); return el;
}
function render() {
  const query = ui.search.value.trim().toLowerCase();
  const matches = resources.filter(r => matchesCategory(r) && (!query || r.searchText.includes(query)));
  document.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === quickCategory)));
  ui.resources.replaceChildren(...matches.map(card)); ui.count.textContent = `${matches.length} of ${resources.length} resource entries`; ui.empty.hidden = matches.length !== 0;
}
function options(select, values) { [...new Set(values.filter(Boolean))].sort((a,b) => a.localeCompare(b)).forEach(value => { const option = node('option', value); option.value = value; select.append(option); }); }
async function start() {
  try {
    const response = await fetch('./data/resources.json?v=15'); if (!response.ok) throw new Error('Could not load guide');
    const data = await response.json();
    resources = data.resources.map(r => {
      const searchFields = Object.entries(r).filter(([key]) => !['source', 'id', 'culturallySpecific', 'reentryRelated', 'denverCounty'].includes(key)).map(([, value]) => value);
      if (r.reentryRelated || r.category === reentryCategory) searchFields.push('re-entry assistance reentry second chance fair chance felon friendly');
      return {...r, displayCategory: r.category, searchText: searchFields.join(' ').toLowerCase()};
    });
    // Shuffle once per page load so filtering keeps a stable resource order.
    for (let i = resources.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resources[i], resources[j]] = [resources[j], resources[i]];
    }
    const categories = resources.flatMap(r => [r.displayCategory, ...(r.additionalCategories || [])]);
    if (resources.some(r => r.culturallySpecific)) categories.push(culturalCategory);
    options(ui.category, categories); render();
  } catch { ui.count.textContent = 'The resource guide could not load.'; ui.empty.textContent = 'Please reload the page. If opening the downloaded files, use a local web server or GitHub Pages.'; ui.empty.hidden = false; }
}
ui.search.addEventListener('input', render);
ui.category.addEventListener('change', () => { quickCategory = ''; render(); });
ui.reset.addEventListener('click', () => { ui.search.value = ''; ui.category.value = ''; quickCategory = ''; render(); ui.search.focus(); });
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
  ui.search.value = ''; quickCategory = button.dataset.category; ui.category.value = quickCategory; render();
  document.getElementById('directory').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
}));
start();
