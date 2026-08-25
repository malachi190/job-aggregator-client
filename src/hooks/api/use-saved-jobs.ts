import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { ApiResponse, Job } from '@/types';
import { toast } from 'sonner';

interface SavedJob { id: string; jobId: string; job: Job; createdAt: string }

export function useSavedJobs() {
  return useQuery({
    queryKey: ['saved-jobs'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SavedJob[]>>('/saved-jobs');
      return response.data.data;
    },
  });
}

export function useToggleSavedJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, saved }: { jobId: string; saved: boolean }) =>
      saved ? api.delete(`/saved-jobs/${jobId}`) : api.post(`/saved-jobs/${jobId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['saved-jobs'] });
      toast.success(variables.saved ? 'Removed from saved jobs' : 'Job saved');
    },
  });
}
