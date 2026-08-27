import { useRef, useState, useEffect } from "react";
import "./ProgressBar.css";

interface ProgressBarProps {
  value: number;
  max: number;
  onChange: (newValue: number) => void;
  formatValue?: (val: number) => string;
}

export const ProgressBar = ({ value, max, onChange, formatValue }: ProgressBarProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDragging) {
      setLocalValue(value);
    }
  }, [value, isDragging]);

  const calculateNewValue = (clientX: number) => {
    if (!progressRef.current || max === 0) return 0;
    const rect = progressRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return percentage * max;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setLocalValue(calculateNewValue(e.clientX));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setLocalValue(calculateNewValue(e.clientX));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    onChange(localValue);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    onChange(calculateNewValue(e.clientX));
  };

  const displayValue = isDragging ? localValue : value;
  const progressPercent = max > 0 ? (displayValue / max) * 100 : 0;

  return (
    <div className="progress-bar-wrapper">
      <div
        className="progress-bar-container"
        ref={progressRef}
        onClick={handleProgressClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
          <div
            className="progress-bar-handle"
            style={{ left: `${progressPercent}%` }}
          />
        </div>
      </div>

      {formatValue && (
        <div className="progress-bar-labels">
          <span>{formatValue(displayValue)}</span>
          <span>{formatValue(max)}</span>
        </div>
      )}
    </div>
  );
};
