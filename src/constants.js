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

// ════════════════════════════════════════════════════════════════════════════════
//  INPUT VALIDATION: FIELD CONSTRAINTS (Gap 2)
// ════════════════════════════════════════════════════════════════════════════════
export const FIELD_CONSTRAINTS = {
  // Text fields - general metadata
  organisation: { maxLength: 150, type: 'text', minLength: 0 },
  department: { maxLength: 120, type: 'text', minLength: 0 },
  facility: { maxLength: 120, type: 'text', minLength: 0 },
  docRef: { maxLength: 50, type: 'text', minLength: 0 },
  to: { maxLength: 100, type: 'text', minLength: 0 },
  from: { maxLength: 100, type: 'text', minLength: 0 },
  subject: { maxLength: 200, type: 'text', minLength: 0 },
  title: { maxLength: 200, type: 'text', minLength: 0 },

  // Body/narrative text
  body: { maxLength: 5000, type: 'richtext', minLength: 0 },
  summary: { maxLength: 2000, type: 'richtext', minLength: 0 },
  observations: { maxLength: 3000, type: 'richtext', minLength: 0 },
  warnings: { maxLength: 2000, type: 'richtext', minLength: 0 },
  actionTaken: { maxLength: 2000, type: 'richtext', minLength: 0 },
  description: { maxLength: 2000, type: 'richtext', minLength: 0 },
  reason: { maxLength: 2000, type: 'richtext', minLength: 0 },

  // Reference numbers
  incidentNumber: { maxLength: 50, type: 'text', minLength: 0 },
  caseNumber: { maxLength: 50, type: 'text', minLength: 0 },
  experimentId: { maxLength: 50, type: 'text', minLength: 0 },
  formNumber: { maxLength: 50, type: 'text', minLength: 0 },
  reportCode: { maxLength: 50, type: 'text', minLength: 0 },

  // Person-related
  reportingOfficer: { maxLength: 100, type: 'text', minLength: 0 },
  leadResearcher: { maxLength: 100, type: 'text', minLength: 0 },
  preparedBy: { maxLength: 100, type: 'text', minLength: 0 },
  assignedTo: { maxLength: 100, type: 'text', minLength: 0 },
  subjectName: { maxLength: 100, type: 'text', minLength: 0 },
  admittedBy: { maxLength: 100, type: 'text', minLength: 0 },
  authority: { maxLength: 100, type: 'text', minLength: 0 },

  // Contact/location
  location: { maxLength: 150, type: 'text', minLength: 0 },
  contact: { maxLength: 200, type: 'text', minLength: 0 },

  // Special fields
  clearance: { maxLength: 100, type: 'text', minLength: 0 },
  status: { maxLength: 50, type: 'text', minLength: 0 },
  date: { maxLength: 10, type: 'date', minLength: 0 },
  time: { maxLength: 5, type: 'time', minLength: 0 },
  dob: { maxLength: 10, type: 'date', minLength: 0 },

  // Footer
  footerLeft: { maxLength: 100, type: 'text', minLength: 0 },
  footerRight: { maxLength: 100, type: 'text', minLength: 0 },

  // Metadata
  notes: { maxLength: 1000, type: 'text', minLength: 0 },
  attachments: { maxLength: 200, type: 'text', minLength: 0 }
};

// ════════════════════════════════════════════════════════════════════════════════
//  DEFAULT PRESETS WITH METADATA (Gap 8 - Advanced Preset System)
// ════════════════════════════════════════════════════════════════════════════════
export const DEFAULT_PRESETS = [
  {
    id: 'preset-gov-formal',
    name: 'Classic Government',
    description: 'Standard government memo with formal styling',
    metadata: {
      flavour: 'government',
      tags: ['formal', 'federal', 'official'],
      category: 'institutional',
      createdDate: 1711108800000, // 2024-03-22
      lastUsed: null,
      useFrequency: 0
    },
    styles: {
      template: 'memo',
      flavour: 'government',
      classification: 'internal',
      paper: 'cream',
      ink: 'black',
      density: 'normal',
      headerAlign: 'center',
      border: 'simple',
      pageWear: 5,
      photoNoise: 2,
      stamps: [],
      stampColor: 'default',
      showSignature: true,
      showPhoto: false,
      showRedaction: true
    }
  },
  {
    id: 'preset-acad-internal',
    name: 'Academic Confidential',
    description: 'University document with restricted circulation',
    metadata: {
      flavour: 'academic',
      tags: ['confidential', 'restricted', 'faculty'],
      category: 'institutional',
      createdDate: 1711108800000,
      lastUsed: null,
      useFrequency: 0
    },
    styles: {
      template: 'notice',
      flavour: 'academic',
      classification: 'confidential',
      paper: 'white',
      ink: 'dark',
      density: 'normal',
      headerAlign: 'left',
      border: 'double',
      pageWear: 0,
      photoNoise: 0,
      stamps: [],
      stampColor: 'red',
      showSignature: true,
      showPhoto: false,
      showRedaction: false
    }
  },
  {
    id: 'preset-research-classified',
    name: 'Research Lab (Classified)',
    description: 'Secure research documentation with containment focus',
    metadata: {
      flavour: 'research',
      tags: ['classified', 'laboratory', 'confidential', 'eyes-only'],
      category: 'institutional',
      createdDate: 1711108800000,
      lastUsed: null,
      useFrequency: 0
    },
    styles: {
      template: 'research',
      flavour: 'research',
      classification: 'secret',
      paper: 'aged',
      ink: 'faded',
      density: 'tight',
      headerAlign: 'center',
      border: 'double',
      pageWear: 15,
      photoNoise: 8,
      stamps: ['Confidential', 'Redacted'],
      stampColor: 'black',
      showSignature: true,
      showPhoto: true,
      showRedaction: true
    }
  },
  {
    id: 'preset-police-investigation',
    name: 'Police Investigation',
    description: 'Law enforcement incident and case documentation',
    metadata: {
      flavour: 'police',
      tags: ['law-enforcement', 'incident', 'investigation', 'evidence'],
      category: 'institutional',
      createdDate: 1711108800000,
      lastUsed: null,
      useFrequency: 0
    },
    styles: {
      template: 'incident',
      flavour: 'police',
      classification: 'confidential',
      paper: 'white',
      ink: 'black',
      density: 'normal',
      headerAlign: 'left',
      border: 'simple',
      pageWear: 3,
      photoNoise: 4,
      stamps: ['Evidence'],
      stampColor: 'blue',
      showSignature: true,
      showPhoto: true,
      showRedaction: true
    }
  },
  {
    id: 'preset-medical-patient',
    name: 'Medical Records',
    description: 'Hospital and clinical documentation',
    metadata: {
      flavour: 'medical',
      tags: ['medical', 'confidential', 'patient-data', 'clinical'],
      category: 'institutional',
      createdDate: 1711108800000,
      lastUsed: null,
      useFrequency: 0
    },
    styles: {
      template: 'intake',
      flavour: 'medical',
      classification: 'confidential',
      paper: 'blue',
      ink: 'dark',
      density: 'normal',
      headerAlign: 'center',
      border: 'simple',
      pageWear: 0,
      photoNoise: 2,
      stamps: ['Confidential'],
      stampColor: 'red',
      showSignature: true,
      showPhoto: true,
      showRedaction: true
    }
  },
  {
    id: 'preset-corporate-legal',
    name: 'Corporate Legal',
    description: 'Business and legal documents with privilege markings',
    metadata: {
      flavour: 'corporate',
      tags: ['legal', 'confidential', 'privileged', 'business'],
      category: 'institutional',
      createdDate: 1711108800000,
      lastUsed: null,
      useFrequency: 0
    },
    styles: {
      template: 'memo',
      flavour: 'corporate',
      classification: 'confidential',
      paper: 'white',
      ink: 'black',
      density: 'normal',
      headerAlign: 'left',
      border: 'double',
      pageWear: 0,
      photoNoise: 0,
      stamps: [],
      stampColor: 'default',
      showSignature: true,
      showPhoto: false,
      showRedaction: false
    }
  }
];
