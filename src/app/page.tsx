'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllResumes, deleteResume, duplicateResume, saveResume } from '@/lib/db';
import { createDefaultResume } from '@/lib/defaults';
import { Resume } from '@/types/resume';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { presetThemes } from '@/lib/themes';
import {
  Plus,
  FileText,
  Trash2,
  Copy,
  MoreVertical,
  Sparkles,
  Zap,
  Shield,
  Download,
  Eye,
  Palette,
  ArrowRight,
  Github,
  X,
} from 'lucide-react';
import { nanoid } from 'nanoid';

export default function HomePage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await getAllResumes();
      setResumes(data);
    } catch (error) {
      console.error('Failed to load resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (themeId?: string) => {
    const newResume = createDefaultResume();
    if (themeId) {
      const theme = presetThemes.find(t => t.id === themeId);
      if (theme) newResume.theme = { ...theme };
    }
    await saveResume(newResume);
    router.push(`/editor/${newResume.id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这份简历吗？')) return;
    await deleteResume(id);
    setResumes((prev) => prev.filter((r) => r.id !== id));
    setMenuOpen(null);
  };

  const handleDuplicate = async (id: string) => {
    const newId = nanoid();
    const duplicated = await duplicateResume(id, newId);
    if (duplicated) {
      setResumes((prev) => [duplicated, ...prev]);
    }
    setMenuOpen(null);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
    });
  };

  const features = [
    { icon: Zap, title: '实时预览', desc: '编辑即可见，所见即所得' },
    { icon: Palette, title: '多种主题', desc: '精选配色方案，一键切换' },
    { icon: Download, title: 'PDF导出', desc: '高质量导出，完美排版' },
    { icon: Shield, title: '本地存储', desc: '数据安全，隐私无忧' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              简历工坊
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <ThemeToggle />
            <motion.button
              onClick={() => setShowTemplates(true)}
              className="btn-primary flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              新建简历
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              免费 · 开源 · 无需注册
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                打造专业简历
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                只需几分钟
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              简洁优雅的在线简历编辑器，实时预览、多种主题、一键导出 PDF，让你的简历脱颖而出
            </p>
            <div className="flex items-center justify-center gap-4">
              <motion.button
                onClick={() => setShowTemplates(true)}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-shadow flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                开始制作
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              {resumes.length > 0 && (
                <motion.button
                  onClick={() => document.getElementById('my-resumes')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  我的简历
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* My Resumes */}
      {resumes.length > 0 && (
        <section id="my-resumes" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">我的简历</h2>
              <span className="text-sm text-gray-500">{resumes.length} 份简历</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {resumes.map((resume, index) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => router.push(`/editor/${resume.id}`)}
                  >
                    {/* Preview */}
                    <div
                      className="aspect-[210/297] p-4 flex flex-col"
                      style={{ backgroundColor: resume.theme.backgroundColor }}
                    >
                      <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div
                          className="text-lg font-bold mb-1 truncate max-w-full px-2"
                          style={{ color: resume.theme.primaryColor }}
                        >
                          {resume.personal.name || '未填写姓名'}
                        </div>
                        <div
                          className="text-sm truncate max-w-full px-2"
                          style={{ color: resume.theme.secondaryColor }}
                        >
                          {resume.personal.title || '未填写职位'}
                        </div>
                      </div>
                      {/* Theme indicator */}
                      <div className="flex justify-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: resume.theme.primaryColor }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: resume.theme.secondaryColor }} />
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/editor/${resume.id}`);
                        }}
                        className="p-3 rounded-full bg-white text-gray-900 hover:scale-110 transition-transform"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicate(resume.id);
                        }}
                        className="p-3 rounded-full bg-white text-gray-900 hover:scale-110 transition-transform"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Copy className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(resume.id);
                        }}
                        className="p-3 rounded-full bg-red-500 text-white hover:scale-110 transition-transform"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Info */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                      <h3 className="font-medium truncate">{resume.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        更新于 {formatDate(resume.updatedAt)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && resumes.length === 0 && (
        <section className="py-16 px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
              <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">开始你的第一份简历</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              选择一个模板，几分钟内完成专业简历
            </p>
          </motion.div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <span>© 2024 简历工坊</span>
          <span>数据存储在本地浏览器中</span>
        </div>
      </footer>

      {/* Template Modal */}
      <AnimatePresence>
        {showTemplates && (
          <TemplateModal
            onClose={() => setShowTemplates(false)}
            onCreate={handleCreate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Template Selection Modal
function TemplateModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (themeId?: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">选择模板</h2>
            <p className="text-sm text-gray-500 mt-1">选择一个风格开始，之后可以随时更改</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {presetThemes.map((theme) => (
              <motion.button
                key={theme.id}
                onClick={() => onCreate(theme.id)}
                className="group relative rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-blue-500 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="aspect-[210/297] p-4 flex flex-col items-center justify-center"
                  style={{ backgroundColor: theme.backgroundColor }}
                >
                  <div
                    className="text-lg font-bold mb-1"
                    style={{ color: theme.primaryColor }}
                  >
                    张三
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: theme.secondaryColor }}
                  >
                    前端工程师
                  </div>
                  <div className="mt-4 flex gap-1">
                    <div className="w-8 h-1 rounded" style={{ backgroundColor: theme.primaryColor }} />
                    <div className="w-4 h-1 rounded" style={{ backgroundColor: theme.secondaryColor }} />
                  </div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 text-center">
                  <span className="font-medium">{theme.name}</span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-blue-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-semibold">使用此模板</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
