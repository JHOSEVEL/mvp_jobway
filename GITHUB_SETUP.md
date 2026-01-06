# Guia para Subir o Projeto no GitHub

## Passo 1: Instalar o Git

Se você ainda não tem o Git instalado:

1. Baixe o Git para Windows em: https://git-scm.com/download/win
2. Execute o instalador e siga as instruções (aceite as opções padrão)
3. Reinicie o terminal/PowerShell após a instalação

## Passo 2: Configurar o Git (primeira vez)

Abra o PowerShell ou Git Bash e execute:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@example.com"
```

## Passo 3: Criar Repositório no GitHub

1. Acesse https://github.com e faça login
2. Clique no botão "+" no canto superior direito
3. Selecione "New repository"
4. Dê um nome ao repositório (ex: `jobway-recrutamento-inteligente-sc`)
5. **NÃO** marque "Initialize this repository with a README"
6. Clique em "Create repository"

## Passo 4: Inicializar o Repositório Local

No PowerShell, navegue até a pasta do projeto e execute:

```bash
# Inicializar o repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit: JobWay - Recrutamento Inteligente em SC"

# Adicionar o repositório remoto (substitua SEU_USUARIO e NOME_REPO)
git remote add origin https://github.com/SEU_USUARIO/NOME_REPO.git

# Renomear a branch principal para main (se necessário)
git branch -M main

# Fazer o push para o GitHub
git push -u origin main
```

## Passo 5: Autenticação

Se solicitado, você precisará autenticar:
- **Opção 1**: Use um Personal Access Token (recomendado)
  - Vá em GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Gere um novo token com permissões `repo`
  - Use o token como senha quando solicitado

- **Opção 2**: Use GitHub Desktop (mais fácil para iniciantes)
  - Baixe em: https://desktop.github.com/
  - Abra o projeto no GitHub Desktop
  - Clique em "Publish repository"

## ⚠️ Importante

- O arquivo `.env.local` com suas chaves de API **NÃO** será enviado (está no .gitignore)
- Certifique-se de não commitar informações sensíveis
- Se precisar compartilhar variáveis de ambiente, use GitHub Secrets ou um arquivo `.env.example`

## Comandos Úteis

```bash
# Ver status dos arquivos
git status

# Adicionar arquivos específicos
git add arquivo.ts

# Fazer commit
git commit -m "Descrição da alteração"

# Enviar para o GitHub
git push

# Ver histórico
git log
```


