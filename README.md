# Lombongo Green

Sistema inovador de gestão e reciclagem de resíduos sólidos urbanos.

## Sobre o Projeto

Lombongo Green é uma plataforma digital que conecta cidadãos, comerciantes e parceiros para criar um ecossistema mais sustentável de gestão de resíduos. O sistema oferece ferramentas para:

- **Cidadãos**: Acompanhar pontos de coleta, denunciar desperdícios e participar de programas de reciclagem
- **Comerciantes**: Gerenciar resíduos comerciais e encontrar soluções de descarte responsável
- **Administradores**: Monitorar a rede de coleta e gerar relatórios de impacto ambiental

## Como Configurar e Executar

O único requisito é ter Node.js & npm instalado - [instalar com nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Siga estes passos para configurar o projeto localmente:

```sh
# Etapa 1: Clone o repositório
git clone <SEU_URL_GIT>

# Etapa 2: Navegue ao diretório do projeto
cd lombongo-green

# Etapa 3: Instale as dependências necessárias
npm i

# Etapa 4: Inicie o servidor de desenvolvimento
npm run dev
```

## Tecnologias Utilizadas

Este projeto é construído com:

- **Vite** - Ferramenta de build rápida
- **TypeScript** - Tipagem estática para JavaScript
- **React** - Biblioteca de interface de usuário
- **shadcn-ui** - Componentes de UI reutilizáveis
- **Tailwind CSS** - Framework de CSS utility-first
- **Supabase** - Backend como serviço (BaaS)

## Estrutura do Projeto

```
src/
├── components/      # Componentes React reutilizáveis
├── pages/          # Páginas da aplicação
├── hooks/          # Hooks customizados
├── lib/            # Funções utilitárias
├── integrations/   # Integrações externas (Supabase, etc)
└── assets/         # Imagens e outros ativos
```

## Recursos Principais

- 🔐 Autenticação segura
- 📊 Dashboard para diferentes tipos de usuários
- 💰 Sistema de carteira digital
- 🔄 Rastreamento de transações
- ♻️ Programa de reciclagem gamificado
- 📱 Interface responsiva e intuitiva

## Contribuindo

As contribuições são bem-vindas! Sinta-se livre para abrir issues e fazer pull requests.

## Licença

Este projeto é licenciado sob a licença MIT.
