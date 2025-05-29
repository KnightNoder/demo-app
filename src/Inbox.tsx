import { CheckIcon, ClockIcon, PlayIcon } from "./Inbox/components/assets/Icons";
import { Icon } from "./Inbox/components/atoms/Icon";
import { TaskCard } from "./Inbox/components/organisms/TaskCard"
import { TaskHeader } from "./Inbox/components/organisms/TaskHeader"

const Inbox = () => {
  const handleCardClick = (cardType: string) => {
    console.log(`${cardType} card clicked`);
  };
  return (
    <div className="bg-[#F4F5FB] h-screen">
      <TaskHeader/>
      <div className="space-y-4">
        {/* <Heading level={3}>Card Variations</Heading> */}
        <div className="flex flex-wrap gap-4">
          <TaskCard
            title="Urgent tasks"
            count={20}
            icon={<Icon size="md">
                  <PlayIcon />
                </Icon>}
            variant="urgent"
            gradient="yellow-orange"
            onClick={() => handleCardClick('In Progress')}
          />
          
          <TaskCard
            title="Review Forms"
            count={12}
            icon={<CheckIcon />}
            variant="urgent"
            gradient="green-blue"
            onClick={() => handleCardClick('Completed')}
          />
          
          <TaskCard
            title="Review Prescriptions"
            count={3}
            icon={<ClockIcon />}
            variant="urgent"
            gradient="blue-purple"
            onClick={() => handleCardClick('Due Soon')}
          />
        </div>
      </div>
    </div>
  )
}

export default Inbox
