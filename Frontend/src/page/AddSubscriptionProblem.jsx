import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  Trash2,
  Code2,
  FileText,
  Lightbulb,
  BookOpen,
  CheckCircle2,
  Download,
  Files,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const problemSchema = z.object({
  title: z.string().min(3, "Title must be atleast 3 characters"),
  description: z.string().min(10, "Description atleast 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  tags: z.array(z.string()).min(1, "Atleast 1 tag is required"),
  constraints: z.string().min(1, "Atleast 1 constrainst are required"),
  hints: z.string(),
  editorial: z.string(),
  testcases: z
    .array(
      z.object({
        input: z.string().min(1, "input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "at least 1 test case is required"),
  examples: z.object({
    JAVASCRIPT: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explaination: z.string().optional(),
    }),
    PYTHON: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explaination: z.string().optional(),
    }),
    JAVA: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explaination: z.string().optional(),
    }),
    RUBY: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explaination: z.string().optional(),
    }),
    RUST: z.object({
      input: z.string().min(1, "Input is required"),
      output: z.string().min(1, "Output is required"),
      explaination: z.string().optional(),
    }),
  }),
  codeSnippets: z.object({
    JAVASCRIPT: z.string().min(1, "Javascript code snippet is required"),
    PYTHON: z.string().min(1, "Python code snippet is required"),
    JAVA: z.string().min(1, "Java code snippet is required"),
    RUBY: z.string().min(1, "Ruby code snippet is required"),
    RUST: z.string().min(1, "Rust code snippet is required"),
  }),
  referenceSolutions: z.object({
    JAVASCRIPT: z.string().min(1, "Javascript solution is required"),
    PYTHON: z.string().min(1, "Python solution is required"),
    JAVA: z.string().min(1, "Java solution is required"),
    RUBY: z.string().min(1, "RUBY solution is required"),
    RUST: z.string().min(1, "RUST solution is required"),
  }),
});

// const sampledData = {
//   title: "Climbing Stairs",
//   category: "dp", // Dynamic Programming
//   description:
//     "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
//   difficulty: "EASY",
//   tags: ["Dynamic Programming", "Math", "Memoization"],
//   constraints: "1 <= n <= 45",
//   hints:
//     "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
//   editorial:
//     "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
//   testcases: [
//     {
//       input: "2",
//       output: "2",
//     },
//     {
//       input: "3",
//       output: "3",
//     },
//     {
//       input: "4",
//       output: "5",
//     },
//   ],
//   examples: {
//     JAVASCRIPT: {
//       input: "n = 2",
//       output: "2",
//       explanation:
//         "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
//     },
//     PYTHON: {
//       input: "n = 3",
//       output: "3",
//       explanation:
//         "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
//     },
//     JAVA: {
//       input: "n = 4",
//       output: "5",
//       explanation:
//         "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
//     },
//   },
//   codeSnippets: {
//     JAVASCRIPT: `/**
// * @param {number} n
// * @return {number}
// */
// function climbStairs(n) {
// // Write your code here
// }

// // Parse input and execute
// const readline = require('readline');
// const rl = readline.createInterface({
// input: process.stdin,
// output: process.stdout,
// terminal: false
// });

// rl.on('line', (line) => {
// const n = parseInt(line.trim());
// const result = climbStairs(n);

// console.log(result);
// rl.close();
// });`,
//     PYTHON: `class Solution:
//   def climbStairs(self, n: int) -> int:
//       # Write your code here
//       pass

// # Input parsing
// if __name__ == "__main__":
//   import sys

//   # Parse input
//   n = int(sys.stdin.readline().strip())

//   # Solve
//   sol = Solution()
//   result = sol.climbStairs(n)

//   # Print result
//   print(result)`,
//     JAVA: `import java.util.Scanner;

// class Main {
//   public int climbStairs(int n) {
//       // Write your code here
//       return 0;
//   }

//   public static void main(String[] args) {
//       Scanner scanner = new Scanner(System.in);
//       int n = Integer.parseInt(scanner.nextLine().trim());

//       // Use Main class instead of Solution
//       Main main = new Main();
//       int result = main.climbStairs(n);

//       System.out.println(result);
//       scanner.close();
//   }
// }`,
//   },
//   referenceSolutions: {
//     JAVASCRIPT: `/**
// * @param {number} n
// * @return {number}
// */
// function climbStairs(n) {
// // Base cases
// if (n <= 2) {
//   return n;
// }

// // Dynamic programming approach
// let dp = new Array(n + 1);
// dp[1] = 1;
// dp[2] = 2;

// for (let i = 3; i <= n; i++) {
//   dp[i] = dp[i - 1] + dp[i - 2];
// }

// return dp[n];

// /* Alternative approach with O(1) space
// let a = 1; // ways to climb 1 step
// let b = 2; // ways to climb 2 steps

// for (let i = 3; i <= n; i++) {
//   let temp = a + b;
//   a = b;
//   b = temp;
// }

// return n === 1 ? a : b;
// */
// }

// // Parse input and execute
// const readline = require('readline');
// const rl = readline.createInterface({
// input: process.stdin,
// output: process.stdout,
// terminal: false
// });

// rl.on('line', (line) => {
// const n = parseInt(line.trim());
// const result = climbStairs(n);

// console.log(result);
// rl.close();
// });`,
//     PYTHON: `class Solution:
//   def climbStairs(self, n: int) -> int:
//       # Base cases
//       if n <= 2:
//           return n

//       # Dynamic programming approach
//       dp = [0] * (n + 1)
//       dp[1] = 1
//       dp[2] = 2

//       for i in range(3, n + 1):
//           dp[i] = dp[i - 1] + dp[i - 2]

//       return dp[n]

//       # Alternative approach with O(1) space
//       # a, b = 1, 2
//       #
//       # for i in range(3, n + 1):
//       #     a, b = b, a + b
//       #
//       # return a if n == 1 else b

// # Input parsing
// if __name__ == "__main__":
//   import sys

//   # Parse input
//   n = int(sys.stdin.readline().strip())

//   # Solve
//   sol = Solution()
//   result = sol.climbStairs(n)

//   # Print result
//   print(result)`,
//     JAVA: `import java.util.Scanner;

// class Main {
//   public int climbStairs(int n) {
//       // Base cases
//       if (n <= 2) {
//           return n;
//       }

//       // Dynamic programming approach
//       int[] dp = new int[n + 1];
//       dp[1] = 1;
//       dp[2] = 2;

//       for (int i = 3; i <= n; i++) {
//           dp[i] = dp[i - 1] + dp[i - 2];
//       }

//       return dp[n];

//       /* Alternative approach with O(1) space
//       int a = 1; // ways to climb 1 step
//       int b = 2; // ways to climb 2 steps

//       for (int i = 3; i <= n; i++) {
//           int temp = a + b;
//           a = b;
//           b = temp;
//       }

//       return n == 1 ? a : b;
//       */
//   }

//   public static void main(String[] args) {
//       Scanner scanner = new Scanner(System.in);
//       int n = Integer.parseInt(scanner.nextLine().trim());

//       // Use Main class instead of Solution
//       Main main = new Main();
//       int result = main.climbStairs(n);

//       System.out.println(result);
//       scanner.close();
//   }
// }`,
//   },
// };

const sampledData = {
  title: "Climbing Stairs",
  category: "dp", // Dynamic Programming
  description:
    "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
  difficulty: "EASY",
  tags: ["Dynamic Programming", "Math", "Memoization"],
  constraints: "1 <= n <= 45",
  hints:
    "To reach the nth step, you can either come from the (n-1)th step or the (n-2)th step.",
  editorial:
    "This is a classic dynamic programming problem. The number of ways to reach the nth step is the sum of the number of ways to reach the (n-1)th step and the (n-2)th step, forming a Fibonacci-like sequence.",
  testcases: [
    {
      input: "2",
      output: "2",
    },
    {
      input: "3",
      output: "3",
    },
    {
      input: "4",
      output: "5",
    },
  ],
  examples: {
    JAVASCRIPT: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    PYTHON: {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
    JAVA: {
      input: "n = 4",
      output: "5",
      explanation:
        "There are five ways to climb to the top:\n1. 1 step + 1 step + 1 step + 1 step\n2. 1 step + 1 step + 2 steps\n3. 1 step + 2 steps + 1 step\n4. 2 steps + 1 step + 1 step\n5. 2 steps + 2 steps",
    },
    RUBY: {
      input: "n = 2",
      output: "2",
      explanation:
        "There are two ways to climb to the top:\n1. 1 step + 1 step\n2. 2 steps",
    },
    RUST: {
      input: "n = 3",
      output: "3",
      explanation:
        "There are three ways to climb to the top:\n1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step",
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Write your code here
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Write your code here
      pass

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Write your code here
      return 0;
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
    RUBY: `class Solution
  # @param {Integer} n
  # @return {Integer}
  def climb_stairs(n)
    # Write your code here
  end
end

if __FILE__ == $0
  n = gets.chomp.to_i
  
  sol = Solution.new
  result = sol.climb_stairs(n)
  
  puts result
end`,
    RUST: `use std::io::{self, BufRead};

fn climb_stairs(n: i32) -> i32 {
    // Write your code here
    0
}

fn main() {
    let stdin = io::stdin();
    let mut lines = stdin.lock().lines();
    
    if let Some(Ok(line)) = lines.next() {
        let n: i32 = line.trim().parse().expect("Invalid input");
        let result = climb_stairs(n);
        println!("{}", result);
    }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
* @param {number} n
* @return {number}
*/
function climbStairs(n) {
// Base cases
if (n <= 2) {
  return n;
}

// Dynamic programming approach
let dp = new Array(n + 1);
dp[1] = 1;
dp[2] = 2;

for (let i = 3; i <= n; i++) {
  dp[i] = dp[i - 1] + dp[i - 2];
}

return dp[n];

/* Alternative approach with O(1) space
let a = 1; // ways to climb 1 step
let b = 2; // ways to climb 2 steps

for (let i = 3; i <= n; i++) {
  let temp = a + b;
  a = b;
  b = temp;
}

return n === 1 ? a : b;
*/
}

// Parse input and execute
const readline = require('readline');
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: false
});

rl.on('line', (line) => {
const n = parseInt(line.trim());
const result = climbStairs(n);

console.log(result);
rl.close();
});`,
    PYTHON: `class Solution:
  def climbStairs(self, n: int) -> int:
      # Base cases
      if n <= 2:
          return n
      
      # Dynamic programming approach
      dp = [0] * (n + 1)
      dp[1] = 1
      dp[2] = 2
      
      for i in range(3, n + 1):
          dp[i] = dp[i - 1] + dp[i - 2]
      
      return dp[n]
      
      # Alternative approach with O(1) space
      # a, b = 1, 2
      # 
      # for i in range(3, n + 1):
      #     a, b = b, a + b
      # 
      # return a if n == 1 else b

# Input parsing
if __name__ == "__main__":
  import sys
  
  # Parse input
  n = int(sys.stdin.readline().strip())
  
  # Solve
  sol = Solution()
  result = sol.climbStairs(n)
  
  # Print result
  print(result)`,
    JAVA: `import java.util.Scanner;

class Main {
  public int climbStairs(int n) {
      // Base cases
      if (n <= 2) {
          return n;
      }
      
      // Dynamic programming approach
      int[] dp = new int[n + 1];
      dp[1] = 1;
      dp[2] = 2;
      
      for (int i = 3; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
      }
      
      return dp[n];
      
      /* Alternative approach with O(1) space
      int a = 1; // ways to climb 1 step
      int b = 2; // ways to climb 2 steps
      
      for (int i = 3; i <= n; i++) {
          int temp = a + b;
          a = b;
          b = temp;
      }
      
      return n == 1 ? a : b;
      */
  }
  
  public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in);
      int n = Integer.parseInt(scanner.nextLine().trim());
      
      // Use Main class instead of Solution
      Main main = new Main();
      int result = main.climbStairs(n);
      
      System.out.println(result);
      scanner.close();
  }
}`,
    RUBY: `class Solution
  # @param {Integer} n
  # @return {Integer}
  def climb_stairs(n)
    # Base cases
    return n if n <= 2
    
    # Dynamic programming approach
    dp = Array.new(n + 1, 0)
    dp[1] = 1
    dp[2] = 2
    
    (3..n).each do |i|
      dp[i] = dp[i - 1] + dp[i - 2]
    end
    
    dp[n]
    
    # Alternative approach with O(1) space
    # a, b = 1, 2
    # 
    # (3..n).each do |i|
    #   a, b = b, a + b
    # end
    # 
    # n == 1 ? a : b
  end
end

if __FILE__ == $0
  n = gets.chomp.to_i
  
  sol = Solution.new
  result = sol.climb_stairs(n)
  
  puts result
end`,
    RUST: `use std::io::{self, BufRead};

fn climb_stairs(n: i32) -> i32 {
    // Base cases
    if n <= 2 {
        return n;
    }
    
    // Dynamic programming approach
    let mut dp = vec![0; (n + 1) as usize];
    dp[1] = 1;
    dp[2] = 2;
    
    for i in 3..=n as usize {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    
    dp[n as usize]
    
    /* Alternative approach with O(1) space
    let mut a = 1; // ways to climb 1 step
    let mut b = 2; // ways to climb 2 steps
    
    for _ in 3..=n {
        let temp = a + b;
        a = b;
        b = temp;
    }
    
    if n == 1 { a } else { b }
    */
}

fn main() {
    let stdin = io::stdin();
    let mut lines = stdin.lock().lines();
    
    if let Some(Ok(line)) = lines.next() {
        let n: i32 = line.trim().parse().expect("Invalid input");
        let result = climb_stairs(n);
        println!("{}", result);
    }
}`,
  },
};

// const sampleStringProblem = {
//   title: "Valid Palindrome",
//   description:
//     "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
//   difficulty: "EASY",
//   tags: ["String", "Two Pointers"],
//   constraints:
//     "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
//   hints:
//     "Consider using two pointers, one from the start and one from the end, moving towards the center.",
//   editorial:
//     "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
//   testcases: [
//     { input: "A man, a plan, a canal: Panama", output: "true" },
//     { input: "race a car", output: "false" },
//     { input: " ", output: "true" },
//   ],
//   examples: {
//     JAVASCRIPT: {
//       input: 's = "A man, a plan, a canal: Panama"',
//       output: "true",
//       explanation: '"amanaplanacanalpanama" is a palindrome.',
//     },
//     PYTHON: {
//       input: 's = "A man, a plan, a canal: Panama"',
//       output: "true",
//       explanation: '"amanaplanacanalpanama" is a palindrome.',
//     },
//     JAVA: {
//       input: 's = "A man, a plan, a canal: Panama"',
//       output: "true",
//       explanation: '"amanaplanacanalpanama" is a palindrome.',
//     },
//   },
//   codeSnippets: {
//     JAVASCRIPT: `/**
//    * @param {string} s
//    * @return {boolean}
//    */
//   function isPalindrome(s) {
//     // Write your code here
//   }

//   // Add readline for dynamic input handling
//   const readline = require('readline');
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     terminal: false
//   });

//   rl.on('line', (line) => {
//     const result = isPalindrome(line);
//     console.log(result ? "true" : "false");
//     rl.close();
//   });`,
//     PYTHON: `class Solution:
//     def isPalindrome(self, s: str) -> bool:
//         # Write your code here
//         pass

// if __name__ == "__main__":
//     import sys
//     s = sys.stdin.readline().strip()
//     sol = Solution()
//     result = sol.isPalindrome(s)
//     print(str(result).lower())`,
//     JAVA: `import java.util.Scanner;

// public class Main {
//     public static String preprocess(String s) {
//         return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
//     }

//     public static boolean isPalindrome(String s) {
//         // Write your code here
//         return false;
//     }

//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);
//         String input = sc.nextLine();
//         boolean result = isPalindrome(input);
//         System.out.println(result ? "true" : "false");
//     }
// }`,
//   },
//   referenceSolutions: {
//     JAVASCRIPT: `/**
//    * @param {string} s
//    * @return {boolean}
//    */
//   function isPalindrome(s) {
//     s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
//     let left = 0, right = s.length - 1;
//     while (left < right) {
//       if (s[left] !== s[right]) return false;
//       left++;
//       right--;
//     }
//     return true;
//   }

//   const readline = require('readline');
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//     terminal: false
//   });

//   rl.on('line', (line) => {
//     const result = isPalindrome(line);
//     console.log(result ? "true" : "false");
//     rl.close();
//   });`,
//     PYTHON: `class Solution:
//     def isPalindrome(self, s: str) -> bool:
//         filtered_chars = [c.lower() for c in s if c.isalnum()]
//         return filtered_chars == filtered_chars[::-1]

// if __name__ == "__main__":
//     import sys
//     s = sys.stdin.readline().strip()
//     sol = Solution()
//     result = sol.isPalindrome(s)
//     print(str(result).lower())`,
//     JAVA: `import java.util.Scanner;

// public class Main {
//     public static String preprocess(String s) {
//         return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
//     }

//     public static boolean isPalindrome(String s) {
//         s = preprocess(s);
//         int left = 0, right = s.length() - 1;
//         while (left < right) {
//             if (s.charAt(left) != s.charAt(right)) return false;
//             left++;
//             right--;
//         }
//         return true;
//     }

//     public static void main(String[] args) {
//         Scanner sc = new Scanner(System.in);
//         String input = sc.nextLine();
//         boolean result = isPalindrome(input);
//         System.out.println(result ? "true" : "false");
//     }
// }`,
//   },
// };

const sampleStringProblem = {
  title: "Valid Palindrome",
  description:
    "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.",
  difficulty: "EASY",
  tags: ["String", "Two Pointers"],
  constraints:
    "1 <= s.length <= 2 * 10^5\ns consists only of printable ASCII characters.",
  hints:
    "Consider using two pointers, one from the start and one from the end, moving towards the center.",
  editorial:
    "We can use two pointers approach to check if the string is a palindrome. One pointer starts from the beginning and the other from the end, moving towards each other.",
  testcases: [
    { input: "A man, a plan, a canal: Panama", output: "true" },
    { input: "race a car", output: "false" },
    { input: " ", output: "true" },
  ],
  examples: {
    JAVASCRIPT: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    PYTHON: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    JAVA: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    RUBY: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
    RUST: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" is a palindrome.',
    },
  },
  codeSnippets: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    // Write your code here
  }
  
  // Add readline for dynamic input handling
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  rl.on('line', (line) => {
    const result = isPalindrome(line);
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Write your code here
        pass

if __name__ == "__main__":
    import sys
    s = sys.stdin.readline().strip()
    sol = Solution()
    result = sol.isPalindrome(s)
    print(str(result).lower())`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        // Write your code here
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}`,
    RUBY: `class Solution
  # @param {String} s
  # @return {Boolean}
  def is_palindrome(s)
    # Write your code here
  end
end

if __FILE__ == $0
  s = gets.chomp
  sol = Solution.new
  result = sol.is_palindrome(s)
  puts result.to_s
end`,
    RUST: `use std::io::{self, BufRead};

fn is_palindrome(s: String) -> bool {
    // Write your code here
    false
}

fn main() {
    let stdin = io::stdin();
    let mut lines = stdin.lock().lines();
    
    if let Some(Ok(line)) = lines.next() {
        let result = is_palindrome(line);
        println!("{}", result);
    }
}`,
  },
  referenceSolutions: {
    JAVASCRIPT: `/**
   * @param {string} s
   * @return {boolean}
   */
  function isPalindrome(s) {
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = s.length - 1;
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  
  rl.on('line', (line) => {
    const result = isPalindrome(line);
    console.log(result ? "true" : "false");
    rl.close();
  });`,
    PYTHON: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        filtered_chars = [c.lower() for c in s if c.isalnum()]
        return filtered_chars == filtered_chars[::-1]

if __name__ == "__main__":
    import sys
    s = sys.stdin.readline().strip()
    sol = Solution()
    result = sol.isPalindrome(s)
    print(str(result).lower())`,
    JAVA: `import java.util.Scanner;

public class Main {
    public static String preprocess(String s) {
        return s.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
    }

    public static boolean isPalindrome(String s) {
        s = preprocess(s);
        int left = 0, right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String input = sc.nextLine();
        boolean result = isPalindrome(input);
        System.out.println(result ? "true" : "false");
    }
}`,
    RUBY: `class Solution
  # @param {String} s
  # @return {Boolean}
  def is_palindrome(s)
    filtered = s.downcase.gsub(/[^a-z0-9]/, '')
    left = 0
    right = filtered.length - 1
    
    while left < right
      return false if filtered[left] != filtered[right]
      left += 1
      right -= 1
    end
    
    true
  end
end

if __FILE__ == $0
  s = gets.chomp
  sol = Solution.new
  result = sol.is_palindrome(s)
  puts result.to_s
end`,
    RUST: `use std::io::{self, BufRead};

fn is_palindrome(s: String) -> bool {
    let filtered: Vec<char> = s
        .chars()
        .filter(|c| c.is_alphanumeric())
        .map(|c| c.to_lowercase().next().unwrap())
        .collect();
    
    let mut left = 0;
    let mut right = filtered.len().saturating_sub(1);
    
    while left < right {
        if filtered[left] != filtered[right] {
            return false;
        }
        left += 1;
        right = right.saturating_sub(1);
    }
    
    true
}

fn main() {
    let stdin = io::stdin();
    let mut lines = stdin.lock().lines();
    
    if let Some(Ok(line)) = lines.next() {
        let result = is_palindrome(line);
        println!("{}", result);
    }
}`,
  },
};

const AddSubscriptionProblem = () => {
  const [sampleType, setSampleType] = useState("DP");

  const Navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      testcases: [{ input: "", output: "" }],
      tags: [""],
      examples: {
        JAVASCRIPT: { input: "", output: "", explaination: "" },
        PYTHON: { input: "", output: "", explaination: "" },
        JAVA: { input: "", output: "", explaination: "" },
        RUBY: { input: "", output: "", explaination: "" },
        RUST: { input: "", output: "", explaination: "" },
      },
      codeSnippets: {
        JAVASCRIPT: "function solution() {\n  // Write your code here \n}",
        PYTHON: "def solution():\n # Write your code here \n  pass",
        JAVA: "public class Solution {\n  public static void main(String[] args) {\n //Write your code here} }",
        RUBY: "def solution\n  # Write your code here\nend",
        RUST: "fn solution() {\n  // Write your code here\n}",
      },
      referenceSolutions: {
        JAVASCRIPT: "// Add your reference solution here",
        PYTHON: "# Add your reference solution here",
        JAVA: "// Add your reference solution here",
        RUBY: "// Add your reference solution here",
        RUST: "// Add your reference solution here",
      },
    },
  });

  const {
    fields: testCaseFields,
    append: appendTestCase,
    remove: removeTestCase,
    replace: replaceTestCases,
  } = useFieldArray({
    control,
    name: "testcases",
  });

  const {
    fields: tagFileds,
    append: appendTag,
    remove: removeTag,
    replace: replaceTags,
  } = useFieldArray({
    control,
    name: "tags",
  });

  const [isloading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post(
        "/subscription-problems/create-problem",
        data
      );
      console.log("Respose data to the backend is : ", res);
      console.log(" Response.data is : ", res.data);
      toast.success(res.data.message || "Problem created successfully");
      Navigate("/");
    } catch (error) {
      console.log("Error in creating the problem is : ", error);
      toast.error("Error in creating the problem");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const sampleData = sampleType === "DP" ? sampledData : sampleStringProblem;
    replaceTags(sampleData.tags.map((tag) => tag));
    replaceTestCases(sampleData.testcases.map((testcases) => testcases));

    // Reset the form with sample data
    reset(sampleData);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 pb-4 border-b">
            <h2 className="w-6 h-6 text-2xl md:text-2xl flex items-center gap-3 ">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              Create Problem
            </h2>

            <div className="flex flex-col md:flex-row gap-3 mt-4 md:mt-0">
              <div className="join">
                <button
                  type="button"
                  className={`btn join-item ${
                    sampleType === "DP" ? "btn-active" : ""
                  }`}
                  onClick={() => setSampleType("array")}
                >
                  DP Problem
                </button>
                <button
                  type="button"
                  className={`btn join-item ${
                    sampleType === "string" ? "btn-active" : ""
                  }`}
                  onClick={() => setSampleType("string")}
                >
                  String Problem
                </button>
                <button
                  type="button"
                  className="btn btn-secondary gap-2"
                  onClick={loadSampleData}
                >
                  <Download className="w-4 h-4" />
                  Load Sample
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text text-base md:text-lg font-semibold">
                    Title
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-boarder w-full text-base md:text-lg"
                  {...register("title")}
                  placeholder="Enter problem title"
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.title.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text text-base md:text-lg front-semibold">
                    Description
                  </span>
                </label>
                <textarea
                  className="textarea textarea-boardered min-32 w-full text-base md:text-lg p-4 resize=y"
                  {...register("description")}
                  placeholder="Enter problem description"
                />
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.description.message}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base md:text-lg font-semibold">
                    Difficulty
                  </span>
                </label>
                <select
                  className="select select-bordered w-full text-base md:text-lg"
                  {...register("difficulty")}
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
                {errors.difficulty && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.difficulty.message}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* tags */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="w-5 h-5">
                  <BookOpen className="w-5 h-5" />
                  Tags
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => appendTag("")}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Tag
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagFileds.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input
                      type="text"
                      className="input input-boarder flex-1"
                      {...register(`tags.${index}`)}
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      className="btn btn-ghost btn-square btn-sm"
                      onClick={() => removeTag(index)}
                      disabled={tagFileds.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                ))}
              </div>
              {errors.tags && (
                <div className="mt-2">
                  <span className="text-error text-sm">
                    {errors.tags.message}
                  </span>
                </div>
              )}
            </div>

            {/* Test cases */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Test Cases
                </h3>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => appendTestCase({ input: "", output: "" })}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Test Case
                </button>
              </div>

              <div className="space-y-6">
                {testCaseFields.map((field, index) => (
                  <div key={field.id} className="card bg-base-100 shadow-md">
                    <div className="card-body p-4 md:p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-base md:text-lg font-semibold">
                          Test case #{index + 1}
                        </h4>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm text-erro"
                          onClick={() => removeTestCase(index)}
                          disabled={testCaseFields.length === 1}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Input
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                            {...register(`testcases.${index}.input`)}
                            placeholder="Enter testcase input"
                          />
                          {errors.testcases?.[index]?.input && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.testcases[index].input.message}
                              </span>
                            </label>
                          )}
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">
                              Expected Output
                            </span>
                          </label>
                          <textarea
                            className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                            {...register(`testcases.${index}.output`)}
                            placeholder="Enter Expected output"
                          />
                          {errors.testcases?.[index]?.output && (
                            <label className="label">
                              <span className="label-text-alt text-error">
                                {errors.testcases[index].output.message}
                              </span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.testcases && !Array.isArray(errors.testcases) && (
                <div className="mt-2">
                  <span className="text-error text-sm">
                    {errors.testcases.message}
                  </span>
                </div>
              )}
            </div>

            {/* code editor section */}
            <div className="space-y-8">
              {["JAVASCRIPT", "PYTHON", "JAVA","RUBY", "RUST"].map((language) => (
                <div
                  key={language}
                  className="card bg-base-200 p-4 md:p-6 shadow-md"
                >
                  <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                    <Code2 className="w-5 h-5" />
                    {language}
                  </h3>

                  <div className="space-y-6">
                    {/* Starter code*/}
                    <div className="card bg-base-100 shadow-md">
                      <div className="card-body p-4 md:p-6">
                        <h4 className="font-semibold text-base md:text-lg mb-4">
                          Starter Code Template
                        </h4>
                        <div className="border rounded-md overflow-hidden">
                          <Controller
                            name={`codeSnippets.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="300px"
                                Language={language.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onChange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  lineNumbers: "on",
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.codeSnippets?.[language] && (
                          <div className="mt-2">
                            <span className="text-error text-sm">
                              {errors.codeSnippets[language].message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reference Solution */}
                    <div className="card bg-base-100 shadow">
                      <div className="card -body p-4 md:p-6">
                        <h4 className="font-semibold text-base md:text-lg mb-4 flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-success" />
                          Reference Solution
                        </h4>
                        <div className="border rounded-md overflow-hidden">
                          <Controller
                            name={`referenceSolutions.${language}`}
                            control={control}
                            render={({ field }) => (
                              <Editor
                                height="300px"
                                language={language.toLowerCase()}
                                theme="vs-dark"
                                value={field.value}
                                onchange={field.onChange}
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  lineNumbers: "on",
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            )}
                          />
                        </div>
                        {errors.referenceSolutions?.[language] && (
                          <div className="mt-2">
                            <span className="text-error text-sm">
                              {errors.referenceSolutions[language].message}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Examples */}
                    <div className="card bg-base-100 shadow-md">
                      <div className="card-body p-4 md:p-6">
                        <h4 className="font-semibold text-base md:text-lg mb-4">
                          Example
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium">
                                {" "}
                                Input{" "}
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                              {...register(`examples.${language}.input`)}
                              placeholder="Example input"
                            />
                            {errors.examples?.[language]?.input && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {errors.examples[language].input.message}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium">
                                {" "}
                                Output{" "}
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-20 w-full p-3 resize-y"
                              {...register(`wxamples.${language}.output`)}
                              placeholder="Example Output"
                            />
                            {errors.examples?.[language]?.output && (
                              <label className="label">
                                <span className="label-text-alt text-error">
                                  {errors.examples[language].output.message}
                                </span>
                              </label>
                            )}
                          </div>
                          <div className="form-control md:col-span-2">
                            <label className="label">
                              <span className="label-text font-medium">
                                Explanation
                              </span>
                            </label>
                            <textarea
                              className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                              {...register(`examples.${language}.explanation`)}
                              placeholder="Expalin the example"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional info */}
            <div className="card bg-base-200 p-4 md:p-6 shadow-md">
              <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning" />
                Additional Information
              </h3>
              <div className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Constraints</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                    {...register("constraints")}
                    placeholder="Enter problem constraints"
                  />
                  {errors.constraints && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.constraints.message}
                      </span>
                    </label>
                  )}
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font font-medium">
                      Hints 
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-24 w-full p-3 resize-y"
                    {...register("hints")}
                    placeholder="Enter hints for solving the problem"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Editorial (Optional)
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered min-h-32 w-full p-3 resize-y"
                    {...register("editorial")}
                    placeholder="Enter problem editorial/solution explanation"
                  />
                </div>
              </div>
            </div>

            <div className="card-actions justify-end border-t">
              <button type="submit" className="btn btn-primary btn-lg gap-2">
                {isloading ? (
                  <span className="loading loading-spinner text-white"></span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Create Problem
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubscriptionProblem;
