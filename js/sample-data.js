// Default content + demo content for the CV builder.
// No build step / no modules on purpose -- plain globals, loaded before app.js.

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const PLACEHOLDERS = {
  experience: {
    heading: 'Job Title',
    subheading: 'Company Name',
    location: 'City, Country',
    dates: 'e.g. 2022 — Present',
    description: 'Brief description of your responsibilities and achievements.',
  },
  education: {
    heading: 'Institution',
    subheading: 'Degree',
    location: 'City, Country',
    dates: 'e.g. 2018 — 2022',
    description: 'Relevant coursework, honors, or activities.',
  },
};

function newEntryItem(sectionId) {
  return { id: uid('item'), heading: '', subheading: '', location: '', dates: '', description: '' };
}

function newContactItem() {
  return { id: uid('item'), icon: 'email', label: 'Email', value: '' };
}

// "Quick set" list for contact items: picking one sets both a matching icon
// and a sensible label, while the label stays freely editable afterward.
const CONTACT_PRESETS = [
  { label: 'Email', icon: 'email' },
  { label: 'Phone', icon: 'phone' },
  { label: 'Location', icon: 'pin' },
  { label: 'Website', icon: 'link' },
  { label: 'LinkedIn', icon: 'link' },
  { label: 'GitHub', icon: 'link' },
  { label: 'Portfolio', icon: 'link' },
  { label: 'X / Twitter', icon: 'link' },
];

function newSkillItem() {
  return { id: uid('item'), name: '', level: 75, years: 2 };
}

const SKILL_DISPLAY_MODES = [
  { key: 'bar', label: 'Bar' },
  { key: 'years', label: 'Years' },
  { key: 'tag', label: 'Tags' },
];

function newLanguageItem() {
  return { id: uid('item'), name: '', level: 'Fluent' };
}

function newListItem() {
  return { id: uid('item'), primary: '', secondary: '' };
}

function emptySection(title, column, type) {
  const section = { title, column, type, items: [] };
  if (type === 'skills') section.displayMode = 'bar';
  return section;
}

function createBlankState() {
  return {
    meta: { template: 'modern-sidebar', accent: '#0984e3', mode: 'light', sidebarPosition: null, showPhoto: true },
    profile: { name: '', title: '', summary: '', photo: null },
    sectionOrder: ['experience', 'education', 'contact', 'skills', 'languages'],
    sections: {
      experience: emptySection('Experience', 'main', 'entries'),
      education: emptySection('Education', 'main', 'entries'),
      contact: emptySection('Contact', 'sidebar', 'contact'),
      skills: emptySection('Skills', 'sidebar', 'skills'),
      languages: emptySection('Languages', 'sidebar', 'languages'),
    },
  };
}

function createSampleState() {
  const s = createBlankState();
  s.profile = {
    name: 'Alex Morgan',
    title: 'Senior Product Designer',
    summary:
      'Product designer with 8+ years crafting user-centered digital experiences for fast-growing startups. Focused on design systems, accessibility, and measurable outcomes.',
    photo: null,
  };
  s.sections.experience.items = [
    {
      id: uid('item'),
      heading: 'Senior Product Designer',
      subheading: 'Northwind Labs',
      location: 'Remote',
      dates: '2022 — Present',
      description:
        'Led the redesign of the core product, improving activation by 34%. Built and maintain the company design system used by 6 product teams.',
    },
    {
      id: uid('item'),
      heading: 'Product Designer',
      subheading: 'Beacon Software',
      location: 'Austin, TX',
      dates: '2019 — 2022',
      description:
        'Owned end-to-end design for the billing and onboarding flows. Partnered with engineering and PM to ship weekly.',
    },
  ];
  s.sections.education.items = [
    {
      id: uid('item'),
      heading: 'University of Texas at Austin',
      subheading: 'B.S. in Human-Computer Interaction',
      location: 'Austin, TX',
      dates: '2015 — 2019',
      description: 'Graduated with honors. Minor in Computer Science.',
    },
  ];
  s.sections.contact.items = [
    { id: uid('item'), icon: 'email', label: 'Email', value: 'alex.morgan@email.com' },
    { id: uid('item'), icon: 'phone', label: 'Phone', value: '+1 (555) 010-2938' },
    { id: uid('item'), icon: 'pin', label: 'Location', value: 'Austin, TX' },
    { id: uid('item'), icon: 'link', label: 'Portfolio', value: 'alexmorgan.design' },
  ];
  s.sections.skills.items = [
    { id: uid('item'), name: 'Product Design', level: 95, years: 8 },
    { id: uid('item'), name: 'Design Systems', level: 90, years: 6 },
    { id: uid('item'), name: 'Figma', level: 92, years: 7 },
    { id: uid('item'), name: 'User Research', level: 78, years: 5 },
    { id: uid('item'), name: 'Prototyping', level: 85, years: 6 },
  ];
  s.sections.languages.items = [
    { id: uid('item'), name: 'English', level: 'Native' },
    { id: uid('item'), name: 'Spanish', level: 'Fluent' },
  ];
  const projectsId = 'custom-' + uid('sec');
  s.sections[projectsId] = emptySection('Projects', 'main', 'list');
  s.sections[projectsId].items = [
    {
      id: uid('item'),
      primary: 'Design System Overhaul',
      secondary: 'Rebuilt the component library in Figma + code, cutting design-to-dev handoff time in half.',
    },
  ];
  s.sectionOrder = ['experience', 'education', projectsId, 'contact', 'skills', 'languages'];
  return s;
}

const PALETTES = [
  { name: 'Ocean', accent: '#0984e3' },
  { name: 'Emerald', accent: '#00b894' },
  { name: 'Violet', accent: '#6c5ce7' },
  { name: 'Rose', accent: '#e84393' },
  { name: 'Coral', accent: '#e17055' },
  { name: 'Amber', accent: '#e1a100' },
  { name: 'Slate', accent: '#2d3436' },
  { name: 'Crimson', accent: '#d63031' },
];

const TEMPLATES = [
  { id: 'modern-sidebar', name: 'Modern Sidebar' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'timeline', name: 'Timeline' },
  { id: 'ats', name: 'ATS Compact' },
  { id: 'creative', name: 'Creative' },
];

const ADD_SECTION_PRESETS = [
  { title: 'Projects', column: 'main' },
  { title: 'Certifications', column: 'sidebar' },
  { title: 'Links', column: 'sidebar' },
  { title: 'Custom Section', column: 'main' },
];
