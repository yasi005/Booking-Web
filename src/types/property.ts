export type PropertyType = "open-concept-villa" | "beachfront" | "boutique-estate";

export type VipAmenities = {
  infinityPool: boolean;
  privateHelipad: boolean;
  automatedConcierge: boolean;
};

export type PropertyHost = {
  name: string;
  title: string;
  rating: number;
  reviewCount: number;
  image: string;
};

export type SeasonalRate = {
  season: string;
  badge: string;
  timeframe: string;
  rate: number;
};

export type FloorPlanRoom = {
  id: string;
  label: string;
  floor: 1 | 2;
  path: string;
  mapHotspot: { x: number; y: number };
  imageFocus: { x: number; y: number; scale: number };
  galleryRoom?: RoomCategory;
};

export type RoomCategory =
  | "living"
  | "bedroom"
  | "kitchen"
  | "dining"
  | "bathroom"
  | "exterior"
  | "other";

export type PropertyGalleryImage = {
  id: string;
  url: string;
  caption?: string;
  room: RoomCategory;
};

export type PropertyLocalizedContent = {
  name: string;
  tagline: string;
  description: string;
  locationDisplay: string;
};

export type Property = {
  id: string;
  name: string;
  location: string;
  locationDisplay: string;
  tagline: string;
  description: string;
  localized: {
    en: PropertyLocalizedContent;
    el: PropertyLocalizedContent;
  };
  galleryImages: PropertyGalleryImage[];
  rating: number;
  reviewCount: number;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  previewImage?: string;
  propertyType: PropertyType;
  vipAmenities: VipAmenities;
  amenities: string[];
  seasonalPricing: SeasonalRate[];
  floorPlanRooms: FloorPlanRoom[];
  coordinates: { lat: number; lng: number };
  priceHistory: Array<{ year: string; value: number }>;
  agent: {
    name: string;
    title: string;
    phone: string;
    image: string;
  };
  host: PropertyHost;
};

export type AmbientVibe = "golden" | "misty" | "midnight";

export type TravelSeason = "spring" | "summer" | "autumn" | "winter";
