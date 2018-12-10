export const numberCommaFormat = (number, removeFirst) => {
  let newPrice = number;
  if (removeFirst) {
    newPrice = parseInt(number / 10) * 10
  }

  return newPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
