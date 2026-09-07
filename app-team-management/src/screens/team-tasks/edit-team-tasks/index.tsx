import { useEditTeamTasks } from './use-edit-team-tasks';
import { EditTeamTasksView } from './view/edit-team-tasks-view';

export const EditTeamTasks = () => {
  const props = useEditTeamTasks();

  return <EditTeamTasksView {...props} />;
};
