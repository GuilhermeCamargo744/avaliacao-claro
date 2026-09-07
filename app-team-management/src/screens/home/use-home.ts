import { useRouter } from "expo-router"

import { useAppDispatch } from "@/hooks/use-app-dispatch"
import { useAppSelector } from "@/hooks/use-app-selector"
import { useTeamsQuery } from "@/hooks/use-query-teams"
import { searchTermChanged, selectSearchTerm } from "@/store/slices/teams-slice/teams-slice"

export const useHome = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const searchTerm = useAppSelector(selectSearchTerm)
    const { data, isPending, error, refetch } = useTeamsQuery()

    const query = searchTerm.trim().toLocaleLowerCase()

    const teams = (data ?? [])
        .filter((team) => team.name.toLocaleLowerCase().includes(query))
        .sort((first, second) => first.name.localeCompare(second.name))

    return {
        teams,
        searchTerm,
        isLoading: isPending,
        errorMessage: error?.message ?? null,
        onSearchTermChange: (value: string) => dispatch(searchTermChanged(value)),
        onRetry: () => { void refetch() },
        onCreateTeam: () => router.push("/create-new-team"),
        onOpenTeam: (id: string) => router.push(`/team-tasks/${id}`),
    }
}
