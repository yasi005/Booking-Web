import type { Property } from "@/types/property";

const loadingEn = {
  name: "Loading Kolonaki Collection",
  tagline: "Fetching live listings from Hostaway…",
  description: "",
  locationDisplay: "KOLONAKI, ATHENS",
};

const loadingEl = {
  name: "Φόρτωση Συλλογής Κολωνακίου",
  tagline: "Λήψη καταχωρήσεων από το Hostaway…",
  description: "",
  locationDisplay: "ΚΟΛΩΝΑΚΙ, ΑΘΗΝΑ",
};

export const PLACEHOLDER_PROPERTY: Property = {
  id: "loading",
  name: loadingEn.name,
  location: "Kolonaki, Athens, Greece",
  locationDisplay: loadingEn.locationDisplay,
  tagline: loadingEn.tagline,
  description: loadingEn.description,
  localized: {
    en: loadingEn,
    el: loadingEl,
  },
  galleryImages: [],
  rating: 0,
  reviewCount: 0,
  rent: 0,
  beds: 0,
  baths: 0,
  sqft: 0,
  image:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  propertyType: "boutique-estate",
  vipAmenities: {
    infinityPool: false,
    privateHelipad: false,
    automatedConcierge: false,
  },
  amenities: [],
  seasonalPricing: [],
  floorPlanRooms: [],
  coordinates: { lat: 37.978, lng: 23.742 },
  priceHistory: [],
  agent: {
    name: "Alexandra Papadopoulou",
    title: "Luxury Estate Advisor · Athens",
    phone: "+30 210 555 0192",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  },
  host: {
    name: "Zeus Suites",
    title: "Hostaway Collection",
    rating: 4.85,
    reviewCount: 0,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
};
