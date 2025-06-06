import { describe, test, expect } from "vitest";
import {
    fileCharToIndex,
    fileIndexToChar,
    rankCharToIndex,
    rankIndexToChar,
} from "../utils/string";

describe("String utilities", () => {
    describe("fileCharToIndex", () => {
        test("converts lowercase file characters correctly", () => {
            expect(fileCharToIndex("a")).toBe(0);
            expect(fileCharToIndex("b")).toBe(1);
            expect(fileCharToIndex("c")).toBe(2);
            expect(fileCharToIndex("d")).toBe(3);
            expect(fileCharToIndex("e")).toBe(4);
            expect(fileCharToIndex("f")).toBe(5);
            expect(fileCharToIndex("g")).toBe(6);
            expect(fileCharToIndex("h")).toBe(7);
        });

        test("converts uppercase file characters correctly", () => {
            expect(fileCharToIndex("A")).toBe(0);
            expect(fileCharToIndex("B")).toBe(1);
            expect(fileCharToIndex("C")).toBe(2);
            expect(fileCharToIndex("D")).toBe(3);
            expect(fileCharToIndex("E")).toBe(4);
            expect(fileCharToIndex("F")).toBe(5);
            expect(fileCharToIndex("G")).toBe(6);
            expect(fileCharToIndex("H")).toBe(7);
        });

        test("returns null for invalid characters", () => {
            expect(fileCharToIndex("i")).toBeNull();
            expect(fileCharToIndex("z")).toBeNull();
            expect(fileCharToIndex("I")).toBeNull();
            expect(fileCharToIndex("Z")).toBeNull();
            expect(fileCharToIndex("1")).toBeNull();
            expect(fileCharToIndex("@")).toBeNull();
            expect(fileCharToIndex("")).toBeNull();
            expect(fileCharToIndex("ab")).toBeNull();
        });

        test("handles edge cases", () => {
            expect(fileCharToIndex(" ")).toBeNull();
            expect(fileCharToIndex("\n")).toBeNull();
            expect(fileCharToIndex("\t")).toBeNull();
        });
    });

    describe("fileIndexToChar", () => {
        test("converts file indices to lowercase characters", () => {
            expect(fileIndexToChar(0)).toBe("a");
            expect(fileIndexToChar(1)).toBe("b");
            expect(fileIndexToChar(2)).toBe("c");
            expect(fileIndexToChar(3)).toBe("d");
            expect(fileIndexToChar(4)).toBe("e");
            expect(fileIndexToChar(5)).toBe("f");
            expect(fileIndexToChar(6)).toBe("g");
            expect(fileIndexToChar(7)).toBe("h");
        });

        test("returns null for invalid indices", () => {
            expect(fileIndexToChar(-1)).toBeNull();
            expect(fileIndexToChar(8)).toBeNull();
            expect(fileIndexToChar(10)).toBeNull();
            expect(fileIndexToChar(-5)).toBeNull();
        });

        test("fileCharToIndex and fileIndexToChar are inverse operations", () => {
            const chars = ["a", "b", "c", "d", "e", "f", "g", "h"];
            const upperChars = ["A", "B", "C", "D", "E", "F", "G", "H"];

            chars.forEach((char, index) => {
                expect(fileCharToIndex(char)).toBe(index);
                expect(fileIndexToChar(index)).toBe(char);
            });

            upperChars.forEach((char, index) => {
                expect(fileCharToIndex(char)).toBe(index);
                expect(fileIndexToChar(fileCharToIndex(char)!)).toBe(
                    char.toLowerCase(),
                );
            });
        });
    });

    describe("rankCharToIndex", () => {
        test("converts rank characters correctly", () => {
            expect(rankCharToIndex("1")).toBe(0);
            expect(rankCharToIndex("2")).toBe(1);
            expect(rankCharToIndex("3")).toBe(2);
            expect(rankCharToIndex("4")).toBe(3);
            expect(rankCharToIndex("5")).toBe(4);
            expect(rankCharToIndex("6")).toBe(5);
            expect(rankCharToIndex("7")).toBe(6);
            expect(rankCharToIndex("8")).toBe(7);
        });

        test("returns null for invalid characters", () => {
            expect(rankCharToIndex("0")).toBeNull();
            expect(rankCharToIndex("9")).toBeNull();
            expect(rankCharToIndex("a")).toBeNull();
            expect(rankCharToIndex("A")).toBeNull();
            expect(rankCharToIndex("")).toBeNull();
            expect(rankCharToIndex("12")).toBeNull();
            expect(rankCharToIndex(" ")).toBeNull();
            expect(rankCharToIndex("-1")).toBeNull();
        });
    });

    describe("rankIndexToChar", () => {
        test("converts rank indices to characters", () => {
            expect(rankIndexToChar(0)).toBe("1");
            expect(rankIndexToChar(1)).toBe("2");
            expect(rankIndexToChar(2)).toBe("3");
            expect(rankIndexToChar(3)).toBe("4");
            expect(rankIndexToChar(4)).toBe("5");
            expect(rankIndexToChar(5)).toBe("6");
            expect(rankIndexToChar(6)).toBe("7");
            expect(rankIndexToChar(7)).toBe("8");
        });

        test("returns null for invalid indices", () => {
            expect(rankIndexToChar(-1)).toBeNull();
            expect(rankIndexToChar(8)).toBeNull();
            expect(rankIndexToChar(10)).toBeNull();
            expect(rankIndexToChar(-5)).toBeNull();
        });

        test("rankCharToIndex and rankIndexToChar are inverse operations", () => {
            const chars = ["1", "2", "3", "4", "5", "6", "7", "8"];

            chars.forEach((char, index) => {
                expect(rankCharToIndex(char)).toBe(index);
                expect(rankIndexToChar(index)).toBe(char);
            });

            for (let i = 0; i < 8; i++) {
                const char = rankIndexToChar(i);
                expect(char).not.toBeNull();
                expect(rankCharToIndex(char!)).toBe(i);
            }
        });
    });

    describe("comprehensive conversion tests", () => {
        test("all chess squares can be converted both ways", () => {
            const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
            const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];

            files.forEach((file, fileIndex) => {
                ranks.forEach((rank, rankIndex) => {
                    // Test lowercase
                    expect(fileCharToIndex(file)).toBe(fileIndex);
                    expect(rankCharToIndex(rank)).toBe(rankIndex);

                    // Test uppercase
                    expect(fileCharToIndex(file.toUpperCase())).toBe(fileIndex);

                    // Test inverse operations
                    expect(fileIndexToChar(fileIndex)).toBe(file);
                    expect(rankIndexToChar(rankIndex)).toBe(rank);
                });
            });
        });

        test("boundary conditions", () => {
            // Test exact boundaries
            expect(fileCharToIndex("a")).toBe(0);
            expect(fileCharToIndex("h")).toBe(7);
            expect(fileCharToIndex("A")).toBe(0);
            expect(fileCharToIndex("H")).toBe(7);

            expect(rankCharToIndex("1")).toBe(0);
            expect(rankCharToIndex("8")).toBe(7);

            // Test just outside boundaries
            expect(
                fileCharToIndex(String.fromCharCode("a".charCodeAt(0) - 1)),
            ).toBeNull(); // character before 'a'
            expect(
                fileCharToIndex(String.fromCharCode("h".charCodeAt(0) + 1)),
            ).toBeNull(); // character after 'h'
            expect(
                fileCharToIndex(String.fromCharCode("A".charCodeAt(0) - 1)),
            ).toBeNull(); // character before 'A'
            expect(
                fileCharToIndex(String.fromCharCode("H".charCodeAt(0) + 1)),
            ).toBeNull(); // character after 'H'
        });
    });
});
