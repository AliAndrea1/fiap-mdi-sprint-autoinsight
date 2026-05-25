# AutoInsight Mobile
 
> Solução mobile desenvolvida para o Challenge Ford FIAP 2026 — Inteligência Competitiva Automotiva
 
---
 
## Equipe
 
| Nome | RM |
|---|---|
| Ali Andrea Mamani Molle | 558052 |
| Guilherme Linard F.R Gozzi | 555768 |
| Lucas Vasquez Silva | 555159 |
 
---
 
## Sobre o Projeto
 
O **AutoInsight** é um aplicativo mobile desenvolvido em **React Native com Expo** que responde ao **Desafio 01 — Inteligência Competitiva Automotiva** proposto pela Ford.
 
### Por que este desafio?
 
A Ford atualmente gasta cerca de 1 hora por versão de veículo para coletar especificações técnicas da concorrência de forma manual — sites, YouTube, reportagens e concessionárias. Esse processo é lento e sujeito a imprecisões. O AutoInsight resolve isso centralizando a busca e exibição de especificações técnicas de forma padronizada, rápida e comparável.
 
### Funcionalidades implementadas
 
- Login com autenticação JWT e controle de acesso por perfil (ADMIN/ANALYST)
- Listagem de todos os veículos cadastrados
- Busca de veículo por marca, modelo e versão
- Exibição de especificações técnicas padronizadas
- Comparação lado a lado entre dois veículos
- Histórico de buscas realizadas pelo usuário
- Logout com limpeza de sessão
- Controle de acesso por perfil (RBAC) — usuários com perfil **ANALYST** não conseguem excluir registros nem acessar logs de auditoria, somente o **ADMIN** tem essas permissões
---
 
## Demonstração Visual
 
### Telas do App
 
**Login**
 
<img width="1080" height="2340" alt="Image" src="https://github.com/user-attachments/assets/4c71d158-6a5f-47bc-899e-1e1a9f16cb68" />

**Home**
 
<img width="738" height="1600" alt="Image" src="https://github.com/user-attachments/assets/154e5a7c-7dbb-4b1f-bbd6-03b89d68fd09" />
 
**Busca**
 
<img width="738" height="1600" alt="Image" src="https://github.com/user-attachments/assets/e5f61fc9-32c8-459c-b57d-6f603c36fac2" />
 
**Comparação**
 
<img width="738" height="1600" alt="Image" src="https://github.com/user-attachments/assets/7331cf7c-43b7-4e72-a5a5-57976329719e" />
 
**Histórico**
 
<img width="738" height="1600" alt="Image" src="https://github.com/user-attachments/assets/05d424e9-a4ae-41d1-a18e-b5d1a8d4156b" />
 
### Vídeo / GIF do fluxo principal
 
[> [inserir GIF ou link do vídeo demonstrando o fluxo: login → busca → comparação]](https://github.com/user-attachments/assets/46b9085c-d3d9-4ce7-b191-695764591d0e)
 
---
 
## Como Rodar o Projeto
 
### Pré-requisitos
 
- Node.js 18+
- Expo CLI instalado globalmente:
```bash
npm install -g expo-cli
```
- Expo Go instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- API AutoInsight rodando localmente — veja o passo a passo abaixo
- MySQL 8.x instalado com o banco `autoinsight_db` criado
### Configurando o banco de dados (MySQL Workbench)
 
O app depende da API que depende do MySQL. Sem isso o app nao funciona.
 
**1.** Baixe e instale o MySQL Community Server:
https://dev.mysql.com/downloads/mysql/
 
Durante a instalacao defina uma senha para o usuario `root`. Guarde essa senha.
 
**2.** Baixe e instale o MySQL Workbench:
https://dev.mysql.com/downloads/workbench/
 
**3.** Abra o MySQL Workbench e conecte:
- Clique em **+** ao lado de "MySQL Connections"
- Hostname: `127.0.0.1`
- Port: `3306`
- Username: `root`
- Clique em **Test Connection**, insira sua senha e clique em **OK**
**4.** Crie o banco de dados — abra uma nova query e execute:
```sql
CREATE DATABASE autoinsight_db;
```
 
**5.** Clone e rode a API ([repositorio da API](https://github.com/AliAndrea1/Sprint-Soa-Ford)):
```bash
git clone https://github.com/AliAndrea1/Sprint-Soa-Ford.git
cd Sprint-Soa-Ford
mvn spring-boot:run
```
 
> O Flyway criara as tabelas automaticamente ao subir a API.
 
### Passo a passo
 
**1.** Clonar o repositório:
```bash
git clone https://github.com/AliAndrea1/fiap-mdi-sprint-autoinsight.git
cd fiap-mdi-sprint-autoinsight
```
 
**2.** Instalar as dependências:
```bash
npm install
```
 
**3.** Configurar o IP da API:
 
O IP da máquina que roda a API precisa ser atualizado em **dois arquivos**:
 
- `services/vehicleService.ts`
- `app/login.tsx`
Em ambos, troque `SEU_IP` pelo IP da sua máquina:
 
```ts
const API_URL = 'http://SEU_IP:8080/api';
```
 
Para descobrir seu IP:
- Windows: `ipconfig` no terminal → IPv4
- Mac/Linux: `ifconfig` no terminal → inet
> O celular e o computador precisam estar na mesma rede Wi-Fi.
 
**4.** Rodar o projeto:
```bash
npx expo start
```
 
**5.** Abrir no celular:
 
Escaneie o QR Code exibido no terminal com o app **Expo Go**.
 
### Credenciais de acesso
 
| Usuário | Senha | Perfil |
|---|---|---|
| admin | admin123 | ADMIN |
| analyst | analyst123 | ANALYST |
 
---
 
## Decisões Técnicas
 
### Stack
 
| Tecnologia | Finalidade |
|---|---|
| React Native + Expo | Framework mobile multiplataforma |
| Expo Router | Navegação baseada em arquivos |
| Axios | Requisições HTTP à API |
| AsyncStorage | Persistência local do token JWT |
| TypeScript | Tipagem estática |
 
### Estrutura do projeto
 
```
app/
├── (tabs)/
│   ├── index.tsx         # Tela Home
│   ├── search.tsx        # Tela de Busca
│   ├── history.tsx       # Tela de Histórico
│   ├── compare.tsx       # Tela de Comparação
│   └── _layout.tsx       # Layout das tabs
├── index.tsx             # Redirecionador (token → home ou login)
├── login.tsx             # Tela de Login
└── _layout.tsx           # Layout raiz
 
components/
└── Logo.tsx              # Logo SVG animado do app
└── SpecRow.tsx           # Linha de especificacao tecnica (label + valor)
└── VehicleCard.tsx       # Card clicavel de veiculo na listagem
constants/
└── theme.ts              # Cores, fontes e espaçamentos
services/
└── vehicleService.ts     # Centraliza todas as chamadas à API
```
 
### Integrações
 
- **API AutoInsight** (Spring Boot) — consumida via axios com interceptor de token JWT automático. Todos os requests já enviam o token no header `Authorization: Bearer {token}` sem precisar configurar manualmente em cada chamada.
- **AsyncStorage** — usado para persistir o token JWT e os dados do usuário (username e role) entre sessões, permitindo que o usuário não precise fazer login novamente ao reabrir o app.
### Decisões de arquitetura
 
- **Expo Router** foi escolhido por permitir navegação baseada em arquivos, tornando a estrutura mais organizada e próxima do que o mercado usa atualmente.
- **vehicleService.ts** centraliza todas as chamadas à API — se a URL mudar, só esse arquivo precisa ser atualizado.
- O **redirecionamento automático** na abertura do app (`app/index.tsx`) verifica se existe token salvo e redireciona para a tela correta, evitando que o usuário veja a tela home sem estar autenticado.
---
 
## Próximos Passos
 
- Implementar **notificações push** para alertar o usuário quando um veículo buscado tiver especificações atualizadas
- Adicionar **filtros avançados** na listagem de veículos (por tipo de motor, faixa de preço, ano)
- Criar **exportação de relatório** comparativo em PDF diretamente pelo app
---
 
## Repositório da API
 
A API que alimenta este app está disponível em:
[https://github.com/AliAndrea1/Sprint-Soa-Ford](https://github.com/AliAndrea1/Sprint-Soa-Ford)
