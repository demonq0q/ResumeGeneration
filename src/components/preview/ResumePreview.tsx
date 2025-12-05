'use client';

import { forwardRef, useDeferredValue } from 'react';
import { Resume } from '@/types/resume';
import { motion } from 'framer-motion';


interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resume }, ref) => {
    const deferredResume = useDeferredValue(resume);
    const { theme, personal, sections, experience, education, skills, projects } = deferredResume;

    const visibleSections = sections
      .filter((s) => s.visible)
      .sort((a, b) => a.order - b.order);

    // 紧凑字号
    const fontSizeMap = {
      small: { base: '11px', title: '20px', section: '13px', small: '10px' },
      medium: { base: '12px', title: '22px', section: '14px', small: '11px' },
      large: { base: '13px', title: '24px', section: '15px', small: '12px' },
    };
    const fontSize = fontSizeMap[theme.fontSize];
    const fontFamilyClass = theme.fontFamily === 'serif' ? 'font-serif' : 'font-sans';

    const renderSection = (type: string) => {
      switch (type) {
        case 'personal':
          return <PersonalSection personal={personal} theme={theme} fontSize={fontSize} />;
        case 'experience':
          return experience.length > 0 ? (
            <ExperienceSection experience={experience} theme={theme} fontSize={fontSize} />
          ) : null;
        case 'education':
          return education.length > 0 ? (
            <EducationSection education={education} theme={theme} fontSize={fontSize} />
          ) : null;
        case 'skills':
          return skills.length > 0 ? (
            <SkillsSection skills={skills} theme={theme} fontSize={fontSize} />
          ) : null;
        case 'projects':
          return projects.length > 0 ? (
            <ProjectsSection projects={projects} theme={theme} fontSize={fontSize} />
          ) : null;
        default:
          return null;
      }
    };

    return (
      <motion.div
        ref={ref}
        className={`w-[210mm] mx-auto bg-white shadow-xl ${fontFamilyClass}`}
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontSize: fontSize.base,
          lineHeight: 1.4,
          minHeight: 'auto',
          overflow: 'visible',
          // 优化文字渲染
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme.layout === 'double' ? (
          <div className="p-6">
            {/* Header - Personal Info spans full width */}
            {visibleSections.find((s) => s.type === 'personal') && (
              <div className="mb-4">{renderSection('personal')}</div>
            )}
            
            {/* Two Column Layout */}
            <div className="flex gap-5">
              {/* Left Column - 35% */}
              <div 
                className="space-y-4 pr-4" 
                style={{ 
                  width: '35%', 
                  borderRight: `1px solid ${theme.primaryColor}20`,
                }}
              >
                {visibleSections
                  .filter((s) => ['skills', 'education'].includes(s.type))
                  .map((section) => (
                    <div key={section.id}>{renderSection(section.type)}</div>
                  ))}
              </div>
              
              {/* Right Column - 65% */}
              <div className="space-y-4 pl-1" style={{ width: '65%' }}>
                {visibleSections
                  .filter((s) => ['experience', 'projects'].includes(s.type))
                  .map((section) => (
                    <div key={section.id}>{renderSection(section.type)}</div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-3">
            {visibleSections.map((section) => (
              <div key={section.id}>{renderSection(section.type)}</div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';

type FontSize = { base: string; title: string; section: string; small: string };

// Personal Section - 紧凑版
function PersonalSection({ personal, theme, fontSize }: { personal: Resume['personal']; theme: Resume['theme']; fontSize: FontSize }) {
  if (!personal.name && !personal.title) return null;

  const contacts = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
  ].filter(Boolean);

  return (
    <div className="pb-3 border-b" style={{ borderColor: theme.primaryColor + '30' }}>
      <div className={`flex items-start gap-4 ${personal.avatar ? '' : 'justify-center'}`}>
        {/* Avatar */}
        {personal.avatar && (
          <div className="flex-shrink-0">
            <img
              src={personal.avatar}
              alt={personal.name}
              className="w-20 h-20 rounded-full object-cover border-2"
              style={{ borderColor: theme.primaryColor }}
            />
          </div>
        )}
        
        {/* Info */}
        <div className={`flex-1 ${personal.avatar ? 'text-left' : 'text-center'}`}>
          <h1
            className="font-bold mb-0.5"
            style={{ color: theme.primaryColor, fontSize: fontSize.title }}
          >
            {personal.name || '您的姓名'}
          </h1>
          {personal.title && (
            <p className="mb-2" style={{ color: theme.secondaryColor, fontSize: fontSize.section }}>
              {personal.title}
            </p>
          )}
          {contacts.length > 0 && (
            <p 
              style={{ 
                fontSize: fontSize.small,
                textAlign: personal.avatar ? 'left' : 'center',
                margin: 0,
              }}
            >
              {contacts.map((value, i) => (
                <span key={i}>
                  {value}
                  {i < contacts.length - 1 && (
                    <span style={{ color: theme.secondaryColor, margin: '0 8px' }}>|</span>
                  )}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
      
      {personal.summary && (
        <p className="mt-2 text-left leading-snug" style={{ fontSize: fontSize.small }}>
          {personal.summary}
        </p>
      )}
    </div>
  );
}

// Experience Section - 紧凑版（公司在上，职位在旁）
function ExperienceSection({ experience, theme, fontSize }: { experience: Resume['experience']; theme: Resume['theme']; fontSize: FontSize }) {
  return (
    <div>
      <SectionTitle title="工作经历" theme={theme} fontSize={fontSize} />
      <div className="space-y-2">
        {experience.map((exp) => (
          <div key={exp.id}>
            <div className="flex justify-between items-baseline">
              <div>
                <span className="font-semibold" style={{ color: theme.primaryColor }}>
                  {exp.company}
                </span>
                {exp.position && (
                  <span style={{ color: theme.secondaryColor, marginLeft: '8px' }}>
                    {exp.position}
                  </span>
                )}
              </div>
              <span style={{ color: theme.secondaryColor, fontSize: fontSize.small, flexShrink: 0 }}>
                {exp.startDate} - {exp.current ? '至今' : exp.endDate}
              </span>
            </div>
            {exp.description && (
              <p className="mt-1 whitespace-pre-line leading-snug" style={{ fontSize: fontSize.small }}>
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Education Section - 紧凑版
function EducationSection({ education, theme, fontSize }: { education: Resume['education']; theme: Resume['theme']; fontSize: FontSize }) {
  return (
    <div>
      <SectionTitle title="教育背景" theme={theme} fontSize={fontSize} />
      <div className="space-y-1.5">
        {education.map((edu) => (
          <div key={edu.id}>
            <div className="flex justify-between items-baseline">
              <span className="font-semibold" style={{ color: theme.primaryColor }}>
                {edu.school}
              </span>
              <span style={{ color: theme.secondaryColor, fontSize: fontSize.small }}>
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
            <p style={{ color: theme.secondaryColor, fontSize: fontSize.small }}>
              {edu.degree} {edu.field && `· ${edu.field}`}
            </p>
            {edu.description && (
              <p className="leading-snug" style={{ fontSize: fontSize.small }}>{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Skills Section - 紧凑版（无方框）
function SkillsSection({ skills, theme, fontSize }: { skills: Resume['skills']; theme: Resume['theme']; fontSize: FontSize }) {
  return (
    <div>
      <SectionTitle title="专业技能" theme={theme} fontSize={fontSize} />
      <p style={{ fontSize: fontSize.small, color: theme.textColor }}>
        {skills.map((skill, index) => (
          <span key={skill.id}>
            {skill.name}
            {index < skills.length - 1 && <span style={{ color: theme.secondaryColor }}> · </span>}
          </span>
        ))}
      </p>
    </div>
  );
}

// Projects Section - 紧凑版
function ProjectsSection({ projects, theme, fontSize }: { projects: Resume['projects']; theme: Resume['theme']; fontSize: FontSize }) {
  return (
    <div>
      <SectionTitle title="项目经验" theme={theme} fontSize={fontSize} />
      <div className="space-y-2">
        {projects.map((project) => (
          <div key={project.id}>
            <div className="flex justify-between items-baseline">
              <span className="font-semibold" style={{ color: theme.primaryColor }}>
                {project.name}
              </span>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: theme.secondaryColor, fontSize: fontSize.small }}
                >
                  链接
                </a>
              )}
            </div>
            {project.description && (
              <p className="mt-0.5 whitespace-pre-line leading-snug" style={{ fontSize: fontSize.small }}>
                {project.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Section Title - 紧凑版
function SectionTitle({ title, theme, fontSize }: { title: string; theme: Resume['theme']; fontSize: FontSize }) {
  return (
    <h2
      className="font-semibold mb-1.5 pb-1 border-b"
      style={{
        color: theme.primaryColor,
        borderColor: theme.primaryColor + '30',
        fontSize: fontSize.section,
      }}
    >
      {title}
    </h2>
  );
}
