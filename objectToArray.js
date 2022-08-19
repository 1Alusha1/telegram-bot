export default function obcjectToArray(data) {
  if (data) {
    return Object.keys(data).map((key) => {
      return {
        id: key,
        ...data[key],
      };
    });
  } else {
    return [];
  }
}
