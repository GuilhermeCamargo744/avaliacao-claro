import { useHomeTeamTasks } from './use-home-team-tasks';
import { HomeTeamTasksView } from './view/home-team-tasks-view';

export const HomeTeamTasks = () => {
  const props = useHomeTeamTasks();

  return <HomeTeamTasksView {...props} />;
};
