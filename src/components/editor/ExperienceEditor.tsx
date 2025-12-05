'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Experience } from '@/types/resume';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Building2, Calendar } from 'lucide-react';
import { nanoid } from 'nanoid';

export function ExperienceEditor() {
  const experience = useResumeStore((state) => state.resume?.experience || []);
  const addExperience = useResumeStore((state) => state.addExperience);
  const updateExperience = useResumeStore((state) => state.updateExperience);
  const removeExperience = useResumeStore((state) => state.removeExperience);

  const handleAdd = () => {
    addExperience({
      id: nanoid(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [],
    });
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {experience.map((exp, index) => (
          <ExperienceItem
            key={exp.id}
            experience={exp}
            index={index}
            onUpdate={(updates) => updateExperience(exp.id, updates)}
            onRemove={() => removeExperience(exp.id)}
          />
        ))}
      </AnimatePresence>

      <motion.button
        onClick={handleAdd}
        className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 
                   rounded-xl text-gray-400 hover:border-blue-400 hover:text-blue-500 
                   hover:bg-blue-50/50 dark:hover:bg-blue-900/10
                   transition-all flex items-center justify-center gap-2 group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        添加工作经历
      </motion.button>

      {experience.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-4">
          添加你的工作经历，展示职业发展轨迹
        </p>
      )}
    </div>
  );
}

interface ExperienceItemProps {
  experience: Experience;
  index: number;
  onUpdate: (updates: Partial<Experience>) => void;
  onRemove: () => void;
}

function ExperienceItem({ experience, index, onUpdate, onRemove }: ExperienceItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="card p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-green-600" />
          </div>
          <span className="font-medium text-sm">
            {experience.company || `经历 ${index + 1}`}
          </span>
        </div>
        <motion.button
          onClick={onRemove}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="label">公司名称</label>
          <input
            type="text"
            value={experience.company}
            onChange={(e) => onUpdate({ company: e.target.value })}
            placeholder="公司名称"
            className="input"
          />
        </div>
        <div className="space-y-1.5">
          <label className="label">职位</label>
          <input
            type="text"
            value={experience.position}
            onChange={(e) => onUpdate({ position: e.target.value })}
            placeholder="职位名称"
            className="input"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="label flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            开始时间
          </label>
          <input
            type="month"
            value={experience.startDate}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
            className="input"
          />
        </div>
        <div className="space-y-1.5">
          <label className="label flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            结束时间
          </label>
          <div className="flex items-center gap-2">
            <input
              type="month"
              value={experience.endDate}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              disabled={experience.current}
              className="input flex-1 disabled:opacity-50"
            />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={experience.current}
              onChange={(e) => onUpdate({ current: e.target.checked, endDate: '' })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-500">至今</span>
          </label>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="label">工作描述</label>
        <textarea
          value={experience.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="• 负责xxx项目的开发和维护&#10;• 优化了xxx，提升了xx%的性能&#10;• 带领团队完成xxx"
          rows={4}
          className="textarea"
        />
        <p className="text-xs text-gray-400">
          建议使用「动词 + 结果」的格式，量化你的成就
        </p>
      </div>
    </motion.div>
  );
}
