import {
  AuthRequestError,
  parseAuthApiError,
  type AuthErrorContext,
} from "@/lib/auth-errors";

const AUTH_API = "/backend/api/auth";
const BACKEND_API = "/backend/api";

export type AuthUser = {
  id: number;
  email: string | null;
  name: string | null;
  phone: string | null;
  username: string;
  isVerified: boolean;
  accountStatus: string;
};

export type RegisterResult = {
  status: string;
  message: string;
  user: AuthUser;
  devVerifyCode?: string | null;
};

async function authFetch<T>(
  path: string,
  init?: RequestInit,
  context?: AuthErrorContext,
): Promise<T> {
  const response = await fetch(`${AUTH_API}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json().catch(() => null)) as
    | { detail?: string; message?: string }
    | T
    | null;

  if (!response.ok) {
    throw new AuthRequestError(parseAuthApiError(payload, response.status, context));
  }

  return payload as T;
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
  phone: string;
}): Promise<RegisterResult> {
  return authFetch<RegisterResult>(
    "/register",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    "register",
  );
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<{ user: AuthUser; requiresVerification: boolean }> {
  const result = await authFetch<{
    user: AuthUser;
    requiresVerification: boolean;
  }>(
    "/login",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
    "login",
  );
  return result;
}

export async function fetchSession(): Promise<{
  authenticated: boolean;
  user?: AuthUser;
}> {
  return authFetch("/session");
}

export async function verifyEmailCode(code: string): Promise<{ status: string; message: string }> {
  return authFetch(
    "/verify",
    {
      method: "POST",
      body: JSON.stringify({ code }),
    },
    "verify",
  );
}

export async function resendVerification(): Promise<{
  status: string;
  message: string;
  devVerifyCode?: string;
}> {
  return authFetch("/resend-verification", { method: "POST" }, "resend");
}

export async function logoutUser(): Promise<void> {
  await fetch("/backend/logout", { method: "POST", credentials: "include" });
}

export type MyBooking = {
  id: number;
  kind: "reservation" | "inquiry";
  listing_id: number;
  listing_title?: string | null;
  check_in_date: string;
  check_out_date: string;
  number_of_guests?: number | null;
  total_price: number | null;
  booking_status: string;
  created_at: string;
};

export async function fetchMyBookings(): Promise<{
  count: number;
  bookings: MyBooking[];
}> {
  return authFetch("/bookings");
}

export async function fetchListingAvailability(
  listingId: string,
  checkIn: string,
  checkOut: string,
): Promise<{
  available: boolean;
  blockedDates: string[];
  currency: string;
  nights: number;
  /** Sum of Hostaway's live nightly prices for the stay. */
  subtotal: number;
  minimumStayViolation: boolean;
}> {
  const response = await fetch(
    `${BACKEND_API}/availability/${listingId}?checkInDate=${checkIn}&checkOutDate=${checkOut}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error("Could not check availability");
  }
  return response.json();
}

type BookingInquiryResult = {
  status: string;
  waLink: string;
  inquiry?: { id: number; status: string };
};

export async function createBookingInquiry(input: {
  listingId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  listingTitle?: string;
  totalPrice?: number;
  currency?: string;
  guestName?: string;
  guestPhone?: string;
  message?: string;
}): Promise<BookingInquiryResult> {
  const response = await fetch(`${BACKEND_API}/booking-inquiries`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new AuthRequestError(
      parseAuthApiError(payload, response.status, response.status === 403 ? "login" : undefined),
    );
  }
  return payload as BookingInquiryResult;
}
