import { Shield } from 'lucide-react';

type PlayerTone = 'emerald' | 'orange' | 'blue' | 'sky' | 'violet';

type PlayerAvatarProps = {
  firstName?: string;
  lastName?: string;
  name?: string;
  imageUrl?: string | null;
  tone?: PlayerTone;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
};

type ClubLogoProps = {
  name: string;
  logoUrl?: string | null;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  iconClassName?: string;
};

const playerToneClasses: Record<PlayerTone, string> = {
  emerald: 'from-emerald-600 to-emerald-800',
  orange: 'from-orange-600 to-orange-800',
  blue: 'from-blue-600 to-blue-800',
  sky: 'from-sky-500 to-sky-700',
  violet: 'from-violet-600 to-violet-800',
};

function getInitials(firstName?: string, lastName?: string, fallbackName?: string) {
  const fallbackInitials = fallbackName
    ? fallbackName
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
    : '';

  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || fallbackInitials.slice(0, 2).toUpperCase() || '??';
}

export function PlayerAvatar({ firstName, lastName, name, imageUrl, tone = 'emerald', className = 'flex h-12 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg', imageClassName = 'h-full w-full object-cover object-center', textClassName = 'text-xs font-bold' }: PlayerAvatarProps) {
  const displayName = name ?? `${firstName ?? ''} ${lastName ?? ''}`.trim();
  const initials = getInitials(firstName, lastName, displayName);

  return (
    <div className={`${className} bg-linear-to-br ${playerToneClasses[tone]} text-white ${textClassName}`}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={displayName} className={imageClassName} />
      ) : (
        initials
      )}
    </div>
  );
}

export function ClubLogo({ name, logoUrl, className = 'flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden', imageClassName = 'h-full w-full object-contain object-center' }: ClubLogoProps) {
  // Keep the sizing classes, but remove any explicit background/shape styling so the logo itself stays clean.
  const cleanWrapperClass = (className || '')
    .split(/\s+/)
    .filter((part) => !part.startsWith('bg-') && !part.startsWith('rounded-'))
    .join(' ')
    .trim();

  if (logoUrl) {
    return (
      <div className={cleanWrapperClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt={name} className={imageClassName} />
      </div>
    );
  }

  return (
    <div className={`${cleanWrapperClass} rounded-full bg-muted`}>
      <Shield className="h-1/2 w-1/2 text-muted-foreground" />
    </div>
  );
}
