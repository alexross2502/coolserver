import { timeSize } from "./constants";

export default async function (tariff, size) {
  return tariff * timeSize[size];
}
