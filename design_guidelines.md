# Design Guidelines for Japanese Mobile Counseling App

## Design Approach Documentation

**Selected Approach**: Reference-Based Design inspired by wellness and productivity apps like Calm, Headspace, and Notion
**Justification**: This is an experience-focused, emotionally supportive application requiring visual appeal and trust-building elements. The sensitive nature of mental health counseling demands a calming, professional aesthetic.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light Mode: 220 15% 20% (Deep Blue-Gray for trust and stability)
- Dark Mode: 220 15% 85% (Light Blue-Gray for comfortable reading)

**Supporting Colors:**
- Calming Accent: 200 25% 65% (Soft Blue for positive actions)
- Success/Progress: 150 30% 50% (Muted Green for achievements)
- Warning/Attention: 35 25% 55% (Soft Orange for gentle alerts)
- Background Gradients: Subtle gradients from 220 10% 98% to 200 15% 95% for light mode

### B. Typography
- **Primary Font**: Noto Sans JP (Google Fonts) - optimized for Japanese text readability
- **Hierarchy**: 
  - Headers: 700 weight, 24px-32px
  - Body: 400 weight, 16px-18px
  - Captions: 400 weight, 14px
- **Line Height**: 1.6 for comfortable Japanese text reading

### C. Layout System
**Tailwind Spacing Units**: Primarily use 2, 4, 6, and 8 units
- **Container**: max-w-sm (384px) for mobile-first design
- **Section Spacing**: p-6, mb-8 for comfortable touch targets
- **Card Spacing**: p-4, gap-4 for content organization
- **Button Heights**: h-12 for accessible mobile interaction

### D. Component Library

**Navigation**: 
- Bottom tab navigation with 3-4 primary sections
- Gentle rounded corners (rounded-xl)
- Soft shadows for depth without harshness

**Cards & Containers**:
- Worry/concern cards with subtle borders and soft shadows
- Progress indicators using gentle curves and calming colors
- Chat bubbles with distinct styling for user vs AI responses

**Forms & Inputs**:
- Rounded input fields (rounded-lg)
- Soft focus states with the primary blue color
- Gentle validation messaging

**Character Selection**:
- Avatar-style character representations
- Distinct visual personalities while maintaining professional appearance
- Subtle hover/selection states

**Data Visualization**:
- Soft, organic chart styles for progress reports
- Muted color palette for graphs to avoid overwhelming users
- Clean, minimal legends and labels

### E. Mobile-Specific Considerations

**Touch Targets**: Minimum 44px height for all interactive elements
**Safe Areas**: Account for iOS notch and Android navigation bars
**Gesture Support**: Swipe gestures for navigation between worries/reports
**Loading States**: Gentle, calming animations during AI response generation

### F. Japanese Language Optimization

**Text Density**: Appropriate spacing for complex Japanese characters
**Vertical Rhythm**: Consistent baseline grid accommodating mixed hiragana/katakana/kanji
**Reading Flow**: Clear visual hierarchy supporting natural Japanese reading patterns

### G. Emotional Design Elements

**Warmth**: Subtle warm undertones in grays and blues
**Trust**: Consistent, predictable layouts and interactions
**Calm**: Generous whitespace and soft transitions
**Support**: Visual metaphors suggesting guidance and companionship

## Key Design Principles

1. **Accessibility First**: High contrast ratios, clear typography, intuitive navigation
2. **Emotional Safety**: Non-threatening colors, gentle interactions, supportive messaging
3. **Cultural Sensitivity**: Appropriate for Japanese users' expectations and cultural context
4. **Mobile Optimization**: Touch-friendly, one-handed operation, offline-capable design
5. **Progressive Disclosure**: Reveal complexity gradually to avoid overwhelming users

This design system prioritizes user comfort and emotional well-being while maintaining professional credibility essential for a mental health support application.