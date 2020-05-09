import {timeout} from "./poll-action.function";

describe("poll-action", () => {
    it("should timeout after maxDuration if action rejects", async () => {
        // GIVEN
        const updateInterval = 200;
        const maxDuration = 1000;
        const action = jest.fn(() => {
            return Promise.reject(false);
        });

        // WHEN
        const start = Date.now();
        try {
            await timeout(updateInterval, maxDuration, action);
        } catch (e) {
            expect(e).toBe(`Action timed out after ${maxDuration} ms`);
        }
        const end = Date.now();

        // THEN
        expect((end - start)).toBeGreaterThanOrEqual(maxDuration);
    });

    it("should timeout after maxDuration if action resolve != true", async () => {
        // GIVEN
        const updateInterval = 200;
        const maxDuration = 1000;
        const action = jest.fn(async () => {
            return false;
        });

        // WHEN
        const start = Date.now();
        try {
            await timeout(updateInterval, maxDuration, action);
        } catch (e) {
            expect(e).toEqual(`Action timed out after ${maxDuration} ms`);
        }
        const end = Date.now();

        // THEN
        expect((end - start)).toBeGreaterThanOrEqual(maxDuration);
    });

    it("should resolve after updateInterval if action resolves", async () => {
        // GIVEN
        const updateInterval = 200;
        const maxDuration = 1000;
        const action = jest.fn(() => {
            return Promise.resolve(true);
        });

        // WHEN
        const start = Date.now();
        await timeout(updateInterval, maxDuration, action);
        const end = Date.now();

        // THEN
        expect((end - start)).toBeLessThan(updateInterval);
        expect(action).toBeCalledTimes(1);
    });

    it("should resolve after updateInterval if action resolves != true", async () => {
        // GIVEN
        const updateInterval = 200;
        const maxDuration = 1000;
        const action = jest.fn(async () => {
            return true;
        });

        // WHEN
        const start = Date.now();
        await timeout(updateInterval, maxDuration, action);
        const end = Date.now();

        // THEN
        expect((end - start)).toBeLessThan(updateInterval);
        expect(action).toBeCalledTimes(1);
    });

    it("should retry until action succeeds", async () => {
        // GIVEN
        const updateInterval = 200;
        const maxDuration = 1000;
        const delay = 2.5 * updateInterval;
        const start = Date.now();
        const action = jest.fn(() => {
            const interval = (Date.now() - start);
            return new Promise<boolean>((resolve, reject) => (interval > delay) ? resolve(true) : reject());
        });

        // WHEN
        const result = await timeout(updateInterval, maxDuration, action);
        const end = Date.now();

        // THEN
        expect((end - start)).toBeGreaterThanOrEqual(delay);
        expect(result).toBeTruthy();
    });

    it("should fail after timeout if timeout < retry interval", async () => {
        // GIVEN
        const updateInterval = 1000;
        const maxDuration = 200;
        const action = jest.fn(() => Promise.resolve(false));

        // WHEN
        const start = Date.now();
        try {
            await timeout(updateInterval, maxDuration, action);
        } catch (e) {
            expect(e).toEqual(`Action timed out after ${maxDuration} ms`);
        }
        const end = Date.now();

        // THEN
        expect(action).toBeCalledTimes(1);
        expect((end - start)).toBeLessThan(updateInterval);
    });
});
