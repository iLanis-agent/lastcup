/* LastCup engine - caffeine decay math, pure functions.
   Caffeine decays exponentially; sleep research says what matters is how much
   is still in your system at bedtime. */
(function (global) {
  'use strict';

  /* Residual mg from a dose taken `hours` ago (negative hours = future dose). */
  function residualMg(doseMg, hours, halfLife) {
    return doseMg * Math.pow(0.5, hours / halfLife);
  }

  /* Total residual mg at time T from doses [{mg, time}] where time is hours before T. */
  function residualAt(doses, atHoursFromNow, halfLife) {
    var t = 0;
    for (var i = 0; i < doses.length; i++) {
      t += residualMg(doses[i].mg, doses[i].hoursAgo + atHoursFromNow, halfLife);
    }
    return t;
  }

  /*
   * Latest safe time for one more dose of doseMg, given existing doses and a
   * target residual at bedtime. Returns hours-before-bedtime (can be negative
   * if even a dose right now would be too much, i.e. existing load is high).
   * Solves dose * 0.5^(h/halfLife) = remainingBudget  ->  h = halfLife * log2(dose/budget)
   */
  function hoursBeforeBed(doseMg, budgetMg, halfLife) {
    if (budgetMg <= 0) return -Infinity;
    return halfLife * (Math.log(doseMg / budgetMg) / Math.log(2));
  }

  /*
   * Full verdict: given existing doses, bedtime (hours from now), a planned new
   * dose size, residual budget at bed, and half-life.
   * Returns {
   *   atBedNow: mg currently projected at bedtime,
   *   overBudget: bool (existing doses already exceed budget),
   *   latestDoseHoursFromNow: when the new dose must happen by (hours from now),
   *   canStill: bool (a dose right now is still fine)
   * }
   */
  function verdict(doses, hoursToBed, doseMg, budgetMg, halfLife) {
    var atBedNow = residualAt(doses, hoursToBed, halfLife);
    var remaining = budgetMg - atBedNow;
    var hb = hoursBeforeBed(doseMg, remaining, halfLife); // hours before bedtime
    var latestFromNow = hb === -Infinity ? -Infinity : hoursToBed - hb;
    return {
      atBedNow: atBedNow,
      overBudget: atBedNow > budgetMg,
      latestDoseHoursFromNow: latestFromNow,
      canStill: latestFromNow >= 0
    };
  }

  /* Common drinks, mg per serving. */
  var DRINKS = [
    { name: 'Filter coffee', mg: 95 },
    { name: 'Espresso', mg: 63 },
    { name: 'Instant coffee', mg: 60 },
    { name: 'Black tea', mg: 47 },
    { name: 'Green tea', mg: 28 },
    { name: 'Cola', mg: 34 },
    { name: 'Energy drink', mg: 160 },
    { name: 'Pre-workout', mg: 200 },
    { name: 'Dark chocolate bar', mg: 24 }
  ];

  var api = { residualMg: residualMg, residualAt: residualAt, hoursBeforeBed: hoursBeforeBed, verdict: verdict, DRINKS: DRINKS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.LastCup = api;
})(typeof window !== 'undefined' ? window : globalThis);
