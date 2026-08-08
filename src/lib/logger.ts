// Development-only logging helper.
// Prevents leaking database schema / internal error details in production consoles.
export const logError = (context: string, error: unknown) => {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(context, error);
  }
};

// Maps any error to a safe, generic user-facing message (French UI).
export const getUserErrorMessage = (_error?: unknown) =>
  "Une erreur est survenue. Veuillez réessayer.";
