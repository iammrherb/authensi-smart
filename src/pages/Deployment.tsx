import DeploymentPlanner from "@/components/deployment/DeploymentPlanner";

const Deployment = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-8">
        <DeploymentPlanner />
      </div>
    </div>
  );
};

export default Deployment;