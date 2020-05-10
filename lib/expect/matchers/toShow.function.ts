import {LocationParameters} from "../../search-parameters.class";
import {Screen} from "../../screen.class";

export const toShow = async (
    received: Screen,
    needle: string,
    confidence?: number,
) => {
    let locationParams;
    if (confidence) {
        locationParams = new LocationParameters();
        locationParams.confidence = confidence;
    }
    try {
        await received.find(needle, locationParams);
        return {
            message: () => `Expected screen to not show ${needle}`,
            pass: true,
        };
    } catch (err) {
        return {
            message: () => `Screen is not showing ${needle}: ${err}`,
            pass: false,
        };
    }
};
