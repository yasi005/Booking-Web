import type { CachedHostawayListing } from "@/lib/hostaway-mapper";
import { AuthRequestError, parseAuthApiError } from "@/lib/auth-errors";

const ADMIN_API = "/backend/api/admin";

export type AdminListing = CachedHostawayListing & {
  published?: boolean;
  source?: "hostaway" | "local";
  adminEdited?: boolean;
  updatedAt?: string;
};

export type AdminListingInput = {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
  personCapacity: number;
  bedrooms: number;
  bathrooms: number;
  beds: number;
  squareMeters: number | null;
  basePrice: number;
  currency: string;
  published: boolean;
  images: Array<{ url: string; caption?: string }>;
  amenities: string[];
};

export type AdminStats = {
  total: number;
  published: number;
  lastSyncedAt: string | null;
};

export type AdminUser = {
  id: number;
  username: string;
  email: string | null;
  name: string | null;
  isVerified: boolean;
  accountStatus: string;
  createdAt: string | null;
  isAdmin: boolean;
};

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${ADMIN_API}${path}`;
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("UNAUTHORIZED");
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(payload?.detail ?? `Admin request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function loginAdminStaff(
  username: string,
  password: string,
): Promise<{ username: string }> {
  const response = await fetch(`${ADMIN_API}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new AuthRequestError(parseAuthApiError(payload, response.status, "admin"));
  }

  return (await response.json()) as { username: string };
}

export async function fetchAdminSession(): Promise<{ username: string } | null> {
  const response = await fetch(`${ADMIN_API}/me`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (response.status === 401 || response.status === 403 || response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { detail?: string } | null;
    throw new Error(payload?.detail ?? `Admin request failed (${response.status})`);
  }

  return (await response.json()) as { username: string };
}

export async function fetchAdminStats(): Promise<AdminStats> {
  return adminFetch<AdminStats>("/stats");
}

export async function fetchAdminListings(): Promise<AdminListing[]> {
  const payload = await adminFetch<{ listings: AdminListing[] }>("/listings");
  return payload.listings;
}

export async function fetchAdminListing(id: number): Promise<AdminListing> {
  return adminFetch<AdminListing>(`/listings/${id}`);
}

export async function createAdminListing(input: AdminListingInput): Promise<AdminListing> {
  return adminFetch<AdminListing>("/listings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateAdminListing(
  id: number,
  input: AdminListingInput,
): Promise<AdminListing> {
  return adminFetch<AdminListing>(`/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export async function deleteAdminListing(id: number): Promise<void> {
  await adminFetch(`/listings/${id}`, { method: "DELETE" });
}

export async function syncAdminListings(): Promise<{ count: number; syncedAt: string }> {
  return adminFetch<{ count: number; syncedAt: string }>("/sync", { method: "POST" });
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const payload = await adminFetch<{ users: AdminUser[] }>("/users");
  return payload.users;
}

export async function deleteAdminUser(id: number): Promise<void> {
  await adminFetch(`/users/${id}`, { method: "DELETE" });
}

export function listingToFormValues(listing?: AdminListing): AdminListingInput {
  return {
    name: listing?.name ?? "",
    description: listing?.description ?? "",
    address: listing?.address ?? "",
    city: listing?.city ?? "Athina",
    country: listing?.country ?? "Greece",
    lat: listing?.lat ?? null,
    lng: listing?.lng ?? null,
    personCapacity: listing?.personCapacity ?? 2,
    bedrooms: listing?.bedrooms ?? 1,
    bathrooms: listing?.bathrooms ?? 1,
    beds: listing?.beds ?? 1,
    squareMeters: listing?.squareMeters ?? null,
    basePrice: listing?.basePrice ?? 100,
    currency: listing?.currency ?? "USD",
    published: listing?.published ?? true,
    images: listing?.images ?? [],
    amenities: listing?.amenities ?? [],
  };
}
