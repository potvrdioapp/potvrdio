---
trigger: always_on
description: Strict UI Design Rule: Never use emojis in UI, buttons, alerts, or text across all applications. Always use proper SVG/Lucide icons.
---

## UI Icon & Emoji Policy (Strict)

Across all applications in this project (`merchant-dashboard`, `landing-web`, `mobile-address-app`, and all customer-facing screens):

1. **NO EMOJIS IN UI**:
   - Never use unicode emojis (e.g. 🧪, 🚀, 💡, 📥, ✉️, ⚠️, ❌, ✅, 🛒, etc.) in buttons, labels, headings, navigation links, badges, or helper text.
   - Emojis render inconsistently across operating systems and diminish the brand's professional SaaS aesthetic.

2. **ALWAYS USE SVG / LUCIDE ICONS**:
   - Every visual cue, action indicator, or status mark must use vector icons (e.g. `lucide-react` components such as `<Download />`, `<Sparkles />`, `<Mail />`, `<CheckCircle2 />`, `<AlertTriangle />`, `<Lightbulb />`, `<Rocket />`, etc.).

3. **NEVER COMBINE AN ICON AND AN EMOJI**:
   - Buttons, badges, and cards must never contain both an SVG icon component and an emoji character in the text label.
