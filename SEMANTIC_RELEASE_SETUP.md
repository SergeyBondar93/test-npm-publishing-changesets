# Semantic Release Configuration for Monorepo

## Обзор

Этот монорепозиторий настроен с использованием semantic-release для автоматического управления версиями и публикации npm-пакета.

## Структура

- **npm-package/** - публикуемый npm-пакет (релизится автоматически)
- **shared/** - общие модули (изменения триггерят релиз npm-package)
- **apps/** - приложения (не влияют на релиз npm-package)

## Как это работает

### Автоматический релиз npm-package

1. **Триггеры**: Релиз запускается при push в ветку `main`/`master` если есть изменения в:
   - `npm-package/`
   - `shared/`

2. **Теги**: Создаются теги с префиксом пакета: `@SergeyBondar93/test-independent-npm-package@1.0.0`

3. **Публикация**: Пакет публикуется в GitHub Packages Registry

### Conventional Commits

Используйте conventional commits для автоматического определения версии:

- `feat: новая функция` → MINOR версия (0.1.0 → 0.2.0)
- `fix: исправление бага` → PATCH версия (0.1.0 → 0.1.1)
- `perf: улучшение производительности` → PATCH версия
- `docs: обновление документации` → PATCH версия
- `refactor: рефакторинг кода` → PATCH версия
- `build: изменения сборки` → PATCH версия
- `BREAKING CHANGE:` или `!` после типа → MAJOR версия (0.1.0 → 1.0.0)

#### Примеры коммитов:

```bash
# Новая функция (minor)
git commit -m "feat(npm-package): add new export function"

# Исправление бага (patch)
git commit -m "fix(shared): resolve module import issue"

# Breaking change (major)
git commit -m "feat(npm-package)!: change API signature

BREAKING CHANGE: function now requires second parameter"
```

### Ручные теги для apps

Теги без префикса (например, `app1-v1.0.0`) можно создавать вручную для приложений - они **НЕ** будут триггерить релиз npm-пакета:

```bash
git tag app1-v1.0.0
git push origin app1-v1.0.0
```

## Настройка

### GitHub Settings

1. Убедитесь что включены GitHub Actions в Settings → Actions
2. Убедитесь что есть права на запись packages в Settings → Actions → General → Workflow permissions → "Read and write permissions"

### Первый релиз

1. Установите зависимости:
```bash
npm install
```

2. Сделайте коммит с изменениями в `npm-package/` или `shared/`:
```bash
git add .
git commit -m "feat(npm-package): initial release"
git push origin main
```

3. GitHub Actions автоматически:
   - Определит версию на основе коммитов
   - Обновит `package.json` и создаст `CHANGELOG.md`
   - Создаст тег `@SergeyBondar93/test-independent-npm-package@1.0.0`
   - Опубликует пакет в GitHub Packages
   - Создаст GitHub Release

## Файлы конфигурации

- `.github/workflows/release.yml` - GitHub Actions workflow для релиза
- `npm-package/.releaserc.json` - конфигурация semantic-release

## Troubleshooting

### Релиз не запускается

- Проверьте что коммиты используют conventional commits формат
- Убедитесь что изменения в `npm-package/` или `shared/`
- Проверьте что push в `main`/`master` ветку

### Ошибка публикации

- Убедитесь что `GITHUB_TOKEN` имеет права на публикацию packages
- Проверьте `publishConfig` в `npm-package/package.json`

### Ручной запуск

Можно запустить релиз вручную через GitHub Actions UI:
1. Перейдите в Actions → Release NPM Package
2. Нажмите "Run workflow"
3. Выберите ветку и запустите
