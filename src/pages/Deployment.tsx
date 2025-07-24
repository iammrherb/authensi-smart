import Header from "@/components/Header";
import DeploymentPlanner from "@/components/deployment/DeploymentPlanner";

const Deployment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <DeploymentPlanner />
      </div>
    </div>
  );
};

export default Deployment;