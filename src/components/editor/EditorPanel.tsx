'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { PersonalEditor } from './PersonalEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { ThemeEditor } from './ThemeEditor';
import { SectionSorter } from './SectionSorter';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderKanban,
  Palette,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  component: React.ComponentType;
  color: string;
}

type TabId = 'personal' | 'experience' | 'education' | 'skills' | 'projects' | 'theme' | 'layout';

const tabs: Tab[] = [
  { id: 'personal', label: '基本信息', icon: User, component: PersonalEditor, color: 'blue' },
  { id: 'experience', label: '工作经历', icon: Briefcase, component: ExperienceEditor, color: 'green' },
  { id: 'education', label: '教育背景', icon: GraduationCap, component: EducationEditor, color: 'purple' },
  { id: 'skills', label: '专业技能', icon: Wrench, component: SkillsEditor, color: 'orange' },
  { id: 'projects', label: '项目经验', icon: FolderKanban, component: ProjectsEditor, color: 'pink' },
  { id: 'theme', label: '主题样式', icon: Palette, component: ThemeEditor, color: 'indigo' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  green: 'bg-green-500/10 text-green-600 dark:text-green-400',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
};

export function EditorPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('personal');
  const sections = useResumeStore((state) => state.resume?.sections || []);
  const updateSection = useResumeStore((state) => state.updateSection);

  const getSectionVisibility = (type: string) => {
    const section = sections.find((s) => s.type === type);
    return section?.visible ?? true;
  };

  const toggleVisibility = (type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const section = sections.find((s) => s.type === type);
    if (section) {
      updateSection(section.id, { visible: !section.visible });
    }
  };

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || PersonalEditor;

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-500">编辑区块</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isVisible = tab.id === 'theme' || getSectionVisibility(tab.id);

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? `${colorMap[tab.color]} ring-2 ring-current/20`
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                } ${!isVisible && tab.id !== 'theme' ? 'opacity-50' : ''}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id !== 'theme' && (
                  <button
                    onClick={(e) => toggleVisibility(tab.id, e)}
                    className={`ml-1 p-0.5 rounded transition-colors ${
                      isVisible
                        ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30'
                        : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                    title={isVisible ? '点击隐藏' : '点击显示'}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="p-4"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Section Sorter */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700/50">
        <SectionSorter />
      </div>
    </div>
  );
}
