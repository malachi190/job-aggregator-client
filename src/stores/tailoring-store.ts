import { create } from "zustand"
import type { TailoredContent } from "@/types"

interface TailoringState {
  sessionId: string | null
  content: TailoredContent | null
  jobId: string | null
  setSession: (sessionId: string, content: TailoredContent, jobId: string) => void
  updateContent: (content: TailoredContent) => void
  clearSession: () => void
}

export const useTailoringStore = create<TailoringState>((set) => ({
  sessionId: null,
  content: null,
  jobId: null,
  setSession: (sessionId, content, jobId) => set({ sessionId, content, jobId }),
  updateContent: (content) => set({ content }),
  clearSession: () => set({ sessionId: null, content: null, jobId: null }),
}))