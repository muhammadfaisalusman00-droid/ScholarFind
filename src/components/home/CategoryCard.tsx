import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Award, Sparkles, Code, Cpu, Briefcase, Activity, Palette, Globe, Scale, TrendingUp, ArrowRight } from 'lucide-react';

export interface CategoryItem {
  id: string;
  label: string;
  count: string;
  description?: string;
  degree?: string;
  field?: string;
  funding?: string;
  icon: string;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  GraduationCap,
  BookOpen,
  Award,
  Sparkles,
  Code,
  Cpu,
  Briefcase,
  Activity,
  Palette,
  Globe,
  Scale,
  TrendingUp
};

interface CategoryCardProps {
  category: CategoryItem;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();
  const IconComponent = ICON_MAP[category.icon] || GraduationCap;

  const handleClick = () => {
    const params = new URLSearchParams();
    if (category.degree) params.append('degree', category.degree);
    if (category.field) params.append('field', category.field);
    if (category.funding) params.append('funding', category.funding);

    navigate(`/scholarships?${params.toString()}`);
  };

  // Color variants for icons based on category
  const getColorClasses = (id: string) => {
    if (id === 'undergraduate') return 'bg-sky-100 text-sky-800 border-sky-200 group-hover:bg-sky-600 group-hover:text-white';
    if (id === 'postgraduate') return 'bg-blue-100 text-blue-800 border-blue-200 group-hover:bg-blue-600 group-hover:text-white';
    if (id === 'masters') return 'bg-indigo-100 text-indigo-800 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white';
    if (id === 'phd') return 'bg-purple-100 text-purple-800 border-purple-200 group-hover:bg-purple-600 group-hover:text-white';
    if (id === 'fully-funded') return 'bg-amber-100 text-amber-800 border-amber-200 group-hover:bg-amber-600 group-hover:text-white';
    if (id === 'cs') return 'bg-blue-100 text-blue-800 border-blue-200 group-hover:bg-blue-600 group-hover:text-white';
    if (id === 'engineering') return 'bg-teal-100 text-teal-800 border-teal-200 group-hover:bg-teal-600 group-hover:text-white';
    if (id === 'business') return 'bg-emerald-100 text-emerald-800 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white';
    return 'bg-rose-100 text-rose-800 border-rose-200 group-hover:bg-rose-600 group-hover:text-white';
  };

  const colorStyles = getColorClasses(category.id);

  return (
    <button
      onClick={handleClick}
      className="group text-left bg-white hover:bg-slate-50/80 rounded-2xl p-5 border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer focus:outline-none"
      id={`category-card-${category.id}`}
    >
      <div>
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all mb-3.5 shadow-2xs ${colorStyles}`}>
          <IconComponent className="w-5 h-5 stroke-[2.2]" />
        </div>
        <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
          {category.label}
        </h3>
        {category.description && (
          <p className="text-xs text-slate-600 mt-1 leading-relaxed font-normal">
            {category.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-blue-700 transition-colors">
        <span>{category.count}</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};
