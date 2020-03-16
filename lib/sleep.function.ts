export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const busyWaitForNanoSeconds = (duration: number) => {
  return new Promise(res => {
    const start = process.hrtime.bigint();
    let isWaiting = true;
    while (isWaiting) {
      if ((process.hrtime.bigint() - start) > duration) {
        isWaiting = false;
      }
    }
    res();
  });
};
