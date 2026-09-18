"""
An original, gentle instrumental bed for the invitation.

Nothing sampled or borrowed: every voice is synthesised here, so the track is
free of any licensing question. D major pentatonic, slow, quiet — a warm drone
under a sparse bell figure, with a soft oud-like pluck answering it.

The loop is written so the last sample flows into the first: every modulation
period divides the loop length exactly, and each note's tail wraps around to
the top of the file rather than being cut off.
"""
import math, struct, wave

SR = 44100
LOOP = 32.0                      # seconds — all LFO periods divide this evenly
N = int(SR * LOOP)

left = [0.0] * N
right = [0.0] * N


def add(buf, start, samples, gain, pan):
    """Mix `samples` in at `start`, wrapping past the end back to the start."""
    g_l = gain * math.sqrt(0.5 * (1.0 - pan))
    g_r = gain * math.sqrt(0.5 * (1.0 + pan))
    for i, v in enumerate(samples):
        j = (start + i) % N
        left[j] += v * g_l
        right[j] += v * g_r


def note(freq, dur, decay, harmonics, detune=0.0):
    """A plucked/struck voice: harmonics with an exponential decay."""
    n = int(SR * dur)
    out = [0.0] * n
    for h, amp in harmonics:
        f = freq * h * (1.0 + detune)
        w = 2 * math.pi * f / SR
        for i in range(n):
            out[i] += amp * math.sin(w * i)
    for i in range(n):
        t = i / SR
        env = math.exp(-t / decay)
        # soften the attack so nothing clicks
        if t < 0.012:
            env *= t / 0.012
        out[i] *= env
    return out


# ---- the drone: root, fifth, octave, each breathing on its own period ----
D2, A2, D3, A3, Fs4 = 73.42, 110.0, 146.83, 220.0, 369.99
for freq, amp, period, pan in (
    (D2, 0.085, 16.0, 0.0),
    (A2, 0.055, 8.0, -0.25),
    (D3, 0.045, 32.0, 0.2),
    (A3, 0.030, 16.0, 0.3),
    (Fs4, 0.016, 8.0, -0.3),
):
    w = 2 * math.pi * freq / SR
    lfo = 2 * math.pi / (period * SR)
    voice = [
        math.sin(w * i) * (0.72 + 0.28 * math.sin(lfo * i)) for i in range(N)
    ]
    add(voice, 0, voice, amp, pan)


# ---- a sparse bell figure, D major pentatonic, one note every two bars ----
SCALE = {"D4": 293.66, "E4": 329.63, "F#4": 369.99, "A4": 440.0, "B4": 493.88, "D5": 587.33}
FIGURE = [
    (0.0, "D5", 0.30), (4.0, "A4", 0.24), (8.0, "F#4", 0.26), (12.0, "E4", 0.22),
    (16.0, "D5", 0.28), (20.0, "B4", 0.24), (24.0, "A4", 0.26), (28.0, "F#4", 0.22),
]
bell_harmonics = [(1.0, 1.0), (2.0, 0.34), (3.0, 0.12), (4.7, 0.05)]
for t, name, gain in FIGURE:
    s = note(SCALE[name], 6.0, 1.9, bell_harmonics)
    pan = -0.22 if int(t) % 8 == 0 else 0.22
    add(s, int(t * SR), s, gain * 0.5, pan)

# ---- a low pluck answering it, warmer and rounder ----
PLUCK = [(2.0, "D4", 0.20), (10.0, "A4", 0.17), (18.0, "F#4", 0.19), (26.0, "E4", 0.16)]
pluck_harmonics = [(1.0, 1.0), (2.0, 0.5), (3.0, 0.22), (4.0, 0.08)]
for t, name, gain in PLUCK:
    s = note(SCALE[name] / 2, 5.0, 1.4, pluck_harmonics, detune=0.0008)
    add(s, int(t * SR), s, gain * 0.5, -0.12)


# ---- gentle low-pass, then normalise to a quiet peak ----
def smooth(buf, passes=2, k=0.32):
    for _ in range(passes):
        prev = buf[-1]
        for i in range(len(buf)):
            prev = prev + k * (buf[i] - prev)
            buf[i] = prev
    return buf

smooth(left); smooth(right)

peak = max(max(abs(v) for v in left), max(abs(v) for v in right))
target = 0.52
scale = target / peak if peak else 1.0
print(f"peak before {peak:.3f} → scaled by {scale:.3f}")

with wave.open("bgm.wav", "w") as f:
    f.setnchannels(2)
    f.setsampwidth(2)
    f.setframerate(SR)
    frames = bytearray()
    for i in range(N):
        l = int(max(-1.0, min(1.0, left[i] * scale)) * 32767)
        r = int(max(-1.0, min(1.0, right[i] * scale)) * 32767)
        frames += struct.pack("<hh", l, r)
    f.writeframes(bytes(frames))
print("wrote bgm.wav", round(N / SR, 1), "seconds")
