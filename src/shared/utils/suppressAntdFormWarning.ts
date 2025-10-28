"use client";

if (process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Instance created by `useForm`")
    ) {
      return;
    }
    originalError(...args);
  };
}
