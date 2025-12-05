'use client';

import { useResumeStore } from '@/store/resumeStore';
import { ResumeSection } from '@/types/resume';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye, EyeOff } from 'lucide-react';

const sectionLabels: Record<string, string> = {
  experience: '工作经历',
  education: '教育背景',
  skills: '专业技能',
  projects: '项目经验',
};

export function SectionSorter() {
  const sections = useResumeStore((state) => state.resume?.sections || []);
  const reorderSections = useResumeStore((state) => state.reorderSections);
  const updateSection = useResumeStore((state) => state.updateSection);

  const sortableSections = sections
    .filter((s) => s.type !== 'personal')
    .sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sortableSections.findIndex((s) => s.id === active.id);
      const newIndex = sortableSections.findIndex((s) => s.id === over.id);
      const newSortable = arrayMove(sortableSections, oldIndex, newIndex);
      const personalSection = sections.find((s) => s.type === 'personal');
      const allSections = personalSection
        ? [{ ...personalSection, order: 0 }, ...newSortable.map((s, i) => ({ ...s, order: i + 1 }))]
        : newSortable.map((s, i) => ({ ...s, order: i }));
      reorderSections(allSections);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">模块排序</h3>
        <span className="text-xs text-gray-400">拖拽调整顺序</span>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sortableSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sortableSections.map((section) => (
              <SortableItem
                key={section.id}
                section={section}
                onToggle={() => updateSection(section.id, { visible: !section.visible })}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableItem({ section, onToggle }: { section: ResumeSection; onToggle: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 ${isDragging ? 'shadow-lg ring-2 ring-blue-500 z-50' : ''} ${!section.visible ? 'opacity-50' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <span className="flex-1 text-sm font-medium">{sectionLabels[section.type] || section.title}</span>
      <button
        onClick={onToggle}
        className={`p-1.5 rounded-lg transition-colors ${section.visible ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
      >
        {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </button>
    </div>
  );
}