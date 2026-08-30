---
title: "An Approach to Handling Travelling Users within Entra ID"
date: "2026-08-25"
author: "Pascal Riester"
category: "Entra ID"
tags: [EntraID, Microsoft365, Cybersecurity, ConditionalAccess, CloudSecurity]
summary: "A standardized Travel Access Framework using Microsoft Entra Conditional Access, Named Locations, and Privileged Identity Management (PIM) for secure time-based access."
cover: "https://cdn-images-1.medium.com/max/1024/1*FqL1IYlIlLAcLQ1gEolm9g.jpeg"
canonical: "https://medium.com/@riesterpascal/an-approach-to-handling-travelling-users-within-entra-id-32c46d7fda7a"
---

![Travel Access Framework](https://cdn-images-1.medium.com/max/1024/1*FqL1IYlIlLAcLQ1gEolm9g.jpeg)

While working as an Identity and Access Administrator for an MSP, we were always feeling like we traded security for convenience whenever a user wanted to access their work resources (like Outlook, Teams, and other M365 services) while travelling.

For some time, we worked with two Microsoft Entra Conditional Access Policies and multiple Named Locations to allow users to travel while still restricting access from countries we deemed risky. Over time, we realized that relying on only two Conditional Access policies and a handful of Named Locations was not enough. The model worked, but it created friction for users and required constant manual adjustments whenever someone travelled to a new country.

To improve both security and user experience, we developed a standardized **"Travel Access Framework"** based on Microsoft Entra Conditional Access. This framework allows users to travel safely without weakening our baseline security posture.

---

## Access Matrix by User Type

![Access matrix by user type](https://cdn-images-1.medium.com/max/1024/1*WKgqiU8EMYTCSXiFJ7mGdQ.png)

To achieve this, we moved away from a simple exclude for users who travel and need to access their work resources and created a **tiered location strategy**. Alongside our location-based policies, we always require users to provide **MFA as well as a managed/compliant device**.

We categorized global locations into six distinct profiles:

1. **"EEA" (European Economic Area):** Since our company is based in Germany and other European countries and travel occurs here frequently, we categorized these countries as safe for baseline business operations. *(You will need at least one location allowed to access your company's resources; otherwise, you will lock yourself out!)*
2. **Low-Risk Countries:** Countries that are generally viewed as safe and where business travel is common.
3. **Medium-Risk Countries:** Locations where business travel can be common, but threat vectors are slightly elevated.
4. **High-Risk Countries:** Locations that are usually not common to travel to, with significantly increased threat vectors. We referenced the [Microsoft Digital Defense Report](https://www.microsoft.com/en-us/corporate-responsibility/topics/cybersecurity/reports/microsoft-digital-defense-report-2025) to determine inclusion.
5. **Forbidden Countries:** Countries that show high risks of state-level surveillance or are involved in state-backed cyberattacks. Sign-ins from these locations are **never permitted and always blocked**.
6. **Unclassified Locations:** Locations that cannot be matched to any other category. They are treated like forbidden countries and are **blocked by default**.

---

## Privileged Identity Management (PIM) Group Architecture

To implement time-based group membership during a user's travel window, we leverage **Microsoft Entra Privileged Identity Management (PIM) for Groups**.

Below is the designed process flow for users to be added to the respective risk group:

![Process flow for users](https://cdn-images-1.medium.com/max/1024/1*479u8eNmlAX56kN1J59eGQ.png)

### Setting Up the Security Groups

Create three dedicated cloud security groups in Entra ID (or role-assignable groups enabled for PIM):
- `SG-Travel-LowRisk-Access`
- `SG-Travel-MediumRisk-Access`
- `SG-Travel-HighRisk-Access`

Once created, onboard each group to **Entra Privileged Identity Management (PIM) for Groups** and define policies tailored to each risk level:

![PIM Settings for Groups](https://cdn-images-1.medium.com/max/1024/1*AoD45NMBqs07cfFyjp0jJQ.png)

---

## Conditional Access Policy Architecture

Rather than maintaining hundreds of individual country-based Conditional Access rules, this solution implements a layered **deny-by-default architecture**. Every policy is configured as a blocking policy, ensuring that users can only authenticate from locations explicitly assigned to their approved travel profile.

### CA-Policy-01: Block Forbidden & Unclassified Locations
Establishes the security baseline by blocking access from countries that are either explicitly forbidden or cannot be mapped to a specific Geolocation by Microsoft.
- **Users:** All Users *(exclude Break-Glass Accounts)*
- **Target Resources:** All Cloud Apps
- **Conditions > Locations:** Include *Forbidden & Unclassified Locations*
- **Grant:** Block Access

### CA-Policy-02: Default Deny for Non-Approved Travelers
Acts as the global deny rule for traveler access outside the home region.
- **Users:** All Users *(exclude Traveler Access Groups and Break-Glass Accounts)*
- **Target Resources:** All Cloud Apps
- **Conditions > Locations:** Include *All Locations* *(excluding trusted locations)*
- **Grant:** Block Access

### CA-Policy-03: High-Risk Traveler Geographic Restrictions
Applies to members of the `SG-Travel-HighRisk-Access` group.
- **Users:** `SG-Travel-HighRisk-Access` *(exclude Break-Glass Accounts)*
- **Target Resources:** All Cloud Apps
- **Conditions > Locations:** All Locations *except High-Risk Countries and trusted locations*
- **Grant:** Block Access

### CA-Policy-04: Medium-Risk Traveler Geographic Restrictions
Applies to members of the `SG-Travel-MediumRisk-Access` group.
- **Users:** `SG-Travel-MediumRisk-Access` *(exclude Break-Glass Accounts)*
- **Target Resources:** All Cloud Apps
- **Conditions > Locations:** All Locations *except Medium-Risk Countries and trusted locations*
- **Grant:** Block Access

### CA-Policy-05: Low-Risk Traveler Geographic Restrictions
Applies to members of the `SG-Travel-LowRisk-Access` group.
- **Users:** `SG-Travel-LowRisk-Access` *(exclude Break-Glass Accounts)*
- **Target Resources:** All Cloud Apps
- **Conditions > Locations:** All Locations *except Low-Risk Countries and trusted locations*
- **Grant:** Block Access

---

## End-to-End Workflow in Practice

1. **Request Submission:** The employee submits a ticket with travel dates, destination country, and business purpose before departure.
2. **Authorization:** The manager approves the request based on risk tier constraints and travel schedules.
3. **Time-Bound Assignment:** Helpdesk assigns the user an **Active (Time-Bound)** membership in the designated risk group via Entra PIM, setting exact start and expiration timestamps.
4. **Enforcement & Session Control:** When authenticating abroad, Conditional Access matches the user's location to the assigned exception group and evaluates compliance (MFA + Compliant Managed Device).
5. **Automated De-provisioning:** Once the PIM assignment duration elapses, membership expires automatically. The user is instantly blocked from authenticating from that location without requiring manual administrative cleanup.

---

## Lessons Learned and Operational Tips

- **Protect Break-Glass Accounts:** Always exclude your emergency/break-glass administrative accounts from every location-blocking CA policy to prevent permanent lockouts.
- **Leverage Continuous Access Evaluation (CAE):** Enable CAE across your M365 tenant so that session revocation occurs in near real-time once the user's PIM group membership expires.
- **IP-based vs. GPS-based Locations:** For mobile access via the Microsoft Authenticator app, consider using GPS-based Named Locations to avoid cellular roaming routing IP traffic through home countries.
- **Audit Logging & Alerting:** Set up an alert rule in Microsoft Sentinel or Entra Log Analytics on PIM group assignments for High-Risk tiers to monitor travel approvals proactively.

---

*Originally published on [Medium by Pascal Riester](https://medium.com/@riesterpascal/an-approach-to-handling-travelling-users-within-entra-id-32c46d7fda7a).*
