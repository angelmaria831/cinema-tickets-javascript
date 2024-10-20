export default class InvalidPurchaseException extends Error {
  constructor(message = "Invalid Purchase", errorCode = null) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode; // Optional error code for future extension
  }
}
