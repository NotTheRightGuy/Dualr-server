---
slug: "GUIDE"
question_name: "How to Write a Coding Question"
---

## Problem Statement

Begin with a clear and concise problem statement. Describe the task or challenge that needs to be solved. Use backticks (`) to highlight important terms or variables. For example:

The problem involves implementing a function `calculateSum` that takes two integers `a` and `b` as input and returns their sum.

<sep>

You can provide alternative phrasings or additional context separated by `<sep>` tags. This allows for randomly selecting one version when presenting the question.

<sep>

Ensure that all necessary information is included in each version of the problem statement.

## Function Signature

Specify the function signature in the following format:

return_type: [return type]
name: [function name]
arguments: [argument1 name] -> [argument1 type], [argument2 name] -> [argument2 type], ...

## Constraints

List any constraints or limitations for the problem. Use bullet points and backticks for specific values or ranges:

-   `1 <= n <= 10^5`
-   All input numbers are integers.
-   The output should be rounded to two decimal places.

## Examples

Provide at least two examples in the following format:

input: `[input values]`
output: `[expected output]`
explanation: [Clear explanation of how the output is derived from the input]

input: `[another set of input values]`
output: [expected output]
explanation: [Explanation for this example]

## Test Cases

Include several test cases in this format:

input: [input values without backticks]
output: [expected output]

input: [another set of input values]
output: [expected output]

## Hidden Test Cases

Add hidden test cases that won't be visible to the user, following the same format as the visible test cases:

input: [hidden input values]
output: [hidden expected output]

input: [another set of hidden input values]
output: [hidden expected output]
