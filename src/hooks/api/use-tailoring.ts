import { useMutation } from "@tanstack/react-query";
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

export function useCreateApplication() {
  return useMutation({
    mutationFn: async (payload: {
      jobId: string;
      tailoringSessionId?: string;
      status?: string;
    }) => {
      const res = await api.post<ApiResponse<{ id: string }>>("/applications", payload);
      return res.data.data;
    },
    onSuccess: () => {
      toast.success("Application recorded");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to record application");
    },
  });
}