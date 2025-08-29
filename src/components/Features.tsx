import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Calendar, CreditCard, Bell, Palette } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Made with Love for Small Clubs",
    description: "We understand that every member matters, every activity counts, and every connection strengthens your community."
  },
  {
    icon: Users,
    title: "Effortless Member Care",
    description: "Simple member management that respects everyone's time — from seasoned admins to weekend volunteers."
  },
  {
    icon: Calendar,
    title: "Activities That Bring People Together",
    description: "Training, competitions, socials — organize anything with RSVPs that work offline because life happens everywhere."
  },
  {
    icon: CreditCard,
    title: "Payments Made Simple",
    description: "Collect fees and contributions with Stripe and MobilePay integration that feels natural, never corporate."
  },
  {
    icon: Bell,
    title: "Gentle Notifications",
    description: "Stay connected without overwhelm — thoughtful push notifications that respect your members' attention."
  },
  {
    icon: Palette,
    title: "Your Club, Your Colors",
    description: "Customize your app with your club's logo and palette — because identity matters in grassroots sports."
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Clubs Choose Grassroot
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Not because it's perfect, but because it's made by people who 
            understand the beautiful chaos of running a local sports club.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="border-border hover:shadow-warm transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-hero rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};