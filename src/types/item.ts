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
    date_lost_found: (() => {
      const raw = apiItem.item_type === 'lost'
        ? (apiItem.lost_at ?? apiItem.created_at)
        : (apiItem.found_at ?? apiItem.created_at);
      return raw ? raw.slice(0, 10) : '';
    })(),
    status: apiItem.status,
    owner_id: apiItem.owner,
    // photos: (apiItem.images ?? []).map((img) => ({
    //   id: img.id,
    //   // url: img.url,
    //   url: `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/media/${img.file_path}`,
    // })),
    photos: (apiItem.images ?? []).map((img) => {
      console.log('[image]', img)  // ← 印出每張圖片的完整資料
      return {
        id: img.id,
        url: img.url,
        // url: `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/media/${img.file_path}`,
      }
    }),
  };
}

/** Convert the UI FormValues into a backend ItemCreateRequest. */
export function formValuesToCreateRequest(form: FormValues): ItemCreateRequest {
  const itemType = form.type as 'lost' | 'found';
  const req: ItemCreateRequest = {
    title: form.title,
    description: form.description,
    item_type: itemType,
    category: Number(form.category_id),
    location: Number(form.location_id),
    lost_at: itemType === 'lost' ? form.date_lost_found : null,
    found_at: itemType === 'found' ? form.date_lost_found : null,
  };
  const files = form.photos.filter((p) => p.file).map((p) => p.file as File);
  if (files.length > 0) {
    req.upload_images = files;
  }
  const existingIds = form.photos
    .filter((p) => !p.file && typeof p.id === 'number')
    .map((p) => p.id as number);
  req.existing_image_ids = existingIds;
  return req;
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
