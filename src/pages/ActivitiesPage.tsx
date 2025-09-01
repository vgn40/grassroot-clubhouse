import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ActivitiesGrid } from '@/components/Activities/ActivitiesGrid';
import { AppLayout } from '@/components/Layout/AppLayout';

export default function ActivitiesPage() {
  const navigate = useNavigate();

  const handleActivityClick = (activityId: string) => {
    navigate(`/activity/${activityId}`);
  };

  return (
    <AppLayout>
      <main className="min-h-screen bg-gradient-soft">
        <div className="container mx-auto px-4 py-8">
          <ActivitiesGrid onActivityClick={handleActivityClick} />
        </div>
      </main>
    </AppLayout>
  );
}