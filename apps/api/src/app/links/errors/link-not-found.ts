export default class LinkNotFoundError extends Error {
  constructor() {
    super("Link was not found");
    this.name = 'LinkNotFoundError';
  }
}
