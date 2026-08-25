import { useMutation, useQuery } from "@tanstack/react-query";
import type { Job } from '@/types';
import { api } from "@/lib/api";
import type { ApiResponse, TailoringContent } from "@/types";
import { toast } from "sonner";

export function useGenerateTailoring() {
  return useMutation({
    mutationFn: async ({
      jobId,
      baseCvId,
    }: {
      jobId: string;
      baseCvId: string;
    }) => {
      const res = await api.post<ApiResponse<{ sessionId: string; content: TailoringContent }>>(
        "/tailoring/generate",
        { jobId, baseCvId },
      );
      return res.data.data;
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to generate tailored CV");
    },
  });
}

export function useTailoringSession(sessionId: string, enabled = true) {
  return useQuery({
    queryKey: ['tailoring-session', sessionId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{
        sessionId: string;
        content: TailoringContent;
        jobId: string;
        job: Job | null;
      }>>(`/tailoring/${sessionId}`);
      return response.data.data;
    },
    enabled: enabled && Boolean(sessionId),
    retry: false,
  });
}

export function useRefineTailoring() {
  return useMutation({
    mutationFn: async ({
      sessionId,
      feedback,
    }: {
      sessionId: string;
      feedback: string;
    }) => {
      const res = await api.post<ApiResponse<{ content: TailoringContent }>>(
        `/tailoring/${sessionId}/refine`,
        { feedback },
      );
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("CV refined");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Refinement failed");
    },
  });
}

export function useAcceptTailoring() {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await api.post<ApiResponse<{ cvUrl: string; coverLetterUrl: string }>>(
        `/tailoring/${sessionId}/accept`,
      );
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Tailored CV saved");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to accept tailoring");
    },
  });
}
