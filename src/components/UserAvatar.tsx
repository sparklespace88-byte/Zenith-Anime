import React from 'react';

export const INITIAL_PREFIX = 'initial:';

export const makeInitialAvatar = (email: string): string => {
  const letter = (email.trim().charAt(0) || 'U').toUpperCase();
  return `${INITIAL_PREFIX}${letter}`;
};

const GRADIENTS = [
  'from-purple-600 to-fuchsia-600',
  'from-indigo-600 to-blue-500',
  'from-rose-600 to-orange-500',
  'from-emerald-600 to-teal-500',
  'from-sky-600 to-cyan-500',
  'from-amber-600 to-red-500'
];

interface UserAvatarProps {
  src: string;
  alt?: string;
  className?: string;
}

/**
 * Shows the user's picture. When the avatar is a letter avatar ("initial:M",
 * created from the first letter of the account email) it renders the letter
 * on a coloured background instead of an <img>.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ src, alt = '', className = '' }) => {
  if (src && src.startsWith(INITIAL_PREFIX)) {
    const letter = src.slice(INITIAL_PREFIX.length).charAt(0).toUpperCase() || 'U';
    const gradient = GRADIENTS[letter.charCodeAt(0) % GRADIENTS.length];
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} bg-gradient-to-br ${gradient} text-white font-bold flex items-center justify-center select-none`}
        style={{ fontSize: '0.55em', lineHeight: 1 }}
      >
        <span style={{ fontSize: '1.7em' }}>{letter}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} referrerPolicy="no-referrer" className={className} />;
};
