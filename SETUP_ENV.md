# Configuração de Variáveis de Ambiente

## 1. Criar arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env` com o seguinte conteúdo:

```
VITE_GEMINI_API_KEY=sua_chave_aqui
```

## 2. Obter a API Key do Gemini

1. Acesse: https://aistudio.google.com/apikey
2. Clique em **"Create API key"**
3. Selecione o projeto do Google Cloud (ou crie um novo)
4. Copie a chave gerada
5. Cole em seu arquivo `.env` na variável `VITE_GEMINI_API_KEY`

## 3. Reiniciar o servidor de desenvolvimento

Após adicionar a variável de ambiente:

```bash
npm run dev
```

## Troubleshooting

### Erro: "API key do Gemini não configurada"

1. **Verifique se o arquivo `.env` existe** na raiz do projeto
2. **Confirme que `VITE_GEMINI_API_KEY` está preenchido** (não vazio)
3. **Reinicie o servidor** (`npm run dev`)
4. **Limpe o cache do navegador** (Ctrl+Shift+Del)

### A chave está configurada, mas ainda dá erro?

1. Abra as **Ferramentas do Desenvolvedor** (F12)
2. Vá para a aba **Console**
3. Procure por erros específicos
4. Verifique se a chave está correta em https://aistudio.google.com/

## Segurança

- **Nunca commit** seu arquivo `.env` no GitHub
- O arquivo `.env` já está no `.gitignore`
- Use `.env.example` como referência para outros desenvolvedores
