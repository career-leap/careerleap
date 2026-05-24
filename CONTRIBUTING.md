# CareerLeap Contributing Guide

## Creating a Pull Request (PR)
You can contribute to the CareerLeap project with the guide below

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-user-profile for example frontend/change-hero-section`
- `fix/login-error for example backend/customer-form-redo`
- `docs/api-update for example documentation/api-update`

### 2. Make Your Changes

- Write clear, focused commits
- Follow existing code style (see `AGENTS.md` for project conventions)
- Test your changes locally before pushing

### 3. Push and Open a PR

```bash
git push -u origin feature/your-feature-name
```

Then open a Pull Request on GitHub:
1. Go to the repository on GitHub
2. Click **Pull requests** → **New pull request**
3. Select your branch and target `main` (or the default branch)
4. Fill in the PR template:
   - **Title**: Clear summary of changes
   - **Description**: What changed and why
   - **Testing**: How you verified the change

### 4. Review & Merge

- Request review from relevant team members
- Address feedback promptly
- Once approved, **squash and merge** (preferred) or merge as appropriate
- Delete the branch after merging

### Quick Reference

| Task | Command |
|------|---------|
| Start new branch | `git checkout -b feature/xyz` |
| Stage changes | `git add .` |
| Commit | `git commit -m "feat: add xyz"` |
| Push branch | `git push -u origin feature/xyz` |
| Update branch | `git pull origin main` |
