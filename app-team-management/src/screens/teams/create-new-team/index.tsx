import { useCreateNewTeam } from './use-create-new-team';
import { CreateNewTeamView } from './view/create-new-team-view';

export const CreateNewTeam = () => {
  const props = useCreateNewTeam();

  return <CreateNewTeamView {...props} />;
};
