import {
  buildFloorPlanFromGallery,
  buildGalleryImages,
} from "@/lib/gallery-utils";
import { getRoomLabel } from "@/lib/localized-property";
import type { Property, PropertyType } from "@/types/property";

export type CachedHostawayListing = {
  id: number;
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
  basePrice: number | null;
  currency: string;
  images: Array<{ url: string; caption?: string }>;
  amenities: string[];
  syncedAt?: string;
  published?: boolean;
  source?: string;
  adminEdited?: boolean;
};
const defaultAgent: Property["agent"] = {
  name: "Alexandra Papadopoulou",
  title: "Luxury Estate Advisor · Athens",
  phone: "+30 210 555 0192",
  image:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
};

const defaultHost: Property["host"] = {
  name: "Zeus Suites",
  title: "Hostaway Collection",
  rating: 4.85,
  reviewCount: 48,
  image:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";

function nightlyRate(listing: CachedHostawayListing): number {
  return listing.basePrice ?? 120;
}

function inferPropertyType(listing: CachedHostawayListing): PropertyType {
  const haystack = `${listing.name} ${listing.description}`.toLowerCase();
  if (haystack.includes("beach") || haystack.includes("marina")) return "beachfront";
  if (listing.bedrooms >= 3) return "open-concept-villa";
  return "boutique-estate";
}

function buildEnglishCopy(listing: CachedHostawayListing, neighborhood: string) {
  const tagline =
    listing.description.split("\n")[0]?.slice(0, 120) || listing.name;

  return {
    name: listing.name,
    tagline,
    description: listing.description,
    locationDisplay: `${neighborhood.toUpperCase()}, ATHENS`,
  };
}

function buildGreekCopy(listing: CachedHostawayListing, neighborhood: string) {
  const beds = listing.beds || listing.bedrooms || 1;
  const baths = listing.bathrooms || 1;
  const guests = listing.personCapacity || beds;

  return {
    name: listing.name,
    tagline: `Κατοικία στο ${neighborhood}, κοντά σε μετρό, πλατείες και αξιοθέατα της Αθήνας.`,
    description: [
      `Αυτή η κατοικία βρίσκεται στο ${neighborhood}, μία από τις πιο κεντρικές και κομψές γειτονιές της Αθήνας.`,
      `Χωρά ${guests} άτομα, με ${beds} κρεβάτια και ${baths} μπάνι${baths === 1 ? "ο" : "α"}.`,
      `Διεύθυνση: ${listing.address}, ${listing.city || "Αθήνα"}.`,
      listing.description.split("\n")[0] ?? "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    locationDisplay: `${neighborhood.toUpperCase()}, ΑΘΗΝΑ`,
  };
}

export function mapHostawayListingToProperty(listing: CachedHostawayListing): Property {
  const rate = nightlyRate(listing);
  const neighborhood = listing.name.toLowerCase().includes("kolonaki")
    ? "Kolonaki"
    : listing.city || "Athens";
  const galleryImages = buildGalleryImages(listing.images);
  const image = galleryImages[0]?.url ?? FALLBACK_IMAGE;
  const en = buildEnglishCopy(listing, neighborhood);
  const el = buildGreekCopy(listing, neighborhood);
  const floorPlanRooms = buildFloorPlanFromGallery(galleryImages, (room) =>
    getRoomLabel("en", room),
  );

  return {
    id: String(listing.id),
    name: en.name,
    location: `${neighborhood}, ${listing.city || "Athens"}, ${listing.country || "Greece"}`,
    locationDisplay: en.locationDisplay,
    tagline: en.tagline,
    description: en.description,
    localized: { en, el },
    galleryImages,
    rating: 4.85,
    reviewCount: 32,
    rent: rate,
    beds: listing.beds || listing.bedrooms || 1,
    baths: listing.bathrooms || 1,
    sqft: listing.squareMeters ? Math.round(listing.squareMeters * 10.764) : 900,
    image,
    previewImage: galleryImages[1]?.url ?? image,
    propertyType: inferPropertyType(listing),
    vipAmenities: {
      infinityPool: listing.amenities.some((a) => /pool/i.test(a)),
      privateHelipad: false,
      automatedConcierge: listing.amenities.some((a) => /concierge|smart/i.test(a)),
    },
    amenities: listing.amenities.length ? listing.amenities.slice(0, 6) : ["WiFi", "Air Conditioning"],
    seasonalPricing: [
      {
        season: "Peak High Season",
        badge: "Peak",
        timeframe: "June – August",
        rate: Math.round(rate * 1.25),
      },
      {
        season: "Shoulder Season",
        badge: "Shoulder",
        timeframe: "April – May / Sept – Oct",
        rate,
      },
      {
        season: "Quiet Low Season",
        badge: "Quiet",
        timeframe: "Nov – March",
        rate: Math.round(rate * 0.85),
      },
    ],
    floorPlanRooms,
    coordinates: {
      lat: listing.lat ?? 37.978,
      lng: listing.lng ?? 23.742,
    },
    priceHistory: [
      { year: "2023", value: Math.round(rate * 0.9) },
      { year: "2024", value: Math.round(rate * 0.95) },
      { year: "2025", value: rate },
    ],
    agent: defaultAgent,
    host: defaultHost,
  };
}

export function isKolonakiListing(listing: CachedHostawayListing): boolean {
  const haystack = `${listing.name} ${listing.address} ${listing.city} ${listing.description}`.toLowerCase();
  return haystack.includes("kolonaki");
}
