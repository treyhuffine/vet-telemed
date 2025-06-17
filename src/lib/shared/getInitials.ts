export const getInitials = ({
  name,
  fallbackText = '',
}: {
  name?: string | null;
  fallbackText?: string;
}) => {
  if (!name) return fallbackText;
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
