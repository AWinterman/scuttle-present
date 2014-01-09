# ![Scuttlebutt](https://f.cloud.github.com/assets/37303/1836776/ce8b825c-740e-11e3-8a89-70861d073c03.png) #

> Water for immediate consumption on a sailing ship was conventionally stored in
> a scuttled butt: a butt (cask) which had been scuttled by making a hole in it
> so the water could be withdrawn. Since sailors exchanged gossip when they
> gathered at the scuttlebutt for a drink of water, "scuttlebutt" became Navy slang
> for gossip or rumours.

<aside>
(Use the arrow keys to navigate)
</aside>


# Who am I?

- Javascript engineer at UA.
- [\@andywinterman](https://twitter.com/andywinterman) on twitter.
- `winterMan` or sometimes `AWinterman` on IRC.
- I like chess and mathematics :)

# Scuttlebutt might be good for:  #

- Real time updates across a network
- Multiplayer games
- Big Data Problems

# What is it? #

A strategy for sharing *complete* knowledge between computers in a distributed system.

This is hard.

# Time #

- Establishes precedence of events.

> If an event happend at 3:15 if the time on the clock was *after* 3:15, but
> *before* 3:16.


- Central to how we think about systems:
    - purchasing tickets
    - qualifying for grants
    - auctions

But how do we tell time if we can't all see the clock?

# What is a clock? #

A device which counts: 

- number of electrons emitted from radon
- drops of water
- number of times the sun has been at a certain position
- swings of a pendulum, etc.

Ideally regular, but for our purposes, we just really care about which event
happened first

# The Clock Condition: #

Given events `a` and `b`, `a` precedes `b` if `a` occurs at clock time
earlier (a.k.a. lesser) than the clock time at which `b` occurs.

# Constraints: #

- a number of processes which communicated only by message passing.
- can store data in each process
- *don't* how long passing a message takes.
- *can't* trust peers to keep consistent time.

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

# Implementation Rules #

**Rule 1:** Any time a peer experiences an event, it increments its own entry
in its clock.

**Rule 2:** Peers must include the value, `t` of their own entry in their clock
when they send messages. 

**Rule 3:** Upon receipt, peers update the sender's entry in their clock to
`t`. They update their own entry to be larger than `t`.

# Events? #

- Local
- Send 
- Receive

# Example: #

Recall:

```
P: [1, 0]
Q: [0, 0]
```

> P sends a message to Q, with timestamp `t=1`.

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

**Caveats:**

This is still only a partial ordering: if messages are seldom sent, many
events will appear concurrent

Takes no account of physical time: events occuring outside the network with a
certain physical ordering may or may not have the same ordering within our
logical system.

# Caveats #
> This permits the following type of "anomalous behavior." Consider a nationwide
> system of interconnected computers. Suppose a person issues a request A on a
> computer A, and then telephones a friend in another city to have him issue a
> request B on a different computer B. It is quite possible for request B to
> receive a lower timestamp and be ordered before request A. This can happen
> because the system has no way of knowing that A actually preceded B, since that
> precedence information is based on messages external to the system

# [npm.im/vector-clock-class](https://npmjs.org/package/vector-clock-class) #

```javascript
> var ClockClass = require('vector-clock-class')
> var vector_clock = Clock('P')
> vector_clock.clock 
{ 'P': 0 }
>
> vector_clock.get('P') 
0
>
> vector_clock.get('Q') 
-Infinity
>
> vector_clock.update('Q', 10) 
10
>
> vector_clock.clock 
{ 'P': 11, 'Q': 10 } 
> vector_clock.createReadStream().pipe(/* your_stream_here */)

```

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

- An entry for each peer
- Holds *largest version number* and ID for peer.
- For example: `('BOB', 2)`

# Spilling the Beans #

`Q` responds 

  - With all the updates it has seen for `BOB`.
  - In order of earliest timestamp first.

# [npm.im/simple-scuttle](https://npmjs.org/package/simple-scuttle) #

```javascript
var scuttle = require('simple-scuttle')

var peer_io = // a stream which sends and receives messages from the peer.
  , config  = scuttle.base.config

// This part is REALLY important, more on it in a second.
config.resolve = base.resolution.strictly_order_values

// make a gossip object.
var gossip = new scuttle.Gossip('id', config)

// It's just a stream, 
gossip.pipe(peer_io).pipe(gossip)

// Every time history changes, history attribute emits an "update" event.
gossip.history.on('update', write_to_disk) 

// If we have more history than we can store, a compaction event is emmitted.
gossip.history.on('compaction', compact)

// Apply local updates with .set:
gossip.set(key, value)

// every time state changes an event is emitted.
gossip.on('state', rerender)

function compact(memory, history_instance)  {
  /* Resolve history to be more compact somehow */
}
```

# When to apply an update? #

> Here be dragons!

- Until this point discussion has been about which updates to send, and how.
- Haven't mentioned decision function for applying update to state.
- Maybe you only care about:
    - The largest number any node has reported.
    - Most recent updates
    - Some union or intersection of updates

# [Demo](https://npmjs.org/package/scuttledemo) #

# Questions? #

![](http://s.mlkshk.com/r/6NJJ.gif "wat")

# Sources #

[Vector Clocks: Lamport 1978](http://cnlab.kaist.ac.kr/~ikjun/data/Course_work/CS642-Distributed_Systems/papers/lamport1978.pdf)

[Scuttlebutt Gossip: Van Renesse et al.](http://www.cs.cornell.edu/home/rvr/papers/flowgossip.pdf)

Conflicts: Everything at [aphyr/jepson](http://aphyr.com/posts/281-call-me-maybe-carly-rae-jepsen-and-the-perils-of-network-partitions)
