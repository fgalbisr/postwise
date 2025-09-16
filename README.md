# PostWise - AI-Powered Ad Optimization

PostWise is an intelligent platform that analyzes Google Ads and Meta Ads performance data to provide AI-powered insights, recommendations, and automated optimizations.

## Features

- **AI Diagnosis**: Comprehensive analysis of campaign performance with intelligent insights
- **Smart Recommendations**: Actionable recommendations for budget redistribution and optimizations
- **Automated Actions**: Dry-run simulations before applying real changes to campaigns
- **Multi-Platform Support**: Google Ads and Meta Ads integration
- **Real-time Analytics**: Live KPI tracking and performance monitoring

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Prisma + SQLite
- **AI**: OpenAI GPT-3.5-turbo
- **UI Components**: Lucide React, Sonner (toasts)
- **Forms**: React Hook Form + Zod validation
- **CSV Processing**: PapaParse

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd postwise
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key

   # Database
   DATABASE_URL="file:./dev.db"

   # Next.js
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Configuration

### Clerk Setup

1. Create a new Clerk application at [clerk.com](https://clerk.com)
2. Copy your publishable key and secret key to `.env.local`
3. Configure the redirect URLs in your Clerk dashboard:
   - Sign-in URL: `http://localhost:3000`
   - Sign-up URL: `http://localhost:3000`
   - After sign-in URL: `http://localhost:3000/dashboard`
   - After sign-up URL: `http://localhost:3000/dashboard`

### OpenAI Setup

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` file

## Usage

### 1. Upload Campaign Data

- Navigate to the Dashboard
- Use the CSV Uploader to upload Google Ads or Meta Ads data
- The system will automatically parse and normalize the data

### 2. Set Goals

- Define your campaign objectives (CPL, ROAS, or Budget targets)
- The AI will use these goals to generate relevant recommendations

### 3. Review Recommendations

- View AI-generated recommendations in the Recommendations tab
- Adjust the aggressiveness slider to control recommendation intensity
- Accept or reject recommendations based on your strategy

### 4. Execute Actions

- Review pending actions in the Actions tab
- Use the simulation feature to preview changes
- Execute actions when ready (currently in dry-run mode)

## API Endpoints

- `POST /api/ingest` - Upload and process CSV data
- `GET /api/diagnose` - Get campaign performance KPIs
- `GET /api/recommend` - Generate AI recommendations
- `POST /api/execute` - Execute campaign actions
- `GET /api/actions` - List all actions
- `GET /api/waste` - Get budget waste analysis

## Database Schema

The application uses the following main entities:

- **Account**: Platform accounts (Google, Meta)
- **Dataset**: Uploaded campaign data sets
- **MetricRow**: Individual performance metrics
- **Goal**: Campaign objectives and targets
- **Recommendation**: AI-generated optimization suggestions
- **Action**: Executable campaign modifications
- **AuditLog**: Action execution history

## Development

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Seed with sample data
npm run db:seed

# Full database setup
npm run db:setup
```

### Project Structure

```
postwise/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
└── scripts/               # Setup and utility scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.