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

Nothing currently in progress. Ready for Phase 7.

---

## 📝 Todo / Upcoming

### Phase 2 — Data Layer ✅
- [x] Create Zustand stores (calcStore, topologyStore, catalogStore)
- [x] Implement math engines (ohm.ts, impedance.ts, validator.ts)
- [x] TypeScript compilation check (zero errors)

### Phase 3 — Calculator Screen ✅
- [x] Build FormulaCard component with SegmentedButtons
- [x] Wire to calcStore, all 4 target modes working

### Phase 4 — Topology Screen ✅
- [x] Build TopologyNode component with product info, icons, remove button
- [x] Build AddNodeModal with chain order validation
- [x] Vertical chain with arrow connectors
- [x] Wire to topologyStore with persistence

### Phase 5 — Validation & StatusBadge ✅
- [x] Enhanced `StatusBadge` component with fade+scale animations (250ms), Material Community Icons, status pill, RTL layout, accessibility labels
- [x] Created `ValidationPanel` component with shield icon header, overall status indicator, slide-up animation, errors summary section
- [x] Added `lineVoltageOk` and `lineVoltageRequired` to `ValidationResult` type
- [x] Updated `validator.ts` to return 70V/100V line voltage check result
- [x] Moved validation logic into Zustand store (runs inline on every addNode/removeNode/updateNode)
- [x] Added `onRehydrateStorage` handler for re-validation after persistence restore
- [x] Removed useEffect dependency — validation is now immediate via store actions
- [x] Display 3 StatusBadges: impedance, power, line voltage (conditional)
- [x] Show detailed Hebrew values (e.g., "עכבה מחושבת: 4.0Ω — מינימום מגבר: 2Ω")
- [x] Added missing Hebrew strings: lineVoltageSupported, lineVoltageNotSupported, errorsSummaryTitle
- [x] Hint message shown when chain has insufficient nodes for validation
- [x] TypeScript compilation: zero errors
- [x] Stitch UI mockup generated for visual reference

### Phase 6 — Catalog Screen ✅
- [x] Enhanced `catalogStore.ts` with category filtering, product selection, `getFilteredSections` selector
- [x] Built `CatalogCard` component with category icons, dynamic subtitles, fade+scale animations, RTL, a11y
- [x] Built `ProductDetailSheet` bottom sheet with slide animation, full spec rows per product type, alternating row backgrounds
- [x] Built full `CatalogScreen` with SectionList grouped by category, search bar, category filter chips
- [x] Search filters by name, model, and manufacturer (case-insensitive, Hebrew+English)
- [x] Section headers show category name + product count badge
- [x] Empty state with magnify-close icon and "לא נמצאו מוצרים" message
- [x] All strings reference `strings.ts` — zero inline Hebrew
- [x] TypeScript compilation: zero errors
- [x] Stitch UI mockup generated for visual reference

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
| Phase 2 — Data Layer | ✅ Complete | 100% |
| Phase 3 — Calculator Screen | ✅ Complete | 100% |
| Phase 4 — Topology Screen | ✅ Complete | 100% |
| Phase 5 — Validation & StatusBadge | ✅ Complete | 100% |
| Phase 6 — Catalog Screen | ✅ Complete | 100% |
| Phase 7 — APK Build | ⏳ Pending | 0% |
| **Overall** | **⏳ In Progress** | **~86%** |

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
**Next Review:** After Phase 7 completion

