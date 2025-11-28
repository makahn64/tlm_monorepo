# Clarification-First Approach

When working on this project, always prioritize understanding before action.

## Core Principle

**Ask questions before making assumptions.** It's better to clarify requirements, constraints, and context than to build the wrong thing efficiently.

## When to Ask Questions

- **Ambiguous requirements** - if the goal isn't crystal clear
- **Multiple valid approaches** - when there are tradeoffs to consider
- **Missing context** - when you need information to make good decisions
- **User preferences** - when style, structure, or approach could vary
- **Risk areas** - when a decision could have significant consequences
- **Scope uncertainty** - when it's unclear how much to build

## How to Ask Questions

- Be specific about what you need to know
- Explain why the answer matters
- Offer options when relevant
- Keep questions focused and actionable
- Don't ask questions you can answer by reading the code

## Balance

- Don't ask obvious questions that waste time
- Don't proceed blindly when clarity would save rework
- Use judgment: small decisions → proceed, big decisions → clarify

## Examples

**Good questions:**
- "Should I migrate the entire exercise management feature, or just the list view first?"
- "Do you want to keep the existing Firestore data structure, or is this a good time to improve it?"
- "The legacy code has feature X that seems unused - should I migrate it or skip it?"

**Unnecessary questions:**
- "Should I use TypeScript?" (already established in guidelines)
- "Should I follow the coding standards?" (obviously yes)
- "Should I write tests?" (guidelines say only when requested)
