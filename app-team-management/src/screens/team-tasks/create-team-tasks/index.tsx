import { useCreateTeamTasks } from './use-create-team-tasks';
import { CreateTeamTasksView } from './view/create-team-tasks-view';

export const CreateTeamTasks = () => {
  const props = useCreateTeamTasks();

  return <CreateTeamTasksView {...props} />;
};
