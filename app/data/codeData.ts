export type Language = 'java' | 'cpp' | 'python' | 'c' | 'rust';

export interface CodeQuestion {
    id: string;
    title: string;
    functionName: string; // Used for functional testing in Python/others
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    description: string;
    constraints: string[];
    starterCode: Record<Language, string>;
    testCases: { input: string; output: string }[];
    exp: number;
}

export const codeQuestions: CodeQuestion[] = [
    {
        id: "two-sum",
        title: "Two Sum",
        functionName: "two_sum",
        difficulty: "Easy",
        category: "Arrays",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9",
            "-10^9 <= target <= 10^9"
        ],
        starterCode: {
            python: "def two_sum(nums, target):\n    # Your code here\n    pass",
            java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}",
            cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n    }\n};",
            c: "/**\n * Note: The returned array must be malloced, assume caller calls free().\n */\nint* twoSum(int* nums, int numsSize, int target, int* returnSize){\n    // Your code here\n}",
            rust: "impl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        // Your code here\n    }\n}"
        },
        testCases: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
        ],
        exp: 50
    },
    {
        id: "reverse-string",
        title: "Reverse String",
        functionName: "reverse_string",
        difficulty: "Easy",
        category: "Strings",
        description: "Write a function that reverses a string. The input string is given as an array of characters `s`.",
        constraints: [
            "1 <= s.length <= 10^5",
            "s[i] is a printable ascii character"
        ],
        starterCode: {
            python: "def reverse_string(s):\n    # Your code here\n    pass",
            java: "class Solution {\n    public void reverseString(char[] s) {\n        // Your code here\n    }\n}",
            cpp: "class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Your code here\n    }\n};",
            c: "void reverseString(char* s, int sSize){\n    // Your code here\n}",
            rust: "impl Solution {\n    pub fn reverse_string(s: &mut Vec<char>) {\n        // Your code here\n    }\n}"
        },
        testCases: [
            { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
            { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
        ],
        exp: 50
    },
    {
        id: "fibonacci",
        title: "Fibonacci Number",
        functionName: "fib",
        difficulty: "Easy",
        category: "Math",
        description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.",
        constraints: [
            "0 <= n <= 30"
        ],
        starterCode: {
            python: "def fib(n):\n    # Your code here\n    pass",
            java: "class Solution {\n    public int fib(int n) {\n        // Your code here\n        return 0;\n    }\n}",
            cpp: "class Solution {\npublic:\n    int fib(int n) {\n        // Your code here\n    }\n};",
            c: "int fib(int n){\n    // Your code here\n}",
            rust: "impl Solution {\n    pub fn fib(n: i32) -> i32 {\n        // Your code here\n    }\n}"
        },
        testCases: [
            { input: "n = 2", output: "1" },
            { input: "n = 4", output: "3" }
        ],
        exp: 50
    }
];
