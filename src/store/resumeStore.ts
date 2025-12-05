import { create } from 'zustand';
import { Resume, ResumeSection, PersonalInfo, Education, Experience, Skill, Project, ThemeConfig, SaveStatus } from '@/types/resume';
import { createDefaultResume } from '@/lib/defaults';
import { saveResume as dbSave } from '@/lib/db';

interface ResumeState {
  resume: Resume | null;
  saveStatus: SaveStatus;
  
  // Actions
  setResume: (resume: Resume) => void;
  updatePersonal: (personal: Partial<PersonalInfo>) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
  
  // Sections
  updateSection: (id: string, updates: Partial<ResumeSection>) => void;
  reorderSections: (sections: ResumeSection[]) => void;
  
  // Education
  addEducation: (education: Education) => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  // Experience
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, updates: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  
  // Skills
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  
  // Projects
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  
  // Save
  save: () => Promise<void>;
  setSaveStatus: (status: SaveStatus) => void;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resume: null,
  saveStatus: 'idle',

  setResume: (resume) => set({ resume, saveStatus: 'idle' }),

  updatePersonal: (personal) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      personal: { ...state.resume.personal, ...personal },
    } : null,
    saveStatus: 'idle',
  })),

  updateTheme: (theme) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      theme: { ...state.resume.theme, ...theme },
    } : null,
    saveStatus: 'idle',
  })),

  updateSection: (id, updates) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      sections: state.resume.sections.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    } : null,
    saveStatus: 'idle',
  })),

  reorderSections: (sections) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      sections: sections.map((s, i) => ({ ...s, order: i })),
    } : null,
    saveStatus: 'idle',
  })),

  addEducation: (education) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      education: [...state.resume.education, education],
    } : null,
    saveStatus: 'idle',
  })),

  updateEducation: (id, updates) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      education: state.resume.education.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    } : null,
    saveStatus: 'idle',
  })),

  removeEducation: (id) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      education: state.resume.education.filter((e) => e.id !== id),
    } : null,
    saveStatus: 'idle',
  })),

  addExperience: (experience) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      experience: [...state.resume.experience, experience],
    } : null,
    saveStatus: 'idle',
  })),

  updateExperience: (id, updates) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      experience: state.resume.experience.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    } : null,
    saveStatus: 'idle',
  })),

  removeExperience: (id) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      experience: state.resume.experience.filter((e) => e.id !== id),
    } : null,
    saveStatus: 'idle',
  })),

  addSkill: (skill) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      skills: [...state.resume.skills, skill],
    } : null,
    saveStatus: 'idle',
  })),

  updateSkill: (id, updates) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      skills: state.resume.skills.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    } : null,
    saveStatus: 'idle',
  })),

  removeSkill: (id) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      skills: state.resume.skills.filter((s) => s.id !== id),
    } : null,
    saveStatus: 'idle',
  })),

  addProject: (project) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      projects: [...state.resume.projects, project],
    } : null,
    saveStatus: 'idle',
  })),

  updateProject: (id, updates) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      projects: state.resume.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    } : null,
    saveStatus: 'idle',
  })),

  removeProject: (id) => set((state) => ({
    resume: state.resume ? {
      ...state.resume,
      projects: state.resume.projects.filter((p) => p.id !== id),
    } : null,
    saveStatus: 'idle',
  })),

  save: async () => {
    const { resume } = get();
    if (!resume) return;
    
    set({ saveStatus: 'saving' });
    try {
      await dbSave(resume);
      set({ saveStatus: 'saved' });
    } catch (error) {
      console.error('Save failed:', error);
      set({ saveStatus: 'error' });
    }
  },

  setSaveStatus: (status) => set({ saveStatus: status }),
}));
