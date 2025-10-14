const getDefaultBaseUrl = (): string => {
  // If running in browser, use the current origin
  if (typeof window !== "undefined" && window.location) {
    return window.location.origin;
  }
  // Fallback for non-browser environments (e.g., SSR, tests)
  return "http://localhost:8000";
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getDefaultBaseUrl();

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type Primitive = string | number | boolean | null | undefined;
type QueryValue = Primitive | Primitive[];
export type QueryParams = Record<string, QueryValue>;

export type Status = "pending" | "completed";
export type BloodTestType =
  | "FBC"
  | "EUC"
  | "LFTs"
  | "Lipase"
  | "Troponin"
  | "Coag"
  | "D-dimer"
  | "CRP"
  | "VBG"
  | "Haptoglobin"
  | "LDH"
  | "Group & Hold"
  | "Crossmatch"
  | "Blood Culture"
  | "TFT";
export type ImagingTestType =
  | "X-ray"
  | "CT scan"
  | "MRI scan"
  | "Ultrasound scan"
  | "Echocardiogram";
export type InfectionControlPrecaution =
  | "Airborne"
  | "Droplet"
  | "Contact"
  | "Chemotherapy"
  | "None";
export type FileCategory =
  | "Admission"
  | "Pathology"
  | "Imaging"
  | "Diagnostics"
  | "Lab Results"
  | "Other";
export type Gender = "female" | "male" | "other" | "unspecified";

export type ISODateString = string;

export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  role?: string;
}

export interface AuthToken {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ApprovedFile {
  id: number;
  file_id: string;
  display_name: string;
  page_range?: string | null;
  requires_pagination: boolean;
}

export interface ApprovedFileRequest {
  file_id: string;
  page_range?: string | null;
}

export interface BloodTestRequest {
  id: number;
  patient: Patient;
  user: User;
  test_type: BloodTestType;
  details: string;
  status: Status;
  name: string;
  role: string;
  created_at: ISODateString;
  updated_at: ISODateString;
  approved_files: ApprovedFile[];
}

export interface BloodTestRequestCreate {
  patient: number;
  user: number;
  test_type: BloodTestType;
  details: string;
  status?: Status;
  name: string;
  role: string;
  approved_files?: ApprovedFileRequest[];
}

export interface BloodTestRequestStatusUpdate {
  status: Status;
  approved_files?: ApprovedFileRequest[];
}

export interface ImagingRequest {
  id: number;
  patient: Patient;
  user: User;
  test_type: ImagingTestType;
  details: string;
  infection_control_precautions: InfectionControlPrecaution;
  imaging_focus: string;
  status: Status;
  name: string;
  role: string;
  created_at: ISODateString;
  updated_at: ISODateString;
  approved_files: ApprovedFile[];
}

export interface ImagingRequestCreate {
  patient: number;
  user: number;
  test_type: ImagingTestType;
  details: string;
  infection_control_precautions?: InfectionControlPrecaution;
  imaging_focus?: string;
  status?: Status;
  name: string;
  role: string;
  approved_files?: ApprovedFileRequest[];
}

export interface ImagingRequestStatusUpdate {
  status: Status;
  approved_files?: ApprovedFileRequest[];
}

export interface DischargeSummary {
  id: number;
  created_at: ISODateString;
  updated_at: ISODateString;
  diagnosis: string;
  plan: string;
  free_text?: string;
  name: string;
  role: string;
  patient: number;
  user: number;
}

export interface DischargeSummaryCreate {
  diagnosis: string;
  plan: string;
  free_text?: string;
  name: string;
  role: string;
  patient: number;
}

export interface MedicationOrder {
  id: number;
  created_at: ISODateString;
  updated_at: ISODateString;
  medication_name: string;
  dosage: string;
  instructions: string;
  name: string;
  role: string;
  patient: number;
  user: number;
}

export interface MedicationOrderCreate {
  medication_name: string;
  dosage: string;
  instructions: string;
  name: string;
  role: string;
  patient: number;
}

export interface NoteEntry {
  id: number;
  patient: number;
  user: number;
  name: string;
  role: string;
  content: string;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface NoteCreate {
  patient: number;
  name: string;
  role: string;
  content: string;
}

export interface PatientFile {
  id: string;
  patient: number;
  display_name: string;
  category?: FileCategory;
  file: string;
  requires_pagination: boolean;
  created_at: ISODateString;
}

export interface PatientFileUpload {
  category?: FileCategory;
  file: File | Blob;
  requires_pagination?: boolean;
}

export interface Patient {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  mrn: string;
  ward: string;
  bed: string;
  phone_number?: string;
  created_at: ISODateString;
  updated_at: ISODateString;
  files: PatientFile[];
}

export interface PatientCreate {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  mrn: string;
  ward: string;
  bed: string;
  phone_number?: string;
}

export type PatientUpdate = Partial<PatientCreate>;

export interface BloodPressureRecord {
  id: number;
  patient: number;
  user: number;
  systolic: number;
  diastolic: number;
  created_at: ISODateString;
}

export interface BloodPressureCreate {
  patient: number;
  user: number;
  systolic: number;
  diastolic: number;
}

export interface HeartRateRecord {
  id: number;
  patient: number;
  user: number;
  heart_rate: number;
  created_at: ISODateString;
}

export interface HeartRateCreate {
  patient: number;
  user: number;
  heart_rate: number;
}

export interface BodyTemperatureRecord {
  id: number;
  patient: number;
  user: number;
  temperature: string;
  created_at: ISODateString;
}

export interface BodyTemperatureCreate {
  patient: number;
  user: number;
  temperature: string;
}

export interface RespiratoryRateRecord {
  id: number;
  patient: number;
  user: number;
  respiratory_rate: number;
  created_at: ISODateString;
}

export interface RespiratoryRateCreate {
  patient: number;
  user: number;
  respiratory_rate: number;
}

export interface BloodSugarRecord {
  id: number;
  patient: number;
  user: number;
  sugar_level: string;
  created_at: ISODateString;
}

export interface BloodSugarCreate {
  patient: number;
  user: number;
  sugar_level: string;
}

export interface OxygenSaturationRecord {
  id: number;
  patient: number;
  user: number;
  saturation_percentage: number;
  created_at: ISODateString;
}

export interface OxygenSaturationCreate {
  patient: number;
  user: number;
  saturation_percentage: number;
}

export interface PainScoreRecord {
  id: number;
  patient: number;
  user: number;
  score: number;
  created_at: ISODateString;
}

export interface PainScoreCreate {
  patient: number;
  user: number;
  score: number;
}

export interface GoogleFormLink {
  id: number;
  title: string;
  url: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface ObservationBundle {
  blood_pressures: BloodPressureRecord[];
  heart_rates: HeartRateRecord[];
  body_temperatures: BodyTemperatureRecord[];
  respiratory_rates: RespiratoryRateRecord[];
  blood_sugars: BloodSugarRecord[];
  oxygen_saturations: OxygenSaturationRecord[];
  pain_scores: PainScoreRecord[];
}

export interface ObservationCreateBundle {
  blood_pressure?: BloodPressureCreate;
  heart_rate?: HeartRateCreate;
  body_temperature?: BodyTemperatureCreate;
  respiratory_rate?: RespiratoryRateCreate;
  blood_sugar?: BloodSugarCreate;
  oxygen_saturation?: OxygenSaturationCreate;
  pain_score?: PainScoreCreate;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Special response type for observations list endpoint
// The API returns results as a single ObservationBundle object, not an array
export interface ObservationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ObservationBundle;
}

export type InstructorDashboardSummary = Record<string, unknown>;
export type StatsResponse = Record<string, unknown>;

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(options: { message: string; status: number; details?: unknown }) {
    super(options.message);
    this.name = "ApiError";
    this.status = options.status;
    this.details = options.details;
  }
}

interface RequestOptions<TBody, TResponse> {
  method: HttpMethod;
  body?: TBody;
  headers?: HeadersInit;
  query?: QueryParams;
  signal?: AbortSignal;
  parser?: (response: Response) => Promise<TResponse>;
}

export interface ApiClientV2Options {
  baseUrl?: string;
  fetcher?: typeof fetch;
  defaultHeaders?: HeadersInit;
}

function appendQuery(path: string, query?: QueryParams): string {
  if (!query) return path;
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null) return;
        searchParams.append(key, String(item));
      });
      return;
    }
    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  if (!queryString) return path;
  return `${path}?${queryString}`;
}

function isFormData(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function isBlob(body: unknown): body is Blob {
  return typeof Blob !== "undefined" && body instanceof Blob;
}

export class ApiClientV2 {
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;
  private readonly defaultHeaders: HeadersInit;

  constructor(options: ApiClientV2Options = {}) {
    this.baseUrl = options.baseUrl ?? API_BASE_URL;
    this.fetcher = options.fetcher ?? fetch.bind(globalThis);
    this.defaultHeaders = options.defaultHeaders ?? {};
  }

  private buildUrl(path: string, query?: QueryParams): string {
    const fullPath = appendQuery(path, query);
    return `${this.baseUrl}${fullPath}`;
  }

  private async request<TResponse, TBody = unknown>(
    path: string,
    options: RequestOptions<TBody, TResponse>
  ): Promise<TResponse> {
    const { method, body, headers, query, signal, parser } = options;
    const url = this.buildUrl(path, query);

    const init: RequestInit = {
      method,
      credentials: "include",
      headers: { ...this.defaultHeaders, ...headers },
      signal,
    };

    if (body !== undefined) {
      if (isFormData(body)) {
        // For FormData, let the browser set Content-Type with boundary
        // Do NOT set Content-Type header manually
        init.body = body;
        // Remove Content-Type if it was set in defaultHeaders
        const headers = new Headers(init.headers);
        headers.delete("Content-Type");
        init.headers = headers;
      } else if (isBlob(body)) {
        init.body = body;
      } else if (body instanceof URLSearchParams) {
        init.body = body;
        init.headers = {
          Accept: "application/json",
          ...init.headers,
          "Content-Type": "application/x-www-form-urlencoded",
        };
      } else if (
        typeof body === "string" ||
        body instanceof ArrayBuffer ||
        ArrayBuffer.isView(body)
      ) {
        init.body = body as BodyInit;
      } else {
        init.body = JSON.stringify(body);
        init.headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...init.headers,
        };
      }
    }

    const response = await this.fetcher(url, init);

    if (!response.ok) {
      let details: unknown;
      try {
        const contentType = response.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          details = await response.json();
        } else {
          details = await response.text();
        }
      } catch {
        details = undefined;
      }

      throw new ApiError({
        message: `Request failed with status ${response.status}`,
        status: response.status,
        details,
      });
    }

    if (parser) {
      return parser(response);
    }

    if (response.status === 204) {
      return undefined as TResponse;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as TResponse;
    }

    return (await response.text()) as TResponse;
  }

  auth = {
    login: (credentials: LoginRequest) =>
      this.request<AuthToken>("/api/auth/login/", {
        method: "POST",
        body: credentials,
      }),
    logout: () =>
      this.request<{ message?: string }>("/api/auth/logout/", {
        method: "POST",
      }),
    profile: () =>
      this.request<User>("/api/auth/profile/", {
        method: "GET",
      }),
  };

  instructors = {
    dashboard: () =>
      this.request<InstructorDashboardSummary>("/api/instructors/dashboard/", {
        method: "GET",
      }),
    bloodTestRequests: {
      list: (query?: QueryParams) =>
        this.request<PaginatedResponse<BloodTestRequest>>("/api/instructors/blood-test-requests/", {
          method: "GET",
          query,
        }),
      create: (payload: BloodTestRequestCreate) =>
        this.request<BloodTestRequest>("/api/instructors/blood-test-requests/", {
          method: "POST",
          body: payload,
        }),
      retrieve: (id: number) =>
        this.request<BloodTestRequest>(`/api/instructors/blood-test-requests/${id}/`, {
          method: "GET",
        }),
      update: (id: number, payload: BloodTestRequestCreate) =>
        this.request<BloodTestRequest>(`/api/instructors/blood-test-requests/${id}/`, {
          method: "PUT",
          body: payload,
        }),
      partialUpdate: (id: number, payload: Partial<BloodTestRequestCreate>) =>
        this.request<BloodTestRequest>(`/api/instructors/blood-test-requests/${id}/`, {
          method: "PATCH",
          body: payload,
        }),
      delete: (id: number) =>
        this.request<void>(`/api/instructors/blood-test-requests/${id}/`, { method: "DELETE" }),
      pending: () =>
        this.request<PaginatedResponse<BloodTestRequest>>(
          "/api/instructors/blood-test-requests/pending/",
          { method: "GET" }
        ),
      stats: () =>
        this.request<StatsResponse>("/api/instructors/blood-test-requests/stats/", {
          method: "GET",
        }),
      updateStatus: (id: number, payload: BloodTestRequestStatusUpdate) =>
        this.request<BloodTestRequest>(`/api/instructors/blood-test-requests/${id}/`, {
          method: "PATCH",
          body: payload,
        }),
    },
    imagingRequests: {
      list: (query?: QueryParams) =>
        this.request<PaginatedResponse<ImagingRequest>>("/api/instructors/imaging-requests/", {
          method: "GET",
          query,
        }),
      create: (payload: ImagingRequestCreate) =>
        this.request<ImagingRequest>("/api/instructors/imaging-requests/", {
          method: "POST",
          body: payload,
        }),
      retrieve: (id: number) =>
        this.request<ImagingRequest>(`/api/instructors/imaging-requests/${id}/`, { method: "GET" }),
      update: (id: number, payload: ImagingRequestCreate) =>
        this.request<ImagingRequest>(`/api/instructors/imaging-requests/${id}/`, {
          method: "PUT",
          body: payload,
        }),
      partialUpdate: (id: number, payload: Partial<ImagingRequestCreate>) =>
        this.request<ImagingRequest>(`/api/instructors/imaging-requests/${id}/`, {
          method: "PATCH",
          body: payload,
        }),
      delete: (id: number) =>
        this.request<void>(`/api/instructors/imaging-requests/${id}/`, { method: "DELETE" }),
      pending: () =>
        this.request<PaginatedResponse<ImagingRequest>>(
          "/api/instructors/imaging-requests/pending/",
          { method: "GET" }
        ),
      stats: () =>
        this.request<StatsResponse>("/api/instructors/imaging-requests/stats/", { method: "GET" }),
      updateStatus: (id: number, payload: ImagingRequestStatusUpdate) =>
        this.request<ImagingRequest>(`/api/instructors/imaging-requests/${id}/`, {
          method: "PATCH",
          body: payload,
        }),
    },
  };

  studentGroups = {
    bloodTestRequests: {
      list: (query?: QueryParams) =>
        this.request<PaginatedResponse<BloodTestRequest>>(
          "/api/student-groups/blood-test-requests/",
          { method: "GET", query }
        ),
      create: (payload: BloodTestRequestCreate) =>
        this.request<BloodTestRequest>("/api/student-groups/blood-test-requests/", {
          method: "POST",
          body: payload,
        }),
      retrieve: (id: number) =>
        this.request<BloodTestRequest>(`/api/student-groups/blood-test-requests/${id}/`, {
          method: "GET",
        }),
    },
    dischargeSummaries: {
      list: (query?: QueryParams) =>
        this.request<PaginatedResponse<DischargeSummary>>(
          "/api/student-groups/discharge-summaries/",
          { method: "GET", query }
        ),
      create: (payload: DischargeSummaryCreate) =>
        this.request<DischargeSummary>("/api/student-groups/discharge-summaries/", {
          method: "POST",
          body: payload,
        }),
      retrieve: (id: number) =>
        this.request<DischargeSummary>(`/api/student-groups/discharge-summaries/${id}/`, {
          method: "GET",
        }),
    },
    imagingRequests: {
      list: (query?: QueryParams) =>
        this.request<PaginatedResponse<ImagingRequest>>("/api/student-groups/imaging-requests/", {
          method: "GET",
          query,
        }),
      create: (payload: ImagingRequestCreate) =>
        this.request<ImagingRequest>("/api/student-groups/imaging-requests/", {
          method: "POST",
          body: payload,
        }),
      retrieve: (id: number) =>
        this.request<ImagingRequest>(`/api/student-groups/imaging-requests/${id}/`, {
          method: "GET",
        }),
    },
    medicationOrders: {
      list: (query?: QueryParams) =>
        this.request<PaginatedResponse<MedicationOrder>>("/api/student-groups/medication-orders/", {
          method: "GET",
          query,
        }),
      create: (payload: MedicationOrderCreate) =>
        this.request<MedicationOrder>("/api/student-groups/medication-orders/", {
          method: "POST",
          body: payload,
        }),
      retrieve: (id: number) =>
        this.request<MedicationOrder>(`/api/student-groups/medication-orders/${id}/`, {
          method: "GET",
        }),
    },
    notes: {
      list: (query?: QueryParams) =>
        this.request<PaginatedResponse<NoteEntry>>("/api/student-groups/notes/", {
          method: "GET",
          query,
        }),
      create: (payload: NoteCreate) =>
        this.request<NoteEntry>("/api/student-groups/notes/", {
          method: "POST",
          body: payload,
        }),
      retrieve: (id: number) =>
        this.request<NoteEntry>(`/api/student-groups/notes/${id}/`, { method: "GET" }),
      update: (id: number, payload: NoteCreate) =>
        this.request<NoteEntry>(`/api/student-groups/notes/${id}/`, {
          method: "PUT",
          body: payload,
        }),
      partialUpdate: (id: number, payload: Partial<NoteCreate>) =>
        this.request<NoteEntry>(`/api/student-groups/notes/${id}/`, {
          method: "PATCH",
          body: payload,
        }),
      delete: (id: number) =>
        this.request<void>(`/api/student-groups/notes/${id}/`, {
          method: "DELETE",
        }),
    },
    observations: {
      list: (query?: QueryParams) =>
        this.request<ObservationListResponse>("/api/student-groups/observations/", {
          method: "GET",
          query,
        }),
      createBundle: (payload: ObservationCreateBundle) =>
        this.request<ObservationBundle>("/api/student-groups/observations/", {
          method: "POST",
          body: payload,
        }),
      bloodPressures: {
        list: (query?: QueryParams) =>
          this.request<PaginatedResponse<BloodPressureRecord>>(
            "/api/student-groups/observations/blood-pressures/",
            { method: "GET", query }
          ),
        create: (payload: BloodPressureCreate) =>
          this.request<BloodPressureRecord>("/api/student-groups/observations/blood-pressures/", {
            method: "POST",
            body: payload,
          }),
        retrieve: (id: number) =>
          this.request<BloodPressureRecord>(
            `/api/student-groups/observations/blood-pressures/${id}/`,
            { method: "GET" }
          ),
        update: (id: number, payload: BloodPressureCreate) =>
          this.request<BloodPressureRecord>(
            `/api/student-groups/observations/blood-pressures/${id}/`,
            { method: "PUT", body: payload }
          ),
        partialUpdate: (id: number, payload: Partial<BloodPressureCreate>) =>
          this.request<BloodPressureRecord>(
            `/api/student-groups/observations/blood-pressures/${id}/`,
            { method: "PATCH", body: payload }
          ),
        delete: (id: number) =>
          this.request<void>(`/api/student-groups/observations/blood-pressures/${id}/`, {
            method: "DELETE",
          }),
      },
      bloodSugars: {
        list: (query?: QueryParams) =>
          this.request<PaginatedResponse<BloodSugarRecord>>(
            "/api/student-groups/observations/blood-sugars/",
            { method: "GET", query }
          ),
        create: (payload: BloodSugarCreate) =>
          this.request<BloodSugarRecord>("/api/student-groups/observations/blood-sugars/", {
            method: "POST",
            body: payload,
          }),
        retrieve: (id: number) =>
          this.request<BloodSugarRecord>(`/api/student-groups/observations/blood-sugars/${id}/`, {
            method: "GET",
          }),
        update: (id: number, payload: BloodSugarCreate) =>
          this.request<BloodSugarRecord>(`/api/student-groups/observations/blood-sugars/${id}/`, {
            method: "PUT",
            body: payload,
          }),
        partialUpdate: (id: number, payload: Partial<BloodSugarCreate>) =>
          this.request<BloodSugarRecord>(`/api/student-groups/observations/blood-sugars/${id}/`, {
            method: "PATCH",
            body: payload,
          }),
        delete: (id: number) =>
          this.request<void>(`/api/student-groups/observations/blood-sugars/${id}/`, {
            method: "DELETE",
          }),
      },
      bodyTemperatures: {
        list: (query?: QueryParams) =>
          this.request<PaginatedResponse<BodyTemperatureRecord>>(
            "/api/student-groups/observations/body-temperatures/",
            { method: "GET", query }
          ),
        create: (payload: BodyTemperatureCreate) =>
          this.request<BodyTemperatureRecord>(
            "/api/student-groups/observations/body-temperatures/",
            { method: "POST", body: payload }
          ),
        retrieve: (id: number) =>
          this.request<BodyTemperatureRecord>(
            `/api/student-groups/observations/body-temperatures/${id}/`,
            { method: "GET" }
          ),
        update: (id: number, payload: BodyTemperatureCreate) =>
          this.request<BodyTemperatureRecord>(
            `/api/student-groups/observations/body-temperatures/${id}/`,
            { method: "PUT", body: payload }
          ),
        partialUpdate: (id: number, payload: Partial<BodyTemperatureCreate>) =>
          this.request<BodyTemperatureRecord>(
            `/api/student-groups/observations/body-temperatures/${id}/`,
            { method: "PATCH", body: payload }
          ),
        delete: (id: number) =>
          this.request<void>(`/api/student-groups/observations/body-temperatures/${id}/`, {
            method: "DELETE",
          }),
      },
      heartRates: {
        list: (query?: QueryParams) =>
          this.request<PaginatedResponse<HeartRateRecord>>(
            "/api/student-groups/observations/heart-rates/",
            { method: "GET", query }
          ),
        create: (payload: HeartRateCreate) =>
          this.request<HeartRateRecord>("/api/student-groups/observations/heart-rates/", {
            method: "POST",
            body: payload,
          }),
        retrieve: (id: number) =>
          this.request<HeartRateRecord>(`/api/student-groups/observations/heart-rates/${id}/`, {
            method: "GET",
          }),
        update: (id: number, payload: HeartRateCreate) =>
          this.request<HeartRateRecord>(`/api/student-groups/observations/heart-rates/${id}/`, {
            method: "PUT",
            body: payload,
          }),
        partialUpdate: (id: number, payload: Partial<HeartRateCreate>) =>
          this.request<HeartRateRecord>(`/api/student-groups/observations/heart-rates/${id}/`, {
            method: "PATCH",
            body: payload,
          }),
        delete: (id: number) =>
          this.request<void>(`/api/student-groups/observations/heart-rates/${id}/`, {
            method: "DELETE",
          }),
      },
      oxygenSaturations: {
        list: (query?: QueryParams) =>
          this.request<PaginatedResponse<OxygenSaturationRecord>>(
            "/api/student-groups/observations/oxygen-saturations/",
            { method: "GET", query }
          ),
        create: (payload: OxygenSaturationCreate) =>
          this.request<OxygenSaturationRecord>(
            "/api/student-groups/observations/oxygen-saturations/",
            { method: "POST", body: payload }
          ),
        retrieve: (id: number) =>
          this.request<OxygenSaturationRecord>(
            `/api/student-groups/observations/oxygen-saturations/${id}/`,
            { method: "GET" }
          ),
        update: (id: number, payload: OxygenSaturationCreate) =>
          this.request<OxygenSaturationRecord>(
            `/api/student-groups/observations/oxygen-saturations/${id}/`,
            { method: "PUT", body: payload }
          ),
        partialUpdate: (id: number, payload: Partial<OxygenSaturationCreate>) =>
          this.request<OxygenSaturationRecord>(
            `/api/student-groups/observations/oxygen-saturations/${id}/`,
            { method: "PATCH", body: payload }
          ),
        delete: (id: number) =>
          this.request<void>(`/api/student-groups/observations/oxygen-saturations/${id}/`, {
            method: "DELETE",
          }),
      },
      painScores: {
        list: (query?: QueryParams) =>
          this.request<PaginatedResponse<PainScoreRecord>>(
            "/api/student-groups/observations/pain-scores/",
            { method: "GET", query }
          ),
        create: (payload: PainScoreCreate) =>
          this.request<PainScoreRecord>("/api/student-groups/observations/pain-scores/", {
            method: "POST",
            body: payload,
          }),
        retrieve: (id: number) =>
          this.request<PainScoreRecord>(`/api/student-groups/observations/pain-scores/${id}/`, {
            method: "GET",
          }),
        update: (id: number, payload: PainScoreCreate) =>
          this.request<PainScoreRecord>(`/api/student-groups/observations/pain-scores/${id}/`, {
            method: "PUT",
            body: payload,
          }),
        partialUpdate: (id: number, payload: Partial<PainScoreCreate>) =>
          this.request<PainScoreRecord>(`/api/student-groups/observations/pain-scores/${id}/`, {
            method: "PATCH",
            body: payload,
          }),
        delete: (id: number) =>
          this.request<void>(`/api/student-groups/observations/pain-scores/${id}/`, {
            method: "DELETE",
          }),
      },
      respiratoryRates: {
        list: (query?: QueryParams) =>
          this.request<PaginatedResponse<RespiratoryRateRecord>>(
            "/api/student-groups/observations/respiratory-rates/",
            { method: "GET", query }
          ),
        create: (payload: RespiratoryRateCreate) =>
          this.request<RespiratoryRateRecord>(
            "/api/student-groups/observations/respiratory-rates/",
            { method: "POST", body: payload }
          ),
        retrieve: (id: number) =>
          this.request<RespiratoryRateRecord>(
            `/api/student-groups/observations/respiratory-rates/${id}/`,
            { method: "GET" }
          ),
        update: (id: number, payload: RespiratoryRateCreate) =>
          this.request<RespiratoryRateRecord>(
            `/api/student-groups/observations/respiratory-rates/${id}/`,
            { method: "PUT", body: payload }
          ),
        partialUpdate: (id: number, payload: Partial<RespiratoryRateCreate>) =>
          this.request<RespiratoryRateRecord>(
            `/api/student-groups/observations/respiratory-rates/${id}/`,
            { method: "PATCH", body: payload }
          ),
        delete: (id: number) =>
          this.request<void>(`/api/student-groups/observations/respiratory-rates/${id}/`, {
            method: "DELETE",
          }),
      },
    },
  };

  patients = {
    list: (query?: QueryParams) =>
      this.request<PaginatedResponse<Patient>>("/api/patients/patients/", { method: "GET", query }),
    create: (payload: PatientCreate) =>
      this.request<Patient>("/api/patients/patients/", {
        method: "POST",
        body: payload,
      }),
    retrieve: (id: number) =>
      this.request<Patient>(`/api/patients/patients/${id}/`, {
        method: "GET",
      }),
    update: (id: number, payload: PatientCreate) =>
      this.request<Patient>(`/api/patients/patients/${id}/`, {
        method: "PUT",
        body: payload,
      }),
    partialUpdate: (id: number, payload: PatientUpdate) =>
      this.request<Patient>(`/api/patients/patients/${id}/`, {
        method: "PATCH",
        body: payload,
      }),
    delete: (id: number) =>
      this.request<void>(`/api/patients/patients/${id}/`, {
        method: "DELETE",
      }),
    files: {
      list: (patientId: number, query?: QueryParams) =>
        this.request<PaginatedResponse<PatientFile>>(`/api/patients/patients/${patientId}/files/`, {
          method: "GET",
          query,
        }),
      create: (patientId: number, payload: PatientFileUpload) => {
        const formData = new FormData();
        formData.append("file", payload.file);
        if (payload.category) {
          formData.append("category", payload.category);
        }
        if (payload.requires_pagination !== undefined) {
          formData.append("requires_pagination", String(payload.requires_pagination));
        }

        return this.request<PatientFile>(`/api/patients/patients/${patientId}/files/`, {
          method: "POST",
          body: formData,
        });
      },
      retrieve: (patientId: number, fileId: string) =>
        this.request<PatientFile>(`/api/patients/patients/${patientId}/files/${fileId}/`, {
          method: "GET",
        }),
      update: (patientId: number, fileId: string, payload: PatientFileUpload) => {
        const formData = new FormData();
        formData.append("file", payload.file);
        if (payload.category) {
          formData.append("category", payload.category);
        }
        if (payload.requires_pagination !== undefined) {
          formData.append("requires_pagination", String(payload.requires_pagination));
        }

        return this.request<PatientFile>(`/api/patients/patients/${patientId}/files/${fileId}/`, {
          method: "PUT",
          body: formData,
        });
      },
      partialUpdate: (
        patientId: number,
        fileId: string,
        payload: Partial<Omit<PatientFileUpload, "file">> & { file?: File | Blob }
      ) => {
        const formData = new FormData();
        if (payload.file) {
          formData.append("file", payload.file);
        }
        if (payload.category) {
          formData.append("category", payload.category);
        }
        if (payload.requires_pagination !== undefined) {
          formData.append("requires_pagination", String(payload.requires_pagination));
        }

        return this.request<PatientFile>(`/api/patients/patients/${patientId}/files/${fileId}/`, {
          method: "PATCH",
          body: formData,
        });
      },
      delete: (patientId: number, fileId: string) =>
        this.request<void>(`/api/patients/patients/${patientId}/files/${fileId}/`, {
          method: "DELETE",
        }),
      view: (patientId: number, fileId: string, pageRange?: string) =>
        this.request<Blob>(`/api/patients/patients/${patientId}/files/${fileId}/view/`, {
          method: "GET",
          query: pageRange ? { page_range: pageRange } : undefined,
          parser: (response) => response.blob(),
        }),
    },
    uploadFile: (patientId: number, payload: PatientFileUpload) => {
      const formData = new FormData();
      formData.append("file", payload.file);
      if (payload.category) {
        formData.append("category", payload.category);
      }
      if (payload.requires_pagination !== undefined) {
        formData.append("requires_pagination", String(payload.requires_pagination));
      }

      return this.request<PatientFile>(`/api/patients/patients/${patientId}/upload_file/`, {
        method: "POST",
        body: formData,
      });
    },
  };

  googleFormLinks = {
    list: () =>
      this.request<GoogleFormLink[]>("/api/patients/google-forms/", {
        method: "GET",
      }),
    retrieve: (id: number) =>
      this.request<GoogleFormLink>(`/api/patients/google-forms/${id}/`, {
        method: "GET",
      }),
  };
}

export const apiClientV2 = new ApiClientV2();
