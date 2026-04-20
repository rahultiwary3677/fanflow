# Security Policy

## Supported Versions

The following versions of FanFlow are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| v1.0.x  | :white_check_mark: |
| < v1.0  | :x:                |

## Reporting a Vulnerability

We take the security of FanFlow seriously. If you believe you have found a security vulnerability, please report it to us by following these steps:

1.  **Do not** open a public GitHub issue.
2.  Email your findings to `security@fanflow.example.com`.
3.  Include as much detail as possible, including steps to reproduce.

We will acknowledge your report within 48 hours and provide a timeline for resolution if the vulnerability is confirmed.

## Environment Variables

This project uses `.env` files for managing sensitive API keys. **Never commit your `.env` file to the repository.** A `.env.example` file is provided for reference.
