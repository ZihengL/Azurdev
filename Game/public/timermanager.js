function TimerManager() {
    this.timers = [];
}

TimerManager.prototype.update = function(deltaTime) {
    this.timers.forEach(function(timer) {
        timer.time -= deltaTime;
        if (timer.time <= 0) {
            timer.callback();
            timer.completed = true;
        }
    });

    // Clean up completed timers
    this.timers = this.timers.filter(timer => !timer.completed);
};

TimerManager.prototype.addTimer = function(duration, callback) {
    this.timers.push({ time: duration, callback: callback, completed: false });
};