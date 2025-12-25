export interface Exercise {
    id: string;
    name: string;
    description: string;
    duration?: number; // in seconds
    reps?: number;
    cues: string[];
}

export const workoutDatabase: Exercise[] = [
    {
        id: "squats",
        name: "Bodyweight Squats",
        description: "Lower your hips as if sitting in a chair, keeping your chest up.",
        reps: 15,
        cues: ["Keep your chest up", "Weight on your heels", "Go a bit lower"],
    },
    {
        id: "pushups",
        name: "Pushups",
        description: "Keep your body in a straight line, lower your chest to the floor.",
        reps: 10,
        cues: ["Core tight", "Elbows at 45 degrees", "Full range of motion"],
    },
    {
        id: "plank",
        name: "Plank",
        description: "Hold a straight body position supported by your forearms.",
        duration: 30,
        cues: ["Don't let your hips sag", "Breathe steadily", "Squeeze your glutes"],
    },
];
