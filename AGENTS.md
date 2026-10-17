# Standalone Wordfall
- Keep the root route exclusively for the falling-word game; do not include other games or backend clients.
- Keep variant-specific pace in the pure speed helper and apply timing changes at round boundaries so falling animations and timers stay synchronized.
- Keep installation manifest-only and scoped to the hosting base path to avoid offline preview effects.
- Keep analytics browser-only, optional and aggregate without player identifiers; use the repository variable for the measurement ID.
- Preserve shared source vocabulary and keep standalone meanings and tier tags in a complete overlay to prevent ambiguity and arcade changes.
- Keep tier progression, repetition batches and introduced-word history in the mounted game rather than device storage so fresh visits start at the initial tier.
- Gate falling timers behind introductions and apply eligible tier advancement only on explicit player choice so confidence support never alters arcade play.
- Sequence introduction speech through cancellable Hebrew-then-English end/error callbacks with a fallback and clear stale timers before another reading so English cannot be lost or overlap.
