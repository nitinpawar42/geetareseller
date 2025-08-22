import { SidebarTrigger } from '@/components/ui/sidebar';

type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <div>
          <h1 className="font-headline text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="hidden text-sm text-muted-foreground md:block">{description}</p>
          )}
        </div>
      </div>
    </header>
  );
}
