import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-community-sports.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-soft overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Community sports activities" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
          Your Club's Digital 
          <span className="bg-gradient-hero bg-clip-text text-transparent"> Clubhouse</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Every local sports club deserves tools that just work. Grassroot brings warmth, 
          simplicity, and connection to the heart of grassroots sports — like having a 
          digital clubhouse in your pocket.
        </p>

        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          From magic-link logins to seamless payments, from activity RSVPs to member 
          management — we've built everything your club needs to thrive, without the 
          complexity that bigger platforms bring.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="text-lg px-8 py-6">
            See It In Action
          </Button>
          <Button variant="warm" size="lg" className="text-lg px-8 py-6">
            Join Our Story
          </Button>
        </div>
      </div>
    </section>
  );
};