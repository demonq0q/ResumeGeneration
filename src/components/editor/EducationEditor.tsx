'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Education } from '@/types/resume';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GraduationCap, Calendar } from 'lucide-react';
import { nanoid } from 'nanoid';

export function EducationEditor() {
  const education = useResumeStore((state) => state.resume?.education || []);
  const addEducation = useResumeStore((state) => state.addEducation);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const removeEducation = useResumeStore((state) => state.removeEducation);

  const handleAdd = () => {
    addEducation({
      id: nanoid(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      description: '',
    });
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {education.map((edu, index) => (
          <EducationItem
            key={edu.id}
            education={edu}
            index={index}
            onUpdate={(updates) => updateEducation(edu.id, updates)}
            onRemove={() => removeEducation(edu.id)}
          />
        ))}
      </AnimatePresence>

      <motion.button
        onClick={handleAdd}
        className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 
                   rounded-xl text-gray-400 hover:border-purple-400 hover:text-purple-500 
                   hover:bg-purple-50/50 dark:hover:bg-purple-900/10
                   transition-all flex items-center justify-center gap-2 group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        添加教育经历
      </motion.button>

      {education.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-4">
          添加你的教育背景，展示学术经历
        </p>
      )}
    </div>
  );
}

interface EducationItemProps {
  education: Education;
  index: number;
  onUpdate: (updates: Partial<Education>) => void;
  onRemove: () => void;
}

function EducationItem({ education, index, onUpdate, onRemove }: EducationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="card p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-purple-600" />
          </div>
          <span className="font-medium text-sm">
            {education.school || `教育 ${index + 1}`}
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

      <div className="space-y-1.5">
        <label className="label">学校名称</label>
        <input
          type="text"
          value={education.school}
          onChange={(e) => onUpdate({ school: e.target.value })}
          placeholder="学校名称"
          className="input"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="label">学位</label>
          <select
            value={education.degree}
            onChange={(e) => onUpdate({ degree: e.target.value })}
            className="input"
          >
            <option value="">选择学位</option>
            <option value="高中">高中</option>
            <option value="大专">大专</option>
            <option value="本科">本科</option>
            <option value="硕士">硕士</option>
            <option value="博士">博士</option>
            <option value="MBA">MBA</option>
            <option value="其他">其他</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="label">专业</label>
          <input
            type="text"
            value={education.field}
            onChange={(e) => onUpdate({ field: e.target.value })}
            placeholder="计算机科学"
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
            value={education.startDate}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
            className="input"
          />
        </div>
        <div className="space-y-1.5">
          <label className="label flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            结束时间
          </label>
          <input
            type="month"
            value={education.endDate}
            onChange={(e) => onUpdate({ endDate: e.target.value })}
            className="input"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="label">补充说明（可选）</label>
        <textarea
          value={education.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="GPA、荣誉奖项、相关课程等..."
          rows={2}
          className="textarea"
        />
      </div>
    </motion.div>
  );
}
