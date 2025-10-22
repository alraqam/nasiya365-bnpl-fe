# Contributing to Nasiya365 BNPL Frontend

Thank you for your interest in contributing to the Nasiya365 BNPL Frontend! This document provides guidelines and instructions for contributing.

## 🎯 Getting Started

### Prerequisites

- Node.js v16 or higher
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nasiya365-bnpl-fe.git
   cd nasiya365-bnpl-fe
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file with required environment variables

5. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 Code Style

### TypeScript

- Use TypeScript for all new files
- Define proper types for all functions and components
- Avoid using `any` type (use `unknown` if necessary)
- Use interfaces for object shapes

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop types

Example:
```typescript
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>
}
```

### File Naming

- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with 'use' prefix (`useAuth.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Constants: UPPER_SNAKE_CASE in files named in kebab-case (`api-constants.ts`)

### Code Formatting

We use ESLint and Prettier for code formatting:

```bash
# Run linter
npm run lint

# Format code
npm run prettify

# Type checking
npm run compile
```

## 🔄 Git Workflow

### Branch Naming

- `feature/` - New features (`feature/user-authentication`)
- `fix/` - Bug fixes (`fix/login-validation`)
- `refactor/` - Code refactoring (`refactor/api-client`)
- `docs/` - Documentation updates (`docs/readme-update`)
- `chore/` - Maintenance tasks (`chore/dependency-updates`)

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(auth): add social login support

fix(ui): resolve button alignment issue on mobile

docs(readme): update installation instructions
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests if applicable
4. Update documentation if needed
5. Run linter and tests
6. Commit your changes following commit message guidelines
7. Push to your fork
8. Create a Pull Request to the main repository

#### PR Title Format

```
[Type] Brief description

Example:
[Feature] Add user profile edit functionality
[Fix] Resolve login redirect issue
[Refactor] Improve API error handling
```

#### PR Description Template

```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- List key changes made
- Another change
- Etc.

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests passing

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

## 🧪 Testing

### Writing Tests

- Write unit tests for utilities and hooks
- Write integration tests for components
- Aim for meaningful test coverage (not just 100%)

```typescript
// Example test
import { renderHook } from '@testing-library/react-hooks'
import { useAuth } from './useAuth'

describe('useAuth', () => {
  it('should return user when authenticated', () => {
    const { result } = renderHook(() => useAuth())
    expect(result.current.user).toBeDefined()
  })
})
```

### Running Tests

```bash
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Generate coverage report
```

## 🏗️ Architecture Guidelines

### Folder Structure

```
src/
├── @core/              # Core/shared functionality
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom hooks
│   ├── utils/          # Utility functions
│   └── types/          # Shared TypeScript types
├── components/         # App-specific components
├── pages/              # Next.js pages
├── hooks/              # App-specific hooks
├── configs/            # Configuration files
└── locales/            # Translation files
```

### State Management

- Use React Context for global state
- Use Zustand for simple, lightweight state
- Keep state as local as possible

### API Calls

- Use the shared API client from `src/configs/api.ts`
- Handle errors gracefully
- Use custom hooks for data fetching

```typescript
import { api } from 'src/configs/api'

const fetchUsers = async () => {
  try {
    const data = await api('/api/users')
    return data
  } catch (error) {
    // Error is handled by API client
    throw error
  }
}
```

### Error Handling

- Use the error utilities from `src/@core/utils/errors.ts`
- Provide user-friendly error messages
- Log errors appropriately

## 🌍 Internationalization

Add translations to both language files:

```typescript
// src/locales/uz.json
{
  "welcome": "Xush kelibsiz"
}

// src/locales/ru.json
{
  "welcome": "Добро пожаловать"
}
```

Use translations in components:

```typescript
import { useLang } from 'src/providers/LanguageProvider'

const Component = () => {
  const { t } = useLang()
  return <div>{t.welcome}</div>
}
```

## 🔒 Security

- Never commit sensitive data (API keys, passwords, etc.)
- Always use environment variables for configuration
- Sanitize user inputs
- Follow OWASP security best practices
- Report security vulnerabilities privately

## 📚 Documentation

- Document complex functions with JSDoc comments
- Update README.md for significant changes
- Add inline comments for non-obvious code
- Keep documentation up to date

Example:
```typescript
/**
 * Formats a date string to a localized format
 * @param date - ISO date string
 * @param locale - Locale code (default: 'uz')
 * @returns Formatted date string
 */
function formatDate(date: string, locale: string = 'uz'): string {
  // Implementation
}
```

## 🐛 Reporting Bugs

Use GitHub Issues to report bugs:

1. Check if the issue already exists
2. Use the bug report template
3. Provide clear reproduction steps
4. Include screenshots if applicable
5. Specify your environment (OS, browser, etc.)

## 💡 Suggesting Features

Use GitHub Issues to suggest features:

1. Check if the feature is already requested
2. Use the feature request template
3. Explain the use case
4. Describe the expected behavior
5. Consider implementation details

## ❓ Questions

If you have questions:

1. Check the documentation
2. Search existing issues
3. Ask in discussions
4. Contact the team

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## 🙏 Thank You

Thank you for contributing to Nasiya365 BNPL Frontend! Your contributions help make this project better for everyone.

