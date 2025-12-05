# 在线简历编辑器 - 实现文档

## 项目概述

一个可部署在 Vercel 的现代化在线简历编辑器，支持实时预览、自定义主题、深色模式、PDF 导出和本地持久化存储。

## 技术栈

| 类别 | 技术选型 | 说明 |
|------|----------|------|
| 框架 | Next.js 14 (App Router) | Vercel 原生支持，SSR/SSG |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS | 原子化 CSS，主题定制方便 |
| 状态管理 | Zustand | 轻量级，支持持久化 |
| 动画 | Framer Motion | 流畅的动画效果 |
| PDF 导出 | react-pdf + html2canvas | 高质量 PDF 生成 |
| 存储 | IndexedDB (idb) | 浏览器本地持久化存储 |
| 图标 | Lucide React | 现代图标库 |

## 核心功能模块

### 1. 简历数据结构

```typescript
interface Resume {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  theme: ThemeConfig;
  sections: ResumeSection[];
}

interface ResumeSection {
  id: string;
  type: 'personal' | 'education' | 'experience' | 'skills' | 'projects' | 'custom';
  title: string;
  visible: boolean;
  order: number;
  content: SectionContent;
}

interface ThemeConfig {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large';
  layout: 'single' | 'double';
  darkMode: boolean;
}
```

### 2. 模块划分

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页/简历列表
│   ├── editor/[id]/       # 编辑器页面
│   └── layout.tsx         # 全局布局
├── components/
│   ├── editor/            # 编辑器组件
│   │   ├── EditorPanel.tsx
│   │   ├── SectionEditor.tsx
│   │   └── DragDropList.tsx
│   ├── preview/           # 预览组件
│   │   ├── ResumePreview.tsx
│   │   └── SectionRenderer.tsx
│   ├── theme/             # 主题组件
│   │   ├── ThemeSelector.tsx
│   │   ├── ColorPicker.tsx
│   │   └── ThemeProvider.tsx
│   └── ui/                # 通用 UI 组件
├── hooks/
│   ├── useResume.ts       # 简历数据 hook
│   ├── useAutoSave.ts     # 自动保存 hook
│   └── useTheme.ts        # 主题 hook
├── store/
│   ├── resumeStore.ts     # 简历状态管理
│   └── themeStore.ts      # 主题状态管理
├── lib/
│   ├── db.ts              # IndexedDB 操作
│   ├── pdf.ts             # PDF 导出逻辑
│   └── themes.ts          # 预设主题
└── types/
    └── resume.ts          # 类型定义
```

## 功能实现方案

### 1. 实时预览

- 使用 React 状态驱动，编辑器修改立即反映到预览区
- 左右分栏布局：左侧编辑器，右侧实时预览
- 使用 `useDeferredValue` 优化大量输入时的性能

```typescript
// 实时预览核心逻辑
const EditorPage = () => {
  const resume = useResumeStore(state => state.resume);
  const deferredResume = useDeferredValue(resume);
  
  return (
    <div className="flex">
      <EditorPanel resume={resume} />
      <ResumePreview resume={deferredResume} />
    </div>
  );
};
```

### 2. 自定义主题

预设主题 + 自定义配置：

```typescript
const presetThemes: ThemeConfig[] = [
  { id: 'classic', name: '经典', primaryColor: '#1a1a1a', ... },
  { id: 'modern', name: '现代', primaryColor: '#3b82f6', ... },
  { id: 'creative', name: '创意', primaryColor: '#8b5cf6', ... },
  { id: 'minimal', name: '简约', primaryColor: '#64748b', ... },
];
```

支持自定义：
- 主色调 / 辅助色
- 字体系列
- 字号大小
- 单栏 / 双栏布局

### 3. 深色模式

- 使用 `next-themes` 管理系统级深色模式
- 简历预览独立控制（打印时始终浅色）
- CSS 变量实现主题切换

```typescript
// Tailwind 配置
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
      }
    }
  }
};
```

### 4. 流畅动画

使用 Framer Motion 实现：

```typescript
// 区块拖拽动画
<Reorder.Group values={sections} onReorder={setSections}>
  {sections.map(section => (
    <Reorder.Item
      key={section.id}
      value={section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileDrag={{ scale: 1.02, boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }}
    >
      <SectionEditor section={section} />
    </Reorder.Item>
  ))}
</Reorder.Group>
```

动画场景：
- 页面切换过渡
- 区块拖拽排序
- 主题切换渐变
- 按钮悬停/点击反馈
- 侧边栏展开/收起

### 5. PDF 导出

两种方案结合：

```typescript
// 方案 A: html2canvas + jsPDF（推荐）
export async function exportToPDF(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  });
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgData = canvas.toDataURL('image/png');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(filename);
}
```

### 6. 自动保存

防抖 + IndexedDB：

```typescript
// useAutoSave hook
export function useAutoSave(resume: Resume, delay = 1000) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        await saveResume(resume);
        setSaveStatus('saved');
      } catch {
        setSaveStatus('error');
      }
    }, delay);
    
    return () => clearTimeout(timer);
  }, [resume, delay]);
  
  return saveStatus;
}
```

### 7. 本地持久化存储

使用 IndexedDB 实现硬盘级存储：

```typescript
// lib/db.ts
import { openDB, DBSchema } from 'idb';

interface ResumeDB extends DBSchema {
  resumes: {
    key: string;
    value: Resume;
    indexes: { 'by-date': Date };
  };
}

const dbPromise = openDB<ResumeDB>('resume-editor', 1, {
  upgrade(db) {
    const store = db.createObjectStore('resumes', { keyPath: 'id' });
    store.createIndex('by-date', 'updatedAt');
  },
});

export async function saveResume(resume: Resume) {
  const db = await dbPromise;
  await db.put('resumes', { ...resume, updatedAt: new Date() });
}

export async function getResume(id: string) {
  const db = await dbPromise;
  return db.get('resumes', id);
}

export async function getAllResumes() {
  const db = await dbPromise;
  return db.getAllFromIndex('resumes', 'by-date');
}
```

## 页面路由

| 路由 | 说明 |
|------|------|
| `/` | 首页，简历列表，创建新简历 |
| `/editor/[id]` | 简历编辑器 |
| `/preview/[id]` | 全屏预览（可选） |

## UI 设计要点

1. **响应式布局**：移动端切换为上下布局
2. **快捷键支持**：Ctrl+S 保存，Ctrl+P 导出 PDF
3. **拖拽排序**：简历区块可拖拽调整顺序
4. **撤销/重做**：支持操作历史
5. **模板选择**：提供多套预设模板

## 部署配置

```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next"
}
```

## 依赖清单

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.0",
    "framer-motion": "^10.16.0",
    "idb": "^7.1.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.1",
    "next-themes": "^0.2.1",
    "lucide-react": "^0.294.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## 开发计划

### Phase 1: 基础框架 (Day 1-2)
- [x] 项目初始化
- [ ] 基础布局搭建
- [ ] 类型定义
- [ ] IndexedDB 存储层

### Phase 2: 核心功能 (Day 3-5)
- [ ] 编辑器组件
- [ ] 实时预览
- [ ] 自动保存

### Phase 3: 主题系统 (Day 6-7)
- [ ] 主题配置
- [ ] 深色模式
- [ ] 预设主题

### Phase 4: 高级功能 (Day 8-10)
- [ ] PDF 导出
- [ ] 拖拽排序
- [ ] 动画效果
- [ ] 响应式适配

### Phase 5: 优化部署 (Day 11-12)
- [ ] 性能优化
- [ ] Vercel 部署
- [ ] 测试修复
