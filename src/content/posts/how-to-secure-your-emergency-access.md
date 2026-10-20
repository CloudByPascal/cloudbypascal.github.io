---
title: "How to Secure Your Emergency Access Accounts in Microsoft Entra ID"
date: "2026-10-18"
author: "Pascal Riester"
category: "Entra ID"
tags: [EntraID, MFA, Authentication, ZeroTrust, Passkey, SMS, Voice, GraphAPI]
summary: "A practical guide to securing emergency access accounts in Microsoft Entra ID."
cover: "/assets/img/securing-emergency-access-accounts.png"
---

## Introduction

Every Entra ID administrator eventually faces the scenario they hope never happens: a misconfigured Conditional Access policy locks out all administrators, a federated identity provider goes offline, or Privileged Identity Management (PIM) experiences a service degradation. 

Emergency access accounts commonly known as break-glass accounts are your last line of defense when standard administrative sign-in paths fail. They aren't meant for day-to-day operations; they exist strictly to recover tenant control during an outage or lockout. Here is how to configure and harden break-glass accounts in Microsoft Entra ID based on current best practices and real-world operational lessons.

## Why Break-Glass Accounts Are Non-Negotiable

Without dedicated emergency access accounts, recovering from a total tenant lockout requires opening a severity-A support ticket with Microsoft's Data Protection team, a verification process that can take days while your environment remains inaccessible. Break-glass accounts protect you against three primary failure modes:

- **Conditional Access Lockouts:** A broadly scoped policy (for example, blocking all cloud apps or requiring a broken device compliance state) accidentally locks out every administrator.
- **Identity Provider or Federation Outages:** If your organization relies on hybrid authentication (AD FS, Pass-Through Authentication, or a third-party IdP) and the on-premises infrastructure goes down, cloud-native break-glass accounts bypass the outage entirely.
- **Administrative Control Plane Failures:** If PIM becomes unavailable, licenses expire, or an attacker compromises normal admin accounts, permanent break-glass accounts give you an immediate recovery path to revoke sessions and restore control.

## Configuring Emergency Access Accounts

Microsoft's baseline guidance for break-glass accounts has evolved significantly with mandatory MFA enforcement. When setting up your accounts (always deploy **at least two**), stick to the following architecture:

- **Cloud-Native (`*.onmicrosoft.com` Only):** Always create emergency access accounts as cloud-only users on your tenant's default `*.onmicrosoft.com` domain. Never use a custom domain—if your external DNS expires or is misconfigured, you don't want your recovery account tied to a domain that cannot resolve.
- **Strong, Phishing-Resistant MFA:** Register hardware **FIDO2 security keys (Passkeys)** for each break-glass account and store them in separate, physically secure locations (such as fireproof safes in different buildings). Avoid linking these accounts to an individual employee's phone or the Microsoft Authenticator app.
- **Password Configuration:** Even with FIDO2 passkeys, every Entra ID user object still has an underlying password attribute. How you handle it depends on your authentication strategy:
  * **Passwordless (Recommended):** Go full passwordless with FIDO2 security keys and scramble the underlying password so nobody knows it. Microsoft provides a Graph PowerShell approach in their [guidance on removing password usage in Microsoft Entra ID](https://learn.microsoft.com/en-us/entra/identity/authentication/how-to-plan-password-scramble-phishing-resistant-passwordless-authentication#randomize-passwords-for-cloud-user-accounts-in-microsoft-entra-id). Below is a hardened version of the script that removes whitespace characters (which fail if placed at the start or end of an Entra ID password) and avoids installing the entire Graph rollup module:

    ```powershell
    $userId = "<UPN access account emergency of the>"

    function New-RandomPassword {
        [CmdletBinding()]
        param (
            [int]$Length = 64
        )
        # Single quotes prevent backtick escaping; spaces omitted to avoid leading/trailing whitespace errors
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.<>/?\|~'
        $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
        $bytes = New-Object byte[] $Length
        $rng.GetBytes($bytes)
        $password = -join ($bytes | ForEach-Object { $chars[$_ % $chars.Length] })
        $rng.Dispose()
        return $password
    }

    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Install-Module Microsoft.Graph.Authentication, Microsoft.Graph.Users.Actions -Scope CurrentUser
    Import-Module Microsoft.Graph.Users.Actions

    # Note: The executing admin must hold Global Administrator or Privileged Authentication Administrator
    Connect-MgGraph -Scopes "UserAuthenticationMethod.ReadWrite.All" -NoWelcome

    $passwordParams = @{
        UserId                 = $userId
        AuthenticationMethodId = "28c10230-6103-485e-b985-444c60001490"
        NewPassword            = New-RandomPassword
    }
    Reset-MgUserAuthenticationMethodPassword @passwordParams
    ```

  * **Password + MFA:** If you retain a usable password alongside your MFA method, generate a unique password of at least 16 characters (combining uppercase, lowercase, numbers, and special characters), set the password policy to **never expire**, and rotate it immediately after every test or emergency use.
- **Permissions:** Assign the **Global Administrator** role as **permanently active** (do not make it PIM-eligible) with no other Entra ID roles attached. If your break-glass strategy also covers your Azure infrastructure directly, you can assign the **Owner** role scoped to the **Root Management Group**, though keep in mind that a Global Administrator can also elevate access to all Azure subscriptions and management groups via Entra ID properties during an emergency.
- **Account Naming & Obfuscation:** Avoid obvious names like `EmergencyAccess`, `BreakGlass-01`, or `BG-Admin`. While security through obscurity isn't a primary control, obvious naming gives an attacker who gains read access to your directory an immediate target list. Use a naming convention that blends in with standard user or service accounts, and rely on your internal runbook and Object IDs to track them.

## How to create a break-glass account?
The process of creating a break glass account is similar to any other user within your Entra ID.
You can either create the user by using the Entra ID Portal, or by using PowerShell.

### Using the Entra ID Portal

1. Go to the Entra ID Portal and sign in with your Global Administrator account.
2. Click on **Users** and then on **New user**.
3. Fill in the user information:
   - **User name**: Choose a name using a obfuscation naming convention.
   - **Display name**: Choose a display name that blends in with standard user or service accounts.
   - **Role**: Select **Global Administrator**.
   - **Password**: Use the default temporary password provided by Entra ID to log in for the first time.

![Creating a break-glass user in Entra ID](/assets/img/entra-id-new-user-break-glass.png)

4. Click on **Create**.

### Using PowerShell

```powershell
# Install the required modules once
Install-Module Microsoft.Graph.Users -Scope CurrentUser
Install-Module Microsoft.Graph.Identity.Governance -Scope CurrentUser

# Connect to Microsoft Graph
Connect-MgGraph -Scopes @(
    "User.ReadWrite.All"
    "RoleManagement.ReadWrite.Directory"
)

# Define the initial password
$PasswordProfile = @{
    Password                      = "TemporaryPassword123!"
    ForceChangePasswordNextSignIn = $true
}

# Create the user
$User = New-MgUser `
    -AccountEnabled `
    -DisplayName "Max Mustermann" `
    -GivenName "Max" `
    -Surname "Mustermann" `
    -UserPrincipalName "max.mustermann@contoso.com" `
    -MailNickname "max.mustermann" `
    -UsageLocation "DE" `
    -Department "IT" `
    -JobTitle "Systems Engineer" `
    -PasswordProfile $PasswordProfile

# Global Administrator role definition ID
$GlobalAdminRoleId = "62e90394-69f5-4237-9190-012177145e10"

# Assign Global Administrator tenant-wide
$RoleAssignment = @{
    "@odata.type"    = "#microsoft.graph.unifiedRoleAssignment"
    PrincipalId      = $User.Id
    RoleDefinitionId = $GlobalAdminRoleId
    DirectoryScopeId = "/"
}

New-MgRoleManagementDirectoryRoleAssignment `
    -BodyParameter $RoleAssignment

# Display the result
$User | Select-Object Id, DisplayName, UserPrincipalName
```
### How can I restrict management access to your emergency account?
It is quite simple to restrict the ablity to reset passwords or manage MFA-methods of your emergency access account by using [Microsoft Entra Restricted Administrative units](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/admin-units-restricted-management).

![Setup Entra ID administrative Units](assets/img/entra-id-admin-unit-setup.png)

To add your break glass account to the admin unit, you simply select add in the GUI and select your break glass user and click on select.

![Add break glass users to Entra ID administrative Units](assets/img/entra-id-admin-unit-users.png)

You can also use PowerShell to add your break glass account to the admin unit:

```powershell
Connect-MgGraph -Scopes @(
    "User.Read.All"
    "AdministrativeUnit.ReadWrite.All"
)

$adminUnit = Get-MgDirectoryAdministrativeUnit -Filter "displayName eq 'BreakGlass'"
$breakGlassUser = Get-MgUser -UserId "<UPN of emergency access account>"

New-MgDirectoryAdministrativeUnitMember -AdministrativeUnitId $adminUnit.Id -Id $breakGlassUser.Id
```

Now you still need to tackle the issue that at the moment nobody can change user attributes or authentication methods of your break glass users. By default, any global administrator can manage the role assignments within the restricted administrative unit but not the attributes or authentication methods of the users within the restricted administrative unit. You can however assign the role of [Privileged Authentication Administrator](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/microsoft-entra-roles#privileged-authentication-administrator) to both emergency accounts to allow them to reset the passwords of users within the restricted administrative unit. To manage user attributes like name, job title, etc. you need to assign the role of [User Administrator](https://learn.microsoft.com/en-us/entra/identity/role-based-access-control/microsoft-entra-roles#user-administrator) to both emergency accounts.

![Add user admin to emergency access account ](assets/img/entra-id-admin-unit-useradmin.png)

![Add privileged authentication admin to emergency access account ](assets/img/entra-id-admin-unit-privauthadmin.png)