// ─── User ────────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: number;
  email: string;
  full_name: string;
  role: 'student' | 'staff' | 'admin';
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: ApiUser;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  role: 'student' | 'staff' | 'admin';
  password: string;
  password_confirm: string;
}

export interface RegisterResponse {
  message: string;
  user: ApiUser;
  tokens: {
    refresh: string;
    access: string;
  };
}

export interface LogoutRequest {
  refresh: string;
}

// ─── Password Reset ──────────────────────────────────────────────────────────

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
  new_password_confirm: string;
}

// ─── Claims ──────────────────────────────────────────────────────────────────

export type ClaimStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface ApiClaim {
  id: number;
  item: number;
  claimant: number;
  message: string;
  status: ClaimStatus;
  created_at: string;
}

export interface ClaimCreateRequest {
  item: number;
  message?: string;
}

// ─── Appointments ────────────────────────────────────────────────────────────

export type AppointmentStatus = 'scheduled' | 'cancelled' | 'completed';

export interface ApiAppointment {
  id: number;
  claim: number;
  location: number | null;
  scheduled_at: string;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}

export interface AppointmentCreateRequest {
  claim: number;
  scheduled_at: string;
}

// ─── Coupons ─────────────────────────────────────────────────────────────────

export interface ApiCoupon {
  id: number;
  code: string;
  is_redeemed: boolean;
  expires_at: string;
}

// ─── Items ───────────────────────────────────────────────────────────────────

export type ItemType = 'lost' | 'found';
export type ItemStatus = 'pending' | 'approved' | 'claimed' | 'completed';

export interface ApiItem {
  id: number;
  title: string;
  description: string;
  item_type: ItemType;
  status: ItemStatus;
  category: number;
  location: number;
  owner: number;
  lost_at: string | null;
  found_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ItemCreateRequest {
  title: string;
  description: string;
  item_type: ItemType;
  category: number;
  location: number;
  lost_at?: string | null;
  found_at?: string | null;
}

export interface ItemUpdateRequest extends Partial<ItemCreateRequest> {}

export interface ItemFilters {
  item_type?: ItemType;
  category?: number;
  location?: number;
  lost_at_after?: string;
  lost_at_before?: string;
  found_at_after?: string;
  found_at_before?: string;
  queryset?: string;
}

// ─── Categories ──────────────────────────────────────────────────────────────

export interface ApiCategory {
  id: number;
  name: string;
  is_active: boolean;
  expires_day: string; // DecimalField serialized as string
  created_at: string;
  updated_at: string;
}

// ─── Locations ───────────────────────────────────────────────────────────────

export interface ApiLocation {
  id: number;
  name: string;
  campus: string | null;
  building: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Reports (Admin) ────────────────────────────────────────────────────────

export interface StatusCount {
  status: string;
  count: number;
}

export interface LocationCount {
  location__name: string;
  count: number;
}

export interface CategoryComparison {
  category__name: string;
  lost_count: number;
  found_count: number;
}

export interface MonthlyTrend {
  month: string;
  count: number;
}

export interface Kpi {
  success_rate: number;
  total_count: number;
}

export interface DashboardStats {
  status: StatusCount[];
  location: LocationCount[];
  category_comparison: CategoryComparison[];
  monthly_trend: MonthlyTrend[];
  kpi: Kpi;
}

export interface UnclaimedItem extends ApiItem {
  expire_at: string;
  days_overdue: number;
}

export interface UnclaimedReport {
  count: number;
  items: UnclaimedItem[];
}
