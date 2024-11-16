import React from 'react';
import classNames from 'classnames';

import styles from './input.module.scss';

interface InputITF extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  inputSize?: 'sm' | 'lg';
  label?: string;
  required?: boolean;
}

export const Input: React.FC<InputITF> = ({
  errorMessage,
  inputSize = 'lg',
  label,
  required,
  ...props
}) => {
  const inputClass = classNames(
    styles.input,
    props.className,
    styles[`input_${inputSize}`],
    errorMessage && styles.input_errorMessage
  );

  return (
    <div className={styles.wrapper}>
      {!!label && (
        <div className={styles.input_label}>
          <p>
            {label}
            {required && (
              <span className={styles.input_label_required}> *</span>
            )}
          </p>
        </div>
      )}
      <input className={inputClass} {...props} autoComplete="off" />
      {!!errorMessage && <label>*{errorMessage}</label>}
    </div>
  );
};
