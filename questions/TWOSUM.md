---
slug: "2SUM"
question_name: "Two Sum"
---

## Problem Statement

The problem involves implementing a function `twoSum` that takes an array of integers `nums` and an integer `target` as input and returns the indices of the two numbers that add up to the `target`.

<sep>

You are given an array of integers `nums` and an integer `target`. Implement a function `twoSum` to find the indices of the two numbers in `nums` such that they add up to `target`.

<sep>

Given an array `nums` and an integer `target`, write a function `twoSum` to return the indices of the two numbers that sum up to the `target`.

## Function Signature

return_type: List[int]
name: twoSum
arguments: nums -> List[int], target -> int

## Constraints

-   Each input has exactly one solution.
-   You may not use the same element twice.
-   You can return the answer in any order.
-   The input array `nums` will have a length in the range `[2, 10^4]`.
-   The input integer `target` will be in the range `[-10^9, 10^9]`.

## Examples

input: `nums = [2, 7, 11, 15]`, `target = 9`
output: `[0, 1]`
explanation: The numbers at indices 0 and 1 are 2 and 7, respectively, and their sum is 9.

input: `nums = [3, 2, 4]`, `target = 6`
output: `[1, 2]`
explanation: The numbers at indices 1 and 2 are 2 and 4, respectively, and their sum is 6.

## Test Cases

input: nums = [2, 7, 11, 15], target = 9
output: [0, 1]

input: nums = [3, 2, 4], target = 6
output: [1, 2]

## Hidden Test Cases

input: nums = [1, 5, 3, 7], target = 8
output: [1, 3]

input: nums = [4, 6, 8, 2], target = 10
output: [0, 3]
