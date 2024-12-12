# Birthday Tracking Application

A modern web application built with Next.js for tracking and managing birthdays of friends, family, and colleagues. Never miss a special day again!

![Birthday Tracking App Screenshot](https://i.hizliresim.com/adcxccu.png)

## Features

- 🎨 Modern, responsive UI with animations and effects
- 👤 User authentication system
- 📅 Interactive calendar view
- 🔍 Advanced search and filtering
- 📱 Mobile-friendly design
- 🎯 Multiple category management:
  - Family
  - Friends
  - Colleagues
  - Classmates
  - Relatives
  - Childhood Friends
  - Neighbors
  - Mentors
  - Clients
  - Partners
  - Others

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with modern design
- **Animations**: CSS transitions and Tailwind animations
- **State Management**: React hooks
- **Authentication**: Built-in auth system

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/murathanje/birthday_tracking_frontend.git
cd birthday_tracking_frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure Environment Variables
Create a `.env` file in the project root with the following configuration:
```bash
# API Base URL for backend services
NEXT_PUBLIC_API_BASE_URL=https://your-api-endpoint.com/api/v1
```
Replace `https://your-api-endpoint.com/api/v1` with your actual API base URL.

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Configuration

The application uses environment variables for configuration:

- `NEXT_PUBLIC_API_BASE_URL`: The base URL for all API calls
  - For development: Use your local backend server URL
  - For production: Use your production API endpoint

### Environment Files

- `.env`: Default environment variables

## Project Structure

```
birthday-tracking/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.js
│   │   └── register/
│   │   │   └── page.js
│   ├── components/
│   │   ├── AddNewEvent.js
│   │   ├── Calendar.js
│   │   ├── Header.js
│   │   └── Overview.js
│   ├── contexts/
│   │   ├── AuthContext.js
│   │   └── BirthdayContext.js
│   ├── dashboard/
│   │   ├── layout.js
│   │   └── page.js
│   ├── services/
│   │   ├── api.js
│   │   └── apiService.js
│   ├── globals.css
│   └── page.js
├── public/
│   └── (static assets)
├── .env
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
└── tailwind.config.js
```

### Directory Breakdown

- `app/`: Main application directory
  - `auth/`: Authentication-related pages
  - `components/`: Reusable React components
  - `contexts/`: React context providers for global state
  - `dashboard/`: Dashboard page and layout
  - `services/`: API service and utility functions
  - `globals.css`: Global styling
  - `page.js`: Home/landing page

- `public/`: Static assets like images, icons
- `.env`: Environment configuration file
- `next.config.mjs`: Next.js configuration
- `tailwind.config.js`: Tailwind CSS configuration

### Environment Configuration

- `.env`: Stores environment-specific variables
  - `NEXT_PUBLIC_API_BASE_URL`: Base URL for API calls

### Key Configuration Files

- `package.json`: Project dependencies and scripts
- `postcss.config.mjs`: PostCSS configuration for Tailwind
- `next.config.mjs`: Next.js specific configurations

## Key Features Explained

### Dashboard
- Overview of upcoming birthdays
- Statistical insights
- Quick search and filtering
- Category-based organization

### Calendar View
- Monthly calendar display
- Visual indicators for birthdays
- Easy navigation between months
- Quick edit functionality

### Birthday Management
- Add new birthdays with categories
- Edit existing entries
- Delete outdated entries
- Categorize contacts

### Search and Filter
- Search by name
- Filter by category
- Sort by date
- View upcoming birthdays

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Configure your local `.env` file
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## Security

- Never commit sensitive information like API keys or tokens
- Use environment variables for configuration
- Keep `.env` files out of version control

## License

This project is licensed under the MIT License - see the LICENSE file for details.
