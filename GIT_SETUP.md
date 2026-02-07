# Git Repository Setup Instructions

Follow these steps to create a private repository called "solar-system" and commit your work.

## Prerequisites

- Git installed on your computer ([download here](https://git-scm.com/downloads))
- GitHub account ([sign up here](https://github.com/join))

## Step 1: Download All Files

Make sure you have these files in a folder called `solar-system`:
- `solar_vortex.html`
- `vortex_embed.html`
- `vortex_card.html`
- `SolarVortex.jsx`
- `README.md`
- `.gitignore`

## Step 2: Create GitHub Repository

### Option A: Via GitHub Website
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `solar-system`
3. Description: "Interactive 3D solar system vortex visualization"
4. Select: **Private**
5. Do NOT initialize with README (we already have one)
6. Click "Create repository"

### Option B: Via GitHub CLI
```bash
gh repo create solar-system --private --description "Interactive 3D solar system vortex visualization"
```

## Step 3: Initialize Local Repository

Open terminal/command prompt in your `solar-system` folder:

```bash
# Navigate to your project folder
cd /path/to/solar-system

# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Solar system vortex visualization

Features:
- 8 planets with 16 moons
- Interactive controls for speed, trails, and time
- Real-time planetary event tracking
- Multiple embedding options
- Enhanced 3D graphics with realistic materials"

# Set main branch
git branch -M main
```

## Step 4: Connect to GitHub

Replace `YOUR_USERNAME` with your GitHub username:

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/solar-system.git

# Push to GitHub
git push -u origin main
```

## Step 5: Verify

Visit your repository:
```
https://github.com/YOUR_USERNAME/solar-system
```

You should see all your files with the README displayed!

## Future Commits

When you make changes:

```bash
# Check what changed
git status

# Add modified files
git add .

# Commit with message
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

## Common Git Commands

```bash
# View commit history
git log --oneline

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# See current branch
git branch

# Pull latest changes
git pull

# Undo last commit (keep changes)
git reset --soft HEAD~1

# See what changed in files
git diff
```

## Recommended Commit Messages

Examples of good commit messages for this project:

```bash
git commit -m "Add camera view modes and cinematic scrolling"
git commit -m "Fix: Resolve CORS issues with texture loading"
git commit -m "Enhance: Improve moon orbital mechanics"
git commit -m "Update: Add Saturn's rings"
git commit -m "Docs: Update README with new features"
```

## Branch Strategy (Optional)

For organized development:

```bash
main           # Stable, working version
├── develop    # Integration branch
├── feature/camera-modes
├── feature/asteroid-belt
└── fix/performance-issue
```

Create branches:
```bash
git checkout -b develop
git checkout -b feature/camera-modes
```

## Troubleshooting

### Authentication Issues
If you get authentication errors:

```bash
# Use GitHub personal access token
# Go to: Settings > Developer settings > Personal access tokens
# Generate token with 'repo' scope
# Use token as password when prompted
```

Or set up SSH:
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings > SSH and GPG keys
# Change remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/solar-system.git
```

### Large Files
If files are too large (>100MB):
```bash
# Use Git LFS (Large File Storage)
git lfs install
git lfs track "*.png"
git add .gitattributes
```

### Undo Pushed Commit
```bash
# Careful - this rewrites history!
git revert HEAD
git push
```

## Next Steps

1. ✅ Create repository
2. ✅ Make initial commit
3. 📝 Add issues/todos on GitHub
4. 🏷️ Create releases/tags for versions
5. 🔄 Set up GitHub Actions (optional CI/CD)
6. 📊 Enable GitHub Pages for live demo (if you want)

## GitHub Pages Setup (Optional)

To host a live demo:

1. Go to repository Settings
2. Pages section
3. Source: Deploy from branch `main`
4. Folder: `/ (root)`
5. Save

Your site will be live at:
```
https://YOUR_USERNAME.github.io/solar-system/solar_vortex.html
```

---

**Questions?** Check [GitHub Docs](https://docs.github.com) or [Git Documentation](https://git-scm.com/doc)
