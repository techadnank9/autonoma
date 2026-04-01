import { createApiApp } from "./app";
import { bootstrapApiRuntime } from "./bootstrap";

bootstrapApiRuntime();

const app = createApiApp();

export default app;
