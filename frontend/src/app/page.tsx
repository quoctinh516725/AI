import HeroBanner from "@/components/home/HeroBanner";
import HowItWorks from "@/components/home/HowItWorks";
import RecentPosts from "@/components/home/RecentPosts";
import SupportOrganizations from "@/components/home/SupportOrganizations";
import EncouragementBlock from "@/components/home/EncouragementBlock";
import MissionSection from "@/components/home/MissionSection";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <RecentPosts />
      <HowItWorks />
      <MissionSection />
      <EncouragementBlock /> 
      <SupportOrganizations />  
    </>
  );
}

