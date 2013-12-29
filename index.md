# Who am I?

- Javascript engineer at UA.
- [\@andywinterman](https://twitter.com/andywinterman) on twitter.
- `winterMan` or sometimes `AWinterman` on IRC.
- I like chess and mathematics :)

# Let us talk about time: #

- Orders Events
- Measured with clocks:

> If an event happend at 3:15 the time on the clock was *after* 3:15, but *before* 3:16.

# What is a clock? #

A device which counts: 

- number of electrons emitted from radon
- drops of water
- number of times the sun has been at a certain position
- swings of a pendulum, etc.

Why? So we have a consistent way to establish precedence:

# The Clock Condition: #

*For all events `a`, `b`, `a` precedes `b` if `a` occurs at time earlier
(a.k.a. lesser) than the time of `b`*

# How do we establish precedence if can't both see the same clock? #

- We have a number of processes which communicated only by message passing
- We don't how much time elapses between a message leaving the sender and being
  read by the receiver
- We can store data in each process
- We can't trust peers to keep consistent time with all the other peers.

What do we do?

# Vector Clocks #

*Stay Calm*

Like a normal clock, measures the number of occurences of some event, but!

- Events occur accross a distributed system. 
- Time is unrelated to physical time.
- Each member of the system keeps its own clock 
- Each member of the system keeps track of every other member's time.

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

- local
- send
- receive


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

> The last time I spoke to Bob was September 2nd, to Carry, March 15th...

When `P` gossips with `Q`, `P` first sends a digest to `Q`:

```
for(peer in network) {
  digest.queue({
      peer: peer.id
    , version: peer.largest_version_seen
  })
}
```

### Spilling the Beans ##

> Well since then, Bob first had a baby, and then got divorced!

`Q` responds 
  - With all the updates it has seen for `P`.
  - In order of earliest timestamp first.

# Demo #

# Questions? #

![](http://s.mlkshk.com/r/6NJJ.gif "wat")
