# 🤝 Contributing to SafeLedger

Thank you for your interest in contributing to SafeLedger! This document provides guidelines for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL 12+
- Redis 6+
- Git

### Setup Development Environment

1. **Fork the Repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/SafeLedger.git
   cd SafeLedger
   ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/Edwin420s/SafeLedger.git
   ```

3. **Setup Backend**
   ```bash
   cd Server
   npm install
   cp .env.example .env
   # Configure .env with your settings
   docker-compose up -d
   npx prisma migrate dev
   npm run dev
   ```

4. **Setup Frontend**
   ```bash
   cd Client
   npm install
   cp .env.example .env
   npm start
   ```

## 📁 Project Structure

```
SafeLedger/
├── Client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/
├── Server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middlewares/      # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── utils/           # Utility functions
├── hedera/              # Hedera smart contracts
├── database/            # Database migrations and seeders
└── docs/               # Documentation
```

## 🏗️ Development Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Changes

- Follow existing code style
- Write tests for new features
- Update documentation

### 3. Test Your Changes

```bash
# Backend tests
cd Server
npm test

# Frontend tests
cd Client
npm test

# Manual testing
# Test the full user flow
```

### 4. Commit Changes

Follow [Conventional Commits](https://conventionalcommits.org/) specification:

```bash
git commit -m "feat: add user profile update functionality"
# or
git commit -m "fix: resolve authentication token expiration"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📝 Code Style Guidelines

### JavaScript/TypeScript

- Use ES6+ features
- Prefer `const` over `let`
- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for complex functions

### React Components

- Use functional components with hooks
- Follow component naming convention (PascalCase)
- Use PropTypes or TypeScript for type checking
- Keep components single-responsibility

### Backend Code

- Use async/await for asynchronous operations
- Handle errors properly
- Validate all inputs
- Use proper HTTP status codes

### Database

- Use Prisma for database operations
- Write descriptive migration names
- Include proper indexes for performance

## 🧪 Testing

### Backend Testing

```bash
cd Server
npm test                # Run all tests
npm run test:unit      # Unit tests only
npm run test:integration # Integration tests only
```

### Frontend Testing

```bash
cd Client
npm test               # Run all tests
npm run test:coverage  # With coverage report
```

### Testing Guidelines

- Write tests for new features
- Aim for >80% code coverage
- Test edge cases and error scenarios
- Use descriptive test names

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Node.js version, browser version
6. **Screenshots**: If applicable
7. **Logs**: Any relevant error logs

### Bug Report Template

```markdown
## Bug Description
[Clear description]

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Environment
- OS: [e.g., Ubuntu 20.04]
- Node.js: [e.g., 18.17.0]
- Browser: [e.g., Chrome 118]

## Screenshots
[If applicable]

## Additional Context
[Any other context]
```

## ✨ Feature Requests

When requesting features:

1. Check if feature already exists
2. Search existing issues
3. Use clear, descriptive title
4. Explain the use case
5. Provide implementation suggestions (optional)

### Feature Request Template

```markdown
## Feature Description
[Clear description]

## Problem Statement
[What problem does this solve?]

## Proposed Solution
[How should it work?]

## Alternatives Considered
[What other approaches did you consider?]

## Additional Context
[Any other context]
```

## 📖 Documentation

- Update README.md for significant changes
- Add inline comments for complex code
- Update API documentation for endpoint changes
- Create new documentation files for major features

## 🔍 Code Review Process

### Review Guidelines

1. **Functionality**: Does the code work as intended?
2. **Code Quality**: Is the code clean and maintainable?
3. **Performance**: Are there any performance issues?
4. **Security**: Are there any security vulnerabilities?
5. **Testing**: Are tests adequate?
6. **Documentation**: Is documentation updated?

### Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or clearly documented)
- [ ] Security considerations addressed
- [ ] Performance implications considered

## 🎯 Release Process

1. **Version Bump**: Update version in package.json files
2. **Changelog**: Update CHANGELOG.md
3. **Tag**: Create git tag with version number
4. **Release**: Create GitHub release
5. **Deploy**: Deploy to production

## 🏷️ Labeling Issues

Use these labels for issues:

- `bug`: Bug reports
- `enhancement`: Feature requests
- `documentation`: Documentation issues
- `good first issue`: Good for newcomers
- `help wanted`: Community help needed
- `priority/high`: High priority issues
- `priority/medium`: Medium priority issues
- `priority/low`: Low priority issues

## 🤝 Community Guidelines

### Code of Conduct

1. **Be Respectful**: Treat everyone with respect
2. **Be Inclusive**: Welcome all contributors
3. **Be Constructive**: Provide helpful feedback
4. **Be Patient**: Help newcomers learn
5. **Be Professional**: Maintain professional conduct

### Communication

- Use GitHub issues for bug reports and feature requests
- Use discussions for general questions
- Be clear and concise in communications
- Follow the issue templates

## 🏆 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Annual contributor highlights
- Special badges for significant contributions

## 📞 Getting Help

If you need help:

1. Check existing documentation
2. Search existing issues
3. Create a discussion for questions
4. Join our Discord community (link in README)
5. Contact maintainers directly for urgent issues

---

Thank you for contributing to SafeLedger! 🎉
