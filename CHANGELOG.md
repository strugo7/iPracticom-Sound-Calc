# Changelog — iPracticom Sound Calc & Topology

All notable changes and progress updates to the iPracticom Sound Calc project will be documented in this file.

---

## [1.0.0] — 2026-04-13

### 🎉 Completed

#### Phase 1 — Foundation ✅
- [x] Initialize React Native project with TypeScript (bare workflow)
- [x] Install all core dependencies:
  - react-native-paper (MD3 UI components)
  - @react-navigation/native + @react-navigation/bottom-tabs
  - react-native-screens + react-native-safe-area-context
  - zustand (state management)
  - react-native-mmkv (local storage)
  - react-native-vector-icons (Material Community Icons)
- [x] Create complete `src/` directory structure
- [x] Implement TypeScript interfaces (`src/types/catalog.ts`):
  - Player, Mixer, Matrix, Amplifier, Speaker
  - Catalog (root interface)
- [x] Create iPracticom brand theme (`src/theme/index.ts`):
  - Colors (electricBlue, skyBlue, darkNavy, midGray, white, lightBG, success, error)
  - Spacing, radius, elevation tokens
  - Material Design 3 theme configuration
- [x] Implement RTL support (`src/utils/rtl.ts`) for Hebrew language
- [x] Create comprehensive Hebrew UI strings (`src/strings.ts`):
  - Navigation labels
  - Calculator screen strings
  - Topology screen strings
  - Validation messages
  - Catalog labels
  - General UI text
  - Accessibility labels
- [x] Create product catalog (`src/data/catalog.json`):
  - 2 Players (Arylic S50 Pro+, Audio Pro Link 1)
  - 1 Mixer (placeholder)
  - 4 Matrices (Jade ZMP-64, Symetrix Jupiter 4/8/12)
  - 9 Amplifiers (Behringer NX series, LAB Gruppen E series)
  - 2 Speakers (8Ω and 70V placeholders)
- [x] Create placeholder screens:
  - `src/screens/Calculator/index.tsx`
  - `src/screens/Topology/index.tsx`
  - `src/screens/Catalog/index.tsx`
- [x] Configure App.tsx with:
  - Bottom tab navigation (3 tabs with Hebrew labels)
  - Material Community Icons for each tab
  - React Native Paper theme provider
  - RTL setup
- [x] Verify TypeScript compilation (zero errors)
- [x] Connect to GitHub: https://github.com/strugo7/iPracticom-Sound-Calc.git

### 📋 Project Setup
- [x] Repository initialized and pushed to GitHub
- [x] Git remote configured (origin → GitHub)
- [x] Initial commit with Phase 1 foundation
- [x] CHANGELOG.md created for progress tracking

---

## 🔄 In Progress

Nothing currently in progress. Ready for Phase 2.

---

## 📝 Todo / Upcoming

### Phase 2 — Data Layer (PENDING)
- [ ] Create Zustand stores:
  - [ ] `src/store/calcStore.ts` — Calculator state (inputs, selected formula, result)
  - [ ] `src/store/topologyStore.ts` — Topology chain, validation results
  - [ ] `src/store/catalogStore.ts` — Catalog filtering, search state
- [ ] Implement math engines:
  - [ ] `src/engine/ohm.ts` — All 12 Ohm's Law formulas (P, V, I, R)
  - [ ] `src/engine/impedance.ts` — Series and parallel impedance calculations
  - [ ] `src/engine/validator.ts` — Full validation logic (impedance, power, line voltage checks)
- [ ] Add inline tests for math engine (verify against known values)
- [ ] TypeScript compilation check (zero errors)

### Phase 3 — Calculator Screen (PENDING)
- [ ] Build `FormulaCard` component
  - [ ] Two input fields for known values
  - [ ] SegmentedButtons to select target variable (P/V/I/R)
  - [ ] Display calculated result (3 decimal places or "—" if invalid)
  - [ ] Error handling for zero/invalid inputs
- [ ] Wire `FormulaCard` to `calcStore`
- [ ] Add Clear button
- [ ] Test all 4 target modes (solve for P, V, I, R)
- [ ] Checkpoint: All calculation modes working

### Phase 4 — Topology Screen (PENDING)
- [ ] Build `TopologyNode` component
  - [ ] Display product name, type icon, remove button
  - [ ] Styling with iPracticom brand colors
- [ ] Create topology chain visualization
  - [ ] Vertical FlatList of nodes
  - [ ] Arrow connectors between nodes
- [ ] Build "Add Node" button and modal
  - [ ] Modal: select node type (source, mixer, matrix, amplifier, speaker_group)
  - [ ] Modal: select product from filtered catalog
- [ ] Implement chain order validation
  - [ ] Enforce: source → [mixer|matrix] → amplifier → speaker_group
  - [ ] Block invalid additions (show Snackbar)
- [ ] Wire to `topologyStore` with MMKV persistence
- [ ] Checkpoint: Build full chain, verify persistence across app restart

### Phase 5 — Validation & StatusBadge (PENDING)
- [ ] Build `StatusBadge` component
  - [ ] Green ✓ for pass, Red ✗ for fail
  - [ ] Customizable label and result values
- [ ] Subscribe to `topologyStore.chain` and run validation on every change
- [ ] Display `ValidationResult` at bottom of Topology screen:
  - [ ] Impedance check (calculated vs minimum)
  - [ ] Power check (required vs available)
  - [ ] Line voltage check (70V/100V transformer compatibility)
- [ ] Show detailed numbers (e.g., "עכבה מחושבת: 3.2Ω — מינימום: 4Ω")
- [ ] Checkpoint: Connect speakers below amplifier min impedance → red badge appears immediately

### Phase 6 — Catalog Screen (PENDING)
- [ ] Build catalog with SectionList (grouped by category)
  - [ ] Players, Mixers, Matrices, Amplifiers, Speakers sections
- [ ] Implement search bar
  - [ ] Filter by name or model (case-insensitive, Hebrew-aware)
- [ ] Build product detail bottom sheet
  - [ ] Display all spec fields per product type
  - [ ] Hebrew labels for all fields
- [ ] Checkpoint: Search works in Hebrew/English, all fields visible in detail sheet

### Phase 7 — APK Build (PENDING)
- [ ] Bump `versionCode` and `versionName` in `android/app/build.gradle`
- [ ] Run release build: `cd android && ./gradlew assembleRelease`
- [ ] Verify APK at `android/app/build/outputs/apk/release/app-release.apk`
- [ ] Measure and report final APK size
- [ ] Checkpoint: Signed APK ready for distribution

---

## 📊 Progress Summary

| Phase | Status | Completion |
|-------|--------|-----------|
| Phase 1 — Foundation | ✅ Complete | 100% |
| Phase 2 — Data Layer | ⏳ Pending | 0% |
| Phase 3 — Calculator Screen | ⏳ Pending | 0% |
| Phase 4 — Topology Screen | ⏳ Pending | 0% |
| Phase 5 — Validation & StatusBadge | ⏳ Pending | 0% |
| Phase 6 — Catalog Screen | ⏳ Pending | 0% |
| Phase 7 — APK Build | ⏳ Pending | 0% |
| **Overall** | **⏳ In Progress** | **~14%** |

---

## 🔗 Resources

- **Repository**: https://github.com/strugo7/iPracticom-Sound-Calc.git
- **CLAUDE.md**: Project guidelines, tech stack, coding conventions
- **skill.md**: Relevant Claude Code skills for development
- **Prompt 01 foundation.md**: Phase 1 requirements (completed)

---

## 📝 Notes

- All UI strings are in Hebrew (RTL) — no inline Hebrew text in JSX
- All catalog entries are static (bundled in `src/data/catalog.json`)
- Android-only app (no iOS support required)
- TypeScript strict mode enabled throughout
- Every function in math engines is pure (no side effects)

---

**Last Updated:** 2026-04-13  
**Next Review:** After Phase 2 completion
