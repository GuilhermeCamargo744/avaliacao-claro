import { useRouter } from "expo-router"

import { useAppDispatch } from "@/hooks/use-app-dispatch"
import { useAppSelector } from "@/hooks/use-app-selector"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useTeamsQuery } from "@/hooks/use-query-teams"
import { searchTermChanged, selectSearchTerm } from "@/store/slices/teams-slice/teams-slice"

export const useHome = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const searchTerm = useAppSelector(selectSearchTerm)
    // A busca é do servidor: sem debounce sairia uma requisição por tecla.
    const search = useDebouncedValue(searchTerm.trim())
    const { data, isPending, error, refetch } = useTeamsQuery(search || undefined)

    return {
        teams: data ?? [],
        searchTerm,
        isLoading: isPending,
        errorMessage: error?.message ?? null,
        onSearchTermChange: (value: string) => dispatch(searchTermChanged(value)),
        onRetry: () => { void refetch() },
        onCreateTeam: () => router.push("/create-new-team"),
        onOpenTeam: (id: string) => router.push(`/team-tasks/${id}`),
    }
}
