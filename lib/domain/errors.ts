export class ComplaintValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ComplaintValidationError";
  }
}

export class AnalyticsUnauthorizedError extends Error {
  constructor(message = "No autorizado") {
    super(message);
    this.name = "AnalyticsUnauthorizedError";
  }
}

export class ComplaintModerationUnavailableError extends Error {
  constructor(
    message = "No pudimos validar tu mensaje. Intentá de nuevo en unos minutos.",
  ) {
    super(message);
    this.name = "ComplaintModerationUnavailableError";
  }
}
