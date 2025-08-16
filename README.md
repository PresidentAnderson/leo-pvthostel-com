# Leo PVT Hostel Montreal - Official Website

A modern, responsive website for Leo PVT Hostel in Montreal, built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Functionality
- **Responsive Design**: Mobile-first approach with full responsiveness across all devices
- **Multi-language Support**: English and French language options
- **Real-time Booking Widget**: Interactive booking system with availability checking
- **Room Showcase**: Detailed room presentations with image galleries and amenities
- **Location Integration**: Interactive maps and nearby attractions
- **Customer Testimonials**: Dynamic testimonial carousel with ratings
- **FAQ Section**: Expandable FAQ with common questions
- **Contact Forms**: Multiple contact options with email integration

### Technical Features
- **Next.js 14 App Router**: Latest Next.js features for optimal performance
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS with custom design system
- **Analytics Integration**: GA4, GTM, Facebook Pixel, and Microsoft Clarity
- **SEO Optimized**: Meta tags, Open Graph, structured data
- **Performance**: Image optimization, lazy loading, code splitting
- **Security**: HTTPS, security headers, input validation
- **Accessibility**: WCAG 2.1 compliant

## 📁 Project Structure

```
leo.pvthostel.com/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx       # Root layout with providers
│   │   ├── page.tsx         # Homepage
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── Analytics.tsx    # Analytics tracking setup
│   │   ├── Header.tsx       # Navigation header
│   │   ├── Footer.tsx       # Site footer
│   │   ├── Hero.tsx         # Hero section with carousel
│   │   ├── BookingWidget.tsx# Booking search widget
│   │   ├── RoomShowcase.tsx # Room display grid
│   │   ├── Amenities.tsx    # Amenities listing
│   │   ├── Location.tsx     # Map and location info
│   │   ├── Testimonials.tsx # Guest reviews carousel
│   │   ├── FAQ.tsx          # Frequently asked questions
│   │   └── CTA.tsx          # Call-to-action section
│   ├── lib/                 # Utility libraries
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Helper functions
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── clickup-integration.js   # ClickUp project management
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🛠 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/leo-pvthostel.git
cd leo-pvthostel
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your actual values:
- Analytics IDs (GA4, GTM, Facebook Pixel, Clarity)
- Email service credentials
- API keys

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📊 ClickUp Integration

The project includes a comprehensive ClickUp integration for project management:

1. **Setup ClickUp workspace**
```bash
npm run clickup:setup
```

This creates:
- Project space with folders
- Development, Content, and Testing lists
- Custom fields for tracking
- Pre-populated tasks

2. **Sync with ClickUp**
```bash
npm run clickup:sync
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy to production**
```bash
npm run deploy
```

3. **Preview deployment**
```bash
npm run deploy:preview
```

### Manual Deployment

1. **Build the application**
```bash
npm run build
```

2. **Start production server**
```bash
npm run start
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run clickup:setup` - Setup ClickUp project
- `npm run deploy` - Deploy to Vercel

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to modify the color palette:
- Primary: Blue shades for main branding
- Secondary: Purple shades for accents
- Accent: Yellow shades for highlights

### Fonts
The site uses:
- Inter for body text
- Poppins for headings

### Content
All text content is in the component files and can be easily modified.

## 📈 Analytics Setup

### Google Analytics 4
1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Add measurement ID to `NEXT_PUBLIC_GA4_ID`

### Google Tag Manager
1. Create GTM container at [tagmanager.google.com](https://tagmanager.google.com)
2. Add container ID to `NEXT_PUBLIC_GTM_ID`

### Facebook Pixel
1. Create pixel at [business.facebook.com](https://business.facebook.com)
2. Add pixel ID to `NEXT_PUBLIC_FB_PIXEL_ID`

### Microsoft Clarity
1. Create project at [clarity.microsoft.com](https://clarity.microsoft.com)
2. Add project ID to `NEXT_PUBLIC_CLARITY_ID`

## 🔒 Security Features

- HTTPS enforcement
- Security headers (HSTS, CSP, etc.)
- Input validation and sanitization
- Rate limiting on API routes
- Environment variable protection
- XSS protection

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus indicators

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential. All rights reserved by PVT Hostel.

## 📞 Support

For support, email: support@leo.pvthostel.com

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Tailwind CSS for the utility-first CSS framework
- All contributors and testers

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready