# Contributing to SmartProcure

Thank you for your interest in contributing to SmartProcure!

## How to Contribute

### 1. Reporting Bugs
- Ensure the bug was not already reported in GitHub Issues.
- Submit a detailed issue using our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).

### 2. Suggesting Enhancements
- Open a feature request using our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).

### 3. Submitting Pull Requests
1. Fork the repo and create your branch from `main`.
2. Follow our commit message conventions (Conventional Commits):
   - `feat(...)`: New user-facing feature
   - `fix(...)`: Bug fix
   - `style(...)`: CSS/UI styling update
   - `test(...)`: Adding or updating tests
   - `docs(...)`: Documentation changes
   - `chore(...)`: Maintenance or dependencies
3. Run backend tests before submitting: `mvn test` in `backend`.
4. Ensure frontend builds cleanly: `npm run build` in `frontend`.
5. Open a Pull Request referencing the issue.
