---
slug: "CONCATSUBSTR"
question_name: "Concatenate Substrings"
---

## Problem Statement

Given two strings `a` and `b`, determine if string `b` can be formed by concatenating one or more non-overlapping substrings of string `a` in the same order as they appear in `a`.

## Examples

input: `a = "abcdefgh"`, `b = "abedgh"`
output: `true`
explanation: The string `b` can be formed by concatenating substrings "ab" and "ef" from `a`.

input: `a = "abcdefgh"`, `b = "abefgh"`
output: `false`
explanation: The string `b` cannot be formed from `a` because "c" and "e" are not contiguous substrings in `a`.

## Function Signature

return_type: bool
name: can_form_by_concatenation
arguments: a -> str, b -> str

## Constraints

-   `1 <= |a|, |b| <= 10^5`
-   `a` and `b` consist of lowercase English letters.

## Test Cases

input: `a = "abcdefgh"`, `b = "abedgh"`
output: true

input: `a = "abcdefgh"`, `b = "abefgh"`
output: true

input: `a = "abcdefgh"`, `b = "abcdefghij"`
output: false

## Hidden Test Cases

input: `a = "abcdefgh"`, `b = "abefgh"`
output: true

input: `a = "abcdefgh"`, `b = "abcdefghij"`
output: false

input: `a = "abcdefgh"`, `b = "abcdgh"`
output: false
