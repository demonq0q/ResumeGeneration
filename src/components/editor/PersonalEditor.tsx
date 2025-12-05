'use client';

import { useResumeStore } from '@/store/resumeStore';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { AvatarUpload } from '@/components/ui/AvatarUpload';

export function PersonalEditor() {
  const personal = useResumeStore((state) => state.resume?.personal);
  const updatePersonal = useResumeStore((state) => state.updatePersonal);

  if (!personal) return null;

  const fields = [
    { key: 'name', label: '姓名', placeholder: '张三', icon: User },
    { key: 'title', label: '职位', placeholder: '前端工程师', icon: FileText },
    { key: 'email', label: '邮箱', placeholder: 'example@email.com', icon: Mail },
    { key: 'phone', label: '电话', placeholder: '138-0000-0000', icon: Phone },
    { key: 'location', label: '所在地', placeholder: '北京市', icon: MapPin },
    { key: 'website', label: '个人网站', placeholder: 'https://example.com', icon: Globe },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Avatar Upload */}
      <div className="space-y-2">
        <label className="label">个人头像（可选）</label>
        <AvatarUpload
          value={personal.avatar}
          onChange={(dataUrl) => updatePersonal({ avatar: dataUrl })}
          onRemove={() => updatePersonal({ avatar: '' })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder, icon: Icon }) => (
          <div key={key} className="space-y-1.5">
            <label className="label flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5 text-gray-400" />
              {label}
            </label>
            <input
              type="text"
              value={(personal as any)[key] || ''}
              onChange={(e) => updatePersonal({ [key]: e.target.value })}
              placeholder={placeholder}
              className="input"
            />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <label className="label">个人简介</label>
        <textarea
          value={personal.summary}
          onChange={(e) => updatePersonal({ summary: e.target.value })}
          placeholder="简要介绍你的专业背景、核心技能和职业目标..."
          rows={4}
          className="textarea"
        />
        <p className="text-xs text-gray-400">
          建议 50-150 字，突出你的核心优势
        </p>
      </div>
    </motion.div>
  );
}
