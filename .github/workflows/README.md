# GitHub Actions Workflow

## Build and Release

Automatically builds and publishes production-ready artifacts on version tags.

### Trigger

Push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

### Artifacts

- `react-ui-dist.tar.gz` - Production build (tar.gz)
- `react-ui-dist.zip` - Production build (zip)

### Usage

```bash
# Download latest
wget https://github.com/UWA-CITS5206-DMR/react-ui/releases/latest/download/react-ui-dist.tar.gz

# Extract
tar -xzf react-ui-dist.tar.gz -C /var/www/react-ui
```

### Links

- [Releases](https://github.com/UWA-CITS5206-DMR/react-ui/releases)
- [Actions](https://github.com/UWA-CITS5206-DMR/react-ui/actions)
