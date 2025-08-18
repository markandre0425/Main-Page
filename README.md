# Fire Safety Adventure

An interactive educational platform designed to teach fire safety concepts through engaging mini-games, quizzes, and educational content.

## Overview

Fire Safety Adventure is an interactive educational platform designed to teach fire safety concepts through engaging mini-games, quizzes, and educational content. The application targets various age groups with age-appropriate content and features a progression system to track learning achievements.

## Technical Architecture

### Frontend

- **Framework**: React with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query for server state, React Context for application state
- **Styling**: Tailwind CSS with custom theme variables
- **UI Components**: Custom components built on Radix UI primitives
- **Animations**: Motion library for interactive animations

### Backend

- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication
- **Development**: Vite for fast development and building

## Key Features

### User System

- **User Profiles**: Personalized accounts with progress tracking
- **Age-Appropriate Content**: Content filtering based on user age groups
- **Admin Dashboard**: Administrative tools for content management

### Educational Content

- **Mini-Games**:
  - Fire Extinguisher Simulator
  - Hazard Identification Game
  - Escape Plan Designer
  - Fire Safety Quiz

- **Interactive Learning**:
  - Scenario-based simulations
  - Home inspection activities
  - Educational stories and videos

### Progression System

- **Achievements**: Badge system with tiered rewards
- **Progress Tracking**: Visual progress map
- **Points and Levels**: Gamified learning incentives

### Accessibility Features

- **Screen Reader Support**: Comprehensive descriptions and navigation cues
- **Color Schemes**: High contrast and colorblind-friendly options
- **Text Customization**: Adjustable text sizes and dyslexia-friendly fonts

## Performance Optimizations

- **Asset Preloading**: Critical assets loaded first
- **Caching Strategy**: Local storage for game state, IndexedDB for assets
- **Progressive Loading**: Core functionality loaded first, with deferred loading of advanced features
- **Responsive Design**: Mobile-first approach with breakpoint-based adaptations

## Development Setup

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install packaga.json
   ```
3. Set up environment variables:
   - `DATABASE_URL`: PostgreSQL connection string

### Running the Application

#### Development Mode

```
npm run dev
```

The server will automatically find an available port starting from 5000 if the default port is unavailable.

#### Production Build

```
npm run build
npm run start
```

## API Endpoints

The application provides RESTful API endpoints for:

- User authentication and profile management
- Progress tracking and achievement updates
- Educational content delivery
- Game state persistence

## Deployment Considerations

- **Database**: Ensure PostgreSQL is properly configured
- **Static Assets**: Optimize and compress for production
- **Environment Variables**: Configure for production environment
- **Port Configuration**: The application automatically finds an available port if 5000 is unavailable

## Future Development Roadmap

Based on the project plan, upcoming features include:

1. **Phase 3**: Multiple user profiles and household challenges
2. **Phase 4**: Enhanced educational content with interactive stories
3. **Phase 5**: Offline mode and accessibility improvements
4. **Phase 6**: Social features and school integration

## Troubleshooting

- **Port Conflicts**: The application automatically finds an available port if 5000 is in use
- **Database Connection Issues**: Verify DATABASE_URL environment variable
- **Build Errors**: Ensure all dependencies are installed correctly

## Contributing

Follow the established code structure and patterns when adding new features:
- Place React components in `client/src/components`
- Add new pages in `client/src/pages`
- Implement shared types in `shared` directory
- Add server endpoints in `server/routes`