"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IFocus = require("./IFocus");
var fs = require("fs");
var rapidSample = IFocus.rapidSample, getOriginalEstimates = IFocus.getOriginalEstimates;
var idLdaDict = JSON.parse(fs.readFileSync("../../data/random/LDA/alpha=0.3/idLdaDict.json", "utf-8"));
/* const groups: { id: string; value: number }[][] = [];

const demension = 10;
for (let i = 0; i < demension; i++) {
  groups.push([]);
}
for (let k in idLdaDict) {
  let maxIndex = -1;
  let maxV = -1;
  for (let i = 0; i < idLdaDict[k].length; i++) {
    if (idLdaDict[k][i] > maxV) {
      maxV = idLdaDict[k][i];
      maxIndex = i;
    }
    const p = { id: k, value: maxV };
  }
  groups[maxIndex].push(p);
}
for (let i = 0; i < groups.length; i++) {
  console.log(`${i}`, groups[i].length);
} */
function getRelations(es) {
    var r = [];
    for (var i = 0; i < es.length; i++) {
        for (var j = i; j < es.length; j++) {
            if (es[i] > es[j]) {
                r.push(1);
            }
            else {
                r.push(0);
            }
        }
    }
    return r;
}
function compareRelations(r1, r2) {
    var count = 0;
    for (var i = 0; i < r1.length; i++) {
        if (r1[i] == r2[i]) {
            count += 1;
        }
    }
    return count / r1.length;
}
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
var groupNumber = 10;
var maxPointsCount = 100;
var pointCounts = [];
var itemCount = 0;
var groups = [];
for (var i = 0; i < groupNumber; i++) {
    var group = [];
    for (var j = 0; j < maxPointsCount; j++) {
        if (j % 3 == 0) {
            var item = {
                id: ++itemCount,
                value: getRandomNumber(i / 13, i / 10)
            };
            group.push(item);
        }
        else {
            var item = {
                id: ++itemCount,
                value: getRandomNumber(i / 20, i / 10)
            };
            group.push(item);
        }
    }
    groups.push(group);
}
var rList = [];
for (var i = 0; i < 1; i++) {
    var groups2 = JSON.parse(JSON.stringify(groups));
    var e1 = getOriginalEstimates(groups2);
    var estimates = rapidSample(groups2, 0.05);
    var r1 = getRelations(e1);
    var r2 = getRelations(estimates);
    var ratio = compareRelations(r1, r2);
    rList.push(ratio);
}
console.log("rList: ", rList);
