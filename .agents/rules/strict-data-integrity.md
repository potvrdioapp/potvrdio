---
trigger: always_on
description: Strict Data Integrity Rule: Never guess, alter, or re-type contact info, numbers, or facts from memory. Always verify against source and diff character-by-character.
---

## Strict Data Integrity & Verification Policy

1. **NO TYPOS / NO RETYPING FROM MEMORY**:
   - Phone numbers, email addresses, street addresses, domain names, API keys, and order IDs must **always be copied literally** from the source file or verified live web page.
   - Never type phone numbers or emails from memory. A 1-digit difference (`6555` vs `6556`) is a failure of data integrity.

2. **CHARACTER-BY-CHARACTER DIFF ON USER INQUIRIES**:
   - Whenever the user questions a specific number, email, address, or data point (e.g. *"bunu nereden buldun?"*, *"bu yanlış"*):
     - **DO NOT** guess the user's intent or speculate philosophically about the origin.
     - **DO** immediately locate the source file/page and perform an exact character-by-character diff against the user's snippet.
     - If there is a 1-character typo, admit the typo directly without spinning a hypothetical narrative.

3. **FACT VS HYPOTHESIS LABELLING**:
   - Never state speculative market claims, customer behavioral assumptions ("gençler e-postaya bakmaz", "sosyal medyadan geliyorlar"), or unverified returns data as facts.
   - If a claim is an assumption, explicitly label it as **[Hipotez]**.
   - If an email is not publicly visible on the website, do not mark the row as "verified email".

4. **CLOSED BETA REALISM & FIT**:
   - Do not target large distributors, conglomerates, or multi-decade corporate brands (e.g. Fagor/Apejron, CFMOTO/Guevara) for early 3-5 merchant closed design partnerships. Target agile, independent WooCommerce merchants with active Cash on Delivery (COD) and sufficient monthly order volume.
