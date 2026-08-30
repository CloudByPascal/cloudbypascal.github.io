---
title: "Designing a Zero-Trust Conditional Access Baseline in Entra ID"
date: "2026-08-28"
author: "Pascal Riester"
category: "Conditional Access"
tags: [ConditionalAccess, EntraID, ZeroTrust, M365Security, Compliance]
summary: "A practical blueprint for structuring persona-based Conditional Access policies, break-glass exclusions, session controls, and device compliance across your Entra tenant."
---

# Designing a Zero-Trust Conditional Access Baseline in Entra ID

Conditional Access (CA) is the intelligent policy engine at the core of Microsoft Zero Trust security. When properly architected, it evaluates signals—user context, device health, risk state, and location—to make real-time, deterministic access decisions.

However, organizations frequently struggle with CA policy sprawl, overlapping rules, accidental administrator lockouts, and conflicting grant controls. In this article, I walk through a standardized **Persona-Based Conditional Access Architecture** that scales cleanly from mid-market MSP clients to enterprise tenants.

---

## The Persona-Based Policy Framework

Rather than assigning ad-hoc policies to specific departments or application subsets, segment your user population into structured personas:

```text
┌────────────────────────────────────────────────────────┐
│             Enterprise User Personas                   │
├───────────────────┬───────────────────┬────────────────┤
│ 1. Administrators │ 2. Standard Users │ 3. Guests / B2B│
│    (Entra Roles)  │    (Employees)    │    (External)  │
├───────────────────┼───────────────────┼────────────────┤
│ 4. Service / Non- │ 5. Workload       │ 6. Break-Glass │
│    Interactive    │    Identities     │    (Exclusions)│
└───────────────────┴───────────────────┴────────────────┘
```

---

## Essential Policy Matrix

Here is the baseline set of policies every Microsoft Entra tenant should implement:

### 1. CA01 — Block Legacy Authentication
Legacy protocols (POP3, IMAP, SMTP AUTH, older Office clients) cannot satisfy modern MFA challenges and represent the primary vector for credential stuffing and password spray attacks.
- **Users:** All Users *(Exclude Break-Glass Accounts)*
- **Cloud Apps:** All Cloud Apps
- **Client Apps:** Exchange ActiveSync clients & Other clients
- **Grant:** Block Access

### 2. CA02 — Require Phishing-Resistant MFA for Administrators
Administrative roles require strict authentication strength (FIDO2 security keys, Certificate-Based Authentication, or Windows Hello for Business).
- **Users:** Directory Roles (Global Admin, Privileged Role Admin, Security Admin, Exchange Admin, etc.)
- **Cloud Apps:** All Cloud Apps (including Microsoft Admin Portals)
- **Grant:** Require Phishing-Resistant MFA / Authentication Strength
- **Session:** Sign-in frequency (e.g., 4 hours) + Persistent browser session disabled

### 3. CA03 — Require MFA & Compliant Devices for Standard Users
Employees accessing corporate data must prove identity and verify device integrity.
- **Users:** All Users *(Exclude Guests, Break-Glass)*
- **Cloud Apps:** All Cloud Apps
- **Grant:** Require Multifactor Authentication **AND** Require Device to be marked as Compliant (Intune)

### 4. CA04 — Enforce Risk-Based Step-Up Authentication
Integrate **Microsoft Entra ID Protection** to automatically challenge or block compromised sign-ins.
- **User Risk Policy:** High User Risk $\rightarrow$ Require Password Reset with SSPR & MFA.
- **Sign-in Risk Policy:** Medium/High Sign-in Risk $\rightarrow$ Require MFA step-up.

---

## The Emergency "Break-Glass" Account Golden Rule

Never deploy any blocking or MFA policy without excluding your dedicated break-glass emergency accounts:

```yaml
# Break-Glass Operational Checklist
- Number of accounts: 2 dedicated cloud-only accounts (e.g., bg-admin01@tenant.onmicrosoft.com)
- Password: 30+ character random passphrase stored in a physical fireproof safe
- MFA: FIDO2 hardware token stored in separate physical safe (no SMS / phone dependency)
- Exclusions: Explicitly added to the "Exclude" tab of EVERY Conditional Access policy
- Monitoring: Microsoft Sentinel alert trigger immediately upon ANY interactive sign-in
```

---

## Testing & Safe Deployment with "Report-Only" Mode

Before switching any Conditional Access policy to **On**, always deploy in **Report-Only** mode for at least 14 days. 

1. Review the **Conditional Access Insights and Reporting** workbook in Entra ID.
2. Filter by `Result: Failure` or `Result: User Action Required` to identify users with unmanaged devices or outdated clients.
3. Validate that break-glass accounts are properly excluded.
4. Transition policies to **On** in phased rings.

---

## Conclusion

A well-structured Conditional Access baseline provides deterministic Zero Trust protection without overwhelming administrators. By layering persona-based rules with Microsoft Intune compliance and Entra ID Protection risk signals, you establish an airtight security boundary for your Microsoft Cloud estate.
