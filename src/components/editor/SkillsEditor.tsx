'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Skill } from '@/types/resume';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Star } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useState } from 'react';

const skillSuggestions = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'Python',
  'Java', 'Go', 'SQL', 'MongoDB', 'Docker', 'Kubernetes',
  'AWS', 'Git', 'Linux', 'Figma', 'Photoshop', 'Excel',
];

export function SkillsEditor() {
  const skills = useResumeStore((state) => state.resume?.skills || []);
  const addSkill = useResumeStore((state) => state.addSkill);
  const updateSkill = useResumeStore((state) => state.updateSkill);
  const removeSkill = useResumeStore((state) => state.removeSkill);
  const [newSkill, setNewSkill] = useState('');

  const handleAdd = (name?: string) => {
    const skillName = name || newSkill.trim();
    if (!skillName) return;
    if (skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) return;
    
    addSkill({
      id: nanoid(),
      name: skillName,
      level: 3,
    });
    setNewSkill('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const unusedSuggestions = skillSuggestions.filter(
    (s) => !skills.some((skill) => skill.name.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入技能名称，按回车添加"
            className="input flex-1"
          />
          <motion.button
            onClick={() => handleAdd()}
            disabled={!newSkill.trim()}
            className="btn-primary px-4 disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-2">
        <AnimatePresence>
          {skills.map((skill) => (
            <SkillItem
              key={skill.id}
              skill={skill}
              onUpdate={(updates) => updateSkill(skill.id, updates)}
              onRemove={() => removeSkill(skill.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {skills.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-4">
          添加你的专业技能，展示核心能力
        </p>
      )}

      {/* Suggestions */}
      {unusedSuggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">快速添加：</p>
          <div className="flex flex-wrap gap-2">
            {unusedSuggestions.slice(0, 8).map((suggestion) => (
              <motion.button
                key={suggestion}
                onClick={() => handleAdd(suggestion)}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 
                         text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600
                         dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                + {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface SkillItemProps {
  skill: Skill;
  onUpdate: (updates: Partial<Skill>) => void;
  onRemove: () => void;
}

function SkillItem({ skill, onUpdate, onRemove }: SkillItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 group"
    >
      <span className="font-medium flex-1">{skill.name}</span>
      
      {/* Level Stars */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            onClick={() => onUpdate({ level })}
            className="p-0.5 transition-colors"
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                level <= skill.level
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>

      <motion.button
        onClick={onRemove}
        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 
                   dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
