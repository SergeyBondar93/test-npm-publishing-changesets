# How to Release (Automatic with semantic-release)

## 🚀 Полностью автоматический процесс!

### Вы просто пишете коммиты в правильном формате, всё остальное делается автоматически.

## Conventional Commits Format

### Типы коммитов:

#### `fix:` - Patch Release (1.0.0 → 1.0.1)
Исправление бага
```bash
git commit -m "fix: resolve import issue in shared module"
```

#### `feat:` - Minor Release (1.0.0 → 1.1.0)
Новая функциональность
```bash
git commit -m "feat: add new export function to npm-package"
```

#### `BREAKING CHANGE:` - Major Release (1.0.0 → 2.0.0)
Breaking change (несовместимое изменение API)
```bash
git commit -m "feat!: change API signature

BREAKING CHANGE: remove deprecated method"
```

или

```bash
git commit -m "feat: redesign API

BREAKING CHANGE: The API has been completely redesigned"
```

### Другие типы (не влияют на версию):
- `docs:` - документация
- `style:` - форматирование
- `refactor:` - рефакторинг
- `test:` - тесты
- `chore:` - вспомогательные задачи

## Workflow

### 1. Делаете изменения в `shared/` или `npm-package/`
```bash
# Редактируете код
vim npm-package/src/index.ts
```

### 2. Коммитите с conventional commit
```bash
git add .
git commit -m "feat: add new feature"
git push
```

### 3. Создаете PR и мержите в main

### 4. GitHub Actions **автоматически**:
✅ Анализирует коммиты с последнего релиза  
✅ Определяет новую версию по conventional commits  
✅ Генерирует CHANGELOG.md  
✅ Обновляет версию в package.json  
✅ Создает Git tag  
✅ Публикует в npm  
✅ Создает GitHub Release  

## Важно

### ✅ Изменения в `shared/` или `npm-package/` + conventional commit
→ Автоматический релиз

### ❌ Изменения только в `apps/`
→ Релиз не произойдет (настроен path filter)

### ⚠️ Коммиты без conventional format
→ Версия не изменится (например, `chore:`, `docs:`)

## Примеры

### Добавили новую функцию
```bash
git commit -m "feat: add export for helper utilities"
# Результат: 1.0.0 → 1.1.0
```

### Исправили баг
```bash
git commit -m "fix: correct type definitions"
# Результат: 1.0.0 → 1.0.1
```

### Breaking change
```bash
git commit -m "feat!: redesign module API

BREAKING CHANGE: Removed old API methods"
# Результат: 1.0.0 → 2.0.0
```

### Несколько изменений в одном PR
```bash
git commit -m "feat: add feature A"
git commit -m "feat: add feature B"
git commit -m "fix: fix bug in feature A"
# Результат: 1.0.0 → 1.1.0 (берется highest версия: minor)
```

## Проверка коммитов

Чтобы проверить что ваши коммиты правильные:
```bash
# Посмотреть последние коммиты
git log --oneline

# Должны быть в формате:
# feat: description
# fix: description
# feat!: description (breaking change)
```

## Отладка

Если релиз не происходит:
1. Проверьте формат коммитов (должны быть `feat:`, `fix:`, etc.)
2. Проверьте что изменения в `shared/` или `npm-package/`
3. Проверьте GitHub Actions logs
4. Убедитесь что NPM_TOKEN настроен в GitHub Secrets

## Что НЕ нужно делать

❌ Не нужно вручную менять версию в package.json  
❌ Не нужно создавать changeset файлы  
❌ Не нужно вручную создавать tags  
❌ Не нужно вручную создавать releases  

Всё это делается **автоматически**! 🎉
