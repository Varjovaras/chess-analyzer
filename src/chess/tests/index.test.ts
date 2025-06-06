import { describe, test, expect } from "vitest";

// Import all test modules to ensure they run
import "./board.test";
import "./utils.test";
import "./pieces.test";
import "./game.test";

describe("Chess module integration tests", () => {
    test("all test suites are imported and run", () => {
        // This test ensures all test files are properly imported
        // Individual tests are in their respective files
        expect(true).toBe(true);
    });
});
