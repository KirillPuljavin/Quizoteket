// File: src/components/Button.jsx

/**
 * Universal Button Component
 * -------------------------
 * Reusable button for all actions across the app.
 *
 * Props:
 *  - type: visual style ("primary" | "secondary" | "accent" | "outline" | "ghost")
 *  - size: button size ("sm" | "md" | "lg")
 *  - disabled: disables the button if true
 *  - className: optional custom styling
 *
 * Usage:
 *  <Button type="primary">Start Quiz</Button>
 *  <Button type="outline" size="sm">Cancel</Button>
 *
 * Always use this component instead of raw <button> to maintain
 * consistent styles and variants across the app.
 */

import React from "react";
import PropTypes from "prop-types";

export default function Button({
  type = "primary",
  size = "md",
  children,
  onClick,
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={`button button--${type} button--${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className="button__label">{children}</span>
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.oneOf(["primary", "secondary", "accent", "outline", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
