import { useViewTeamTasks } from './use-view-team-tasks';
import { ViewTeamTasksView } from './view/view-team-tasks-view';

export const ViewTeamTasks = () => {
  const props = useViewTeamTasks();

  return <ViewTeamTasksView {...props} />;
};
