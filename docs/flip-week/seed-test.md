# BTC Flippening Image Seed Test

**Goal:** Validate whether people will reuse a credible, real-time BTC flippening image without needing a product walkthrough.

## Outreach Message

Short version:

```txt
I'm testing a BTC market-cap flippening image primitive this week.

Would you put this image in your next tweet, newsletter, group chat, or article?
If not, what blocks you?

Ready image:
https://btcbeats-ten.vercel.app/img/btc-next.png?ref=seed_<id>

Methodology:
https://btcbeats-ten.vercel.app/methodology?ref=seed_<id>

Target example:
https://btcbeats-ten.vercel.app/img/btc-vs-gold.png?ref=seed_<id>
```

More context if they ask:

```txt
The test is not whether the site is interesting. The test is whether the image is credible and useful enough to reuse directly.
I'm specifically looking for blockers: unclear formula, weak source trust, bad visual hierarchy, wrong metric, missing target, or URL/share friction.
```

## Seed List

| ID | Name | Channel | Relationship | Sent At | Response | Reuse Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| seed_001 |  |  |  |  |  |  |  |
| seed_002 |  |  |  |  |  |  |  |
| seed_003 |  |  |  |  |  |  |  |
| seed_004 |  |  |  |  |  |  |  |
| seed_005 |  |  |  |  |  |  |  |
| seed_006 |  |  |  |  |  |  |  |
| seed_007 |  |  |  |  |  |  |  |
| seed_008 |  |  |  |  |  |  |  |
| seed_009 |  |  |  |  |  |  |  |
| seed_010 |  |  |  |  |  |  |  |
| seed_011 |  |  |  |  |  |  |  |
| seed_012 |  |  |  |  |  |  |  |
| seed_013 |  |  |  |  |  |  |  |
| seed_014 |  |  |  |  |  |  |  |
| seed_015 |  |  |  |  |  |  |  |
| seed_016 |  |  |  |  |  |  |  |
| seed_017 |  |  |  |  |  |  |  |
| seed_018 |  |  |  |  |  |  |  |
| seed_019 |  |  |  |  |  |  |  |
| seed_020 |  |  |  |  |  |  |  |

## Live Links

- Ready image: `https://btcbeats-ten.vercel.app/img/btc-next.png?ref=seed_<id>`
- Methodology: `https://btcbeats-ten.vercel.app/methodology?ref=seed_<id>`
- Target example: `https://btcbeats-ten.vercel.app/img/btc-vs-gold.png?ref=seed_<id>`
- Gold: `https://btcbeats-ten.vercel.app/img/btc-vs-gold.png`
- Silver: `https://btcbeats-ten.vercel.app/img/btc-vs-silver.png`
- NVIDIA: `https://btcbeats-ten.vercel.app/img/btc-vs-nvidia.png`
- Apple: `https://btcbeats-ten.vercel.app/img/btc-vs-apple.png`
- Microsoft: `https://btcbeats-ten.vercel.app/img/btc-vs-microsoft.png`
- Tesla: `https://btcbeats-ten.vercel.app/img/btc-vs-tesla.png`

## Response Classification

- `used`: They actually posted, embedded, forwarded, or placed the image somewhere external.
- `would_use`: They explicitly said they would use it in a specific upcoming context.
- `blocked`: They wanted to use it but named a concrete blocker.
- `interesting_only`: They reacted positively but would not reuse it.
- `no_response`: No reply after follow-up.

## Blocker Tags

- `trust`: Source, formula, or methodology is not credible enough.
- `clarity`: They cannot understand the image quickly.
- `visual`: Text size, layout, colors, or hierarchy blocks reuse.
- `metric`: The fields are not the fields they need.
- `target`: They need a missing asset.
- `format`: They need a different size, embed style, or file type.
- `timing`: They like it but do not have a current use case.

## Success Tally

| Metric | Count |
| --- | ---: |
| Used externally | 0 |
| Would use | 0 |
| Requested new asset/field/style | 0 |
| Methodology objections that break core formula | 0 |

## Decision Rule

Continue if:

- `used + would_use >= 3`
- and at least one real external use happens
- and the methodology has no unresolved core objection

Cut or rework if:

- Most responses are `interesting_only`
- or blockers concentrate around source trust or unclear formula
- or the image opens but nobody wants to reuse it
