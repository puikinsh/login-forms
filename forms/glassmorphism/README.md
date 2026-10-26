# Glassmorphism Login Form

*Created by [Aigars Silkalns](https://github.com/puikinsh/) for [Colorlib](https://colorlib.com)*

![Glassmorphism Login Form Preview](../../assets/screenshots/glassmorphism.png)

A modern login form featuring the popular glassmorphism design trend with frosted glass effects and smooth animations.

## Features

- **Glassmorphism Design**: Frosted glass effect with backdrop blur
- **Gradient Background**: Beautiful purple-to-cyan gradient
- **Floating Labels**: Smooth label animations on focus
- **Password Toggle**: Eye icon to show/hide password
- **Social Login**: Google and GitHub integration ready
- **Form Validation**: Real-time validation with smooth error animations
- **Responsive**: Works on all screen sizes

## Files

- `index.html` - Main form HTML structure
- `style.css` - Complete self-contained CSS with glassmorphism styles
- `script.js` - Form functionality and interactions

## Dependencies

- `../../shared/js/form-utils.js` - Shared form utilities (validation, animations)

## Usage

1. Copy the entire `glassmorphism/` folder to your project
2. The form is completely self-contained with all CSS included
3. Only dependency is the shared JavaScript utilities
4. Customize colors by modifying the CSS variables in `style.css`
5. Integrate with your authentication system

## Customization

Key CSS variables to customize:
- `--primary-color`: Main theme color
- `--accent-color`: Accent color for focus states
- `--glass-bg`: Glass background opacity
- `--glass-border`: Glass border color

## Browser Support

- Chrome 88+
- Firefox 103+ 
- Safari 15.4+
- Edge 88+

Requires support for `backdrop-filter` CSS property.

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
