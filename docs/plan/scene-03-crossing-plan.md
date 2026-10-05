# Scene 03 — Crossing, countdown and cards

**Status:** desktop presence is on the page (user choice, 2026-10-05):
W2, C2, T1. The phone is unchanged. Awaiting a look.
**Created:** user request, 2026-10-05
**Review:** <http://localhost:5173/#chapter-03>

The approved build stays in
[`scene-03-implementation-plan.md`](scene-03-implementation-plan.md). This
file is the reopen: whether the countdown, the route and the three cards
should stay as they are.

## What this chapter is for

01 and 02 do not tell the ferry story.

- 01 is the harbour at dusk. “The night crossing begins” is the visitor’s
  night, not a boat.
- 02 is the Clock Tower and the trains that left this shore for the north.
  Same Kowloon edge, a different journey.

03 is the first chapter that names the Star Ferry. Whatever we keep here is
the whole ferry essay. It is not a repeat of the chapters before it.

## How it feels now

The page already has a departure: the title, the standfirst (“Kowloon to
the Island, the slow way, every few minutes.”), the split-flap board
(CENTRAL, then 3 MIN / 2 MIN / 1 MIN / ARRIVING), and the ticket.

Under that, three numbered cards:

1. **Facing Forward** — the seat backs flip so you face the way you are going.
2. **A Daily Crossing** — a commute, the same one their grandparents made.
3. **The Route** — a green line from Tsim Sha Tsui to Central, a dot that
   moves with the scroll, and “Crossing since 1888”.

They arrive one after another, then the dot and the minutes are supposed
to be the same journey. In practice they are not one story.

The cards are an index. Each has its own number, title and fact. Two of
them never move. Only the third card is the crossing, and it sits in the
footer row while the minutes sit up by the title. Nothing on the page says
those two belong together.

On a phone the three cards are hidden. The minutes still change. There is
no line to connect them to.

## Why the minutes jump

The link exists in the timing, and it is too short to feel.

The camera holds for 60svh. The board appears near the start and stays on
3 MIN. The dot only travels in the last quarter of that hold (dwell share
0.70 to 0.96, about 16svh). The steps inside that quarter are:

| What you read | Share of the chapter | Scroll inside the hold |
|---|---|---|
| 3 MIN | from the board’s arrival until about 0.78 | most of the scene |
| 2 MIN | about 0.78 to 0.84 | about 4svh |
| 1 MIN | about 0.84 to 0.91 | about 4svh |
| ARRIVING | about 0.91 to the end | about 3svh |

One flick covers 2 MIN and 1 MIN together. The board then aims at the
latest step, so 2 MIN never lands. That is the jump from 3 MIN to 1 MIN.

Scrolling back does not restore an earlier minute. The board only counts
forward until you leave the chapter (user choice, 2026-10-04). If the
minutes become something you scroll through, that one-way rule works
against the feeling.

## Do the three cards earn their place?

| Card | What it adds | What already says this |
|---|---|---|
| Facing Forward | How you sit | Nothing else. It is a true detail, and it is not the crossing. |
| A Daily Crossing | What the trip means | The standfirst already calls it the slow way, every few minutes. |
| The Route | The trip as a line | The standfirst, the board’s CENTRAL, and the ticket (Tsim Sha Tsui to Central, HK$5). “Crossing since 1888” lives only on this card on desktop. |

They are three topics beside a departure, not one departure becoming a
crossing. The seat fact can go without leaving a hole. The grandparents
line is the only sentence that says why the trip matters. The moving line
is the one piece that should be felt, and it is buried in the third card.

## Options

The ferry, the cameras, the water and the ticket picture stay as they are.
These options change words, cards and timing only.

### A — One instrument

Drop all three cards. Keep the title, the standfirst, the board and the
ticket. Move the route line up with the board, so destination, minutes and
the dot are one object. Run that line across most of the 60svh hold, with
a clear stretch for 3, for 2, for 1, and for ARRIVING. Show the same line
on phones. Keep “Crossing since 1888” as the small line it already is on
phones, on desktop too.

This is the clearest reading: you are waiting for a boat, and the wait is
the scroll.

### B — One sentence beside the instrument

Same as A, and keep a single line of meaning under the standfirst. The
line to keep is “A Daily Crossing”: a commute, the crossing their
grandparents made. Drop Facing Forward. Drop the route card; the line
lives with the board.

Use this if the chapter should say why the ferry matters, not only that
one is due.

### C — Keep the facts, free the line

Leave the three cards as a quiet row that arrives and sits. Take the
moving dot out of the third card and put it with the board, on the same
long timing as A. The third card keeps the place names and “Crossing
since 1888”, or loses the diagram and stays a caption. Phones still need
the line, because they do not show the cards.

Use this if the seat fact and the grandparents line both still feel
necessary after seeing A or B.

### D — Slow the link only

Keep the layout. Stretch the existing dot from the last quarter of the
hold across most of it, and space the four readings so a normal scroll
cannot skip 2 MIN. Leave the board at the top and the line in the third
card.

This fixes the jump. It does not make the link obvious, and phones still
have minutes with no line.

## Recommendation

A, unless the grandparents line still feels necessary, in which case B.
The thing to feel is one crossing: the line and the minutes together, for
most of the hold, on desktop and on a phone. The numbered row is what
makes that hard to see.

If the minutes are the scroll, they should follow it both ways. That
replaces the one-way countdown from 2026-10-04.

## Chosen (user choice, 2026-10-05)

A is on the page. The three cards are gone. The title, standfirst,
“Crossing since 1888”, departure board and ticket remain. The route line
and the place names sit on the board, on desktop and on a phone. The dot
and the minutes share dwell 0.10–0.96 in four even stretches, and the
board counts back when the dot moves back. The ferry, the cameras and the
ticket picture are unchanged.

## Desktop after A (user request, 2026-10-05)

The phone is fine. Leave it. A wide window, including a short one, looks
empty.

On desktop now:

- Top left is the title, one line (“Kowloon to the Island, the slow way,
  every few minutes.”), then “CROSSING SINCE 1888” with nothing under it.
- The countdown is a small board in the sky (top of the window, left of
  the moon). The due tiles are 1.125rem.
- The ticket sits at the lower right at `min(15vw, 16.5rem)`.
- The lower half is the ferry and open water, with little to read.

The phone already stacks the words, the board and the ticket. This pass
does not move or resize the phone.

The ferry fills the left and centre of the picture. A large countdown
dropped straight onto the cabin would cover the boat. The open places are
the left column under the title, the water in front of the hull, and the
lower right where the ticket already sits.

### Words

One line is not enough on a wide screen. The year on its own looks
stranded. These are the sentences we already have. No new facts.

- Standfirst: “Kowloon to the Island, the slow way, every few minutes.”
- Seats: “Inside, the wooden seat backs flip over, so passengers always
  face the way they are going.”
- Meaning: “Not a view but a commute: a few quiet minutes, the same
  crossing their grandparents made.”

**W1 — Two sentences. The year joins the second.**
The standfirst stays. The meaning line follows, and the year is its
ending, not a label: “…the same crossing their grandparents made, running
since 1888.” The seat sentence stays off. The left column is a short
paragraph. The lonely small-caps line goes.

**W2 — Two sentences. The year captions the countdown.**
The standfirst and the meaning line sit under the title as two sentences.
“Since 1888” leaves that column and sits on the enlarged board, under the
route, so the date belongs to the crossing. The seat sentence stays off.

**W3 — Three sentences.**
Standfirst, then the seats, then the meaning, as plain lines. No cards and
no numbers. The year is the last line of that column, written as a
sentence (“The crossing has run since 1888.”), not as a label by itself.

### Countdown

Desktop only. It moves down and gets much bigger. The route stays under
the minutes. The phone board stays in the column.

**C1 — Under the words.**
The board leaves the sky and sits in the left column, under the sentences,
the way the phone already stacks them. Due tiles about twice the current
size. Risk: on a tall window it can cover the ferry’s cabin. On a short
window the column is the natural place, because there is less water below.

**C2 — In the water, in front of the hull.**
The board sits low and toward the centre, in the open water ahead of the
bow, clear of the cabin windows and clear of the ticket. Due tiles about
twice the current size. The route becomes a longer line. This fills the
empty lower middle without sitting on the boat.

### Ticket

Desktop only. The phone ticket stays at 46vw.

**T1 — About twice as wide.**
`min(30vw, 32rem)` at the lower right, still clear of the vertical
天星小輪 label. It stays off the ferry’s hull and off the countdown.

**T2 — Paired with the countdown.**
The ticket grows until its height matches the enlarged board, so the two
read as a pair along the bottom. It stops growing when it would meet the
countdown or the hull.

On a short desktop the countdown and the ticket share the bottom edge.
They shrink together before they cover the title or each other.

### Recommendation

W2, C2 and T1. The left side becomes two sentences. The year stops sitting
alone and captions the crossing. The countdown drops into the open water
and grows. The ticket grows with it. The phone stays as it is.

**Chosen (user choice, 2026-10-05): W2, C2, T1.** On desktop the standfirst
is followed by the commute sentence. “Since 1888” captions the countdown.
The board sits low, in line with the words, clear of the ticket, and the
due tiles are about twice the old size. The desktop ticket is `min(22.5vw, 24rem)`, about three quarters of the
first enlargement, so the countdown stays the louder object. Both shrink
when the window is shorter than 820px. The phone column is unchanged.

## Frozen until the next choice

- The phone layout.
- Cameras, ferry pose, water, wake, buoy, skyline, haze and lens.
- Ticket artwork. The desktop ticket may only change size and position.
- Scenes other than 03.
- No new illustration.

## Checklist — desktop presence

### 7 — Choose the desktop shape

- [x] Pick W1, W2 or W3. W2.
- [x] Pick C1 or C2. C2.
- [x] Pick T1 or T2. T1.

**Done when:** the three choices are made. The phone stays as it is.

### 8 — Give the desktop column a second beat

- [x] Add the chosen sentences under the title.
- [x] Remove the lone “CROSSING SINCE 1888” label, and put the year where
  the word choice says. It captions the desktop countdown. The phone
  still shows it under the standfirst.
- [x] Leave the phone column as it is.

**Done when:** a wide window has more than one line to read, and the year
is no longer a label on its own.

### 9 — Lower and enlarge the countdown

- [x] Move the desktop board to the chosen place. It sits low, to the left
  of the ticket.
- [x] Make the due tiles about twice the current 1.125rem.
- [x] Keep the route directly under the minutes.
- [x] On a short window, keep the board off the title and off the ticket.

**Done when:** the countdown is the large object in the lower part of a
wide window, and the minutes still match the dot.

### 10 — Enlarge the desktop ticket

- [x] Apply T1 or T2. T1.
- [x] Keep it lower right, off the hull, off the countdown, and left of
  the 天星小輪 label.
- [x] Leave the phone ticket at 46vw.

**Done when:** the ticket has the same kind of presence as the countdown,
on a tall window and on a short one.

### 11 — Review

- [x] Desktop, short desktop, and a phone at
  <http://localhost:5173/#chapter-03>. Checked at a wide window, at
  1280 × 720, and at 390 × 844.
- [x] The phone still matches the look already accepted.
- [x] The ferry picture is unchanged.

**Done when:** the wide window feels occupied, and the phone does not.

- Cameras, ferry pose, water, wake, buoy, skyline, haze and lens.
- Ticket artwork and the split-flap board.
- Scenes other than 03.
- No new illustration.

## Checklist

### 1 — Choose the shape

- [x] Pick A, B, C or D (user choice, 2026-10-05: A).
- [x] If the minutes follow the scroll, confirm they may count back while
  the chapter is on screen. Counting back is part of A.

**Done when:** one option is chosen and the reverse-count question is
answered. No page change before that.

### 2 — Give the line room

- [x] Move the route range so the dot travels through most of the 60svh
  hold, not only the last quarter. The range is dwell 0.10–0.96.
- [x] Space 3 MIN, 2 MIN, 1 MIN and ARRIVING so each is a stretch of
  scroll, and a single flick cannot skip 2 MIN. The four readings are
  even quarters of that range, and the dot moves linearly.
- [x] Keep the values in `SCENE_03_CROSSING` in `src/story/scene03/config.js`.

**Done when:** holding still on the chapter can show each minute, and a
steady scroll visits all four readings.

### 3 — Make the link one object

- [x] For A, B or C, draw the route with the departure board, not inside a
  footer card.
- [x] For D, leave the line in the third card and skip this step’s move.
  Not used.
- [x] Use the same line on phones. Phones currently hide the cards, so a
  desktop-only line leaves the jump unexplained there. The line is on the
  board, so phones show it too.

**Done when:** looking at the minutes, the dot is in the same group, on
both widths.

### 4 — Decide the words that remain

- [x] A: no cards. Keep the standfirst. Put “Crossing since 1888” under it
  on desktop, as phones already do.
- [x] B: one meaning line, the daily-crossing sentence. No seat card, no
  route card. Not used.
- [x] C: three cards stay; the third no longer owns the moving dot. Not used.
- [x] D: wording unchanged. Not used.

**Done when:** 03 reads as one departure, and no sentence is said twice
unless the choice above keeps it.

### 5 — Follow the scroll both ways

- [x] If confirmed in step 1, let the board step back when the dot moves
  back, and still blank when the chapter is left.
- [x] Reduced motion still shows the words without flipping. Stepped mode
  sets the tiles directly, as before.

**Done when:** scrolling up through 03 revisits 1 MIN, then 2 MIN, then
3 MIN, in step with the dot.

### 6 — Review

- [x] Desktop and phone at <http://localhost:5173/#chapter-03>. Checked at
  desktop, 390 × 844 and 320 × 720. The minutes and the dot stay together,
  and scrolling back revisits 1 MIN, 2 MIN and 3 MIN.
- [x] The ferry, the ticket and the other chapters look unchanged.
- [x] Update this file, `narrative-spine.md` and `CHANGELOG.md` with the
  choice.

**Done when:** the countdown and the line feel like one crossing, and the
chosen cards — or none — are the only words left.
