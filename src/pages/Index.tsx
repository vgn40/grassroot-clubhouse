import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Story } from "@/components/Story";
import { CallToAction } from "@/components/CallToAction";

import { AppLayout } from "@/components/Layout/AppLayout";

const Index = () => {
  return (
    <AppLayout>
      <div className="min-h-screen">
        <Hero />
        <Features />
        <Story />
        <CallToAction />
      </div>
    </AppLayout>
  );
};

export default Index;
