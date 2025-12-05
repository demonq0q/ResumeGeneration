import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Resume } from '@/types/resume';

interface ResumeDB extends DBSchema {
  resumes: {
    key: string;
    value: Resume;
    indexes: { 'by-date': string };
  };
}

let dbPromise: Promise<IDBPDatabase<ResumeDB>> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<ResumeDB>('resume-editor', 1, {
      upgrade(db) {
        const store = db.createObjectStore('resumes', { keyPath: 'id' });
        store.createIndex('by-date', 'updatedAt');
      },
    });
  }
  return dbPromise;
}

export async function saveResume(resume: Resume): Promise<void> {
  const db = await getDB();
  const updated = { ...resume, updatedAt: new Date().toISOString() };
  await db.put('resumes', updated);
}

export async function getResume(id: string): Promise<Resume | undefined> {
  const db = await getDB();
  return db.get('resumes', id);
}

export async function getAllResumes(): Promise<Resume[]> {
  const db = await getDB();
  const resumes = await db.getAllFromIndex('resumes', 'by-date');
  return resumes.reverse(); // newest first
}

export async function deleteResume(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('resumes', id);
}

export async function duplicateResume(id: string, newId: string): Promise<Resume | null> {
  const db = await getDB();
  const original = await db.get('resumes', id);
  if (!original) return null;
  
  const now = new Date().toISOString();
  const duplicate: Resume = {
    ...original,
    id: newId,
    name: `${original.name} (副本)`,
    createdAt: now,
    updatedAt: now,
  };
  await db.put('resumes', duplicate);
  return duplicate;
}
