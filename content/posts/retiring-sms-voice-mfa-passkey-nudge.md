   ---
   title: "The Sunset of SMS & Voice MFA in Microsoft Entra ID: Navigating the 2026/2027 Telephony Retirement, Passkey Dynamic Nudges, and the Graph API Opt-Out"
   date: "2026-08-31"
   author: "Pascal Riester"
   category: "Entra ID"
   tags: [EntraID, ConditionalAccess, ZeroTrust]
   summary: "A comprehensive technical and architectural guide to Microsoft's retirement of native SMS and voice MFA, the passkey dynamic migration nudge, Graph API opt-out mechanics, and customer-managed telephony."
   ---

## Introduction

For over fifteen years, SMS text messages and automated voice calls served as the universal fallback of multi-factor authentication (MFA). They were simple, required no specialized software or hardware, and worked on any mobile phone on Earth. However, the modern threat landscape has fundamentally broken telephony-based authentication. Between automated SIM swapping, Signaling System No. 7 (SS7) interception, adversary-in-the-middle (AitM) reverse-proxy phishing frameworks (such as Evilginx), and telecom toll fraud, telephony is no longer a viable security boundary.

Microsoft has announced a definitive roadmap to permanently retire native, Microsoft-provided SMS and voice MFA across Microsoft Entra ID. 

Beginning **September 1, 2026**, passkeys become the default authentication posture in Entra ID. Users currently configured for SMS or voice MFA will be automatically enabled for passkeys and greeted with an in-line **Dynamic Migration Nudge** upon sign-in. By **February 1, 2027**, native Microsoft-managed telephony delivery will be permanently shut down.

This article provides an in-depth architectural and operational breakdown of the transition: the exact milestone timeline, how the passkey dynamic migration nudge operates, how administrators can apply a temporary **opt-out via Microsoft Graph API**, and how to execute a frictionless enterprise migration to cryptographic, phishing-resistant credentials.

---

## 1. Why Telephony MFA Must Die: The Architectural Vulnerabilities

The retirement of SMS and voice verification is not merely an administrative cleanup; it is a structural necessity for Zero Trust identity security. Telephony transports suffer from four critical vulnerabilities:

### 1.1 Adversary-in-the-Middle (AitM) Reverse Proxies
Standard SMS and voice one-time passcodes (OTPs) lack **cryptographic origin binding**. When an attacker deploys an AitM proxy framework, the victim is presented with a mirrored login portal. When the user enters their 6-digit SMS OTP, the proxy forwards it to Entra ID in real time, intercepts the resulting session token and Primary Refresh Token (PRT) cookie, and achieves full account takeover—completely bypassing MFA.

### 1.2 SIM Swapping & SS7 Protocol Interception
Telephony relies on cellular carrier networks that are vulnerable to social engineering and technical exploitation:
* **SIM Swapping:** Attackers impersonate victims at carrier retail stores or bribe carrier employees to transfer the victim's phone number to an attacker-controlled SIM card.
* **SS7 / Diameter Exploits:** Attackers exploit legacy signaling protocols between global telecommunication carriers to redirect SMS text messages and eavesdrop on phone calls without user knowledge.

### 1.3 Telephony Toll Fraud & Artificial Traffic Pumping
Attackers weaponize registration and password reset portals using automated bots to trigger millions of international SMS verification messages to premium-rate numbers owned by the attacker (*SMS pumping* or *Artificially Inflated Traffic*). This generates massive unexpected telephony costs for organizations and cloud providers alike.

### 1.4 Operational Friction & Telemetry Disparity
Telemetry from real-world Entra ID deployments illustrates the vast operational gap between legacy telephony and modern credentials:

| Metric | SMS & Voice Telephony | Passkeys (FIDO2 / WHfB) |
| :--- | :--- | :--- |
| **Average Sign-In Latency** | 69 seconds (waiting for SMS/call) | **3 seconds** (instant biometric gesture) |
| **Sign-In Success Rate** | ~30% in challenging carrier conditions | **95% – 99%** |
| **Phishing Resistance** | ❌ Vulnerable to AitM & SIM swaps | ✅ **100% Cryptographically Phishing-Resistant** |
| **Carrier / Delivery Cost** | High (recurring per-message/call rates) | **$0 (Zero telecom cost)** |
| **Offline Capability** | ❌ Requires cellular coverage | ✅ Works completely offline |

---

## 2. The Milestone Timeline: From Passkey Default to Native Telephony Shutdown

Microsoft is executing the retirement across four distinct phases:

![Microsoft Entra ID: SMS & Voice MFA Retirement Roadmap](/blog/assets/sms-voice-retirement-timeline.png)

### Phase 1: Passkey Default & Dynamic Migration (September 1, 2026)
* **Default Posture:** Passkeys become the default authentication method in Microsoft Entra ID.
* **Auto-Enablement:** All users currently enabled for SMS or voice verification in the modern Authentication Methods Policy (or legacy tenant MFA settings) are automatically enabled for Passkeys (FIDO2).
* **Dynamic Nudge Activation:** Entra ID begins displaying in-line registration prompts (*nudges*) when targeted users complete an SMS or voice MFA challenge.
* **Temporary Opt-Out Available:** Administrators can suppress these automated nudges using a new Microsoft Graph API policy property (`optOutSettings.passkeyDynamicMigration`).

### Phase 2: Partner Ecosystem Announcement (September 18, 2026)
* **Certified Telecom Providers:** Microsoft publishes the official list of certified third-party telecommunication providers supported through the **Microsoft Security Store**.
* **Commercial & Rate Cards:** Pricing models and regional rate structures for customer-managed telephony are made available for planning.

### Phase 3: Customer-Managed Telephony (BYOT) Configuration Opens (October 30, 2026)
* **Portal Integration:** Tenant administrators can begin connecting third-party telephony gateways to their Entra ID tenant.
* **End-to-End Testing:** Organizations requiring telephony for regulatory or legacy reasons can route and validate SMS and voice delivery through their own customer-managed provider.

### Phase 4: Full Native Retirement (February 1, 2027)
* **Permanent Shutdown:** Microsoft-provided native SMS and voice MFA delivery is permanently turned off.
* **Hard Failure for Unmanaged Telephony:** Any authentication attempt relying on SMS or voice that is not connected to a customer-managed provider via the Microsoft Security Store will fail immediately.
* **Expiration of Opt-Out:** The `passkeyDynamicMigration` opt-out flag expires and provides no further extension.

---

## 3. Under the Hood: The Passkey Dynamic Migration Nudge

To accelerate passwordless adoption without requiring administrators to manually configure tenant-wide registration campaigns, Entra ID introduces **Dynamic Migration Nudges**.

![Passkey Nudge and Opt-Out Evaluation Flow](/blog/assets/passkey-nudge-and-optout-flow.png)

### 3.1 The In-Line Sign-In Experience
When an end user signs in:
1. The user provides their primary credential (username and password) and completes their existing secondary factor (SMS OTP or voice call approval).
2. The Entra ID Dynamic Migration Engine inspects the tenant's policy configuration and user method state.
3. If the user is enabled for SMS/Voice and has not yet registered a passkey, Entra ID intercepts the sign-in pipeline and displays the **Passkey Registration Nudge**:

> *"Create a passkey for faster, safer sign-in. With a passkey, you can sign in using your face, fingerprint, or PIN without waiting for text messages."*

4. **Action Options:**
   * **Create Passkey:** The browser initiates the standard W3C WebAuthn ceremony. The user registers a device-bound passkey (Windows Hello, Apple Touch ID / Face ID, or a FIDO2 hardware key) or a synced passkey (iCloud Keychain, Google Password Manager, or Microsoft Authenticator). The credential is bound to the Entra ID tenant origin (`login.microsoftonline.com`).
   * **Snooze / Skip:** If the user is currently unable to register (e.g., on a public kiosk or shared device), they can select *"Skip for now"*. The sign-in completes immediately. The nudge will reappear after the snooze interval expires until the maximum dismissal limit is reached.

---

## 4. The Administrative Emergency Brake: Suppressing the Nudge via Graph API

While dynamic nudges drastically accelerate user onboarding, enterprise IT environments frequently require strict change management windows, specialized communication campaigns, or tailored helpdesk training before end users encounter new interactive login prompts.

Microsoft provides a dedicated setting in the **Authentication Methods Policy** to temporarily opt out of the automatic passkey enablement and dynamic migration nudges.

### 4.1 Configuring the Opt-Out via Microsoft Graph API

Administrators with the **Authentication Policy Administrator** or **Global Administrator** role can update the tenant policy using the Microsoft Graph `/beta` endpoint:

#### HTTP Request
```http
PATCH https://graph.microsoft.com/beta/policies/authenticationmethodsPolicy
Content-Type: application/json
Authorization: Bearer <Access-Token>

{
  "optOutSettings": {
    "passkeyDynamicMigration": true
  }
}
```

#### Verification via GET Request
```http
GET https://graph.microsoft.com/beta/policies/authenticationmethodsPolicy?$select=optOutSettings
```

#### Expected JSON Response
```json
{
  "@odata.context": "https://graph.microsoft.com/beta/$metadata#policies/authenticationMethodsPolicy(optOutSettings)",
  "optOutSettings": {
    "passkeyDynamicMigration": true
  }
}
```

---

### 4.2 Configuring the Opt-Out via Microsoft Graph PowerShell

For administrators managing tenants through automated deployment scripts and PowerShell:

```powershell
# Install and connect to Microsoft Graph Beta module
Install-Module Microsoft.Graph.Beta -Scope CurrentUser
Connect-MgGraph -Scopes "Policy.ReadWrite.AuthenticationMethod"

# Construct payload to suppress dynamic passkey migration
$policyBody = @{
    optOutSettings = @{
        passkeyDynamicMigration = $true
    }
}

# Apply setting to tenant Authentication Methods Policy
Update-MgBetaPolicyAuthenticationMethodPolicy -BodyParameter $policyBody

# Verify active status
$currentPolicy = Get-MgBetaPolicyAuthenticationMethodPolicy -Property optOutSettings
$currentPolicy.OptOutSettings.PasskeyDynamicMigration
```

---

### 4.3 Critical Operational Warnings Regarding the Opt-Out

> [!WARNING]
> **The Opt-Out Does NOT Delay the February 1, 2027 Telephony Shutdown**
> Setting `passkeyDynamicMigration = true` strictly suppresses the *automatic passkey enablement* and the *in-line dynamic sign-in nudge*. It **does not** extend Microsoft's native SMS and voice service lifetime. On February 1, 2027, Microsoft-provided SMS and voice will be completely terminated regardless of your opt-out configuration.

> [!IMPORTANT]
> **Alternative User-Level Control: Policy Scoping**
> The dynamic migration engine only targets users who are actively enabled for SMS or Voice within the tenant's Authentication Methods Policy. If you remove specific security groups from the SMS and Voice method policies prior to September 1, 2026, those users will not receive the dynamic passkey migration nudge.

---

## 5. Architectural Fork in the Road: Evaluating Your Transition Options

As organizations plan their decommission of native SMS and voice MFA, they must choose between two distinct transition paths:

![Telephony to Passkey Migration Architecture](/blog/assets/telephony-to-passkey-architecture.png)

### Path A: Phishing-Resistant MFA & Passwordless (The Strategic Standard)

Path A represents Microsoft's recommended enterprise posture. Organizations migrate users directly to modern, cryptographic authenticators:

1. **Passkeys (FIDO2):**
   * **Device-Bound Hardware Keys:** Physical YubiKeys or Feitian security keys for privileged admins and high-security personnel.
   * **Microsoft Authenticator Passkeys:** Device-bound passkeys created inside the secure enclave of iOS and Android devices.
   * **Synced Passkeys:** Apple iCloud Keychain and Google Password Manager for standard enterprise knowledge workers.
2. **Platform Credentials:**
   * **Windows Hello for Business (WHfB):** Hardware TPM 2.0-bound credentials providing silent single sign-on (SSO) and biometric unlock.
   * **Platform Credential for macOS:** Secure Enclave-backed credentials leveraging Apple Enterprise SSO (SSOe) and Touch ID.
3. **Certificate-Based Authentication (CBA):** Direct X.509 PKI authentication for smartcards, PIV/CAC cards, and mobile certificate profiles.

**Key Benefits:** Total immunity to AitM reverse-proxy phishing, zero telecom overhead, 3-second login times, and full compliance with NIST SP 800-63B and US Executive Order 14028.

---

### Path B: Customer-Managed Telephony (BYOT - The Legacy Exception)

For organizations constrained by specific regulatory compliance mandates, specialized operational hardware (such as legacy SCADA terminals), or frontline environments where users possess only basic feature phones without app capabilities:

1. **Microsoft Security Store Integration:** Organizations procure and configure a certified third-party telecom provider gateway (available starting October 30, 2026).
2. **Direct Carrier Billing:** All SMS verification messages and voice calls are billed directly to the customer by the third-party telecommunications provider based on regional consumption volume.
3. **Security Tradeoffs:** Telephony remains inherently phishable and vulnerable to SIM swapping. Telephony should be restricted to isolated security groups using strict Conditional Access policies.

---

## 6. Collateral Impacts: SSPR, Authentication Strengths & Converged Policy

The retirement of SMS and voice verification impacts several interconnected identity subsystems:

### 6.1 Self-Service Password Reset (SSPR) Disruption
In many legacy environments, SSPR policies were configured to require **2 methods** for password reset, with SMS text message acting as the primary second factor.
* **The Risk:** When native SMS is shut down on February 1, 2027, users who only registered an office or mobile phone number will be unable to satisfy the 2-method SSPR requirement, resulting in immediate helpdesk lockouts.
* **The Fix:** Organizations must update their SSPR policies to allow Microsoft Authenticator push notifications, Passkeys, Email OTP, or Temporary Access Passes (TAP).

### 6.2 Conditional Access Authentication Strengths Alignment
Rather than waiting for the global retirement deadline, security teams should implement **Conditional Access Authentication Strengths**:
* Deploy custom Authentication Strengths requiring **Phishing-Resistant MFA** (Passkeys, WHfB, CBA) for administrative portals (Azure Portal, Entra Admin Center, Intune).
* Deploy **Passwordless MFA** strengths for general M365 and cloud application access.
* Exclude SMS and Voice from all newly created Conditional Access policies.

### 6.3 Finalizing Policy Migration (`Migration Complete`)
Ensure your tenant has transitioned to the `Migration Complete` state in the Authentication Methods Policy. If a tenant remains in `Pre-migration` or `Migration in Progress`, legacy MFA service settings and legacy SSPR toggles can inadvertently keep SMS/Voice active in unintended scopes.

---

## 7. Enterprise Migration Playbook: Step-by-Step SOP for Identity Teams

To ensure a seamless transition before the February 2027 deadline, identity teams should execute the following phased migration playbook:

```
[Phase 1: Discovery & Telemetry Audit]
   ├── Query Sign-in logs for SMS/Voice authentication methods
   └── Identify users with single-factor telephony registrations
[Phase 2: Bootstrap & Registration Campaigns]
   ├── Deploy Temporary Access Pass (TAP) for initial passkey provisioning
   └── Enable targeted Registration Campaigns with controlled snooze limits
[Phase 3: Administrative Opt-Out (If Runway Needed)]
   └── Apply passkeyDynamicMigration = true via Graph API during prep window
[Phase 4: Telephony Policy Scoping & SSPR Update]
   ├── Transition tenant to Authentication Methods Policy "Migration Complete"
   └── Update SSPR recovery factors to modern authenticators
[Phase 5: Decommission & Enforce Phishing Resistance]
   ├── Disable SMS and Voice methods tenant-wide
   └── Enforce Phishing-Resistant Authentication Strengths via Conditional Access
```

---

### Step 1: Telemetry Audit via Kusto Query Language (KQL)

Identify all users and applications in your tenant currently authenticating via telephony by running the following KQL query in **Log Analytics** (connected to Entra ID `SigninLogs`):

```kql
// Identify users authenticating via SMS or Voice MFA in the last 30 days
SigninLogs
| where TimeGenerated > ago(30d)
| where ResultType == 0 // Successful sign-ins
| extend AuthDetails = parse_json(AuthenticationDetails)
| mv-expand AuthDetails
| extend AuthMethod = tostring(AuthDetails.authenticationMethod)
| where AuthMethod in ("Text message", "Phone call", "SMS", "Voice")
| summarize 
    LastUsedTime = max(TimeGenerated),
    TelephonyLoginCount = count(),
    ApplicationsUsed = make_set(AppDisplayName, 10)
    by UserPrincipalName, UserId, AuthMethod
| order by TelephonyLoginCount desc
```

---

### Step 2: Provisioning Passwordless Credentials with Temporary Access Pass (TAP)

To enable users to register passkeys without ever entering a vulnerable password or waiting for an SMS verification code, deploy **Temporary Access Pass (TAP)** as a secure bootstrapping mechanism:

1. Configure the TAP policy under **Entra ID > Authentication methods > Temporary Access Pass**.
2. Issue a short-lived (e.g., 1-hour), one-time use TAP to the onboarding user.
3. The user navigates to `https://mysignins.microsoft.com/security-info`, authenticates using the TAP, and immediately provisions their FIDO2 passkey or Microsoft Authenticator credential.

---

### Step 3: Configuring Custom Registration Campaigns (Nudge Control)

If you prefer to maintain full control over the registration campaign cadence rather than relying on default Microsoft timing, configure a custom registration campaign:

1. Navigate to **Microsoft Entra admin center > Protection > Authentication methods > Registration campaign**.
2. Set **Status** to **Enabled**.
3. Under **Targeting**, include the security group containing your telephony-reliant users.
4. Configure **Snooze duration** (recommended: **3 to 7 days**) and **Maximum dismissals** (recommended: **3**).

---

### Step 4: Disabling Telephony and Enforcing Phishing Resistance

Once telemetry indicates that over 95% of active users have adopted passkeys or Authenticator:
1. Navigate to **Authentication methods > Policies > SMS** and **Voice call**.
2. Change **Enable** toggle to **Off** (or scope to a strictly managed exception group).
3. In **Conditional Access > Policies**, update your baseline MFA policies to require **Phishing-resistant MFA** or **Passwordless MFA** Authentication Strengths.

---

## 8. Summary & Strategic Outlook

The retirement of SMS and Voice as MFA methods represents one of the most critical security milestones in Microsoft Entra ID's history. Telephony was a necessary stepping stone in the early days of cloud computing, but in an era of industrialized AitM phishing kits and AI-driven social engineering, it provides a false sense of security.

By understanding the milestone timeline, leveraging the Microsoft Graph API `passkeyDynamicMigration` opt-out for structured change management, and proactively deploying FIDO2 passkeys and Windows Hello for Business, identity architects can transform this deprecation from an operational disruption into an enterprise-wide triumph for Zero Trust security.
