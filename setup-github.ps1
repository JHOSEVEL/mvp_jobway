# Script para configurar e fazer push do projeto para o GitHub
# Execute este script APÓS instalar o Git

Write-Host "=== Configuração do Repositório GitHub ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Git está instalado
try {
    $gitVersion = git --version
    Write-Host "✓ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git não encontrado!" -ForegroundColor Red
    Write-Host "Por favor, instale o Git primeiro: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Verificar se já é um repositório Git
if (Test-Path .git) {
    Write-Host "✓ Repositório Git já inicializado" -ForegroundColor Green
} else {
    Write-Host "Inicializando repositório Git..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Repositório inicializado" -ForegroundColor Green
}

# Verificar se há arquivos para adicionar
Write-Host ""
Write-Host "Verificando arquivos..." -ForegroundColor Yellow
$status = git status --porcelain

if ($status) {
    Write-Host "Adicionando arquivos ao staging..." -ForegroundColor Yellow
    git add .
    Write-Host "✓ Arquivos adicionados" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Fazendo commit inicial..." -ForegroundColor Yellow
    git commit -m "Initial commit: JobWay - Recrutamento Inteligente em SC"
    Write-Host "✓ Commit realizado" -ForegroundColor Green
} else {
    Write-Host "✓ Nenhuma alteração pendente" -ForegroundColor Green
}

# Verificar se já existe remote
$remote = git remote -v
if ($remote) {
    Write-Host ""
    Write-Host "Remote já configurado:" -ForegroundColor Yellow
    Write-Host $remote
    Write-Host ""
    Write-Host "Para fazer push, execute:" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "=== Próximos Passos ===" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Crie um repositório no GitHub (https://github.com/new)" -ForegroundColor Yellow
    Write-Host "2. Execute os seguintes comandos (substitua SEU_USUARIO e NOME_REPO):" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   git remote add origin https://github.com/SEU_USUARIO/NOME_REPO.git" -ForegroundColor White
    Write-Host "   git branch -M main" -ForegroundColor White
    Write-Host "   git push -u origin main" -ForegroundColor White
    Write-Host ""
    Write-Host "Ou consulte o arquivo GITHUB_SETUP.md para instruções detalhadas." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== Concluído ===" -ForegroundColor Green

