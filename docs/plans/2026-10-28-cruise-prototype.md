# Cruise Prototype Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deliver a playable Chinese browser investigation game covering the cruise chapter's loop, clues, NPCs, three puzzles and three endings.

**Architecture:** A dependency-free state machine owns the game rules; declarative room and evidence data drive the interface. The browser renders seven illustrated rooms, an evidence board, dialogue, puzzles and ending scenes. Durable knowledge and one-time XP survive loop reset; transient keys, rescued NPC state and power settings reset. Save parsing whitelists state and fails safely.

**Tech Stack:** Plain HTML, CSS, JavaScript, Node native test runner, static HTTP preview, Sites private hosting.

---

### Task 1 Rule engine and content
Create dist/data.js, dist/engine.js and tests/engine.test.cjs. Verify room gates, time events, evidence acquisition, exact inference sets, wrong puzzle input, reset boundaries, reward deduplication, optional rescue conditions, all three endings and malformed saves. Use portable data and a pure state transition interface.

### Task 2 Playable interface
Create dist/index.html, dist/style.css and dist/app.js. Provide start/continue, gender choice, room map, clickable objects, four NPC conversations, manual time advancement, pause, notebook, evidence board, power controls and explicit ending confirmation. Persist successful transitions locally. All locked actions explain missing conditions.

### Task 3 Visual environment
Create dist/art.js with original inline SVG interiors for cabin, lounge, deck, clinic, bridge, engine and archive. Use navy, brass and pale paper, readable Chinese type, responsive layout, focus handling and reduced-motion support. No remote asset dependency.

### Task 4 Verification and delivery
Run node --test tests/*.test.cjs. Start server.cjs, verify HTTP success and play the actual UI through the evidence puzzle, power puzzle, rescue and ending flows. Test reload persistence and small-screen layout. Fix observed issues; package verified source, publish privately using the existing Site identity and show the user the verified URL. Include local launch instructions and a concise walkthrough.

### Scope
This is a complete cruise investigation prototype, not the full 14-world game or the 3D production version. Preserve original V1.0/V1.1 documents. Do not create new chats or delegate without the user's request.
