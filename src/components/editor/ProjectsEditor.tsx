'use client';

import { useResumeStore } from '@/store/resumeStore';
import { Project } from '@/types/resume';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, FolderKanban, Link2 } from 'lucide-react';
import { nanoid } from 'nanoid';

export function ProjectsEditor() {
  const projects = useResumeStore((state) => state.resume?.projects || []);
  const addProject = useResumeStore((state) => state.addProject);
  const updateProject = useResumeStore((state) => state.updateProject);
  const removeProject = useResumeStore((state) => state.removeProject);

  const handleAdd = () => {
    addProject({
      id: nanoid(),
      name: '',
      description: '',
      url: '',
      highlights: [],
    });
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {projects.map((project, index) => (
          <ProjectItem
            key={project.id}
            project={project}
            index={index}
            onUpdate={(updates) => updateProject(project.id, updates)}
            onRemove={() => removeProject(project.id)}
          />
        ))}
      </AnimatePresence>

      <motion.button
        onClick={handleAdd}
        className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 
                   rounded-xl text-gray-400 hover:border-pink-400 hover:text-pink-500 
                   hover:bg-pink-50/50 dark:hover:bg-pink-900/10
                   transition-all flex items-center justify-center gap-2 group"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        添加项目经验
      </motion.button>

      {projects.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-4">
          添加你的项目经验，展示实战能力
        </p>
      )}
    </div>
  );
}

interface ProjectItemProps {
  project: Project;
  index: number;
  onUpdate: (updates: Partial<Project>) => void;
  onRemove: () => void;
}

function ProjectItem({ project, index, onUpdate, onRemove }: ProjectItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className="card p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
            <FolderKanban className="w-4 h-4 text-pink-600" />
          </div>
          <span className="font-medium text-sm">
            {project.name || `项目 ${index + 1}`}
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
          <label className="label">项目名称</label>
          <input
            type="text"
            value={project.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="项目名称"
            className="input"
          />
        </div>
        <div className="space-y-1.5">
          <label className="label flex items-center gap-1">
            <Link2 className="w-3.5 h-3.5 text-gray-400" />
            项目链接
          </label>
          <input
            type="url"
            value={project.url}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="https://..."
            className="input"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="label">项目描述</label>
        <textarea
          value={project.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="• 项目背景和目标&#10;• 使用的技术栈&#10;• 你的角色和贡献&#10;• 项目成果和影响"
          rows={4}
          className="textarea"
        />
        <p className="text-xs text-gray-400">
          描述项目的技术栈、你的角色和取得的成果
        </p>
      </div>
    </motion.div>
  );
}
