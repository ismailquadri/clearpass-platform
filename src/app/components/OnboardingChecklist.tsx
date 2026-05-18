import { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  X,
  UserPlus,
  FileText,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { useToast } from './ToastProvider';

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  icon: typeof Building2;
  actionLabel: string;
  actionRoute: string;
  completed: boolean;
  toastMessage?: string;
}

interface OnboardingChecklistProps {
  onClose: () => void;
  onTaskClick: (route: string) => void;
}

const TASK_CONFIG = [
  {
    id: 'company-profile',
    title: 'Complete Company Profile',
    description: 'Add your company details, RC number, and contact information',
    icon: Building2,
    actionLabel: 'Go to Company Profile',
    actionRoute: 'company-profile',
    toastMessage: 'Opening Company Profile...',
  },
  {
    id: 'verify-bvn',
    title: 'Verify Your BVN',
    description: 'Verify your Bank Verification Number for enhanced security',
    icon: CreditCard,
    actionLabel: 'Verify BVN',
    actionRoute: 'settings',
    toastMessage: 'Opening BVN Verification in Settings...',
  },
  {
    id: 'upload-documents',
    title: 'Upload Required Documents',
    description: 'Upload CAC documents, tax certificates, and compliance proofs',
    icon: FileText,
    actionLabel: 'Upload Documents',
    actionRoute: 'company-profile',
    toastMessage: 'Opening Document Upload...',
  },
  {
    id: 'add-worker',
    title: 'Register Your First Worker',
    description: 'Add your first employee to begin tracking their compliance',
    icon: UserPlus,
    actionLabel: 'Add Worker',
    actionRoute: 'settings',
    toastMessage: 'Opening Team Management to add workers...',
  },
  {
    id: 'compliance-check',
    title: 'Complete First Compliance Check',
    description: 'Run your first compliance verification to see your status',
    icon: ShieldCheck,
    actionLabel: 'Run Check',
    actionRoute: 'certificates',
    toastMessage: 'Running Compliance Check...',
  },
];

export function OnboardingChecklist({ onClose, onTaskClick }: OnboardingChecklistProps) {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<OnboardingTask[]>(() => {
    try {
      const saved = localStorage.getItem('onboarding-tasks');
      if (saved) {
        const savedTasks = JSON.parse(saved);
        // Reconstruct tasks with proper icon functions and toastMessages
        return savedTasks.map((savedTask: any) => {
          const config = TASK_CONFIG.find((c) => c.id === savedTask.id);
          return {
            ...savedTask,
            icon: config?.icon || Building2,
            toastMessage: config?.toastMessage || 'Opening...',
          };
        });
      }
    } catch (e) {
      // Clear bad data if parsing fails
      console.error('Failed to load onboarding tasks, clearing cache:', e);
      localStorage.removeItem('onboarding-tasks');
    }
    // Return default tasks with completed: false
    return TASK_CONFIG.map((task) => ({ ...task, completed: false }));
  });

  useEffect(() => {
    // Save only serializable data (without icon functions)
    const serializableTasks = tasks.map(({ icon: _icon, ...task }) => task);
    localStorage.setItem('onboarding-tasks', JSON.stringify(serializableTasks));
  }, [tasks]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = (completedCount / tasks.length) * 100;
  const isAllComplete = completedCount === tasks.length;

  const handleTaskClick = (task: OnboardingTask) => {
    if (!task.completed) {
      // Show toast with action message
      showToast('info', task.actionLabel, task.toastMessage || 'Opening...');
      onTaskClick(task.actionRoute);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _markTaskComplete = (taskId: string) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t)));
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding-dismissed', 'true');
    onClose();
  };

  if (isAllComplete) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
            >
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Setup Complete!</h3>
              <p className="text-sm text-muted-foreground">You've completed all onboarding tasks</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255, 48, 0, 0.1)' }}
          >
            <CheckCircle2 className="w-6 h-6" style={{ color: '#FF3000' }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Get Started with ClearPass</h3>
            <p className="text-sm text-muted-foreground">
              Complete these steps to fully set up your account
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm text-muted-foreground">
            {completedCount} of {tasks.length} completed
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundColor: '#FF3000',
            }}
          />
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          return (
            <div
              key={task.id}
              onClick={() => handleTaskClick(task)}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                task.completed
                  ? 'border-green-200 bg-green-50/50 dark:bg-green-950/20 cursor-default'
                  : 'border-border hover:border-[#FF3000]/40 hover:bg-muted/50 cursor-pointer'
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: task.completed
                    ? 'rgba(34, 197, 94, 0.1)'
                    : 'rgba(255, 48, 0, 0.1)',
                }}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Icon className="w-5 h-5" style={{ color: '#FF3000' }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium mb-1">{task.title}</p>
                <p className="text-sm text-muted-foreground">{task.description}</p>
              </div>

              {!task.completed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskClick(task);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-md border border-[#FF3000] text-[#FF3000] hover:bg-[#fff5f3] transition-colors text-sm font-medium shrink-0"
                >
                  {task.actionLabel}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {task.completed && (
                <div className="flex items-center gap-2 text-sm text-green-600 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Skip Button */}
      <div className="mt-6 pt-4 border-t border-border">
        <button
          onClick={skipOnboarding}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip onboarding for now
        </button>
      </div>
    </div>
  );
}

export function useOnboardingChecklist() {
  const [showChecklist, setShowChecklist] = useState(() => {
    const dismissed = localStorage.getItem('onboarding-dismissed');
    return !dismissed;
  });

  const dismissChecklist = () => {
    localStorage.setItem('onboarding-dismissed', 'true');
    setShowChecklist(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding-dismissed');
    localStorage.removeItem('onboarding-tasks');
    setShowChecklist(true);
    // Force re-render of tasks by clearing localStorage
    // The OnboardingChecklist component will reset on next render
    window.location.reload();
  };

  return {
    showChecklist,
    dismissChecklist,
    resetOnboarding,
  };
}
