import { Resume, ResumeSection } from '@/types/resume';
import { defaultTheme } from './themes';
import { nanoid } from 'nanoid';

export const defaultSections: ResumeSection[] = [
  { id: 'sec-personal', type: 'personal', title: '个人信息', visible: true, order: 0 },
  { id: 'sec-experience', type: 'experience', title: '工作经历', visible: true, order: 1 },
  { id: 'sec-education', type: 'education', title: '教育背景', visible: true, order: 2 },
  { id: 'sec-skills', type: 'skills', title: '专业技能', visible: true, order: 3 },
  { id: 'sec-projects', type: 'projects', title: '项目经验', visible: true, order: 4 },
];

export function createDefaultResume(name: string = '我的简历'): Resume {
  const now = new Date().toISOString();
  return {
    id: nanoid(),
    name,
    createdAt: now,
    updatedAt: now,
    theme: { ...defaultTheme },
    sections: defaultSections.map((s, i) => ({ ...s, id: nanoid(), order: i })),
    personal: {
      name: '张三',
      title: '高级前端工程师',
      email: 'zhangsan@example.com',
      phone: '138-0000-0000',
      location: '北京市朝阳区',
      website: 'https://zhangsan.dev',
      summary: '8年前端开发经验，精通 React、Vue、TypeScript 等主流技术栈。曾主导多个大型项目的前端架构设计，具备良好的团队协作能力和项目管理经验。热爱技术，持续学习，追求代码质量和用户体验的极致。',
    },
    education: [
      {
        id: nanoid(),
        school: '北京大学',
        degree: '本科',
        field: '计算机科学与技术',
        startDate: '2012-09',
        endDate: '2016-06',
        description: 'GPA 3.8/4.0，获得优秀毕业生称号',
      },
    ],
    experience: [
      {
        id: nanoid(),
        company: '字节跳动',
        position: '高级前端工程师',
        startDate: '2021-03',
        endDate: '',
        current: true,
        description: '• 负责抖音创作者平台的前端架构设计和核心功能开发\n• 主导前端性能优化，首屏加载时间降低 40%\n• 搭建组件库和工程化体系，提升团队开发效率 30%\n• 指导初级工程师，进行代码审查和技术分享',
        highlights: [],
      },
      {
        id: nanoid(),
        company: '阿里巴巴',
        position: '前端工程师',
        startDate: '2018-07',
        endDate: '2021-02',
        current: false,
        description: '• 参与淘宝商家后台的开发和维护\n• 使用 React + TypeScript 重构老旧系统\n• 开发可视化搭建平台，支持运营人员自主配置页面\n• 优化 Webpack 构建配置，构建时间减少 50%',
        highlights: [],
      },
      {
        id: nanoid(),
        company: '美团',
        position: '前端开发工程师',
        startDate: '2016-07',
        endDate: '2018-06',
        current: false,
        description: '• 负责美团外卖商家端 H5 页面开发\n• 使用 Vue.js 开发移动端 SPA 应用\n• 参与前端基础设施建设，编写公共组件和工具函数',
        highlights: [],
      },
    ],
    skills: [
      { id: nanoid(), name: 'JavaScript', level: 5 },
      { id: nanoid(), name: 'TypeScript', level: 5 },
      { id: nanoid(), name: 'React', level: 5 },
      { id: nanoid(), name: 'Vue', level: 4 },
      { id: nanoid(), name: 'Node.js', level: 4 },
      { id: nanoid(), name: 'Webpack', level: 4 },
      { id: nanoid(), name: 'Git', level: 4 },
      { id: nanoid(), name: 'CSS/Sass', level: 4 },
    ],
    projects: [
      {
        id: nanoid(),
        name: '创作者数据平台',
        description: '• 为抖音创作者提供数据分析和内容管理的一站式平台\n• 技术栈：React 18 + TypeScript + Ant Design + ECharts\n• 实现复杂数据可视化图表，支持多维度数据分析\n• 日活用户 50 万+，页面性能评分 95+',
        url: '',
        highlights: [],
      },
      {
        id: nanoid(),
        name: '低代码搭建平台',
        description: '• 可视化页面搭建工具，支持拖拽生成营销活动页面\n• 技术栈：Vue 3 + Vite + Pinia + Monaco Editor\n• 设计插件化架构，支持自定义组件扩展\n• 累计搭建页面 1000+，节省开发人力 80%',
        url: '',
        highlights: [],
      },
    ],
    customSections: [],
  };
}

// 创建空白简历
export function createEmptyResume(name: string = '我的简历'): Resume {
  const now = new Date().toISOString();
  return {
    id: nanoid(),
    name,
    createdAt: now,
    updatedAt: now,
    theme: { ...defaultTheme },
    sections: defaultSections.map((s, i) => ({ ...s, id: nanoid(), order: i })),
    personal: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      summary: '',
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    customSections: [],
  };
}
