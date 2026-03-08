# Content Publishing Workflow

## Purpose

This document defines the content formatting rules used when publishing events and website content for the Westville Warehouse PWA.

It exists to ensure that content created in Facebook and synced into Firebase is consistent and parseable.

---

## Event publishing source of truth

At this stage, Facebook event content is the source input for the event sync process.

Admins must follow the formatting conventions below when creating or editing event posts/descriptions.

---

## Price formatting

Any event price information must be wrapped in `[PRICE]` blocks.

### Correct examples

```txt
[PRICE]R50[/PRICE]
```
```txt
[PRICE]R50, R120, R350[/PRICE]
```
```txt
[PRICE]TBC[/PRICE]
```
### Incorrect examples
```txt
(PRICE) R50 (/PRICE)
```
```txt
{PRICE} R50 {/PRICE}
```
```txt
[Price] R50 [/Price]
```