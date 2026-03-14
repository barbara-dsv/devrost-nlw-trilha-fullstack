"use client";

import * as React from "react";

// Contexto para compartilhar estado entre subcomponentes
interface ToggleContextType {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleContext = React.createContext<ToggleContextType | undefined>(undefined);

// ToggleRoot - Container principal com estado controlado pelo pai
interface ToggleRootProps extends React.HTMLAttributes<HTMLDivElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleRoot = React.forwardRef<HTMLDivElement, ToggleRootProps>(
  ({ checked, onCheckedChange, disabled = false, children, ...props }, ref) => {
    const handleClick = () => {
      if (!disabled) {
        onCheckedChange(!checked);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!disabled && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onCheckedChange(!checked);
      }
    };

    return (
      <ToggleContext.Provider value={{ checked, onChange: onCheckedChange, disabled }}>
        <div
          ref={ref}
          role="switch"
          aria-checked={checked}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          className={`inline-flex items-center cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          {...props}
        >
          {children}
        </div>
      </ToggleContext.Provider>
    );
  }
);
ToggleRoot.displayName = "ToggleRoot";

// ToggleSwitch - Elemento visual do toggle
interface ToggleSwitchProps extends React.HTMLAttributes<HTMLDivElement> {}

const ToggleSwitch = React.forwardRef<HTMLDivElement, ToggleSwitchProps>(
  ({ ...props }, ref) => {
    const context = React.useContext(ToggleContext);
    if (!context) {
      throw new Error("ToggleSwitch must be used within ToggleRoot");
    }

    const { checked, disabled } = context;

    return (
      <div
        ref={ref}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 ease-in-out ${
          checked ? "bg-[#10b981]" : "bg-gray-300"
        } ${disabled ? "pointer-events-none" : ""}`}
        {...props}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
    );
  }
);
ToggleSwitch.displayName = "ToggleSwitch";

// ToggleText - Container para label e description
const ToggleText = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col ml-3 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ToggleText.displayName = "ToggleText";

// ToggleLabel - Texto do label (clicável)
const ToggleLabel = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ children, className, ...props }, ref) => {
    const context = React.useContext(ToggleContext);
    const disabled = context?.disabled;

    return (
      <span
        ref={ref}
        className={`text-sm font-medium text-foreground cursor-pointer ${disabled ? "cursor-not-allowed" : ""} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);
ToggleLabel.displayName = "ToggleLabel";

// ToggleDescription - Texto descritivo
const ToggleDescription = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`text-xs text-muted-foreground ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);
ToggleDescription.displayName = "ToggleDescription";

export const Toggle = {
  Root: ToggleRoot,
  Switch: ToggleSwitch,
  Text: ToggleText,
  Label: ToggleLabel,
  Description: ToggleDescription,
};
