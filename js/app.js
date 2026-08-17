// Free CV Builder -- render engine, state management, event wiring.
// No build step, no framework: state is the single source of truth,
// render() rebuilds structural DOM from it, and localStorage persists it.

const STORAGE_KEY = 'cvbuilder.state.v1';

const ICONS = {
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1.5 1.5 0 0 1 1.5-.4c1.2.4 2.5.6 3.8.6a1.5 1.5 0 0 1 1.5 1.5V21a1.5 1.5 0 0 1-1.5 1.5C10.7 22.5 1.5 13.3 1.5 2.5A1.5 1.5 0 0 1 3 1h3.7a1.5 1.5 0 0 1 1.5 1.5c0 1.3.2 2.6.6 3.8a1.5 1.5 0 0 1-.4 1.5L6.6 10.8z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.3"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/></svg>',
  other: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 12.9 12.9 20.6a2 2 0 0 1-2.8 0l-7-7a2 2 0 0 1 0-2.8L10.8 3 20.6 12.9z"/><circle cx="7.5" cy="7.5" r="1.1" fill="currentColor" stroke="none"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 18v1.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V18"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3m0 0 4.5 4.5M12 3 7.5 7.5M4 18v1.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V18"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="m21 15-5-5-9 9"/></svg>',
  reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h10M4 12h6M4 18h12"/><circle cx="17" cy="6" r="2"/><circle cx="12" cy="18" r="2"/></svg>',
  grip: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.4"/><circle cx="15" cy="6" r="1.4"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><circle cx="9" cy="18" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9v.2h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3z"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6"/></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
  layout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/></svg>',
};

let state = load() || createBlankState();
let saveTimer = null;

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.sections || !parsed.sectionOrder) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 250);
}

// ---------- rendering ----------

function render() {
  document.body.dataset.template = state.meta.template;
  document.body.dataset.mode = state.meta.mode;
  document.body.dataset.photo = state.meta.showPhoto === false ? 'off' : 'on';
  if (state.meta.sidebarPosition) {
    document.body.dataset.sidebar = state.meta.sidebarPosition;
  } else {
    delete document.body.dataset.sidebar;
  }
  document.documentElement.style.setProperty('--accent', state.meta.accent);
  renderProfile();
  renderColumns();
  renderToolbarState();
  save();
}

function renderProfile() {
  const nameEl = document.getElementById('cv-name');
  const titleEl = document.getElementById('cv-title');
  const summaryEl = document.getElementById('cv-summary');
  nameEl.textContent = state.profile.name;
  titleEl.textContent = state.profile.title;
  summaryEl.textContent = state.profile.summary;

  const avatarWrap = document.getElementById('avatar-wrap');
  if (state.profile.photo) {
    avatarWrap.innerHTML = `<img src="${state.profile.photo}" alt="Profile photo" class="avatar">
      <button class="icon-btn avatar-remove no-print" data-action="remove-photo" aria-label="Remove photo">${ICONS.close}</button>`;
  } else {
    avatarWrap.innerHTML = `<button class="avatar avatar-empty no-print" data-action="upload-photo" aria-label="Add photo">${ICONS.image}</button>`;
  }
}

function renderColumns() {
  const main = document.getElementById('main-column');
  const sidebar = document.getElementById('sidebar-column');
  main.innerHTML = '';
  sidebar.innerHTML = '';
  state.sectionOrder.forEach((sectionId) => {
    const section = state.sections[sectionId];
    if (!section) return;
    const target = section.column === 'sidebar' ? sidebar : main;
    target.insertAdjacentHTML('beforeend', sectionHTML(sectionId, section));
  });
}

function singular(type) {
  return { entries: 'Entry', contact: 'Contact', skills: 'Skill', languages: 'Language', list: 'Item' }[type] || 'Item';
}

function skillModeToggleHTML(sectionId, mode) {
  const current = mode || 'bar';
  const buttons = SKILL_DISPLAY_MODES.map(
    (m) => `<button type="button" class="skill-mode-btn ${m.key === current ? 'active' : ''}" data-action="set-skill-mode" data-section="${esc(sectionId)}" data-mode="${m.key}">${esc(m.label)}</button>`
  ).join('');
  return `<div class="skill-mode-toggle no-print">${buttons}</div>`;
}

function sectionHTML(sectionId, section) {
  const itemsHTML = section.items.map((item) => itemHTML(sectionId, section, item)).join('');
  const itemsClass = section.type === 'skills' ? ` items--${section.displayMode || 'bar'}` : '';
  return `
    <section class="section section--${esc(section.type)}" data-section-id="${esc(sectionId)}" draggable="true">
      <div class="section-head">
        <span class="drag-handle no-print" aria-hidden="true">${ICONS.grip}</span>
        <h2 contenteditable="true" data-placeholder="Section title" data-bind="sections.${sectionId}.title">${esc(section.title)}</h2>
        <button class="icon-btn no-print" data-action="remove-section" data-section="${esc(sectionId)}" aria-label="Remove ${esc(section.title)} section">${ICONS.trash}</button>
      </div>
      ${section.type === 'skills' ? skillModeToggleHTML(sectionId, section.displayMode) : ''}
      <div class="items${itemsClass}">${itemsHTML}</div>
      <button class="add-btn no-print" data-action="add-item" data-section="${esc(sectionId)}">${ICONS.plus} Add ${singular(section.type)}</button>
    </section>`;
}

function itemHTML(sectionId, section, item) {
  const type = section.type;
  const bind = (field) => `sections.${sectionId}.items.${item.id}.${field}`;
  const removeBtn = `<button class="remove-btn no-print" data-action="remove-item" data-section="${esc(sectionId)}" data-id="${esc(item.id)}" aria-label="Remove">${ICONS.trash}</button>`;

  if (type === 'entries') {
    const ph = PLACEHOLDERS[sectionId] || PLACEHOLDERS.experience;
    return `
      <div class="editable-item entry-item" data-item-id="${esc(item.id)}">
        <div class="entry-item-head">
          <div contenteditable="true" class="entry-heading" data-placeholder="${esc(ph.heading)}" data-bind="${bind('heading')}">${esc(item.heading)}</div>
          <div contenteditable="true" class="entry-subheading" data-placeholder="${esc(ph.subheading)}" data-bind="${bind('subheading')}">${esc(item.subheading)}</div>
        </div>
        <div class="location-date">
          <span contenteditable="true" data-placeholder="${esc(ph.location)}" data-bind="${bind('location')}">${esc(item.location)}</span>
          <span contenteditable="true" data-placeholder="${esc(ph.dates)}" data-bind="${bind('dates')}">${esc(item.dates)}</span>
        </div>
        <div contenteditable="true" class="description" data-placeholder="${esc(ph.description)}" data-bind="${bind('description')}">${esc(item.description)}</div>
        ${removeBtn}
      </div>`;
  }

  if (type === 'contact') {
    const currentPreset = CONTACT_PRESETS.find((p) => p.label === item.label && p.icon === item.icon);
    const presetOptions = CONTACT_PRESETS.map(
      (p) => `<option value="${esc(p.label)}" ${currentPreset && currentPreset.label === p.label ? 'selected' : ''}>${esc(p.label)}</option>`
    ).join('');
    return `
      <div class="editable-item contact-item" data-item-id="${esc(item.id)}">
        <span class="contact-icon">${ICONS[item.icon] || ICONS.other}</span>
        <div class="contact-text">
          <select class="contact-type-select no-print" data-action="set-contact-type" data-section="${esc(sectionId)}" data-id="${esc(item.id)}" aria-label="Quick-set contact type">
            <option value="">${currentPreset ? 'Change type…' : 'Quick set…'}</option>
            ${presetOptions}
            <option value="other" ${item.icon === 'other' && !currentPreset ? 'selected' : ''}>Other (custom)</option>
          </select>
          <div contenteditable="true" class="contact-name" data-placeholder="Label" data-bind="${bind('label')}">${esc(item.label)}</div>
          <div contenteditable="true" class="contact-value" data-placeholder="Value" data-bind="${bind('value')}">${esc(item.value)}</div>
        </div>
        ${removeBtn}
      </div>`;
  }

  if (type === 'skills') {
    const mode = section.displayMode || 'bar';
    const nameField = `<div contenteditable="true" class="skill-name" data-placeholder="Skill name" data-bind="${bind('name')}">${esc(item.name)}</div>`;

    if (mode === 'tag') {
      return `
        <div class="editable-item skill-item skill-item--tag" data-item-id="${esc(item.id)}">
          ${nameField}
          ${removeBtn}
        </div>`;
    }

    if (mode === 'years') {
      const years = item.years === '' || item.years == null ? '' : Number(item.years);
      return `
        <div class="editable-item skill-item skill-item--years" data-item-id="${esc(item.id)}" data-years="${years === '' ? '' : years}">
          <div class="skill-row">
            ${nameField}
            <span class="skill-years-edit no-print">
              <input type="number" min="0" max="50" step="0.5" value="${years}" class="skill-years-input" data-action="set-skill-years" data-section="${esc(sectionId)}" data-id="${esc(item.id)}" aria-label="Years of experience">
              <span>yrs</span>
            </span>
            <span class="skill-years-print">${years === '' ? '' : `${years} yrs`}</span>
          </div>
          ${removeBtn}
        </div>`;
    }

    return `
      <div class="editable-item skill-item" data-item-id="${esc(item.id)}" data-level="${Number(item.level) || 0}">
        <div class="skill-row">
          ${nameField}
          <input type="range" min="0" max="100" value="${Number(item.level) || 0}" class="skill-range no-print" data-action="set-skill-level" data-section="${esc(sectionId)}" data-id="${esc(item.id)}" aria-label="Skill level">
        </div>
        <div class="skill-bar"><div class="skill-progress" style="width:${Number(item.level) || 0}%"></div></div>
        ${removeBtn}
      </div>`;
  }

  if (type === 'languages') {
    const levels = ['Basic', 'Intermediate', 'Fluent', 'Native'];
    const options = levels.map((l) => `<option value="${l}" ${l === item.level ? 'selected' : ''}>${l}</option>`).join('');
    return `
      <div class="editable-item language-item" data-item-id="${esc(item.id)}">
        <div contenteditable="true" class="language-name" data-placeholder="Language" data-bind="${bind('name')}">${esc(item.name)}</div>
        <select class="language-level-select no-print" data-action="set-language-level" data-section="${esc(sectionId)}" data-id="${esc(item.id)}" aria-label="Fluency">${options}</select>
        <span class="language-level-print">${esc(item.level)}</span>
        ${removeBtn}
      </div>`;
  }

  // generic "list" type used by custom sections (Projects, Certifications, Links, ...)
  return `
    <div class="editable-item list-item" data-item-id="${esc(item.id)}">
      <div contenteditable="true" class="list-primary" data-placeholder="Title" data-bind="${bind('primary')}">${esc(item.primary)}</div>
      <div contenteditable="true" class="list-secondary" data-placeholder="Description or link" data-bind="${bind('secondary')}">${esc(item.secondary)}</div>
      ${removeBtn}
    </div>`;
}

// ---------- state mutation helpers ----------

function findItem(sectionId, itemId) {
  const section = state.sections[sectionId];
  if (!section) return null;
  return section.items.find((it) => it.id === itemId) || null;
}

function setByBind(path, value) {
  const parts = path.split('.');
  if (parts[0] === 'profile') {
    state.profile[parts[1]] = value;
    return;
  }
  if (parts[0] === 'sections') {
    const sectionId = parts[1];
    if (parts[2] === 'title') {
      state.sections[sectionId].title = value;
      return;
    }
    if (parts[2] === 'items') {
      const item = findItem(sectionId, parts[3]);
      if (item) item[parts[4]] = value;
    }
  }
}

function addItem(sectionId) {
  const section = state.sections[sectionId];
  if (!section) return;
  const factory = { entries: newEntryItem, contact: newContactItem, skills: newSkillItem, languages: newLanguageItem, list: newListItem }[section.type] || newListItem;
  section.items.push(factory(sectionId));
  render();
}

function removeItem(sectionId, itemId) {
  const section = state.sections[sectionId];
  if (!section) return;
  section.items = section.items.filter((it) => it.id !== itemId);
  render();
}

function removeSection(sectionId) {
  const section = state.sections[sectionId];
  if (!section) return;
  if (!confirm(`Remove the "${section.title}" section?`)) return;
  delete state.sections[sectionId];
  state.sectionOrder = state.sectionOrder.filter((id) => id !== sectionId);
  render();
}

function addSection(preset) {
  const id = 'custom-' + uid('sec');
  state.sections[id] = emptySection(preset.title, preset.column, 'list');
  state.sectionOrder.push(id);
  render();
}

// ---------- event wiring ----------

function initContentEvents() {
  const root = document.getElementById('cv-root');

  root.addEventListener('input', (e) => {
    const el = e.target.closest('[data-bind]');
    if (!el) return;
    setByBind(el.dataset.bind, el.textContent);
    scheduleSave();
  });

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === 'add-item') addItem(btn.dataset.section);
    else if (action === 'remove-item') removeItem(btn.dataset.section, btn.dataset.id);
    else if (action === 'remove-section') removeSection(btn.dataset.section);
    else if (action === 'set-skill-mode') {
      const section = state.sections[btn.dataset.section];
      if (section) {
        section.displayMode = btn.dataset.mode;
        render();
      }
    } else if (action === 'upload-photo') document.getElementById('photo-input').click();
    else if (action === 'remove-photo') {
      state.profile.photo = null;
      render();
    }
  });

  root.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.action === 'set-contact-type') {
      if (!el.value) return;
      const item = findItem(el.dataset.section, el.dataset.id);
      if (!item) return;
      if (el.value === 'other') {
        item.icon = 'other';
      } else {
        const preset = CONTACT_PRESETS.find((p) => p.label === el.value);
        if (preset) {
          item.icon = preset.icon;
          item.label = preset.label;
        }
      }
      render();
    } else if (el.dataset.action === 'set-language-level') {
      const item = findItem(el.dataset.section, el.dataset.id);
      if (item) {
        item.level = el.value;
        render();
      }
    }
  });

  root.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.action === 'set-skill-level') {
      const item = findItem(el.dataset.section, el.dataset.id);
      if (item) {
        item.level = Number(el.value);
        const skillItem = el.closest('.skill-item');
        skillItem.dataset.level = item.level;
        const bar = skillItem.querySelector('.skill-progress');
        if (bar) bar.style.width = item.level + '%';
        scheduleSave();
      }
    } else if (el.dataset.action === 'set-skill-years') {
      const item = findItem(el.dataset.section, el.dataset.id);
      if (item) {
        const years = el.value === '' ? '' : Number(el.value);
        item.years = years;
        const skillItem = el.closest('.skill-item');
        skillItem.dataset.years = years === '' ? '' : years;
        const printEl = skillItem.querySelector('.skill-years-print');
        if (printEl) printEl.textContent = years === '' ? '' : `${years} yrs`;
        scheduleSave();
      }
    }
  });

  document.getElementById('photo-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.profile.photo = reader.result;
      render();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  initSectionDragDrop(root);
}

function initSectionDragDrop(root) {
  root.addEventListener('dragstart', (e) => {
    const section = e.target.closest('.section');
    if (!section) return;
    e.dataTransfer.setData('text/plain', section.dataset.sectionId);
    section.classList.add('dragging');
  });
  root.addEventListener('dragover', (e) => {
    if (e.target.closest('.section')) e.preventDefault();
  });
  root.addEventListener('drop', (e) => {
    const targetSection = e.target.closest('.section');
    if (!targetSection) return;
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    const targetId = targetSection.dataset.sectionId;
    if (draggedId === targetId) return;
    const order = state.sectionOrder;
    const from = order.indexOf(draggedId);
    if (from === -1) return;
    order.splice(from, 1);
    const to = order.indexOf(targetId);
    if (to === -1) return;
    order.splice(to + 1, 0, draggedId);
    render();
  });
  root.addEventListener('dragend', (e) => {
    const section = e.target.closest('.section');
    if (section) section.classList.remove('dragging');
  });
}

function initToolbar() {
  const toolbar = document.getElementById('toolbar');
  document.getElementById('toolbar-toggle').addEventListener('click', () => {
    toolbar.classList.toggle('open');
  });

  const templateWrap = document.getElementById('template-options');
  templateWrap.innerHTML = TEMPLATES.map(
    (t) => `<button class="chip" data-template-id="${t.id}" type="button">${esc(t.name)}</button>`
  ).join('');
  templateWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-template-id]');
    if (!btn) return;
    state.meta.template = btn.dataset.templateId;
    render();
  });

  const paletteWrap = document.getElementById('palette-options');
  paletteWrap.innerHTML = PALETTES.map(
    (p) => `<button class="swatch" data-accent="${p.accent}" style="--swatch:${p.accent}" title="${esc(p.name)}" type="button"></button>`
  ).join('');
  paletteWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-accent]');
    if (!btn) return;
    state.meta.accent = btn.dataset.accent;
    render();
  });

  document.getElementById('custom-accent').addEventListener('input', (e) => {
    state.meta.accent = e.target.value;
    render();
  });

  document.getElementById('toolbar-photo-btn').addEventListener('click', () => {
    document.getElementById('photo-input').click();
  });

  document.getElementById('show-photo-toggle').addEventListener('change', (e) => {
    state.meta.showPhoto = e.target.checked;
    render();
  });

  document.getElementById('mode-toggle').addEventListener('click', () => {
    state.meta.mode = state.meta.mode === 'dark' ? 'light' : 'dark';
    render();
  });

  document.getElementById('sidebar-position').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-side]');
    if (!btn || btn.classList.contains('disabled')) return;
    state.meta.sidebarPosition = btn.dataset.side;
    render();
  });

  const addSectionMenu = document.getElementById('add-section-menu');
  addSectionMenu.innerHTML = ADD_SECTION_PRESETS.map(
    (p, i) => `<button type="button" data-preset="${i}">${ICONS.plus} ${esc(p.title)}</button>`
  ).join('');
  document.getElementById('add-section-btn').addEventListener('click', () => {
    addSectionMenu.classList.toggle('open');
  });
  addSectionMenu.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-preset]');
    if (!btn) return;
    addSection(ADD_SECTION_PRESETS[Number(btn.dataset.preset)]);
    addSectionMenu.classList.remove('open');
  });

  document.getElementById('export-json').addEventListener('click', exportJSON);
  document.getElementById('import-json').addEventListener('change', importJSON);
  document.getElementById('download-pdf').addEventListener('click', () => window.print());
  document.getElementById('download-docx').addEventListener('click', exportDocx);
  document.getElementById('load-sample').addEventListener('click', () => {
    if (confirm('Load sample data? This replaces your current content.')) {
      state = createSampleState();
      render();
    }
  });
  document.getElementById('reset-cv').addEventListener('click', () => {
    if (confirm('Clear everything and start from a blank CV?')) {
      state = createBlankState();
      render();
    }
  });

  document.getElementById('share-tool').addEventListener('click', shareTool);

  const tipsModal = document.getElementById('tips-modal');
  document.getElementById('tips-btn').addEventListener('click', () => tipsModal.classList.add('open'));
  document.getElementById('tips-close').addEventListener('click', () => tipsModal.classList.remove('open'));
  tipsModal.addEventListener('click', (e) => {
    if (e.target === tipsModal) tipsModal.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') tipsModal.classList.remove('open');
  });
}

async function shareTool() {
  const shareData = {
    title: 'Free CV Builder',
    text: 'I just found a free, open-source CV builder — no sign-up, five templates, dark mode, and it runs entirely in your browser.',
    url: window.location.href.split('#')[0].split('?')[0],
  };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (e) {
      // user cancelled the share sheet -- nothing to do
    }
    return;
  }
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard — share it with someone who needs a CV!');
      return;
    } catch (e) {
      // fall through to prompt
    }
  }
  prompt('Copy this link to share:', shareData.url);
}

const TWO_COLUMN_TEMPLATES = ['modern-sidebar', 'creative'];
const TEMPLATE_DEFAULT_SIDE = { 'modern-sidebar': 'right', creative: 'left' };

function renderToolbarState() {
  document.querySelectorAll('#template-options [data-template-id]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.templateId === state.meta.template);
  });
  document.querySelectorAll('#palette-options [data-accent]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.accent.toLowerCase() === state.meta.accent.toLowerCase());
  });
  document.getElementById('custom-accent').value = state.meta.accent;
  const modeBtn = document.getElementById('mode-toggle');
  modeBtn.innerHTML = state.meta.mode === 'dark' ? ICONS.sun + ' Light mode' : ICONS.moon + ' Dark mode';

  const supportsSides = TWO_COLUMN_TEMPLATES.includes(state.meta.template);
  const effectiveSide = state.meta.sidebarPosition || TEMPLATE_DEFAULT_SIDE[state.meta.template];
  document.querySelectorAll('#sidebar-position [data-side]').forEach((btn) => {
    btn.classList.toggle('active', supportsSides && btn.dataset.side === effectiveSide);
    btn.classList.toggle('disabled', !supportsSides);
  });

  document.getElementById('show-photo-toggle').checked = state.meta.showPhoto !== false;
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = downloadFilename('json');
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadFilename(ext) {
  const base = (state.profile.name || 'cv').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${base || 'cv'}.${ext}`;
}

function buildDocxDocument() {
  const { Paragraph, TextRun, HeadingLevel } = docx;
  const children = [];

  children.push(new Paragraph({ text: state.profile.name || 'Your Name', heading: HeadingLevel.TITLE }));
  if (state.profile.title) children.push(new Paragraph({ text: state.profile.title, heading: HeadingLevel.HEADING_2 }));
  if (state.profile.summary) children.push(new Paragraph({ text: state.profile.summary, spacing: { after: 200 } }));

  state.sectionOrder.forEach((sectionId) => {
    const section = state.sections[sectionId];
    if (!section || !section.items.length) return;
    children.push(new Paragraph({ text: section.title, heading: HeadingLevel.HEADING_1, spacing: { before: 300, after: 120 } }));

    section.items.forEach((item) => {
      if (section.type === 'entries') {
        if (item.heading) children.push(new Paragraph({ children: [new TextRun({ text: item.heading, bold: true })] }));
        const sub = [item.subheading, item.location, item.dates].filter(Boolean).join('   •   ');
        if (sub) children.push(new Paragraph({ text: sub }));
        if (item.description) children.push(new Paragraph({ text: item.description, spacing: { after: 150 } }));
      } else if (section.type === 'contact') {
        if (item.value) children.push(new Paragraph({ text: `${item.label}: ${item.value}` }));
      } else if (section.type === 'skills') {
        if (item.name) children.push(new Paragraph({ text: `${item.name} — ${Number(item.level) || 0}%` }));
      } else if (section.type === 'languages') {
        if (item.name) children.push(new Paragraph({ text: `${item.name} — ${item.level}` }));
      } else {
        if (item.primary) children.push(new Paragraph({ children: [new TextRun({ text: item.primary, bold: true })] }));
        if (item.secondary) children.push(new Paragraph({ text: item.secondary, spacing: { after: 150 } }));
      }
    });
  });

  return new docx.Document({ sections: [{ children }] });
}

function exportDocx() {
  if (typeof docx === 'undefined') {
    alert('DOCX export needs an internet connection the first time it runs (it loads a small export library). Please check your connection and try again.');
    return;
  }
  docx.Packer.toBlob(buildDocxDocument()).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename('docx');
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });
}

function importJSON(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed || !parsed.sections || !parsed.sectionOrder || !parsed.profile) {
        throw new Error('Invalid file');
      }
      state = parsed;
      render();
    } catch (err) {
      alert('That file doesn\'t look like a valid CV Builder export.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
}

window.addEventListener('DOMContentLoaded', () => {
  initContentEvents();
  initToolbar();
  render();

  document.addEventListener('click', (e) => {
    const menu = document.getElementById('add-section-menu');
    if (menu.classList.contains('open') && !menu.contains(e.target) && e.target.id !== 'add-section-btn') {
      menu.classList.remove('open');
    }
  });
});
