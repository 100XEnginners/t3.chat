import type { ReactNode } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FetchUser } from '@/actions/fetchUser';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center gap-2 bg-muted/40 rounded-lg p-4 w-full md:w-64">
      <div className="text-2xl">{icon}</div>
      <div className="font-semibold text-center">{title}</div>
      <div className="text-sm text-muted-foreground text-center">{description}</div>
    </div>
  );
}

const features = [
  {
    icon: <span role="img" aria-label="rocket">🚀</span>,
    title: 'Access to All Models',
    description: 'Get access to our full suite of models including Claude, o3-mini-high, and more!'
  },
  {
    icon: <span role="img" aria-label="gift">🎁</span>,
    title: 'Generous Limits',
    description: 'Receive 1500 standard credits per month, plus 100 premium credits* per month.'
  },
  {
    icon: <span role="img" aria-label="support">🛟</span>,
    title: 'Priority Support',
    description: 'Get faster responses and dedicated assistance from the T3 team whenever you need help!'
  }
];

const keyboardShortcuts = [
  { label: 'Search', keys: ['⌘', 'K'] },
  { label: 'New Chat', keys: ['⌘', 'Shift', 'O'] },
  { label: 'Toggle Sidebar', keys: ['⌘', 'B'] },
];

export default async function SubscriptionPage() {
    const user = await FetchUser()
    console.log(user)
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-8 px-2 md:px-0">
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6 max-w-md mx-auto md:mx-0">
          {/* Profile Card */}
          <Card className="bg-muted/40">
            <CardHeader className="flex flex-col items-center gap-2 pb-2">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-muted">
                <Image
                  src={user?.image || ""}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              <CardTitle className="text-xl mt-2">{user?.name}</CardTitle>
              <div className="text-muted-foreground text-sm">{user?.email}</div>
              <Badge variant="secondary" className="mt-1">Free Plan</Badge>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded-lg p-4 flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Message Usage</span>
                  <span className="text-muted-foreground">Resets tomorrow at 5:30 AM</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Standard</span>
                  <span>0/20</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '0%' }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">20 messages remaining</div>
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {keyboardShortcuts.map(shortcut => (
                <div key={shortcut.label} className="flex items-center justify-between">
                  <span>{shortcut.label}</span>
                  <span className="flex gap-1">
                    {shortcut.keys.map(key => (
                      <kbd key={key} className="bg-muted px-2 py-1 rounded text-xs font-mono border border-border">{key}</kbd>
                    ))}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Upgrade to Pro */}
          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-xl">Upgrade to Pro</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {features.map(f => (
                  <FeatureCard key={f.title} {...f} />
                ))}
              </div>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-2xl font-bold">$8</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white w-full max-w-xs">Upgrade Now</Button>
              <div className="text-xs text-muted-foreground mt-2">
                * Premium credits are used for GPT Image Gen, Claude Sonnet, and Grok 3. Additional Premium credits can be purchased separately.
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-muted/40">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-sm">Permanently delete your account and all associated data.</div>
              <Button variant="destructive" className="w-full max-w-xs">Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
