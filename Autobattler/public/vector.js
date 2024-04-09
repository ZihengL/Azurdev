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

Vector2D.prototype.direction = function (target) {
  return target.subtract(this).normalize();
};

Vector2D.prototype.toPolarDirection = function (target) {
  var normalized = this.direction(target);
  var angle = (Math.atan2(normalized.y, normalized.x) * 180) / Math.PI;

  var directions = Object.keys(DIRECTIONS);
  for (var i = 0; i < directions.length; i++) {
    var direction = directions[i];
    var intervals = DIRECTIONS[direction];
    var minInterval = intervals[0];
    var maxInterval = intervals[1];

    if (angle >= minInterval && angle < maxInterval) return direction;
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
