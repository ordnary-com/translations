<p align="center">
  <img src="https://cdn.ordnary.com/email/ordnary-icon.png" alt="Ordnary" width="64" height="64">
</p>

<h1 align="center">Ordnary translations</h1>

<p align="center">
  The text of Ordnary's products in 30 languages. Anyone can help make it better.
</p>

---

Every word you see in Ordnary's products, in every language, lives in this repository. If something reads wrong, sounds unnatural or is missing in your language, you can fix it here.

## What's here

| Folder | Product |
| --- | --- |
| [`accounts`](accounts) | Ordnary ID: signing in, signing up and the Account Center |

Each folder has one file per language, named by its language code: `nl.json` for Dutch, `de.json` for German, and so on. `en.json` is the English source text.

## How to help

1. Open the file for your language, for example [`accounts/nl.json`](accounts/nl.json).
2. Edit it right on GitHub with the pencil icon, or fork the repository.
3. Change the text you want to improve and open a pull request.

That's all. [CONTRIBUTING.md](CONTRIBUTING.md) has the details, including what to keep exactly as it is.

## How it gets into the products

```
product repository ──(every hour: English and new keys)──► this repository
this repository ──(on every release)──► the product
```

- New English text is written in the products themselves and comes here automatically every hour, so you'll find new keys to translate without anyone copying them over.
- When a product is released, it takes the latest translations from this repository. A merged improvement is live with the next release.
- A text that isn't translated yet shows in English.

## Checks

Every pull request is checked automatically. It can only be merged when the file is valid JSON, has no keys English doesn't have, keeps every placeholder (like `{days}`) and contains no HTML. After that, someone at Ordnary reviews it.

## License

By contributing, you agree that your translations are published under the [MIT License](LICENSE).
