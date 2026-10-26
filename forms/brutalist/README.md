# Modern Brutalist Login Form

*Created by [Aigars Silkalns](https://github.com/puikinsh/) for [Colorlib](https://colorlib.com)*

A clean, modern take on brutalist design principles featuring sharp edges, bold typography, and strong contrast without overwhelming aggressive effects.

## Features

- **Modern Brutalist Aesthetics**: Clean black and white design with sharp edges
- **High Contrast**: Strong black borders and typography on white backgrounds
- **Bold Typography**: Arial font with heavy weights and uppercase styling
- **Sharp Edges**: Angular design with clean geometric shapes
- **Subtle Interactions**: Smooth hover effects and gentle transitions
- **Professional Appeal**: Modern and approachable while maintaining brutalist principles
- **Clean Interface**: Simplified design focused on usability
- **Strong Visual Impact**: Makes a statement without being overwhelming
- **Responsive Design**: Works seamlessly across all devices

## Files

- `index.html` - Main form HTML structure with modern brutalist elements
- `style.css` - Complete self-contained CSS with clean brutalist styling
- `script.js` - Modern form interactions with subtle effects
- `README.md` - This documentation

## Dependencies

- `../../shared/js/form-utils.js` - Shared form utilities (validation, animations)

## Usage

1. Copy the entire `brutalist/` folder to your project
2. The form is completely self-contained with all CSS included
3. Only dependency is the shared JavaScript utilities
4. Customize colors and typography in the modern brutalist palette
5. Perfect for brands that want a strong, professional presence
6. Integrate with your authentication system

## Customization

### Modern Brutalist Color Palette
```css
/* Primary Colors */
--primary-black: #000000;     /* Strong black borders and text */
--primary-white: #ffffff;     /* Clean white backgrounds */
--background-gray: #f5f5f5;   /* Subtle light gray background */
--error-red: #dc3545;         /* Error state color */
--text-gray: #666666;         /* Secondary text */
```

### Modern Typography
- **Font Family**: Arial, sans-serif (clean and readable)
- **Font Weights**: 600-900 (strong but not overwhelming)
- **Text Transform**: Strategic use of uppercase for impact
- **Letter Spacing**: Balanced spacing for readability
- **Line Height**: Comfortable reading experience

### Visual Effects
- **Sharp Box Shadows**: Clean offset shadows (8px 8px 0)
- **Hover Animations**: Subtle translate and shadow changes
- **Focus States**: Clean border highlighting
- **Button Interactions**: Simple scale and shadow effects
- **Error Handling**: Gentle shake animations

## Design Philosophy

This modern approach maintains brutalist principles while ensuring usability:
- **Strong Contrast**: Black and white for clarity
- **Clean Typography**: Bold without being aggressive
- **Geometric Shapes**: Sharp edges with clean lines
- **Functional Design**: Every element serves a purpose
- **Professional Appeal**: Business-appropriate brutalism
- **User-Friendly**: Accessible and intuitive interactions

## Interactive Elements

- **Card Hover Effects**: Subtle lift and shadow enhancement
- **Input Focus States**: Clean border and shadow changes
- **Button Interactions**: Professional hover and active states
- **Password Toggle**: Simple show/hide functionality
- **Form Validation**: Clear error messaging with smooth animations
- **Loading States**: Clean spinner animations
- **Success Display**: Elegant success confirmation

## Modern Brutalist Principles

- **Honest Design**: Clear structure and honest presentation
- **Functional Beauty**: Aesthetics serve usability
- **Strong Geometry**: Clean lines and sharp angles
- **High Contrast**: Excellent readability and accessibility
- **Minimal Decoration**: Focus on content and function
- **Professional Impact**: Makes a statement while remaining approachable

## Browser Support

- Chrome 88+ (recommended)
- Firefox 103+ (full support)
- Safari 15.4+ (full support)
- Edge 88+ (full support)

Excellent cross-browser compatibility with consistent visual appearance.

## Perfect For

- **Corporate Applications**: Professional yet distinctive
- **SaaS Platforms**: Clean, trustworthy design
- **Tech Startups**: Modern and innovative appearance
- **Developer Tools**: Technical aesthetic without overwhelming users
- **B2B Applications**: Strong, confident branding
- **Financial Services**: Clean, secure appearance
- **Consulting Firms**: Professional and authoritative
- **Design Agencies**: Showcases design awareness
- **E-learning Platforms**: Clear, focused interface
- **Project Management Tools**: Functional and efficient

## Accessibility Features

- **High Contrast**: Excellent readability for all users
- **Keyboard Navigation**: Full keyboard accessibility support
- **Screen Reader Friendly**: Semantic HTML structure
- **ARIA Labels**: Proper accessibility annotations
- **Focus Indicators**: Clear visual focus states
- **Error Messaging**: Clear, descriptive error feedback
- **Responsive Design**: Works across all device sizes
- **Touch-Friendly**: Appropriate touch targets on mobile

## Technical Features

- **Pure CSS**: No JavaScript dependencies for styling
- **Self-Contained**: All styles included in single CSS file
- **Mobile-First**: Responsive design approach
- **Performance Optimized**: Minimal CSS and efficient selectors
- **Copy-Paste Ready**: Easy to integrate into existing projects
- **Cross-Browser**: Consistent appearance across browsers

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
