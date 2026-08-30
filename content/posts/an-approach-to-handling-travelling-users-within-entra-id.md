---
title: "An Approach to Handling Travelling Users within Entra ID"
date: "2026-08-25"
author: "Pascal Riester"
category: "Conditional Access"
tags: [EntraID, ConditionalAccess, PIM, Microsoft365, Cybersecurity]
summary: "A standardized Travel Access Framework using Microsoft Entra Conditional Access, Named Locations, and Privileged Identity Management (PIM) for secure time-based access."
cover: "https://cdn-images-1.medium.com/max/1024/1*FqL1IYlIlLAcLQ1gEolm9g.jpeg"
canonical: "https://medium.com/@riesterpascal/an-approach-to-handling-travelling-users-within-entra-id-32c46d7fda7a"
---

![Travel Access Framework](https://cdn-images-1.medium.com/max/1024/1*FqL1IYlIlLAcLQ1gEolm9g.jpeg)

While working as an Identity and Access Administrator for an MSP, we were always feeling like we traded security for convenience whenever a user wanted to access their work resources (like Outlook, Teams, and other M365 services) while travelling.

For some time now, we worked with two Microsoft Entra Conditional Access Policies and multiple Named Locations to allow users to travel while still restricting access from countries we deem risky. Over time, we realized that relying on only two Conditional Access policies and a handful of Named Locations was not enough. The model worked, but it created friction for users and required constant manual adjustments whenever someone travelled to a new country.

To improve both security and user experience, we developed a standardized **"Travel Access Framework"** based on Microsoft Entra Conditional Access. This framework allows users to travel safely without weakening our baseline security posture.

---

## Access Matrix by User Type

![Access matrix by user type](https://cdn-images-1.medium.com/max/1024/1*WKgqiU8EMYTCSXiFJ7mGdQ.png)

To achieve this, we moved away from a simple exclude for users who travel and need to access their work resources and created a **tiered location strategy**. Alongside our location-based policies, we always require users to provide **MFA as well as a managed/compliant device**. 

As you can see in the matrix above, we categorized global locations into six distinct profiles:

1. **"EEA" (European Economic Area):** Since our company is based in Germany and other European countries and travel occurs here frequently, we categorized these countries as safe for our business operations. *(You will need at least one location that is allowed to access your company's resources; otherwise, you will lock yourself out!)*
2. **Low-Risk Countries:** Countries that are generally viewed as safe and where business travel is common.
3. **Medium-Risk Countries:** Locations where business travel can be common, but threat vectors are slightly elevated.
4. **High-Risk Countries:** Locations that are usually not common to travel to, and threat vectors are significantly increased. We referenced the [Microsoft Digital Defense Report](https://www.microsoft.com/en-us/corporate-responsibility/topics/cybersecurity/reports/microsoft-digital-defense-report-2025) to decide which countries are included in this named location.
5. **Forbidden Countries:** Countries that show high risks of state-level surveillance or are involved in state-backed cyberattacks against other countries or entities. Sign-ins from these locations are not permitted and therefore **always blocked**.
6. **Unclassified Locations:** Locations that cannot be matched to any other category in this list. They are treated like forbidden countries and therefore any sign-in from these locations is **blocked by default**.

---

## Privileged Identity Management (PIM) Group Architecture

To implement this concept, we used **Microsoft Entra Privileged Identity Management (PIM)** to realize time-based group membership during the travel time of individual users. 

For this concept to work, we defined a streamlined process flow for users to be added to the respective risk group:

![Process flow for users to be added to the respective risk group](https://cdn-images-1.medium.com/max/1024/1*479u8eNmlAX56kN1J59eGQ.png)

### Setting Up Security Groups

To build this architecture, create three dedicated cloud security groups in Entra ID (or role-assignable groups enabled for Privileged Identity Management):
- `SG-Travel-LowRisk-Access`
- `SG-Travel-MediumRisk-Access`
- `SG-Travel-HighRisk-Access`

Once created, onboard each group to **Entra Privileged Identity Management (PIM) for Groups**. In the PIM settings for each group, define policies tailored to the risk level:

![PIM settings for risk groups](https://cdn-images-1.medium.com/max/1024/1*AoD45NMBqs07cfFyjp0jJQ.png)

---

## Conditional Access Policy Architecture

Rather than maintaining hundreds of individual country-based Conditional Access rules, this solution implements a layered **deny-by-default architecture**. Every policy is configured as a blocking policy, ensuring that users can only authenticate from locations explicitly assigned to their approved travel profile.

The design follows the principle that any country not intentionally categorized and approved should be denied by default.

### CA-Policy-01: Block Forbidden & Unclassified Locations
This policy establishes the security baseline by blocking access from countries that are either explicitly forbidden or cannot be mapped to a specific Geolocation by Microsoft.
- **Users:** All Users *(Exclude Break-Glass Accounts)*
- **Target Resources:** All Cloud Apps
- **Conditions > Locations:** Include *Forbidden & Unclassified Locations*
- **Grant:** Block Access

*This ensures that newly added countries or locations cannot be accessed until they have been reviewed and assigned to an appropriate risk category.*

### CA-Policy-02: Default Deny for Non-Approved Travelers
This policy acts as the global deny rule for traveler access.
- **Users:** All Users *(Exclude Traveler Access Groups and Break-Glass Accounts)*
- **Target Resources:** All Cloud Apps
- **Conditions > Locations:** Include *All Locations* *(excluding trusted locations)*
- **Grant:** Block Access

*Any user who is not a member of an approved traveler group will be blocked regardless of their sign-in location.*

### CA-Policy-03: High-Risk Traveler Geographic Restrictions
This policy applies to members of the `SG-Travel-HighRisk-Access` group.
- **Users:** `SG-Travel-HighRisk-Access` *(Exclude Break-Glass Accounts)*
- **Target Resources:** All Cloud Apps
- **Conditions > Locations:** All Locations *except High-Risk Countries and trusted locations*
- **Grant:** Block Access

*Users in this group can therefore authenticate only from approved High-Risk locations and trusted corporate locations.*

### CA-Policy-04: Medium-Risk Traveler Geographic Restrictions
This policy applies to members of the `SG-Travel-MediumRisk-Access` group.
- **Users:** `SG-Travel-MediumRisk-Access` *(Exclude Break-Glass Accounts)*
- **Target Resources:** All Cloud Apps
- **Conditions > Locations:** All Locations *except Medium-Risk Countries and trusted locations*
- **Grant:** Block Access

*Users are restricted to the countries assigned to the Medium-Risk category.*

### CA-Policy-05: Low-Risk Traveler Geographic Restrictions
This policy applies to members of the `SG-Travel-LowRisk-Access` group.
- **Users:** `SG-Travel-LowRisk-Access` *(Exclude Break-Glass Accounts)*
- **Target Resources:** All Cloud Apps
- **Conditions > Locations:** All Locations *except Low-Risk Countries and trusted locations*
- **Grant:** Block Access

*Users can only sign in from approved Low-Risk countries and trusted corporate locations.*

---

## End-to-End Workflow in Practice

1. **Request Submission:** The employee logs a ticket with their travel dates, destination country, and business purpose before departure.
2. **Authorization:** The manager approves the request based on risk tier constraints and travel schedules.
3. **Time-Bound Assignment:** Helpdesk assigns the user an **Active (Time-Bound)** membership in the designated risk group via Entra PIM, setting the exact start and expiration dates.
4. **Enforcement & Session Control:** When authenticating abroad, the Conditional Access engine matches the user's location to the assigned exception group and evaluates compliance (MFA + Compliant Device).
5. **Automated De-provisioning:** Once the PIM assignment duration elapses, membership drops automatically. The user is instantly blocked from authenticating from that location without manual admin cleanup.

---

## Lessons Learned and Operational Tips

- **Protect Break-Glass Accounts:** Always exclude your emergency/break-glass administrative accounts from every location-blocking CA policy to prevent permanent lockouts during geolocation misconfigurations.
- **Leverage Continuous Access Evaluation (CAE):** Enable CAE across your M365 tenant so that session revocation occurs in near real-time once the user's PIM group membership expires.
- **IP-based vs. GPS-based Locations:** For mobile access via the Microsoft Authenticator app, consider using GPS-based Named Locations to avoid issues with cellular roaming routing IP traffic through home countries.
- **Audit Logging:** Set up an alert rule in Microsoft Sentinel or Entra Log Analytics on PIM group assignments for High-Risk tiers to monitor abnormal travel approvals.

---

*Originally published on [Medium by Pascal Riester](https://medium.com/@riesterpascal/an-approach-to-handling-travelling-users-within-entra-id-32c46d7fda7a).*
