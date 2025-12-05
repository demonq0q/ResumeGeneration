'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle, Cloud } from 'lucide-react';
import { SaveStatus as SaveStatusType } from '@/types/resume';

interface SaveStatusProps {
  status: SaveStatusType;
}

export function SaveStatus({ status }: SaveStatusProps) {
  const statusConfig = {
    idle: { icon: Cloud, text: '未保存', color: 'text-gray-400' },
    saving: { icon: Loader2, text: '保存中...', color: 'text-blue-500' },
    saved: { icon: Check, text: '已保存', color: 'text-green-500' },
    error: { icon: AlertCircle, text: '保存失败', color: 'text-red-500' },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`flex items-center gap-1.5 text-sm ${config.color}`}
      >
        <Icon
          className={`w-4 h-4 ${status === 'saving' ? 'animate-spin' : ''}`}
        />
        <span>{config.text}</span>
      </motion.div>
    </AnimatePresence>
  );
}
