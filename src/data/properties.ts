import type { Property, PropertyType } from "@/types/property";

const floorPlanRooms = [
  {
    id: "master-suite",
    label: "Master Suite",
    floor: 1 as const,
    path: "M 24 28 L 88 28 L 88 72 L 24 72 Z",
    mapHotspot: { x: 54, y: 38 },
    imageFocus: { x: 32, y: 38, scale: 1.35 },
  },
  {
    id: "infinity-deck",
    label: "Pool Deck",
    floor: 1 as const,
    path: "M 100 52 L 168 52 L 168 92 L 100 92 Z",
    mapHotspot: { x: 62, y: 48 },
    imageFocus: { x: 72, y: 48, scale: 1.3 },
  },
  {
    id: "living-room",
    label: "Living Room",
    floor: 1 as const,
    path: "M 24 80 L 96 80 L 96 128 L 24 128 Z",
    mapHotspot: { x: 48, y: 58 },
    imageFocus: { x: 42, y: 58, scale: 1.28 },
  },
  {
    id: "dining-room",
    label: "Dining Room",
    floor: 1 as const,
    path: "M 100 80 L 168 80 L 168 128 L 100 128 Z",
    mapHotspot: { x: 62, y: 62 },
    imageFocus: { x: 58, y: 68, scale: 1.32 },
  },
  {
    id: "wine-cellar",
    label: "Wine Cellar",
    floor: 2 as const,
    path: "M 112 108 L 168 108 L 168 148 L 112 148 Z",
    mapHotspot: { x: 58, y: 44 },
    imageFocus: { x: 48, y: 72, scale: 1.4 },
  },
];

const greekAgent = {
  name: "Alexandra Papadopoulou",
  title: "Luxury Estate Advisor · Athens",
  phone: "+30 210 555 0192",
  image:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
};

type PropertySeed = {
  id: string;
  name: string;
  neighborhood: string;
  tagline: string;
  description: string;
  rating: number;
  reviewCount: number;
  rent: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  previewImage?: string;
  propertyType: PropertyType;
  amenities: string[];
  vipAmenities: Property["vipAmenities"];
  peakRate: number;
  shoulderRate: number;
  quietRate: number;
  coordinates: { lat: number; lng: number };
  host: Property["host"];
};

function athensProperty(seed: PropertySeed): Property {
  const locationDisplay = `${seed.neighborhood.toUpperCase()}, ATHENS`;
  return {
    id: seed.id,
    name: seed.name,
    location: `${seed.neighborhood}, Athens, Greece`,
    locationDisplay,
    tagline: seed.tagline,
    description: seed.description,
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    rent: seed.rent,
    beds: seed.beds,
    baths: seed.baths,
    sqft: seed.sqft,
    image: seed.image,
    previewImage: seed.previewImage,
    amenities: seed.amenities,
    propertyType: seed.propertyType,
    vipAmenities: seed.vipAmenities,
    seasonalPricing: [
      {
        season: "Peak High Season",
        badge: "Peak",
        timeframe: "June – August / Easter Week",
        rate: seed.peakRate,
      },
      {
        season: "Shoulder Season",
        badge: "Shoulder",
        timeframe: "April – May / Sept – Oct",
        rate: seed.shoulderRate,
      },
      {
        season: "Quiet Low Season",
        badge: "Quiet",
        timeframe: "Nov – March",
        rate: seed.quietRate,
      },
    ],
    floorPlanRooms,
    coordinates: seed.coordinates,
    priceHistory: [
      { year: "2019", value: Math.round(seed.rent * 0.72) },
      { year: "2020", value: Math.round(seed.rent * 0.76) },
      { year: "2021", value: Math.round(seed.rent * 0.82) },
      { year: "2022", value: Math.round(seed.rent * 0.88) },
      { year: "2023", value: Math.round(seed.rent * 0.93) },
      { year: "2024", value: Math.round(seed.rent * 0.97) },
      { year: "2025", value: seed.rent },
    ],
    agent: greekAgent,
    host: seed.host,
  };
}

const propertySeeds: PropertySeed[] = [
  {
    id: "midnight-ocean-villa",
    name: "Acropolis Sky Penthouse",
    neighborhood: "Kolonaki",
    tagline: "Panoramic Parthenon views from a glass-wrapped penthouse.",
    description:
      "Suspended above Kolonaki's tree-lined boulevards, this penthouse frames the Acropolis from every room. Marble floors, bespoke oak joinery, and a wraparound terrace make Athens feel like a private gallery of light.",
    rating: 4.98,
    reviewCount: 142,
    rent: 4500,
    beds: 4,
    baths: 3,
    sqft: 1589,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    previewImage:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    propertyType: "open-concept-villa",
    amenities: ["Acropolis View", "Rooftop Terrace", "Smart Home", "Wine Cellar"],
    vipAmenities: { infinityPool: true, privateHelipad: false, automatedConcierge: true },
    peakRate: 5200,
    shoulderRate: 4500,
    quietRate: 3800,
    coordinates: { lat: 37.9778, lng: 23.743 },
    host: {
      name: "Emily Johnson",
      title: "Bespoke Luxury Host",
      rating: 4.96,
      reviewCount: 120,
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "alpine-glass-retreat",
    name: "Plaka Heritage Maison",
    neighborhood: "Plaka",
    tagline: "Restored neoclassical elegance beneath the sacred rock.",
    description:
      "A meticulously restored maison in Plaka's pedestrian lanes, where original stone arches meet contemporary glass additions. Wake to church bells and golden hour light on the Acropolis slope.",
    rating: 4.92,
    reviewCount: 87,
    rent: 3800,
    beds: 3,
    baths: 2,
    sqft: 1240,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    propertyType: "boutique-estate",
    amenities: ["Historic Courtyard", "Sauna", "Fireplace"],
    vipAmenities: { infinityPool: false, privateHelipad: false, automatedConcierge: true },
    peakRate: 4400,
    shoulderRate: 3800,
    quietRate: 3200,
    coordinates: { lat: 37.9715, lng: 23.7267 },
    host: {
      name: "Marco Bellini",
      title: "Bespoke Luxury Host",
      rating: 4.94,
      reviewCount: 86,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "terrace-du-lac",
    name: "Aegean Riviera Villa",
    neighborhood: "Vouliagmeni",
    tagline: "Coastal terraces cascading toward the Saronic Gulf.",
    description:
      "Terraced gardens descend toward Vouliagmeni's crystalline cove, with an infinity pool that merges into sea and sky. Interiors are washed in Aegean light, each salon opening to a private waterfront deck.",
    rating: 4.99,
    reviewCount: 203,
    rent: 5200,
    beds: 5,
    baths: 4,
    sqft: 2100,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    propertyType: "beachfront",
    amenities: ["Sea Access", "Private Dock", "Chef's Kitchen"],
    vipAmenities: { infinityPool: true, privateHelipad: true, automatedConcierge: true },
    peakRate: 6200,
    shoulderRate: 5200,
    quietRate: 4200,
    coordinates: { lat: 37.848, lng: 23.786 },
    host: {
      name: "Sofia Laurent",
      title: "Bespoke Luxury Host",
      rating: 4.97,
      reviewCount: 156,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "kolonaki-glass-residence",
    name: "Kolonaki Glass Residence",
    neighborhood: "Kolonaki",
    tagline: "Minimalist glass volume above Athens' most coveted square.",
    description:
      "A sharp contemporary residence with floor-to-ceiling glazing, hidden pocket doors, and a private elevator. Steps from designer boutiques and the city's finest dining.",
    rating: 4.95,
    reviewCount: 64,
    rent: 4100,
    beds: 3,
    baths: 3,
    sqft: 1450,
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80",
    propertyType: "open-concept-villa",
    amenities: ["City Views", "Private Elevator", "Smart Home"],
    vipAmenities: { infinityPool: false, privateHelipad: false, automatedConcierge: true },
    peakRate: 4800,
    shoulderRate: 4100,
    quietRate: 3400,
    coordinates: { lat: 37.9795, lng: 23.7412 },
    host: {
      name: "Nikos Papadakis",
      title: "Athens Luxury Host",
      rating: 4.93,
      reviewCount: 71,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "glyfada-coastal-estate",
    name: "Glyfada Coastal Estate",
    neighborhood: "Glyfada",
    tagline: "Palm-lined promenade living on the Athens Riviera.",
    description:
      "Directly above Glyfada's marina district, this estate pairs indoor-outdoor living with a saltwater pool and alfresco dining pavilion facing the Saronic horizon.",
    rating: 4.91,
    reviewCount: 112,
    rent: 3600,
    beds: 4,
    baths: 3,
    sqft: 1680,
    image:
      "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1600&q=80",
    propertyType: "beachfront",
    amenities: ["Marina Views", "Saltwater Pool", "Outdoor Kitchen"],
    vipAmenities: { infinityPool: true, privateHelipad: false, automatedConcierge: false },
    peakRate: 4200,
    shoulderRate: 3600,
    quietRate: 2900,
    coordinates: { lat: 37.8614, lng: 23.7538 },
    host: {
      name: "Elena Konstantinou",
      title: "Riviera Host",
      rating: 4.92,
      reviewCount: 98,
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "kifisia-estate-gardens",
    name: "Kifisia Estate Gardens",
    neighborhood: "Kifisia",
    tagline: "North Athens estate wrapped in pine and manicured gardens.",
    description:
      "Set in Kifisia's quiet embassy quarter, this boutique estate offers vaulted ceilings, a library wing, and terraced gardens shaded by century-old pines.",
    rating: 4.97,
    reviewCount: 55,
    rent: 4800,
    beds: 5,
    baths: 4,
    sqft: 2400,
    image:
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1600&q=80",
    propertyType: "boutique-estate",
    amenities: ["Garden Terrace", "Library", "EV Charging"],
    vipAmenities: { infinityPool: false, privateHelipad: true, automatedConcierge: true },
    peakRate: 5600,
    shoulderRate: 4800,
    quietRate: 3900,
    coordinates: { lat: 38.0743, lng: 23.811 },
    host: {
      name: "Maria Theodorou",
      title: "Estate Curator",
      rating: 4.98,
      reviewCount: 44,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "pangrati-loft-villa",
    name: "Pangrati Loft Villa",
    neighborhood: "Pangrati",
    tagline: "Double-height loft living beside the Panathenaic Stadium.",
    description:
      "An open-concept loft with steel beams, polished concrete, and a rooftop plunge pool overlooking the marble stadium. Creative district energy meets refined finishes.",
    rating: 4.89,
    reviewCount: 73,
    rent: 3200,
    beds: 3,
    baths: 2,
    sqft: 1320,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    propertyType: "open-concept-villa",
    amenities: ["Stadium View", "Rooftop Pool", "Art Collection"],
    vipAmenities: { infinityPool: true, privateHelipad: false, automatedConcierge: false },
    peakRate: 3800,
    shoulderRate: 3200,
    quietRate: 2600,
    coordinates: { lat: 37.968, lng: 23.748 },
    host: {
      name: "Yannis Stavrou",
      title: "Urban Host",
      rating: 4.9,
      reviewCount: 62,
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "psychiko-hill-villa",
    name: "Psychiko Hill Villa",
    neighborhood: "Psychiko",
    tagline: "Hillside privacy minutes from the city center.",
    description:
      "Cascading levels follow the Psychiko hillside, each floor opening to a different aspect of the city. A private cinema and spa wing complete the retreat.",
    rating: 4.96,
    reviewCount: 48,
    rent: 5500,
    beds: 6,
    baths: 5,
    sqft: 2850,
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80",
    propertyType: "open-concept-villa",
    amenities: ["Private Cinema", "Spa Wing", "Hillside Views"],
    vipAmenities: { infinityPool: true, privateHelipad: true, automatedConcierge: true },
    peakRate: 6500,
    shoulderRate: 5500,
    quietRate: 4400,
    coordinates: { lat: 38.013, lng: 23.772 },
    host: {
      name: "Christina Alexiou",
      title: "Luxury Host",
      rating: 4.97,
      reviewCount: 39,
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "filothei-modern-villa",
    name: "Filothei Modern Villa",
    neighborhood: "Filothei",
    tagline: "Contemporary lines in Athens' most exclusive suburb.",
    description:
      "Clean geometry and a neutral palette define this Filothei villa, anchored by a central courtyard pool and seamless indoor-outdoor entertaining spaces.",
    rating: 4.94,
    reviewCount: 61,
    rent: 4700,
    beds: 4,
    baths: 4,
    sqft: 1980,
    image:
      "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1600&q=80",
    propertyType: "open-concept-villa",
    amenities: ["Courtyard Pool", "Home Office", "Smart Home"],
    vipAmenities: { infinityPool: true, privateHelipad: false, automatedConcierge: true },
    peakRate: 5400,
    shoulderRate: 4700,
    quietRate: 3800,
    coordinates: { lat: 38.015, lng: 23.782 },
    host: {
      name: "Dimitris Vasilakis",
      title: "Luxury Host",
      rating: 4.95,
      reviewCount: 53,
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "syntagma-executive-suite",
    name: "Syntagma Executive Suite",
    neighborhood: "Syntagma",
    tagline: "Commanding views over Syntagma Square and the Parliament.",
    description:
      "A polished executive suite for discerning short stays, with a formal dining room, concierge pantry, and floor-to-ceiling windows over Athens' ceremonial heart.",
    rating: 4.88,
    reviewCount: 94,
    rent: 2900,
    beds: 2,
    baths: 2,
    sqft: 980,
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
    propertyType: "boutique-estate",
    amenities: ["Square Views", "Concierge Pantry", "Valet Parking"],
    vipAmenities: { infinityPool: false, privateHelipad: false, automatedConcierge: true },
    peakRate: 3400,
    shoulderRate: 2900,
    quietRate: 2400,
    coordinates: { lat: 37.9755, lng: 23.7348 },
    host: {
      name: "Anna Georgiou",
      title: "Executive Host",
      rating: 4.91,
      reviewCount: 88,
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "monastiraki-stone-house",
    name: "Monastiraki Stone House",
    neighborhood: "Monastiraki",
    tagline: "Centuries-old stone walls, modern rooftop sanctuary.",
    description:
      "Built into Monastiraki's ancient fabric, this stone house preserves original masonry while adding a glass rooftop lounge with 360° views from the Agora to Lycabettus.",
    rating: 4.93,
    reviewCount: 118,
    rent: 3400,
    beds: 3,
    baths: 2,
    sqft: 1180,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
    propertyType: "boutique-estate",
    amenities: ["Rooftop Lounge", "Historic Stone", "Market Access"],
    vipAmenities: { infinityPool: false, privateHelipad: false, automatedConcierge: false },
    peakRate: 4000,
    shoulderRate: 3400,
    quietRate: 2800,
    coordinates: { lat: 37.9755, lng: 23.725 },
    host: {
      name: "Petros Nikolaou",
      title: "Heritage Host",
      rating: 4.94,
      reviewCount: 102,
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "ekali-country-estate",
    name: "Ekali Country Estate",
    neighborhood: "Ekali",
    tagline: "Forest-edge estate with total seclusion above the city.",
    description:
      "Ekali's pine forests wrap this country estate in silence. Expansive lawns, a tennis court, and a heated pool make it ideal for extended stays away from the bustle.",
    rating: 4.98,
    reviewCount: 37,
    rent: 5900,
    beds: 6,
    baths: 5,
    sqft: 3200,
    image:
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?auto=format&fit=crop&w=1600&q=80",
    propertyType: "boutique-estate",
    amenities: ["Tennis Court", "Heated Pool", "Forest Views"],
    vipAmenities: { infinityPool: true, privateHelipad: true, automatedConcierge: true },
    peakRate: 6800,
    shoulderRate: 5900,
    quietRate: 4800,
    coordinates: { lat: 38.108, lng: 23.835 },
    host: {
      name: "Irini Mavridou",
      title: "Estate Host",
      rating: 4.99,
      reviewCount: 31,
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    },
  },
  {
    id: "piraeus-marina-residence",
    name: "Piraeus Marina Residence",
    neighborhood: "Piraeus",
    tagline: "Yacht-side living at the gateway to the Greek islands.",
    description:
      "Overlooking Piraeus' luxury marina, this residence offers direct berth views, a sunset terrace, and quick access to ferry routes toward the Cyclades.",
    rating: 4.9,
    reviewCount: 89,
    rent: 3700,
    beds: 4,
    baths: 3,
    sqft: 1520,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    propertyType: "beachfront",
    amenities: ["Marina Berth View", "Sunset Terrace", "Island Access"],
    vipAmenities: { infinityPool: false, privateHelipad: false, automatedConcierge: true },
    peakRate: 4300,
    shoulderRate: 3700,
    quietRate: 3000,
    coordinates: { lat: 37.947, lng: 23.645 },
    host: {
      name: "Stavros Marinakis",
      title: "Marina Host",
      rating: 4.92,
      reviewCount: 77,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
  },
];

export const properties: Property[] = propertySeeds.map(athensProperty);

export const featuredProperty = properties[0];

export function getPropertyById(id: string) {
  return properties.find((property) => property.id === id);
}
