import {busyWaitForNanoSeconds, sleep} from "./sleep.function";

describe("sleep", () => {
    it("should resolve after x ms", async () => {
        // GIVEN
        const timeout = 500;

        // WHEN
        const before = Date.now();
        await sleep(timeout);
        const after = Date.now();

        // THEN
        expect(after - before).toBeGreaterThanOrEqual(timeout);
    });
});

describe("busyWaitForNanoSeconds", () => {
    it("should resolve after x ns", async () => {
        // GIVEN
        const timeoutNs = 5_000_000;
        const timeoutMs = 5;

        // WHEN
        const before = Date.now();
        await busyWaitForNanoSeconds(timeoutNs);
        const after = Date.now();

        // THEN
        expect(after - before).toBeGreaterThanOrEqual(timeoutMs);
    });
});
