'use strict';
const ui = Object.fromEntries(['search', 'category', 'reset', 'count', 'resources', 'empty'].map(id => [id, document.getElementById(id)]));
let resources = [];
const colors = [['#526b61','#e7eee9'],['#a08060','#f1eade'],['#737c8a','#e9ecf1'],['#52778b','#e5edf1'],['#8b756e','#f1e8e3']];
let quickCategory = '';
function matchesCategory(r) {
  if (quickCategory === 'Food Resources') return ['Food', 'Food Resources'].includes(r.category);
  return !ui.category.value || r.displayCategory === ui.category.value;
}
function node(tag, text, className) { const el = document.createElement(tag); if (text) el.textContent = text; if (className) el.className = className; return el; }
function websiteUrl(value) {
  if (!value || /\s/.test(value)) return null;
  try { const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`); return ['https:', 'http:'].includes(url.protocol) && url.hostname.includes('.') ? url.href : null; } catch { return null; }
}
function link(label, href, external = false) { const a = node('a', label); a.href = href; if (external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } return a; }
function card(r) {
  const el = node('article', '', 'card');
  const hash = [...r.displayCategory].reduce((total, char) => total + char.charCodeAt(0), 0);
  const palette = colors[hash % colors.length]; el.style.setProperty('--accent', palette[0]); el.style.setProperty('--tint', palette[1]);
  el.append(node('span', r.displayCategory || 'Other resources', 'badge'), node('h3', r.name));
  if (r.services) el.append(node('p', r.services, 'description'));
  const meta = node('div', '', 'metadata');
  const address = [r.streetAddress, r.city, [r.state, r.zipCode].filter(Boolean).join(' ')].filter(Boolean).join(', ');
  if (address) meta.append(node('p', `Location: ${address}`));
  if (r.hours) meta.append(node('p', `Hours: ${r.hours}`));
  if (r.phone) meta.append(node('p', `Phone: ${r.phone}`)); el.append(meta);
  const actions = node('div', '', 'actions');
  const digits = r.phone.replace(/\D/g, '');
  if (/^[+\d().\s-]+$/.test(r.phone) && [10,11].includes(digits.length)) actions.append(link('Call provider', `tel:${digits}`));
  const website = websiteUrl(r.website); if (website) actions.append(link('Website ↗', website, true));
  if (r.streetAddress) actions.append(link('Map ↗', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, true));
  el.append(actions);
  const details = node('details'); details.append(node('summary', 'Intake, eligibility & notes'));
  for (const [label, value] of [['Intake', r.intake], ['Eligibility', r.eligibility], ['Notes', r.notes]]) {
    if (value) { details.append(node('p', label, 'detail-label'), node('p', value)); }
  }
  if (r.website && !website) details.append(node('p', `Website reference in guide: ${r.website}`));
  details.append(node('p', `Source: ${r.source.sheet}, row ${r.source.row}${r.source.visitDate ? ` • Visit/presentation: ${r.source.visitDate}` : ''}. Provider details not independently verified.`, 'provenance'));
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
    const response = await fetch('./data/resources.json'); if (!response.ok) throw new Error('Could not load guide');
    const data = await response.json();
    resources = data.resources.map(r => ({...r, displayCategory: r.category, searchText: Object.entries(r).filter(([key]) => !['source','id'].includes(key)).map(([, value]) => value).join(' ').toLowerCase()}));
    options(ui.category, resources.map(r => r.displayCategory)); render();
  } catch { ui.count.textContent = 'The resource guide could not load.'; ui.empty.textContent = 'Please reload the page. If opening the downloaded files, use a local web server or GitHub Pages.'; ui.empty.hidden = false; }
}
ui.search.addEventListener('input', render);
ui.category.addEventListener('change', () => { quickCategory = ''; render(); });
ui.reset.addEventListener('click', () => { ui.search.value = ''; ui.category.value = ''; quickCategory = ''; render(); ui.search.focus(); });
document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
  ui.search.value = ''; quickCategory = button.dataset.category; ui.category.value = quickCategory; render();
  document.getElementById('directory').scrollIntoView({behavior: 'smooth', block: 'start'});
}));
start();
