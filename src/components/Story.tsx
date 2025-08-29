import { Button } from "@/components/ui/button";

export const Story = () => {
  return (
    <section className="py-20 bg-gradient-warm">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
          Built by Someone Who Gets It
        </h2>
        
        <div className="text-lg text-muted-foreground space-y-6 leading-relaxed mb-12">
          <p>
            Small clubs are the heartbeat of grassroots sports, but they often make do with 
            WhatsApp groups, shared Excel sheets, and good intentions. We believe they 
            deserve better — not enterprise software, but something crafted with care.
          </p>
          
          <p>
            Grassroot started as a love letter to every volunteer coach who manages teams 
            on their phone, every club secretary juggling member lists, and every treasurer 
            collecting fees with a smile and a prayer.
          </p>
          
          <p>
            Today, clubs can create activities, manage members, and collect payments 
            in a clean, accessible app that just works on mobile. It's stable, it's 
            human, and it's ready for the teams that make sports wonderful.
          </p>
        </div>

        <Button variant="hero" size="lg" className="text-lg px-8 py-6">
          Let's Build Something Together
        </Button>
      </div>
    </section>
  );
};