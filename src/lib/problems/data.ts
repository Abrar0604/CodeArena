import { Problem } from '@/types';

export const SEED_PROBLEMS: Problem[] = [
  {
    id: 'p1111111-1111-1111-1111-111111111111',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

Output the two indices separated by a space in ascending order.

### Input Format
- First line contains an integer \`N\`, the number of elements.
- Second line contains \`N\` space-separated integers representing \`nums\`.
- Third line contains an integer \`target\`.

### Output Format
- Print two space-separated indices \`i j\` (0-indexed, where \`i < j\`).

### Example 1
\`\`\`
Input:
4
2 7 11 15
9

Output:
0 1
\`\`\`

### Example 2
\`\`\`
Input:
3
3 2 4
6

Output:
1 2
\`\`\``,
    constraints: {
      time_limit_ms: 1000,
      memory_limit_kb: 64000,
    },
    sample_test_cases: [
      {
        id: 1,
        input: '4\n2 7 11 15\n9',
        expected_output: '0 1',
        is_hidden: false,
      },
      {
        id: 2,
        input: '3\n3 2 4\n6',
        expected_output: '1 2',
        is_hidden: false,
      },
    ],
    hidden_test_cases: [
      {
        id: 3,
        input: '2\n3 3\n6',
        expected_output: '0 1',
        is_hidden: true,
      },
      {
        id: 4,
        input: '5\n1 5 3 7 9\n12',
        expected_output: '1 3',
        is_hidden: true,
      },
      {
        id: 5,
        input: '6\n-3 4 3 90 2 10\n0',
        expected_output: '0 2',
        is_hidden: true,
      },
    ],
    optimal_benchmarks: {
      python: { optimal_time_ms: 25, optimal_memory_kb: 4500 },
      javascript: { optimal_time_ms: 30, optimal_memory_kb: 5500 },
      cpp: { optimal_time_ms: 2, optimal_memory_kb: 1200 },
      java: { optimal_time_ms: 40, optimal_memory_kb: 12000 },
      go: { optimal_time_ms: 5, optimal_memory_kb: 2500 },
    },
    starter_code: {
      python: `import sys

def solve():
    input_data = sys.stdin.read().split()
    if not input_data:
        return
    n = int(input_data[0])
    nums = [int(x) for x in input_data[1:n+1]]
    target = int(input_data[n+1])
    
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            print(f"{seen[complement]} {i}")
            return
        seen[num] = i

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
    const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!input || input.length < 3) return;
    
    const n = parseInt(input[0]);
    const nums = input.slice(1, n + 1).map(Number);
    const target = parseInt(input[n + 1]);
    
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const comp = target - nums[i];
        if (map.has(comp)) {
            console.log(map.get(comp) + " " + i);
            return;
        }
        map.set(nums[i], i);
    }
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    int n;
    if (!(cin >> n)) return 0;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) cin >> nums[i];
    int target;
    cin >> target;
    
    unordered_map<int, int> seen;
    for (int i = 0; i < n; i++) {
        int comp = target - nums[i];
        if (seen.count(comp)) {
            cout << seen[comp] << " " << i << "\\n";
            return 0;
        }
        seen[nums[i]] = i;
    }
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();
        
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int comp = target - nums[i];
            if (map.containsKey(comp)) {
                System.out.println(map.get(comp) + " " + i);
                return;
            }
            map.put(nums[i], i);
        }
    }
}
`,
      go: `package main

import (
\t"bufio"
\t"fmt"
\t"os"
\t"strconv"
)

func main() {
\tscanner := bufio.NewScanner(os.Stdin)
\tscanner.Split(bufio.ScanWords)
\tif !scanner.Scan() {
\t\treturn
\t}
\tn, _ := strconv.Atoi(scanner.Text())
\tnums := make([]int, n)
\tfor i := 0; i < n; i++ {
\t\tscanner.Scan()
\t\tnums[i], _ = strconv.Atoi(scanner.Text())
\t}
\tscanner.Scan()
\ttarget, _ := strconv.Atoi(scanner.Text())

\tseen := make(map[int]int)
\tfor i, num := range nums {
\t\tcomp := target - num
\t\tif prev, ok := seen[comp]; ok {
\t\t\tfmt.Printf("%d %d\\n", prev, i)
\t\t\treturn
\t\t}
\t\tseen[num] = i
\t}
}
`,
    },
  },
  {
    id: 'p2222222-2222-2222-2222-222222222222',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'easy',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Input Format
- A single line containing string \`s\`.

### Output Format
- Print \`true\` if valid, otherwise \`false\`.

### Example 1
\`\`\`
Input:
()[]{}

Output:
true
\`\`\`

### Example 2
\`\`\`
Input:
(]

Output:
false
\`\`\``,
    constraints: {
      time_limit_ms: 1000,
      memory_limit_kb: 64000,
    },
    sample_test_cases: [
      {
        id: 1,
        input: '()[]{}',
        expected_output: 'true',
        is_hidden: false,
      },
      {
        id: 2,
        input: '(]',
        expected_output: 'false',
        is_hidden: false,
      },
    ],
    hidden_test_cases: [
      {
        id: 3,
        input: '([{}])',
        expected_output: 'true',
        is_hidden: true,
      },
      {
        id: 4,
        input: ']',
        expected_output: 'false',
        is_hidden: true,
      },
      {
        id: 5,
        input: '(((((((((())))))))))',
        expected_output: 'true',
        is_hidden: true,
      },
    ],
    optimal_benchmarks: {
      python: { optimal_time_ms: 20, optimal_memory_kb: 4200 },
      javascript: { optimal_time_ms: 25, optimal_memory_kb: 5000 },
      cpp: { optimal_time_ms: 2, optimal_memory_kb: 1000 },
      java: { optimal_time_ms: 35, optimal_memory_kb: 11000 },
      go: { optimal_time_ms: 4, optimal_memory_kb: 2200 },
    },
    starter_code: {
      python: `import sys

def solve():
    s = sys.stdin.read().strip()
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for ch in s:
        if ch in pairs:
            if not stack or stack[-1] != pairs[ch]:
                print("false")
                return
            stack.pop()
        else:
            stack.append(ch)
            
    print("true" if not stack else "false")

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
    const s = fs.readFileSync(0, 'utf-8').trim();
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };
    
    for (const ch of s) {
        if (pairs[ch]) {
            if (!stack.length || stack[stack.length - 1] !== pairs[ch]) {
                console.log('false');
                return;
            }
            stack.pop();
        } else {
            stack.push(ch);
        }
    }
    console.log(stack.length === 0 ? 'true' : 'false');
}

solve();
`,
      cpp: `#include <iostream>
#include <string>
#include <stack>

using namespace std;

int main() {
    string s;
    if (!(cin >> s)) return 0;
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) { cout << "false\\n"; return 0; }
            if (c == ')' && st.top() != '(') { cout << "false\\n"; return 0; }
            if (c == '}' && st.top() != '{') { cout << "false\\n"; return 0; }
            if (c == ']' && st.top() != '[') { cout << "false\\n"; return 0; }
            st.pop();
        }
    }
    cout << (st.empty() ? "true" : "false") << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNext()) return;
        String s = sc.next();
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) { System.out.println("false"); return; }
                char top = stack.pop();
                if (c == ')' && top != '(') { System.out.println("false"); return; }
                if (c == '}' && top != '{') { System.out.println("false"); return; }
                if (c == ']' && top != '[') { System.out.println("false"); return; }
            }
        }
        System.out.println(stack.isEmpty() ? "true" : "false");
    }
}
`,
      go: `package main

import (
\t"fmt"
\t"os"
)

func main() {
\tvar s string
\tif _, err := fmt.Fscan(os.Stdin, &s); err != nil {
\t\treturn
\t}
\tvar stack []rune
\tfor _, c := range s {
\t\tif c == '(' || c == '{' || c == '[' {
\t\t\tstack = append(stack, c)
\t\t} else {
\t\t\tif len(stack) == 0 {
\t\t\t\tfmt.Println("false")
\t\t\t\treturn
\t\t\t}
\t\t\ttop := stack[len(stack)-1]
\t\t\tstack = stack[:len(stack)-1]
\t\t\tif c == ')' && top != '(' { fmt.Println("false"); return }
\t\t\tif c == '}' && top != '{' { fmt.Println("false"); return }
\t\t\tif c == ']' && top != '[' { fmt.Println("false"); return }
\t\t}
\t}
\tif len(stack) == 0 {
\t\tfmt.Println("true")
\t} else {
\t\tfmt.Println("false")
\t}
}
`,
    },
  },
  {
    id: 'p3333333-3333-3333-3333-333333333333',
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'medium',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the **maximum amount of water** a container can store.

### Input Format
- First line contains integer \`n\`.
- Second line contains \`n\` space-separated integers representing line heights.

### Output Format
- Print a single integer: the maximum water volume.

### Example 1
\`\`\`
Input:
9
1 8 6 2 5 4 8 3 7

Output:
49
\`\`\`

### Example 2
\`\`\`
Input:
2
1 1

Output:
1
\`\`\``,
    constraints: {
      time_limit_ms: 1000,
      memory_limit_kb: 64000,
    },
    sample_test_cases: [
      {
        id: 1,
        input: '9\n1 8 6 2 5 4 8 3 7',
        expected_output: '49',
        is_hidden: false,
      },
      {
        id: 2,
        input: '2\n1 1',
        expected_output: '1',
        is_hidden: false,
      },
    ],
    hidden_test_cases: [
      {
        id: 3,
        input: '4\n4 3 2 1 4',
        expected_output: '16',
        is_hidden: true,
      },
      {
        id: 4,
        input: '5\n1 2 1 2 1',
        expected_output: '4',
        is_hidden: true,
      },
      {
        id: 5,
        input: '6\n10 1 1 1 1 10',
        expected_output: '50',
        is_hidden: true,
      },
    ],
    optimal_benchmarks: {
      python: { optimal_time_ms: 25, optimal_memory_kb: 4500 },
      javascript: { optimal_time_ms: 28, optimal_memory_kb: 5500 },
      cpp: { optimal_time_ms: 3, optimal_memory_kb: 1200 },
      java: { optimal_time_ms: 40, optimal_memory_kb: 12000 },
      go: { optimal_time_ms: 5, optimal_memory_kb: 2400 },
    },
    starter_code: {
      python: `import sys

def solve():
    tokens = sys.stdin.read().split()
    if not tokens:
        return
    n = int(tokens[0])
    h = [int(x) for x in tokens[1:n+1]]
    
    left, right = 0, n - 1
    max_area = 0
    while left < right:
        width = right - left
        area = min(h[left], h[right]) * width
        if area > max_area:
            max_area = area
        if h[left] < h[right]:
            left += 1
        else:
            right -= 1
            
    print(max_area)

if __name__ == '__main__':
    solve()
`,
      javascript: `const fs = require('fs');

function solve() {
    const tokens = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
    if (!tokens || tokens.length < 2) return;
    const n = parseInt(tokens[0]);
    const h = tokens.slice(1, n + 1).map(Number);
    
    let left = 0, right = n - 1;
    let maxArea = 0;
    while (left < right) {
        const area = Math.min(h[left], h[right]) * (right - left);
        if (area > maxArea) maxArea = area;
        if (h[left] < h[right]) left++;
        else right--;
    }
    console.log(maxArea);
}

solve();
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    int n;
    if (!(cin >> n)) return 0;
    vector<int> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    
    int left = 0, right = n - 1;
    int maxArea = 0;
    while (left < right) {
        int area = min(h[left], h[right]) * (right - left);
        maxArea = max(maxArea, area);
        if (h[left] < h[right]) left++;
        else right--;
    }
    cout << maxArea << "\\n";
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (!sc.hasNextInt()) return;
        int n = sc.nextInt();
        int[] h = new int[n];
        for (int i = 0; i < n; i++) h[i] = sc.nextInt();
        
        int left = 0, right = n - 1;
        int maxArea = 0;
        while (left < right) {
            int area = Math.min(h[left], h[right]) * (right - left);
            if (area > maxArea) maxArea = area;
            if (h[left] < h[right]) left++;
            else right--;
        }
        System.out.println(maxArea);
    }
}
`,
      go: `package main

import (
\t"bufio"
\t"fmt"
\t"os"
\t"strconv"
)

func main() {
\tscanner := bufio.NewScanner(os.Stdin)
\tscanner.Split(bufio.ScanWords)
\tif !scanner.Scan() {
\t\treturn
\t}
\tn, _ := strconv.Atoi(scanner.Text())
\th := make([]int, n)
\tfor i := 0; i < n; i++ {
\t\tscanner.Scan()
\t\th[i], _ = strconv.Atoi(scanner.Text())
\t}

\tleft, right := 0, n-1
\tmaxArea := 0
\tfor left < right {
\t\twidth := right - left
\t\theight := h[left]
\t\tif h[right] < height {
\t\t\theight = h[right]
\t\t}
\t\tarea := height * width
\t\tif area > maxArea {
\t\t\tmaxArea = area
\t\t}
\t\tif h[left] < h[right] {
\t\t\tleft++
\t\t} else {
\t\t\tright--
\t\t}
\t}
\tfmt.Println(maxArea)
}
`,
    },
  },
];
