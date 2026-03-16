import React, { useRef, useEffect } from 'react';
import { IonInput } from '@ionic/react';
import { useMaskito } from '@maskito/react';
import { MaskitoOptions } from '@maskito/core';
import styles from './PhoneInput.module.css';

interface PhoneInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  label,
  required = false
}) => {
  const phoneMaskOptions: MaskitoOptions = {
    mask: ['+', '7', ' ', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]
  };

  const phoneMask = useMaskito({ options: phoneMaskOptions });
  const inputRef = useRef<HTMLIonInputElement>(null);

  useEffect(() => {
    const applyMask = async () => {
      if (inputRef.current) {
        const input = await inputRef.current.getInputElement();
        phoneMask(input);
      }
    };

    applyMask();
  }, [phoneMask]);

  return (
    <div className={styles.phoneInputContainer}>
      {label && (
        <div className={styles.labelContainer}>
          <span className={styles.label}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </span>
        </div>
      )}

      <div className={styles.inputWrapper}>
        <IonInput
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onIonInput={(e) => onChange(e.detail.value || '')}
          onIonBlur={onBlur}
          className={styles.input}
          fill="solid"
          type="tel"
        />
      </div>

      {error && (
        <div className={styles.errorText}>
          {error}
        </div>
      )}
    </div>
  );
};
