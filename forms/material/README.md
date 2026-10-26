# Material Design Login Form

*Created by [Aigars Silkalns](https://github.com/puikinsh/) for [Colorlib](https://colorlib.com)*

A professional login form following Google's Material Design principles with elevation, motion, and ripple effects.

## Features

- **Material Design Guidelines**: Follows Google's official design system
- **Elevation & Shadows**: Proper material elevation with realistic shadows
- **Ripple Effects**: Interactive ripple animations on all touch points
- **Material Motion**: Smooth transitions following Material Design timing
- **Floating Labels**: Material-style floating input labels
- **Material Colors**: Official Material Design color palette
- **Typography**: Roboto font with proper Material Design typography scale
- **Material Icons**: Integrated SVG icons following Material Design
- **Responsive**: Optimized for Material Design responsive breakpoints

## Files

- `index.html` - Main form HTML structure with Material components
- `style.css` - Complete self-contained CSS with Material Design system
- `script.js` - Advanced Material interactions with ripple effects
- `README.md` - This documentation

## Dependencies

- `../../shared/js/form-utils.js` - Shared form utilities (validation, animations)

## Usage

1. Copy the entire `material/` folder to your project
2. The form is completely self-contained with all CSS included
3. Only dependency is the shared JavaScript utilities
4. Customize colors using Material Design color palette
5. All ripple effects and animations are built-in
6. Integrate with your authentication system

## Customization

### Material Design Colors
- Primary: `#1976d2` (Material Blue 700)
- Primary Variant: `#1565c0` (Material Blue 800)
- Error: `#d32f2f` (Material Red 700)
- Success: `#4caf50` (Material Green 500)
- Surface: `#ffffff` (White)
- Background: `#fafafa` (Material Grey 50)

### Material Elevation
The form uses Material Design elevation levels:
- Card elevation: 2dp (resting state), 8dp (hover state)
- Button elevation: 2dp (resting), 4dp (hover), 1dp (pressed)
- Success dialog: 8dp elevation

### Material Motion
- Duration: Follows Material Design motion guidelines
- Easing: Uses Material cubic-bezier curves
- Ripple effects: 600ms duration with proper scaling

## Material Design Features

- **Ripple Effects**: All interactive elements have Material ripples
- **Floating Action Button**: Primary action with proper elevation
- **Material Cards**: Proper elevation and rounded corners
- **Input Fields**: Material-style underlined inputs with floating labels
- **Checkbox**: Material checkbox with animated check mark
- **Typography**: Roboto font with Material Design type scale

## Interactive Elements

- Input focus states with ripple effects
- Button press states with elevation changes
- Checkbox interactions with ripple feedback
- Password toggle with Material icon transitions
- Social login buttons with Material design patterns

## Material Guidelines Compliance

- Follows Material Design 3 specifications
- Proper spacing using 8dp grid system
- Correct typography scale and hierarchy
- Appropriate color contrast ratios
- Touch target sizes (48dp minimum)
- Material motion and timing curves

## Browser Support

- Chrome 88+ (recommended for best Material effects)
- Firefox 103+
- Safari 15.4+
- Edge 88+

Optimized for modern browsers with full CSS support for shadows, transitions, and animations.

## Perfect For

- Google-style applications
- Android-inspired web apps
- Enterprise applications following Material Design
- Progressive Web Apps (PWAs)
- Applications requiring consistent Material UI
- Projects already using Material Design components
- Google Workspace integrations
- Android companion web apps

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
