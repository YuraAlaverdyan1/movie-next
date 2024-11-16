import React from 'react';
import classNames from 'classnames';

import styles from './button.module.scss';

interface ButtonITF extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'lg';
}

export const Button: React.FC<ButtonITF> = ({
  variant,
  size,
  ...props
}) => {
  const className = classNames(
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
  );

  return (
    <button className={className} {...props}>
      {props.children}
    </button>
  );
};
