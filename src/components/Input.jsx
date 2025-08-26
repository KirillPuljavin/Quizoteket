// File: src/components/Input.jsx

/**
 * Universal Input Component
 * ------------------------
 * Reusable input field for all forms, search bars, and quiz answers.
 *
 * Props:
 *  - label: optional label text
 *  - type: input type (e.g. "text" | "email" | "password")
 *  - placeholder: hint text for the field
 *  - value: controlled input value
 *  - onChange: callback for value changes
 *  - error: optional error message, automatically styles the field
 *  - disabled: disables the field if true
 *
 * Usage:
 *  <Input label="E-post" type="email" placeholder="Ange e-post" />
 *  <Input label="Lösenord" type="password" />
 *  <Input placeholder="Sök quiz..." />
 *
 * Always use this component instead of raw <input> to maintain
 * consistent spacing, focus states, and error handling.
 */

import React from "react";
import PropTypes from "prop-types";

export default function Input({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <div className={`input ${error ? "input--error" : ""} ${className}`}>
      {label && <label className="input__label">{label}</label>}

      <input
        className="input__field"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />

      {error && <span className="input__error">{error}</span>}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
