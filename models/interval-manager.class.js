class IntervalManager {}

IntervalManager.intervals = [];

IntervalManager.setInterval = function (fn, time) {
    const id = setInterval(fn, time);
    IntervalManager.intervals.push(id);
    return id;
};

IntervalManager.clearAll = function () {
    IntervalManager.intervals.forEach(id => clearInterval(id));
    IntervalManager.intervals = [];
};
