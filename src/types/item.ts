import type { ApiItem, ApiCategory, ApiLocation, ItemCreateRequest, ItemFilters } from './api'

export interface Photo {
  id: string | number
  url: string
  file?: File
}

export interface Item {
  id: number
  type: string
  title: string
  category_id: number | string
  category: string
  description?: string
  location_id: number | string
  location: string
  campus?: string
  date_lost_found: string
  status: string
  posted_by?: string
  owner_id?: number
  photos?: Photo[]
}

export interface FormValues {
  type: string
  title: string
  category_id: number | string
  description: string
  location_id: number | string
  date_lost_found: string
  photos: Photo[]
}

export interface Filters {
  type: string
  categories: number[]
  campus: string
  locationId: number | string
  dateFrom: string
  dateTo: string
}

// ─── Adapters: Backend ↔ Frontend ────────────────────────────────────────────

/** Convert a backend ApiItem into the UI Item shape. */
export function apiItemToItem(
  apiItem: ApiItem,
  categories: ApiCategory[],
  locations: ApiLocation[],
): Item {
  const cat = categories.find((c) => c.id === apiItem.category);
  const loc = locations.find((l) => l.id === apiItem.location);

  return {
    id: apiItem.id,
    type: apiItem.item_type,
    title: apiItem.title,
    category_id: apiItem.category,
    category: cat?.name ?? `Category #${apiItem.category}`,
    description: apiItem.description,
    location_id: apiItem.location,
    location: loc?.name ?? `Location #${apiItem.location}`,
    campus: loc?.campus ?? undefined,
    date_lost_found:
      apiItem.item_type === 'lost'
        ? (apiItem.lost_at ?? apiItem.created_at)
        : (apiItem.found_at ?? apiItem.created_at),
    status: apiItem.status,
    owner_id: apiItem.owner,
    photos: [],
  };
}

/** Convert the UI FormValues into a backend ItemCreateRequest. */
export function formValuesToCreateRequest(form: FormValues): ItemCreateRequest {
  const itemType = form.type as 'lost' | 'found';
  return {
    title: form.title,
    description: form.description,
    item_type: itemType,
    category: Number(form.category_id),
    location: Number(form.location_id),
    lost_at: itemType === 'lost' ? form.date_lost_found : null,
    found_at: itemType === 'found' ? form.date_lost_found : null,
  };
}

/** Convert UI Filters into backend query parameters. */
export function filtersToApiParams(filters: Filters, searchQuery?: string): ItemFilters {
  const params: ItemFilters = {};
  if (filters.type) params.item_type = filters.type as 'lost' | 'found';
  if (filters.categories.length === 1) params.category = filters.categories[0];
  if (filters.locationId) params.location = Number(filters.locationId);
  if (filters.dateFrom) {
    params.lost_at_after = filters.dateFrom;
    params.found_at_after = filters.dateFrom;
  }
  if (filters.dateTo) {
    params.lost_at_before = filters.dateTo;
    params.found_at_before = filters.dateTo;
  }
  if (searchQuery) params.queryset = searchQuery;
  return params;
}
