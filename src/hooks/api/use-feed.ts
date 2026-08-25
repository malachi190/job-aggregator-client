import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ApiResponse, FeedResponse, Job, SearchParams } from "@/types";

export function useFeedSearch(params: SearchParams = {}) {
  const hasSearch = !!params.q && params.q.length > 2;

  return useQuery({
    queryKey: ["feed-search", params],
    queryFn: async () => {
      const endpoint = hasSearch ? "/search" : "/feed";
      const res = await api.get<ApiResponse<FeedResponse>>(endpoint, {
        params: {
          ...params,
          page: params.page ?? 1,
          limit: params.limit ?? 20,
        },
      });
      return res.data.data;
    },
    enabled: !hasSearch || params.q!.length > 2,
    placeholderData: keepPreviousData,
  });
}


export function useJob(jobId: string) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Job>>(`/feed/${jobId}`);
      return res.data.data;
    },
    enabled: !!jobId,
  });
}
