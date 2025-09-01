import { AppLayout } from "@/components/Layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

export default function ChatPage() {
  return (
    <AppLayout>
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Chat Support</h1>
              <p className="text-muted-foreground">Get help from our support team</p>
            </div>
          </div>

          <Card className="rounded-2xl max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Support Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Chat Coming Soon</h3>
                <p className="text-muted-foreground">
                  Our support chat feature is being developed. For now, please contact us at support@example.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AppLayout>
  );
}