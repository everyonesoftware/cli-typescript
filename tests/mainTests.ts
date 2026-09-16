import { Test, TestRunner } from "@everyonesoftware/common/tests";

export function test(runner: TestRunner): void
{
    runner.testFile("main.ts", () =>
    {
        runner.test("sandbox", (test: Test) =>
        {
            test.assertEqual(1, 1);
        });
    });
}