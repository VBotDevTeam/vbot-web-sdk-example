import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

interface TourStep {
  targetId: string;
  icon: string;
  title: string;
  description: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'guide-settings-btn',
    icon: 'solar:settings-bold',
    title: 'Cấu hình VBot SDK',
    description: 'Nhập VBot Access Token của bạn tại đây và chọn chế độ hiển thị (UI mặc định hoặc Chế độ ẩn để tự thiết kế giao diện).',
    placement: 'bottom'
  },
  {
    targetId: 'guide-dialer-btn',
    icon: 'solar:phone-calling-bold',
    title: 'Nút quay số Header',
    description: 'Bấm nút này để kích hoạt bàn phím số (Dialpad).',
    placement: 'bottom'
  },
  {
    targetId: 'guide-add-person-btn',
    icon: 'solar:user-plus-bold',
    title: 'Thêm số điện thoại thật',
    description: 'Thêm mới khách hàng với số điện thoại thật của bạn để trải nghiệm tính năng gọi điện Click-to-Call',
    placement: 'bottom'
  },
  {
    targetId: 'guide-click-to-call',
    icon: 'solar:phone-bold',
    title: 'Gọi nhanh (Click-to-Call)',
    description: 'Nhấn vào biểu tượng điện thoại màu xanh này để thực hiện nhanh cuộc gọi.',
    placement: 'right'
  },
  {
    targetId: 'guide-fab-dialer',
    icon: 'solar:keypad-bold',
    title: 'Phím quay số nổi',
    description: 'Nhấn nút nổi (FAB) ở đây để mở bàn phím số nhanh.',
    placement: 'top'
  }
];

interface OnboardingTourProps {
  isActive: boolean;
  onClose: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ isActive, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const resizeTimerRef = useRef<any>(null);

  const step = TOUR_STEPS[currentStep];

  // Update target element coordinate rectangles
  const updateCoords = () => {
    if (!isActive || !step) {
      setCoords(null);
      return;
    }

    const el = document.getElementById(step.targetId);
    if (el) {
      const rect = el.getBoundingClientRect();
      setCoords({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
      // Scroll target into view if it's not fully visible
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      // If element is not rendered or found, skip to next
      setCoords(null);
    }
  };

  useEffect(() => {
    updateCoords();
    // Wait a brief moment to let state/UI settle and recalculate
    const timer = setTimeout(updateCoords, 100);
    return () => clearTimeout(timer);
  }, [currentStep, isActive]);

  // Keep track of window resize/scroll to reposition
  useEffect(() => {
    const handleUpdate = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(updateCoords, 50);
    };

    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
    };
  }, [currentStep, isActive]);

  if (!isActive || !coords || !step) return null;

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onClose();
    setCurrentStep(0);
  };

  // Tooltip position calculation helper
  const getTooltipStyles = (): React.CSSProperties => {
    if (!coords) return {};
    const offset = 12;
    const cardWidth = 320;
    const padding = 16;
    const viewportWidth = window.innerWidth;
    
    // Default center alignment
    let left = coords.left + coords.width / 2 - cardWidth / 2;
    
    // Clamp to viewport boundaries
    if (left + cardWidth > viewportWidth - padding) {
      left = viewportWidth - cardWidth - padding;
    }
    if (left < padding) {
      left = padding;
    }

    switch (step.placement) {
      case 'bottom':
        return {
          position: 'fixed',
          top: coords.top + coords.height + offset,
          left: left,
          width: cardWidth,
        };
      case 'top':
        return {
          position: 'fixed',
          top: coords.top - offset,
          left: left,
          transform: 'translateY(-100%)',
          width: cardWidth,
        };
      case 'right':
        let rightLeft = coords.left + coords.width + offset;
        if (rightLeft + cardWidth > viewportWidth - padding) {
          rightLeft = coords.left - cardWidth - offset;
        }
        return {
          position: 'fixed',
          top: coords.top + coords.height / 2,
          left: rightLeft,
          transform: 'translateY(-50%)',
          width: cardWidth,
        };
      case 'left':
        let leftLeft = coords.left - cardWidth - offset;
        if (leftLeft < padding) {
          leftLeft = coords.left + coords.width + offset;
        }
        return {
          position: 'fixed',
          top: coords.top + coords.height / 2,
          left: leftLeft,
          transform: 'translateY(-50%)',
          width: cardWidth,
        };
      default:
        return {};
    }
  };

  // Arrow styling helper
  const getArrowClass = () => {
    switch (step.placement) {
      case 'bottom':
        return 'absolute -top-1.5 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-t border-l border-slate-200';
      case 'top':
        return 'absolute -bottom-1.5 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-b border-r border-slate-200';
      case 'right':
        return 'absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-white border-b border-l border-slate-200';
      case 'left':
        return 'absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 bg-white border-t border-r border-slate-200';
      default:
        return '';
    }
  };

  // Arrow position style helper
  const getArrowStyle = (): React.CSSProperties => {
    if (!coords) return {};
    if (step.placement === 'top' || step.placement === 'bottom') {
      const centerX = coords.left + coords.width / 2;
      const cardWidth = 320;
      const padding = 16;
      const viewportWidth = window.innerWidth;
      
      let left = centerX - cardWidth / 2;
      if (left + cardWidth > viewportWidth - padding) {
        left = viewportWidth - cardWidth - padding;
      }
      if (left < padding) {
        left = padding;
      }
      
      const arrowX = centerX - left;
      const clampedArrowX = Math.max(20, Math.min(cardWidth - 20, arrowX));
      
      return {
        left: clampedArrowX,
      };
    }
    return {};
  };

  return (
    <div className="fixed inset-0 z-[2000] pointer-events-none">
      {/* Dim backdrop layer */}
      <div className="absolute inset-0 bg-slate-900/35 pointer-events-auto" onClick={handleComplete} />

      {/* Target spotlight overlay */}
      <div 
        className="fixed rounded-lg border-2 border-emerald-500 shadow-[0_0_0_9999px_rgba(15,23,42,0.5),_0_0_15px_rgba(16,185,129,0.7)] transition-all duration-300 pointer-events-auto z-[2001]"
        style={{
          top: coords.top - 4,
          left: coords.left - 4,
          width: coords.width + 8,
          height: coords.height + 8,
        }}
      >
        {/* Pulsing ring inside */}
        <span className="absolute inset-0 rounded-lg border-2 border-emerald-400 opacity-75 animate-ping pointer-events-none"></span>
      </div>

      {/* Tooltip Card container */}
      <div 
        className="bg-white rounded-xl border border-slate-200 shadow-2xl w-[320px] p-5 pointer-events-auto z-[2002] transition-all duration-300 animate-in fade-in zoom-in-95 duration-200"
        style={getTooltipStyles()}
      >
        {/* Arrow pointer */}
        <div className={getArrowClass()} style={getArrowStyle()} />

        {/* Content */}
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
            <Icon icon={step.icon} className="text-emerald-500 text-base shrink-0" />
            <span>{step.title}</span>
          </h4>
          <span className="text-[10px] bg-sky-50 text-sky-600 font-semibold px-2 py-0.5 rounded-full shrink-0">
            Bước {currentStep + 1} / {TOUR_STEPS.length}
          </span>
        </div>

        <p className="text-slate-600 text-xs leading-relaxed mb-4">
          {step.description}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button 
            onClick={handleComplete}
            className="text-slate-400 hover:text-slate-600 text-xs font-medium cursor-pointer"
          >
            Bỏ qua
          </button>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button 
                onClick={handleBack}
                className="px-2.5 py-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded cursor-pointer transition"
              >
                Quay lại
              </button>
            )}
            <button 
              onClick={handleNext}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs rounded cursor-pointer transition shadow-xs flex items-center gap-0.5"
            >
              {currentStep < TOUR_STEPS.length - 1 ? (
                <>
                  Tiếp tục
                  <Icon icon="solar:alt-arrow-right-bold" className="text-[10px]" />
                </>
              ) : 'Hoàn thành'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
