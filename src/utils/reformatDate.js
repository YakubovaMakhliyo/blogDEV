/** @format */

export function reformatDate(input) {
  let date = new Date(input);

  let options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Tashkent",
  };

  return date.toLocaleDateString("en-US", options);
}
