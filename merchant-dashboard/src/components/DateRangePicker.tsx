import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export type PeriodType = 'since_last_purchase' | '7d' | '30d' | '90d' | 'ytd' | 'lifetime' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangePickerProps {
  selectedPeriod: PeriodType;
  customRange?: DateRange;
  onApply: (period: PeriodType, label: string, range?: DateRange) => void;
  lang: 'sr' | 'mk' | 'en';
  mode?: 'analytics' | 'credits';
}

interface PresetOption {
  id: PeriodType;
  label: string;
  sub: string;
  start: Date;
  end: Date;
}

const shortMonths: Record<'sr' | 'mk' | 'en', string[]> = {
  sr: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
  mk: ['јан', 'фев', 'мар', 'апр', 'мај', 'јун', 'јул', 'авг', 'сеп', 'окт', 'ное', 'дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export const formatDate = (date: Date, lang: 'sr' | 'mk' | 'en'): string => {
  const day = date.getDate();
  const month = shortMonths[lang][date.getMonth()];
  const year = date.getFullYear();
  if (lang === 'sr') {
    return `${day}. ${month} ${year}`;
  }
  if (lang === 'mk') {
    return `${day} ${month} ${year}`;
  }
  return `${month} ${day}, ${year}`;
};

export const formatDateRange = (start: Date, end: Date, lang: 'sr' | 'mk' | 'en'): string => {
  return `${formatDate(start, lang)} – ${formatDate(end, lang)}`;
};

const normalizeDate = (d: Date) => {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  selectedPeriod,
  customRange = { start: new Date(2026, 8, 10), end: new Date(2026, 8, 20) },
  onApply,
  lang,
  mode = 'analytics',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempPeriod, setTempPeriod] = useState<PeriodType>(selectedPeriod);
  
  // Custom range selection state
  const [tempCustomStart, setTempCustomStart] = useState<Date>(customRange.start);
  const [tempCustomEnd, setTempCustomEnd] = useState<Date | null>(customRange.end);
  const [isPickingEnd, setIsPickingEnd] = useState(false);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // Month navigation (default to September 2026)
  const [calMonth, setCalMonth] = useState(8); // 8 = September
  const [calYear, setCalYear] = useState(2026);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Month names for header
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

  // Fixed anchor date for 2026 mock data
  const refEnd = new Date(2026, 8, 20);
  const sincePurchaseStart = new Date(2026, 8, 18);

  const creditsPresets: Record<'sr' | 'mk' | 'en', PresetOption[]> = {
    sr: [
      { id: 'since_last_purchase', label: 'Od poslednje kupovine', sub: '18. sep 2026 – 20. sep 2026', start: sincePurchaseStart, end: refEnd },
      { id: '7d', label: 'Poslednjih 7 dana', sub: '13. sep 2026 – 20. sep 2026', start: new Date(2026, 8, 13), end: refEnd },
      { id: '30d', label: 'Poslednjih 30 dana', sub: '21. avg 2026 – 20. sep 2026', start: new Date(2026, 7, 21), end: refEnd },
      { id: '90d', label: 'Poslednjih 90 dana', sub: '22. jun 2026 – 20. sep 2026', start: new Date(2026, 5, 22), end: refEnd },
      { id: 'ytd', label: 'Od početka godine (YTD)', sub: '1. jan 2026 – 20. sep 2026', start: new Date(2026, 0, 1), end: refEnd },
      { id: 'lifetime', label: 'Sve vreme (Lifetime)', sub: '1. sep 2025 – 20. sep 2026', start: new Date(2025, 8, 1), end: refEnd },
    ],
    mk: [
      { id: 'since_last_purchase', label: 'Од последно купување', sub: '18 сеп 2026 – 20 сеп 2026', start: sincePurchaseStart, end: refEnd },
      { id: '7d', label: 'Последните 7 дена', sub: '13 сеп 2026 – 20 сеп 2026', start: new Date(2026, 8, 13), end: refEnd },
      { id: '30d', label: 'Последните 30 дена', sub: '21 авг 2026 – 20 сеп 2026', start: new Date(2026, 7, 21), end: refEnd },
      { id: '90d', label: 'Последните 90 дена', sub: '22 јун 2026 – 20 сеп 2026', start: new Date(2026, 5, 22), end: refEnd },
      { id: 'ytd', label: 'Од почетокот на годината', sub: '1 јан 2026 – 20 сеп 2026', start: new Date(2026, 0, 1), end: refEnd },
      { id: 'lifetime', label: 'Вкупно (Lifetime)', sub: '1 сеп 2025 – 20 сеп 2026', start: new Date(2025, 8, 1), end: refEnd },
    ],
    en: [
      { id: 'since_last_purchase', label: 'Since last purchase', sub: 'Sep 18, 2026 – Sep 20, 2026', start: sincePurchaseStart, end: refEnd },
      { id: '7d', label: 'Last 7 days', sub: 'Sep 13, 2026 – Sep 20, 2026', start: new Date(2026, 8, 13), end: refEnd },
      { id: '30d', label: 'Last 30 days', sub: 'Aug 21, 2026 – Sep 20, 2026', start: new Date(2026, 7, 21), end: refEnd },
      { id: '90d', label: 'Last 90 days', sub: 'Jun 22, 2026 – Sep 20, 2026', start: new Date(2026, 5, 22), end: refEnd },
      { id: 'ytd', label: 'Year-to-date (YTD)', sub: 'Jan 1, 2026 – Sep 20, 2026', start: new Date(2026, 0, 1), end: refEnd },
      { id: 'lifetime', label: 'All-time (Lifetime)', sub: 'Sep 1, 2025 – Sep 20, 2026', start: new Date(2025, 8, 1), end: refEnd },
    ],
  };

  const analyticsPresets: Record<'sr' | 'mk' | 'en', PresetOption[]> = {
    sr: [
      { id: '7d', label: 'Poslednjih 7 dana', sub: '13. sep 2026 – 20. sep 2026', start: new Date(2026, 8, 13), end: refEnd },
      { id: '30d', label: 'Poslednjih 30 dana', sub: '21. avg 2026 – 20. sep 2026', start: new Date(2026, 7, 21), end: refEnd },
      { id: '90d', label: 'Poslednjih 90 dana', sub: '22. jun 2026 – 20. sep 2026', start: new Date(2026, 5, 22), end: refEnd },
      { id: 'ytd', label: 'Od početka godine (YTD)', sub: '1. jan 2026 – 20. sep 2026', start: new Date(2026, 0, 1), end: refEnd },
      { id: 'lifetime', label: 'Ukupno (Lifetime)', sub: '1. sep 2025 – 20. sep 2026', start: new Date(2025, 8, 1), end: refEnd },
      {
        id: 'custom',
        label: 'Prilagođeni opseg',
        sub: isPickingEnd && tempCustomStart
          ? `Od ${formatDate(tempCustomStart, lang)}... (izaberite kraj)`
          : tempCustomEnd
          ? formatDateRange(tempCustomStart, tempCustomEnd, lang)
          : 'Izaberite na kalendaru',
        start: tempCustomStart,
        end: tempCustomEnd || tempCustomStart,
      },
    ],
    mk: [
      { id: '7d', label: 'Последните 7 дена', sub: '13 сеп 2026 – 20 сеп 2026', start: new Date(2026, 8, 13), end: refEnd },
      { id: '30d', label: 'Последните 30 дена', sub: '21 авг 2026 – 20 сеп 2026', start: new Date(2026, 7, 21), end: refEnd },
      { id: '90d', label: 'Последните 90 дена', sub: '22 јун 2026 – 20 сеп 2026', start: new Date(2026, 5, 22), end: refEnd },
      { id: 'ytd', label: 'Од почетокот на годината', sub: '1 јан 2026 – 20 сеп 2026', start: new Date(2026, 0, 1), end: refEnd },
      { id: 'lifetime', label: 'Вкупно (Lifetime)', sub: '1 сеп 2025 – 20 сеп 2026', start: new Date(2025, 8, 1), end: refEnd },
      {
        id: 'custom',
        label: 'Прилагоден опсег',
        sub: isPickingEnd && tempCustomStart
          ? `Од ${formatDate(tempCustomStart, lang)}... (изберете крај)`
          : tempCustomEnd
          ? formatDateRange(tempCustomStart, tempCustomEnd, lang)
          : 'Изберете на календарот',
        start: tempCustomStart,
        end: tempCustomEnd || tempCustomStart,
      },
    ],
    en: [
      { id: '7d', label: 'Last 7 days', sub: 'Sep 13, 2026 – Sep 20, 2026', start: new Date(2026, 8, 13), end: refEnd },
      { id: '30d', label: 'Last 30 days', sub: 'Aug 21, 2026 – Sep 20, 2026', start: new Date(2026, 7, 21), end: refEnd },
      { id: '90d', label: 'Last 90 days', sub: 'Jun 22, 2026 – Sep 20, 2026', start: new Date(2026, 5, 22), end: refEnd },
      { id: 'ytd', label: 'Year-to-date', sub: 'Jan 1, 2026 – Sep 20, 2026', start: new Date(2026, 0, 1), end: refEnd },
      { id: 'lifetime', label: 'All-time (Lifetime)', sub: 'Sep 1, 2025 – Sep 20, 2026', start: new Date(2025, 8, 1), end: refEnd },
      {
        id: 'custom',
        label: 'Custom range',
        sub: isPickingEnd && tempCustomStart
          ? `From ${formatDate(tempCustomStart, lang)}... (pick end date)`
          : tempCustomEnd
          ? formatDateRange(tempCustomStart, tempCustomEnd, lang)
          : 'Select on calendar',
        start: tempCustomStart,
        end: tempCustomEnd || tempCustomStart,
      },
    ],
  };

  const currentPresets = mode === 'credits' ? creditsPresets[lang] : analyticsPresets[lang];
  const activePreset = currentPresets.find(p => p.id === selectedPeriod) || currentPresets[0];

  // When opening the dropdown, sync temp states
  const handleToggle = () => {
    if (!isOpen) {
      setTempPeriod(selectedPeriod);
      setTempCustomStart(customRange.start);
      setTempCustomEnd(customRange.end);
      setIsPickingEnd(false);
      setHoverDate(null);
      if (selectedPeriod === 'custom') {
        setCalMonth(customRange.start.getMonth());
        setCalYear(customRange.start.getFullYear());
      } else {
        setCalMonth(8);
        setCalYear(2026);
      }
    }
    setIsOpen(prev => !prev);
  };

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
    if (tempPeriod === 'custom') {
      const finalEnd = tempCustomEnd || tempCustomStart;
      const range = { start: tempCustomStart, end: finalEnd };
      const label = formatDateRange(tempCustomStart, finalEnd, lang);
      onApply('custom', label, range);
    } else {
      const selected = currentPresets.find(p => p.id === tempPeriod) || currentPresets[1];
      onApply(tempPeriod, selected.label, { start: selected.start, end: selected.end });
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempPeriod(selectedPeriod);
    setTempCustomStart(customRange.start);
    setTempCustomEnd(customRange.end);
    setIsPickingEnd(false);
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

  // Calendar matrix calculations
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayIndex = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 = Sun

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayIndex(calYear, calMonth);
  const daysInPrevMonth = getDaysInMonth(calYear, calMonth - 1);

  // Determine current active range for highlighting
  let activeStart: Date | null = null;
  let activeEnd: Date | null = null;

  if (tempPeriod === 'custom') {
    activeStart = tempCustomStart;
    if (isPickingEnd && hoverDate) {
      if (hoverDate >= tempCustomStart) {
        activeEnd = hoverDate;
      } else {
        // If hovered date is before start, display hover preview as the potential new start
        activeStart = hoverDate;
        activeEnd = tempCustomStart;
      }
    } else {
      activeEnd = tempCustomEnd || tempCustomStart;
    }
  } else {
    const selected = currentPresets.find(p => p.id === tempPeriod) || currentPresets[1];
    activeStart = selected.start;
    activeEnd = selected.end;
  }

  const startTime = activeStart ? normalizeDate(activeStart) : null;
  const endTime = activeEnd ? normalizeDate(activeEnd) : null;

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

  // Handle clicking a day cell
  const handleDateClick = (day: number) => {
    if (mode === 'credits') return;
    const clickedDate = new Date(calYear, calMonth, day);
    setTempPeriod('custom');

    if (!isPickingEnd || !tempCustomStart) {
      // First click: select start date
      setTempCustomStart(clickedDate);
      setTempCustomEnd(null);
      setIsPickingEnd(true);
    } else {
      // Second click: select end date
      if (clickedDate < tempCustomStart) {
        // Clicked date is before start date, make it the new start date
        setTempCustomStart(clickedDate);
        setTempCustomEnd(null);
        setIsPickingEnd(true);
      } else {
        // Completed range
        setTempCustomEnd(clickedDate);
        setIsPickingEnd(false);
      }
    }
  };

  // Trigger button label
  const triggerLabel = selectedPeriod === 'custom'
    ? formatDateRange(customRange.start, customRange.end, lang)
    : activePreset.label;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-surface border transition-all cursor-pointer shadow-xs text-xs font-semibold ${
          isOpen
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 text-theme-primary'
            : 'border-theme hover:border-emerald-500/50 text-theme-primary'
        }`}
      >
        <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span className="font-bold">{triggerLabel}</span>
        {activePreset?.sub && selectedPeriod !== 'custom' && (
          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono text-[11px]">
            {activePreset.sub}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="w-3.5 h-3.5 text-theme-muted shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-theme-muted shrink-0" />
        )}
      </button>

      {/* Popover Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-surface rounded-2xl border border-theme shadow-elevated overflow-hidden w-[95vw] sm:w-[600px] md:w-[660px] animate-in fade-in zoom-in-95 duration-150">
          <div className="flex flex-col md:flex-row">
            {/* Left Column: Preset Options */}
            <div className="w-full md:w-[260px] p-3 border-b md:border-b-0 md:border-r border-theme space-y-1 bg-surface shrink-0">
              {currentPresets.map(preset => {
                const isSelected = tempPeriod === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setTempPeriod(preset.id);
                      setIsPickingEnd(false);
                      if (preset.id !== 'custom') {
                        setCalMonth(preset.end.getMonth());
                        setCalYear(preset.end.getFullYear());
                      } else {
                        setCalMonth(tempCustomStart.getMonth());
                        setCalYear(tempCustomStart.getFullYear());
                      }
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-200 font-semibold shadow-xs'
                        : 'hover:bg-surface-subtle text-theme-primary'
                    }`}
                  >
                    {/* Radio Button Dot */}
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? 'border-emerald-600 dark:border-emerald-400'
                          : 'border-theme-emphasis'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
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
              {/* Range Feedback Bar */}
              <div className="mb-3.5 pb-3 border-b border-theme/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] font-semibold text-theme-muted uppercase tracking-wider">
                    {lang === 'sr' ? 'Opseg:' : lang === 'mk' ? 'Опсег:' : 'Range:'}
                  </span>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span className="bg-surface px-2.5 py-1 rounded-lg border border-theme text-theme-primary text-[11px] shadow-2xs">
                      {activeStart ? formatDate(activeStart, lang) : '—'}
                    </span>
                    <ArrowRight className="w-3 h-3 text-theme-muted" />
                    <span
                      className={`px-2.5 py-1 rounded-lg border text-[11px] shadow-2xs ${
                        isPickingEnd && !tempCustomEnd
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 animate-pulse'
                          : 'bg-surface border-theme text-theme-primary'
                      }`}
                    >
                      {isPickingEnd && !tempCustomEnd
                        ? (lang === 'sr' ? 'Izaberite kraj...' : lang === 'mk' ? 'Изберете крај...' : 'Pick end date...')
                        : activeEnd
                        ? formatDate(activeEnd, lang)
                        : '—'}
                    </span>
                  </div>
                </div>

                {isPickingEnd && (
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {lang === 'sr' ? 'Korak 2/2' : lang === 'mk' ? 'Чекор 2/2' : 'Step 2/2'}
                  </span>
                )}
              </div>

              {/* Calendar Month & Navigation */}
              <div className="flex items-center justify-between mb-3">
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
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-theme-muted tracking-wider uppercase mb-1.5">
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
                        className="py-1.5 text-theme-subtle/40 text-[11px] select-none flex items-center justify-center"
                      >
                        {cell.day}
                      </div>
                    );
                  }

                  const day = cell.day;
                  const cellDate = new Date(calYear, calMonth, day);
                  const cellTime = normalizeDate(cellDate);

                  const isStart = startTime !== null && cellTime === startTime;
                  const isEnd = endTime !== null && cellTime === endTime;
                  const inRange = startTime !== null && endTime !== null && cellTime >= startTime && cellTime <= endTime;

                  const isSingleDay = isStart && isEnd;

                  return (
                    <div
                      key={idx}
                      className={`relative py-0.5 flex items-center justify-center ${
                        inRange && !isSingleDay ? 'bg-emerald-500/15 dark:bg-emerald-500/20' : ''
                      } ${isStart && !isSingleDay ? 'rounded-l-full' : ''} ${isEnd && !isSingleDay ? 'rounded-r-full' : ''}`}
                    >
                      <button
                        type="button"
                        onClick={() => handleDateClick(day)}
                        onMouseEnter={() => {
                          if (isPickingEnd) {
                            setHoverDate(cellDate);
                          }
                        }}
                        onMouseLeave={() => {
                          if (isPickingEnd) {
                            setHoverDate(null);
                          }
                        }}
                        className={`w-7 h-7 rounded-full text-xs transition-all cursor-pointer flex items-center justify-center ${
                          isStart || isEnd
                            ? 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-black shadow-xs ring-2 ring-emerald-500/20'
                            : inRange
                            ? 'text-emerald-900 dark:text-emerald-200 font-bold hover:bg-emerald-500/30'
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
          <div className="p-3.5 sm:p-4 bg-surface border-t border-theme flex items-center justify-between">
            <div className="text-[11px] text-theme-muted hidden sm:block">
              {tempPeriod === 'custom' && (
                <span>
                  {isPickingEnd
                    ? (lang === 'sr' ? 'Izaberite datum završetka na kalendaru' : lang === 'mk' ? 'Изберете краен датум на календарот' : 'Select end date on the calendar')
                    : (lang === 'sr' ? 'Kliknite na datum za promenu opsega' : lang === 'mk' ? 'Кликнете на датум за промена на опсегот' : 'Click any date to pick a new range')}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2.5 ml-auto">
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
                className="px-5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                {lang === 'sr' ? 'Primeni' : lang === 'mk' ? 'Примени' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
