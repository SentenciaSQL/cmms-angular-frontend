# CMMS Manager - Frontend

Computerized Maintenance Management System (CMMS) built with Angular 21+ and TailAdmin template.

## 🚀 Technologies

- **Angular 21** - Standalone Components
- **TypeScript 5.7**
- **TailAdmin Template** - Tailwind CSS + DaisyUI
- **Angular Signals** - Reactive state management
- **i18n** - Internationalization (EN/ES)

## ✨ Features

- 🔐 JWT Authentication with roles (SUPER_ADMIN, ADMIN, USER, GUEST)
- 📋 Work order and asset management
- 🔧 Preventive and corrective maintenance
- 📦 Inventory and spare parts control
- 🏢 Multi-company support
- 🌐 Fully bilingual interface (English/Spanish)
- 📱 Responsive design

## 📋 Requirements

- Node.js 24+ and npm
- Angular CLI 21+

## 🛠️ Installation
```bash
npm install
```

## ⚙️ Configuration

Configure the backend URL in `src/environments/`:
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## 🎯 Usage
```bash
# Development
ng serve

# Production
ng build --configuration production
```

The application will be available at `http://localhost:4200`

## 📁 Main Structure
```
src/
├── app/
│   ├── core/          # Services, guards, interceptors
│   ├── shared/        # Shared components
│   ├── features/      # Feature modules
│   └── layouts/       # Main layouts
├── assets/
│   └── i18n/         # EN/ES translations
└── environments/
```

## 🔗 Backend

This frontend connects to [CMMS Manager Backend](https://github.com/SentenciaSQL/cmms-api)

## 📝 License

MIT

---

Developed by [@SentenciaSQL](https://github.com/SentenciaSQL)
