type ValidationError = {
  type?: string;
  msg?: string;
  loc?: Array<string | number>;
};

export type AuthErrorContext = "login" | "register" | "verify" | "resend" | "admin";

export type AuthErrorCode =
  | "generic"
  | "invalid_credentials"
  | "invalid_admin_credentials"
  | "email_taken"
  | "password_too_short"
  | "invalid_email"
  | "name_required"
  | "name_too_long"
  | "too_many_attempts"
  | "verify_expired"
  | "verify_invalid"
  | "already_verified"
  | "not_verified"
  | "account_inactive"
  | "email_send_failed";

export type AuthErrorMessages = Record<AuthErrorCode, string>;

export class AuthRequestError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.name = "AuthRequestError";
    this.code = code;
  }
}

function fieldName(loc?: Array<string | number>): string | null {
  const field = loc?.filter((part) => part !== "body").at(-1);
  return typeof field === "string" ? field : null;
}

function validationErrorCode(error: ValidationError): AuthErrorCode | null {
  const field = fieldName(error.loc);

  if (field === "password" && error.type === "string_too_short") {
    return "password_too_short";
  }
  if (field === "name" && error.type === "string_too_short") {
    return "name_required";
  }
  if (field === "name" && error.type === "string_too_long") {
    return "name_too_long";
  }
  if (field === "email" && (error.type === "value_error" || error.type?.includes("email"))) {
    return "invalid_email";
  }
  if (field === "email" && error.type === "missing") {
    return "invalid_email";
  }
  if (field === "password" && error.type === "missing") {
    return "password_too_short";
  }
  if (field === "name" && error.type === "missing") {
    return "name_required";
  }

  if (field === "code" && (error.type === "string_pattern_mismatch" || error.type === "missing")) {
    return "verify_invalid";
  }

  return null;
}

function detailStringCode(detail: string, status: number, context?: AuthErrorContext): AuthErrorCode {
  switch (detail) {
    case "An account with this email already exists.":
      return "email_taken";
    case "Invalid email or password.":
      return "invalid_credentials";
    case "Invalid username or password.":
      return "invalid_admin_credentials";
    case "Too many registration attempts. Try again later.":
    case "Too many resend attempts. Try again later.":
    case "Too many verification attempts. Try again later.":
      return "too_many_attempts";
    case "Verification code has expired.":
      return "verify_expired";
    case "Invalid verification code.":
      return "verify_invalid";
    case "Email is already verified.":
      return "already_verified";
    case "Email verification required before booking.":
      return "not_verified";
    case "Account is not active.":
      return "account_inactive";
    case "Could not send verification email. Try again later.":
      return "email_send_failed";
    default:
      break;
  }

  if (status === 401) {
    return context === "admin" ? "invalid_admin_credentials" : "invalid_credentials";
  }
  if (status === 409) {
    return "email_taken";
  }
  if (status === 410) {
    return "verify_expired";
  }
  if (status === 429) {
    return "too_many_attempts";
  }

  return "generic";
}

export function parseAuthApiError(
  payload: unknown,
  status: number,
  context?: AuthErrorContext,
): AuthErrorCode {
  if (!payload || typeof payload !== "object") {
    return status >= 500 ? "generic" : detailStringCode("", status, context);
  }

  const detail = (payload as { detail?: unknown }).detail;

  if (typeof detail === "string") {
    if (
      detail === "User not found" ||
      detail === "User not found." ||
      detail === "Admin access only." ||
      detail === "Authentication required"
    ) {
      return "generic";
    }
    return detailStringCode(detail, status, context);
  }

  if (Array.isArray(detail)) {
    for (const item of detail) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const code = validationErrorCode(item as ValidationError);
      if (code) {
        return code;
      }
    }
  }

  if (status === 422) {
    return context === "register" ? "password_too_short" : "generic";
  }

  return detailStringCode("", status, context);
}

export function getAuthErrorMessage(error: unknown, messages: AuthErrorMessages): string {
  if (error instanceof AuthRequestError) {
    return messages[error.code];
  }
  return messages.generic;
}
