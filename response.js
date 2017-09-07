class Response {
  constructor(result, hasResult=false) {
    this.result = result;
    this.hasResult = hasResult;
  }

  get() {
    return this.result;
  }

  has() {
    return this.hasResult;
  }
}

module.exports = Response;