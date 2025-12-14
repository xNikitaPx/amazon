import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

const deliveryOptions = [
  {
    id: "1",
    deliveryDays: 7,
    priceCents: 0,
  },
  {
    id: "2",
    deliveryDays: 3,
    priceCents: 499,
  },
  {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
  },
];

function getDeliveryOption(deliveryOptionId) {
  return (
    deliveryOptions.find((option) => option.id === deliveryOptionId) ||
    deliveryOptions[0]
  );
}

function calculateDeliveryDate(deliveryOption) {
  const today = dayjs();
  let deliveryDate = today.add(deliveryOption.deliveryDays, "days");
  const dateString = deliveryDate.format("dddd, MMMM D");
  return dateString;
}

export { deliveryOptions, getDeliveryOption, calculateDeliveryDate };
