import type { FloorPlanRoom, PropertyGalleryImage, RoomCategory } from "@/types/property";

const ROOM_PATTERNS: Array<{ category: RoomCategory; patterns: RegExp[] }> = [
  {
    category: "bedroom",
    patterns: [/bed(room)?/i, /loft/i, /υπνοδωμάτι/i, /κρεβατι/i],
  },
  {
    category: "bathroom",
    patterns: [/bath(room)?/i, /shower/i, /wc/i, /μπάνι/i, /λουτρ/i],
  },
  {
    category: "kitchen",
    patterns: [/kitchen/i, /κουζίν/i, /cook/i],
  },
  {
    category: "living",
    patterns: [/living/i, /lounge/i, /salon/i, /σαλόνι/i, /sitting/i],
  },
  {
    category: "dining",
    patterns: [/dining/i, /τραπεζ/i, /table/i],
  },
  {
    category: "exterior",
    patterns: [
      /exterior/i,
      /balcony/i,
      /terrace/i,
      /view/i,
      /facade/i,
      /outdoor/i,
      /veranda/i,
      /αυλή/i,
      /μπαλκόν/i,
    ],
  },
];

export function inferRoomCategory(caption: string | undefined): RoomCategory {
  if (!caption) return "other";

  for (const { category, patterns } of ROOM_PATTERNS) {
    if (patterns.some((pattern) => pattern.test(caption))) {
      return category;
    }
  }

  return "other";
}

export function buildGalleryImages(
  images: Array<{ url: string; caption?: string }>,
): PropertyGalleryImage[] {
  return images.map((image, index) => ({
    id: `img-${index}`,
    url: image.url,
    caption: image.caption,
    room: inferRoomCategory(image.caption),
  }));
}

export function groupGalleryByRoom(
  images: PropertyGalleryImage[],
): Array<{ room: RoomCategory; images: PropertyGalleryImage[] }> {
  const order: RoomCategory[] = [
    "living",
    "bedroom",
    "kitchen",
    "dining",
    "bathroom",
    "exterior",
    "other",
  ];

  const buckets = new Map<RoomCategory, PropertyGalleryImage[]>();
  for (const image of images) {
    const list = buckets.get(image.room) ?? [];
    list.push(image);
    buckets.set(image.room, list);
  }

  return order
    .filter((room) => buckets.has(room))
    .map((room) => ({ room, images: buckets.get(room)! }));
}

const ROOM_LAYOUT: Record<
  RoomCategory,
  { id: string; path: string; mapHotspot: { x: number; y: number }; imageFocus: { x: number; y: number; scale: number } }
> = {
  living: {
    id: "living-room",
    path: "M 24 80 L 96 80 L 96 128 L 24 128 Z",
    mapHotspot: { x: 48, y: 58 },
    imageFocus: { x: 42, y: 58, scale: 1.28 },
  },
  bedroom: {
    id: "bedroom",
    path: "M 24 28 L 88 28 L 88 72 L 24 72 Z",
    mapHotspot: { x: 54, y: 38 },
    imageFocus: { x: 32, y: 38, scale: 1.35 },
  },
  kitchen: {
    id: "kitchen",
    path: "M 100 80 L 168 80 L 168 128 L 100 128 Z",
    mapHotspot: { x: 62, y: 62 },
    imageFocus: { x: 58, y: 68, scale: 1.32 },
  },
  dining: {
    id: "dining-room",
    path: "M 100 28 L 168 28 L 168 72 L 100 72 Z",
    mapHotspot: { x: 62, y: 38 },
    imageFocus: { x: 65, y: 42, scale: 1.3 },
  },
  bathroom: {
    id: "bathroom",
    path: "M 112 108 L 168 108 L 168 148 L 112 148 Z",
    mapHotspot: { x: 58, y: 44 },
    imageFocus: { x: 48, y: 72, scale: 1.4 },
  },
  exterior: {
    id: "exterior",
    path: "M 100 52 L 168 52 L 168 92 L 100 92 Z",
    mapHotspot: { x: 62, y: 48 },
    imageFocus: { x: 72, y: 48, scale: 1.3 },
  },
  other: {
    id: "gallery",
    path: "M 24 52 L 88 52 L 88 92 L 24 92 Z",
    mapHotspot: { x: 48, y: 48 },
    imageFocus: { x: 50, y: 50, scale: 1.2 },
  },
};

export function buildFloorPlanFromGallery(
  images: PropertyGalleryImage[],
  roomLabel: (room: RoomCategory) => string,
): FloorPlanRoom[] {
  const rooms = groupGalleryByRoom(images).map(({ room }) => {
    const layout = ROOM_LAYOUT[room];
    return {
      id: layout.id,
      label: roomLabel(room),
      floor: 1 as const,
      path: layout.path,
      mapHotspot: layout.mapHotspot,
      imageFocus: layout.imageFocus,
      galleryRoom: room,
    };
  });

  return rooms.length > 0 ? rooms : [];
}

export function getGalleryImageForRoom(
  images: PropertyGalleryImage[],
  room: RoomCategory,
): PropertyGalleryImage | undefined {
  return images.find((image) => image.room === room) ?? images[0];
}
