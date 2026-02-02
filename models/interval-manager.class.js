class IntervalManager {}

IntervalManager.intervals = [];

/**
 * Creates a new interval and registers it in the IntervalManager registry.
 * @param {Function} fn - The callback function executed on each interval tick.
 * @param {number} time - Interval delay in milliseconds.
 * @param {string} [label="unnamed"] - Optional label for debugging and tracking.
 * @returns {number} The interval ID returned by setInterval.
 */
IntervalManager.setInterval = function (fn, time, label = "unnamed", owner = "global") {
    const id = setInterval(fn, time);

    IntervalManager.intervals.push({
        id,
        label,
        time,
        owner
    });

    return id;
};

/**
 * Clears all intervals that were registered through IntervalManager
 * and resets the registry. Used when switching worlds or stopping the game.
 */
IntervalManager.clearAll = function () {
    IntervalManager.intervals.forEach(obj => clearInterval(obj.id));
    IntervalManager.intervals = [];
};

IntervalManager.clearByOwner = function (owner) {
    IntervalManager.intervals = IntervalManager.intervals.filter(obj => {
        if (obj.owner === owner) {
            clearInterval(obj.id);
            return false;
        }
        return true;
    });
};

/** clear specifif Intervall */
IntervalManager.clearInterval = function (label) {
    const index = IntervalManager.intervals.findIndex(obj => obj.label === label);
    if (index !== -1) {
        clearInterval(IntervalManager.intervals[index].id);
        IntervalManager.intervals.splice(index, 1);
    }
};
