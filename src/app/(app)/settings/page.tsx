import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Settings</CardTitle>
        <CardDescription>
          Manage your application preferences and settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is where you will configure application-wide settings, such as your bar's details, currency, user roles, notification preferences, and default unit conversions.</p>
      </CardContent>
    </Card>
  );
}
