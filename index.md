% Scuttlebutt
% Andrew Winterman
% *Use up and down arrow. Scroll won't work, really*

# Who am I?

- Javascript engineer at UA.
- [\@andywinterman](https://twitter.com/andywinterman) on twitter.
- `winterMan` or sometimes `AWinterman` on IRC.
- I like chess and mathematics :)

# Scuttlebutt might be good for:  #

- Real time updates across a network?
- Multiplayer games?
- Big Data Problems?
- Interested in distributed systems?

# Let us talk about time: #

- Orders Events
- distributed system + establishing precedence = ◔ᴗ◔
- So we need a clock.

# What is a clock? #

A device which counts: 

- number of electrons emitted from radon
- drops of water
- number of times the sun has been at a certain position
- swings of a pendulum, etc.

Why? So we have a consistent way to establish precedence:

> If an event happend at 3:15 the time on the clock was *after* 3:15, but
> *before* 3:16.

# The Clock Condition: #

Given events `a` and `b`, `a` precedes `b` if `a` occurs at clock time
earlier (a.k.a. lesser) than the clock time at which `b` occurs.

# How do we establish precedence if can't both see the same clock? #

- a number of processes which communicated only by message passing.
- *don't* how long passing a message takes.
- *can't* trust peers to keep consistent time.
- can store data in each process

What do we do?

# Vector Clocks #

> *Stay Calm*

Like a normal clock, measures the number of occurences of some event, but!

- Events occur accross a distributed system. 
- Time is unrelated to physical time.
- Each member keeps its own clock 
- Each member keeps track of every other member's time.

# Example: #
A network has two nodes: `P`, `Q`, so before any events have happened:

```
P: [0, 0]
Q: [0, 0]
```

When `P` Recieves an event:

```
P: [1, 0]
Q: [0, 0]
```

# Events? #

- Local: at node in question
- Send 
- Receive


# Implementation Rules #

**Rule 1:** Any time a peer experiences an event, it increments its own entry
in its clock.

**Rule 2:** Peers must include the value, `t` of their own entry in their clock
when they send messages. 

**Rule 3:** Upon receipt, peers update the sender's entry in their clock to
`t`. They update their own entry to be larger than `t`.

# Example: #

Recall:

```
P: [1, 0]
Q: [0, 0]
```

> P sends a message to Q.

Upon sending:

```
P: [2, 0]
Q: [0, 0]
```

Upon Receipt:

```
P: [2, 0]
Q: [1, 2]
```

# How is this like time?

The [clock condition](#the-clock-condition) still holds:

**Caveat:**

This is still only a partial ordering-- if messages are seldom sent, many
events will appear concurrent

# Enter Scuttlebutt

> Did you hear what happened to Bob?

Share history of state mutations accross a network.

# What is state?

A key value store:

```
{
  key1: {value: val1, version: vers1},
  key2: {value: val2, version: vers2},
  key3: {value: val3, version: vers3}
}
```

# What is history?

A series of entries consisting of:

- The event itself
- ID of the peer at which the event the event occurred.
- the version number of the event.

# Gossip in two parts #

### Get on the Same Page ###

> The last time I spoke to Bob was September 2nd...

### Spilling the Beans ##

> Well since then, Bob first had a baby, and then got divorced!

# Getting on the same page #
When `P` gossips with `Q`, `P` first sends a digest to `Q`:

```
for(peer in network) {
  digest.queue({
      peer: peer.id
    , version: peer.largest_version_seen
  })
}
```

# Spilling the Beans #

`Q` responds 

  - With all the updates it has seen for `P`.
  - In order of earliest timestamp first.

# Demo #

# When to apply an update? #

> Here be dragons!

- Until this point discussion has been about which updates to send, and how.
- Haven't mentioned decision function for applying update to state.
- Maybe you only care about:
    - The largest number any node has reported.
    - Most recent updates
    - Some union or intersection of updates

# Questions? #

![](http://s.mlkshk.com/r/6NJJ.gif "wat")

# Sources #

Vector Clocks: [http://cnlab.kaist.ac.kr/~ikjun/data/Course_work/CS642-Distributed_Systems/papers/lamport1978.pdf]()

Scuttlebutt: [http://www.cs.cornell.edu/home/rvr/papers/flowgossip.pdf]()

Conflicts: Everything at [http://aphyr.com/posts/281-call-me-maybe-carly-rae-jepsen-and-the-perils-of-network-partitions]()
