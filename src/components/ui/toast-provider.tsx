"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  type: ToastType;
};

type ToastContextValue = {
  addToast: (toast: Omit<ToastItem, "id">) => void;
  dismissToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function getToastStyles(type: ToastType) {
  switch (type) {
    case "success":
      return "border-emerald-600 bg-emerald-600/90 text-white";
    case "error":
      return "border-red-600 bg-red-600/90 text-white";
    default:
      return "border-primary bg-slate-900 text-white dark:bg-slate-800";
  }
}

function getToastIcon(type: ToastType) {
  switch (type) {
    case "success":
      return <CheckCircle2 className="size-4" />;
    case "error":
      return <AlertCircle className="size-4" />;
    default:
      return <Info className="size-4" />;
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { ...toast, id }]);
    window.setTimeout(() => dismissToast(id), 4000);
  }, [dismissToast]);

  const value = useMemo(() => ({ addToast, dismissToast }), [addToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100%-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border p-3 shadow-lg backdrop-blur ${getToastStyles(toast.type)}`}
          >
            <div className="flex items-start gap-2">
              <div className="mt-0.5">{getToastIcon(toast.type)}</div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[11px] tracking-[0.2em] uppercase">{toast.title}</div>
                {toast.description ? <p className="mt-1 text-sm leading-5">{toast.description}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="rounded-md p-1 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
                aria-label="Dismiss toast"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
