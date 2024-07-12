import matter from "gray-matter";
import fs from "fs";

interface Example {
    input: string;
    output: string;
    explanation: string;
}

interface Testcase {
    input: string;
    output: string;
}

interface FunctionDetails {
    return_type: string;
    name: string;
    arguments: any;
}

function extractHeadingContent(markdownContent: string, headingName: string) {
    const lines = markdownContent.split("\n");
    const heading = `## ${headingName}`;
    let content = [];
    let capture = false;

    for (const line of lines) {
        if (line.trim() === heading) {
            capture = true;
            continue;
        }
        if (line.startsWith("## ") && capture) {
            break;
        }
        if (capture) {
            content.push(line);
        }
    }

    return content.join("\n").trim();
}

function parseTestcases(testcaseString: string) {
    const testCases: Testcase[] = [];
    const testCasesBlock = testcaseString.split(/\r\n\r\n/);

    for (const block of testCasesBlock) {
        const lines = block.split("\r\n");

        const inputMatch = lines[0].toLowerCase().split("input: ")[1];
        const outputMatch = lines[1].toLowerCase().split("output: ")[1];

        testCases.push({
            input: inputMatch,
            output: outputMatch,
        });
    }

    return testCases;
}

function parseFunctionDetails(inputString: string): FunctionDetails {
    const lines = inputString.split("\r\n");
    const result: FunctionDetails = {
        return_type: "",
        name: "",
        arguments: [],
    };

    lines.forEach((line) => {
        let [key, value] = line.split(": ");
        if (key === "return_type") {
            result.return_type = value;
        } else if (key === "name") {
            result.name = value;
        } else if (key === "arguments") {
            const args = value.split(", ").map((arg) => arg.split("-> "));
            args.forEach((arg) => {
                result.arguments.push({ [arg[0]]: arg[1] });
            });
        }
    });

    return result;
}

function getRandomProblemStatement(content: string): string {
    const problemStatements = content.split("<sep>");
    const randomIndex = Math.floor(Math.random() * problemStatements.length);
    return problemStatements[randomIndex].trim();
}

function parseExamples(exampleString: string) {
    const examples: Example[] = [];
    const exampleBlocks = exampleString.split(/\r\n\r\n/);

    for (const block of exampleBlocks) {
        const lines = block.split("\r\n");
        if (lines.length < 3) continue;

        const inputMatch = lines[0].split("input: ")[1];
        const outputMatch = lines[1].split("output: ")[1];
        const explanationMatch = lines[2].split("explanation: ")[1];

        examples.push({
            input: inputMatch,
            output: outputMatch,
            explanation: explanationMatch,
        });
    }

    return examples;
}

function createJSONFromMarkdown(filePath: string) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: metadata, content } = matter(fileContent);

    const questionJSON = {
        slug: metadata.slug,
        question_name: metadata.question_name,
        problem_statement: getRandomProblemStatement(
            extractHeadingContent(content, "Problem Statement")
        ),
        function_signature: parseFunctionDetails(
            extractHeadingContent(content, "Function Signature")
        ),
        examples: parseExamples(extractHeadingContent(content, "Examples")),
        constraints: extractHeadingContent(content, "Constraints").split("\n"),
        testcases: parseTestcases(extractHeadingContent(content, "Test Cases")),
        hidden_testcases: parseTestcases(
            extractHeadingContent(content, "Hidden Test Cases")
        ),
    };

    return questionJSON;
}

export default createJSONFromMarkdown;
