const sleep = (milliseconds: number) =>
  new Promise((res) => setTimeout(res, milliseconds));

export default sleep;
