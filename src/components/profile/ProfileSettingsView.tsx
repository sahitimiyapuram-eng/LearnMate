import React, { useState } from 'react';
import {
  User,
  Settings,
  Moon,
  Sun,
  Bell,
  Sliders,
  Shield,
  Building2,
  Milestone,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lock,
  GraduationCap
} from 'lucide-react';
import { StudentProfile, DifficultyLevel } from '../../types';
import { STARTUP_ORGANIZATION } from '../../data/sampleData';

interface ProfileSettingsViewProps {
  student: StudentProfile;
  onUpdateStudent: (updated: Partial<StudentProfile>) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onResetDemoData: () => void;
  onOpenProModal: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  student,
  onUpdateStudent,
  darkMode,
  setDarkMode,
  onResetDemoData,
  onOpenProModal,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'organization' | 'future'>('profile');

  const [name, setName] = useState(student.name);
  const [age, setAge] = useState(student.age);
  const [level, setLevel] = useState(student.level);
  const [goal, setGoal] = useState(student.goal);

  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('17:00');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent({ name, age, level, goal });
    setSavedNotice('Profile changes updated successfully!');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 text-left">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Student Profile & Platform Settings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Manage learning preferences, study notifications, and view startup roadmap.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenProModal}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>LearnMate Pro Tier</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">{savedNotice}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Student Profile
        </button>
        <button
          onClick={() => setActiveTab('preferences')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'preferences'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Study Preferences & Theme
        </button>
        <button
          onClick={() => setActiveTab('organization')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'organization'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Startup Organization & 12M Roadmap
        </button>
        <button
          onClick={() => setActiveTab('future')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'future'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Coming Soon Pipeline
        </button>
      </div>

      {/* TAB 1: STUDENT PROFILE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/40"
            />
            <div>
              <p className="font-bold text-base text-slate-900 dark:text-white">{student.name}</p>
              <p className="text-xs text-slate-500">{student.level} • {student.age} years old</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
                Active Learner Profile
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Education Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="High School">High School (Grade 10–12)</option>
                <option value="Undergraduate">Undergraduate / College</option>
                <option value="Competitive Exam">Competitive Exam Preparation</option>
                <option value="Graduate">Graduate</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Enrolled Subjects
              </label>
              <input
                type="text"
                readOnly
                value={student.subjects.join(', ')}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Core Academic Learning Goal
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: PREFERENCES & THEME */}
      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 text-xs">
          {/* Appearance */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Appearance & Theme</h3>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDarkMode(false)}
                className={`p-3 rounded-xl border flex items-center gap-2 font-bold ${
                  !darkMode
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setDarkMode(true)}
                className={`p-3 rounded-xl border flex items-center gap-2 font-bold ${
                  darkMode
                    ? 'bg-indigo-950 border-indigo-500 text-indigo-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Study Reminders */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Study Reminders & Habits</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dailyReminder}
                  onChange={(e) => setDailyReminder(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Enable daily streak notification
                </span>
              </label>

              <div>
                <label className="block text-slate-500 mb-1 font-medium">Daily Alert Time</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-rose-600 mb-1">Classroom Reset</h3>
            <p className="text-slate-500 mb-3">
              Restore Aarav Sharma's sample data to fresh initial state for a new presentation.
            </p>
            <button
              type="button"
              onClick={onResetDemoData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-bold hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: STARTUP ORGANIZATION & ROADMAP (Section 42 & 45) */}
      {activeTab === 'organization' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6 text-xs">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                LearnMate AI Startup Organizational Structure
              </h3>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Designed according to Section 42 specifications for modern EdTech scaling.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
            <p className="font-bold text-indigo-950 dark:text-indigo-200 text-sm">
              Founder / Product Lead
            </p>
            <p className="text-indigo-700 dark:text-indigo-300 text-[11px] mt-0.5">
              Sets product vision, capital allocation, cybersecurity standards, and core strategic bets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {STARTUP_ORGANIZATION.structure.teams.map((t, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{t.name}</span>
                  <span className="font-semibold text-slate-500">{t.count} headcount</span>
                </div>
                <p className="text-slate-500 text-[11px] mt-1">{t.role}</p>
              </div>
            ))}
          </div>

          {/* 12-Month Roadmap (Section 45) */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Milestone className="w-4 h-4 text-teal-600" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                12-Month Product Roadmap
              </h4>
            </div>

            <div className="space-y-3">
              {STARTUP_ORGANIZATION.roadmap.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <span className="text-indigo-600 dark:text-indigo-400">{m.month}: {m.title}</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                    {m.items.map((it, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMING SOON PIPELINE (Section 44) */}
      {activeTab === 'future' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Future Features & Platform Extensions (Section 44)
            </h3>
            <p className="text-slate-500 mt-0.5">
              Upcoming enterprise and collaborative capabilities in active research and prototyping.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STARTUP_ORGANIZATION.futureFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">{feat.title}</span>
                  <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 text-[10px] font-semibold">
                    In Design
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
