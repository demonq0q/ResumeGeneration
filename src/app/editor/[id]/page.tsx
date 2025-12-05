'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useResumeStore } from '@/store/resumeStore';
import { useAutoSave } from '@/hooks/useAutoSave';
import { getResume } from '@/lib/db';
import { exportToPDF } from '@/lib/pdf';
import { EditorPanel } from '@/components/editor/EditorPanel';
import { ResumePreview } from '@/components/preview/ResumePreview';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SaveStatus } from '@/components/ui/SaveStatus';
import {
  ArrowLeft,
  Download,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Loader2,
  Check,
} from 'lucide-react';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const resume = useResumeStore((state) => state.resume);
  const setResume = useResumeStore((state) => state.setResume);
  const saveStatus = useAutoSave();

  const previewRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  // 手机端默认显示编辑器，桌面端默认分屏
  const [view, setView] = useState<'split' | 'editor' | 'preview'>('editor');
  
  // 检测屏幕宽度，桌面端默认分屏
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth >= 768) {
        setView('split');
      }
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    loadResume();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handleExport();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resume]);

  const loadResume = async () => {
    try {
      const data = await getResume(id);
      if (data) {
        setResume(data);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to load resume:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!previewRef.current || !resume) return;

    setExporting(true);
    setExportSuccess(false);
    try {
      const filename = `${resume.personal.name || resume.name || '简历'}.pdf`;
      await exportToPDF(previewRef.current, filename);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(150, Math.max(50, prev + delta)));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500">加载中...</span>
        </div>
      </div>
    );
  }

  if (!resume) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between no-print z-10">
        <div className="flex items-center gap-2 sm:gap-4">
          <motion.button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
            whileHover={{ x: -2 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-semibold text-sm">{resume.name}</h1>
              <SaveStatus status={saveStatus} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 sm:p-1">
            {[
              { id: 'editor', icon: Edit3, label: '编辑' },
              { id: 'split', icon: () => (
                <div className="w-4 h-4 flex gap-0.5">
                  <div className="flex-1 bg-current rounded-sm" />
                  <div className="flex-1 bg-current rounded-sm opacity-40" />
                </div>
              ), label: '分屏', hideOnMobile: true },
              { id: 'preview', icon: Eye, label: '预览' },
            ].map(({ id, icon: Icon, label, hideOnMobile }) => (
              <button
                key={id}
                onClick={() => setView(id as typeof view)}
                className={`px-2 sm:px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                  view === id
                    ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                } ${hideOnMobile ? 'hidden md:flex' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          <motion.button
            onClick={handleExport}
            disabled={exporting}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-sm transition-all ${
              exportSuccess
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : exportSuccess ? (
              <Check className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="hidden xs:inline sm:inline">
              {exportSuccess ? '已下载' : '导出'}
            </span>
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Editor Panel */}
        <AnimatePresence mode="wait">
          {(view === 'split' || view === 'editor') && (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden no-print flex flex-col ${
                view === 'split' ? 'hidden md:flex md:w-[45%]' : 'w-full'
              }`}
            >
              <EditorPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Preview Panel */}
        <AnimatePresence mode="wait">
          {(view === 'split' || view === 'preview') && (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex-1 flex flex-col bg-gray-200 dark:bg-gray-900 overflow-hidden ${
                view === 'split' ? 'hidden md:flex' : ''
              }`}
            >
              {/* Zoom Controls */}
              <div className="flex items-center justify-center gap-2 py-2 sm:py-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleZoom(-10)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  disabled={zoom <= 50}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                <button
                  onClick={() => handleZoom(10)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  disabled={zoom >= 150}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom(100)}
                  className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Preview Area */}
              <div className="flex-1 overflow-auto p-4 sm:p-8">
                <div
                  className="transition-transform duration-200 origin-top"
                  style={{ transform: `scale(${zoom / 100})` }}
                >
                  <ResumePreview ref={previewRef} resume={resume} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Save Status */}
      <div className="sm:hidden fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-full px-3 py-1.5 shadow-lg border border-gray-200 dark:border-gray-700">
        <SaveStatus status={saveStatus} />
      </div>
    </div>
  );
}
