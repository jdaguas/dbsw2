# Habit Tracker: Plan

What the site does, and the pieces each design system has to cover.
Everything happens in the browser: state resets on reload and nothing is saved.

## Habits

| Habit | How you log it | What shows progress |
|---|---|---|
| Water | Tap glasses: tapping the 5th fills 1–5; tapping the last filled one empties it | Bar: "5 of 8 glasses" |
| Reading | Stepper (− / + / +10), or type the page count | Bar: "12 of 20 pages" |
| Exercise | Clock dial: tap +5 / +15 min, or start and stop a timer | Ring fills toward the goal: "25 of 30 min" |
| Mood | Pick one face on a 5-point scale, add a note if you want | The picked face, highlighted |

## Screens

- **Today** (main view): date header, overall progress ("3 of 4 goals met"), one card per habit.
- **Habit detail panel**: opens from a card. Shows the last 7 days, the goal (editable), and reset.
- **Week**: a row per day, with a mark for each habit.

## Interactions (the brief needs at least two)

1. Tapping glasses fills the water bar
2. Stepping pages fills the reading bar
3. The exercise dial and timer fill the ring
4. Picking a mood
5. Opening and closing the detail panel
6. Switching tabs: Today / Week

## Components each design system needs

**Required by the brief, mapped to this site:**

| Brief component | Used for |
|---|---|
| Primary button | "Log", "Start" (the accent is only for these) |
| Secondary button | "Reset", "Undo" |
| Link | "See week →" |
| Text input | Page count, mood note |
| Select | Goal amount ("8 glasses"), units |
| Checkbox | Week view: done or not done per habit |
| Radio | Mood scale (one choice) |
| Toggle | Reminders on or off |
| Tabs | Today / Week |
| Filter chips | All / Body / Mind |
| Card | Habit card |
| List rows | Week history |
| Badge | Streak ("12 days"), "Goal met" |
| Modal / detail panel | Habit detail |

**Specific to this site:**

- Glass counter (a row of tappable glasses)
- Progress bar (empty, partway, goal met)
- Stepper (− / value / +)
- Clock dial / progress ring, with a timer
- Mood scale (5 faces)
- Overall summary ("3 of 4 goals met")

## States to design

- **Controls:** rest, hover, focus, pressed, selected, disabled
- **Glass:** empty, filled, hover (shows "fill to here"), focus
- **Progress:** empty, partway, goal met (the one place to celebrate)
- **Timer:** idle, running, paused
- **UI:** empty ("Nothing logged yet today"), loading, error ("Couldn't save"), success ("Logged")

## Accessibility notes

- Glasses and mood faces are real buttons or radios that work with the keyboard, not clickable images.
- Each glass needs a label: "Fill to 5 glasses".
- Progress bars and rings need a text value, not only a shape.
