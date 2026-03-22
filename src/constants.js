// ════════════════════════════════════════════════════════════════════════════════
//  DATA: TEMPLATES
// ════════════════════════════════════════════════════════════════════════════════
export const TEMPLATES = {
  memo: {
    name: 'Internal Memo', icon: '📋',
    fields: ['organisation','department','docRef','date','to','from','subject','body'],
    layout: 'memo',
    description: 'Office-style communication between departments or staff members',
    useCases: ['Inter-department updates', 'Staff announcements', 'Policy reminders', 'Informal communications'],
    quickTip: 'Use for quick communications that stay within an organization'
  },
  incident: {
    name: 'Incident Report', icon: '⚠️',
    fields: ['organisation','department','incidentNumber','date','time','reportingOfficer','location','summary','body','actionTaken'],
    layout: 'report',
    description: 'Formal documentation of an incident or emergency event with investigation details',
    useCases: ['Security incidents', 'Workplace accidents', 'Emergency responses', 'Field event documentation'],
    quickTip: 'Use when you need to document something that went wrong with official tone'
  },
  bulletin: {
    name: 'Missing Person', icon: '🔍',
    fields: ['organisation','title','caseNumber','date','description','body','contact'],
    layout: 'bulletin',
    description: 'Public notice format for missing persons, objects, or announcements',
    useCases: ['Missing persons notices', 'Public alerts', 'Search bulletins', 'Distribution posters'],
    quickTip: 'Use for public-facing information that needs wide distribution'
  },
  notice: {
    name: 'Official Notice', icon: '📜',
    fields: ['organisation','department','docRef','date','title','body','authority'],
    layout: 'notice',
    description: 'Formal announcement or directive from institutional authority',
    useCases: ['Policy announcements', 'Regulatory notices', 'Official declarations', 'Procedural updates'],
    quickTip: 'Use for formal announcements that come from institutional authority'
  },
  research: {
    name: 'Research Log', icon: '🧪',
    fields: ['organisation','facility','experimentId','date','leadResearcher','clearance','observations','body','warnings'],
    layout: 'report',
    description: 'Scientific documentation of experiments, observations, and research findings',
    useCases: ['Lab experiment documentation', 'Field observations', 'Classified research logs', 'Scientific discoveries'],
    quickTip: 'Use for scientific or experimental work with technical observations'
  },
  casefile: {
    name: 'Case File Cover', icon: '📁',
    fields: ['organisation','department','caseNumber','date','subject','status','summary','assignedTo'],
    layout: 'cover',
    description: 'Cover sheet for case files, dossiers, or investigation folders',
    useCases: ['Investigation dossiers', 'Criminal case files', 'Personnel files', 'Archival folders'],
    quickTip: 'Use as the first page or cover of related documents bundled together'
  },
  intake: {
    name: 'Intake Form', icon: '📝',
    fields: ['organisation','department','formNumber','date','subjectName','dob','admittedBy','reason','body'],
    layout: 'form',
    description: 'Administrative intake form for individuals entering a system (hospital, police, etc.)',
    useCases: ['Hospital admission forms', 'Police intake documents', 'Facility check-in forms', 'Personnel onboarding'],
    quickTip: 'Use for recording someone\'s entry into an organization or system'
  },
  briefing: {
    name: 'Redacted Briefing', icon: '█▌',
    fields: ['organisation','department','reportCode','date','preparedBy','clearance','body'],
    layout: 'briefing',
    description: 'Classified or sensitive document with redacted sections for information protection',
    useCases: ['Classified briefings', 'Redacted reports', 'Secret memos', 'Declassified documents'],
    quickTip: 'Use for sensitive information with redactions - marking what cannot be revealed'
  }
};

// ════════════════════════════════════════════════════════════════════════════════
//  DATA: FIELD LABELS & CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════════
export const FIELD_LABELS = {
  organisation: 'Organisation',
  department: 'Department',
  facility: 'Facility',
  docRef: 'Reference Number',
  date: 'Date',
  time: 'Time',
  to: 'To',
  from: 'From',
  subject: 'Subject',
  title: 'Title',
  body: 'Body Text',
  summary: 'Summary',
  reportingOfficer: 'Reporting Officer',
  location: 'Location',
  actionTaken: 'Action Taken',
  incidentNumber: 'Incident Number',
  caseNumber: 'Case Number',
  contact: 'Contact Details',
  description: 'Description',
  experimentId: 'Experiment ID',
  leadResearcher: 'Lead Researcher',
  clearance: 'Clearance Level',
  observations: 'Observations',
  warnings: 'Warnings',
  status: 'Status',
  assignedTo: 'Assigned To',
  formNumber: 'Form Number',
  subjectName: 'Subject Name',
  dob: 'Date of Birth',
  admittedBy: 'Admitted By',
  reason: 'Reason',
  authority: 'Issuing Authority',
  reportCode: 'Report Code',
  preparedBy: 'Prepared By'
};

export const TEXTAREA_FIELDS = ['body','summary','observations','warnings','actionTaken','description','reason'];

// ════════════════════════════════════════════════════════════════════════════════
//  DATA: FLAVOUR PACKS
// ════════════════════════════════════════════════════════════════════════════════
export const FLAVOURS = {
  government: {
    orgDefault: 'DEPARTMENT OF INTERNAL AFFAIRS',
    deptDefault: 'Administrative Division',
    refPrefix: 'GOV',
    classWords: {
      confidential: 'OFFICIAL — SENSITIVE',
      secret: 'SECRET',
      internal: 'OFFICIAL',
      unclassified: 'UNCLASSIFIED'
    },
    footerDefault: 'FORM GOV-117 REV.3'
  },
  academic: {
    orgDefault: 'UNIVERSITY OF STRATHMORE',
    deptDefault: 'Faculty of Applied Sciences',
    refPrefix: 'ACAD',
    classWords: {
      confidential: 'RESTRICTED — FACULTY ONLY',
      secret: 'CLASSIFIED',
      internal: 'INTERNAL CIRCULATION',
      unclassified: 'UNRESTRICTED'
    },
    footerDefault: 'INTERNAL COMMUNICATION'
  },
  research: {
    orgDefault: 'MERIDIAN RESEARCH INSTITUTE',
    deptDefault: 'Containment & Analysis Division',
    refPrefix: 'MRI',
    classWords: {
      confidential: 'CONFIDENTIAL — LEVEL 3',
      secret: 'EYES ONLY — LEVEL 5',
      internal: 'INTERNAL — LEVEL 1',
      unclassified: 'UNCLASSIFIED'
    },
    footerDefault: 'DOCUMENT CONTROL — DO NOT DUPLICATE'
  },
  police: {
    orgDefault: 'METROPOLITAN POLICE SERVICE',
    deptDefault: 'Criminal Investigations Division',
    refPrefix: 'CID',
    classWords: {
      confidential: 'RESTRICTED — LAW ENFORCEMENT',
      secret: 'SECRET',
      internal: 'OFFICIAL — POLICE USE',
      unclassified: 'UNRESTRICTED'
    },
    footerDefault: 'EVIDENCE HANDLING PROTOCOL APPLIES'
  },
  medical: {
    orgDefault: 'ST. BARTHOLOMEW\'S HOSPITAL',
    deptDefault: 'Department of Psychiatry',
    refPrefix: 'MED',
    classWords: {
      confidential: 'CONFIDENTIAL — PATIENT DATA',
      secret: 'RESTRICTED — CLINICAL REVIEW',
      internal: 'INTERNAL — STAFF ONLY',
      unclassified: 'UNCLASSIFIED'
    },
    footerDefault: 'PATIENT CONFIDENTIALITY APPLIES'
  },
  corporate: {
    orgDefault: 'ALDERMAN & GREY PLC',
    deptDefault: 'Office of the General Counsel',
    refPrefix: 'AG',
    classWords: {
      confidential: 'CONFIDENTIAL — PRIVILEGED',
      secret: 'STRICTLY CONFIDENTIAL',
      internal: 'INTERNAL USE ONLY',
      unclassified: 'PUBLIC'
    },
    footerDefault: 'PRIVILEGED & CONFIDENTIAL'
  },
  occult: {
    orgDefault: 'THE ATHENÆUM SOCIETY',
    deptDefault: 'Department of Unnatural Philosophy',
    refPrefix: 'ATH',
    classWords: {
      confidential: 'SUB ROSA',
      secret: 'ARCANUM — DO NOT TRANSCRIBE',
      internal: 'RESTRICTED — INITIATES ONLY',
      unclassified: 'OPEN CIRCULATION'
    },
    footerDefault: 'ARCHIVE COPY — SEVENTH SEAL'
  },
  retro: {
    orgDefault: 'CENTRAL COMPUTING BUREAU',
    deptDefault: 'TERMINAL OUTPUT DIVISION',
    refPrefix: 'CCB',
    classWords: {
      confidential: '*** CONFIDENTIAL ***',
      secret: '*** TOP SECRET ***',
      internal: '*** INTERNAL ***',
      unclassified: '*** UNCLASSIFIED ***'
    },
    footerDefault: '>> END OF FILE <<'
  }
};

// ════════════════════════════════════════════════════════════════════════════════
//  DATA: STYLE OPTIONS (Paper, Ink, Stamps)
// ════════════════════════════════════════════════════════════════════════════════
export const PAPER_TONES = [
  { id: 'white', color: '#f8f6f1', label: 'White' },
  { id: 'cream', color: '#f0e8d5', label: 'Cream' },
  { id: 'aged', color: '#e8dcc4', label: 'Aged' },
  { id: 'yellow', color: '#f5eec8', label: 'Yellow' },
  { id: 'grey', color: '#e0ddd8', label: 'Grey' },
  { id: 'blue', color: '#dce4ec', label: 'Blue' }
];

export const INK_TONES = [
  { id: 'black', color: '#1a1a1a', label: 'Black' },
  { id: 'dark', color: '#2c2c2c', label: 'Dark' },
  { id: 'faded', color: '#4a4a4a', label: 'Faded' },
  { id: 'blue', color: '#1a2a4a', label: 'Blue' },
  { id: 'sepia', color: '#4a3520', label: 'Sepia' }
];

export const STAMPS = [
  'Approved', 'Denied', 'Confidential', 'Internal', 'Archived', 'Redacted', 'Evidence', 'Copy', 'Draft'
];

export const STAMP_COLORS = [
  { id: 'default', color: 'transparent', label: 'Default' },
  { id: 'red', color: '#b40000', label: 'Red' },
  { id: 'blue', color: '#000096', label: 'Blue' },
  { id: 'black', color: '#222', label: 'Black' },
  { id: 'faded', color: '#8a7050', label: 'Faded' }
];

// ════════════════════════════════════════════════════════════════════════════════
//  CLASSIFICATIONS
// ════════════════════════════════════════════════════════════════════════════════
export const CLASSIFICATIONS = ['none', 'unclassified', 'internal', 'confidential', 'secret'];
