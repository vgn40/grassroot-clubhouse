import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const readyFeatures = [
  "Magic-link login (no password headaches)",
  "Activity management with offline RSVP sync",
  "Member management for admins and trainers",
  "Stripe & MobilePay payment integration",
  "Push notifications with respect for privacy",
  "Club branding with your logo and colors"
];

export const CallToAction = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <Card className="border-primary/20 shadow-warm bg-gradient-soft">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to See Grassroot in Action?
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join us in building something meaningful for grassroots sports. 
              Whether you're a club looking for better tools or someone who 
              believes in community-first technology.
            </p>

            <div className="grid md:grid-cols-2 gap-4 text-left mb-10 max-w-2xl mx-auto">
              {readyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Request a Demo
              </Button>
              <Button variant="warm" size="lg" className="text-lg px-8 py-6">
                Get Early Access
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};