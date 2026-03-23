import type { TabletLanguageCode, TabletOrderingSettings } from '@/types';

type JsonRecord = Record<string, unknown>;

const DEFAULT_LANGUAGE: TabletLanguageCode = 'en';

export const TABLET_LANGUAGE_OPTIONS: Array<{
  code: TabletLanguageCode;
  label: string;
  nativeLabel: string;
}> = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
];

export const TABLET_LANGUAGE_LABELS: Record<TabletLanguageCode, string> = {
  en: 'English',
  hi: 'हिन्दी',
};

export const DEFAULT_OUTLET_SETTINGS: TabletOrderingSettings = {
  taxRate: 5,
  serviceCharge: 0,
  printReceiptAutomatically: true,
  enableKDS: true,
  enableOnlineOrders: false,
  enableTabletOrdering: false,
  enableQrOrdering: false,
  defaultTabletLanguage: DEFAULT_LANGUAGE,
};

const toRecord = (value: unknown): JsonRecord =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? { ...(value as JsonRecord) }
    : {};

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value: unknown, fallback: boolean) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  return fallback;
};

export function normalizeTabletLanguage(value: unknown): TabletLanguageCode {
  return value === 'hi' ? 'hi' : DEFAULT_LANGUAGE;
}

export function normalizeOutletSettings(
  value: unknown,
): JsonRecord & TabletOrderingSettings {
  const current = toRecord(value);

  return {
    ...current,
    taxRate: toNumber(current.taxRate, DEFAULT_OUTLET_SETTINGS.taxRate),
    serviceCharge: toNumber(current.serviceCharge, DEFAULT_OUTLET_SETTINGS.serviceCharge),
    printReceiptAutomatically: toBoolean(
      current.printReceiptAutomatically,
      DEFAULT_OUTLET_SETTINGS.printReceiptAutomatically,
    ),
    enableKDS: toBoolean(current.enableKDS, DEFAULT_OUTLET_SETTINGS.enableKDS),
    enableOnlineOrders: toBoolean(
      current.enableOnlineOrders,
      DEFAULT_OUTLET_SETTINGS.enableOnlineOrders,
    ),
    enableTabletOrdering: toBoolean(
      current.enableTabletOrdering,
      DEFAULT_OUTLET_SETTINGS.enableTabletOrdering,
    ),
    enableQrOrdering: toBoolean(
      current.enableQrOrdering,
      DEFAULT_OUTLET_SETTINGS.enableQrOrdering,
    ),
    defaultTabletLanguage: normalizeTabletLanguage(current.defaultTabletLanguage),
  };
}

export function mergeOutletSettings(current: unknown, updates: unknown) {
  return normalizeOutletSettings({
    ...toRecord(current),
    ...toRecord(updates),
  });
}

export function isTabletOrderingEnabled(value: unknown) {
  const settings = normalizeOutletSettings(value);
  return settings.enableTabletOrdering || settings.enableQrOrdering;
}

export function getTabletOrderingHref(tableId: string) {
  return `/tablet/${encodeURIComponent(tableId)}`;
}
