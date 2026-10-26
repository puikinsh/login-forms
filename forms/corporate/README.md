# Corporate Login Form

*Created by [Aigars Silkalns](https://github.com/puikinsh/) for [Colorlib](https://colorlib.com)*

A professional, enterprise-grade login form designed for business applications with SSO integration and enhanced security features.

## Features

- **Professional Design**: Clean, corporate styling with company branding space
- **Enhanced Security**: Strong password validation with corporate requirements
- **SSO Integration**: Microsoft Azure AD and Okta authentication options
- **Business Email Validation**: Prevents personal email addresses
- **Corporate Branding**: Logo placeholder and professional color scheme
- **Loading States**: Professional loading animations for authentication
- **Enterprise Layout**: Structured design suitable for business applications
- **Footer Links**: Space for privacy policy, terms, and support links
- **Responsive**: Optimized for desktop and mobile business use

## Files

- `index.html` - Main form HTML structure with SSO options
- `style.css` - Complete self-contained CSS with corporate styling
- `script.js` - Enhanced form functionality with SSO and corporate validation
- `README.md` - This documentation

## Dependencies

- `../../shared/js/form-utils.js` - Shared form utilities (validation, animations)

## Usage

1. Copy the entire `corporate/` folder to your project
2. The form is completely self-contained with all CSS included
3. Only dependency is the shared JavaScript utilities
4. Customize branding by modifying the logo and colors in `style.css`
5. Replace SSO placeholders with actual authentication providers
6. Update footer links to point to your company policies

## Customization

### Corporate Colors
- Primary: `#2563eb` (professional blue)
- Secondary: `#3b82f6` (lighter blue)
- Success: `#059669` (corporate green)
- Error: `#dc2626` (warning red)
- Background: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`

### Company Branding
Replace the logo icon (`🏢`) in the HTML and customize the `.logo-icon` styles in CSS to match your company branding.

### SSO Providers
Update the SSO buttons and JavaScript handlers to integrate with your actual authentication providers:
- Microsoft Azure AD
- Okta
- Other enterprise SSO solutions

## Enterprise Features

- **Email Validation**: Accepts valid email addresses across domains
- **Sign-in Validation**: Requires a password without imposing registration rules
- **SSO Integration Ready**: Prepared for enterprise authentication systems
- **Professional Error Handling**: Corporate-appropriate error messages

## Security Features

- Required email and password with accessible error feedback
- Password values are submitted unchanged
- Loading states prevent multiple submissions

## Browser Support

- Chrome 88+
- Firefox 103+
- Safari 15.4+
- Edge 88+

Optimized for modern business browsers with enterprise security features.

## Perfect For

- Enterprise applications
- Corporate intranets
- Business SaaS platforms
- Employee portals
- B2B applications
- Professional services platforms
- Companies requiring SSO integration
- Organizations with strict security requirements

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
