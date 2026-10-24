const fs = require('fs');
const path = require('path');

const LEETCODE_POPULATION_DATA = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

Output the two indices separated by a space in ascending order.

### Input Format
- First line contains integer \`N\`, number of elements.
- Second line contains \`N\` space-separated integers.
- Third line contains integer \`target\`.

### Output Format
- Print two space-separated indices \`i j\` (0-indexed).`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '4\n2 7 11 15\n9', expected_output: '0 1', is_hidden: false },
      { id: 2, input: '3\n3 2 4\n6', expected_output: '1 2', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '2\n3 3\n6', expected_output: '0 1', is_hidden: true },
      { id: 102, input: '5\n1 5 3 7 9\n12', expected_output: '1 3', is_hidden: true },
      { id: 103, input: '6\n-3 4 3 90 2 10\n0', expected_output: '0 2', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    n = int(lines[0])\n    nums = list(map(int, lines[1].split()))\n    target = int(lines[2])\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            print(f"{seen[diff]} {i}")\n            return\n        seen[num] = i\n\nif __name__ == '__main__':\n    solve()\n`,
      javascript: `const fs = require('fs');\nfunction solve() {\n    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);\n    if (input.length < 3) return;\n    const n = Number(input[0]);\n    const nums = input.slice(1, 1 + n).map(Number);\n    const target = Number(input[1 + n]);\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) { console.log(map.get(comp) + " " + i); return; }\n        map.set(nums[i], i);\n    }\n}\nsolve();\n`
    }
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'easy',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Input Format
- A single line containing the string \`s\`.

### Output Format
- Print \`true\` or \`false\`.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '()', expected_output: 'true', is_hidden: false },
      { id: 2, input: '()[]{}', expected_output: 'true', is_hidden: false },
      { id: 3, input: '(]', expected_output: 'false', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '([)]', expected_output: 'false', is_hidden: true },
      { id: 102, input: '{[]}', expected_output: 'true', is_hidden: true },
      { id: 103, input: '(((((((', expected_output: 'false', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top: print('false'); return\n        else:\n            stack.append(char)\n    print('true' if not stack else 'false')\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'easy',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`-th day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.

### Input Format
- First line contains integer \`N\`, number of days.
- Second line contains \`N\` space-separated integers representing prices.

### Output Format
- Single integer representing maximum profit.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '6\n7 1 5 3 6 4', expected_output: '5', is_hidden: false },
      { id: 2, input: '5\n7 6 4 3 1', expected_output: '0', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '2\n2 4', expected_output: '2', is_hidden: true },
      { id: 102, input: '6\n2 1 2 1 0 1', expected_output: '1', is_hidden: true },
      { id: 103, input: '6\n3 2 6 5 0 3', expected_output: '4', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines or len(lines) < 2: return\n    n = int(lines[0])\n    prices = list(map(int, lines[1].split()))\n    min_price = float('inf')\n    max_profit = 0\n    for p in prices:\n        if p < min_price: min_price = p\n        elif p - min_price > max_profit: max_profit = p - min_price\n    print(max_profit)\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'easy',
    description: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.

### Input Format
- First line contains integer \`N\`.
- Second line contains \`N\` space-separated integers.

### Output Format
- Print \`true\` or \`false\`.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '4\n1 2 3 1', expected_output: 'true', is_hidden: false },
      { id: 2, input: '4\n1 2 3 4', expected_output: 'false', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '10\n1 1 1 3 3 4 3 2 4 2', expected_output: 'true', is_hidden: true },
      { id: 102, input: '1\n999', expected_output: 'false', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines or len(lines) < 2: print('false'); return\n    nums = list(map(int, lines[1].split()))\n    print('true' if len(nums) != len(set(nums)) else 'false')\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'easy',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

### Input Format
- First line contains string \`s\`.
- Second line contains string \`t\`.

### Output Format
- Print \`true\` or \`false\`.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: 'anagram\nnagaram', expected_output: 'true', is_hidden: false },
      { id: 2, input: 'rat\ncar', expected_output: 'false', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: 'a\nab', expected_output: 'false', is_hidden: true },
      { id: 102, input: 'listen\nsilent', expected_output: 'true', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if len(lines) < 2: print('false'); return\n    s = lines[0].strip()\n    t = lines[1].strip()\n    print('true' if sorted(s) == sorted(t) else 'false')\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'medium',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.

### Input Format
- First line contains integer \`N\`.
- Second line contains \`N\` space-separated integers.

### Output Format
- Print single integer representing the maximum subarray sum.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '9\n-2 1 -3 4 -1 2 1 -5 4', expected_output: '6', is_hidden: false },
      { id: 2, input: '1\n1', expected_output: '1', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '5\n5 4 -1 7 8', expected_output: '23', is_hidden: true },
      { id: 102, input: '3\n-3 -2 -1', expected_output: '-1', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if len(lines) < 2: return\n    nums = list(map(int, lines[1].split()))\n    curr_sum = max_sum = nums[0]\n    for x in nums[1:]:\n        curr_sum = max(x, curr_sum + x)\n        max_sum = max(max_sum, curr_sum)\n    print(max_sum)\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    difficulty: 'medium',
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

You must write an algorithm that runs in **O(n)** time and without using the division operation.

### Input Format
- First line contains integer \`N\`.
- Second line contains \`N\` space-separated integers.

### Output Format
- Print \`N\` space-separated integers representing the resulting products.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '4\n1 2 3 4', expected_output: '24 12 8 6', is_hidden: false },
      { id: 2, input: '5\n-1 1 0 -3 3', expected_output: '0 0 9 0 0', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '2\n2 3', expected_output: '3 2', is_hidden: true },
      { id: 102, input: '3\n0 0 2', expected_output: '0 0 0', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if len(lines) < 2: return\n    nums = list(map(int, lines[1].split()))\n    n = len(nums)\n    res = [1] * n\n    prefix = 1\n    for i in range(n):\n        res[i] = prefix\n        prefix *= nums[i]\n    postfix = 1\n    for i in range(n - 1, -1, -1):\n        res[i] *= postfix\n        postfix *= nums[i]\n    print(" ".join(map(str, res)))\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: '3Sum',
    slug: '3sum',
    difficulty: 'medium',
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets. Print each triplet sorted in ascending order on a separate line. If no triplets exist, print \`NONE\`.

### Input Format
- First line contains integer \`N\`.
- Second line contains \`N\` space-separated integers.

### Output Format
- Each triplet on a line, or \`NONE\`.`,
    constraints: { time_limit_ms: 1500, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '6\n-1 0 1 2 -1 -4', expected_output: '-1 -1 2\n-1 0 1', is_hidden: false },
      { id: 2, input: '3\n0 1 1', expected_output: 'NONE', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '3\n0 0 0', expected_output: '0 0 0', is_hidden: true },
      { id: 102, input: '5\n-2 0 1 1 2', expected_output: '-2 0 2\n-2 1 1', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if len(lines) < 2: print('NONE'); return\n    nums = sorted(list(map(int, lines[1].split())))\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s < 0: l += 1\n            elif s > 0: r -= 1\n            else:\n                res.append(f"{nums[i]} {nums[l]} {nums[r]}")\n                while l < r and nums[l] == nums[l + 1]: l += 1\n                while l < r and nums[r] == nums[r - 1]: r -= 1\n                l += 1; r -= 1\n    if not res: print('NONE')\n    else: print('\\n'.join(res))\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'easy',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?

### Input Format
- A single integer \`n\`.

### Output Format
- Single integer representing total distinct ways.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '2', expected_output: '2', is_hidden: false },
      { id: 2, input: '3', expected_output: '3', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '1', expected_output: '1', is_hidden: true },
      { id: 102, input: '5', expected_output: '8', is_hidden: true },
      { id: 103, input: '10', expected_output: '89', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    raw = sys.stdin.read().strip()\n    if not raw: return\n    n = int(raw)\n    if n <= 2: print(n); return\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    print(b)\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'medium',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.

### Input Format
- First line contains integer \`N\`, number of coin denominations.
- Second line contains \`N\` space-separated integers.
- Third line contains integer \`amount\`.

### Output Format
- Single integer representing minimum coins or \`-1\`.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '3\n1 2 5\n11', expected_output: '3', is_hidden: false },
      { id: 2, input: '1\n2\n3', expected_output: '-1', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '1\n1\n0', expected_output: '0', is_hidden: true },
      { id: 102, input: '2\n2 5\n10', expected_output: '2', is_hidden: true },
      { id: 103, input: '3\n186 419 83\n6249', expected_output: '20', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if len(lines) < 3: return\n    coins = list(map(int, lines[1].split()))\n    amount = int(lines[2])\n    dp = [float('inf')] * (amount + 1)\n    dp[0] = 0\n    for c in coins:\n        for x in range(c, amount + 1):\n            dp[x] = min(dp[x], dp[x - c] + 1)\n    print(dp[amount] if dp[amount] != float('inf') else -1)\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'House Robber',
    slug: 'house-robber',
    difficulty: 'medium',
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.

Given an integer array \`nums\` representing the amount of money of each house, return the maximum amount of money you can rob tonight **without alerting the police**.

### Input Format
- First line contains integer \`N\`.
- Second line contains \`N\` space-separated integers representing money in each house.

### Output Format
- Single integer representing maximum loot.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '4\n1 2 3 1', expected_output: '4', is_hidden: false },
      { id: 2, input: '5\n2 7 9 3 1', expected_output: '12', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '1\n5', expected_output: '5', is_hidden: true },
      { id: 102, input: '2\n2 1', expected_output: '2', is_hidden: true },
      { id: 103, input: '6\n2 1 1 2 10 1', expected_output: '14', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if len(lines) < 2: return\n    nums = list(map(int, lines[1].split()))\n    rob1, rob2 = 0, 0\n    for n in nums:\n        new_rob = max(rob1 + n, rob2)\n        rob1 = rob2\n        rob2 = new_rob\n    print(rob2)\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'easy',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with **O(log n)** runtime complexity.

### Input Format
- First line contains integer \`N\`.
- Second line contains \`N\` space-separated integers.
- Third line contains integer \`target\`.

### Output Format
- Print 0-indexed position or \`-1\`.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '6\n-1 0 3 5 9 12\n9', expected_output: '4', is_hidden: false },
      { id: 2, input: '6\n-1 0 3 5 9 12\n2', expected_output: '-1', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '1\n5\n5', expected_output: '0', is_hidden: true },
      { id: 102, input: '2\n2 5\n2', expected_output: '0', is_hidden: true },
      { id: 103, input: '2\n2 5\n5', expected_output: '1', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if len(lines) < 3: return\n    nums = list(map(int, lines[1].split()))\n    target = int(lines[2])\n    l, r = 0, len(nums) - 1\n    ans = -1\n    while l <= r:\n        m = (l + r) // 2\n        if nums[m] == target: ans = m; break\n        elif nums[m] < target: l = m + 1\n        else: r = m - 1\n    print(ans)\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'medium',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.

### Input Format
- A single line containing the string \`s\`.

### Output Format
- Print single integer representing the length.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: 'abcabcbb', expected_output: '3', is_hidden: false },
      { id: 2, input: 'bbbbb', expected_output: '1', is_hidden: false },
      { id: 3, input: 'pwwkew', expected_output: '3', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: ' ', expected_output: '1', is_hidden: true },
      { id: 102, input: 'dvdf', expected_output: '3', is_hidden: true },
      { id: 103, input: 'tmmzuxt', expected_output: '5', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().rstrip('\\r\\n')\n    char_set = set()\n    l = 0\n    res = 0\n    for r in range(len(s)):\n        while s[r] in char_set:\n            char_set.remove(s[l])\n            l += 1\n        char_set.add(s[r])\n        res = max(res, r - l + 1)\n    print(res)\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'hard',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.

### Input Format
- First line contains integer \`N\`.
- Second line contains \`N\` space-separated integers representing elevation heights.

### Output Format
- Single integer representing total trapped water volume.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', expected_output: '6', is_hidden: false },
      { id: 2, input: '6\n4 2 0 3 2 5', expected_output: '9', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '1\n1', expected_output: '0', is_hidden: true },
      { id: 102, input: '4\n3 0 0 3', expected_output: '6', is_hidden: true },
      { id: 103, input: '5\n5 4 1 2 5', expected_output: '8', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if len(lines) < 2: print(0); return\n    height = list(map(int, lines[1].split()))\n    if not height: print(0); return\n    l, r = 0, len(height) - 1\n    left_max, right_max = height[l], height[r]\n    res = 0\n    while l < r:\n        if left_max < right_max:\n            l += 1\n            left_max = max(left_max, height[l])\n            res += left_max - height[l]\n        else:\n            r -= 1\n            right_max = max(right_max, height[r])\n            res += right_max - height[r]\n    print(res)\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'easy',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

### Input Format
- A single line containing the string \`s\`.

### Output Format
- Print \`true\` or \`false\`.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: 'A man, a plan, a canal: Panama', expected_output: 'true', is_hidden: false },
      { id: 2, input: 'race a car', expected_output: 'false', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: ' ', expected_output: 'true', is_hidden: true },
      { id: 102, input: '0P', expected_output: 'false', is_hidden: true },
      { id: 103, input: 'ab_a', expected_output: 'true', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    s = sys.stdin.read().strip()\n    clean = [c.lower() for c in s if c.isalnum()]\n    print('true' if clean == clean[::-1] else 'false')\n\nif __name__ == '__main__':\n    solve()\n`
    }
  },
  {
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'medium',
    description: `Given an array of intervals where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of non-overlapping intervals.

### Input Format
- First line contains \`N\`, the number of intervals.
- Next \`N\` lines each contain two space-separated integers \`start end\`.

### Output Format
- Print each merged interval \`start end\` on a new line.`,
    constraints: { time_limit_ms: 1000, memory_limit_kb: 64000 },
    sample_test_cases: [
      { id: 1, input: '4\n1 3\n2 6\n8 10\n15 18', expected_output: '1 6\n8 10\n15 18', is_hidden: false },
      { id: 2, input: '2\n1 4\n4 5', expected_output: '1 5', is_hidden: false }
    ],
    hidden_test_cases: [
      { id: 101, input: '1\n1 4', expected_output: '1 4', is_hidden: true },
      { id: 102, input: '3\n1 4\n0 2\n3 5', expected_output: '0 5', is_hidden: true }
    ],
    starter_code: {
      python: `import sys\n\ndef solve():\n    lines = sys.stdin.read().splitlines()\n    if not lines: return\n    n = int(lines[0])\n    intervals = []\n    for i in range(1, 1 + n):\n        parts = list(map(int, lines[i].split()))\n        intervals.append(parts)\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for cur in intervals:\n        if not merged or merged[-1][1] < cur[0]:\n            merged.append(cur)\n        else:\n            merged[-1][1] = max(merged[-1][1], cur[1])\n    for m in merged:\n        print(f"{m[0]} {m[1]}")\n\nif __name__ == '__main__':\n    solve()\n`
    }
  }
];

function populate() {
  console.log(`Starting population of ${LEETCODE_POPULATION_DATA.length} curated LeetCode problems...`);

  // 1. Write to custom_problems.json
  const customFile = path.join(process.cwd(), 'src/lib/problems/custom_problems.json');
  fs.writeFileSync(customFile, JSON.stringify(LEETCODE_POPULATION_DATA, null, 2), 'utf-8');
  console.log(`✓ Successfully populated ${LEETCODE_POPULATION_DATA.length} problems into custom_problems.json`);

  // 2. Generate and write SQL seed to supabase/seed/problems.sql
  const sqlFile = path.join(process.cwd(), 'supabase/seed/problems.sql');
  const sqlStatements = LEETCODE_POPULATION_DATA.map((p) => {
    const escapedDesc = p.description.replace(/'/g, "''");
    const escapedStarter = JSON.stringify(p.starter_code || {}).replace(/'/g, "''");
    const escapedConstraints = JSON.stringify(p.constraints).replace(/'/g, "''");
    const escapedSample = JSON.stringify(p.sample_test_cases).replace(/'/g, "''");
    const escapedHidden = JSON.stringify(p.hidden_test_cases).replace(/'/g, "''");
    const escapedBenchmarks = JSON.stringify({
      python: { optimal_time_ms: 25, optimal_memory_kb: 4500 },
      javascript: { optimal_time_ms: 30, optimal_memory_kb: 5500 },
      cpp: { optimal_time_ms: 2, optimal_memory_kb: 1200 },
      java: { optimal_time_ms: 40, optimal_memory_kb: 12000 },
      go: { optimal_time_ms: 5, optimal_memory_kb: 2500 }
    }).replace(/'/g, "''");

    return `INSERT INTO public.problems (title, slug, difficulty, description, constraints, sample_test_cases, hidden_test_cases, optimal_benchmarks, starter_code)\nVALUES ('${p.title}', '${p.slug}', '${p.difficulty}', '${escapedDesc}', '${escapedConstraints}'::jsonb, '${escapedSample}'::jsonb, '${escapedHidden}'::jsonb, '${escapedBenchmarks}'::jsonb, '${escapedStarter}'::jsonb)\nON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, sample_test_cases = EXCLUDED.sample_test_cases, hidden_test_cases = EXCLUDED.hidden_test_cases;`;
  }).join('\n\n');

  fs.writeFileSync(sqlFile, sqlStatements, 'utf-8');
  console.log(`✓ Successfully updated supabase/seed/problems.sql with ${LEETCODE_POPULATION_DATA.length} problems!`);
}

populate();
