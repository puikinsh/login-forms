# Neumorphism Login Form

*Created by [Aigars Silkalns](https://github.com/puikinsh/) for [Colorlib](https://colorlib.com)*

A soft UI login form featuring neumorphism design with embossed elements, soft shadows, and tactile interactions.

## Features

- **Neumorphic Design**: Soft UI with embossed and inset elements
- **Tactile Interactions**: Soft press effects and gentle animations
- **Ambient Lighting**: Mouse-responsive shadow effects
- **Soft Shadows**: Multi-layered shadows for depth illusion
- **Embossed Elements**: Buttons and inputs appear carved from surface
- **Gentle Animations**: Subtle, soft transitions throughout
- **SVG Icons**: Clean, scalable icons integrated seamlessly
- **Monochromatic Palette**: Subtle color variations for depth
- **Responsive**: Maintains neumorphic effects on all devices

## Files

- `index.html` - Main form HTML structure with neumorphic elements
- `style.css` - Complete self-contained CSS with neumorphic styling
- `script.js` - Soft interactions and ambient light effects
- `README.md` - This documentation

## Dependencies

- `../../shared/js/form-utils.js` - Shared form utilities (validation, animations)

## Usage

1. Copy the entire `neumorphism/` folder to your project
2. The form is completely self-contained with all CSS included
3. Only dependency is the shared JavaScript utilities
4. Customize by adjusting shadow colors and depths
5. Perfect for modern, soft UI applications
6. Integrate with your authentication system

## Customization

### Neumorphic Color Palette
- Background: `#e0e5ec` (light gray base)
- Light Shadow: `#ffffff` (white highlights)
- Dark Shadow: `#bec3cf` (subtle dark shadows)
- Text Primary: `#3d4468` (dark blue-gray)
- Text Secondary: `#9499b7` (medium blue-gray)
- Accent: `#6c7293` (focused blue-gray)
- Success: `#00c896` (soft green)
- Error: `#ff3b5c` (soft red)

### Shadow Customization
- **Raised Elements**: Light shadow top-left, dark shadow bottom-right
- **Inset Elements**: Reversed shadow direction for depth illusion
- **Hover States**: Increased shadow distance for floating effect
- **Active States**: Inset shadows for pressed appearance

### Depth Levels
- **Level 1**: 4px shadows for subtle elevation
- **Level 2**: 8px shadows for standard elevation
- **Level 3**: 20px shadows for high elevation
- **Inset**: Negative shadows for recessed appearance

## Design Philosophy

Neumorphism creates the illusion that interface elements are carved from the same material as the background:

- **Soft Realism**: Elements appear physically embossed or carved
- **Minimal Contrast**: Subtle color variations maintain cohesion
- **Tactile Feedback**: Interactions feel like pressing physical buttons
- **Depth Hierarchy**: Shadow layers create natural information hierarchy
- **Ambient Light**: Mouse movement simulates changing light source

## Interactive Elements

- **Soft Press Effects**: Elements compress when pressed
- **Ambient Lighting**: Shadows respond to mouse position
- **Gentle Transitions**: All animations are soft and natural
- **Scale Animations**: Subtle scaling for hover feedback
- **Progressive Enhancement**: Graceful degradation on older browsers

## Accessibility Considerations

- **Low Contrast Warning**: Neumorphism can have accessibility issues
- **Focus Indicators**: Clear focus states for keyboard navigation
- **Color Independence**: Visual hierarchy doesn't rely solely on color
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **High Contrast Mode**: Fallback styles for accessibility settings

## Browser Support

- Chrome 88+ (full support)
- Firefox 103+ (full support)
- Safari 15.4+ (full support)
- Edge 88+ (full support)

Requires modern CSS support for multiple box-shadows and CSS transforms.

## Perfect For

- Modern app interfaces
- Premium software applications
- iOS-style web applications
- Minimalist design systems
- Touch-first interfaces
- Creative portfolio sites
- Design tool interfaces
- Premium SaaS applications
- Modern dashboard designs
- Clean productivity apps

## Performance Notes

- Uses CSS transforms for smooth animations
- Multiple box-shadows optimized for hardware acceleration
- Minimal JavaScript for maximum performance
- Efficient DOM manipulation for interactive effects

## Limitations

- **Accessibility**: Low contrast may not meet WCAG standards
- **Dark Mode**: Neumorphism works best on light backgrounds
- **Print Styles**: Shadows don't translate well to print media
- **Legacy Browsers**: Requires modern CSS support

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
