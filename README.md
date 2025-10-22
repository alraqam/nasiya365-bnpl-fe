# Nasiya365 BNPL Frontend

A modern Buy Now, Pay Later (BNPL) admin panel built with Next.js, TypeScript, and Material-UI.

## 🚀 Features

- **Multi-tenant Architecture**: Support for multiple merchant stores
- **Role-based Access Control**: Comprehensive permission system
- **Mobile Support**: Built with Capacitor for iOS and Android
- **Internationalization**: Support for Uzbek and Russian languages
- **Modern UI**: Material-UI components with custom theming
- **Type-Safe**: Built with TypeScript for better developer experience

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn package manager
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nasiya365-bnpl-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   Update the environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
   NEXT_PUBLIC_ENV=development
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run prettify` - Format code with Prettier
- `npm run compile` - Type-check with TypeScript
- `npm run android` - Run on Android (requires Capacitor setup)
- `npm run ios` - Run on iOS (requires Capacitor setup)
- `npm run server` - Start mock JSON server (port 4000)

## 🏗️ Project Structure

```
nasiya365-bnpl-fe/
├── src/
│   ├── @core/               # Core components and utilities
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── layouts/         # Layout components
│   │   ├── styles/          # Global styles
│   │   ├── theme/           # MUI theme configuration
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── components/          # Application-specific components
│   ├── configs/             # Configuration files
│   ├── context/             # Application contexts
│   ├── hooks/               # Application hooks
│   ├── layouts/             # Page layouts
│   ├── locales/             # Translation files
│   ├── navigation/          # Navigation configuration
│   ├── pages/               # Next.js pages
│   └── providers/           # Context providers
├── public/                  # Static assets
├── styles/                  # Global CSS
├── android/                 # Android Capacitor project
├── ios/                     # iOS Capacitor project
└── ...config files
```

## 🔑 Key Technologies

- **Framework**: Next.js 13
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand
- **Forms**: React Hook Form + Yup validation
- **Data Fetching**: Native Fetch API with custom wrapper
- **Mobile**: Capacitor
- **Internationalization**: Custom i18n implementation

## 🔐 Authentication

The application uses JWT token-based authentication:

1. Users log in with email, password, and company subdomain
2. API returns a JWT token
3. Token is stored securely
4. Token is automatically attached to all API requests
5. Automatic logout on 401 responses

## 🌍 Internationalization

The app supports multiple languages (Uzbek and Russian):

```typescript
import { useLang } from 'src/providers/LanguageProvider'

const { t, lang, changeLang } = useLang()

// Use translations
<Typography>{t.welcome}</Typography>

// Change language
changeLang('uz') // or 'ru'
```

## 🎨 Theming

Customize the theme in `src/@core/theme/`:

- Colors: `palette/`
- Typography: `typography/`
- Component overrides: `overrides/`

## 📱 Mobile Development

### Android

```bash
npm run sync
npm run android
```

### iOS

```bash
npm run sync
npm run ios
```

## 🧪 Testing

Testing infrastructure is set up and ready:

```bash
npm test                # Run tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

## 🔒 Security

- Secure token management
- Environment variable validation
- Security headers configured
- Input sanitization
- XSS protection

## 📝 Code Style

The project uses:

- ESLint for linting
- Prettier for formatting
- TypeScript for type safety

Run formatters:
```bash
npm run lint
npm run prettify
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Team

Developed by the Nasiya365 development team.

## 📞 Support

For support, email support@nasiya365.uz or create an issue in the repository.

## 🗺️ Roadmap

- [ ] Unit test coverage
- [ ] E2E testing with Cypress
- [ ] Performance optimizations
- [ ] PWA support
- [ ] Enhanced analytics dashboard
- [ ] Real-time notifications

## ⚙️ Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `https://api.nasiya365.uz` |
| `NEXT_PUBLIC_ENV` | Environment identifier | `development`, `staging`, `production` |

## 🔧 Troubleshooting

### Build Errors

If you encounter build errors:

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

2. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run build
   ```

### Type Errors

Run type checking:
```bash
npm run compile
```

### Capacitor Issues

Sync Capacitor:
```bash
npx cap sync
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Capacitor Documentation](https://capacitorjs.com/docs)

