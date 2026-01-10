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

  // Синхронизируем внешнее значение с внутренним состоянием
  useEffect(() => {
    if (value.length <= length) {
      const newDigits = Array(length).fill('');
      for (let i = 0; i < value.length; i++) {
        newDigits[i] = value[i];
      }
      setDigits(newDigits);
    }
  }, [value, length]);

  // Фокусировка на первом инпуте при монтировании
  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [disabled]);

  const handlePinChange = (value: string, index: number) => {
    // Оставляем только цифры и берем последнюю цифру
    const digit = value.replace(/\D/g, '').slice(-1);
    
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    
    // Обновляем родительский компонент
    const fullCode = newDigits.join('');
    onChange(fullCode);
    
    // Автофокус на следующее поле
    if (digit && index < length - 1) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace') {
      // Если поле пустое и не первый инпут - переходим к предыдущему
      if (!digits[index] && index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      } else if (digits[index]) {
        // Очищаем текущее поле
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
        onChange(newDigits.join(''));
      }
    }
    
    // Стрелка влево
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
    
    // Стрелка вправо
    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    // Блокируем ввод нецифровых символов
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
      
      // Фокус на последний инпут
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