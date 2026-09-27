# AutoInsight Mobile

> Aplicativo Android desenvolvido para o Challenge Ford FIAP 2026 — Desafio 01: Inteligência Competitiva Automotiva.

## Equipe

| Nome | RM |
|---|---|
| Ali Andrea Mamani Molle | 558052 |
| Guilherme Linard F.R Gozzi | 555768 |
| Lucas Vasquez Silva | 555159 |

## Sobre o projeto

O **AutoInsight** reúne dados de veículos e especificações técnicas para consulta e comparação. O aplicativo foi desenvolvido em React Native, Expo e TypeScript. Ele acessa a [AutoInsight API](https://github.com/AliAndrea1/Sprint-Soa-Ford), hospedada no Railway com banco MySQL.

### Funcionalidades

- Login com JWT e perfis `ADMIN` e `ANALYST`;
- Listagem de veículos e especificações;
- Busca por marca, modelo e versão, com seleção opcional de atributos;
- Comparação de dois veículos e suas especificações;
- Histórico de buscas;
- Logout.

As permissões são verificadas pela API. O perfil `ANALYST` pode consultar veículos; operações administrativas exigem `ADMIN`.

## APK Android

**[Baixar e instalar o APK gerado pelo EAS Build](https://expo.dev/accounts/aliandrea/projects/autoinsight/builds/36dcb7f3-991d-4539-9449-e1fc4ab4d321)**

Abra o link no celular Android, baixe o APK e confirme a instalação quando o sistema solicitar. O aplicativo instalado funciona sem Expo Go e sem manter o servidor Expo aberto no computador. É necessária conexão à internet para acessar a API.

O APK foi instalado e testado em um dispositivo físico com dados móveis, fora da rede local usada durante o desenvolvimento. O build foi gerado com o perfil `preview`, configurado em `eas.json` para produzir o formato `.apk`.

## Demonstração visual

### Telas

**Login**

<img width="360" alt="Tela de login do AutoInsight" src="https://github.com/user-attachments/assets/4c71d158-6a5f-47bc-899e-1e1a9f16cb68" />

**Início — veículos cadastrados**

<img width="360" alt="Tela inicial com veículos cadastrados" src="https://github.com/user-attachments/assets/154e5a7c-7dbb-4b1f-bbd6-03b89d68fd09" />

**Busca e especificações**

<img width="360" alt="Tela de busca de veículos" src="https://github.com/user-attachments/assets/e5f61fc9-32c8-459c-b57d-6f603c36fac2" />

**Comparação**

<img width="360" alt="Tela de comparação de veículos" src="https://github.com/user-attachments/assets/7331cf7c-43b7-4e72-a5a5-57976329719e" />

**Histórico**

<img width="360" alt="Tela de histórico de buscas" src="https://github.com/user-attachments/assets/05d424e9-a4ae-41d1-a18e-b5d1a8d4156b" />

### Vídeo do APK instalado

**Vídeo de demonstração:** adicione aqui o link após publicar a gravação. Mostre login, listagem, busca, comparação e histórico. A gravação pode usar a conta de demonstração `admin`; não é necessário mostrar a senha sendo digitada.

## Executar o código-fonte

### Pré-requisitos

- Node.js e npm compatíveis com a versão do Expo indicada em `package.json`;
- Aplicativo Expo Go compatível com o SDK do projeto, caso queira testar em dispositivo sem gerar um APK;
- Acesso à internet para consultar a API hospedada.

### Passo a passo

```bash
git clone https://github.com/AliAndrea1/fiap-mdi-sprint-autoinsight.git
cd fiap-mdi-sprint-autoinsight
npm install
npx expo start
```

Abra o projeto no Expo Go pelo QR code mostrado no terminal. Durante o uso do Expo Go, o celular precisa alcançar o servidor de desenvolvimento do computador. Para executar o APK instalado, esse servidor não é necessário.

A URL da API está definida em `app/login.tsx` e `services/vehicleService.ts`:

```ts
const API_URL = 'https://sprint-soa-ford-production.up.railway.app/api';
```

Para executar com uma API diferente, atualize os dois arquivos antes de gerar outro build. A documentação interativa da API está em [Swagger / OpenAPI](https://sprint-soa-ford-production.up.railway.app/swagger-ui.html). O caminho `/api` é apenas o prefixo dos endpoints e não exibe uma página no navegador.

### Credenciais de demonstração

| Usuário | Senha | Perfil |
|---|---|---|
| `admin` | `admin123` | `ADMIN` |
| `analyst` | `analyst123` | `ANALYST` |

Essas contas fazem parte da configuração de demonstração da API. O perfil `ANALYST` pode consultar informações, enquanto alterações administrativas exigem `ADMIN`.

## Gerar um novo APK

O arquivo `eas.json` define o perfil `preview` com `android.buildType` igual a `apk`. Com uma conta Expo autenticada, execute na raiz do projeto:

```bash
npx eas-cli@latest build --platform android --profile preview
```

Ao final, o EAS Build disponibiliza um link para instalar o APK em dispositivo Android. Para uma nova versão, confirme que a URL da API e as demais alterações já estão salvas antes de iniciar o build.

## Decisões técnicas

| Tecnologia | Uso |
|---|---|
| React Native e Expo | Interface e build Android |
| Expo Router | Navegação entre telas |
| TypeScript | Tipagem do código |
| Axios | Requisições à API |
| AsyncStorage | Persistência local do token e dos dados básicos da sessão |
| EAS Build | Geração do APK instalável |

O serviço em `services/vehicleService.ts` centraliza as chamadas de veículos e histórico e adiciona o JWT às requisições protegidas. A tela de login obtém e armazena o token após a autenticação.

### Estrutura principal

```text
app/
├── (tabs)/
│   ├── index.tsx       # Tela inicial
│   ├── search.tsx      # Busca
│   ├── compare.tsx     # Comparação
│   ├── history.tsx     # Histórico
│   └── _layout.tsx     # Navegação entre abas
├── index.tsx           # Entrada e redirecionamento
├── login.tsx           # Login
└── _layout.tsx         # Layout raiz
components/            # Componentes reutilizáveis
constants/theme.ts      # Cores, tipografia e espaçamentos
services/vehicleService.ts
eas.json                # Perfil de build do APK
```

## Links

- [Repositório da API](https://github.com/AliAndrea1/Sprint-Soa-Ford)
- [Swagger da API publicada](https://sprint-soa-ford-production.up.railway.app/swagger-ui.html)
- [Build do APK](https://expo.dev/accounts/aliandrea/projects/autoinsight/builds/36dcb7f3-991d-4539-9449-e1fc4ab4d321)
