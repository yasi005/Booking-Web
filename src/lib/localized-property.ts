import type { Locale } from "@/i18n";
import { getDictionary } from "@/i18n";
import type { Property, PropertyLocalizedContent, RoomCategory } from "@/types/property";

export function getLocalizedContent(
  property: Property,
  locale: Locale,
): PropertyLocalizedContent {
  return property.localized[locale];
}

export function getPropertyName(property: Property, locale: Locale): string {
  return property.localized[locale].name;
}

export function getPropertyTagline(property: Property, locale: Locale): string {
  return property.localized[locale].tagline;
}

export function getPropertyDescription(property: Property, locale: Locale): string {
  return property.localized[locale].description;
}

export function getLocationDisplay(property: Property, locale: Locale): string {
  return property.localized[locale].locationDisplay;
}

export function getRoomLabel(locale: Locale, room: RoomCategory): string {
  return getDictionary(locale).rooms[room];
}
