This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Bajaj Auto OND UI - Azure Web App Deployment

This Next.js application is configured for deployment to Azure Web App on Windows.

## Project Structure

- **Next.js 14.2.30** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Dynamic routing** for SMS links (`/home/[id]`)
- **API routes** for backend integration
- **Custom server** for Azure Web App compatibility

## Local Development

```bash
npm install
npm run dev
```

## Azure Web App Deployment

### Prerequisites

1. **Azure Web App** (Windows-based)
2. **GitHub Secrets** configured:
   - `AZURE_WEBAPP_NAME`: Your Azure Web App name
   - `AZUREAPPSERVICE_PUBLISHPROFILE`: Download from Azure Portal

### Deployment Process

1. **Push to main/master branch** triggers automatic deployment
2. **GitHub Actions** builds and deploys the application
3. **Web.config** handles IIS routing for Windows hosting
4. **Server.js** provides custom Next.js server

### Azure Web App Configuration

In Azure Portal, configure:

1. **Application Settings:**
   - `WEBSITE_NODE_DEFAULT_VERSION`: 18-lts
   - `NODE_ENV`: production

2. **Startup Command:**
   ```
   node server.js
   ```

3. **Node.js Version:** 18 LTS

### Key Files for Azure Deployment

- `server.js` - Custom Next.js server for Azure
- `web.config` - IIS configuration for Windows hosting
- `package.json` - Start script points to server.js
- `.github/workflows/azure-webapp-deploy.yml` - CI/CD pipeline

## Features

- ✅ Dynamic SMS link handling (`/home/[id]?code=xyz`)
- ✅ OTP verification flow
- ✅ Document upload interface
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Session management
- ✅ API route proxying

## Environment Variables

Set these in Azure Web App Application Settings:

```bash
NODE_ENV=production
WEBSITE_NODE_DEFAULT_VERSION=18-lts
```

## Troubleshooting

### Common Issues

1. **Build Errors**: Check Node.js version (18.x required)
2. **Routing Issues**: Verify web.config is deployed
3. **API Calls**: Ensure external API endpoints are accessible
4. **Static Assets**: Check public folder deployment

### Logs

Access logs in Azure Portal:
- **Log Stream**: Real-time application logs
- **Application Insights**: Performance monitoring
- **Diagnostics**: Advanced troubleshooting

## SMS Link Format

The application expects SMS links in this format:
```
https://your-app.azurewebsites.net/home/[requestId]&code=[verificationCode]
```

Example:
```
https://your-app.azurewebsites.net/home/abc123&code=xyz789
```
