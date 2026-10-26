# Gradient Wave Login Form

*Created by [Aigars Silkalns](https://github.com/puikinsh/) for [Colorlib](https://colorlib.com)*

A mesmerizing login form featuring flowing animated gradients, wave effects, and dynamic particle systems that create an immersive visual experience.

## Features

- **Animated Gradients**: Continuously flowing background gradients
- **Wave Effects**: Multiple layered wave animations throughout the interface
- **Particle System**: Floating particles with dynamic movement
- **Glass Morphism**: Translucent elements with backdrop blur effects
- **Interactive Waves**: Mouse-responsive wave effects and card tilting
- **Ripple Animations**: Touch-responsive ripple effects on interactions
- **Dynamic Lighting**: Ambient lighting effects that respond to user interaction
- **Fluid Transitions**: Smooth, wave-like transitions between states
- **Responsive Design**: Maintains visual effects across all devices

## Files

- `index.html` - Main form HTML structure with wave elements
- `style.css` - Complete self-contained CSS with gradient and wave animations
- `script.js` - Advanced wave interactions and particle effects
- `README.md` - This documentation

## Dependencies

- `../../shared/js/form-utils.js` - Shared form utilities (validation, animations)

## Usage

1. Copy the entire `gradient-wave/` folder to your project
2. The form is completely self-contained with all CSS included
3. Only dependency is the shared JavaScript utilities
4. Customize gradient colors and wave timing in CSS
5. Perfect for creative, modern applications requiring visual impact
6. Integrate with your authentication system

## Customization

### Gradient Color Palette
```css
/* Primary Gradients */
background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c);

/* Wave Colors */
rgba(255,255,255,0.1) /* Light wave overlay */
rgba(255,255,255,0.05) /* Subtle wave overlay */

/* Interactive Elements */
rgba(255,255,255,0.2) /* Button and input backgrounds */
rgba(255,255,255,0.3) /* Focused state backgrounds */
```

### Animation Timing
- **Background Gradient**: 15s infinite flow
- **Wave Layers**: 20s-35s varying speeds
- **Particles**: 15s float cycles
- **Ripples**: 0.6s-0.8s duration
- **Input Waves**: 1s flow animation

### Wave Customization
- **Wave Count**: 4 layered background waves
- **Wave Speed**: Customizable animation duration
- **Wave Opacity**: Adjustable transparency levels
- **Wave Direction**: Forward and reverse options

## Visual Effects

### Background System
- **Flowing Gradients**: 4-color gradient animation
- **Layered Waves**: Multiple wave overlays with different speeds
- **Particle Animation**: 6 floating particles with individual timing
- **Ambient Glow**: Dynamic lighting based on interaction

### Interactive Elements
- **Input Waves**: Flowing wave effects on focus
- **Button Ripples**: Expanding ripple animations on click
- **Card Tilt**: 3D perspective tilt following mouse movement
- **Gradient Checkbox**: Animated gradient fill on selection

### Transition Effects
- **Wave Shake**: Error states with wave-like shake
- **Success Wave**: Full-screen success wave animation
- **Loading Waves**: Vertical wave bars for loading states
- **Social Waves**: Flowing effects on social button hover

## Performance Considerations

- **Hardware Acceleration**: All animations use CSS transforms
- **Optimized Particles**: Minimal DOM manipulation for particles
- **Efficient Gradients**: Uses CSS background-size for smooth animation
- **Debounced Events**: Mouse events optimized for performance

## Browser Support

- Chrome 88+ (recommended for best effects)
- Firefox 103+ (full support)
- Safari 15.4+ (webkit prefixes included)
- Edge 88+ (full support)

Requires modern CSS support for backdrop-filter, gradients, and transforms.

## Accessibility Notes

- **Reduced Motion**: Respects user preferences for reduced motion
- **High Contrast**: Maintains readability with sufficient contrast
- **Focus Indicators**: Clear focus states with wave effects
- **Screen Reader**: Semantic HTML with proper ARIA labels

## Perfect For

- Creative agencies and design studios
- Tech startups with modern branding
- Entertainment and media platforms
- Art and photography portfolios
- Music streaming applications
- Gaming platforms and communities
- Modern SaaS applications
- Interactive media experiences
- Creative collaboration tools
- Digital art platforms

## Technical Features

- **CSS Grid**: Responsive layout system
- **CSS Custom Properties**: Easy theme customization
- **Intersection Observer**: Efficient animation triggering
- **RequestAnimationFrame**: Smooth particle animations
- **Backdrop Filter**: Modern glass morphism effects

## Performance Tips

- Animations pause when tab is inactive
- Particles reduce complexity on mobile devices
- Wave effects scale appropriately for screen size
- GPU acceleration enabled for all animations

## Inspiration

This form draws inspiration from:
- Ocean wave patterns and fluid dynamics
- Aurora borealis light effects
- Modern glass design principles
- Interactive particle systems
- Liquid motion graphics

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
