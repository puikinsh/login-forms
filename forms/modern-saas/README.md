# Modern SaaS Login Form

*Created by [Aigars Silkalns](https://github.com/puikinsh/) for [Colorlib](https://colorlib.com)*

A sleek, Stripe-inspired login form featuring modern SaaS design principles, floating labels with border animations, and clean aesthetics with minimal code complexity.

## Features

- **Stripe-Inspired Design**: Professional purple theme with clean, modern aesthetics
- **Floating Labels**: Smooth label animations with custom border effects
- **Minimal Code**: Efficient implementation focusing on core functionality
- **SaaS-Ready**: Perfect for software-as-a-service platforms and dashboards
- **Border Animations**: Custom animated borders on input focus
- **Social Authentication**: Google and GitHub sign-in options
- **Responsive Design**: Works seamlessly across all devices
- **Professional Polish**: Enterprise-grade design suitable for business applications

## Files

- `index.html` - Clean HTML structure with modern input patterns
- `style.css` - Complete self-contained CSS with floating label implementation
- `script.js` - Minimal JavaScript for smooth form interactions
- `README.md` - This documentation

## Dependencies

- `../../shared/js/form-utils.js` - Shared form utilities (validation, animations)

## Usage

1. Copy the entire `modern-saas/` folder to your project
2. The form is completely self-contained with all CSS included
3. Only dependency is the shared JavaScript utilities
4. Customize the purple accent colors to match your brand
5. Perfect for SaaS platforms, dashboards, and modern web applications
6. Integrate with your authentication system

## Customization

### Color Palette
```css
/* Primary Colors */
--stripe-purple: #635BFF;      /* Main accent color */
--stripe-purple-dark: #4c44d4; /* Hover state */
--text-primary: #1a1f36;       /* Primary text */
--text-secondary: #6b7385;     /* Secondary text */
--text-muted: #8792a2;         /* Muted text */
--background: #fafbfc;         /* Page background */
--card-bg: #ffffff;            /* Card background */
--border-color: #e3e8ee;       /* Default borders */
--border-active: #635BFF;      /* Active border */
--error-red: #f56565;          /* Error states */
```

### Typography
- **Font Stack**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Weights**: 400 (regular), 500 (medium), 600 (semibold)
- **Sizes**: 12px-24px range with consistent hierarchy
- **Letter Spacing**: -0.02em for headings for modern feel

### Visual Effects
- **Border Radius**: 6px for inputs and buttons, 12px for card
- **Shadows**: Subtle multi-layer shadows for depth
- **Transitions**: 0.2s ease for all interactive elements
- **Focus States**: Purple accent with animated border effect
- **Floating Labels**: Smooth transitions with background cutouts

## Design Philosophy

Inspired by modern SaaS platforms like Stripe:
- **Clean Minimalism**: Focused design without unnecessary elements
- **Professional Aesthetics**: Enterprise-ready with attention to detail
- **User Experience**: Intuitive interactions and clear visual feedback
- **Modern Standards**: Current design trends with lasting appeal
- **Performance First**: Lightweight and fast-loading implementation
- **Developer Friendly**: Clean, maintainable code structure

## Interactive Elements

- **Floating Labels**: Smooth label animations with background cutouts
- **Border Animations**: Custom animated borders on input focus
- **Button Hovers**: Professional lift effect with enhanced shadows
- **Password Toggle**: Clean eye icon with color transitions
- **Loading States**: Animated SVG spinner for form submission
- **Success Display**: Confident checkmark with pop animation
- **Social Buttons**: Clean hover states with subtle feedback

## Technical Features

- **Pure CSS**: No external frameworks or preprocessors
- **Vanilla JavaScript**: Minimal dependencies for core functionality
- **Mobile-First**: Responsive design optimized for all devices
- **Performance Optimized**: Efficient CSS and minimal DOM manipulation
- **Copy-Paste Ready**: Easy integration into existing projects
- **Cross-Browser**: Excellent compatibility with modern browsers
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Perfect For

- **SaaS Platforms**: Software-as-a-service applications and dashboards
- **Business Applications**: CRM, project management, productivity tools
- **Developer Tools**: API platforms, code repositories, development services
- **Fintech Applications**: Payment processors, financial dashboards
- **E-commerce Platforms**: Online stores, marketplace applications
- **Startup Applications**: Modern web apps requiring professional appearance
- **Enterprise Software**: Internal tools, admin panels, management systems
- **Creative Platforms**: Design tools, collaboration software

## Browser Support

- Chrome 88+ (recommended for optimal animations)
- Firefox 103+ (full support with all features)
- Safari 15.4+ (full support including floating labels)
- Edge 88+ (full support with modern features)

Excellent cross-browser compatibility with consistent professional appearance.

## Accessibility Features

- **WCAG 2.1 Compliant**: Meets accessibility guidelines for web applications
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Friendly**: Semantic HTML with proper ARIA labels
- **High Contrast**: Excellent readability meeting accessibility standards
- **Focus Management**: Clear visual focus indicators throughout
- **Error Messaging**: Descriptive, helpful error feedback
- **Touch-Friendly**: Appropriate touch targets for mobile devices
- **Label Associations**: Proper form field labeling for assistive technology

## Performance Metrics

- **CSS Size**: ~8.2KB (efficient and well-organized)
- **JavaScript Size**: ~3.2KB (minimal, focused functionality)
- **Load Time**: Instant rendering with system fonts
- **Animations**: Hardware-accelerated transforms and transitions
- **Memory Usage**: Minimal DOM manipulation and event handling

## Floating Label Implementation

Advanced floating labels with border animations:
- Labels start positioned over input fields
- Smooth transitions to top position on focus/input
- Background cutouts prevent overlap with borders
- Custom animated borders for focus states
- Pure CSS implementation with no JavaScript required
- Fully accessible with proper form associations

## SaaS Design Principles

- **Trustworthy Appearance**: Professional design that conveys reliability
- **User-Centric**: Intuitive interactions and clear visual hierarchy
- **Scalable Design**: Consistent patterns for larger applications
- **Brand Flexibility**: Easy to customize colors and styling
- **Modern Standards**: Current design trends without being trendy

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
