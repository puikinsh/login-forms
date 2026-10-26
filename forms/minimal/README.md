# Minimal Login Form

*Created by [Aigars Silkalns](https://github.com/puikinsh/) for [Colorlib](https://colorlib.com)*

A clean, minimal login form focused on simplicity, usability, and accessibility. Perfect for applications that prioritize function over flashy design.

## Features

- **Clean Design**: Minimal, distraction-free interface
- **System Fonts**: Uses native system fonts for optimal performance
- **Floating Labels**: Smooth label animations on focus
- **Password Toggle**: Simple eye icon to show/hide password
- **Form Validation**: Real-time validation with clear error messages
- **Loading States**: Smooth loading animation on submit
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels
- **Responsive**: Mobile-first responsive design
- **Lightweight**: Minimal CSS and JavaScript footprint

## Files

- `index.html` - Main form HTML structure
- `style.css` - Complete self-contained CSS with minimal styles
- `script.js` - Form functionality and validation
- `README.md` - This documentation

## Dependencies

- `../../shared/js/form-utils.js` - Shared form utilities (validation, animations)

## Usage

1. Copy the entire `minimal/` folder to your project
2. The form is completely self-contained with all CSS included
3. Only dependency is the shared JavaScript utilities
4. Customize colors by modifying the CSS variables in `style.css`
5. Integrate with your authentication system

## Customization

Key colors to customize:
- Primary color: `#3b82f6` (blue)
- Success color: `#059669` (green)
- Error color: `#dc2626` (red)
- Background: `#f8fafc` (light gray)
- Text colors: `#1a202c` (dark), `#718096` (gray)

## Design Philosophy

- **Less is More**: Focuses on essential elements only
- **System Integration**: Uses system fonts and standard UI patterns
- **Fast Performance**: Minimal animations and lightweight code
- **Universal Appeal**: Works well in any application context
- **High Usability**: Clear visual hierarchy and intuitive interactions

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

No advanced CSS features required - works on older browsers too.

## Perfect For

- Enterprise applications
- Admin dashboards
- Internal tools
- Mobile applications
- Projects prioritizing performance
- Accessibility-focused applications

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
