function Vector2D(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}

Vector2D.prototype.add = function (vector) {
  return new Vector2D(this.x + vector.x, this.y + vector.y);
};

Vector2D.prototype.subtract = function (vector) {
  return new Vector2D(this.x - vector.x, this.y - vector.y);
};

Vector2D.prototype.multiply = function (scalar) {
  return new Vector2D(this.x * scalar, this.y * scalar);
};

Vector2D.prototype.divide = function (scalar) {
  return new Vector2D(this.x / scalar, this.y / scalar);
};

Vector2D.prototype.magnitude = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector2D.prototype.normalize = function () {
  const mag = this.magnitude();
  return new Vector2D(this.x / mag, this.y / mag);
};

Vector2D.prototype.dot = function (vector) {
  return this.x * vector.x + this.y * vector.y;
};

Vector2D.prototype.distance = function (vector) {
  const dx = this.x - vector.x;
  const dy = this.y - vector.y;

  return Math.sqrt(dx * dx + dy * dy);
};

Vector2D.prototype.difference = function (vector) {
  const x = Math.max(this.x, vector.x) - Math.min(this.x, vector.x);
  const y = Math.max(this.y, vector.y) - Math.min(this.y, vector.y);

  return new Vector2D(x, y);
};


Vector2D.prototype.direction = function (target) {
  return target.subtract(this).normalize();
};

Vector2D.prototype.center = function (size) {
  return this.add(size.divide(2));
}

Vector2D.prototype.deltaX = function (target) {
  return target.x - this.x;
}

Vector2D.prototype.deltaY = function (target) {
  return target.y - this.y;
}

Vector2D.prototype.isEqual = function (target) {
  return this.deltaX(target) === 0 &&
    this.deltaY(target) === 0;
}

Vector2D.prototype.copy = function () {
  return new Vector2D(this.x, this.y);
}

Vector2D.prototype.toPolarDirection = function (target) {
  // var normalized = this.direction(target);
  var angle = (Math.atan2(this.y, this.x) * 180) / Math.PI;

  for (var key in DIRECTIONS) {
    var direction = DIRECTIONS[key];
    var intervals = direction.intervals;
    var min = intervals[0], max = intervals[1];

    if (angle >= min && angle < max) {
      return direction.index;
    }
  }
};

// In place (No new vector obj created)

Vector2D.prototype.moveTo = function (x, y) {
  this.x = x;
  this.y = y;
};

Vector2D.prototype.translate = function (x, y) {
  this.x += x;
  this.y += y;
};

Vector2D.prototype.multiplyInPlace = function (scalar) {
  this.x *= scalar;
  this.y *= scalar;
};

Vector2D.prototype.divideInPlace = function (scalar) {
  this.x = this.x / scalar;
  this.y = this.y / scalar;
};

Vector2D.prototype.dotInPlace = function (x, y) {
  this.x *= x;
  this.y *= y;
};

// Render

Vector2D.prototype.join = function (ctx, other) {
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(other.x, other.y);
  ctx.stroke();
};

Vector2D.prototype.render = function (ctx, fillstyle = "red") {
  ctx.fillStyle = fillstyle;
  ctx.beginPath();
  ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
  ctx.fill();
};

Vector2D.prototype.str = function () {
  return "x: " + this.x + " - y: " + this.y;
};

