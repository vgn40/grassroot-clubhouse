import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Story } from "@/components/Story";
import { CallToAction } from "@/components/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Story />
      <CallToAction />
    </div>
  );
};

export default Index;
