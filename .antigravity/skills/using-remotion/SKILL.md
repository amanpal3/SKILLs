---
name: using-remotion
description: Provides instructions and workflows for creating programmatic video in React using Remotion. Use this skill when the user asks to create or edit video content, animations, or programmatic video generation workflows.
---

# Using Remotion

## When to use this skill
- Setting up a new Remotion project.
- Creating programmatic videos or animations using React.
- Understanding the core concepts: Sequences, Compositions, Interpolation, and frames.
- Developing and rendering videos using `@remotion/cli`.

## Workflow

### 1. Initialize a Project
- Check if there's an existing `package.json` with `@remotion/cli`.
- If starting from scratch, you can generate a new project using: `npx create-video@latest`.
- Read standard commands: building (`npm run build`), running the dev server (`npm run start`).

### 2. Core Concepts You Must Know
- **Compositions**: The top-level video component, similar to an App component. Every video is a `<Composition>`. It takes `durationInFrames`, `fps`, `width`, and `height`.
- **Sequences**: Use `<Sequence>` to time when specific components appear in your composition (via `from` and `durationInFrames`). You can nest Sequences.
- **useVideoConfig()**: Hook to get `fps`, `durationInFrames`, `width`, and `height` of the current composition.
- **useCurrentFrame()**: Hook to get the current frame number, which you use to drive animations.
- **spring() and interpolate()**: 
  - `interpolate(frame, [inputRange], [outputRange])` maps frame numbers to CSS values.
  - `spring({ frame, fps, config })` creates natural, physics-based motion.
- **Audio/Video**: Use `<Audio>` and `<Video>` native Remotion tags instead of standard HTML tags, to ensure timing logic works properly during rendering.

### 3. Creating Components
- Videos are built purely with standard React components and inline CSS/Tailwind (if configured). 
- Always tie visual changes (opacity, transform, scaling) to `useCurrentFrame()`.

### 4. Rendering the Video
- Explain to the user how to render out the current project to an MP4 by issuing the standard commands defined in `package.json` (usually `npm run build`).

## Resources
- Use regular terminal execution to run the `npm run start` or `npm run build` scripts.
- Only run `npx create-video@latest` in an appropriate directory and with explicit USER confirmation (or `--yes` if permitted).
