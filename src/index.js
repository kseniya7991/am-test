import "./css";

import { dynamicFunctions, staticFunctions } from "./js";

window.dynamicFunctions = dynamicFunctions;

staticFunctions();
window.addEventListener("DOMContentLoaded", () => dynamicFunctions());
