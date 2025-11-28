# TypeScript Coding Guidelines

## General Principles

- Write clear, maintainable, and type-safe code
- Prefer functional programming patterns over object-oriented patterns
- Keep functions small and focused on a single responsibility
- Use descriptive names for variables, functions, and types
- Files should not exceed 350 lines - refactor into multiple files when approaching this limit

## Type Safety

### Strict Mode
- Always use TypeScript strict mode
- Avoid `any` type - use `unknown` when type is truly unknown
- Use type guards to narrow types safely
- Prefer explicit return types on exported functions

### Type Definitions
- Define types close to where they're used
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and mapped types
- Export types from a central location when shared across modules

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

type UserRole = 'admin' | 'trainer' | 'client';

// Avoid
type User = {
  id: any;  // Don't use any
  name: string;
};
```

## Language Features

### No Classes (Unless Necessary)
- Prefer functions and plain objects over classes
- Use classes only when required by framework or when they provide clear benefits
- Consider factory functions or object literals as alternatives

```typescript
// Preferred
export const createUser = (name: string, email: string) => {
  return {
    name,
    email,
    greet: () => `Hello, ${name}`,
  };
};

// Avoid (unless framework requires it)
export class User {
  constructor(public name: string, public email: string) {}
  greet() {
    return `Hello, ${this.name}`;
  }
}
```

### No Enums
- Use `as const` pattern instead of enums
- Provides better type inference and tree-shaking
- More flexible and JavaScript-friendly

```typescript
// Preferred
export const UserRole = {
  ADMIN: 'admin',
  TRAINER: 'trainer',
  CLIENT: 'client',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Avoid
enum UserRole {
  ADMIN = 'admin',
  TRAINER = 'trainer',
  CLIENT = 'client',
}
```

### No Default Exports
- Use named exports for better refactoring and IDE support
- Exception: Framework requirements (e.g., Next.js pages, Vite config)

```typescript
// Preferred
export const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

// Avoid (unless required by framework)
const calculateTotal = (items: Item[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};
export default calculateTotal;
```

## React Specific

### No React.FC
- Don't use `React.FC` or `React.FunctionComponent` types
- This type is scheduled for deprecation
- Explicitly type props instead

```typescript
// Preferred
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button = ({ label, onClick, disabled = false }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

// Avoid
export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};
```

### Component Patterns
- Use arrow functions for components
- Keep components small and focused
- Extract custom hooks for complex logic
- Use proper TypeScript types for hooks

```typescript
// Good
export const useUserData = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // fetch logic
  }, [userId]);
  
  return { user, loading };
};
```

## Functions

### Function Style
- Prefer arrow functions for all functions (top-level and inline)
- Always specify return types for exported functions
- Use `const` for function declarations

```typescript
// Preferred for top-level
export const processWorkout = (workout: Workout): ProcessedWorkout => {
  return {
    ...workout,
    duration: calculateDuration(workout.exercises),
  };
};

// Preferred for callbacks
const numbers = [1, 2, 3].map((n) => n * 2);

// Preferred for inline
const handleClick = () => {
  console.log('clicked');
};
```

### Async/Await
- Prefer async/await over raw promises
- Always handle errors appropriately
- Use try/catch for error handling

```typescript
// Good
export const fetchUser = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
```

## Imports and Exports

### Import Order
1. External dependencies (React, third-party libraries)
2. Internal packages (workspace packages)
3. Relative imports (components, utils, types)
4. Style imports

```typescript
// External
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

// Internal packages
import { Button } from '@lotus/shared-ui';
import { calculateTotal } from '@lotus/business-logic';

// Relative
import { UserProfile } from './UserProfile';
import { formatCurrency } from '../utils/format';
import type { User } from '../types';

// Styles
import './styles.css';
```

### Named Exports
- Always use named exports (except when framework requires default)
- Export types alongside implementation when appropriate
- Group related exports

```typescript
// Good
export type WorkoutType = 'strength' | 'cardio' | 'flexibility';

export interface Workout {
  id: string;
  type: WorkoutType;
  duration: number;
}

export const createWorkout = (type: WorkoutType): Workout => {
  return {
    id: crypto.randomUUID(),
    type,
    duration: 0,
  };
};
```

## Error Handling

- Use custom error types when appropriate
- Provide meaningful error messages
- Don't swallow errors silently

```typescript
// Good - class is acceptable for custom errors
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateEmail = (email: string): void => {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format');
  }
};
```

## Null and Undefined

- Prefer `null` for intentional absence of value
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Be explicit about nullable types

```typescript
// Good
interface User {
  name: string;
  email: string;
  avatar: string | null;  // Explicitly nullable
  bio?: string;           // Optional property
}

const displayName = user.name ?? 'Anonymous';
const avatarUrl = user.avatar?.url ?? '/default-avatar.png';
```

## Comments and Documentation

- Write self-documenting code with clear names
- Add comments for complex logic or non-obvious decisions
- Use JSDoc for public APIs and exported functions

```typescript
/**
 * Calculates the total duration of a workout including rest periods.
 * 
 * @param exercises - Array of exercises in the workout
 * @param includeRest - Whether to include rest time in calculation
 * @returns Total duration in seconds
 */
export const calculateWorkoutDuration = (
  exercises: Exercise[],
  includeRest = true
): number => {
  // Implementation
};
```

## Testing Considerations

- Write testable code by avoiding side effects
- Keep business logic pure and separate from framework code
- Use dependency injection for external dependencies
- Unit tests are written for everything possible, with coverage exceeding 80%

```typescript
// Testable
export const calculateDiscount = (price: number, discountPercent: number): number => {
  return price * (1 - discountPercent / 100);
};

// Less testable (has side effects)
export const applyDiscount = (price: number, discountPercent: number): void => {
  const discounted = price * (1 - discountPercent / 100);
  updateDatabase(discounted);  // Side effect
};
```
