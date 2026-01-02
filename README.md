# Research Atlas

A futuristic research interface with AI-powered search, art generation, and multiple subscription tiers.

## Deployment

This project is configured for deployment on GitHub Pages with a custom domain.

### Steps to Deploy

1.  **Push to GitHub**:
    - Upload all files in this folder to your GitHub repository `research-altas`.
2.  **Configure Settings**:
    - Go to Repository Settings -> Pages.
    - Select `main` branch as the source.
    - Ensure "Custom domain" is set to `www.researchaltas.com`.
    - Check "Enforce HTTPS".

### Domain Configuration (DNS)

Ensure your domain provider (where you bought `www.researchaltas.com`) has the following records:

- **CNAME Record**:
    - Name: `www`
    - Value: `alpinzhannz.github.io`
- **A Records** (for root domain `@`):
    - `185.199.108.153`
    - `185.199.109.153`
    - `185.199.110.153`
    - `185.199.111.153`
