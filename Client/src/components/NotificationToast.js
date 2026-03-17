import React from 'react';
import toast from 'react-hot-toast';

// This component doesn't render anything; it's just a wrapper for toast functions.
// We'll export utility functions for use elsewhere.

export const showSuccess = (message) => toast.success(message);
export const showError = (message) => toast.error(message);
export const showInfo = (message) => toast(message);