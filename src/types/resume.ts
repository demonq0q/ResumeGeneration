export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  summary: string;
  avatar?: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  highlights: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  content: string;
}

export type SectionType = 'personal' | 'education' | 'experience' | 'skills' | 'projects' | 'custom';

export interface ResumeSection {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  order: number;
}

export interface ThemeConfig {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: 'sans' | 'serif';
  fontSize: 'small' | 'medium' | 'large';
  layout: 'single' | 'double';
}

export interface Resume {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  theme: ThemeConfig;
  sections: ResumeSection[];
  personal: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  customSections: CustomSection[];
}

export type SaveStatus = 'saved' | 'saving' | 'error' | 'idle';
