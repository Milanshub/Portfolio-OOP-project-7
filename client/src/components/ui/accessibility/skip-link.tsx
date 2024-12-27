import { useSkipLink } from '@/lib/utils/accessibility';

interface SkipLinkProps {
  links: Array<{
    label: string;
    targetId: string;
  }>;
}

export function SkipLink({ links }: SkipLinkProps) {
  const { handleSkip } = useSkipLink();

  return (
    <div className="fixed left-0 top-0 z-50 w-full">
      {links.map(({ label, targetId }) => (
        <a
          key={targetId}
          href={`#${targetId}`}
          onClick={(e) => {
            e.preventDefault();
            handleSkip(targetId);
          }}
          className="sr-only focus:not-sr-only focus:block focus:bg-background focus:p-4 focus:text-foreground"
        >
          {label}
        </a>
      ))}
    </div>
  );
} 