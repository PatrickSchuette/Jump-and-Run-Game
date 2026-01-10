class IntervalManager {}

IntervalManager.intervals = [];

IntervalManager.setInterval = function (fn, time, label = "unnamed") {
    const id = setInterval(fn, time);

    IntervalManager.intervals.push({
        id,
        label,
        time
    });

    return id;
};

IntervalManager.clearAll = function () {
    IntervalManager.intervals.forEach(obj => clearInterval(obj.id));
    IntervalManager.intervals = [];
};
