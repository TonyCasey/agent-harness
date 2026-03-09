# Node.js

JavaScript runtime for development.

## Required Version

**Node.js v18** - Required for development.

## Installation with nvm (Recommended)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.zshrc

# Install Node 18
nvm install 18

# Use Node 18
nvm use 18

# Set as default
nvm alias default 18

# Verify
node --version  # Should show v18.x.x
```

## Version Switching

```bash
# List installed versions
nvm list

# Switch version
nvm use 18
nvm use 20

# Use version from .nvmrc
nvm use
```

## Auto-switching (Optional)

Add to `~/.zshrc`:

```bash
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")
    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  fi
}
add-zsh-hook chdir load-nvmrc
load-nvmrc
```

## npm Commands

```bash
# Install dependencies
npm install

# Run scripts
npm run start
npm run start-dev
npm run test
npm run build

# Run specific test file
npm run test -- path/to/file.test.ts
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Wrong Node version | `nvm use 18` |
| Module not found | `rm -rf node_modules && npm install` |
| Permission denied | Don't use sudo with npm, use nvm instead |
| Old npm cache | `npm cache clean --force` |
