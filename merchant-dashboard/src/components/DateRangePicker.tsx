import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

export type PeriodType = '7d' | '30d' | '90d' | 'ytd' | 'lifetime' | 'custom';

interface DateRangePickerProps {
  selectedPeriod: PeriodType;
  onApply: (period: PeriodType, label: string) => void;
  lang: 'sr' | 'mk' | 'en';
}

interface PresetOption {
  id: PeriodType;
  label: string;
  sub: string;
  startDay: number;
  endDay: number;
  month: number; // 0-indexed (8 = Sep)
  year: number;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  selectedPeriod,
  onApply,
  lang,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempPeriod, setTempPeriod] = useState<PeriodType>(selectedPeriod);
  const [calMonth, setCalMonth] = useState(8); // 8 = September
  const [calYear, setCalYear] = useState(2026);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Month names
  const monthNames: Record<'sr' | 'mk' | 'en', string[]> = {
    sr: ['JANUAR', 'FEBRUAR', 'MART', 'APRIL', 'MAJ', 'JUNI', 'JULI', 'AVGUST', 'SEPTEMBAR', 'OKTOBAR', 'NOVEMBAR', 'DECEMBAR'],
    mk: ['ЈАНУАРИ', 'ФЕВРУАРИ', 'МАРТ', 'АПРИЛ', 'МАЈ', 'ЈУНИ', 'ЈУЛИ', 'АВГУСТ', 'СЕПТЕМВРИ', 'ОКТОМВРИ', 'НОЕМВРИ', 'ДЕКЕМВРИ'],
    en: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
  };

  const dayNames: Record<'sr' | 'mk' | 'en', string[]> = {
    sr: ['NED', 'PON', 'UTO', 'SRE', 'ČET', 'PET', 'SUB'],
    mk: ['НЕД', 'ПОН', 'ВТО', 'СРЕ', 'ЧЕТ', 'ПЕТ', 'САБ'],
    en: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  };

  const presets: Record<'sr' | 'mk' | 'en', PresetOption[]> = {
    sr: [
      { id: '7d', label: 'Poslednjih 7 dana', sub: '13. sep 2026 – 20. sep 2026', startDay: 13, endDay: 20, month: 8, year: 2026 },
      { id: '30d', label: 'Poslednjih 30 dana', sub: '21. avg 2026 – 20. sep 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: '90d', label: 'Poslednjih 90 dana', sub: '22. jun 2026 – 20. sep 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: 'ytd', label: 'Od početka godine (YTD)', sub: '1. jan 2026 – 20. sep 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: 'lifetime', label: 'Ukupno (Lifetime)', sub: '1. sep 2025 – 20. sep 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: 'custom', label: 'Prilagođeni opseg', sub: 'Izaberite na kalendaru', startDay: 10, endDay: 25, month: 8, year: 2026 },
    ],
    mk: [
      { id: '7d', label: 'Последните 7 дена', sub: '13 сеп 2026 – 20 сеп 2026', startDay: 13, endDay: 20, month: 8, year: 2026 },
      { id: '30d', label: 'Последните 30 дена', sub: '21 авг 2026 – 20 сеп 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: '90d', label: 'Последните 90 дена', sub: '22 јун 2026 – 20 сеп 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: 'ytd', label: 'Од почетокот на годината', sub: '1 јан 2026 – 20 сеп 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: 'lifetime', label: 'Вкупно (Lifetime)', sub: '1 сеп 2025 – 20 сеп 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: 'custom', label: 'Прилагоден опсег', sub: 'Изберете на календарот', startDay: 10, endDay: 25, month: 8, year: 2026 },
    ],
    en: [
      { id: '7d', label: 'Last 7 days', sub: 'Sep 13, 2026 – Sep 20, 2026', startDay: 13, endDay: 20, month: 8, year: 2026 },
      { id: '30d', label: 'Last 30 days', sub: 'Aug 21, 2026 – Sep 20, 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: '90d', label: 'Last 90 days', sub: 'Jun 22, 2026 – Sep 20, 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: 'ytd', label: 'Year-to-date', sub: 'Jan 1, 2026 – Sep 20, 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: 'lifetime', label: 'All-time (Lifetime)', sub: 'Sep 1, 2025 – Sep 20, 2026', startDay: 1, endDay: 20, month: 8, year: 2026 },
      { id: 'custom', label: 'Custom range', sub: 'Select on calendar', startDay: 10, endDay: 25, month: 8, year: 2026 },
    ],
  };

  const currentPresets = presets[lang];
  const activePreset = currentPresets.find(p => p.id === selectedPeriod) || currentPresets[1];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleApply = () => {
    const selected = currentPresets.find(p => p.id === tempPeriod) || currentPresets[1];
    onApply(tempPeriod, selected.label);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempPeriod(selectedPeriod);
    setIsOpen(false);
  };

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  // Build calendar matrix
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayIndex = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 = Sun

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayIndex(calYear, calMonth);
  const daysInPrevMonth = getDaysInMonth(calYear, calMonth - 1);

  // Active highlighted range configuration for tempPeriod
  const tempOption = currentPresets.find(p => p.id === tempPeriod) || currentPresets[1];
  const isMatchMonth = calMonth === tempOption.month && calYear === tempOption.year;
  const rangeStart = isMatchMonth ? tempOption.startDay : -1;
  const rangeEnd = isMatchMonth ? tempOption.endDay : -1;

  // Calendar cells (previous month trailing, current month, next month leading)
  const cells: Array<{ day: number; isCurrentMonth: boolean }> = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, isCurrentMonth: true });
  }
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, isCurrentMonth: false });
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setTempPeriod(selectedPeriod);
          setIsOpen(prev => !prev);
        }}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface border transition-all cursor-pointer shadow-xs text-xs font-semibold ${
          isOpen
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-theme-primary'
            : 'border-theme hover:border-emerald-500/50 text-theme-primary'
        }`}
      >
        <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="font-bold">{activePreset.label}</span>
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-theme-muted shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-theme-muted shrink-0" />
        )}
      </button>

      {/* Popover Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-surface rounded-2xl border border-theme shadow-2xl overflow-hidden w-[95vw] sm:w-[580px] md:w-[620px] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex flex-col md:flex-row">
            {/* Left Column: Preset Options */}
            <div className="w-full md:w-[260px] p-3 border-b md:border-b-0 md:border-r border-theme space-y-1 bg-surface shrink-0">
              {currentPresets.map(preset => {
                const isSelected = tempPeriod === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setTempPeriod(preset.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-950 dark:text-emerald-100 font-semibold shadow-xs'
                        : 'hover:bg-surface-subtle text-theme-primary'
                    }`}
                  >
                    {/* Radio Button Dot */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'border-emerald-600 dark:border-emerald-400'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className={`text-xs ${isSelected ? 'font-black text-emerald-700 dark:text-emerald-300' : 'font-bold'}`}>
                        {preset.label}
                      </div>
                      <div className="text-[10px] text-theme-muted truncate mt-0.5">
                        {preset.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Month Calendar View */}
            <div className="flex-1 p-4 sm:p-5 bg-surface-subtle/40">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-theme text-theme-muted hover:text-theme-primary transition-all cursor-pointer"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-xs font-black tracking-widest text-theme-primary uppercase">
                  {monthNames[lang][calMonth]} {calYear}
                </div>

                <button
                  type="button"
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg hover:bg-surface border border-transparent hover:border-theme text-theme-muted hover:text-theme-primary transition-all cursor-pointer"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day of Week Headers */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-theme-muted tracking-wider uppercase mb-2">
                {dayNames[lang].map((d, i) => (
                  <div key={i} className="py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day Cells Matrix */}
              <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                {cells.map((cell, idx) => {
                  if (!cell.isCurrentMonth) {
                    return (
                      <div
                        key={idx}
                        className="py-2 text-theme-subtle/50 text-[11px] select-none"
                      >
                        {cell.day}
                      </div>
                    );
                  }

                  const day = cell.day;
                  const isStart = day === rangeStart;
                  const isEnd = day === rangeEnd;
                  const inRange = rangeStart !== -1 && rangeEnd !== -1 && day >= rangeStart && day <= rangeEnd;

                  return (
                    <div
                      key={idx}
                      className={`relative py-1 flex items-center justify-center ${
                        inRange ? 'bg-emerald-500/15 dark:bg-emerald-500/20' : ''
                      } ${isStart ? 'rounded-l-full' : ''} ${isEnd ? 'rounded-r-full' : ''}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setTempPeriod('custom');
                        }}
                        className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                          isStart || isEnd
                            ? 'bg-emerald-600 text-white shadow-sm font-black'
                            : inRange
                            ? 'text-emerald-800 dark:text-emerald-200 font-bold hover:bg-emerald-500/30'
                            : 'text-theme-primary hover:bg-surface font-medium'
                        }`}
                      >
                        {day}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="p-3.5 sm:p-4 bg-surface border-t border-theme flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-1.5 rounded-xl border border-theme hover:bg-surface-subtle text-xs font-bold text-theme-secondary hover:text-theme-primary transition-all cursor-pointer shadow-xs"
            >
              {lang === 'sr' ? 'Otkaži' : lang === 'mk' ? 'Откажи' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {lang === 'sr' ? 'Primeni' : lang === 'mk' ? 'Примени' : 'Apply'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
