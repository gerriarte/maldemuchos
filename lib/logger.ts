type LogLevel = "debug" | "info" | "warn" | "error";

function log(
  level: LogLevel,
  module: string,
  fn: string,
  message: string,
  extra?: Record<string, unknown>,
) {
  const entry = {
    level,
    module,
    function: fn,
    message,
    ...extra,
  };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (module: string, fn: string, message: string, extra?: Record<string, unknown>) =>
    log("debug", module, fn, message, extra),
  info: (module: string, fn: string, message: string, extra?: Record<string, unknown>) =>
    log("info", module, fn, message, extra),
  warn: (module: string, fn: string, message: string, extra?: Record<string, unknown>) =>
    log("warn", module, fn, message, extra),
  error: (module: string, fn: string, message: string, extra?: Record<string, unknown>) =>
    log("error", module, fn, message, extra),
};
