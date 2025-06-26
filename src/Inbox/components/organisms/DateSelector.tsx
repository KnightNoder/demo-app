import React, { useState, useEffect } from 'react';
import { FormField } from '../molecules/FormField';
import { DateOption } from '../molecules/DateOption';
import { Input } from '../atoms/Input';

type DateOptionType = 'today' | 'tomorrow' | 'custom';

interface DateSelectorProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  required?: boolean;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  label,
  value,
  onChange,
  required = false
}) => {
  const [option, setOption] = useState<DateOptionType>('today');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (option === 'today') {
      onChange(today.toISOString().split('T')[0]);
    } else if (option === 'tomorrow') {
      onChange(tomorrow.toISOString().split('T')[0]);
    }
  }, [option, onChange]);

  return (
    <FormField label={label} required={required}>
      <div className="flex gap-1 mb-2">
        <DateOption
          selected={option === 'today'}
          onClick={() => setOption('today')}
        >
          Today
        </DateOption>
        <DateOption
          selected={option === 'tomorrow'}
          onClick={() => setOption('tomorrow')}
        >
          Tomorrow
        </DateOption>
        <DateOption
          selected={option === 'custom'}
          onClick={() => setOption('custom')}
        >
          Custom
        </DateOption>
      </div>
      {option === 'custom' ? (
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-xs"
        />
      ) : (
        <div className="text-xs text-gray-600 mt-1">
          {formatDate(value)}
        </div>
      )}
    </FormField>
  );
};