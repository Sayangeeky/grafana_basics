function getRandomValue(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function doSomeHeavyTask() {
  const ms =
    getRandomValue([100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000]) /
    100;
  const shouldThrowError =
    getRandomValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) === 8;

  if (shouldThrowError) {
    const randomError = getRandomValue([
      "DB Payment Failure",
      "DB Server is down",
      "Access denied",
      "Not found error",
    ]);
    return Promise.reject(new Error(randomError));
  } else {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(ms);
      }, ms);
    });
  }
}

module.exports = { doSomeHeavyTask };
