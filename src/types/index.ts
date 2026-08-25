export interface User {
  id: string
  email: string
  authProvider: "clerk" | "password"
  createdAt: string
}

export interface Profile {
  id: string
  userId: string
  fullName: string
  role: string
  seniority: string
  location: string
  skills: string[]
  jobTitles: string[]
  remotePref: boolean
  salaryMin: number | null
  salaryMax: number | null
  updatedAt: string
}

export interface BaseCv {
  id: string
  userId: string
  name: string
  fileUrl: string
  isDefault: boolean
  createdAt: string
}

export interface JobSource {
  id: string
  name: string
  type: string
  region: string
  url: string
  createdAt: string
}

export interface ScoreDetails {
  skills: number
  title: number
  seniority: number
  location: number
  recency: number
  overall: number
}

export interface FeedItem {
  job: Job
  score: number
  details: ScoreDetails
}

export interface Application {
  id: string
  userId: string
  jobId: string
  job: Job
  status: "PENDING" | "APPLIED" | "INTERVIEW" | "REJECTED"
  cvDocUrl: string | null
  coverLetterUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface ExperienceEntry {
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
}

export interface EducationEntry {
  degree: string
  institution: string
  location?: string
  startDate: string
  endDate?: string
}

export interface ProjectEntry {
  name: string
  description: string
  url?: string
  technologies: string[]
}

export interface TailoredContent {
  cv: {
    title: string
    contact: {
      name: string
      email: string
      phone?: string
      location?: string
      linkedin?: string
    }
    summary: string
    skills: string[]
    experience: ExperienceEntry[]
    education: EducationEntry[]
    projects: ProjectEntry[]
  }
  coverLetter: {
    greeting: string
    body: string
    closing: string
  }
}

export interface ApiResponse<T> {
  status: boolean
  message: string
  data: T
}

export interface ApiError {
  status: false
  message: string
}

// Jobs
export interface Job {
  id: string;
  sourceId: string;
  externalId: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  seniority: string;
  location: string;
  region: string;
  salaryMin: number | null;
  salaryMax: number | null;
  employmentType: string | null;
  isRemote: boolean;
  postedAt: string;
  createdAt: string;
  applyUrl: string | null;
}

export interface MatchDetails {
  skills: number;
  title: number;
  seniority: number;
  location: number;
  recency: number;
  overall: number;
}

export interface FeedItem {
  job: Job;
  score: number; // 0-1 decimal, e.g. 0.44 = 44%
  details: MatchDetails;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeedResponse {
  items: FeedItem[];
  pagination: Pagination;
}

export interface SearchParams {
  q?: string;
  remote?: boolean;
  seniority?: string[];
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  page?: number;
  limit?: number;
}

export interface JobDetailState {
  item?: FeedItem;
}
export interface ParsedCVData {
  fileType: string;
  fullText: string;
  pageCount: number;
}

export interface BaseCV {
  id: string;
  userId: string;
  name: string;
  fileUrl: string;
  storageKey: string;
  fileType: string;
  fileSize: number;
  parsedData: ParsedCVData;
  isDefault: boolean;
  createdAt: string;
}

// Tailoring
export interface TailoredContact {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface TailoredCV {
  title: string;
  contact: TailoredContact;
  summary: string;
  skills: Record<string, string | string[]>;
  experience: Array<{
    company?: string;
    title?: string;
    dates?: string;
    bullets?: string[];
  }>;
  education: Array<{
    institution?: string;
    degree?: string;
    year?: string;
  }>;
  projects: Array<{
    name?: string;
    description?: string;
    tech?: string | string[];
  }>;
}

export interface CoverLetter {
  greeting: string;
  body: string;
  closing: string;
}

export interface TailoringContent {
  cv: TailoredCV;
  coverLetter: CoverLetter;
}

export interface TailoringSessionData {
  sessionId: string;
  content: TailoringContent;
}
