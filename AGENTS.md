# Standalone Wordfall
- Keep the root route exclusively for the falling-word game; do not include other games or backend clients.
- Keep speed progression and timing in the pure helper and apply changes at round boundaries for synchronization.
- Keep installation manifest-only and scoped to the repository base path to avoid offline preview effects.
- Keep analytics browser-only, optional and aggregate without player identifiers.
- Keep vocabulary in shared data and merge duplicate visible labels for unambiguous answers.
