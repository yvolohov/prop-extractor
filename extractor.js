const Response = require('./response');

class Extractor {
  constructor() {
    this.path = '';
    this.pathHasArrays = false;
    this.decodedPath = [];
    this.filters = {};
    this.arrayRegex = /^\[.*\]$/;
    this.result = undefined;
    this.hasResult = false;
  }

  extractFrom(object) {
    this._checkArgumentType(object, 'object', 'object');

    if (this.decodedPath.length == 0) {
      throw new Error('Path not found');
    }

    this.result = (this.pathHasArrays) ? [] : undefined;
    this.hasResult = false;
    this._parseRecursively(object, 0);

    return new Response(this.result, this.hasResult);
  }

  setPath(path) {
    this._checkArgumentType(path, 'string', 'path');
    this.path = path;
    this.decodedPath = this._decodePath(this.path);
  }

  setFilter(name, callback) {
    this._checkArgumentType(name, 'string', 'name');
    this._checkArgumentType(callback, 'function', 'callback');
    this.filters[name] = callback;
  }

  removeFilter(name) {
    this._checkArgumentType(name, 'string', 'name');
    delete this.filters[name];
  }

  removeAllFilters() {
    this.filters = {};
  }

  _parseRecursively(object, segmentIdx) {
    if (this._isEndOfPath(segmentIdx)) {
      this.hasResult = true;

      if (this.pathHasArrays) {
        this.result.push(object);
      }
      else {
        this.result = object;
      }
      return;
    }

    let currentSegment = this.decodedPath[segmentIdx];

    if (currentSegment.type === 'array' && Array.isArray(object)) {
      let array = object;

      if (currentSegment.filter !== '') {
        if (!(currentSegment.filter in this.filters)) {
          throw new Error(`Filter ${currentSegment.filter} not defined`);
        }
        array = object.filter(this.filters[currentSegment.filter]);
      }

      for (let arrayIdx in array) {
        let element = array[arrayIdx];
        this._parseRecursively(element, segmentIdx + 1);
      }
    }
    else if (currentSegment.type === 'object' && (typeof object === 'object') && object !== null) {
      if (segmentIdx > 0) {
        let name = currentSegment.name;

        if (name in object) {
          this._parseRecursively(object[name], segmentIdx + 1);
        }
      }
      else {
        this._parseRecursively(object, segmentIdx + 1);
      }
    }
  }

  _isEndOfPath(segmentIdx) {
    return (segmentIdx > (this.decodedPath.length - 1));
  }

  _checkArgumentType(argument, type, argumentName) {
    if ((typeof argument !== type) || (argument === null && type !== 'null')) {
      throw new Error(`Argument '${argumentName}' isn't ${type}`);
    }
  }

  _decodePath(path) {
    let parts = path.split('.');
    let decodedPath = [];
    this.pathHasArrays = false;

    parts.forEach((currentPart, index) => {
      if (this.arrayRegex.test(currentPart)) {
        let filterName = currentPart.substring(1, currentPart.length - 1);
        decodedPath.push({
          type: 'array',
          filter: filterName
        });
        this.pathHasArrays = true;
      }

      else if (currentPart.length > 0) {
        decodedPath.push({
          type: 'object',
          name: currentPart
        });
      }

      else {
        throw new Error('Template segment is empty string');
      }
    });

    return decodedPath;
  }
}

module.exports = Extractor;