export const linear = (
    amountOfSteps: number,
    speedInPixelsPerSecond: number,
): number[] => {
    const timeSteps = [];
    // Duration per movement step in nanoseconds
    let stepDuration = (1 / speedInPixelsPerSecond) * 1_000_000_000;
    if (stepDuration <= 0) {
        stepDuration = 0;
    }
    for (let idx = 0; idx < amountOfSteps; ++idx) {
        timeSteps.push(stepDuration);
    }
    return timeSteps;
};
