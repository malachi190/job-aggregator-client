import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, Application } from '@/types';
import { toast } from 'sonner';

export type ApplicationStatus = 'PENDING' | 'APPLIED' | 'INTERVIEW' | 'REJECTED';

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Application[]>>('/applications');
      return response.data.data;
    },
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => {
      const response = await api.post<ApiResponse<Application>>('/applications', { jobId });
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
    onError: (error: any) => toast.error(error.response?.data?.message || 'Unable to record application'),
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const response = await api.patch<ApiResponse<Application>>(`/applications/${id}/status`, { status });
      return response.data.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/applications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application removed');
    },
  });
}
