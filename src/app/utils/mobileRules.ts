/**
 * Mobile Responsiveness Rules
 * 
 * BUTTON STACKING:
 * - Primary and secondary buttons should stack vertically on mobile
 * - Use flex-col on mobile, flex-row on desktop
 * - Ensures text doesn't break on small screens
 * 
 * MODALS & FORMS:
 * - Always use vertical layout on mobile
 * - Stack form fields vertically
 * - Stack action buttons vertically
 * - Use full-width buttons on mobile
 */

export const mobileClasses = {
  // Button container - vertical stack on mobile, horizontal on desktop
  buttonContainer: 'flex flex-col sm:flex-row gap-3',
  
  // Modal actions - vertical stack on mobile, horizontal on desktop
  modalActions: 'flex flex-col sm:flex-row gap-3 sm:justify-end',
  
  // Form actions - vertical stack on mobile, horizontal on desktop
  formActions: 'flex flex-col sm:flex-row gap-3 sm:justify-end',
  
  // Primary button - full width on mobile
  primaryButton: 'w-full sm:w-auto min-h-[44px]',
  
  // Secondary button - full width on mobile
  secondaryButton: 'w-full sm:w-auto min-h-[44px]',
  
  // Modal container - full width on mobile
  modalContainer: 'w-full max-w-md sm:max-w-2xl max-h-[90vh] overflow-y-auto',
  
  // Form container - vertical spacing on mobile
  formContainer: 'space-y-4 sm:space-y-6',
  
  // Form field - full width on mobile
  formField: 'w-full',
};