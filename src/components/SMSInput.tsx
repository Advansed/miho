import React, { useRef, useEffect, useState } from 'react';
import styles from './SMSInput.module.css';

interface SMSInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

export const SMSInput: React.FC<SMSInputProps> = ({
  value,
  onChange,
  length = 4,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));

  useEffect(() => {
    if (value.length <= length) {
      const newDigits = Array(length).fill('');
      for (let i = 0; i < value.length; i++) {
        newDigits[i] = value[i];
      }
      setDigits(newDigits);
    }
  }, [value, length]);

  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [disabled]);

  const handlePinChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    const fullCode = newDigits.join('');
    onChange(fullCode);

    if (digit && index < length - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      } else if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
        onChange(newDigits.join(''));
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }

    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }

    if (!/\d/.test(e.key) &&
        !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleFocus = (index: number) => {
    const input = inputRefs.current[index];
    if (input) {
      setTimeout(() => {
        input.select();
      }, 10);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);

    if (pastedText.length === length) {
      const newDigits = pastedText.split('');
      setDigits(newDigits);
      onChange(pastedText);

      const lastInput = inputRefs.current[length - 1];
      if (lastInput) {
        lastInput.focus();
      }
    }
  };

  return (
    <div className={styles.container} onPaste={handlePaste}>
      <div className={styles.inputsContainer}>
        {Array.from({ length }).map((_, index) => (
          <div key={index} className={styles.inputWrapper}>
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digits[index]}
              onChange={(e) => handlePinChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => handleFocus(index)}
              disabled={disabled}
              className={styles.input}
              aria-label={`Цифра ${index + 1} из ${length}`}
              data-pin-index={index}
            />
            {index < length - 1 && <div className={styles.separator} />}
          </div>
        ))}
      </div>
    </div>
  );
};
