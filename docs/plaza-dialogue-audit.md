# Plaza dialogue audit

Reviewed the current written pools in `src/themes/wiiuPlazaUserPosts.ts` and `src/themes/wiiuPlazaPosts.ts` on 2026-10-21. This is an audit, not a rewrite of the supplied dialogue.

| Pool | Count |
| --- | ---: |
| App ID entries | 218 |
| App ID conversation pairs | 386 |
| General conversation pairs | 369 |
| Total written conversation pairs | 755 |
| Additional legacy game-specific single posts | 88 across 27 games |
| Main generic post templates | 12 |
| Generic short replies | 10 |

The last two counts exclude conditional playtime, achievement, season, shortcut and screenshot templates. General means the pool is available regardless of the selected app ID; some entries still name particular games, so it is not a count of every semantically generic conversation.

## Exact repetition

Case, punctuation and whitespace normalization finds two duplicated opening lines:

| Opening line | App ID pairs | General pairs | Total |
| --- | ---: | ---: | ---: |
| I am stuck here, save me! | 43 | 51 | 94 |
| Where am i? Somebody help me, i was playing my steam deck! | 25 | 54 | 79 |

These account for 173/755 conversations (22.9%), including 68/386 app ID conversations (17.6%). They are Plaza/Steam Deck meta dialogue, not specific commentary on the assigned game. Removing redundant copies would remove 171 opening-line occurrences, leaving 584 distinct normalized openings.

All 755 written follow-ups are distinct under the same normalization; no complete post/reply pair is an exact duplicate. This does not mean they are all meaningfully different.

## Semantic repetition and weak replies

The general pool repeatedly presents the same premise in a longer literary version followed by a shorter comic version: a storm destroying a survival shelter, a large underwater shadow, drifting into a barrier, a creaking hospital floor, combat music triggering panic, inventory loss, failed teamwork, and parry sound effects. These are qualitative examples, not an exhaustive numerical semantic-duplicate classification.

Many replies describe or label the premise rather than answer the speaker: “Survival game weather disrespect.”, “Thalassophobia confirmed.”, “Parry sound effect dopamine hit.” and “Industrial over-engineering.” Some named-game comments are in the general pool and can therefore appear beside an unrelated selected title.

The ten stock replies are deliberately broad reactions (agreement, encouragement, surprise); they do not identify what the original speaker actually said. Written follow-ups should therefore remain attached to their original posts. A blocked written reply is skipped, never replaced with a stock reaction.

## Recommended content cleanup

1. Keep the two trapped-in-Plaza premises once each in the general pool rather than copying them into app ID entries.
2. Merge or rewrite the paired restatements in the general pool after a manual content review.
3. Move named-game general conversations to the matching app ID.
4. Rewrite explanatory labels as replies that directly address the original speaker.

The rolling one-hour line cooldown prevents exact repeated lines during play, but does not resolve semantically similar premises or inappropriate app ID assignments.
