# Contributing translations

Thank you for helping. A good translation makes Ordnary feel like it was made for you.

## The rules

**Only change the text, never the keys.** Each line is `"key": "text"`. Keep the part before the colon exactly as it is.

```json
"close": "Sluiten"
```

**Keep placeholders exactly as they are.** Words in curly braces are filled in by the product. Move them wherever your language needs them, but don't translate, rename or remove them.

```json
"retention": "Activiteit wordt {days} dagen bewaard."
```

**Don't change `en.json`.** English is written in the products and synced here every hour; changes to it here are overwritten.

**No HTML.** Bold text, links and line breaks are added by the product, not by the translation.

**Keep "Ordnary" and product names as they are**, such as Ordnary ID.

## Style

- Write the way a native speaker would say it, not word for word from English.
- Use the same form of address as the rest of the file (for example informal "je" in Dutch, "du" in German).
- Keep it short. Buttons and labels have little room.
- Use the product's own terms for things like "account", "passkey" and "two-step verification"; search the file to see how they're translated elsewhere.

## Checking your change

The check runs on your pull request automatically. To run it yourself first (Node.js 20 or later, nothing to install):

```bash
node scripts/check.mjs
```

It lists anything that would block the merge, with the file and key.

## Adding a language

Open an issue first. A new language needs every product to support it, so it's added by Ordnary.

## Privacy and legal text

Text about privacy, data, deletion and consent is reviewed with extra care. Please translate it as literally as your language allows, and mention in the pull request if you're unsure about a term.
