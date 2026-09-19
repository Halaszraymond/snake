# NOTES

A log of building Snake by prompting a coding agent. I did not open or edit
`index.html` myself — everything below was done by asking, in words.

---

## v1 — the first ask

**What I asked for:** the classic Snake, in one `index.html`, playable by
opening the file in a browser. Nothing fancy: a grid, a snake, food, a score,
and a game over. I deliberately asked for a plain version so that playing it
would tell me what it actually needs.

**What I got:** a 20×20 grid on a canvas, arrow keys to steer, red food, green
snake, score above the board, fixed speed, and a "Game Over" overlay with R to
restart.

Now to play it.

---

## Round 1 — playing v1

Played several rounds. Most of it was fine: the speed felt right, the food was
easy to see and landed in fair places, and when I died it was usually obvious
why. Nothing about it irritated me.

One thing was clearly broken.

**What I told the agent:** "When pressing up and left quickly after each other
the game ends and I'll have to reset. It's not entirely clear why I died in
that case."

**What was actually wrong:** the snake only moves once per tick, but my key
presses were changing its direction instantly. Moving right, pressing Up set
the direction to up — but the snake hadn't moved yet. Pressing Left before the
next tick was allowed, because the code only checked whether left was the
opposite of *up*, which it isn't. So the snake, still physically facing right,
was now pointed left, and on the next tick it walked straight into its own
neck. It looked like the game killing me for no reason.

**What changed:** turns now go into a short queue instead of being applied the
moment I press a key. Each tick takes one turn off the queue, so the snake
always completes a turn before the next one counts. Each new press is checked
against the last turn *queued* rather than the direction currently on screen,
which is what closes the gap. Pressing up-then-left fast now does what I meant:
the snake goes up, then left.

Arrow keys also no longer scroll the page while playing.

---

## Round 2 — the part I can't reach by hand

Replayed it. The turning is fixed: up-then-left fast now goes up, then left,
and hammering the reverse key just keeps me going straight. No new problems in
normal play.

But I could only get the snake so long before dying. I'm not good enough at
Snake to fill the board, and the end of the game is exactly where I'd expect a
bug to hide, so I asked the agent to play it through for me instead.

**What I asked:** "Can you play it yourself from beginning to end to see if
there are mistakes towards the end of the game? I couldn't find any, but I'm
not able to play it till the end because I don't have the skills."

**How it was tested:** rather than guessing, the agent ran the real script out
of `index.html` against a fake canvas and drove it with keypresses, reading the
board back out of the drawing calls — so it was the actual game being played,
not a copy of it. The bot followed a Hamiltonian cycle: a route that visits all
400 squares and returns to where it started. Follow it forever and you cannot
crash into yourself, so the snake plays perfectly and reaches maximum length.
Any failure is the game's fault, not a misplay.

It found two things, both invisible at the lengths I can actually reach.

### Winning froze the browser

The bot got to score 397 — snake length 400, every square on the board filled —
and the game hung. `placeFood()` picks a random square and retries until it
finds an empty one. With the board full there is no empty one, so it retried
forever. The test caught it spinning 200,000 times; in a real browser the tab
just locks up. Beating the game was the one move guaranteed to break it.

Fixed: filling the board is now detected as a win and shows "You win!" instead
of asking for a food square that cannot exist. The bot now plays a full game
and wins it in about 38,000 moves.

### Chasing my own tail killed me

Moving the head into the square the tail is leaving *on that same tick* counted
as a crash. It shouldn't — the tail moves out as the head moves in. This never
comes up with a short snake, which is why I never saw it, but in the endgame you
spend the whole time following your own tail around, so it would have killed me
constantly if I'd ever got that far.

Fixed: the tail square is excluded from the crash check, except when eating —
then the snake grows and the tail stays put, so hitting it really is a crash.

### Checking I didn't become immortal

Loosening a crash rule can quietly break dying altogether, so that was tested
too: driving into the top wall still kills, and turning back into the middle of
my own body still kills. Both do.

---

## Round 3 — a change I decided not to make

The obvious next thing was to make the snake speed up as you score. I asked
whether that's actually a rule of Snake, and it isn't — there is no canonical
Snake. What's universal is that you can't stop moving, eating makes you longer,
and you die on a wall or yourself. Speeding up is a common convention in
clones, not part of the game.

Snake also already gets harder on its own: the snake grows, so the space you
have to steer through shrinks. The difficulty curve is built into the shape of
the game. Speeding up mainly shifts it from a planning game toward a reflex
game — you stop having time to work out a safe route and start dying to
reaction time instead.

I decided not to add it. Writing this down because deciding against a change is
also a result, and I'd rather record the reasoning than quietly add a feature
because it seemed expected.

---

## Round 4 — tidying up

Nothing to do with playing. The code had grown into a set of loose functions
sharing top-level variables, so I asked for it to be cleaned up. I suggested
moving helper functions into a separate Python file, or using OOP.

**Two things I had wrong:**

Python can't be part of this at all. Browsers run JavaScript; a `.py` file next
to `index.html` would just sit there, because nothing would load it. Getting
Python into a browser needs something like Pyodide, which is a large WebAssembly
download plus a bootstrap step — and the brief says no build step.

Splitting into separate `.js` files would technically work, but not well here.
Modern `import`/`export` modules fail when you open a page straight off disk:
the browser treats a `file://` page as having no origin and refuses to load the
module. So it would only work with old-style script tags — more files and
load-order coupling, without getting real modules in return. Since the brief
says `index.html` *is* the game, opened directly, one self-contained file is
the safer answer.

**What did happen:** the OOP part, inside the single file. It's now four
classes with clear jobs — `Snake` (where it is and how it moves), `Board` (the
grid and where food may appear), `Renderer` (drawing, reads state and never
changes it), and `Game` (the rules and whether the game is over). The rules
about turning and about the tail now live on the objects they belong to instead
of being comments around loose functions.

This changes nothing a player can see, which is exactly why it's the risky kind
of change — the way it goes wrong is quietly reintroducing a bug already fixed.
So the whole test suite was run again afterwards: perfect play to a win, the
tail chase, the wall death, the body death. All four behave identically. The
tests only ever press keys and read the canvas, so they never knew the insides
had changed — which is what makes them a fair check.

---
