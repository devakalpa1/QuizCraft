import React from 'react';
import styled, { css } from 'styled-components';

const getButtonVariant = (variant) => {
  switch (variant) {
    case 'primary':
      return css`
        background: var(--primary-gradient);
        color: var(--text-color);
        border: none;
        box-shadow: var(--shadow-md);
        
        &:hover {
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          transform: translateY(-1px);
        }
        
        &:active {
          transform: translateY(0);
          box-shadow: var(--shadow-md);
        }
      `;
    case 'secondary':
      return css`
        background: transparent;
        color: var(--text-color);
        border: 2px solid var(--border-color);
        
        &:hover {
          border-color: var(--primary-color);
          background: rgba(66, 85, 255, 0.1);
          transform: translateY(-1px);
        }
      `;
    case 'success':
      return css`
        background: linear-gradient(135deg, var(--success-color) 0%, #16a34a 100%);
        color: white;
        border: none;
        
        &:hover {
          box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
          transform: translateY(-1px);
        }
      `;
    case 'danger':
      return css`
        background: linear-gradient(135deg, var(--error-color) 0%, #dc2626 100%);
        color: white;
        border: none;
        
        &:hover {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
          transform: translateY(-1px);
        }
      `;
    case 'ghost':
      return css`
        background: transparent;
        color: var(--text-color-secondary);
        border: none;
        
        &:hover {
          color: var(--text-color);
          background: rgba(255, 255, 255, 0.05);
        }
      `;
    default:
      return css`
        background: var(--primary-gradient);
        color: var(--text-color);
        border: none;
        box-shadow: var(--shadow-md);
        
        &:hover {
          box-shadow: var(--shadow-lg), var(--shadow-glow);
          transform: translateY(-1px);
        }
      `;
  }
};

const getButtonSize = (size) => {
  switch (size) {
    case 'sm':
      return css`
        padding: var(--space-2) var(--space-4);
        font-size: var(--font-size-sm);
        border-radius: var(--radius-md);
      `;
    case 'lg':
      return css`
        padding: var(--space-4) var(--space-8);
        font-size: var(--font-size-lg);
        border-radius: var(--radius-lg);
      `;
    case 'xl':
      return css`
        padding: var(--space-5) var(--space-10);
        font-size: var(--font-size-xl);
        border-radius: var(--radius-xl);
        font-weight: 600;
      `;
    default:
      return css`
        padding: var(--space-3) var(--space-6);
        font-size: var(--font-size-base);
        border-radius: var(--radius-md);
      `;
  }
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  
  /* When wrapped in a Link, inherit the text color and remove default link styling */
  a & {
    color: inherit;
    text-decoration: none;
  }
  
  ${props => getButtonVariant(props.$variant)}
  ${props => getButtonSize(props.$size)}
  
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  ${props => props.$loading && css`
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}
`;

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  ...props 
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
