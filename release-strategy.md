# Release Strategy

## ✅ УТВЕРЖДЕНО (Обновлено на semantic-release)

## Структура проекта
- `shared/` - общий код, используется npm-package и apps
- `npm-package/` - публикуемый npm пакет (@test-npm-repo/test-independent-npm-package)
- `apps/` - приложения (app1, app2) - НЕ публикуются

## Правила релизов

### 1. Билд на всех пушах
- Все пуши во все ветки триггерят билд
- Проверяется что все пакеты (shared, npm-package, apps) успешно собираются
- Запускаются тесты (dummy: echo "tests are successfully passed")

### 2. АВТОМАТИЧЕСКИЙ Релиз при пуше в main

#### Условия для релиза npm-package:
- Изменения в `shared/**` ИЛИ `npm-package/**` (path filter)
- Коммиты в формате Conventional Commits (`feat:`, `fix:`, `feat!:`)
- ❌ Изменения только в `apps/**` - НЕ триггерят релиз

#### Процесс релиза (ПОЛНОСТЬЮ АВТОМАТИЧЕСКИЙ):
1. **semantic-release** анализирует коммиты с последнего релиза
2. Определяет новую версию по Conventional Commits:
   - `fix:` → patch (1.0.0 → 1.0.1)
   - `feat:` → minor (1.0.0 → 1.1.0)
   - `BREAKING CHANGE:` или `feat!:` → major (1.0.0 → 2.0.0)
3. Автогенерация CHANGELOG.md
4. Обновление версии в npm-package/package.json
5. Билд npm-package
6. Создание Git tag
7. Публикация в npm registry
8. Создание GitHub Release с release notes

### Что НЕ нужно делать:
❌ Создавать changeset файлы  
❌ Создавать Version Packages PR  
❌ Вручную обновлять версии  
❌ Вручную создавать tags или releases  

**Всё происходит автоматически при пуше в main!**

## Локальное тестирование

### Инструменты:
- `act` - запуск GitHub Actions локально (работает с Podman!)
- `actionlint` - валидация синтаксиса workflow файлов

### Установка act:
```bash
# macOS
brew install act

# Использование с Podman
act --container-daemon-socket unix:///var/run/podman/podman.sock push
# или короче
act -s DOCKER_HOST=unix:///var/run/podman/podman.sock push

# Для pull request
act pull_request

# Dry-run
act -n  # показать что будет запущено без выполнения
```

## ✅ Решения

### Conventional Commits
- ✅ Используем Changesets (он гибче чем строгий conventional commits)
- ✅ Автоматический CHANGELOG - **ДА**
- ⏳ Валидация формата - пока нет (можно добавить позже)

### Версионирование
- ✅ Текущая версия npm-package: **1.0.0**
- ✅ Версия shared (0.0.0) - не обновляем (private пакет)
- ✅ Инструмент: **Changesets**

### GitHub Releases
- ✅ Формат тегов: **`@test-npm-repo/test-independent-npm-package@1.0.0`** (с префиксом пакета)
- ✅ Release notes: автогенерированный из CHANGELOG
- ✅ Pre-release версии: **НЕТ** (только main ветка)

### NPM Publishing
- ✅ NPM_TOKEN: **готов** (добавлен в GitHub Secrets)
- ✅ Публикация: только **npmjs.com**
- ⏳ Провенанс: можно добавить позже

### Детекция изменений
- ✅ Метод: **Changesets** (автоматически отслеживает с последнего релиза)
- ✅ Пути: `shared/**`, `npm-package/**`
- ✅ Изменения только в `apps/**` - не триггерят релиз

### Apps (app1, app2)
- ✅ Билдить в CI: **ДА** (проверка что собирается)
- ✅ Запускать: НЕТ (только сборка)
- ✅ Деплой: НЕТ

### Безопасность и качество
- ✅ Tests: dummy step (echo "tests are successfully passed")
- ❌ Linting: пока нет
- ❌ Type checking: пока нет
- ❌ Manual approval: нет
- ⏳ Branch protection: рекомендуется настроить позже

## Архитектура workflows

### 1. `ci.yml` - на все пуши
```yaml
on: [push, pull_request]
jobs:
  build:
    - Install dependencies (npm ci)
    - Build all packages (npm run build)
    - Run tests (echo "tests are successfully passed")
```

### 2. `release.yml` - только main
```yaml
on:
  push:
    branches: [main]
jobs:
  release:
    - Install dependencies
    - Create Release Pull Request (changesets/action)
      - Changesets анализирует изменения
      - Обновляет версии
      - Генерирует CHANGELOG
      - Создает PR с изменениями
    - OR Publish to npm (если PR уже смержен)
      - Build packages
      - Publish to npm
      - Create GitHub Release
```

## Как работает Changesets

1. **Разработчик делает изменения** в `shared/` или `npm-package/`
2. **Запускает `npm run changeset`** - создает файл описания изменений
3. **Коммитит changeset файл** вместе с изменениями
4. **При мерже в main:**
   - Changesets GitHub Action создает "Version Packages" PR
   - PR содержит обновленные версии и CHANGELOG
5. **При мерже Version Packages PR:**
   - Автоматически публикуется в npm
   - Создается GitHub Release

## Следующие шаги
1. ✅ Обсудить и ответить на вопросы
2. ✅ Выбрать инструмент для версионирования - **Changesets**
3. ⏳ Установить и настроить Changesets
4. ⏳ Создать GitHub Actions workflows
5. ✅ NPM_TOKEN уже в GitHub Secrets
6. ⏳ Протестировать локально с act + podman
7. ⏳ Сделать тестовый релиз
