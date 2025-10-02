import { Beer } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 font-headline text-lg font-bold text-sidebar-foreground">
      <div className="rounded-md bg-sidebar-primary p-1.5 text-sidebar-primary-foreground">
        <Beer className="h-5 w-5" />
      </div>
      <span>Akabari Manager</span>
    </div>
  );
}
