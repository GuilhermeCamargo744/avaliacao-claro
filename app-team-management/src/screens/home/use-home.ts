import { useRouter } from "expo-router"

const PLACEHOLDER_TEAMS = [
    { id: "1", name: "Nome do time", tone: "green" },
    { id: "2", name: "Nome do time", tone: "yellow" },
    { id: "3", name: "Nome do time", tone: "blue" },
] as const

export const useHome = () => {
    const router = useRouter()

    return {
        teams: PLACEHOLDER_TEAMS,
        onCreateTeam: () => router.push("/create-new-team"),
    }
}
