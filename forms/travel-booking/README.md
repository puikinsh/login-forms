# Travel Booking Login Form

*Created by [Aigars Silkalns](https://github.com/puikinsh/) for [Colorlib](https://colorlib.com)*

A clean, travel-focused login form inspired by modern booking platforms like Snaptrip, featuring floating labels, smooth animations, and a professional blue color scheme with minimal code complexity.

## Features

- **Travel Platform Design**: Professional blue theme perfect for booking and travel sites
- **Floating Labels**: Modern material design-inspired floating label inputs
- **Minimal Code**: Clean, efficient CSS and JavaScript without over-engineering
- **Smooth Animations**: Subtle transitions and micro-interactions
- **Professional Aesthetics**: Corporate-friendly design suitable for business applications
- **Social Authentication**: Google and Facebook sign-in options
- **Responsive Design**: Works seamlessly across all devices
- **Clean Typography**: System fonts optimized for readability
- **Intuitive UX**: User-friendly interactions and clear visual feedback

## Files

- `index.html` - Clean HTML structure with semantic markup and accessibility features
- `style.css` - Complete self-contained CSS with floating label implementation
- `script.js` - Minimal JavaScript for form interactions and validation
- `README.md` - This documentation

## Dependencies

- `../../shared/js/form-utils.js` - Shared form utilities (validation, animations)

## Usage

1. Copy the entire `travel-booking/` folder to your project
2. The form is completely self-contained with all CSS included
3. Only dependency is the shared JavaScript utilities
4. Customize the blue accent colors to match your brand
5. Perfect for travel booking sites, business applications, and professional platforms
6. Integrate with your authentication system

## Customization

### Color Palette
```css
/* Primary Colors */
--primary-blue: #0066CC;       /* Main accent color */
--primary-blue-hover: #0052a3; /* Hover state */
--primary-blue-light: #4A90E2; /* Light accent */
--text-primary: #1a1a1a;       /* Primary text */
--text-secondary: #6b7280;     /* Secondary text */
--text-muted: #9ca3af;         /* Muted text */
--background: #ffffff;         /* Card background */
--input-bg: #f8fafc;          /* Input background */
--border-color: #e2e8f0;       /* Default borders */
--error-red: #dc2626;          /* Error states */
```

### Typography
- **Font Stack**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Sizes**: 12px-30px range with consistent hierarchy
- **Letter Spacing**: -0.025em for headings for modern feel

### Visual Effects
- **Border Radius**: 12px for inputs and buttons, 20px for card
- **Shadows**: Soft elevation with 0 20px 40px rgba(0,0,0,0.1)
- **Transitions**: 0.2s ease for all interactive elements
- **Focus States**: Blue accent with subtle glow and floating labels
- **Floating Labels**: Smooth transition animation on focus/input

## Design Philosophy

Inspired by modern travel booking platforms:
- **Professional Appearance**: Clean, trustworthy design for business use
- **User-Friendly**: Intuitive floating labels and clear visual hierarchy
- **Minimal Complexity**: Efficient code without unnecessary features
- **Modern Standards**: Current design trends with timeless appeal
- **Accessibility First**: High contrast, keyboard navigation, screen reader support
- **Performance Focused**: Lightweight and fast-loading

## Interactive Elements

- **Floating Labels**: Smooth label animations on input focus
- **Button Hovers**: Subtle lift effect with shadow enhancement
- **Input Focus States**: Blue accent border with soft glow effect
- **Password Toggle**: Simple eye icon with scale animation
- **Loading States**: Animated circular progress indicator
- **Success Display**: Bouncing checkmark with fade-in effect
- **Social Buttons**: Clean hover states with border color changes

## Technical Features

- **Pure CSS**: No CSS frameworks or preprocessors required
- **Vanilla JavaScript**: No external libraries for functionality
- **Mobile-First**: Responsive design approach with mobile optimization
- **Performance Optimized**: Minimal CSS and efficient selectors
- **Copy-Paste Ready**: Easy integration into existing projects
- **Cross-Browser**: Excellent compatibility with modern browsers
- **Semantic HTML**: Proper structure for accessibility and SEO

## Perfect For

- **Travel Booking Sites**: Flight booking, hotel reservations, travel packages
- **Business Applications**: CRM systems, project management tools
- **Financial Services**: Banking apps, investment platforms, fintech
- **E-commerce Platforms**: Online stores, marketplace applications
- **SaaS Applications**: Business software, productivity tools
- **Corporate Websites**: Company portals, employee dashboards
- **Professional Services**: Consulting firms, agencies, service providers
- **Educational Platforms**: Learning management systems, course platforms

## Browser Support

- Chrome 88+ (recommended for best experience)
- Firefox 103+ (full support with all features)
- Safari 15.4+ (full support including floating labels)
- Edge 88+ (full support with modern features)

Excellent cross-browser compatibility with consistent visual appearance.

## Accessibility Features

- **WCAG Compliant**: Meets accessibility guidelines for contrast and usability
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Friendly**: Semantic HTML with proper ARIA labels
- **Focus Management**: Clear visual focus indicators throughout
- **Error Messaging**: Descriptive error feedback with proper associations
- **Touch-Friendly**: Appropriate touch targets (minimum 44px)
- **High Contrast**: Excellent readability in all lighting conditions

## Performance Metrics

- **CSS Size**: ~9KB (efficient and well-organized)
- **JavaScript Size**: ~3.5KB (minimal functionality)
- **Load Time**: Instant rendering with system fonts
- **Animations**: Hardware-accelerated transforms only
- **Memory Usage**: Minimal DOM manipulation and event handling

## Floating Label Implementation

The floating labels are implemented with pure CSS:
- Labels start positioned over the input field
- On focus or when input has value, labels animate to top position
- Smooth transitions create professional user experience
- No JavaScript required for label functionality
- Fully accessible with proper form associations

## Credits

Created by [Aigars Silkalns](https://github.com/puikinsh/) for [Colorlib](https://colorlib.com).
## Shared behavior and checks

This template uses the shared sign-in behavior: a valid email and a nonempty, unchanged password; keyboard-accessible remember and password controls; associated field errors; and loading/failure/success feedback. Social actions show demo feedback. Sign-up and reset links open matching companion screens. See the root [development and integration guide](../../README.md#development-and-quality-checks) for automated checks and the `authenticate` callback.


## Matching sign-up and reset screens

Open `sign-up.html` to preview account creation, `reset-password.html` to request
reset instructions, or `new-password.html` to preview setting a new password.
These screens reuse this design's CSS and JavaScript. New passwords require at
least 15 characters; spaces and paste are allowed. Sign-in passwords remain unchanged.
All fields have associated validation messages, keyboard controls, loading feedback,
retryable errors, and a focused success result.

These are local demonstrations: no accounts are created, emails sent, passwords
changed, or data saved. Use `error@demo.com` for a sign-up/reset request failure or
`demo-error-password` for a new-password failure. Edit and retry to complete the demo.
Without JavaScript, navigation works and companion submission stays disabled.

For backend integration, see the root [companion-screen guide](../../README.md#matching-sign-up-and-password-reset).
The standalone download includes all four HTML screens and the shared helper.

Validation messages wrap below their controls. Filled labels remain separate from
typed values, including invalid fields, and password visibility preserves control
position and credential case. Tall pages remain vertically scrollable.
