---
slug: "BOBIAL"
question_name: "Bob in Alice"
---

## Problem Statement

Alice has a string `s` and Bob has a string `t`. Bob wants to know if he can make his string `t` by concatenating some of the substrings of `s` (possibly with repetitions). Help Bob to find out if it is possible.

Just Checking

## Examples

input: `s = "abcabcabc"`, `t = "abcabc"`
output: `true`
explanation: Bob can make his string `t` by concatenating the substrings of `s` as follows: `s[0:6] = "abcabc" = t`.

input: `s = "abcabcabc"`, `t = "abcab"`
output: `false`
explanation: Bob cannot make his string `t` by concatenating the substrings of `s`.

## Function Signature

return_type: bool
name: bob_in_alice
arguments: s -> str, t -> str

## Constraints

-   `1 <= |s|, |t| <= 10^5`
-   `s` and `t` consist of lowercase English letters.

## Test Cases

input: s = "abcabcabc", t = "abcabc"
output: true

input: s = "abcabcabc", t = "abcab"
output: false

input: s = "abcabcabc", t = "abcabcabc"
output: true

## Hidden Test Cases

input: s = "abcabcabc", t = "abcabcabc"
output: true

input: s = "abcabcabc", t = "abcabcabcabc"
output: false

input: s = "abcabcabc", t = "abcabcabcabcabc"
output: false
