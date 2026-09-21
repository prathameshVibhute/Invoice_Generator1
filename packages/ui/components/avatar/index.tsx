interface AvatarProps {
    label: string;
}

const avatarColors = [
    { background: "#eeecff", foreground: "#5145cd" },
    { background: "#e4f6f3", foreground: "#168b78" },
    { background: "#fff0e3", foreground: "#c66b1d" },
    { background: "#ffe8ed", foreground: "#c13d5a" },
    { background: "#e8f0ff", foreground: "#3563c8" },
];

function getAvatarColor(label: string) {
    const hash = [...label].reduce((total, character) => total + character.charCodeAt(0), 0);
    return avatarColors[hash % avatarColors.length] ?? { background: "#eeecff", foreground: "#5145cd" };
}

export function Avatar({label}: AvatarProps) {
    const color = getAvatarColor(label);

    return (
        <div
            className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full font-bold uppercase"
            style={{ backgroundColor: color.background, color: color.foreground }}
        >
            <span className="text-sm">{label}</span>
        </div>
    );
}