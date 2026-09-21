# LastCup

Caffeine's half-life is about 5 hours, so an afternoon coffee is a bedtime problem in
disguise. LastCup logs today's caffeine (with realistic mg per drink), projects how much
will still be in your system at your bedtime, and tells you the exact clock time of your
last safe cup - or breaks it to you that the ship has sailed.

- No signup, nothing to install - pure static HTML/JS; today's log persists per-day in
  `localStorage`
- Metabolism settings (4h / 5h / 6.5h half-life) for fast, average and sensitive
  caffeine metabolizers
- `engine.js` holds the decay math as pure functions, shared between the app and node tests

## Use it

Open `index.html`, or visit the deployed site.

## Run locally

Any static server works:

```
python3 -m http.server
```

Then open http://localhost:8000/.

## Engine tests

The node suite covers exponential decay, multi-dose summation, the cutoff solve
(including the negative-budget edge), over-budget detection, and the drink bank.
