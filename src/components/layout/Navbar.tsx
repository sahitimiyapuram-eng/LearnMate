import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  Bell,
  Sparkles,
  ChevronDown,
  User,
  Settings,
  GraduationCap,
  Sun,
  Moon,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { StudentProfile } from '../../types';
import { Logo } from '../common/Logo';

interface NavbarProps {
  student: StudentProfile;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onNavigate: (view: string) => void;
  onOpenDemoScript: () => void;
  onOpenProModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  student,
  darkMode,
  setDarkMode,
  onNavigate,
  onOpenDemoScript,
  onOpenProModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const notifications = [
    {
      id: 'n-1',
      title: 'AI Recommendation Ready',
      desc: 'Based on your 58% Calculus score, a 25m practice session was scheduled.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 'n-2',
      title: '7-Day Streak Active! 🔥',
      desc: 'You studied 4h 35m this week. Keep up the momentum!',
      time: '2h ago',
      unread: false,
    },
    {
      id: 'n-3',
      title: 'Quiz Diagnostics Analyzed',
      desc: 'You mastered 2 Quadratic Equations topics today.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 text-left focus:outline-none group"
            >
              <Logo size="md" showTagline={true} />
              <span className="hidden xl:inline-block text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 ml-1">
                Student
              </span>
            </button>
          </div>

          {/* Center / Right: Student Stats & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Install App Button if browser supports PWA prompt */}
            {deferredPrompt && (
              <button
                onClick={handleInstallApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                title="Install LearnMate AI on this device"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
                <span className="sm:hidden">Install</span>
              </button>
            )}

            {/* Quick Demo Script Button (for teachers / evaluators) */}
            <button
              onClick={onOpenDemoScript}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
              title="View 3-5 Minute Presentation Flow"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Demo Script (3-5 min)</span>
              <span className="md:hidden">Demo</span>
            </button>

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold"
              title="Current Daily Study Streak"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{student.streakDays}d Streak</span>
            </div>

            {/* Weekly Study Time */}
            <div
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold"
              title="Study Time Completed This Week"
            >
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{student.weeklyStudyHours}</span>
            </div>

            {/* Pro Tier Button */}
            <button
              onClick={onOpenProModal}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Free Plan</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      Mark all as read
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left ${
                          n.unread ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none border border-slate-200 dark:border-slate-700"
              >
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline">
                  {student.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{student.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {student.level} • {student.age} yrs
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Student Profile
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-left text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Preferences & Settings
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('landing');
                        setShowProfileMenu(false);
                      }}
                      className="w-full px-4 py-2 text-xs text-left text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Product Landing Page
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
