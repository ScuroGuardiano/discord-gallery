export default class LinkExpiredError extends Error {
  constructor() {
    super('Link exprired');
    this.name = "LinkExpiredError";
  }
}
