import { useHome } from "./use-home"
import { HomeView } from "./view/home-view"

export const Home = () => {
    const props = useHome()
    return <HomeView {...props}/>
}