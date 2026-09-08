import { useEditTeam } from './use-edit-team';
import { EditTeamView } from './view/edit-team-view';

export const EditTeam = () => {
  const props = useEditTeam();

  return <EditTeamView {...props} />;
};
