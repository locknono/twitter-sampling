"use strict";
function rapidSample(groups, delta) {
    var k = groups.length;
    var A = [];
    var m = 1;
    var sampledGroups = groups.map(function (e) { return drawSamplesFromOneGroup(e, m); });
    var estimates = sampledGroups.map(function (e) { return getEstimateForOneGroup(e); });
    for (var i = 0; i < k; i++) {
        A.push(i);
    }
    var N = getMaxNInActiveGroups(A, groups);
    while (A.length > 0) {
        m = m + 1;
        var c = 1;
        var part1 = 1 - (m - 1) / N;
        var part2 = 2 * Math.log2(Math.log2(m));
        var part3 = Math.log2((Math.pow(Math.PI, 2) * k) / (3 * delta));
        var epsilon = c * Math.sqrt((part1 * (part2 + part3)) / (2 * m));
        for (var i = 0; i < A.length; i++) {
            var singleSample = drawSamplesFromOneGroup(groups[A[i]], 1)[0];
            estimates[A[i]] =
                ((m - 1) / m) * estimates[A[i]] + (1 / m) * singleSample.value;
        }
        for (var i = A.length - 1; i >= 0; i--) {
            if (ifActive(estimates, A[i], epsilon) === false) {
                A.splice(i, 1);
            }
        }
    }
    return estimates;
}
/**
 * get max n in active groups
 */
function getMaxNInActiveGroups(A, groups) {
    var v = Number.MIN_VALUE;
    for (var i = 0; i < A.length; i++) {
        if (groups[A[i]].length > v)
            v = groups[A[i]].length;
    }
    return v;
}
function drawSamplesFromOneGroup(group, count) {
    var samplesIndexSet = new Set();
    while (samplesIndexSet.size < count) {
        var randomInt = Math.round(Math.random() * (group.length - 1));
        samplesIndexSet.add(randomInt);
    }
    var samplesIndexList = Array.from(samplesIndexSet).sort(function (a, b) { return b - a; });
    var samples = [];
    for (var i = 0; i < samplesIndexList.length; i++) {
        samples.push(group[samplesIndexList[i]]);
    }
    for (var i = samplesIndexList.length - 1; i >= 0; i--) {
        group.splice(samplesIndexList[i], 1);
    }
    return samples;
}
function getEstimateForOneGroup(group) {
    var sum = 0;
    for (var _i = 0, group_1 = group; _i < group_1.length; _i++) {
        var v = group_1[_i];
        sum += v.value;
    }
    return sum / group.length;
}
function ifActive(estimates, index, epsilon) {
    for (var i = 0; i < estimates.length; i++) {
        if (index === i)
            continue;
        if (estimates[index] + epsilon > estimates[i] - epsilon &&
            estimates[index] + epsilon < estimates[i] + epsilon) {
            return true;
        }
        if (estimates[index] - epsilon > estimates[i] - epsilon &&
            estimates[index] - epsilon < estimates[i] + epsilon) {
            return true;
        }
    }
    return false;
}
function getOriginalEstimates(groups) {
    var es = [];
    for (var i = 0; i < groups.length; i++) {
        es.push(0);
    }
    for (var i = 0; i < groups.length; i++) {
        for (var j = 0; j < groups[i].length; j++) {
            var point = groups[i][j];
            es[i] += point.value;
        }
    }
    console.log("es: ", es);
    return es;
}
module.exports = { rapidSample: rapidSample, getOriginalEstimates: getOriginalEstimates };
