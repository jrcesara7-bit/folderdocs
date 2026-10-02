---
id: syntax
description: Markdown features supported by folderdocs: tables, task lists, admonitions, highlighted code and safe use of HTML.
---
# Markdown syntax

The site uses Markdown with GitHub extensions (*GFM*): tables, task lists, strikethrough and code blocks.

## Text

**Bold**, *italic*, ~~strikethrough~~ and `inline code`.

> A simple quote.

## Lists

- Item
  - Sub-item
- Another item

1. First
2. Second

- [x] Done task
- [ ] Pending task

## Admonitions

Five types, with the same syntax as GitHub:

> [!NOTE]
> Additional information.

> [!TIP]
> A useful tip.

> [!IMPORTANT]
> Something you shouldn't miss.

> [!WARNING]
> Be careful with this.

> [!CAUTION]
> This can cause data loss.

```markdown
> [!WARNING]
> Be careful with this.
```

## Code

With syntax highlighting and a **Copy** button (it appears on hover):

```python
def greet(name: str) -> str:
    return f"Hello, {name}"
```

Highlighting covers the most common languages: `bash`, `js`, `ts`, `json`, `yaml`, `python`, `html`, `css`, `sql`, `java`, `go`, `rust`, `c`, `cpp`, `csharp`, `php`, `ruby`, `diff`, among others. A block without a language is shown without colors.

## Tables

| Column A | Column B | Column C |
| -------- | :------: | -------: |
| left     | center   | right    |
| 1        | 2        | 3        |

Wide tables scroll horizontally on small screens.

## HTML

You can write HTML inside a `.md` file when Markdown isn't enough. It is what the [home page tiles](03-home-page-and-tiles.md) use.

> [!CAUTION]
> HTML in `.md` files is inserted as-is, without filtering. Only publish content you trust, and review changes from outside contributors.
