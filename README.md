# test-npm-publishing-changesets# test-npm-publishing-changesets# Turborepo starter



Monorepo с **полностью автоматическими релизами** через semantic-release и GitHub Actions.



## Структура проектаMonorepo с автоматическими релизами через Changesets и GitHub Actions.This Turborepo starter is maintained by the Turborepo core team.



```

├── apps/                    # Приложения (не публикуются)

│   ├── app1/               # Приложение 1## Структура проекта## Using this example

│   └── app2/               # Приложение 2

├── shared/                  # Общий код (@repo/shared)

│   ├── a/index.ts

│   ├── b/index.ts```Run the following command:

│   ├── c/index.ts

│   └── index.ts├── apps/                    # Приложения (не публикуются)

├── npm-package/             # Публикуемый npm пакет

│   └── @test-npm-repo/test-independent-npm-package│   ├── app1/               # Приложение 1```sh

└── .github/workflows/       # CI/CD

    ├── ci.yml              # Билд на всех пушах│   └── app2/               # Приложение 2npx create-turbo@latest

    └── release.yml         # Автоматический релиз на main

```├── shared/                  # Общий код (@repo/shared)```



## Быстрый старт│   ├── a/index.ts



### Установка зависимостей│   ├── b/index.ts## What's inside?

```bash

npm install│   ├── c/index.ts

```

│   └── index.tsThis Turborepo includes the following packages/apps:

### Сборка всех пакетов

```bash├── npm-package/             # Публикуемый npm пакет

npm run build

```│   └── @test-npm-repo/test-independent-npm-package### Apps and Packages



### Коммит с автоматическим релизом└── .github/workflows/       # CI/CD

```bash

git commit -m "feat: add new feature"    ├── ci.yml              # Билд на всех пушах- `docs`: a [Next.js](https://nextjs.org/) app

git push

```    └── release.yml         # Релиз на main- `web`: another [Next.js](https://nextjs.org/) app



## 🚀 Автоматические релизы```- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications



Проект использует [semantic-release](https://github.com/semantic-release/semantic-release) для **полностью автоматического** управления версиями и релизами.- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)



**Подробная инструкция:** [HOW_TO_RELEASE.md](./HOW_TO_RELEASE.md)## Быстрый старт- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo



### Как это работает:



1. **Пишете коммит в формате Conventional Commits:**### Установка зависимостейEach package/app is 100% [TypeScript](https://www.typescriptlang.org/).

   ```bash

   git commit -m "feat: add new export function"  # minor: 1.0.0 → 1.1.0```bash

   git commit -m "fix: correct import issue"       # patch: 1.0.0 → 1.0.1

   git commit -m "feat!: redesign API"             # major: 1.0.0 → 2.0.0npm install### Utilities

   ```

```

2. **Пушите в main** (или мержите PR)

This Turborepo has some additional tools already setup for you:

3. **GitHub Actions автоматически:**

   - ✅ Анализирует коммиты с последнего релиза### Сборка всех пакетов

   - ✅ Определяет новую версию

   - ✅ Генерирует CHANGELOG.md```bash- [TypeScript](https://www.typescriptlang.org/) for static type checking

   - ✅ Обновляет package.json

   - ✅ Публикует в npmnpm run build- [ESLint](https://eslint.org/) for code linting

   - ✅ Создает GitHub Release

```- [Prettier](https://prettier.io) for code formatting

### Важно

- ✅ Изменения в `shared/` или `npm-package/` + conventional commit → автоматический релиз

- ❌ Изменения только в `apps/` → релиз НЕ произойдет

### Создание changeset### Build

### Типы коммитов:

- `feat:` → minor version (новая функциональность)```bash

- `fix:` → patch version (багфикс)

- `feat!:` или `BREAKING CHANGE:` → major versionnpm run changesetTo build all apps and packages, run the following command:

- `docs:`, `chore:`, `refactor:` → без релиза

```

## 🚀 CI/CD

```

### CI Workflow (на всех пушах)

- Установка зависимостей## 📦 Релизыcd my-turborepo

- Запуск тестов

- Сборка всех пакетов

- Проверка артефактов

Проект использует [Changesets](https://github.com/changesets/changesets) для автоматического управления версиями и релизами.# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

### Release Workflow (только main при изменениях в shared/npm-package)

- Анализ conventional commitsturbo build

- Определение версии

- Генерация CHANGELOG**Подробная инструкция:** [HOW_TO_RELEASE.md](./HOW_TO_RELEASE.md)

- Публикация в npm

- Создание GitHub Release# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager



## 🧪 Локальное тестирование GitHub Actions### Краткий процесс:npx turbo build



Используйте `act` для запуска workflows локально с Podman.yarn dlx turbo build



**Подробная инструкция:** [.github/ACT_TESTING.md](./.github/ACT_TESTING.md)1. **Делаете изменения** в `shared/` или `npm-package/`pnpm exec turbo build



```bash2. **Создаете changeset**: `npm run changeset````

# Установка

brew install act3. **Коммитите и пушите** в свою ветку



# Запуск CI4. **Создаете PR** → мержите в `main`You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

act push

5. **GitHub Actions автоматически**:

# Запуск Release (dry-run)

act -n -j release   - Создает "Version Packages" PR с обновленными версиями```

```

   - После мержа → публикует в npm и создает GitHub Release# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

## 📋 Доступные команды

turbo build --filter=docs

```bash

npm run build       # Собрать все пакеты### Важно

npm run clean       # Очистить dist директории

```- ✅ Изменения в `shared/` или `npm-package/` → создавайте changeset# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager



## 🔧 Настройка- ❌ Изменения только в `apps/` → changeset не нужен (релиз не произойдет)npx turbo build --filter=docs



### NPM Tokenyarn exec turbo build --filter=docs

Для публикации в npm нужен `NPM_TOKEN` в GitHub Secrets:

1. Получите токен на [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)## 🚀 CI/CDpnpm exec turbo build --filter=docs

2. Добавьте в GitHub: Settings → Secrets → Actions → New secret

3. Имя: `NPM_TOKEN`, значение: ваш токен```



### Branch Protection (рекомендуется)### CI Workflow (на всех пушах)

Настройте защиту main ветки:

- Require pull request reviews- Установка зависимостей### Develop

- Require status checks (CI) to pass

- Запретить force push- Запуск тестов



## 📚 Документация- Сборка всех пакетовTo develop all apps and packages, run the following command:



- [HOW_TO_RELEASE.md](./HOW_TO_RELEASE.md) - Как делать релизы (conventional commits)- Проверка артефактов

- [release-strategy.md](./release-strategy.md) - Полная стратегия релизов

- [MIGRATION_TO_SEMANTIC_RELEASE.md](./MIGRATION_TO_SEMANTIC_RELEASE.md) - Что изменилось```

- [.github/ACT_TESTING.md](./.github/ACT_TESTING.md) - Тестирование workflows локально

### Release Workflow (только main)cd my-turborepo

## 🛠 Технологии

- Создание Release PR с обновленными версиями

- **Monorepo**: Turborepo

- **Build**: esbuild, TypeScript- Публикация в npm# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

- **Versioning**: semantic-release (автоматически по conventional commits)

- **CI/CD**: GitHub Actions- Создание GitHub Release с тегом `@test-npm-repo/test-independent-npm-package@X.Y.Z`turbo dev

- **Package Manager**: npm workspaces



## ✨ Что НЕ нужно делать

## 🧪 Локальное тестирование GitHub Actions# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

❌ Вручную менять версии в package.json  

❌ Создавать changeset файлы  npx turbo dev

❌ Создавать tags вручную  

❌ Создавать releases вручную  Используйте `act` для запуска workflows локально с Podman.yarn exec turbo dev

❌ Запускать команды для релиза локально  

pnpm exec turbo dev

**Всё происходит автоматически при правильных коммитах!** 🎉

**Подробная инструкция:** [.github/ACT_TESTING.md](./.github/ACT_TESTING.md)```



```bashYou can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

# Установка

brew install act```

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

# Запуск CIturbo dev --filter=web

act push

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

# Запуск Release (dry-run)npx turbo dev --filter=web

act -n -j releaseyarn exec turbo dev --filter=web

```pnpm exec turbo dev --filter=web

```

## 📋 Доступные команды

### Remote Caching

```bash

npm run build       # Собрать все пакеты> [!TIP]

npm run clean       # Очистить dist директории> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

npm run changeset   # Создать changeset

npm run version     # Обновить версии (локально)Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

npm run release     # Собрать и опубликовать (локально)

```By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:



## 🔧 Настройка```

cd my-turborepo

### NPM Token

Для публикации в npm нужен `NPM_TOKEN` в GitHub Secrets:# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

1. Получите токен на [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)turbo login

2. Добавьте в GitHub: Settings → Secrets → Actions → New secret

3. Имя: `NPM_TOKEN`, значение: ваш токен# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

npx turbo login

### Branch Protection (рекомендуется)yarn exec turbo login

Настройте защиту main ветки:pnpm exec turbo login

- Require pull request reviews```

- Require status checks (CI) to pass

- Запретить force pushThis will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).



## 📚 ДокументацияNext, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:



- [release-strategy.md](./release-strategy.md) - Полная стратегия релизов```

- [HOW_TO_RELEASE.md](./HOW_TO_RELEASE.md) - Как делать релизы# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)

- [.github/ACT_TESTING.md](./.github/ACT_TESTING.md) - Тестирование workflows локальноturbo link



## 🛠 Технологии# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager

npx turbo link

- **Monorepo**: Turborepoyarn exec turbo link

- **Build**: esbuild, TypeScriptpnpm exec turbo link

- **Versioning**: Changesets```

- **CI/CD**: GitHub Actions

- **Package Manager**: npm workspaces## Useful Links


Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
