import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse, BaseCV } from "@/types";
import { toast } from "sonner";

export function useBaseCVs() {
  return useQuery({
    queryKey: ["base-cvs"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<BaseCV[]>>("/base-cvs");
      return res.data.data;
    },
  });
}

export function useUploadCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post<ApiResponse<BaseCV>>("/base-cvs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["base-cvs"] });
      toast.success("CV uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Upload failed");
    },
  });
}

export function useDeleteCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/base-cvs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["base-cvs"] });
      toast.success("CV deleted");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Delete failed");
    },
  });
}

export function useSetDefaultCV() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch<ApiResponse<BaseCV>>(`/base-cvs/${id}/default`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["base-cvs"] });
      toast.success("Default CV updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });
}