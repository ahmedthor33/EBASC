export interface RegionalLocation {
  id: string;
  name: string;
  address: string;
}

export interface ContactPageConfig {
  headerBadge: string;
  headerTitle: string;
  headerSubtitle: string;
  formTitle: string;
  responseSpeedText: string;
  phone: string;
  phoneHours: string;
  email: string;
  emailSubtitle: string;
  whatsapp: string;
  whatsappSubtitle: string;
  locations: RegionalLocation[];
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'replied' | 'resolved';
  createdAt: string;
}

export const DEFAULT_CONTACT_CONFIG: ContactPageConfig = {
  headerBadge: 'Dermatologie Concierge',
  headerTitle: 'Client Sanctuary & Consultation',
  headerSubtitle:
    'Our team of formulation specialists and logistics concierges are available 6 days a week across Pakistan to advise on personalized regimens and track active dispatches.',
  formTitle: 'Dispatch a Message to Our Concierge',
  responseSpeedText: 'We aim to respond to all inquiries within 2 to 4 business hours.',
  phone: '+92 21 3589 1234',
  phoneHours: 'Mon to Sat, 10:00 AM – 7:00 PM PKT',
  email: 'care@ebaskincare.pk',
  emailSubtitle: 'Direct client and medical relations',
  whatsapp: '+92 300 1234567',
  whatsappSubtitle: 'Instant order confirmation & courier assistance',
  locations: [
    {
      id: 'loc-1',
      name: 'Karachi Head Cleanroom',
      address: 'Plot 14-C, Lane 4, Zamzama Commercial, Clifton, Karachi',
    },
    {
      id: 'loc-2',
      name: 'Lahore Apothecary Studio',
      address: 'Main Boulevard, Block C-3, Gulberg III, Lahore',
    },
    {
      id: 'loc-3',
      name: 'Islamabad Distribution Hub',
      address: 'Executive Center, Jinnah Super, F-7/2, Islamabad',
    },
  ],
};

export const INITIAL_SAMPLE_INQUIRIES: ContactInquiry[] = [
  {
    id: 'inq-101',
    name: 'Zahra Mansoor',
    email: 'zahra.m@example.com',
    phone: '+92 321 8847291',
    subject: 'Dermatological Consultation',
    message:
      'I have hyperpigmentation on my cheeks due to Karachi sun exposure. Would you recommend the Niacinamide Glow Serum or the Glutathione night cream for combination sensitive skin?',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'inq-102',
    name: 'Bilal Farooq',
    email: 'bilal.f@example.com',
    phone: '+92 300 4591022',
    subject: 'Order & Delivery Tracking',
    message:
      'Placed order #EBA-84920 yesterday for Lahore delivery via TCS. Can you confirm if dispatch has departed the Clifton cleanroom?',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'inq-103',
    name: 'Dr. Ayesha Siddiqui',
    email: 'ayesha.siddiqui@dermalab.pk',
    phone: '+92 333 9182374',
    subject: 'Wholesale & Corporate Inquiries',
    message:
      'We run an aesthetic wellness clinic in Islamabad and would like to carry the EBA Women formulation line for our post-procedure clientele. Please share wholesale terms.',
    status: 'replied',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const CONTACT_CONFIG_KEY = 'eba_contact_config';
const CONTACT_INQUIRIES_KEY = 'eba_contact_inquiries';

export function getContactConfig(): ContactPageConfig {
  if (typeof window === 'undefined') return DEFAULT_CONTACT_CONFIG;
  try {
    const raw = localStorage.getItem(CONTACT_CONFIG_KEY);
    if (!raw) return DEFAULT_CONTACT_CONFIG;
    return { ...DEFAULT_CONTACT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_CONTACT_CONFIG;
  }
}

export function saveContactConfig(config: ContactPageConfig): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(CONTACT_CONFIG_KEY, JSON.stringify(config));
    window.dispatchEvent(new Event('eba_contact_settings_updated'));
    return true;
  } catch (err) {
    console.warn('Failed to save contact config:', err);
    return false;
  }
}

export function getContactInquiries(): ContactInquiry[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_INQUIRIES;
  try {
    const raw = localStorage.getItem(CONTACT_INQUIRIES_KEY);
    if (!raw) {
      localStorage.setItem(CONTACT_INQUIRIES_KEY, JSON.stringify(INITIAL_SAMPLE_INQUIRIES));
      return INITIAL_SAMPLE_INQUIRIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SAMPLE_INQUIRIES;
  }
}

export function saveContactInquiries(inquiries: ContactInquiry[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(CONTACT_INQUIRIES_KEY, JSON.stringify(inquiries));
    window.dispatchEvent(new Event('eba_contact_inquiries_updated'));
    return true;
  } catch (err) {
    console.warn('Failed to save contact inquiries:', err);
    return false;
  }
}

export function addContactInquiry(inquiry: Omit<ContactInquiry, 'id' | 'status' | 'createdAt'>): ContactInquiry {
  const current = getContactInquiries();
  const newInquiry: ContactInquiry = {
    ...inquiry,
    id: `inq-${Date.now().toString().slice(-6)}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  const updated = [newInquiry, ...current];
  saveContactInquiries(updated);
  return newInquiry;
}
