# Настройка Personal GitHub Account для этого репозитория

## Проблема
Вы работаете с рабочим GitHub аккаунтом, но хотите пушить этот репозиторий в личный GitHub без изменения глобальных конфигов.

## Решение 1: Локальный Git Config (Самый простой)

### Шаг 1: Настроить локальный git config
```bash
cd /Users/a616337/Desktop/test-publishing/test-npm-publishing-changesets

# Установить личный email и имя ТОЛЬКО для этого репо
git config user.email "your-personal@email.com"
git config user.name "Your Personal Name"

# Проверить что применилось
git config user.email
git config user.name
```

### Шаг 2: Установить remote на личный репозиторий
```bash
# Проверить текущий remote
git remote -v

# Изменить на личный (если нужно)
git remote set-url origin git@github.com:YourPersonalUsername/test-npm-publishing-changesets.git

# Или добавить новый remote
git remote add personal git@github.com:YourPersonalUsername/test-npm-publishing-changesets.git
```

### Шаг 3: Пушить
```bash
# Если изменили origin
git push origin main

# Если добавили personal remote
git push personal main
```

## Решение 2: SSH Ключ специально для личного аккаунта

### Шаг 1: Создать отдельный SSH ключ для личного GitHub
```bash
# Создать новый SSH ключ
ssh-keygen -t ed25519 -C "your-personal@email.com" -f ~/.ssh/id_ed25519_personal

# Добавить публичный ключ на GitHub
cat ~/.ssh/id_ed25519_personal.pub
# Скопировать и добавить на https://github.com/settings/keys
```

### Шаг 2: Создать SSH config
Создать/редактировать `~/.ssh/config`:

```
# Личный GitHub аккаунт
Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes
```

### Шаг 3: Использовать специальный host в URL
```bash
cd /Users/a616337/Desktop/test-publishing/test-npm-publishing-changesets

# Установить remote с кастомным host
git remote set-url origin git@github-personal:YourPersonalUsername/test-npm-publishing-changesets.git

# Или добавить новый
git remote add personal git@github-personal:YourPersonalUsername/test-npm-publishing-changesets.git
```

### Шаг 4: Настроить локальный git config
```bash
git config user.email "your-personal@email.com"
git config user.name "Your Personal Name"
```

## Решение 3: Personal Access Token (HTTPS)

### Шаг 1: Создать Personal Access Token
1. Зайти на https://github.com/settings/tokens (войти под ЛИЧНЫМ аккаунтом!)
2. Generate new token (classic)
3. Выбрать scopes: `repo` (full control), `workflow`
4. Скопировать token (сохраните его, он покажется только один раз!)

### Шаг 2: Сохранить credentials
```bash
cd /Users/a616337/Desktop/test-publishing/test-npm-publishing-changesets

# Создать файл с credentials (формат: https://username:token@github.com)
echo "https://YourPersonalUsername:YOUR_PERSONAL_ACCESS_TOKEN@github.com" > .git-credentials-personal

# ВАЖНО: Проверить что файл в .gitignore
cat .gitignore | grep git-credentials
```

### Шаг 3: Настроить git
```bash
# Настроить credential helper ТОЛЬКО для этого репо
git config credential.helper 'store --file=.git-credentials-personal'

# Настроить локальный user
git config user.email "your-personal@email.com"
git config user.name "Your Personal Name"

# ВАЖНО: Убедиться что remote на HTTPS
git remote set-url origin https://github.com/YourPersonalUsername/test-npm-publishing-changesets.git
```

### Шаг 4: Тестовый пуш
```bash
git push origin main
```

### Если не работает - альтернативный способ (встроенный в URL):

```bash
# Способ A: Token прямо в URL (НЕ рекомендуется, но работает)
git remote set-url origin https://YourPersonalUsername:YOUR_TOKEN@github.com/YourPersonalUsername/test-npm-publishing-changesets.git

# Способ B: Использовать git credential manager (macOS)
git config credential.helper osxkeychain
git push origin main
# При первом пуше запросит username и password (используйте token как password)
```

### Отладка если не работает:

```bash
# Проверить credential helper
git config credential.helper

# Проверить что файл существует
ls -la .git-credentials-personal

# Проверить содержимое (будьте осторожны - там токен!)
cat .git-credentials-personal

# Попробовать сбросить credentials
git config --unset credential.helper
git config credential.helper 'store --file=.git-credentials-personal'

# Или использовать osxkeychain
git config credential.helper osxkeychain
```

## Рекомендация

**Используйте Решение 2 (SSH ключ)** - это самый надежный и безопасный способ.

## Проверка перед пушем

```bash
# Проверить локальный config
git config user.email
git config user.name

# Проверить remote
git remote -v

# Проверить что используется правильный SSH ключ
ssh -T git@github-personal
# Должно ответить: Hi YourPersonalUsername! You've successfully authenticated...
```

## Важно

✅ Локальный `git config` (без `--global`) НЕ влияет на другие репозитории  
✅ Глобальные настройки (рабочий аккаунт) остаются без изменений  
✅ `.git-credentials-personal` должен быть в `.gitignore`  

## Быстрый Setup (SSH метод)

```bash
# 1. Генерируем ключ
ssh-keygen -t ed25519 -C "personal@email.com" -f ~/.ssh/id_ed25519_personal

# 2. Добавляем на GitHub
cat ~/.ssh/id_ed25519_personal.pub | pbcopy  # macOS - скопирует в буфер

# 3. Настраиваем SSH config
echo "Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes" >> ~/.ssh/config

# 4. В репозитории
cd /Users/a616337/Desktop/test-publishing/test-npm-publishing-changesets
git config user.email "personal@email.com"
git config user.name "Personal Name"
git remote set-url origin git@github-personal:YourUsername/test-npm-publishing-changesets.git

# 5. Пушим
git push origin main
```
