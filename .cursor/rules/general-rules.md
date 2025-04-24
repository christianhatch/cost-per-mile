# General Development Rules

## How to work
- When making changes, avoid making lots of changes at once
    - Work incrementally, so it is easy to learn, test, and verify each step
    - Don't do the first thing you think of, stop and read the docs first
    - Ensure you're following best practices for the specific versions of the core technologies

## Core Technologies
- Alpine.js (v3.x)
  - Use canonical Alpine.js patterns and directives
  - Follow Alpine.js best practices for state management
  - Utilize Alpine.js lifecycle hooks appropriately
- Tailwind CSS (v4.x)
  - Use utility classes for styling
  - Follow mobile-first responsive design principles
  - Maintain consistent spacing using Tailwind's spacing scale
  - Use consistent colors for similiar visual elements
- Chart.js
  - Use for all data visualization needs
  - Follow Chart.js best practices for performance
  - Implement responsive charts
- Chart.js Annotations Plugin
  - Use for all data visualization needs
  - Follow Chart.js best practices for performance
  - Implement responsive charts


## Code Organization
- Keep logic simple and straightforward
- Organize methods and functionality logically within files
- Reduce code duplication
- Remove unused code
- Group related functionality together
- Use clear, descriptive naming conventions

## Accessibility Standards
- Color and Contrast
  - Ensure WCAG 2.1 AA compliance for color contrast
  - Never use color alone to convey information
  - Provide alternative visual indicators for color-coded elements

- Semantic HTML
  - Use appropriate heading hierarchy (h1-h6)
  - Implement proper ARIA roles and attributes
  - Add descriptive IDs to interactive elements
  - Use semantic HTML elements (nav, main, section, etc.)

- Visual Elements
  - Provide meaningful alt text for all images
  - Include descriptive labels for form elements
  - Ensure focus indicators are visible
  - Support keyboard navigation

## Documentation
- Maintain up-to-date README files
- Document any non-obvious implementation details
- Do not add documentation or code comments for obvious things

## Performance
- Implement lazy loading where appropriate
- Minimize DOM operations
- Use efficient data structures

## Dependencies
- Keep dependencies up to date
- Document any custom configurations
- Follow dependency best practices
- Review and remove unused dependencies

## Learning Resources
- Alpine.js: https://alpinejs.dev/start-here
- Tailwind CSS: https://tailwindcss.com/docs
- Chart.js: https://www.chartjs.org/docs/
- Chart.js Annotations: https://www.chartjs.org/chartjs-plugin-annotation/latest/guide/
- WCAG Guidelines: https://www.w3.org/WAI/standards-guidelines/wcag/