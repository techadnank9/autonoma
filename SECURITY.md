# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| Latest on `main` | Yes |
| Older releases | No |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, please report them responsibly via email to **security@autonoma.app**.

Include as much of the following information as possible to help us triage your report:

- Type of vulnerability (e.g. SQL injection, XSS, authentication bypass, etc.)
- Affected component or file path
- Step-by-step instructions to reproduce the issue
- Proof of concept or exploit code (if available)
- Impact assessment - what an attacker could achieve

## Response Timeline

- **Acknowledgment** - We will acknowledge your report within **48 hours**.
- **Triage** - We will assess severity and confirm the vulnerability within **5 business days**.
- **Fix** - We aim to release a fix within **30 days** of confirmation, depending on complexity.
- **Disclosure** - We will coordinate disclosure timing with you. We ask that you do not publicly disclose the vulnerability until a fix has been released.

## Severity Classification

We follow the [CVSS v3.1](https://www.first.org/cvss/v3.1/specification-document) scoring system to classify vulnerabilities:

| Severity | CVSS Score | Response |
|---|---|---|
| Critical | 9.0 - 10.0 | Immediate patch, emergency release |
| High | 7.0 - 8.9 | Patch within next release cycle |
| Medium | 4.0 - 6.9 | Scheduled for upcoming release |
| Low | 0.1 - 3.9 | Addressed as time permits |

## Scope

The following are in scope for security reports:

- The Autonoma AI platform (API, UI, engines, jobs)
- Authentication and authorization mechanisms
- Data handling and storage
- Infrastructure configuration (Kubernetes manifests, Docker images)
- Dependencies with known vulnerabilities that affect our usage

The following are **out of scope**:

- Denial of service attacks
- Social engineering
- Vulnerabilities in third-party services we integrate with (report those to the respective vendors)
- Issues that require physical access to a user's device
- Automated scanner output without a verified proof of concept

## Safe Harbor

We consider security research conducted in good faith to be authorized. We will not pursue legal action against researchers who:

- Make a good faith effort to avoid privacy violations, data destruction, and service disruption
- Only interact with accounts they own or with explicit permission of the account holder
- Report vulnerabilities promptly and do not exploit them beyond what is necessary to demonstrate the issue
- Do not publicly disclose the vulnerability before we have had a reasonable time to address it

## Recognition

We appreciate the security research community's efforts in helping keep Autonoma AI safe. With your permission, we will acknowledge your contribution in our release notes when the vulnerability is fixed.

## Contact

- **Email**: security@autonoma.app
- **PGP**: Available upon request

Thank you for helping keep Autonoma AI and our users safe.
