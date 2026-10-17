interface AvatarProps {
  label: string;
}

const avatarColors = [
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
  "bg-orange-100 text-orange-700",
  "bg-rose-100 text-rose-700",
  "bg-blue-100 text-blue-700",
];

function getAvatarColor(label: string) {
  const hash = [...label].reduce((total, character) => total + character.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length] ?? avatarColors[0]!;
}

export function Avatar({ label }: AvatarProps) {
  const color = getAvatarColor(label);

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold uppercase ${color}`}
    >
      <span className="text-sm">{label}</span>
    </div>
  );
}
