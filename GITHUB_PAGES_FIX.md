# GitHub Pages Deployment Fix Guide

## 🚨 Issue Summary
The `peaceiris/actions-gh-pages@v3` action is failing with permission error:
```
remote: Permission to askshameer/i-brow.git denied to github-actions[bot].
fatal: unable to access 'https://github.com/askshameer/i-brow.git/': The requested URL returned error: 403
```

## 🔧 Solution Options

### Option 1: Use Personal Access Token (Recommended for peaceiris action)

1. **Create a Personal Access Token**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `repo`, `workflow`, `write:packages`
   - Copy the token

2. **Add token to repository secrets**:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `PERSONAL_ACCESS_TOKEN`
   - Value: Paste your token

3. **Update workflow file** (use `static-deploy.yml`):
   ```yaml
   - name: Deploy to GitHub Pages
     uses: peaceiris/actions-gh-pages@v3
     with:
       personal_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
       publish_dir: ./bts/build
   ```

### Option 2: Use Official GitHub Pages Actions (Recommended)

1. **Enable GitHub Pages**:
   - Go to repository → Settings → Pages
   - Source: "GitHub Actions"

2. **Use the new workflow** (`pages.yml`):
   - Uses `actions/deploy-pages@v4`
   - No personal token needed
   - More secure and officially supported

### Option 3: Fix Current Workflow Permissions

Update your existing workflow permissions:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## 🎯 Quick Fix Commands

### For Immediate Fix (Personal Token Method):
```bash
# 1. Use the static-deploy.yml workflow
# 2. Add PERSONAL_ACCESS_TOKEN to repository secrets
# 3. Commit and push
```

### For Modern Approach (Official Actions):
```bash
# 1. Enable GitHub Pages with "GitHub Actions" source
# 2. Use pages.yml workflow
# 3. Commit and push
```

## 🛠️ Repository Settings Required

### GitHub Pages Settings:
1. Go to Settings → Pages
2. Source: "GitHub Actions" (not "Deploy from a branch")
3. This enables the new Pages deployment method

### Repository Permissions:
1. Settings → Actions → General
2. Workflow permissions: "Read and write permissions"
3. Allow GitHub Actions to create and approve pull requests: ✅

## 📋 Troubleshooting Checklist

- [ ] Personal access token has correct scopes (`repo`, `workflow`)
- [ ] Token is added to repository secrets as `PERSONAL_ACCESS_TOKEN`
- [ ] Repository has GitHub Pages enabled
- [ ] Workflow has correct permissions block
- [ ] Branch name is correct (`main` not `master`)
- [ ] Build directory exists (`./bts/build`)

## 🚀 Testing the Fix

1. **Commit the workflow changes**:
   ```bash
   git add .github/workflows/
   git commit -m "Fix GitHub Pages deployment permissions"
   git push origin main
   ```

2. **Monitor the Actions tab**:
   - Go to repository → Actions
   - Watch the deployment workflow
   - Check for successful deployment

3. **Verify deployment**:
   - Visit: `https://askshameer.github.io/i-brow/`
   - Should show the Bug Repro Engine interface

## 🔍 Alternative Solutions

If GitHub Pages doesn't work, consider these alternatives:

### Netlify:
```yaml
- name: Deploy to Netlify
  uses: netlify/actions/deploy@master
  with:
    publish-dir: ./bts/build
    production-branch: main
    github-token: ${{ secrets.GITHUB_TOKEN }}
    deploy-message: "Deploy from GitHub Actions"
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Vercel:
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
    working-directory: ./bts
```

---

**Status**: Ready to implement the fix! Choose Option 1 or 2 based on your preference.
