# Release Guide

This guide explains how to create releases for the Japanese Week Quiz application.

## Automatic Releases (Recommended)

### 1. Create a Version Tag

When you're ready to release, create and push a version tag:

```bash
# Make sure you're on the main branch and up to date
git checkout main
git pull origin main

# Create a new version tag (follow semantic versioning)
git tag v1.0.0

# Push the tag to trigger the release workflow
git push origin v1.0.0
```

### 2. GitHub Actions Builds

The release workflow will automatically:
- Build for Windows (x64 + x86, installer + portable)
- Build for macOS (Intel + Apple Silicon, DMG + ZIP)
- Build for Linux (AppImage + DEB + TAR.GZ)
- Create a GitHub release with all files attached
- Generate release notes from recent commits

### 3. Monitor Progress

1. Go to the **Actions** tab in your GitHub repository
2. Watch the "Build and Release" workflow progress
3. Each platform builds in parallel (Windows, macOS, Linux)
4. When complete, check the **Releases** section for your new release

## Manual Triggers

You can also trigger builds manually:

### Test Builds (No Release)
1. Go to **Actions** tab
2. Select "Build Test" workflow
3. Click "Run workflow"
4. Download artifacts from the workflow run

### Manual Release
1. Go to **Actions** tab
2. Select "Build and Release" workflow
3. Click "Run workflow"
4. This creates a release from the current commit

## Version Numbering

Follow [semantic versioning](https://semver.org/):
- `v1.0.0` - Major release (breaking changes)
- `v1.1.0` - Minor release (new features)
- `v1.0.1` - Patch release (bug fixes)

## Release Checklist

Before creating a release:
- [ ] Test the application locally
- [ ] Update version in `package.json` if needed
- [ ] Update `README.md` with any new features
- [ ] Commit and push all changes
- [ ] Create and push the version tag
- [ ] Monitor the GitHub Actions workflow
- [ ] Test the released binaries on different platforms

## Troubleshooting

**Build fails?**
- Check the Actions logs for specific errors
- Ensure `package.json` has correct build configuration
- Verify all source files are committed

**macOS build fails?**
- This is expected locally (requires macOS)
- GitHub Actions handles macOS builds automatically

**Release not created?**
- Ensure you pushed a tag starting with `v` (e.g., `v1.0.0`)
- Check that the workflow completed successfully
- Look for errors in the "create-release" job
