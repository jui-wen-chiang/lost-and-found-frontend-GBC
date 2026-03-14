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
