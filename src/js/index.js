let IS_INITED = false;
import { initAccordions } from "./accord";

export const dynamicFunctions = (context = document) => {
    if (IS_INITED && !context) {
        return;
    }

    initAccordions(context);
};

export const staticFunctions = () => {};
