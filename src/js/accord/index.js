import { accord, getAccordInstance } from "./Accord";

export const initAccordions = (context) => {
    const accords = context.querySelectorAll(".js-accord");

    Array.from(accords).forEach((el) => {
        accord(el);
    });
};
