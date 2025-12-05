'use client';

import { useResumeStore } from '@/store/resumeStore';
import { presetThemes } from '@/lib/themes';
import { ThemeConfig } from '@/types/resume';
import { motion } from 'framer-motion';
import { Check, Palette, Type, Layout, Maximize } from 'lucide-react';

export function ThemeEditor() {
  const theme = useResumeStore((state) => state.resume?.theme);
  const updateTheme = useResumeStore((state) => state.updateTheme);

  if (!theme) return null;

  return (
    <div className="space-y-6">
      {/* Preset Themes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-500" />
          <span className="font-medium text-sm">预设主题</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {presetThemes.map((preset) => (
            <motion.button
              key={preset.id}
              onClick={() => updateTheme(preset)}
              className={`relative p-3 rounded-xl border-2 transition-all ${
                theme.id === preset.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-5 h-5 rounded-full ring-2 ring-white dark:ring-gray-800 shadow"
                  style={{ backgroundColor: preset.primaryColor }}
                />
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: preset.secondaryColor }}
                />
              </div>
              <span className="text-xs font-medium">{preset.name}</span>
              {theme.id === preset.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <span className="font-medium text-sm">自定义颜色</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-500">主色调</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value, id: 'custom', name: '自定义' })}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value, id: 'custom', name: '自定义' })}
                className="input flex-1 text-sm font-mono"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-500">辅助色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.secondaryColor}
                onChange={(e) => updateTheme({ secondaryColor: e.target.value, id: 'custom', name: '自定义' })}
                className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={theme.secondaryColor}
                onChange={(e) => updateTheme({ secondaryColor: e.target.value, id: 'custom', name: '自定义' })}
                className="input flex-1 text-sm font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">字号大小</span>
        </div>
        <div className="flex gap-2">
          {[
            { value: 'small', label: '紧凑' },
            { value: 'medium', label: '标准' },
            { value: 'large', label: '宽松' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateTheme({ fontSize: value as ThemeConfig['fontSize'] })}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                theme.fontSize === value
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Layout className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">布局方式</span>
        </div>
        <div className="flex gap-2">
          {[
            { value: 'single', label: '单栏', icon: '▯' },
            { value: 'double', label: '双栏', icon: '▯▯' },
          ].map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => updateTheme({ layout: value as ThemeConfig['layout'] })}
              className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                theme.layout === value
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg tracking-wider">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Maximize className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">字体风格</span>
        </div>
        <div className="flex gap-2">
          {[
            { value: 'sans', label: '无衬线', sample: 'Aa' },
            { value: 'serif', label: '衬线', sample: 'Aa' },
          ].map(({ value, label, sample }) => (
            <button
              key={value}
              onClick={() => updateTheme({ fontFamily: value as ThemeConfig['fontFamily'] })}
              className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                theme.fontFamily === value
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className={`text-xl ${value === 'serif' ? 'font-serif' : 'font-sans'}`}>
                {sample}
              </span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
