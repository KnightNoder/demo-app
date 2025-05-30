import { CheckIcon, ClockIcon, PlayIcon } from "./Inbox/components/assets/Icons";
import { Icon } from "./Inbox/components/atoms/Icon";
import { TaskCard } from "./Inbox/components/organisms/TaskCard"
import { TaskHeader } from "./Inbox/components/organisms/TaskHeader"

const Inbox = () => {
  const handleCardClick = (cardType: string) => {
    console.log(`${cardType} card clicked`);
  };

  const handleNewTask = () => {
    console.log("New task clicked");
  };

  const handleFilter = () => {
    console.log("Filter clicked");
  };

  const handleSort = () => {
    console.log("Sort clicked");
  };

  return (
    <div className="w-full bg-[#f4f5fb] text-[#020817]">
      <TaskHeader
        onNewTask={handleNewTask}
        onFilter={handleFilter}
        onSort={handleSort}
      />

      <div className="min-h-screen w-full max-w-7xl mx-10">
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
          <TaskCard
            title="Urgent Tasks"
            count={9}
            icon={<PlayIcon />}
            onClick={() => handleCardClick("Urgent Tasks")}
            variant="urgent"
          />

          <TaskCard
            title="Review Forms"
            count={8}
            icon={
              <Icon size="md">
                <PlayIcon />
              </Icon>
            }
            onClick={() => handleCardClick("Review Forms")}
            variant="normal"
          />

          <TaskCard
            title="Review Prescriptions"
            count={7}
            icon={
              <Icon size="md">
                <PlayIcon />
              </Icon>
            }
            onClick={() => handleCardClick("Review Prescriptions")}
            variant="normal"
          />

          <TaskCard
            title="Pending Too Long"
            count={2}
            icon={
              <Icon size="md">
                <CheckIcon />
              </Icon>
            }
            onClick={() => handleCardClick("Pending Too Long")}
            variant="normal"
          />

          <TaskCard
            title="Treatment Reviews"
            count={0}
            icon={<ClockIcon />}
            onClick={() => handleCardClick("Treatment Reviews")}
            variant="normal"
          />
        </div>
      </div>
    </div>
  );
};

export default Inbox;
