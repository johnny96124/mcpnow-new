
export const hasAcceptedTerms = (): boolean => {
  const termsAccepted = localStorage.getItem('termsAccepted');
  const privacyAccepted = localStorage.getItem('privacyAccepted');
  return termsAccepted === 'true' && privacyAccepted === 'true';
};

export const clearTermsAcceptance = (): void => {
  localStorage.removeItem('termsAccepted');
  localStorage.removeItem('privacyAccepted');
  localStorage.removeItem('acceptanceTimestamp');
};

export const getAcceptanceTimestamp = (): string | null => {
  return localStorage.getItem('acceptanceTimestamp');
};
