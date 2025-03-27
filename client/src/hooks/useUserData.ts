import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useUserData() {
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery<User>({
    queryKey: ["/api/user"],
    staleTime: 60000, // 1 minute
  });

  // Update avatar mutation
  const updateAvatarMutation = useMutation({
    mutationFn: (avatarId: string) => {
      return apiRequest("PATCH", "/api/user/avatar", { avatarId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  // Update score mutation
  const updateScoreMutation = useMutation({
    mutationFn: ({ gameType, score }: { gameType: string; score: number }) => {
      return apiRequest("POST", "/api/user/score", { gameType, score });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  // Complete mission mutation
  const completeMissionMutation = useMutation({
    mutationFn: (missionId: number) => {
      return apiRequest("POST", "/api/user/mission", { missionId, completed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  return {
    userData,
    isLoading,
    error,
    updateAvatar: updateAvatarMutation.mutate,
    updateScore: updateScoreMutation.mutate,
    completeMission: completeMissionMutation.mutate,
    isUpdating: updateAvatarMutation.isPending || updateScoreMutation.isPending || completeMissionMutation.isPending,
  };
}
