
CLEARPASS
Product Requirements Document
Version 2.2  |  May 2026  |  CONFIDENTIAL
A product by Sparkr Digitals



Product
ClearPass: Corporate Compliance Clearance Platform
Owner
Quadri Ismail, Lead Product Strategist
Company
Sparkr Digitals (UK & Nigeria Registered)
Document Status
Active. Working Draft v1.0
Target Market
Nigeria Federal GovTech / Corporate Compliance
Primary Mandate
NHIA Presidential Directive, September 3, 2025
Domain
clearpass.com.ng





1. Executive Summary
ClearPass is a corporate compliance dashboard that aggregates, verifies, and monitors all mandatory Nigerian federal compliance certificates in one platform. It was conceived in direct response to the September 3, 2025 presidential directive mandating NHIA Health Insurance Certificates for all federal procurement and licence applications, for which no digital verification infrastructure currently exists.
The platform addresses a documented infrastructure gap affecting over 50,000 registered federal contractors in Nigeria. It is built on a proven adoption model, the same mandate-driven pattern used by PenCom's Pension Clearance Certificate system which now processes over 26,000 organisations annually.
ClearPass operates at three levels simultaneously. It gives businesses a single source of truth for their compliance status. It gives MDAs and procurers instant, auditable certificate verification. And it gives NHIA the private-sector verification layer mandated by the presidential directive but not yet delivered.
This document defines the full product requirements for ClearPass Version 1.0, including all user personas, module specifications, user stories, feature definitions, journey maps, and technical architecture requirements for the development team.

2. Product Vision and Strategic Goals
2.1 Vision Statement
To become the single compliance clearance infrastructure that every Nigerian business depends on to participate in the federal economy, starting with NHIA and expanding to cover every mandatory certificate required for federal procurement eligibility.
2.2 Strategic Goals
Become the de-facto private-sector verification layer for the NHIA presidential mandate within 12 months of launch
Onboard 5,000 corporate businesses onto the compliance dashboard within the first 6 months
Integrate with BPP's existing procurement verification feed within 9 months
Achieve API adoption by at least 3 federal MDAs as verification endpoints within 12 months
Generate recurring subscription revenue from businesses while building toward a government technology levy model
2.3 Success Metrics
Monthly Active Companies: businesses with at least one active certificate connected
Certificate Connection Rate: percentage of registered companies with all 6 certificates linked
Verification API Calls: number of MDA-initiated verification requests per month
Renewal Conversion Rate: percentage of expiry alerts that lead to successful renewal
Time to Compliance: average days from registration to full compliance status

2.4 Compliance Health Score: Full Algorithm Specification
The Compliance Health Score is the single most visible number in the entire ClearPass platform. It appears on every dashboard, every report, and every API response. It must be accurate, defensible, and impossible to misread. This section defines the exact algorithm that every developer touching the score must implement consistently.
Design Principles
The score must never mislead. A company that is legally ineligible to bid must not display a score in the green band under any circumstances.
NHIA is the anchor certificate. Its weight and its hard-block rules reflect the September 2025 presidential mandate that created ClearPass.
Time matters. A certificate expiring in 7 days and one expiring in 180 days are not equivalent even if both are technically Active.
Verification quality matters. A certificate confirmed by a government API carries more trust than one approved from a scanned upload.
The formula must adjust for sector. A company exempt from ITF must not be penalised for not holding a certificate that does not apply to it.
The formula weights are internal. The categories are published to users. The exact point allocations are not. This prevents gaming.

The Three Components
The score is calculated from three weighted components. The total possible score is 100 points.
Component A: Certificate Coverage Score (50 points maximum)
Measures whether the required certificates are connected, valid, and in good standing. Each certificate carries a fixed weight reflecting its regulatory importance. The total weight adjusts proportionally when one or more certificates are not applicable to the company sector.
NHIA Certificate
15 points. Anchor certificate. Receives the highest individual weight because it is the direct subject of the September 2025 presidential mandate.
Pension Clearance Certificate (PCC)
10 points. Second highest weight due to long regulatory history and BPP procurement integration.
NSITF Certificate
8 points. Mandatory for all companies regardless of size. Frequently audited.
FIRS TIN and Tax Clearance
8 points. Universally required. Validates the company is a registered taxpayer.
BPP Certificate
5 points. Procurement portal registration. Required to bid but renewals are infrequent.
ITF Certificate
4 points. Applicable only to companies with 11 or more employees. See Sector Adjustment below.


Points earned per certificate vary by certificate state:
Active (181+ days to expiry)
100% of weight
Active (31 to 180 days to expiry)
100% of weight
Expiring Soon (15 to 30 days)
100% of weight. Alert triggered but score not yet reduced.
Expiring Critical (8 to 14 days)
75% of weight. Score begins declining to signal urgency.
Expiring Urgent (1 to 7 days)
40% of weight. Significant score reduction to force attention.
Renewal In Progress
60% of weight. Action has been taken. Score is held above the Expired floor.
Pending Verification (submitted, awaiting review)
50% of weight. The company has done the work. They are not penalised the same as doing nothing.
Expired
0 points. Hard zero. No partial credit.
Not Connected
0 points. Certificate has not been linked or uploaded.


Component B: Compliance Freshness Score (30 points maximum)
Measures the runway before the nearest certificate expiry. This component prevents the dangerous scenario where a company with a certificate expiring in 6 days still shows 83 out of 100 because all 5 other certificates are in perfect health. The freshness score is calculated from the SOONEST-expiring active certificate across all applicable certificates.
181 days or more to nearest expiry
30 points
90 to 180 days
25 points
60 to 89 days
20 points
30 to 59 days
15 points
15 to 29 days
8 points
8 to 14 days
3 points
1 to 7 days
0 points
0 days (expired)
0 points

This component makes it structurally impossible to score above 73 out of 100 (50 from Component A plus 23 max from Freshness when one certificate is at 14 days) when any certificate is within 7 days of expiry. This correctly forces the company into the amber Attention Required band even if Component A is perfect.

Component C: Verification Quality Score (20 points maximum)
Measures the trustworthiness of the certificate data. A certificate verified directly against a government API is more reliable than one approved from a user-uploaded scan. This component incentivises companies to get API-verified certificates and allows MDAs to see at a glance how much of the compliance data is source-confirmed.
Points are distributed equally across all applicable certificates. For a 6-certificate company the allocation is approximately 3.3 points per certificate. For each certificate the score is:
API-verified by government source
Full allocation for that certificate
Admin-reviewed and approved from upload
80% of allocation for that certificate
Pending admin review
0% of allocation
Not connected
0% of allocation

Bottleneck this solves: Nigerian government APIs will experience downtime. During extended outages, all new certificates will enter manual review (admin approval at 80%), depressing Component C scores platform-wide. To prevent this from distorting user perception, a visual indicator showing the percentage of API-verified versus admin-approved certificates appears below the score during any period where two or more government APIs have been offline for more than 6 hours.

Hard Block Rules
These rules override the calculated score in specific circumstances. They exist because a mathematically correct score can still produce a legally misleading result.
Hard Block 1: NHIA Expired Cap
If the NHIA certificate is in Expired or Not Connected state, the displayed score is capped at a maximum of 49 out of 100 regardless of the calculated score from the three components. This reflects the reality that NHIA is the primary condition for federal procurement eligibility under the September 2025 mandate. A company without an active NHIA certificate cannot bid even if every other certificate is perfect.
Hard Block 2: Any Expired Certificate Override
If any single certificate is in Expired state, a red Ineligible to Bid badge is displayed alongside the numeric score. The badge is a separate visual indicator that exists independently of the score value. This prevents a scenario where a company reads an 88 out of 100 score, feels confident, and then has their bid rejected because one certificate expired. The Ineligible badge persists until all expired certificates are renewed regardless of score.
Hard Block 3: Unverified Profile Lock
If a company's RC number has not completed CAC validation, the compliance score displays as Not Available rather than a numeric value. The company can still use the platform but cannot generate a compliance report until their profile is verified.


Procurement Ready Status
Procurement Ready is a separate status from the numeric score. It is a binary determination displayed as a green badge on the dashboard. A company is Procurement Ready only when ALL of the following conditions are simultaneously true:
Overall score is 80 or above
NHIA certificate is in Active state (not Pending, not Expiring Urgent, not Expired)
No certificate is in Expired state
No certificate is in Not Connected state for certificates applicable to the company sector
CAC profile validation is complete
A company can score 85 out of 100 and still not carry the Procurement Ready badge if, for example, their NHIA certificate is in Pending Verification state. This distinction matters enormously for MDA officers reading verification results.

Sector Adjustment Logic
When a certificate is classified as Not Applicable for a company based on its sector and employee count, that certificate is removed from all three component calculations and the remaining certificate weights are redistributed proportionally.
Example: A 7-person IT services firm where ITF is Not Applicable. The 4 ITF points from Component A are redistributed proportionally across the remaining 5 certificates. The total possible score remains 100. The company is never penalised for not holding a certificate that the law does not require them to hold.
Bottleneck this solves: Companies will be misclassified at registration. A misclassified company that genuinely should hold ITF may appear fully compliant without it. The system flags any sector change request for manual review within 1 business day and recalculates the score history retroactively if the change is approved. The score change notification is sent to the primary account contact with an explanation.

Future Score Prediction and At-Risk Warning
The platform calculates and displays a Projected Score alongside the Current Score when any active certificate will expire within the next 30 days. The projected score shows what the current score will become on the expiry date of the soonest-expiring certificate if no renewal action is taken.
Example display: Current Score 94 out of 100. Projected Score on 15 June 2026: 41 out of 100 if NSITF is not renewed.
This feature directly addresses a critical bottleneck: companies are most likely to be blindsided by score drops when they are actively preparing a tender submission. A compliance officer reviewing their dashboard 3 days before a bid deadline must see the projected score on the tender submission date, not just the current score today.
The projected score calculation is triggered whenever any certificate will expire within 60 days. It appears as a warning card on the dashboard with a specific renewal deadline and a direct link to the renewal pathway.

Score at Risk Notification
When a score drop of 20 or more points is projected within the next 14 days, an automated Score at Risk notification is sent via email and SMS to the primary account contact and any team member who receives compliance alerts. This notification is separate from the standard expiry alert system. It communicates the business consequence directly: your score will drop from 91 to 61 in 9 days. This will remove your Procurement Ready status.

What is Published to Users vs What is Internal
The following information is shown to all users: the current numeric score, the Procurement Ready badge status, the Ineligible to Bid badge when active, individual certificate states, the projected score and its trigger date, and the score component categories (Coverage, Freshness, Verification Quality).
The following is internal only and never exposed to any user interface or API response: individual point allocations per certificate, exact weight values per certificate, the precise percentage scores per state within each component. This protects the formula from gaming by compliance consultants who would otherwise optimise certificate acquisition order to inflate scores rather than achieve genuine compliance.

Known Bottlenecks and Pre-Designed Solutions
Bottleneck: Nigerian government API downtime
All certificates affected by offline APIs enter admin review at 80% Component C weight. A platform-wide indicator shows the API status. Scores are recalculated retroactively once the API returns and verifications are completed. Users are never shown a lower score caused by infrastructure they have no control over without that context being visible.
Bottleneck: Score cliff at certificate expiry midnight
The Expiring Urgent band (1 to 7 days) at 40% weight and the Future Score Prediction feature both soften the midnight cliff. The drop from Expiring Urgent to Expired is not a surprise. It is visually communicated and numerically predicted for 7 days before it happens.
Bottleneck: Sector misclassification inflating scores
Any sector classification that removes a certificate from the calculation is logged and visible to the admin portal. The fraud detection module flags companies where the sector classification reduces their required certificates from 6 to fewer than 5, triggering a manual review before the adjusted score is applied.
Bottleneck: Provisional compliance reports during manual review
A company in Pending Verification state on one certificate cannot generate a full Procurement Ready report. They can generate a Provisional Compliance Report clearly watermarked as provisional if their current score is 70 or above, with the pending certificate clearly flagged. This prevents companies from losing tenders on a technicality while awaiting a review that has been submitted and is pending within SLA.
Bottleneck: Multiple companies with same RC number
The system prevents duplicate RC number registration. A second registration attempt with an existing RC number prompts the user to request access to the existing account through the admin portal rather than creating a new account. This prevents score manipulation through account fragmentation.
Bottleneck: Formula changes in future policy updates
All score calculations are versioned. The formula version used for any score calculation is stored with the result. If the Nigerian government changes mandatory certificate requirements, the formula can be updated in the admin Certificate Rule Engine without requiring a code deploy. Historical scores retain the version notation for audit accuracy.


3. User Personas
ClearPass serves six distinct user groups. Each group has different motivations, pain points, and definitions of success. Every product decision must be evaluated against the needs of all six.
3.1 Persona 1: Amaka, the Corporate Compliance Manager
Role
Compliance Manager at a mid-size construction company with 120 staff
Age
34
Location
Victoria Island, Lagos
Goal
Ensure the company is always procurement-ready for federal contracts
Pain Points
Tracks 6 certificates manually across 6 different portals
Pays consultants N300,000 per cycle to compile compliance documents
Lost a N45m contract because NSITF certificate had expired without notice
Has no single dashboard view of overall compliance health
What Success Looks Like
She opens ClearPass every Monday morning, sees all certificates are green, and moves on with her week. She has not used a compliance consultant in 6 months.


3.2 Persona 2: Emeka, the SME Owner
Role
Director of a 12-person IT services firm bidding for his first federal government contract
Age
29
Location
Wuse, Abuja
Goal
Get compliant, win the bid, grow the business
Pain Points
Does not know which certificates he needs or in what order to get them
Cannot afford N300,000 compliance consultants on a startup budget
Intimidated by multiple government portals with different login systems
What Success Looks Like
He registers on ClearPass, follows a guided compliance checklist, gets all 6 certificates within 3 weeks, submits his bid, and wins. ClearPass was his compliance consultant.


3.3 Persona 3: Engr. Bello, the MDA Procurement Officer
Role
Director of Procurement at a federal ministry issuing tenders quarterly
Age
51
Location
Abuja
Goal
Award contracts only to genuinely compliant companies. Avoid audit queries.
Pain Points
Currently verifies compliance by visually inspecting printed certificates from vendors
Has no way to detect forged or photocopied certificates
Verification of 40 bidders takes 3 days before evaluation can begin
Has been audited twice for awarding contracts to companies with expired NSITF
What Success Looks Like
He pastes a company's RC number into ClearPass Verify and gets a real-time, auditable compliance report in under 10 seconds. His pre-qualification process drops from 3 days to 3 hours.


3.4 Persona 4: Dr. Nkechi, the NHIA IT Director
Role
Director of Technology and Digital Services at NHIA headquarters
Age
45
Location
Utako, Abuja
Goal
Deliver the digital verification platform mandated by the September 2025 directive without building from scratch
Pain Points
Internal IT team does not have the capacity to build a verification platform quickly
Procurement process for a government-built system could take 18-24 months
Under political pressure to deliver a working system following the presidential directive
Needs a trusted private-sector partner who understands regulatory data integrity
What Success Looks Like
ClearPass is deployed as the private-sector verification layer in a formal MoU within 90 days. NHIA gets real-time enrollment data and audit trails without building or maintaining any infrastructure.


3.5 Persona 5: Chisom, the Compliance Consultant
Role
Freelance compliance consultant managing 25 corporate clients across Lagos and Abuja
Age
38
Location
Lagos
Goal
Manage more clients, reduce manual work, and protect her recurring fees
Pain Points
Tracks all client certificate expiry dates in a shared Google Sheet
Spends 60% of her time on follow-up rather than strategic advisory
Cannot scale beyond 30 clients without hiring staff
What Success Looks Like
She manages 80 clients through ClearPass as a registered Compliance Partner, earns a monthly platform fee, and spends her time on advisory rather than spreadsheet maintenance.


3.6 Persona 6: Fatima, the HMO Enrollment Officer
Role
Enrollment and Partnerships Officer at a licensed HMO in Abuja
Age
32
Location
Abuja
Goal
Grow HMO enrollment numbers among corporate clients to meet 2026 NHIA targets
Pain Points
Most corporate clients do not know they need NHIA enrollment for procurement eligibility
Enrollment process requires significant back-and-forth paperwork with employers
No digital channel that routes motivated businesses directly to HMO enrollment
What Success Looks Like
ClearPass routes businesses that are missing NHIA certificates directly to her HMO's enrollment portal. She receives 200 qualified inbound leads per month from the platform with minimal outbound effort.


4. User Journey Maps
4.1 Corporate Business Journey: First-Time Compliance
STAGE 1: AWARENESS
Business receives a rejection notice from an MDA stating NHIA certificate is required
Compliance officer searches online for how to get NHIA compliance for procurement
Discovers ClearPass via search, NECA communication, or referral from consultant
STAGE 2: REGISTRATION
Visits clearpass.com.ng and registers with company RC number and email
System auto-validates RC number against CAC database
Company profile is created with a compliance health score of 0 out of 100
STAGE 3: COMPLIANCE ASSESSMENT
ClearPass displays a guided checklist of all 6 required certificates
System checks which certificates already exist in connected government databases
Gap report is generated showing which certificates are missing, expired, or unverified
STAGE 4: CERTIFICATE CONNECTION AND ENROLLMENT
For certificates already held, user uploads or links existing certificate
For NHIA specifically, ClearPass routes user to partner HMO for enrollment with pre-filled company data
System monitors enrollment status and updates compliance score in real time
STAGE 5: ONGOING MONITORING
Company receives 30-day, 14-day, and 7-day alerts before any certificate expires
Compliance officer can download a ClearPass Compliance Report for any tender submission
MDA or procurer can verify company compliance via ClearPass Verify API using RC number
STAGE 6: RENEWAL
Alert triggers renewal pathway with direct link to the relevant agency portal
Upon renewal confirmation, certificate status updates automatically
Compliance score recalculates and company remains procurement-ready

4.2 MDA Procurement Officer Journey: Vendor Verification
STAGE 1: PRE-QUALIFICATION
MDA issues a tender notice requiring full compliance certificate submission
40 vendors submit bids with printed compliance documents
STAGE 2: VERIFICATION
Procurement officer logs into ClearPass MDA Portal using official government email
Pastes or bulk-uploads vendor RC numbers
ClearPass returns real-time compliance status for each vendor in under 30 seconds
STAGE 3: DECISION
System flags non-compliant vendors automatically
Officer downloads a verifiable Pre-Qualification Report for the tender file
Report is timestamped, audit-ready, and includes certificate expiry dates
STAGE 4: AUDIT PROTECTION
All verification queries are logged with officer ID, timestamp, and result
In case of audit, officer can produce full verification trail in one download

4.3 NHIA Institutional Journey: Mandate Delivery
STAGE 1: PARTNERSHIP ACTIVATION
NHIA signs MoU with Sparkr Digitals to operate ClearPass as private-sector verification layer
NHIA provides access to enrollment status API for active NHIA certificate holders
STAGE 2: DATA INTEGRATION
ClearPass integrates with NHIA enrollment database to validate certificate status in real time
NHIA receives anonymised enrollment flow data showing which sectors are enrolling fastest
STAGE 3: COMPLIANCE ENFORCEMENT
NHIA-generated certificates become verifiable via ClearPass Verify at procurement checkpoints
BPP procurement portal integrates ClearPass API as one of the mandatory pre-qualification checks
STAGE 4: REPORTING
NHIA receives monthly compliance dashboard showing total verified companies, sectors, and states
Data feeds into NHIA's Universal Health Coverage enrollment targets

MODULE 01
Authentication and Onboarding
Covering all registration, identity verification, and first-time setup flows for all user types


Epic
Any user, whether a business, MDA officer, NHIA administrator, or compliance consultant, must be able to register, verify their identity, and reach their relevant dashboard in one seamless session without requiring offline document submission.
User Stories
ID
As a...
I want to...
So that...
US-01.1
Corporate business owner
register my company using my RC number without needing to visit any office
I can start my compliance journey immediately from anywhere
US-01.2
Compliance officer
create sub-accounts for my team members with role-based permissions
my colleagues can update certificates without seeing payment information
US-01.3
MDA procurement officer
register with my official government email and get verified access to the MDA portal
I can begin verifying vendors without going through a lengthy approval process
US-01.4
Compliance consultant
register as a Compliance Partner and link multiple client companies to my account
I can manage all my clients from a single login
US-01.5
New user
complete registration in under 5 minutes on a mobile device
I am not deterred by a complex onboarding process
US-01.6
SME owner with limited tech experience
receive step-by-step guidance during registration
I understand exactly what information to provide and why
US-01.7
Any user
reset my password securely using my registered phone number or email
I am never permanently locked out of my account


Features
Feature
Description
Priority
RC Number Auto-Validation
Real-time lookup against CAC database to confirm company registration status on entry. Invalid RC numbers are flagged immediately with guidance.
P0 - Must Have
Multi-Role Registration
Separate registration flows for Corporate Business, MDA Officer, Compliance Partner, and HMO Partner with tailored onboarding steps for each.
P0 - Must Have
BVN-Linked Identity Verification
For individual business owners and sole proprietors, identity is confirmed via BVN lookup to prevent ghost company registrations.
P0 - Must Have
Government Email Verification
MDA officers must register with a .gov.ng email address. System validates domain against a whitelist of registered MDAs.
P0 - Must Have
Team and Sub-Account Management
Primary account holder can create up to 10 sub-accounts with configurable permissions: View Only, Edit Certificates, Full Admin.
P1 - Should Have
Compliance Partner Dashboard
Consultants registered as Compliance Partners get a dedicated portal showing all linked client companies, their aggregate health scores, and upcoming expirations.
P1 - Should Have
Guided Onboarding Checklist
First-time users are walked through a 5-step setup checklist with progress indicators, tooltips explaining each certificate, and estimated time to full compliance.
P0 - Must Have
Mobile-Optimised Registration
Full registration flow is functional on mobile browsers with no app download required. Forms are chunked into single-question screens on mobile.
P0 - Must Have
Offline Fallback for USSD
Businesses without internet access can register via USSD shortcode, receive an SMS with a web link to complete setup when connectivity is available.
P2 - Nice to Have


Acceptance Criteria
AC-01.1: Registration with a valid RC number completes in under 5 minutes including CAC validation
AC-01.2: Invalid RC numbers return an error with specific guidance within 3 seconds
AC-01.3: Government email addresses not on the MDA whitelist are rejected with an explanation
AC-01.4: Sub-account creation and permission assignment works without logging out of the primary account
AC-01.5: Password reset via phone OTP completes in under 2 minutes
AC-01.6: All registration flows render correctly on Chrome mobile on Android with no horizontal scrolling

MODULE 02
Company Profile and Certificate Registry
The central record of a company's identity, structure, and compliance certificate portfolio


Epic
Every registered company has a verified profile that serves as the single source of truth for its identity and compliance status. This profile is the foundation on which all certificate verification, reporting, and API queries are built.
User Stories
ID
As a...
I want to...
So that...
US-02.1
Compliance officer
see my company's complete profile including CAC details, sector, and employee count in one place
I can verify that our registered information is accurate before sharing it with MDAs
US-02.2
Business owner
connect all 6 mandatory compliance certificates to my company profile
they are all tracked in one place and I never miss an expiry
US-02.3
MDA officer
search any company by RC number or name and see their verified compliance profile
I can confirm eligibility quickly during pre-qualification
US-02.4
Compliance officer
upload supporting documents alongside each certificate
I have a full document trail if we are ever audited
US-02.5
Business owner
see a single compliance health score for my company out of 100
I can communicate our compliance status internally at a glance
US-02.6
Compliance consultant
update certificate information on behalf of a client company
I can fulfil my service obligation without sharing login credentials


Features
Feature
Description
Priority
Verified Company Profile
Auto-populated company data from CAC lookup including registered name, RC number, date of incorporation, directors, registered address, and sector classification.
P0 - Must Have
Certificate Portfolio View
Unified view of all 6 certificates with status badges (Active, Expiring Soon, Expired, Not Connected), expiry dates, issuing authority, and certificate reference numbers.
P0 - Must Have
Compliance Health Score
Dynamic score out of 100 calculated from number of active certificates, days to nearest expiry, and verification status. Score updates in real time when any certificate changes.
P0 - Must Have
Document Vault
Secure file storage for uploaded certificate PDFs and supporting documents. Maximum 10MB per file, 500MB per company.
P1 - Should Have
Certificate History Log
Full audit trail of every certificate status change including who updated it, when, and what the previous status was.
P0 - Must Have
Shareable Compliance Link
A unique, public-facing URL that shows a read-only, real-time view of a company's compliance status. Designed to be shared with procurers in lieu of physical documents.
P1 - Should Have
Sector and Size Classification
Companies are classified by sector (Construction, IT Services, Healthcare, etc.) and employee band (1-10, 11-50, 51-200, 200+). Used to tailor certificate guidance and NHIA plan recommendations.
P1 - Should Have

Acceptance Criteria
AC-02.1: When a company registers with a valid RC number, the system auto-populates company name, date of incorporation, registered address, and director names from the CAC database within 10 seconds of registration
AC-02.2: When a company profile is first created, the compliance health score displays as 0 out of 100 until at least one certificate is connected
AC-02.3: A company with all 6 certificates in Active state and no certificate expiring within 30 days displays a health score of 100 out of 100
AC-02.4: When any team member updates a certificate, the certificate history log records the team member name, timestamp, previous status, and new status within 1 minute of the change
AC-02.5: The shareable compliance link displays the company current certificate statuses and health score to a visitor who is not logged in, with no ability to edit any data
AC-02.6: A compliance consultant with write permissions on a client account can update certificate information and the change log records the consultant name not the company primary owner name
AC-02.7: When a user attempts to upload a file exceeding 10MB to the Document Vault, the upload is rejected before completion and an error message states the 10MB file size limit
AC-02.8: When a company document vault reaches 500MB total, new uploads are blocked and the user sees a storage limit notification with instructions to delete existing files


MODULE 03
Certificate Management Engine
Tracks, validates, and monitors all 6 mandatory federal compliance certificates for every registered company


Epic
The core engine of ClearPass. Every mandatory certificate has its own lifecycle state machine, validation logic, expiry tracking, and renewal pathway. The engine must support both manual certificate linking and automated API-based verification where government systems permit.
The 6 Mandatory Certificates
1. NHIA Certificate
Health Insurance Certificate issued by the National Health Insurance Authority. Mandatory for all federal procurement since September 2025 presidential directive.
2. PCC
Pension Clearance Certificate issued by PenCom confirming pension contribution compliance for all employees.
3. NSITF Certificate
Nigeria Social Insurance Trust Fund compliance certificate confirming employee injury insurance contributions.
4. ITF Certificate
Industrial Training Fund certificate confirming training levy payment based on employee count.
5. FIRS TIN
Federal Inland Revenue Service Tax Identification Number with valid tax clearance confirmation.
6. BPP Certificate
Bureau of Public Procurement Interim Registration Report or Certificate of Registration on the National Database of Federal Contractors.


User Stories
ID
As a...
I want to...
So that...
US-03.1
Compliance officer
connect my existing NHIA certificate by entering its reference number
the system validates it directly with NHIA and confirms it is genuine
US-03.2
Compliance officer
receive an alert 30 days before any certificate expires
I have time to renew before it affects our procurement eligibility
US-03.3
SME owner
see a step-by-step guide on how to apply for each certificate I do not have yet
I can get compliant without hiring a consultant
US-03.4
Compliance officer
see which certificates are mandatory for my specific sector
I am not chasing certificates that do not apply to my business
US-03.5
MDA officer
see the exact expiry date and issuing authority for each certificate a vendor presents
I can confirm it is valid on the date of tender submission
US-03.6
System admin
update the validation rules for any certificate when government requirements change
the platform stays current without requiring a full system redeploy
US-03.7
Business owner
upload a scanned certificate as a temporary placeholder while API verification is being set up
I am not blocked from using the platform during the integration phase


Features
Feature
Description
Priority
Certificate State Machine
Each certificate cycles through defined states: Not Connected, Pending Verification, Active, Expiring (30 days), Expiring (7 days), Expired, Renewal In Progress. State transitions trigger automated notifications.
P0 - Must Have
API-Based Certificate Validation
Where government APIs are available (PenCom PCC, FIRS TIN), ClearPass validates certificates by querying source systems directly. No manual review required.
P0 - Must Have
Manual Upload with Admin Review
For certificates where no API exists yet, users upload a scanned copy which is reviewed by a ClearPass compliance reviewer within 24 business hours.
P0 - Must Have
NHIA Enrollment Router
Companies without an NHIA certificate are routed to the NHIA enrollment flow with company data pre-filled. System tracks enrollment progress and updates certificate status on completion.
P0 - Must Have
Sector-Specific Certificate Guidance
Based on the company's sector and employee count, the system indicates which certificates are mandatory, which are recommended, and which are not applicable.
P1 - Should Have
Expiry Alert Engine
Configurable alerts at 30 days, 14 days, and 7 days before expiry. Alerts sent via email, SMS, and in-app notification. Each alert includes the renewal pathway link.
P0 - Must Have
Certificate Application Guides
Step-by-step guides for obtaining each certificate from scratch, including portal links, required documents, estimated processing time, and typical fees.
P1 - Should Have
Bulk Certificate Import
Compliance consultants can bulk-import certificate data for multiple client companies via a structured CSV template.
P2 - Nice to Have
Certificate Rule Engine
Admin-configurable rules for each certificate type including validation logic, expiry thresholds, renewal lead times, and mandatory-versus-recommended classifications.
P1 - Should Have

Acceptance Criteria
AC-03.1: A certificate automatically transitions from Active to Expiring (30 days) state when its expiry date is exactly 30 calendar days away and triggers an alert notification within 1 hour of the state change
AC-03.2: A certificate automatically transitions from any expiring state to Expired at 00:01 WAT on the day after the expiry date with no manual action required
AC-03.3: When a PenCom PCC API validation returns a valid certificate, the certificate status in ClearPass updates to Active within 60 seconds of the API response
AC-03.4: When a government API call fails or times out after 10 seconds, the system enters the manual review fallback within 30 seconds and notifies the user with a 24-business-hour estimated review time
AC-03.5: A certificate submitted for manual review appears in the admin review queue within 5 minutes of submission
AC-03.6: A certificate rejected during manual review generates a notification to the submitting user within 1 hour that includes the specific rejection reason entered by the reviewer
AC-03.7: The NHIA enrollment router pre-fills at minimum: company name, RC number, employee count, sector classification, and primary contact email when redirecting a user to the selected HMO portal
AC-03.8: The sector-specific certificate guidance correctly marks ITF as Not Applicable for companies in the employee band 1 to 10 and marks it as Mandatory for companies with 11 or more employees
AC-03.9: A certificate in Renewal In Progress state does not reduce the company health score below the score it held at the start of the renewal window until the renewal either succeeds or fails
AC-03.10: The certificate state machine correctly blocks a certificate from transitioning directly from Not Connected to Active without passing through Pending Verification first


MODULE 04
Compliance Dashboard and Analytics
The primary interface for businesses monitoring their ongoing compliance health


Epic
The dashboard is the product. It must deliver an immediate, unambiguous answer to the most important question a compliance officer asks every week: are we ready to bid? Everything else is secondary to that single answer.
User Stories
ID
As a...
I want to...
So that...
US-04.1
Compliance officer
see my overall compliance health score the moment I log in
I do not need to navigate multiple screens to understand our current status
US-04.2
Compliance officer
see which certificates are expiring soonest in a priority-ordered list
I always know what to act on first
US-04.3
Finance director
see the total cost of upcoming certificate renewals in the next 90 days
I can budget for compliance spend accurately
US-04.4
Compliance consultant
see all my client companies on one screen ranked by compliance health score
I know which clients need my attention this week without opening each account individually
US-04.5
Business owner
download a one-page compliance summary report I can attach to a tender submission
I can prove our compliance status to procurers without logging them into our account
US-04.6
Compliance officer
filter my certificate view by status, expiry date, and certificate type
I can quickly isolate the issues that need action


Features
Feature
Description
Priority
Compliance Health Score Widget
Prominent score out of 100 displayed on the dashboard hero area. Colour-coded: 80-100 green (Procurement Ready), 50-79 amber (Attention Required), below 50 red (Not Eligible). Animated score ring updates in real time.
P0 - Must Have
Certificate Status Cards
Six certificate cards displayed in a grid. Each card shows: certificate name, current status badge, expiry date, days remaining, and a single action button (Renew, Connect, or Verify).
P0 - Must Have
Expiry Timeline
A chronological view of all upcoming certificate expirations in the next 180 days, displayed as a timeline with colour-coded urgency indicators.
P1 - Should Have
Compliance Partner Multi-Client View
Consultants see a table of all client companies with columns for company name, health score, certificates active, nearest expiry, and a one-click access button.
P1 - Should Have
Compliance Report Export
On-demand generation of a PDF compliance report formatted for tender submission. Includes company details, all certificate statuses with reference numbers, expiry dates, and a ClearPass verification QR code.
P0 - Must Have
Activity Feed
Chronological log of all recent actions on the account: certificate connected, expiry alert sent, renewal completed, verification query received. Visible to all team members.
P1 - Should Have
Renewal Cost Forecast
Dashboard widget showing estimated renewal costs for certificates expiring in the next 90 days, based on publicly available certificate fees.
P2 - Nice to Have

Acceptance Criteria
AC-04.1: The compliance health score widget loads on the dashboard within 2 seconds of login when tested on a simulated 3G mobile connection of 1.5 Mbps
AC-04.2: Certificate status cards are displayed in urgency order with Expired cards first, then Expiring Soon cards, then Active cards, regardless of certificate type
AC-04.3: A compliance report PDF is generated and available for download within 30 seconds of the user clicking the export button on a standard broadband connection
AC-04.4: The generated compliance report PDF contains all of the following without exception: company RC number, all 6 certificate statuses, certificate reference numbers, expiry dates, health score, report timestamp, unique report ID, and a scannable QR verification code
AC-04.5: The compliance partner multi-client view loads all linked companies within 3 seconds for accounts with up to 50 linked clients
AC-04.6: Applying a filter for status Expired returns only certificates in Expired state with no Active or Expiring Soon certificates included in the results
AC-04.7: The renewal cost forecast displays N0 for companies with no certificates expiring in the next 90 days and displays the correct sum when multiple certificates are expiring within that window


MODULE 05
Notifications and Alert Engine
Proactive, multi-channel communication system that keeps every user informed before problems occur


Epic
The notification engine is what converts ClearPass from a passive registry into an active compliance partner. A user should never be surprised by an expired certificate. The system must reach users through every channel available to them.
User Stories
ID
As a...
I want to...
So that...
US-05.1
Compliance officer
receive an email and SMS 30 days before any certificate expires
I have enough time to complete the renewal process without rushing
US-05.2
Compliance officer
configure which team member receives which type of alert
the right person is notified without everyone being copied on everything
US-05.3
Business owner
receive a weekly digest summary every Monday showing my overall compliance status
I stay informed without being overwhelmed by individual notifications
US-05.4
Compliance consultant
receive a single weekly digest for all my client companies showing who needs attention
I can plan my client work for the week from one email
US-05.5
MDA officer
be notified when a vendor I have bookmarked for an upcoming tender has a certificate expire
I can flag potential pre-qualification issues before the submission deadline
US-05.6
Any user
control my notification preferences and opt out of specific alert types
I receive only the communications that are relevant to my role


Features
Feature
Description
Priority
Multi-Channel Alert Delivery
All expiry alerts are delivered simultaneously via: in-app notification, email to registered address, and SMS to registered phone number. Delivery status is tracked for each channel.
P0 - Must Have
Configurable Alert Thresholds
Default alerts at 30, 14, and 7 days before expiry. Account admins can add custom thresholds (e.g., 60 days for certificates with long renewal processing times like PCC).
P1 - Should Have
Role-Based Alert Routing
Alerts can be routed to specific team members based on certificate type. For example, NSITF alerts go to HR, TIN alerts go to Finance, and NHIA alerts go to Compliance.
P1 - Should Have
Weekly Compliance Digest
Every Monday at 8am, each user receives a digest email summarising overall health score, certificates expiring this month, and actions taken last week.
P1 - Should Have
Consultant Multi-Client Digest
Compliance Partners receive a consolidated digest covering all client companies, ranked by urgency, with direct links to each client dashboard.
P1 - Should Have
Renewal Completion Confirmation
When a certificate is successfully renewed and updated in ClearPass, the account receives a confirmation notification across all channels.
P0 - Must Have
Notification Preference Centre
Each user can configure notification channels (email only, SMS only, both, none), frequency (immediate, daily digest, weekly digest), and alert types for each certificate.
P1 - Should Have
Escalation Logic
If a 7-day expiry alert is sent but no renewal action is taken within 48 hours, the system escalates by sending a final alert to the account primary contact regardless of notification preferences.
P2 - Nice to Have

Acceptance Criteria
AC-05.1: An expiry alert is delivered via email, SMS, and in-app notification simultaneously within 1 hour of the alert threshold being crossed for the 30-day, 14-day, and 7-day thresholds
AC-05.2: When a user disables SMS notifications in the Notification Preference Centre, no subsequent SMS messages are sent for that account and existing email and in-app alerts continue unaffected
AC-05.3: The weekly digest email is sent between 08:00 and 08:30 WAT every Monday. If Monday falls on a public holiday the digest is sent on the following Tuesday at the same time
AC-05.4: A renewal confirmation notification is delivered across all active channels for an account within 30 minutes of the certificate status updating to Active
AC-05.5: Role-based alert routing correctly sends NSITF alerts only to team members assigned the HR role and does not copy team members assigned Finance or Compliance-only roles
AC-05.6: The escalation alert is triggered exactly 48 hours after the 7-day expiry alert was sent if no certificate renewal action has been recorded in the system during that window
AC-05.7: A user who has opted out of all individual certificate alerts still receives the escalation alert when that certificate crosses the 7-day threshold, with no opt-out path for escalation alerts


MODULE 06
MDA Verification Portal
The government-facing interface for real-time vendor compliance verification at procurement checkpoints


Epic
The MDA portal is ClearPass from the government's perspective. It turns what is currently a 3-day manual document review into a 30-second digital query. It must be fast, auditable, and accessible to non-technical procurement officers.
User Stories
ID
As a...
I want to...
So that...
US-06.1
MDA procurement officer
search any company by RC number and get their full compliance status instantly
I can pre-qualify vendors in minutes rather than days
US-06.2
MDA procurement officer
bulk-verify up to 100 companies at once by uploading a list of RC numbers
I can pre-qualify an entire tender shortlist in one operation
US-06.3
MDA procurement officer
download a stamped, timestamped pre-qualification report for my tender file
I have auditable proof of my verification process
US-06.4
MDA procurement officer
bookmark specific companies that regularly bid for our tenders
I can monitor their compliance status without searching each time
US-06.5
MDA IT administrator
integrate ClearPass verification directly into our existing tender management system via API
compliance verification happens automatically during bid submission
US-06.6
Audit officer
retrieve all verification queries made by our procurement team over the past 12 months
I can demonstrate due diligence during an audit


Features
Feature
Description
Priority
Single Company Lookup
Search by RC number or registered company name. Returns real-time compliance status for all 6 certificates including status, expiry date, and certificate reference number within 10 seconds.
P0 - Must Have
Bulk Verification Upload
Upload a CSV of RC numbers (up to 100 companies per batch). System returns a compliance matrix for all companies within 2 minutes.
P0 - Must Have
Verification Report Export
PDF report of single or bulk verification results. Includes ClearPass digital seal, timestamp, querying officer name, and a QR code linking to a live verification URL.
P0 - Must Have
Company Watchlist
MDA officers can save frequently verified companies to a watchlist and receive alerts if any watchlisted company has a certificate expire.
P1 - Should Have
Verification History Log
Complete audit trail of all verification queries made by the MDA, including officer name, timestamp, company queried, and result returned.
P0 - Must Have
Embed Widget
A verification widget that MDA tender portals can embed on their bid submission pages, triggering automatic compliance checks when a vendor submits a bid.
P2 - Nice to Have
Non-Compliance Flagging
When a queried company is non-compliant, the system displays which specific certificates have failed and when they expired, allowing officers to communicate specific requirements back to the vendor.
P0 - Must Have

Acceptance Criteria
AC-06.1: A single company lookup by valid RC number returns complete compliance status for all 6 certificates within 10 seconds under normal network conditions
AC-06.2: A bulk verification CSV of 100 valid RC numbers returns a complete compliance matrix for all companies within 2 minutes of upload
AC-06.3: The verification report PDF displays the querying officer name, MDA name, date and time of query, and a QR code that resolves to a live verification URL when scanned
AC-06.4: Scanning the QR code on a verification report displays the company current live compliance status within 5 seconds on a mobile device with a standard 4G connection
AC-06.5: When a queried RC number does not exist in the ClearPass database the portal returns a clearly labelled Not Found response that is visually distinct from a non-compliant result
AC-06.6: The verification history log records the officer name, MDA name, timestamp, RC number queried, company name, and result for every query without exception
AC-06.7: A non-compliant result correctly displays the name, expiry date, and number of days expired for every failed certificate in the query result
AC-06.8: The bulk verification result correctly distinguishes between fully compliant, partially compliant, and fully non-compliant companies in three separate visual categories


MODULE 07
API and Government Integrations
The technical backbone connecting ClearPass to government databases for real-time certificate validation


Epic
ClearPass derives its authority from the ability to verify certificates directly at source, not from trusting uploaded documents. The integration layer must establish and maintain live connections to government systems, with graceful fallback to manual review where APIs are not yet available.
Integration Priority Matrix
Priority 1: PenCom PCC API
PenCom already operates a daily-updated verification feed consumed by BPP. ClearPass will integrate this feed to auto-validate PCC status. Highest priority due to existing API maturity.
Priority 2: FIRS TIN API
FIRS provides a TIN verification API through the e-TaxPay system. Integration enables instant TIN validation and tax clearance status checks.
Priority 3: NHIA Enrollment API
To be established through the ClearPass-NHIA MoU. Enables real-time validation of NHIA certificate status and enrollment routing.
Priority 4: CAC RC Validation API
CAC provides company registry lookup through its public portal. Integration enables automatic company profile population on registration.
Priority 5: BPP Database Feed
BPP maintains the National Database of Federal Contractors. Integration enables automatic BPP registration status validation.
Priority 6: NSITF and ITF APIs
Manual upload with admin review until official APIs are established. Integration to be pursued in Phase 2 following MoU with each agency.


User Stories
ID
As a...
I want to...
So that...
US-07.1
Platform
validate PCC certificates by querying PenCom directly rather than trusting uploaded documents
fraudulent certificates cannot be submitted to gain compliance status
US-07.2
Platform
fall back to manual review when a government API is unavailable or returns an error
user workflows are never blocked by government system downtime
US-07.3
MDA IT admin
integrate ClearPass verification into our tender portal via a documented REST API
we do not need to maintain a separate login for ClearPass
US-07.4
ClearPass developer
receive webhook notifications when any integrated government database updates a certificate status
ClearPass data stays current without requiring scheduled polling
US-07.5
Super admin
monitor the health and response time of all government API integrations from a single dashboard
I can proactively address integration failures before they affect users


Features
Feature
Description
Priority
ClearPass Public REST API
Documented REST API for MDA and enterprise integrations. Endpoints for: single company verification, bulk verification, certificate status webhook subscriptions. API key authentication with rate limiting.
P0 - Must Have
Government Integration Connectors
Modular integration connectors for each government database. Each connector has independent timeout handling, retry logic, and fallback states.
P0 - Must Have
Integration Health Monitor
Internal dashboard showing real-time status, response time, error rate, and last successful sync for each government API integration.
P0 - Must Have
Manual Review Fallback
When an API is unavailable, certificate validation enters a manual review queue. User is notified of the fallback and given an estimated review time.
P0 - Must Have
Webhook Event System
Outbound webhooks notify integrated MDA portals of real-time certificate status changes for companies they are tracking.
P1 - Should Have
API Documentation Portal
Public-facing developer documentation at api.clearpass.com.ng covering all endpoints, authentication, rate limits, and code examples in Python, JavaScript, and PHP.
P1 - Should Have
Sandbox Environment
A sandbox API environment with mock data for MDA developers to test integrations before connecting to live data.
P1 - Should Have

Acceptance Criteria
AC-07.1: A valid ClearPass API key successfully authenticates a single verification request and returns a correctly structured JSON response within 5 seconds
AC-07.2: An expired or revoked API key returns an HTTP 401 Unauthorized status code with a JSON error body containing a descriptive message and error code within 1 second
AC-07.3: When a government API returns no response within 10 seconds, ClearPass returns the last cached certificate status with a cache timestamp field in the response indicating when the data was last confirmed
AC-07.4: The Integration Health Monitor updates the status indicator for a government API from Online to Offline within 60 seconds of that API becoming unreachable
AC-07.5: API requests that exceed the defined rate limit return an HTTP 429 Too Many Requests status code with a Retry-After header specifying the number of seconds before the next request is permitted
AC-07.6: The sandbox environment returns mock data that matches the exact field names, data types, and response structure of the production API for all documented endpoints
AC-07.7: A webhook subscription successfully delivers a certificate status change event to the registered endpoint URL within 60 seconds of the status change being recorded in ClearPass


MODULE 08
NHIA Enrollment Routing and HMO Partner Network
The channel that converts compliance-motivated businesses into enrolled NHIA beneficiaries


Epic
Every business that discovers it lacks an NHIA certificate through ClearPass is a motivated, pre-qualified lead for NHIA enrollment. This module converts that motivation into completed enrollment by routing businesses to licensed HMO partners with the least possible friction.
User Stories
ID
As a...
I want to...
So that...
US-08.1
Business owner without NHIA certificate
be shown a clear next step to get enrolled rather than just being told I am non-compliant
I know exactly what to do to fix my compliance gap
US-08.2
Business owner
compare HMO plans available in my state before selecting one
I can choose the plan that best fits my employee size and budget
US-08.3
Business owner
have my company details pre-filled in the HMO enrollment form
I do not have to re-enter information ClearPass already has
US-08.4
HMO enrollment officer
receive leads from ClearPass with company profile and employee count already attached
I can focus on plan selection rather than data collection
US-08.5
HMO partner
see how many enrollment referrals ClearPass has sent to my organisation each month
I can track the value of the partnership
US-08.6
ClearPass admin
track enrollment completion rates for each HMO partner
I can prioritise routing to partners with the highest completion rates


Features
Feature
Description
Priority
NHIA Gap Detection
When a company has no NHIA certificate connected, the system immediately surfaces an enrollment call-to-action with urgency framing based on upcoming procurement deadlines.
P0 - Must Have
HMO Partner Directory
Searchable directory of all NHIA-licensed HMO partners filterable by state, employee size range, plan type, and average premium range.
P1 - Should Have
Pre-Filled Enrollment Handoff
When a business selects an HMO, ClearPass passes company name, RC number, employee count, sector, and contact details to the HMO portal via a secure deep link. No double-entry.
P0 - Must Have
Enrollment Progress Tracking
After the handoff, ClearPass monitors enrollment progress by querying the NHIA API. Businesses see a status tracker showing: HMO Selected, Application Submitted, Under Review, Certificate Issued.
P0 - Must Have
HMO Partner Dashboard
Licensed HMO partners get a ClearPass Partner Portal showing inbound referrals, conversion rates, and enrollment pipeline.
P1 - Should Have
Commission and Revenue Share Tracking
Automated tracking of enrollment commissions earned per HMO referral. Integrated with the Payments module for monthly reconciliation.
P1 - Should Have

Acceptance Criteria
AC-08.1: A company with no NHIA certificate connected sees the enrollment call-to-action prominently displayed on their dashboard within the first session after registration, above all other certificate cards
AC-08.2: The HMO partner directory filter by state returns only HMOs with active operations in the selected state and excludes all others
AC-08.3: The pre-filled enrollment handoff passes at minimum company name, RC number, employee count, sector, and primary contact email to the HMO portal. Any missing field triggers an error that blocks the handoff and prompts the user to complete their company profile first
AC-08.4: The enrollment progress tracker updates from HMO Selected to Application Submitted within 24 hours of the company completing and submitting the HMO enrollment form
AC-08.5: When the NHIA API confirms that a certificate has been issued, the company ClearPass certificate status for NHIA updates to Active within 24 hours of the API confirmation
AC-08.6: The HMO partner dashboard correctly attributes each referred company to the HMO that received the handoff and calculates the commission amount using the configured rate for that HMO without manual input


MODULE 09
Compliance Reports and Audit Trail
Generating verifiable, tamper-evident compliance documentation for procurement submission and regulatory audit


Epic
The ClearPass Compliance Report must be accepted by MDAs as a substitute for physical certificate bundles. This requires reports to be verifiable, timestamped, and linked to live data that can be independently confirmed by any party with the report reference number.
User Stories
ID
As a...
I want to...
So that...
US-09.1
Compliance officer
generate a one-click compliance report for a specific tender submission
I can attach a single verified document rather than a bundle of physical certificates
US-09.2
MDA officer
scan a QR code on a submitted ClearPass report and see the live compliance status it references
I can confirm the report has not been tampered with
US-09.3
Compliance officer
generate a compliance report as at a specific historical date
I can demonstrate our compliance status at the time of a previous tender if audited
US-09.4
Finance director
access a compliance cost report showing all renewal fees paid through ClearPass in the last 12 months
I can include compliance costs accurately in our annual budget
US-09.5
ClearPass super admin
access a platform-wide audit log of all verification queries, report generations, and certificate status changes
I have full visibility for platform governance and regulatory reporting to NHIA


Features
Feature
Description
Priority
Tender-Ready Compliance Report
On-demand PDF report containing: company details, all 6 certificate statuses with reference numbers and expiry dates, health score, report generation timestamp, unique report ID, and QR verification code.
P0 - Must Have
QR-Based Live Verification
Every report carries a unique QR code that links to a live verification page showing current status. If any certificate has expired since the report was generated, the verification page shows the discrepancy.
P0 - Must Have
Point-in-Time Historical Report
Users can generate a report showing their compliance status as of any historical date, using the stored certificate history log as the data source.
P1 - Should Have
Company-Level Audit Trail
Full chronological log of all certificate changes, report generations, team member actions, and API verification queries for each company. Exportable as CSV for external audit.
P0 - Must Have
Platform-Wide Governance Report
Super admin report showing: total active companies, verification queries by MDA, certificate coverage rates by type, NHIA enrollment completions, and monthly trend data. Available for NHIA regulatory reporting.
P1 - Should Have
Compliance Certificate Wallet
A mobile-accessible view of all active certificates in a wallet-style interface. Designed for business owners who need to present compliance status in meetings or on-site visits.
P2 - Nice to Have

Acceptance Criteria
AC-09.1: Scanning the QR code on a compliance report that was generated 30 days ago displays the company current live certificate statuses at the time of scanning, not the statuses at the time the report was generated
AC-09.2: A point-in-time historical report generated for a date 6 months in the past correctly reflects the certificate statuses as stored in the history log for that specific date
AC-09.3: The company-level audit trail records every certificate status change with the name of the user who triggered it and a timestamp accurate to within 1 minute
AC-09.4: The compliance report PDF is rejected with a clear error if the company health score is below 50 at time of generation, and the user is directed to resolve failing certificates before generating a procurement report
AC-09.5: Exporting the company audit trail as CSV produces a complete file with no missing rows for the selected date range, including a header row with all column labels
AC-09.6: The platform-wide governance report figures for total active companies and NHIA enrollment completions are accurate to within a 24-hour data delay and clearly display the last updated timestamp


MODULE 10
Payments and Billing
Subscription management, payment processing, and revenue tracking for all ClearPass revenue streams


Epic
ClearPass has three revenue streams: business subscriptions, MDA API fees, and HMO enrollment commissions. The payments module must handle all three cleanly, including Nigerian payment method preferences, automated invoicing, and subscription lifecycle management.
Pricing Model
Starter (SMEs)
Free. Access to basic dashboard and certificate tracking for up to 3 certificates. No expiry alerts. No report generation. Designed to drive awareness and upgrade.
Business (N60,000/year)
Full access to all 6 certificates, expiry alerts, compliance report generation, and up to 5 team sub-accounts. Recommended for companies bidding for federal contracts.
Enterprise (N200,000/year)
All Business features plus API access, white-label compliance reports, priority certificate review, and dedicated account support. For organisations with 50+ staff or multiple business entities.
Compliance Partner (N120,000/year)
Consultant tier. Manage up to 50 client companies. Multi-client dashboard, client-branded reports, and bulk certificate import.
MDA Verification API
N200 per verification query above 100 free queries per month. Bulk pricing available for MDAs with high query volumes.
HMO Referral Commission
10-15% of first-year HMO premium for each successful enrollment routed through ClearPass.


User Stories
ID
As a...
I want to...
So that...
US-10.1
Business owner
pay for my ClearPass subscription using my Nigerian bank card, bank transfer, or USSD
I am not blocked by payment method limitations
US-10.2
Finance director
receive an automated invoice for every subscription payment
I can process it through our finance system without manual documentation
US-10.3
Business owner
receive a warning 14 days before my subscription expires
I can renew before losing access to my compliance data
US-10.4
Compliance consultant
pay for my Compliance Partner subscription and have it cover all my linked client accounts
I manage one subscription rather than one per client
US-10.5
MDA IT admin
receive a monthly API usage statement showing total verification queries and fees incurred
I can reconcile ClearPass costs against our IT budget


Features
Feature
Description
Priority
Nigerian Payment Gateway Integration
Integration with Paystack for card payments and bank transfer. USSD payment option via Interswitch for users without internet banking. All prices in Nigerian Naira.
P0 - Must Have
Subscription Lifecycle Management
Automated subscription creation, renewal, upgrade, downgrade, and cancellation. Grace period of 7 days after expiry before account is downgraded to Starter.
P0 - Must Have
Automated Invoicing
PDF invoices generated automatically for every payment, emailed to the registered finance contact within 1 hour of successful payment.
P0 - Must Have
Usage-Based MDA Billing
Monthly statement for MDA API usage. Threshold monitoring with alerts when an MDA approaches their free query limit.
P1 - Should Have
HMO Commission Tracking
Real-time tracking of enrollment referrals and commission calculations per HMO partner. Monthly commission statements generated on the first of each month.
P1 - Should Have
Team Billing Portal
Finance team members can access billing history, download invoices, update payment methods, and change subscription tier without requiring full account admin access.
P1 - Should Have

Acceptance Criteria
AC-10.1: A successful Paystack card payment results in an invoice PDF being automatically emailed to the registered finance contact within 1 hour of payment confirmation
AC-10.2: A failed payment does not change the account subscription status, displays a clear payment failure message on screen, and sends a retry notification to the account primary contact
AC-10.3: A subscription expiry warning is sent to both the primary account contact and the registered finance contact exactly 14 days before the renewal date
AC-10.4: When a subscription expires, the account continues to function on the current tier for a 7-day grace period before being automatically downgraded to the Starter tier
AC-10.5: A subscription upgrade takes effect immediately upon payment confirmation with no interruption to the user current session or access to existing account data
AC-10.6: The MDA API monthly statement correctly applies the N200 per query fee only to queries above the 100 free query threshold and shows N0 overage for accounts within the free limit
AC-10.7: A refund processed within the 7-day grace period after downgrade is reflected in the billing portal within 48 hours and a revised invoice is sent to the finance contact


MODULE 11
Admin and Super Admin Portal
Internal tooling for ClearPass operations, certificate review, partner management, and platform governance


Epic
The admin portal is the operational backbone of ClearPass. It handles certificate manual review, government API monitoring, HMO and MDA partner management, customer support, and platform-wide analytics that feed into NHIA regulatory reporting.
User Stories
ID
As a...
I want to...
So that...
US-11.1
ClearPass reviewer
see a queue of uploaded certificates awaiting manual verification and process them in order
businesses on the manual review path get verified within our 24-hour SLA
US-11.2
ClearPass admin
add or remove HMO partners and configure their referral commission rates
the partner network can be managed without a developer deploying code changes
US-11.3
ClearPass admin
flag a company account as suspended if we detect fraudulent certificate uploads
we can protect the integrity of the platform
US-11.4
ClearPass super admin
see platform-wide metrics including total companies, certificates connected, verification queries, and revenue
I have a real-time view of business health for reporting to stakeholders and NHIA
US-11.5
Customer support agent
view any user account and see exactly what they see on their dashboard
I can diagnose and resolve support queries without asking users to describe their screen


Features
Feature
Description
Priority
Certificate Review Queue
Prioritised queue of uploaded certificates awaiting manual review. Reviewers see certificate image, company details, and submission date. One-click Approve or Reject with mandatory rejection reason.
P0 - Must Have
Partner Management Console
Add, edit, and deactivate HMO and MDA partners. Configure referral commission rates, API access tiers, and partner-specific settings.
P0 - Must Have
Account Oversight
Search any user or company account. View their dashboard as they see it. Manually override certificate statuses with logged justification.
P0 - Must Have
Platform Analytics Dashboard
Real-time metrics: total registered companies, active subscriptions by tier, monthly recurring revenue, certificate coverage rates by type, NHIA enrollment conversions, and API query volumes.
P0 - Must Have
Fraud Detection Flags
Automated flagging of suspicious activity including: duplicate RC number attempts, identical certificate images uploaded by multiple companies, and unusual verification query patterns.
P1 - Should Have
SLA Monitoring
Dashboard showing certificate review turnaround times against the 24-hour SLA. Automatic escalation alerts when queue build-up risks SLA breach.
P1 - Should Have
Content Management
Admin-editable certificate application guides, notification templates, and onboarding checklist content without requiring a developer code change.
P1 - Should Have

Acceptance Criteria
AC-11.1: The certificate review queue displays submissions in chronological order with the oldest submission at the top by default, and the reviewer can sort by submission date in either direction
AC-11.2: Approving a certificate in the review queue updates the company certificate status to Active within 5 minutes of the approval action being submitted
AC-11.3: The rejection submission form cannot be completed without a rejection reason entered in the reason field. A notification containing the rejection reason is sent to the submitting company within 1 hour
AC-11.4: A suspended company account is immediately unable to log in upon suspension and sees a suspension message with a support contact link. Suspension takes effect within 60 seconds of the admin action.
AC-11.5: The admin account oversight view renders the company dashboard identically to how it appears when that company user is logged in, including the same health score, certificate statuses, and alert counts
AC-11.6: The platform analytics dashboard figures for total registered companies, active subscriptions, and monthly recurring revenue are accurate to within 1 hour of real-time data
AC-11.7: The SLA monitoring alert triggers automatically when any certificate review submission has been in the queue for more than 20 business hours without being reviewed


MODULE 12
Security, Data Protection, and Compliance
The technical and governance framework protecting user data and maintaining platform integrity


Epic
ClearPass stores sensitive company and individual data including certificate reference numbers, BVN-linked identity records, employee counts, and financial information. Security is not a feature. It is the foundation. Failure here destroys the trust that the entire platform is built on.
Security Requirements
All data in transit encrypted using TLS 1.3 minimum
All data at rest encrypted using AES-256
Authentication using JWT with 24-hour token expiry and refresh token rotation
Multi-factor authentication mandatory for all MDA officer and admin accounts
Multi-factor authentication optional but recommended for business accounts
API keys issued with defined scope and rate limits. Keys rotatable without account downtime.
All government API credentials stored in a secrets manager, never in environment variables
Penetration testing required before launch and annually thereafter

Data Protection
ClearPass is subject to Nigeria Data Protection Act 2023 (NDPA) as a data controller and processor
All data subjects have the right to access, correct, and delete their data
Data retention policy: active account data retained indefinitely; deleted account data purged within 30 days except where legally required
BVN data is not stored by ClearPass. It is used only for identity verification at the point of registration and discarded immediately after confirmation.
Certificate data is stored in Nigeria. No user data is transferred to servers outside Nigeria without explicit consent.
A Data Protection Officer (DPO) must be designated before launch and registered with NITDA

Compliance Requirements
NITDA registration as a data controller before processing any personal data
ISO 27001 certification targeted within 18 months of launch, required before MDA API integrations are approved
NDPA compliance audit annually with findings published to NHIA as part of the MoU reporting obligations
Fraud detection logs retained for 7 years in compliance with Nigerian financial regulations

Features
Feature
Description
Priority
Role-Based Access Control
Every action in the platform is tied to a permission. Permissions are assigned to roles. Roles are assigned to users. No direct permission-to-user assignment.
P0 - Must Have
Immutable Audit Log
All data changes, login events, API queries, and admin actions are written to an append-only audit log that cannot be edited or deleted, even by super admins.
P0 - Must Have
Session Management
Automatic session timeout after 30 minutes of inactivity. Concurrent session limiting for MDA and admin accounts.
P0 - Must Have
Data Anonymisation for Analytics
All analytics data presented in the admin portal and shared with NHIA is anonymised. No individual company data is included in aggregated reports without explicit consent.
P0 - Must Have
NDPA Consent Management
Clear consent collection at registration covering data processing purposes. Users can withdraw consent and request data deletion through the platform without contacting support.
P0 - Must Have
Vulnerability Disclosure Policy
A published policy and secure email address for responsible vulnerability disclosure. All reports acknowledged within 48 hours.
P1 - Should Have

Acceptance Criteria
AC-12.1: All HTTP requests to any ClearPass domain return an HTTP 301 redirect to the HTTPS equivalent. No data of any kind is served over unencrypted HTTP.
AC-12.2: A session that has been inactive for 30 minutes requires full re-authentication before any account data is displayed. The inactive session cannot be resumed by pressing the browser back button.
AC-12.3: An MDA officer account that successfully authenticates on a second device while already logged in on a first device terminates the first session immediately with no data exposure on the first device
AC-12.4: BVN data is absent from all database tables, application logs, API response payloads, and error messages at all times after the identity verification step at registration is completed
AC-12.5: A user who submits a data deletion request through the platform receives an automated confirmation email within 1 hour stating that their data will be purged within 30 days
AC-12.6: No user interface, including the super admin portal, provides a mechanism to edit or delete any entry in the immutable audit log. Any attempt to do so via direct database access is blocked by database-level permissions.
AC-12.7: An API key that is revoked in the admin portal returns an HTTP 401 Unauthorized response to the next request made with that key within 60 seconds of the revocation being applied


5. Technical Architecture Requirements
5.1 Technology Stack Recommendations
Frontend Web
React.js with TypeScript. Tailwind CSS for styling. Progressive Web App (PWA) configuration for mobile performance without app store dependency.
Mobile
React Native for iOS and Android. Shared component library with web frontend. Targets Android-first given Nigerian market smartphone distribution.
Backend API
Node.js with Express or NestJS. RESTful API architecture with OpenAPI documentation. GraphQL considered for internal admin portal queries.
Database
PostgreSQL as primary relational database for structured company and certificate data. Redis for session management and caching of government API responses.
File Storage
AWS S3 or Cloudflare R2 for certificate document storage with Nigeria-region data residency configuration.
Hosting
AWS Nigeria region (af-south-1 Johannesburg as closest available) or Azure West Africa. Cloudflare for CDN and DDoS protection.
Government API Integration
Custom connector services deployed as microservices with independent scaling and circuit breaker patterns.
SMS Gateway
Termii or Twillio Nigeria for SMS delivery. Primary and fallback gateway configuration.
Email
Postmark for transactional email. Sendgrid as fallback.
Payments
Paystack primary. Flutterwave as backup. Both support Nigerian bank cards, USSD, and bank transfer.


5.2 Non-Functional Requirements
Availability
99.5% uptime SLA. Planned maintenance windows communicated 48 hours in advance. No maintenance during the last 5 business days of any month (peak procurement period).
Performance
Dashboard load time under 2 seconds on a 3G mobile connection. Single company verification API response under 5 seconds including government API query. Bulk verification of 100 companies under 2 minutes.
Scalability
Architecture must support 100,000 registered companies without architectural changes. Database sharding strategy documented before 50,000 company milestone.
Offline Capability
Dashboard displays last-known certificate status when offline. New certificate connections require connectivity. Offline status clearly communicated to users.
Accessibility
WCAG 2.1 AA compliance. All forms operable via keyboard. Screen reader compatible. Minimum font size 16px on mobile.
Browser Support
Chrome 90+, Firefox 88+, Safari 14+, Samsung Internet 14+. Internet Explorer not supported.


5.3 MVP Scope vs Future Phases
MVP Phase 1 (Month 1-3)
Authentication and onboarding, company profile, manual certificate upload and review, basic compliance dashboard, email alerts, single company MDA verification, ClearPass compliance report PDF.
Phase 2 (Month 4-6)
PenCom PCC API integration, FIRS TIN API integration, CAC RC validation API, bulk MDA verification, NHIA enrollment router, HMO partner portal, SMS alerts.
Phase 3 (Month 7-12)
NHIA API integration following MoU, BPP database integration, public REST API for MDA systems, Compliance Partner tier, mobile app (Android first), advanced analytics dashboard.
Phase 4 (Year 2)
NSITF and ITF API integrations, white-label enterprise tier, state government IGR compliance modules, West Africa expansion framework.


7. Data Model
This section defines every core entity in the ClearPass database, the fields each entity contains, the relationships between entities, and the critical constraints and indexes that must be implemented from day one. These are not suggestions. Deviating from these specifications, particularly around UUIDs, monetary storage, audit immutability, and country extensibility, creates technical debt that becomes structurally expensive to fix once data exists at scale.
7.1 Design Principles
UUIDs as primary keys throughout
Sequential integer IDs leak business metrics to anyone who registers multiple accounts. A company with ID 47 today and ID 312 next month reveals your growth rate. All primary keys are UUID v4. No exceptions.
Monetary values stored in kobo
All financial amounts are stored as integers in the smallest currency unit (kobo for Nigerian Naira). Floating point types for money cause rounding errors that compound into reconciliation failures. The display layer formats kobo to Naira. Future multi-currency support stores a currency_code alongside the integer amount.
Soft deletes across all user-facing entities
No user-facing record is ever hard deleted. A deleted_at timestamp marks deletion. This preserves compliance audit trails and allows account recovery within 30 days. Hard deletes are limited to NDPA-mandated erasure requests processed by admin after the retention window expires.
Immutability enforced at the database level
The AuditLog and CertificateHistory tables are append-only. PostgreSQL Row Level Security policies block UPDATE and DELETE at the database layer, not just the application layer. Application-level policies are bypassable. Database-level policies are not.
Health score cached, not calculated on read
Computing the compliance health score requires reading all six certificates and applying the weighted formula. At 100,000 companies this becomes unacceptably expensive if done on every dashboard load. The score is cached in the Company table and updated asynchronously by a background job within 60 seconds of any certificate state change.
JSONB for evolving external data
Government API response formats change without notice. Raw API responses are stored as JSONB alongside the parsed fields. This allows historical data to be reprocessed when API formats change, which protects the integrity of audit trails and certificate history.
Country extensibility built in from day one
Every entity that will need to support multiple countries in Phase 4 carries a country_code field defaulting to NG. Adding this field later, after millions of rows exist, requires a full table migration. Adding it now costs one column.
Partition VerificationQuery from day one
Once BPP integrates ClearPass as a mandatory pre-qualification step, the VerificationQuery table will receive millions of rows per month. PostgreSQL declarative range partitioning on queried_at (monthly partitions) must be defined at table creation. Retrofitting partitions onto a table with existing data is a multi-day migration that requires platform downtime.


7.2 Entity: Company
The central entity. Every certificate, user, subscription, report, and verification query references a Company.
id
UUID, primary key
rc_number
VARCHAR(20), unique, not null, indexed. The CAC Registration Number. Primary external identifier used in all API queries and MDA lookups.
name
VARCHAR(255), not null. Current registered name from CAC.
name_history
JSONB, default empty array. Array of objects recording previous names and the date each name was changed. Companies change names after mergers or rebranding. Procurement audits often reference the name at the time of a specific contract.
sector_id
UUID, FK to Sector. Determines which certificates are applicable and their sector-specific guidance.
employee_band
ENUM ('1-10', '11-50', '51-200', '200+'), not null. Determines ITF applicability and NHIA plan recommendations. Editable by the company but changes require admin review when the change removes a mandatory certificate.
registered_address
TEXT. From CAC registry.
directors
JSONB. Array of director names from CAC at time of registration. Updated on each CAC re-verification.
incorporation_date
DATE, nullable. From CAC registry.
cac_verified
BOOLEAN, default false. True only after successful CAC API validation of the RC number.
cac_verified_at
TIMESTAMPTZ, nullable. When CAC validation was last successfully completed.
health_score
SMALLINT, nullable. Cached compliance health score 0-100. NULL means not yet calculated. Updated by background job within 60 seconds of any certificate change.
health_score_breakdown
JSONB, nullable. Cached breakdown of Component A, B, and C values used in the last score calculation. Used for dashboard display and debugging without recalculation.
health_score_version
VARCHAR(10), nullable. The formula version that produced the cached score. Allows score history to be interpreted correctly after formula updates.
health_score_calculated_at
TIMESTAMPTZ, nullable. When the cached score was last calculated.
procurement_ready
BOOLEAN, default false. Cached result of the Procurement Ready gate check. Updated alongside health_score.
projected_score
SMALLINT, nullable. Projected score at the nearest certificate expiry date. NULL if no certificate expires within 60 days.
projected_score_trigger_date
DATE, nullable. The date on which the projected score will take effect.
country_code
CHAR(2), default 'NG', not null. ISO 3166-1 alpha-2 country code. Enables Phase 4 West Africa expansion.
status
ENUM ('active', 'suspended', 'pending_verification', 'deleted'), default 'pending_verification'
suspended_reason
TEXT, nullable
suspended_at
TIMESTAMPTZ, nullable
suspended_by
UUID, FK to AdminUser, nullable
created_at
TIMESTAMPTZ, default now(), not null
updated_at
TIMESTAMPTZ, default now(), not null
deleted_at
TIMESTAMPTZ, nullable. Soft delete. NDPA data erasure sets this and triggers a 30-day purge job.


7.3 Entity: User
Represents any human actor in the system: business team members, MDA officers, compliance consultants, HMO partners, and internal admins. One email address cannot belong to two users.
id
UUID, primary key
company_id
UUID, FK to Company, nullable. Null for admin users and MDA officers who are not attached to a single company.
account_type
ENUM ('business_primary', 'business_sub', 'mda_officer', 'compliance_partner', 'hmo_partner', 'admin', 'super_admin'), not null
name
VARCHAR(255), not null
email
VARCHAR(255), unique, not null, indexed
phone
VARCHAR(20), unique, not null, indexed. Nigerian phone numbers stored with country code: +2348012345678
email_verified
BOOLEAN, default false
phone_verified
BOOLEAN, default false
bvn_hash
VARCHAR(64), unique, nullable. SHA-256 hash of BVN concatenated with a server-side secret salt. Used only on business_primary accounts to enforce one-BVN-per-primary-account. The BVN itself is never stored. Hash stored only; BVN is discarded after hashing at registration.
mfa_enabled
BOOLEAN, default false. Mandatory true for mda_officer, admin, and super_admin account types.
mfa_method
ENUM ('totp', 'sms'), nullable
role_permissions
JSONB. Array of permission strings granted to this user. Example: ['certificates.edit', 'reports.generate', 'billing.view']. Permissions are checked at the application layer on every request.
last_login_at
TIMESTAMPTZ, nullable
last_login_ip
INET, nullable. PostgreSQL native IP address type. Stored for security audit purposes.
status
ENUM ('active', 'suspended', 'pending_email_verification', 'deleted'), default 'pending_email_verification'
country_code
CHAR(2), default 'NG', not null
created_at
TIMESTAMPTZ, default now(), not null
updated_at
TIMESTAMPTZ, default now(), not null
deleted_at
TIMESTAMPTZ, nullable


7.4 Entity: Certificate
One row per certificate type per company. Maximum 6 rows per company (one per certificate type). The unique constraint on (company_id, certificate_type) is enforced at the database level to prevent duplicate certificate records for the same company.
id
UUID, primary key
company_id
UUID, FK to Company, not null, indexed
certificate_type
ENUM ('nhia', 'pcc', 'nsitf', 'itf', 'firs_tin', 'bpp'), not null
UNIQUE constraint
(company_id, certificate_type). Enforced at database level. One record per certificate type per company.
status
ENUM ('not_connected', 'pending_verification', 'active', 'expiring_30', 'expiring_14', 'expiring_7', 'expired', 'renewal_in_progress', 'not_applicable'), not null, default 'not_connected'
is_applicable
BOOLEAN, default true. False for ITF on companies in the 1-10 employee band. When false, the certificate is excluded from all score calculations.
applicability_reason
TEXT, nullable. Human-readable explanation of why the certificate is not applicable.
reference_number
VARCHAR(100), nullable. The official certificate number as issued by the government agency.
issuing_authority
VARCHAR(100), nullable. The government agency that issued this certificate.
issue_date
DATE, nullable
expiry_date
DATE, nullable, indexed. Indexed to support the nightly expiry scanning background job that transitions certificates to expiring states.
verification_method
ENUM ('api_verified', 'admin_approved', 'pending_review', 'not_connected'), not null, default 'not_connected'
verified_at
TIMESTAMPTZ, nullable. When this certificate was last successfully verified.
verified_by
VARCHAR(100), nullable. Name of the admin reviewer or the API integration name that verified this certificate.
document_url
TEXT, nullable. S3 or Cloudflare R2 object path for the uploaded certificate document.
document_hash
VARCHAR(64), nullable. SHA-256 hash of the uploaded document at time of upload. Used to detect document tampering after submission.
api_check_result
JSONB, nullable. Raw response from the government API at time of last verification. Preserved regardless of format changes so historical data can be reprocessed.
last_api_check_at
TIMESTAMPTZ, nullable. When the system last queried the government API for this certificate.
score_contribution
SMALLINT, nullable. Cached point contribution of this certificate to the overall health score. Updated alongside the company health_score field.
formula_version
VARCHAR(10), nullable. Which formula version calculated the score_contribution.
country_code
CHAR(2), default 'NG', not null. Enables future configuration of different certificate types per country.
created_at
TIMESTAMPTZ, default now(), not null
updated_at
TIMESTAMPTZ, default now(), not null


7.5 Entity: CertificateHistory
Append-only audit trail of every certificate state change. No row is ever updated or deleted. A PostgreSQL Row Level Security policy blocks UPDATE and DELETE on this table for all database roles including the application user. Only INSERT is permitted.
id
UUID, primary key
certificate_id
UUID, FK to Certificate, not null, indexed
company_id
UUID, FK to Company, not null, indexed. Denormalized for query performance. Allows fetching a company full certificate history without joining Certificate.
previous_status
ENUM (same values as Certificate.status), nullable. Null for the initial creation record.
new_status
ENUM (same values as Certificate.status), not null
previous_expiry_date
DATE, nullable
new_expiry_date
DATE, nullable
change_trigger
ENUM ('api_verification', 'admin_approval', 'admin_rejection', 'scheduled_expiry', 'user_upload', 'renewal_completed', 'manual_override'), not null. Records what caused the state change.
rejection_reason
TEXT, nullable. Required when change_trigger is admin_rejection.
changed_by_user_id
UUID, nullable. The user who triggered the change. Null for system-triggered changes such as scheduled expiry transitions.
changed_by_admin_id
UUID, nullable. The admin who manually overrode the certificate.
metadata
JSONB, default empty object. Any additional context relevant to this change.
created_at
TIMESTAMPTZ, default now(), not null. No updated_at. This record is immutable from the moment of insertion.


7.6 Entity: VerificationQuery
Every lookup performed by an MDA officer or API consumer is logged here. This table is partitioned by month using PostgreSQL declarative range partitioning on queried_at. Partitions older than 24 months are archived to cold storage but remain queryable for audit purposes. This partitioning strategy must be defined at table creation.
id
UUID, primary key
queried_by_user_id
UUID, FK to User, not null, indexed
mda_id
UUID, FK to MDA, not null, indexed
company_id
UUID, FK to Company, nullable, indexed. Null when the queried RC number does not exist in ClearPass.
rc_number_queried
VARCHAR(20), not null. The exact string the officer typed or submitted. Stored independently of company_id to capture not-found queries and detect patterns in queried-but-unregistered companies.
query_type
ENUM ('single', 'bulk_item'), not null. Bulk upload creates one row per company in the batch.
bulk_batch_id
UUID, nullable. Groups all rows that originated from the same bulk CSV upload.
result_snapshot
JSONB, not null. Complete compliance status at the exact time of this query. Includes all certificate states, health score, procurement_ready status, and formula version. This snapshot is what the verification report PDF is generated from.
result_summary
ENUM ('compliant', 'non_compliant', 'partial', 'not_found'), not null, indexed
formula_version
VARCHAR(10), not null. Which formula version produced this result.
report_generated
BOOLEAN, default false
report_id
VARCHAR(30), nullable, unique. Human-readable report ID for QR codes. Format: CPR-YYYYMMDD-XXXXXXX.
report_pdf_url
TEXT, nullable. S3 path to the generated PDF.
queried_at
TIMESTAMPTZ, default now(), not null. Partition key. This column determines which monthly partition the row is written to.


7.7 Entity: MDA
Represents a federal ministry, department, or agency registered as a verification consumer. One MDA may have many MDA officer users.
id
UUID, primary key
name
VARCHAR(255), not null
short_name
VARCHAR(50), nullable. Common abbreviation used in reports.
ministry_type
ENUM ('federal_ministry', 'federal_agency', 'regulatory_body', 'state_ministry'), not null
gov_email_domain
VARCHAR(100), unique, not null. Example: fmiti.gov.ng. Used to validate MDA officer registrations. Only emails from this domain are accepted for this MDA.
api_tier
ENUM ('free', 'standard', 'enterprise'), default 'free'
free_query_limit
INTEGER, default 100. Monthly free verification queries before billing begins.
queries_used_this_month
INTEGER, default 0. Cached counter. Reset to 0 on the first day of each month by a scheduled job.
billing_contact_email
VARCHAR(255), nullable. Where monthly API usage statements are sent.
country_code
CHAR(2), default 'NG', not null
status
ENUM ('active', 'suspended', 'pending_onboarding'), default 'pending_onboarding'
onboarded_at
TIMESTAMPTZ, nullable
created_at
TIMESTAMPTZ, default now(), not null
updated_at
TIMESTAMPTZ, default now(), not null


7.8 Entity: Subscription
One active subscription per company at a time. Historical subscriptions are retained for billing audit and revenue reporting. Amounts stored in kobo to prevent floating point errors.
id
UUID, primary key
company_id
UUID, FK to Company, not null, indexed
tier
ENUM ('starter', 'business', 'enterprise', 'compliance_partner'), not null
status
ENUM ('active', 'grace_period', 'expired', 'cancelled'), not null, default 'active'
start_date
DATE, not null
end_date
DATE, not null
grace_end_date
DATE, not null. Set to end_date plus 7 days. The account downgrades to Starter at this date, not at end_date.
amount_kobo
BIGINT, not null. Example: N60,000 is stored as 6000000 kobo. BIGINT not INTEGER to accommodate future enterprise pricing.
currency_code
CHAR(3), default 'NGN', not null. ISO 4217 currency code. Enables Phase 4 multi-currency billing.
payment_method
ENUM ('card', 'bank_transfer', 'ussd'), nullable
payment_reference
VARCHAR(100), nullable. Payment gateway transaction reference.
gateway
ENUM ('paystack', 'flutterwave'), nullable
gateway_response
JSONB, nullable. Raw payment gateway response preserved for reconciliation.
auto_renew
BOOLEAN, default true
cancelled_at
TIMESTAMPTZ, nullable
cancellation_reason
TEXT, nullable
created_at
TIMESTAMPTZ, default now(), not null
updated_at
TIMESTAMPTZ, default now(), not null


7.9 Entity: ComplianceReport
Every generated PDF report creates a row here. The snapshot field preserves the compliance state at the exact moment of generation. This enables historical reports, QR code verification against a known point in time, and tamper detection by comparing the snapshot to the current live state.
id
UUID, primary key
report_id
VARCHAR(30), unique, not null. Human-readable, URL-safe identifier used in QR codes. Format: CPR-YYYYMMDD-XXXXXXX. Generated deterministically to prevent duplicates.
company_id
UUID, FK to Company, not null, indexed
generated_by_user_id
UUID, FK to User, not null
report_type
ENUM ('standard', 'provisional', 'historical', 'mda_verification'), not null
snapshot
JSONB, not null. Complete point-in-time record of the company compliance state. Includes: all 6 certificate statuses, reference numbers, expiry dates, health_score, procurement_ready, formula_version, and the timestamp of this snapshot. This field is immutable after insertion.
health_score_at_generation
SMALLINT, not null
procurement_ready_at_generation
BOOLEAN, not null
formula_version
VARCHAR(10), not null
point_in_time_date
DATE, nullable. For historical reports only. The date the snapshot reflects.
pdf_url
TEXT, nullable. S3 path. Null until the PDF generation job completes.
live_verification_url
TEXT, not null. Public URL that shows current live status for comparison with the snapshot.
watermark_type
ENUM ('none', 'provisional'), not null, default 'none'
expires_at
TIMESTAMPTZ, nullable. Standard tender reports expire after 90 days. After expiry the QR code still resolves but shows an expired watermark alongside the current status.
created_at
TIMESTAMPTZ, default now(), not null


7.10 Entity: Notification
Every outbound notification is logged here. The retry fields enable exponential backoff on failed SMS delivery without re-triggering the full alert workflow. Nigerian SMS carriers have high transient failure rates and this pattern is essential to reliable delivery.
id
UUID, primary key
company_id
UUID, FK to Company, nullable, indexed
user_id
UUID, FK to User, nullable, indexed
certificate_id
UUID, FK to Certificate, nullable
notification_type
ENUM ('expiry_30', 'expiry_14', 'expiry_7', 'score_at_risk', 'renewal_confirmation', 'certificate_rejected', 'certificate_approved', 'weekly_digest', 'escalation', 'subscription_expiry_14', 'subscription_expired', 'payment_failed', 'mda_watchlist_alert'), not null
channel
ENUM ('email', 'sms', 'in_app'), not null
status
ENUM ('pending', 'sent', 'delivered', 'failed', 'bounced'), not null, default 'pending', indexed
subject
TEXT, nullable. Email subject line.
body_template
VARCHAR(100), not null. Name of the template used. Templates are stored in the Content Management system.
template_variables
JSONB, not null. The variable values injected into the template at send time. Preserved for debugging delivery issues.
sent_at
TIMESTAMPTZ, nullable
delivered_at
TIMESTAMPTZ, nullable
failed_reason
TEXT, nullable
retry_count
SMALLINT, default 0. Maximum 3 retries before permanent failure.
next_retry_at
TIMESTAMPTZ, nullable, indexed. Indexed to support the retry queue background job which queries for notifications where next_retry_at is in the past and status is failed.
created_at
TIMESTAMPTZ, default now(), not null


7.11 Entity: HMOPartner
id
UUID, primary key
name
VARCHAR(255), not null
nhia_accreditation_number
VARCHAR(50), unique, not null
states_active
CHAR(2)[], not null. PostgreSQL array of Nigerian state codes where this HMO operates.
employee_size_min
INTEGER, not null, default 1
employee_size_max
INTEGER, nullable. Null means no upper limit.
min_annual_premium_kobo
BIGINT, nullable
enrollment_portal_url
TEXT, not null
handoff_api_url
TEXT, nullable. For HMOs that support direct API handoffs from ClearPass.
commission_rate_bps
INTEGER, not null. Commission rate in basis points. 1000 bps = 10.00%. Stored as integer to avoid floating point.
country_code
CHAR(2), default 'NG', not null
status
ENUM ('active', 'suspended', 'pending_onboarding'), default 'pending_onboarding'
created_at
TIMESTAMPTZ, default now(), not null
updated_at
TIMESTAMPTZ, default now(), not null


7.12 Entity: EnrollmentReferral
id
UUID, primary key
company_id
UUID, FK to Company, not null, indexed
hmo_partner_id
UUID, FK to HMOPartner, not null, indexed
status
ENUM ('initiated', 'hmo_selected', 'application_submitted', 'under_review', 'certificate_issued', 'failed', 'abandoned'), not null, default 'initiated'
handoff_data
JSONB, not null. Snapshot of the company data (name, RC, employee count, sector, contact) sent to the HMO at handoff time. Preserved for commission dispute resolution.
handoff_at
TIMESTAMPTZ, not null
application_submitted_at
TIMESTAMPTZ, nullable
certificate_issued_at
TIMESTAMPTZ, nullable
nhia_certificate_reference
VARCHAR(100), nullable. The certificate number issued on successful enrollment.
commission_earned_kobo
BIGINT, nullable. Calculated at certificate_issued_at using the HMO commission_rate_bps and the first-year premium.
commission_paid_at
TIMESTAMPTZ, nullable
failure_reason
TEXT, nullable
created_at
TIMESTAMPTZ, default now(), not null
updated_at
TIMESTAMPTZ, default now(), not null


7.13 Entity: AuditLog
The platform-wide immutable event log. Every action by any actor, human or system, is written here. A PostgreSQL Row Level Security policy restricts this table to INSERT only for all roles including the application service account. UPDATE and DELETE are blocked at the database layer.
id
UUID, primary key
event_type
VARCHAR(100), not null, indexed. Dot-namespaced event names. Examples: company.created, certificate.status_changed, user.login_failed, admin.company_suspended, api.verification_query, report.generated
actor_type
ENUM ('user', 'admin', 'system', 'api_consumer'), not null
actor_id
UUID, nullable. The user, admin, or API key that triggered the event.
company_id
UUID, nullable, indexed. Denormalized for fast company-level audit trail queries.
resource_type
VARCHAR(50), nullable. The entity type affected: company, certificate, user, subscription, report.
resource_id
UUID, nullable. The specific entity affected.
previous_state
JSONB, nullable. State of the resource before the action.
new_state
JSONB, nullable. State of the resource after the action.
ip_address
INET, nullable. PostgreSQL native IP type. Supports both IPv4 and IPv6.
user_agent
TEXT, nullable
metadata
JSONB, default empty object. Any additional event context.
created_at
TIMESTAMPTZ, default now(), not null, indexed


7.14 Entity: CompliancePartnerLink
Maps compliance consultants to the client companies they manage. Each link carries explicit permissions and a full audit trail of who granted and who revoked access.
id
UUID, primary key
partner_user_id
UUID, FK to User where account_type = compliance_partner, not null, indexed
client_company_id
UUID, FK to Company, not null, indexed
UNIQUE constraint
(partner_user_id, client_company_id). A consultant cannot be linked to the same company twice.
permissions
TEXT[], not null. Array of permission strings granted to the consultant for this client. Examples: certificates.view, certificates.edit, reports.generate.
linked_at
TIMESTAMPTZ, default now(), not null
linked_by_company_user_id
UUID, FK to User, not null. The company admin who approved the link.
status
ENUM ('active', 'revoked'), default 'active'
revoked_at
TIMESTAMPTZ, nullable
revoked_by
UUID, FK to User, nullable
created_at
TIMESTAMPTZ, default now(), not null


7.15 Entity: ApiKey
API keys for MDA integrations and Enterprise tier programmatic access. The actual key is never stored. Only a SHA-256 hash with a server-side secret salt is stored. The raw key is shown to the user exactly once at creation.
id
UUID, primary key
mda_id
UUID, FK to MDA, nullable
company_id
UUID, FK to Company, nullable
key_hash
VARCHAR(64), unique, not null. SHA-256 hash of the key concatenated with a server-side secret. Used to verify incoming keys without storing the key itself.
key_prefix
VARCHAR(16), not null. First 12 characters of the key for identification in the admin portal. Example: cpk_live_a1b2c3. Never sufficient to reconstruct or use the key.
scopes
TEXT[], not null. Permitted operations: verify.single, verify.bulk, webhook.subscribe.
rate_limit_per_minute
SMALLINT, not null, default 60
rate_limit_per_day
INTEGER, not null, default 10000
last_used_at
TIMESTAMPTZ, nullable
expires_at
TIMESTAMPTZ, nullable
status
ENUM ('active', 'revoked', 'expired'), not null, default 'active'
revoked_at
TIMESTAMPTZ, nullable
revoked_by
UUID, FK to User, nullable
created_by
UUID, FK to User, not null
created_at
TIMESTAMPTZ, default now(), not null


7.16 Critical Database Indexes
These indexes are required at launch. Missing any of them will cause unacceptable query performance at scale. They must be created in the initial migration, not added later.
companies: rc_number
Unique index. Every MDA lookup and API query uses this column.
certificates: (company_id, certificate_type)
Unique composite index. Every dashboard load reads all certificates for a company.
certificates: expiry_date
Non-unique index. The nightly expiry scanning job queries certificates WHERE expiry_date = target_date.
certificates: status
Non-unique index. Alert jobs query by status across all companies.
certificate_history: (company_id, created_at)
Composite index. The compliance report historical lookup queries by company and date range.
verification_queries: (mda_id, queried_at)
Composite index. MDA billing statements aggregate by mda_id over a month range.
audit_log: (company_id, created_at)
Composite index. Company audit trail queries are always scoped to a single company and ordered by time.
notifications: next_retry_at
Partial index WHERE status = 'failed' AND retry_count < 3. The retry queue job uses this. Partial index keeps it small and fast.


7.17 Entity Relationship Summary
Company to User
One to many. One company has many users. A compliance_partner user links to many companies through CompliancePartnerLink.
Company to Certificate
One to six. Exactly one Certificate row per type per company. Enforced by unique constraint.
Certificate to CertificateHistory
One to many. Every status change appends a row. Never deleted.
Company to Subscription
One to one active. One company has one active subscription and many historical subscriptions.
Company to ComplianceReport
One to many. A company can generate many reports over its lifetime.
MDA to VerificationQuery
One to many. Partitioned monthly. Every MDA lookup creates a row.
Company to EnrollmentReferral
One to many. A company may attempt enrollment with multiple HMOs over time.
HMOPartner to EnrollmentReferral
One to many. An HMO receives many referrals.
User to AuditLog
One to many. Every user action creates one or more audit log entries.


7.18 Future Extensibility: Phase 4 West Africa
Every entity in this schema carries a country_code field defaulting to NG. The certificate_type enum will be extended per country in a CertificateTypeConfig reference table that maps country codes to their required certificate types, weights, and issuing authorities. The Sector table similarly becomes country-aware. Monetary amounts and their currency_code fields allow multi-currency billing without schema changes. This architecture supports onboarding Ghana, Kenya, or Rwanda as new markets by adding configuration rows, not by modifying table structures.

8. Edge Cases and Error State Specifications
This section documents every known failure scenario across all product layers, the required system response for each, the message the user receives, and the recovery path back to normal operation. These are not theoretical. Every scenario documented here will occur in production. The cost of handling them gracefully at build time is a few developer hours. The cost of handling them in production is user trust, data integrity, and in some cases legal liability.
Each edge case is classified by severity. P0 means the platform produces incorrect data or becomes unusable if this is unhandled. P1 means a user journey breaks in a way that cannot be self-recovered. P2 means a degraded experience that is recoverable with user effort.
8.1 Registration and Identity Edge Cases
EC-01.1: CAC API Unavailable During Registration [P0]
Scenario
A user begins company registration and submits their RC number. The CAC validation API is offline or returns a timeout.
System Response
The registration proceeds to a Pending CAC Verification state. A background job queues the RC number for validation and retries against the CAC API every 15 minutes for up to 24 hours. The company profile is created with cac_verified = false. The user can begin connecting certificates but cannot generate a compliance report until CAC verification completes.
User Message
We could not verify your RC number right now due to a temporary issue with the CAC registry. Your account has been created and we will complete verification automatically within 24 hours. You will receive an email confirmation once verified.
Recovery Path
When the CAC API returns, the background job completes verification, updates cac_verified = true, and sends a confirmation email. No user action required.
Prevention
Circuit breaker pattern on the CAC connector. After 3 consecutive failures within 5 minutes, the connector enters open state and all registrations proceed to Pending CAC Verification automatically without waiting for timeout.


EC-01.2: RC Number Already Registered [P1]
Scenario
A user attempts to register a company with an RC number that already exists in the ClearPass database, whether by the same user or a different one.
System Response
Registration is blocked. The system checks whether the registering user's email matches any existing user on the account. If yes, direct them to login. If no, the system presents a Request Access flow where the user submits their identity and the existing account's primary contact receives an access notification.
User Message
A company with RC number [XXXXXXX] is already registered on ClearPass. If you are a team member of this company, please request access below. If you believe this registration is fraudulent, contact our support team.
Recovery Path
The Request Access submission creates a pending link request that the existing account admin can approve or deny. Approved requests create a business_sub user account attached to the company.
Fraud Risk
A bad actor may attempt to register a real company they do not own. The access request is flagged in the admin fraud detection queue because the requesting email domain does not match the registered company domain on file. Admin review is triggered within 4 hours.


EC-01.3: Simultaneous Registration Race Condition [P0]
Scenario
Two users submit registration for the same RC number within milliseconds of each other, both passing the initial uniqueness check before either write completes.
System Response
A unique database constraint on companies.rc_number ensures only one INSERT succeeds. The second INSERT fails with a constraint violation. The second request receives the same response as EC-01.2 (RC already registered) and follows the Request Access path.
Prevention
Database-level unique constraint is the authoritative control. Application-level uniqueness checks are advisory only. This is a critical distinction. Application checks with a gap between check and insert are vulnerable to race conditions at scale. The database constraint is not.


EC-01.4: BVN Hash Already Exists [P1]
Scenario
A user attempts to register a new primary company account and their BVN hash matches an existing account. One person is attempting to register multiple primary company accounts.
System Response
Registration is blocked for business_primary account type. The system flags the registration attempt in the admin fraud queue with event type company.duplicate_bvn_attempt. The user is not told that their BVN was the reason for the block to prevent information disclosure.
User Message
We were unable to complete your registration. Please contact our support team for assistance.
Legitimate Exception
Some individuals legitimately own multiple registered companies. The exception path requires submitting both company RC numbers to support with a signed declaration. Admin manually unlinks the BVN requirement for the second registration after verification.


EC-01.5: CAC Returns Deregistered or Dormant Company Status [P1]
Scenario
The RC number is valid in the CAC database but the company status is DEREGISTERED, STRUCK OFF, or DORMANT.
System Response
Registration is blocked. The deregistered status is returned to the user with the CAC status code and a link to the CAC self-service portal for reactivation.
User Message
The CAC registry shows that RC number [XXXXXXX] is currently [DEREGISTERED/STRUCK OFF]. A deregistered company cannot bid for federal contracts. Please visit the CAC portal to reinstate your company registration before proceeding.
Edge Within the Edge
If a company becomes deregistered AFTER successful ClearPass registration, the nightly CAC re-verification job detects the status change. The company account is placed in a Suspended - CAC Status warning state and the primary contact is notified immediately. The suspension is not automatic because deregistration notices sometimes precede reactivation by days in the CAC system.


EC-01.6: MDA Email Domain Not in Whitelist [P1]
Scenario
An MDA officer attempts to register with a .gov.ng email address whose subdomain is not in the ClearPass MDA whitelist. Example: someone@newerministry.gov.ng where newerministry is not yet configured.
System Response
Registration proceeds to Pending MDA Approval state. The email is flagged for manual review by the ClearPass admin team. The officer receives temporary read-only access to the platform to evaluate it while approval is pending.
Admin Action Required
Admin team verifies the MDA against the official FMF or OSGF list of federal agencies. If legitimate, the domain is added to the whitelist and the officer account is activated. If not verifiable within 5 business days, the account is rejected with an explanation.
Prevention
The MDA whitelist in the admin portal is maintained against the official OSGF directory of federal agencies. A quarterly review is scheduled to add newly created agencies.


8.2 Certificate Management Edge Cases
EC-02.1: Duplicate Certificate Reference Number Across Companies [P0]
Scenario
Two different companies submit the same certificate reference number for the same certificate type. This could indicate a forged certificate or a legitimate shared certificate (which is not permitted).
System Response
The second submission is flagged immediately. The certificate enters Pending Fraud Review state rather than Pending Verification. Both companies are notified that their certificate is under review. The admin fraud queue is alerted with high priority. Neither certificate is approved until the review is complete.
Resolution
If API verification confirms one company as the legitimate holder, the other submission is rejected with a detailed rejection reason. If neither can be confirmed by API, both are rejected and both companies are directed to their issuing authority for a reissued certificate with a new reference number.
Admin Communication
The admin reviewer logs the resolution in the certificate history for both companies. The resolution record is immutable and preserved for regulatory audit.


EC-02.2: Government API Contradicts User Upload [P0]
Scenario
A user uploads a PCC certificate with reference number XYZ-2026-001. The PenCom API, when queried with that reference number, returns a different company name, different employee count, or a revoked status.
System Response
The certificate is not approved. It enters a Contradicted state, a distinct status not shown to the user as Rejected but logged internally. The admin queue receives an alert with both the user-submitted data and the API response for comparison. The company receives a generic notification that their certificate requires additional verification.
User Message
Your PCC certificate submission requires additional verification. Our team will review it within 2 business days and contact you if further information is needed.
Recovery Path
If the discrepancy is due to a name change not yet updated in PenCom, the admin may approve with a note. If it is due to a forged certificate, the submission is permanently rejected, the fraud event is logged, and the company is warned that repeated fraudulent submissions will result in account suspension.


EC-02.3: Certificate Expiry Date Changed Retroactively [P1]
Scenario
A government agency corrects their records and a certificate that ClearPass shows as expiring on date A is now recorded in their API as expiring on date B. This changes the health score and potentially the Procurement Ready status.
System Response
When the API returns the corrected expiry date during a scheduled re-verification, the certificate record is updated. A CertificateHistory entry records the change with change_trigger = api_verification and metadata includes both the previous and new expiry dates. The health score is recalculated. A notification is sent to the account primary contact explaining the change and the source.
User Message
Your [certificate type] expiry date has been updated from [old date] to [new date] based on the latest data from [issuing authority]. Your compliance score has been recalculated accordingly.
Critical Edge
If the corrected expiry date is in the past (certificate was retroactively expired), the certificate moves immediately to Expired state. An Ineligible to Bid badge is activated and a Priority Alert notification is sent via all channels regardless of user notification preferences.


EC-02.4: Corrupted, Password-Protected, or Unreadable PDF Upload [P1]
Scenario
A user uploads a certificate document that is corrupted, password-protected, in an unsupported file format, or a scanned image with insufficient resolution to read.
System Response
File validation runs immediately on upload before the file is committed to storage. Validation checks: file size under 10MB, file format is PDF or accepted image type, file is not encrypted, file can be opened. If validation fails, the upload is rejected before storage and the user is prompted to re-upload.
User Message
Your file could not be processed. Ensure the document is not password-protected, is under 10MB, and is a clear scan or photo. Accepted formats: PDF, JPG, PNG.
Edge Within the Edge
A document that passes upload validation but fails during admin review (too blurry to read, wrong certificate visible) generates a rejection with reason 'Document quality insufficient for verification. Please upload a clearer scan.' The rejection is not counted as a fraud flag.


EC-02.5: Document Tampered Between Upload and Review [P0]
Scenario
A certificate document's SHA-256 hash stored at upload time does not match the hash of the file retrieved from storage at review time. The document has been modified after upload.
System Response
The admin review interface calculates the hash of the retrieved file before displaying it. If the hash does not match the stored document_hash, the review interface displays a DOCUMENT INTEGRITY FAILURE warning in red. The admin cannot approve the certificate through the normal flow. The incident is logged as a critical security event.
Escalation
The security event triggers an immediate alert to the super admin. An infrastructure investigation is launched to determine whether the tamper occurred in storage, in transit, or in the application layer. The company is not notified until the source is determined, as the tampering may have originated externally.


EC-02.6: Wrong Certificate Type Uploaded to Wrong Slot [P1]
Scenario
A user uploads their PCC certificate into the NSITF certificate slot. The document is valid but for the wrong certificate type.
System Response
The admin reviewer during manual review detects the mismatch between the certificate type on the document and the slot it was submitted for. The submission is rejected with reason: Document submitted appears to be a [detected type] certificate. Please submit this document in the correct certificate slot.
Automation Opportunity
In Phase 2, OCR processing can scan uploaded documents and attempt to auto-detect the certificate type from the issuing authority name, certificate title, and format. If a mismatch is detected between the detected type and the target slot, the user is warned before upload completes. This is a Phase 2 enhancement, not an MVP requirement.


EC-02.7: Certificate Revoked by Issuing Authority After Approval [P0]
Scenario
A certificate was legitimately issued and approved in ClearPass. Subsequently, the issuing government authority revokes it due to discovered fraud, non-payment, or administrative error on their side.
System Response
The scheduled API re-verification job detects the revoked status. The certificate transitions immediately to Expired state regardless of the stored expiry date. The CertificateHistory records the revocation with change_trigger = api_verification and stores the raw API revocation response. The company receives a Priority Alert notification. Any active compliance reports generated after the revocation timestamp are flagged on their QR verification page as Certification Status Changed.
Business Rule
ClearPass cannot override a government API revocation. If a company believes the revocation is an error, they must resolve it with the issuing authority directly. ClearPass will update the status as soon as the API reflects the correction.


8.3 Health Score and Expiry Edge Cases
EC-03.1: Score Calculation Background Job Failure [P0]
Scenario
The background job that recalculates health scores after certificate state changes crashes, times out, or is not triggered. Scores become stale.
System Response
Every company record carries a health_score_calculated_at timestamp. The dashboard reads this timestamp and if the score is older than 5 minutes AND a certificate state change has occurred since that timestamp (detected via updated_at comparison), the dashboard displays a Refreshing indicator next to the score and queues an immediate recalculation. The stale score is shown with a timestamp tooltip: Score last updated [X minutes ago]. Refreshing now.
Prevention
The job queue uses a dead letter queue for failed jobs. Failed score recalculation jobs are retried up to 3 times with exponential backoff. After 3 failures, the job is moved to the dead letter queue and an ops alert is triggered. A separate watchdog job runs every 10 minutes and identifies companies with health_score_calculated_at older than 10 minutes where certificates have changed since then, queuing immediate recalculation for each.


EC-03.2: Certificate Expires During Active Tender Submission [P1]
Scenario
A company generates a compliance report at 09:00 on the day their NSITF certificate expires. At 14:00 the same day, an MDA officer scans the QR code on the report. The certificate has since expired.
System Response
The QR code resolves to the live verification page which shows BOTH the status at report generation AND the current live status. The page displays a prominent warning: Certificate Status Has Changed Since Report Generation. The original NSITF status at generation was Active. Current status is Expired. This report may no longer reflect the company current compliance status.
User Notification
When the QR scan triggers the status mismatch detection, the system sends an immediate notification to the company's primary contact and compliance officer: Your ClearPass compliance report [report_id] has been scanned and your NSITF certificate has expired since the report was generated. Please renew immediately.
Business Rule
The report itself is not invalidated. The MDA officer makes their own determination. ClearPass's obligation is to show the truth at the time of verification, not to make the eligibility decision.


EC-03.3: Multiple Certificates Expire Simultaneously [P1]
Scenario
Three certificates expire on the same day. The alert engine triggers multiple simultaneous alerts via the same channels.
System Response
The alert engine groups all expiry alerts for the same company due on the same day into a single digest notification rather than sending three separate alerts. The digest lists all expiring certificates, their expiry times, and a single call-to-action. This applies to the 30-day, 14-day, and 7-day alert thresholds.
Exception
The Score at Risk notification is always sent separately from standard expiry alerts because it communicates a business consequence rather than an action item. It cannot be batched with expiry alerts.


EC-03.4: Certificate Expires on Nigerian Public Holiday [P1]
Scenario
A PCC certificate expires on a Nigerian federal public holiday. Renewal portals at government agencies are offline. The company cannot renew on the expiry date.
System Response
ClearPass maintains a table of Nigerian federal public holidays updated annually. When the expiry date of any certificate falls on a public holiday, the 7-day alert message includes a specific warning: Note: [certificate] expires on [date] which is a public holiday. [Agency] renewal portals may be offline. We recommend initiating renewal by [date minus 3 business days].
Score Handling
The certificate moves to Expired state at midnight regardless of the public holiday. The Ineligible to Bid badge activates. This cannot be suppressed because public holidays do not legally extend certificate validity. However, the company record is tagged with a public_holiday_expiry flag and the admin team is alerted to handle any support queries with priority.
Future Enhancement
Phase 2 will include a Public Holiday Expiry Detector that identifies all certificates expiring within 5 days of a public holiday and sends advance warnings 35 days before expiry instead of the standard 30 days.


EC-03.5: NHIA Hard Cap Applied After Subscription Payment [P1]
Scenario
A company pays for the Business subscription tier expecting to achieve Procurement Ready status. After payment, the NHIA hard cap (EC-03.x) reduces their score to 49 because their NHIA certificate is expired. They paid for a feature they cannot access until NHIA is resolved.
System Response
During the subscription upgrade flow, before payment is processed, the system checks whether the NHIA hard cap is active on the account. If yes, a pre-payment warning is displayed: Your current NHIA certificate status will limit your maximum compliance score to 49 out of 100 and prevent Procurement Ready status. Resolving your NHIA certificate is required to unlock full Business tier benefits. Would you like to proceed with payment or resolve your NHIA certificate first?
Business Rule
Payment is not blocked. The warning is informational. Refunds are not issued for this scenario. The warning disclosure removes any grounds for dispute.


8.4 MDA Verification Edge Cases
EC-04.1: Company Not Registered on ClearPass [P1]
Scenario
An MDA officer queries an RC number that does not exist in the ClearPass database. The company exists in the real world but has not registered on ClearPass.
System Response
The query returns a Not Found result clearly distinguished visually from a non-compliant result. The officer sees the queried RC number, a message that this company is not registered on ClearPass, and an option to send an automated invitation to register. The Not Found result is logged in VerificationQuery for billing and audit purposes.
Invitation Flow
If the officer clicks Invite to Register, the system uses the CAC API to retrieve the company's registered email address and sends a ClearPass registration invitation on behalf of the MDA. The invitation email names the specific MDA that queried them.
Business Opportunity
Every Not Found query is a potential customer. The admin analytics dashboard tracks Not Found queries as an unregistered company pipeline. This data informs outreach strategy to compliance consultants who can bring unregistered companies onto the platform.


EC-04.2: Verification Query at Exact Moment of Certificate State Change [P0]
Scenario
An MDA officer queries a company at the exact millisecond that a certificate transitions from Active to Expired due to the nightly expiry scanning job. The query reads the pre-transition state.
System Response
The VerificationQuery result_snapshot is a transactional read. PostgreSQL REPEATABLE READ isolation level ensures the snapshot reflects a consistent state at the start of the transaction. The snapshot is internally consistent even if a write occurs concurrently. The report generated from this query reflects the state at the time the query transaction began.
Edge Communication
If the QR code on a report generated from this query is scanned after the state transition completes, the live verification page shows the current Expired state with a warning that status has changed since report generation. This is the correct and intended behaviour per EC-03.2.


EC-04.3: Bulk CSV with Malformed or Duplicate RC Numbers [P1]
Scenario
An officer uploads a bulk verification CSV that contains: some invalid RC numbers (wrong format), some duplicate RC numbers, some RC numbers with extra whitespace, and some empty rows.
System Response
Pre-processing validation runs on the CSV before any queries execute. Validation rules: RC numbers are trimmed of whitespace, empty rows are skipped, duplicate RC numbers within the file are deduplicated with a note in the results, RC numbers failing format validation are listed in a separate Skipped rows section of the results with the reason. Valid, unique RC numbers proceed to verification.
CSV Injection Prevention
Any cell value beginning with =, +, -, or @ (common CSV injection characters) is sanitised before processing. Formulas are never evaluated. The CSV is treated as plain text data only.
Results Structure
The output distinguishes: Verified (compliant), Verified (non-compliant), Not Found, and Skipped (invalid format). Each category has a count and all results are exportable as a PDF verification report.


EC-04.4: QR Code Scanned After Report Expiry [P1]
Scenario
An MDA officer scans the QR code on a compliance report that is older than 90 days. The report has expired.
System Response
The verification URL resolves successfully (it never returns a 404). The page displays the expired report with a prominent Expired Report banner. It shows the historical snapshot from when the report was generated, the current live status, and a message that this report is expired and should not be used for procurement decisions. It prompts the officer to request a fresh report from the company.
Business Rule
Expired reports are preserved in storage permanently. The live verification URL always resolves. This protects against scenarios where an officer scans a report during a historical audit years later. The data is accessible even if the report is no longer valid for current procurement use.


EC-04.5: MDA Verification API Rate Limit Breach [P0]
Scenario
An MDA integrates ClearPass verification into their tender portal. During a high-volume tender period, their system sends thousands of verification queries per hour, exceeding the agreed rate limit.
System Response
Requests exceeding the rate limit receive HTTP 429 with a Retry-After header specifying the wait time. The MDA's queries_used_this_month counter continues to increment for billing purposes. An automated alert is sent to the MDA billing contact and to the ClearPass admin team. If the overage is sustained for more than 30 minutes, the admin team proactively contacts the MDA to discuss tier upgrade or bulk pricing.
Protection Against Abuse
If an API key triggers 429 responses more than 1,000 times within a 1-hour window, it is automatically placed on a temporary suspension requiring manual admin review. This prevents a single compromised API key from causing a denial-of-service on the verification infrastructure.


8.5 Payment and Subscription Edge Cases
EC-05.1: Duplicate Paystack Webhook Event [P0]
Scenario
Paystack delivers the same payment success webhook twice due to their retry mechanism. ClearPass could process the same payment twice, creating duplicate subscriptions or invoice records.
System Response
Every incoming webhook event is deduplicated using the Paystack event ID. Before processing, the event ID is checked against a webhooks_processed table. If already processed, the webhook is acknowledged (HTTP 200) and discarded. The webhooks_processed table retains event IDs for 90 days.
Prevention
Webhook idempotency is a platform-wide requirement, not a per-endpoint decision. Every webhook handler must implement this check before any database writes. This requirement is enforced in code review.


EC-05.2: Payment Succeeds But Webhook Never Arrives [P0]
Scenario
A company completes payment on Paystack. Paystack processes the payment successfully. The webhook to ClearPass fails to deliver due to a network error. The company's account is not upgraded. The company paid but receives no benefit.
System Response
ClearPass implements a payment reconciliation job that runs every 6 hours. It queries the Paystack API for all transactions in the past 24 hours that have succeeded status and cross-references against the ClearPass subscriptions table. Any Paystack transaction with a matching reference but no corresponding active subscription triggers an automatic subscription activation and sends a delayed confirmation email to the company.
User Communication
If a company contacts support claiming payment was made but subscription was not activated, the support agent can trigger a manual reconciliation for that specific company reference number. The reconciliation result and activation (if applicable) is logged in the AuditLog.
Prevention
The payment initiation endpoint stores a pending subscription record before redirecting to Paystack. If the webhook arrives and activates the subscription, the pending record is updated. If the reconciliation job runs and finds a pending record with a confirmed Paystack payment, it activates from the pending record. The pending record prevents double-activation.


EC-05.3: Subscription Expires Mid-Report-Generation [P1]
Scenario
A company's subscription expires at midnight. At 23:58 they begin generating a compliance report. The generation job takes 3 minutes. At 00:01 the subscription has expired. Should the report complete?
System Response
Report generation is gated at the point of initiation, not at completion. If the user's subscription permits report generation when the button is clicked, the report completes regardless of what happens to the subscription during generation. The subscription check is not re-run mid-process. This is the user-fair approach: they had a valid subscription when they initiated the action.
Business Rule
The generated report is stored and accessible even after subscription expiry. Historical reports are never deleted. The company can view reports generated during their subscription period from a read-only history screen even on the Starter tier.


EC-05.4: Company Downgrades with More Sub-Accounts Than Tier Allows [P1]
Scenario
An Enterprise tier company has 15 sub-accounts and 8 linked client companies. They downgrade to Business tier which allows 5 sub-accounts. What happens to the excess accounts?
System Response
Downgrade is not immediate. When a downgrade is requested, the system calculates the resource gap: 10 excess sub-accounts, 8 excess client links. The user sees a Downgrade Impact Preview listing which resources will be affected. The primary account holder must confirm by selecting which 5 sub-accounts to retain and manually removing the rest before the downgrade is finalised.
Grace Handling
If a subscription expires without a deliberate downgrade (non-renewal), a 72-hour grace window is given for the company to log in and select which sub-accounts to retain. After 72 hours, the system auto-deactivates excess sub-accounts starting from the most recently created. Deactivated sub-accounts are not deleted. They can be reactivated upon subscription upgrade. Users whose accounts are deactivated receive an email notification with reactivation instructions.


EC-05.5: Chargeback Initiated Against ClearPass [P1]
Scenario
A company disputes a subscription charge with their bank after receiving service. Paystack initiates a chargeback process.
System Response
Paystack's chargeback webhook triggers an immediate flag on the company account. The subscription is placed in a Dispute Hold state: the company retains access to their existing data and reports but cannot generate new compliance reports or connect new certificates. The ClearPass finance team is alerted to respond to the chargeback with evidence: the invoice, the audit log of service usage during the subscription period, and the timestamp of activation.
Policy
If the chargeback is resolved in the company's favour, the subscription is cancelled and the account is permanently flagged. Future subscription attempts from the same company require prepayment by bank transfer with a 5-business-day clearing period before activation. This policy is documented in ClearPass terms of service.


8.6 NHIA Enrollment and HMO Edge Cases
EC-06.1: HMO Portal Offline During Enrollment Handoff [P1]
Scenario
A company selects an HMO and ClearPass attempts the pre-filled enrollment handoff. The HMO portal returns an error or timeout.
System Response
The handoff attempt is logged with status failed. The user sees a message that the HMO portal is temporarily unavailable. The handoff data (company details) is retained in the EnrollmentReferral record. The user is offered two options: try a different HMO from the directory, or retry this HMO later. A Retry Later option stores the intended HMO selection and sends the user a reminder email in 4 hours with a direct retry link.
Monitoring
The admin portal tracks HMO portal availability based on handoff success rates. An HMO whose handoff failure rate exceeds 20% in a 24-hour period is temporarily deprioritised in the HMO directory and the ClearPass partner team is alerted to contact the HMO.


EC-06.2: HMO Partner Loses NHIA Accreditation [P0]
Scenario
An HMO partner has their NHIA accreditation revoked after companies have already been referred to them and are mid-enrollment.
System Response
When ClearPass's quarterly HMO accreditation validation job detects a revoked accreditation (checked against the NHIA partner registry), the HMO is immediately deactivated in the HMO directory. All EnrollmentReferral records in initiated, hmo_selected, or application_submitted states for this HMO are transitioned to failed with reason hmo_accreditation_revoked. Every affected company receives a Priority Alert notification explaining that their selected HMO is no longer NHIA-accredited and they must select a new HMO to continue enrollment. Commissions for failed referrals are reversed.
Prevention
HMO accreditation validation runs quarterly and also whenever NHIA publishes an updated partner list. The system checks for any changes within 48 hours of a list update.


EC-06.3: Company Attempts Enrollment with Two HMOs Simultaneously [P1]
Scenario
A company initiates enrollment with HMO A. Before completing, they initiate a second enrollment with HMO B (perhaps from a different device or team member).
System Response
A company can have only one active EnrollmentReferral per certificate type at a time. If a referral exists in initiated or application_submitted state, a second enrollment attempt triggers a warning: You already have an active NHIA enrollment in progress with [HMO A]. Starting a new enrollment with [HMO B] will cancel the previous one. Would you like to proceed? Cancellation of the previous referral is required before the new one begins.
Commission Handling
Cancelled referrals do not generate commissions. Only successfully completed enrollments with certificate issuance generate commission payments.


8.7 Government API Integration Edge Cases
EC-07.1: All Government APIs Simultaneously Unavailable [P0]
Scenario
A network or infrastructure event causes all government API integrations to fail simultaneously. No certificates can be API-verified.
System Response
The Integration Health Monitor detects the mass failure within 60 seconds. A platform-wide banner is activated for all users: Government verification services are currently experiencing disruptions. Certificate submissions will be queued for API verification and processed automatically when services resume. Manual review is available as an alternative. The banner includes a real-time status indicator for each government API.
Operations Response
The ops alert triggers a P0 incident response. The on-call engineer verifies whether the issue is on ClearPass's side (network, credential expiry) or on the government side. If on ClearPass's side, resolution is immediate. If on the government side, the manual review queue is prioritised and the admin team is staffed up to clear the backlog.
SLA Impact
The 24-hour manual review SLA is suspended during a declared government API outage. A status page entry is created. The SLA clock resumes when APIs recover.


EC-07.2: Government API Returns Success with Empty or Null Data [P0]
Scenario
A government API returns HTTP 200 but the certificate data fields in the response are null, empty, or missing key fields (expiry date, certificate number, company name).
System Response
The API connector validates the response payload against a defined schema before using the data. A response that passes HTTP status validation but fails payload validation is treated identically to a timeout: the certificate enters manual review fallback. The raw null response is stored in api_check_result for engineering investigation. An alert is sent to the integration monitoring channel.
Prevention
Each government API connector has a response schema definition. Schema validation is a required step in every connector, not an optional one. If a government API changes its response format, the schema validation failure alerts engineering before stale or incorrect data reaches users.


EC-07.3: Government API Credentials Expire [P0]
Scenario
An API key or OAuth token used to authenticate against a government API expires. All verification queries for that certificate type begin failing.
System Response
The Integration Health Monitor detects the authentication failure pattern (repeated 401 or 403 responses) and distinguishes it from general API unavailability. An ops alert is triggered with the specific error type: Authentication failure, credential rotation required. The affected certificate type enters graceful degradation mode (manual review fallback). Rotation is performed by the on-call engineer using the credential stored in the secrets manager.
Prevention
All government API credentials have expiry dates tracked in the secrets manager. A 30-day advance alert is sent to the engineering team when any credential approaches expiry. Credential rotation is a scheduled maintenance task, not an emergency response.


8.8 Security and Fraud Edge Cases
EC-08.1: Admin Account Compromise [P0]
Scenario
An admin account is compromised. The attacker has access to the admin portal and can approve certificates, suspend companies, and view all platform data.
System Response
All admin actions are logged in the AuditLog with IP address and user agent. Anomalous admin behaviour is flagged by the fraud detection module: approvals from a new IP address, bulk certificate approvals in a short time window, or access from an unrecognised device. An anomaly alert is sent to the super admin by email and SMS. The compromised admin account can be suspended from the super admin portal which immediately terminates all active sessions and invalidates all authentication tokens.
Recovery
All actions performed by the compromised account during the suspected compromise window are listed for review. The super admin determines which actions require reversal. Certificate approvals made during the compromise window are flagged for re-verification by another admin.
Prevention
MFA is mandatory for all admin accounts (enforced at the application layer with no bypass). Admin sessions expire after 2 hours of inactivity. Admin logins from new devices require email confirmation before access is granted. These are non-negotiable security requirements.


EC-08.2: API Key Leaked in Public Repository [P1]
Scenario
An MDA or enterprise company accidentally commits their ClearPass API key to a public GitHub repository.
System Response
ClearPass integrates with GitHub's Secret Scanning Partner Program. When GitHub detects a ClearPass API key pattern in a public repository, it sends an automated alert to ClearPass. The key is immediately revoked without waiting for the key holder to act. The key holder receives an email: Your API key [prefix] has been automatically revoked because it was detected in a public repository. Please generate a new key in your ClearPass settings.
Key Design
ClearPass API keys use a distinctive prefix format (cpk_live_ or cpk_test_) that allows GitHub's secret scanning to pattern-match them reliably. This prefix pattern is registered with GitHub's Secret Scanning Partner Program before platform launch.


EC-08.3: Brute Force Attack on Login Endpoint [P0]
Scenario
An attacker attempts to brute force credentials against the login endpoint using automated tooling.
System Response
After 5 failed login attempts from the same IP address within a 10-minute window, the IP is rate-limited to 1 attempt per minute. After 10 total failed attempts across any IP for a single email address, the account is temporarily locked for 30 minutes and the account holder receives an email alert: Unusual login activity detected on your ClearPass account. If this was not you, please reset your password. After account unlock, if a further failed attempt occurs, the account is locked until the user resets their password via email.
Logging
All failed login attempts are written to the AuditLog with IP address and user agent. Patterns across multiple accounts from the same IP are flagged as a credential stuffing attempt and the IP is blocked platform-wide for 24 hours.


EC-08.4: Report ID Enumeration Attack [P1]
Scenario
An attacker discovers that report IDs follow a predictable pattern and attempts to enumerate report URLs to access compliance data for companies they are not authorised to view.
System Response
Report IDs use the format CPR-YYYYMMDD-XXXXXXX where XXXXXXX is a cryptographically random alphanumeric string, not a sequential counter. The search space for the random component is sufficiently large to make enumeration computationally impractical. The live verification URL for each report additionally requires a one-time token for the first access and then cookies for subsequent access within the same session. Unauthenticated bulk access attempts to the verification endpoint are rate-limited.
Additional Protection
The verification page for a company report only shows certificate type and status, not the full company profile, directors, or financial information. The minimum necessary information is displayed to serve the verification purpose.


8.9 System and Infrastructure Edge Cases
EC-09.1: Database Primary Failure with Stale Read Replica [P0]
Scenario
The primary PostgreSQL database fails. The read replica has a replication lag of 45 seconds, meaning some recent writes are not yet present on the replica.
System Response
ClearPass uses a read-write split architecture: writes go to the primary, reads go from the replica. On primary failure, automatic failover promotes the replica to primary (using AWS RDS Multi-AZ or equivalent). During the failover window (typically 30-60 seconds), write operations are queued or rejected with a 503 response. After promotion, the new primary has all data up to the replication lag point. Any writes that occurred within the lag window and were not replicated are lost.
Data Loss Mitigation
The maximum replication lag is monitored and alarmed at 30 seconds. If lag exceeds 30 seconds, an ops alert triggers. Certificate status changes and AuditLog entries use synchronous replication (PostgreSQL synchronous_commit = on) to ensure these critical records are never lost in a failover. Non-critical writes (notification delivery status, dashboard analytics) use asynchronous replication.
Recovery Communication
If any data loss is confirmed post-failover, affected companies are identified from the AuditLog (which is synchronously replicated) and notified specifically. A status page entry documents the incident.


EC-09.2: Certificate Document Storage Unavailability [P1]
Scenario
The S3 or Cloudflare R2 bucket storing certificate documents becomes temporarily unavailable. Admin reviewers cannot open documents for review.
System Response
Document retrieval failures are caught at the application layer. The admin review interface displays a Storage temporarily unavailable message for affected documents rather than a broken image or timeout. The review queue is not blocked: reviewers can skip unavailable documents and return to them later. The ops team is alerted to the storage failure.
Prevention
Certificate documents are stored with cross-region replication enabled. The primary bucket (Nigeria or nearest region) has an automatic failover to a secondary region. The application attempts the secondary bucket if the primary is unavailable. This is a configuration requirement, not a code requirement.


EC-09.3: Notification Service Down at Midnight During Mass Expiry [P0]
Scenario
The SMS or email service provider is down at midnight when the nightly expiry scanning job runs and transitions multiple certificates to Expired state, triggering alert notifications that cannot be delivered.
System Response
Notification failures are written to the Notification table with status = failed and retry_count = 0. The retry queue job runs every 30 minutes and attempts redelivery for failed notifications with retry_count under 3. Exponential backoff: first retry at 30 minutes, second at 2 hours, third at 6 hours. If all retries fail, the notification is moved to permanent failure state and an in-app notification is displayed on the user's next login: We attempted to send you an alert about [certificate] on [date] but encountered a delivery issue. Please review your certificate status.
Prevention
Both SMS and email use primary and fallback providers (Termii primary, Twilio Nigeria fallback for SMS. Postmark primary, Sendgrid fallback for email). The notification service attempts the primary provider first and falls back automatically on failure. Dual-provider failover is implemented at the notification service layer, not the application layer.


8.10 Data Consistency Edge Cases
EC-10.1: Partial Write on Certificate Update [P0]
Scenario
A certificate status update writes successfully to the Certificate table but the corresponding CertificateHistory INSERT fails. The status is updated but there is no audit trail of the change.
System Response
Certificate status updates and CertificateHistory INSERTs are always wrapped in a single database transaction. If either operation fails, the entire transaction is rolled back. The certificate retains its previous status. The failure is logged at the application layer. This is a non-negotiable implementation requirement: these two writes are never separated.
Extension
The same transactional requirement applies to: company health score update plus score history record, payment processing plus invoice creation, subscription creation plus notification queuing. Any pair of writes that must be consistent are always in the same transaction.


EC-10.2: VerificationQuery Table Partition Boundary [P1]
Scenario
A bulk verification query is initiated at 23:59 on the last day of a month. Some rows complete before midnight and write to the current month's partition. Remaining rows complete after midnight and write to the next month's partition. The MDA billing statement for the month is then split across two partitions.
System Response
The billing statement job uses the queried_at timestamp from each row, not the partition boundary. Rows with queried_at in the billing month are included regardless of which partition they physically reside in. The bulk_batch_id groups all rows from the same upload for cohesive reporting. This is the correct behaviour by design: the query was initiated in the billing month and is billed accordingly.
Implementation Note
The billing query must always use queried_at in the WHERE clause, never assume partition boundaries. Developers must be made aware that querying a monthly partition by its name is not equivalent to querying by date range.


8.11 Regulatory and Business Continuity Edge Cases
EC-11.1: NHIA Mandate Suspended or Reversed [P0]
Scenario
A court injunction or change of government reverses the September 2025 presidential directive making NHIA certificates mandatory for procurement.
Business Response
ClearPass's value proposition does not depend solely on the NHIA mandate. The multi-certificate compliance hub serves a real pain point regardless of whether NHIA is the anchor certificate. The platform pivots the marketing emphasis to the PCC and NSITF certificates, which have been mandatory for years and will not be reversed. The NHIA module is retained as an optional compliance enhancement rather than a mandatory requirement.
Product Response
The NHIA hard block rule in the health score formula is made configurable from the admin portal. If the mandate is suspended, the admin toggles NHIA from Anchor Certificate to Standard Certificate status. This removes the hard cap and adjusts the weighting proportionally. The change is applied to all companies immediately with a platform notification explaining the adjustment.
Data Response
All NHIA enrollment data, referral records, and commission records are retained regardless of mandate status. If the mandate is reinstated (which is probable given historical patterns), the data integrity is preserved.


EC-11.2: Government Builds a Competing Platform [P1]
Scenario
NHIA or BPP announces and begins building their own compliance verification platform that would replicate ClearPass functionality.
Strategic Response
ClearPass should already hold a first-mover position and an MoU with NHIA before this scenario becomes relevant. The response is to deepen integration rather than compete. Position ClearPass as the private-sector compliance dashboard that sits above any government platform and aggregates data from it. The government platform becomes another data source for ClearPass, not a replacement for it.
Product Response
The integration layer in Module 7 is designed for exactly this scenario. A government-built verification system becomes Integration Priority 1 for the connector, and ClearPass adds an API endpoint that queries the government platform. Users continue to use ClearPass as the unified view. The government platform adds ClearPass as a distribution channel.


EC-11.3: Company Compliance Data Subpoenaed [P0]
Scenario
Law enforcement or a court issues a subpoena or court order requiring ClearPass to produce compliance data for a specific company.
Response Protocol
ClearPass maintains a Legal Requests Policy published on its website. All legal requests are directed to a designated legal contact email. No data is released without verification of the legal instrument. Requests are reviewed by qualified legal counsel within 5 business days. Data is released only to the extent required by the legal instrument. The company named in the request is not notified if the legal instrument prohibits notification.
Data Availability
The AuditLog, CertificateHistory, VerificationQuery, and ComplianceReport tables retain comprehensive historical records that can satisfy most regulatory and legal discovery requests. Data exports for legal requests are formatted as tamper-evident archives with a chain of custody documentation.


EC-11.4: NDPA Audit or Data Breach Notification [P0]
Scenario
NITDA initiates an NDPA compliance audit of ClearPass's data handling practices, or a data breach is detected requiring mandatory notification.
Audit Response
The AuditLog provides a complete record of all data access, modifications, and exports. The BVN non-storage architecture (hash only) is documented and demonstrable. The NDPA consent records in the User table show the timestamp and version of consent given by each data subject. Data residency in Nigeria is verified by the hosting configuration. The Data Protection Officer is the designated point of contact for NITDA.
Breach Response
In the event of a confirmed data breach, the NDPA requires notification to NITDA within 72 hours and to affected data subjects without undue delay. The incident response plan (to be developed before launch) defines the notification templates, the escalation chain, the technical containment steps, and the post-incident review process.
Pre-Launch Requirement
A formal Data Protection Impact Assessment (DPIA) must be completed and filed with NITDA before ClearPass processes the first real user record. This is a legal requirement under the NDPA 2023 for platforms processing sensitive categories of data.


9. API Specifications
This section defines two distinct API concerns. Section 9A defines the ClearPass Public REST API which ClearPass exposes to MDA integrators and enterprise customers. Section 9B defines the Government Integration Architecture which covers how ClearPass connects to each government data source, the honest reality of access availability for each, the four-tier fallback strategy that ensures the product works regardless of government API maturity, and the step-by-step access acquisition strategy for each certificate.
Section 9B is the most critical section in this document for long-term product survival. The single most common cause of failure in Nigerian GovTech products is building against government API availability as an assumption rather than a variable. ClearPass is designed to work at every level of government digital maturity, from a live JSON API to a manual human review, without breaking the user experience at any level.
9A: ClearPass Public REST API
The API ClearPass exposes to MDA officers, enterprise companies, and system integrators. Every endpoint in this section is within ClearPass control and can be built and tested independently of any government API availability.
9A.1 Authentication
All API requests require an API key passed in the Authorization header. Keys are issued from the ClearPass dashboard for MDA and Enterprise tier accounts. Keys use environment prefixes to distinguish live and test credentials.
Header format
Authorization: Bearer cpk_live_a1b2c3d4e5f6g7h8
Key formats
cpk_live_ prefix for production keys. cpk_test_ prefix for sandbox keys. Keys are 48 characters total after the prefix.
Key rotation
Keys can be rotated at any time from the dashboard without downtime. Old keys remain valid for 24 hours after rotation to allow the consumer to update their integration.
Scopes
Each key is issued with specific scopes: verify.single, verify.bulk, webhook.subscribe, reports.read. A key without the required scope for an endpoint returns HTTP 403.


9A.2 Standard Response Envelope
Every ClearPass API response follows a consistent envelope structure. Successful responses use HTTP 200 or 201. Errors use the appropriate 4xx or 5xx code with a machine-readable error body.
Success response structure
{ "data": { ... }, "meta": { "queried_at": "ISO8601", "formula_version": "1.0", "data_source": "api_verified | admin_approved | cached", "cache_age_seconds": 0 } }
Error response structure
{ "error": { "code": "COMPANY_NOT_FOUND", "message": "Human-readable description", "field": "rc_number (for validation errors)", "docs_url": "https://api.clearpass.com.ng/docs/errors#COMPANY_NOT_FOUND" } }
data_source field
This field tells the API consumer how fresh and how authoritative the compliance data is. api_verified means the certificate was confirmed directly against a government source within the cache window. admin_approved means a ClearPass reviewer confirmed it from a document. cached means the data is from a stored snapshot and the live source has not been re-queried within the cache window.


9A.3 Endpoint: Single Company Verification
Method and path
GET /v1/companies/{rc_number}/compliance
Required scope
verify.single
Description
Returns the full real-time compliance status for a single company. Triggers a live re-verification against available government sources if the cached data is older than the configured TTL for each certificate type.
Path parameter
rc_number: The CAC registration number. Accepts RC followed by 6 digits. Leading zeros are preserved. Whitespace is trimmed automatically.
Query parameters
include_certificates=true|false (default true). include_score_breakdown=true|false (default false, Enterprise only). as_of_date=YYYY-MM-DD (for historical point-in-time queries, Business tier and above).
Success response 200
{ "data": { "company": { "rc_number": "RC123456", "name": "Zenith Construction Ltd", "cac_verified": true, "country_code": "NG" }, "compliance": { "health_score": 87, "procurement_ready": true, "ineligible_to_bid": false, "certificates": [ { "type": "nhia", "status": "active", "reference_number": "NHIA-2026-001234", "expiry_date": "2027-03-15", "days_until_expiry": 311, "verification_method": "api_verified", "issuing_authority": "National Health Insurance Authority" }, { "type": "pcc", "status": "expiring_14", "reference_number": "PCC-2026-005678", "expiry_date": "2026-05-22", "days_until_expiry": 14, "verification_method": "admin_approved", "issuing_authority": "Pension Commission" } ] }, "projected_score": { "value": 61, "trigger_date": "2026-05-22", "trigger_certificate": "pcc" } }, "meta": { "queried_at": "2026-05-08T10:30:00Z", "formula_version": "1.0", "data_source": "mixed" } }
Error 404
{ "error": { "code": "COMPANY_NOT_FOUND", "message": "No company found with RC number RC999999. This company may not be registered on ClearPass.", "docs_url": "..." } }
Error 422
{ "error": { "code": "INVALID_RC_NUMBER", "message": "RC number must be in format RC followed by 6 digits.", "field": "rc_number", "docs_url": "..." } }


9A.4 Endpoint: Bulk Verification
Method and path
POST /v1/verification/bulk
Required scope
verify.bulk
Description
Submits a list of RC numbers for batch compliance verification. Returns results asynchronously for batches larger than 10 companies. Synchronous for 10 or fewer.
Request body
{ "rc_numbers": ["RC123456", "RC789012", "RC345678"], "callback_url": "https://mda-portal.gov.ng/webhooks/clearpass" }
Synchronous response (10 or fewer)
HTTP 200 with results array in data field. Same structure as single verification per company.
Asynchronous response (11 to 100)
HTTP 202 Accepted with a batch_id. Results are delivered to the callback_url when complete. The batch status can also be polled at GET /v1/verification/bulk/{batch_id}.
Batch status polling
GET /v1/verification/bulk/{batch_id} returns: batch_id, status (processing | complete | partial_failure), total_count, completed_count, estimated_completion_seconds, results (populated when complete).
Error 413
Batch exceeds 100 companies. Response includes maximum_batch_size: 100 and instructions to split into multiple requests.


9A.5 Endpoint: Certificate Status
Method and path
GET /v1/companies/{rc_number}/certificates/{type}
Required scope
verify.single
Description
Returns detailed status for one specific certificate type. Useful for MDA portals that only need to check a single certificate rather than the full compliance picture.
Path parameters
rc_number: Company RC number. type: One of nhia, pcc, nsitf, itf, firs_tin, bpp.
Success response 200
{ "data": { "type": "nhia", "status": "active", "reference_number": "NHIA-2026-001234", "expiry_date": "2027-03-15", "days_until_expiry": 311, "verification_method": "api_verified", "last_verified_at": "2026-05-08T06:00:00Z", "issuing_authority": "National Health Insurance Authority", "is_applicable": true } }


9A.6 Endpoint: Report Verification (QR Code)
Method and path
GET /v1/reports/{report_id}/verify
Authentication
No API key required. This is a public endpoint accessible by anyone who scans a QR code. Rate-limited to 60 requests per minute per IP.
Description
Returns the original report snapshot alongside the current live status. This is the endpoint that QR codes on compliance reports resolve to.
Success response 200
{ "data": { "report": { "report_id": "CPR-20260508-A7X9K2", "generated_at": "2026-05-08T09:00:00Z", "report_type": "standard", "watermark": "none", "expires_at": "2026-08-06T09:00:00Z", "is_expired": false }, "snapshot_at_generation": { "health_score": 94, "procurement_ready": true, "certificates": [ ... ] }, "current_status": { "health_score": 87, "procurement_ready": true, "status_changed_since_generation": true, "changes": [ { "type": "pcc", "previous_status": "active", "current_status": "expiring_14", "note": "PCC certificate is approaching expiry." } ] } } }
status_changed_since_generation flag
This field is critical. Any consumer of this endpoint must check this flag and display the change notification prominently. A report where this is true must show both the original state and the current state side by side.


9A.7 Endpoint: Webhook Management
Register webhook
POST /v1/webhooks. Body: { event_types: [certificate.expired, certificate.expiring_7, compliance.status_changed], callback_url: https://..., secret: your-signing-secret }
List webhooks
GET /v1/webhooks. Returns all registered webhooks for the API key.
Delete webhook
DELETE /v1/webhooks/{webhook_id}
Webhook payload
{ "event": "certificate.expired", "company": { "rc_number": "RC123456", "name": "Zenith Construction Ltd" }, "certificate": { "type": "nsitf", "previous_status": "expiring_7", "new_status": "expired", "expiry_date": "2026-05-08" }, "occurred_at": "2026-05-08T00:01:00Z" }
Webhook security
Every webhook delivery includes a X-ClearPass-Signature header. The value is HMAC-SHA256 of the raw request body using the consumer's registered secret. The consumer must validate this signature before processing any webhook payload. Webhooks with invalid signatures must be rejected with HTTP 401.


9A.8 Standard Error Codes
COMPANY_NOT_FOUND
RC number exists in correct format but no matching company in ClearPass. HTTP 404.
INVALID_RC_NUMBER
RC number does not match the expected format. HTTP 422.
COMPANY_SUSPENDED
The queried company has been suspended on ClearPass. Compliance status is unavailable. HTTP 403.
CERTIFICATE_TYPE_INVALID
The certificate type in the path is not one of the six valid types. HTTP 422.
INSUFFICIENT_SCOPE
The API key does not have the required scope for this endpoint. HTTP 403.
RATE_LIMIT_EXCEEDED
Request rate limit has been exceeded. HTTP 429. Includes Retry-After header.
BATCH_TOO_LARGE
Bulk verification batch exceeds 100 companies. HTTP 413.
REPORT_NOT_FOUND
Report ID does not exist or has been archived. HTTP 404.
SERVICE_UNAVAILABLE
ClearPass is under maintenance or experiencing an incident. HTTP 503. Includes a status page URL.


9A.9 Rate Limiting Headers
All API responses include rate limiting headers so consumers can manage their usage proactively.
X-RateLimit-Limit
Total requests allowed per minute for this key.
X-RateLimit-Remaining
Requests remaining in the current window.
X-RateLimit-Reset
Unix timestamp when the current window resets.
X-RateLimit-Tier
The rate limit tier of the API key: free, standard, enterprise.
Retry-After
Included only on 429 responses. Seconds until the next request is permitted.


9A.10 API Versioning Strategy
Current version
/v1/ prefix on all endpoints. The version is in the URL path, not a header.
Backward compatibility guarantee
Non-breaking changes (new optional response fields, new optional parameters) are added without a version bump. Breaking changes (removing fields, changing field types, changing authentication) require a new version.
Deprecation policy
When a new version is released, the previous version receives a minimum 12-month deprecation window with active support. After 12 months, the previous version enters read-only maintenance mode for 6 more months before retirement. Total transition window: 18 months. Consumers are notified via email and deprecation headers on every response during the deprecation window.
Deprecation header
Sunset: Sat, 01 Nov 2027 00:00:00 GMT. Link: https://api.clearpass.com.ng/docs/v2/migration; rel=successor-version


9B: Government Integration Architecture
This section addresses the most operationally critical challenge in the ClearPass build: the highly variable digital maturity of Nigerian government agencies. Some agencies have mature APIs. Some have portals but no API. Some have APIs that require a formal agreement before access is granted. Some have data locked in legacy systems with no external access path at all.
The product cannot be built assuming API access is guaranteed for any certificate. It must be built to work across all integration tiers. The four-tier integration architecture below ensures ClearPass remains fully functional regardless of where each government agency sits on the digital maturity spectrum on any given day.

9B.1 The Four-Tier Integration Architecture
For each certificate type, ClearPass attempts verification from the highest available tier downward. The tier used for each certificate is stored in the verification_method field and is visible in the API response and user dashboard. Users are never told that their data is unverified. They are told exactly how it was verified.
Tier 1: Direct Government API
ClearPass queries the government agency's REST or SOAP API directly with a certificate reference number and receives a structured response. This is the gold standard. Data is real-time, source-confirmed, and machine-readable. Displayed as: API Verified.
Tier 2: Government Portal Web Extraction
Where a government agency has an online verification portal but no API, ClearPass uses an authorised web extraction integration to submit the certificate reference to the portal's verification form and parse the HTML response. This is done with the agency's knowledge, disclosed in formal correspondence, and rate-limited to avoid disrupting their portal. Displayed as: Portal Verified.
Tier 3: Authorised Batch File Processing
Some agencies provide periodic data exports (daily, weekly, or monthly CSV or Excel files) containing valid certificate holders. ClearPass receives these files through a secure transfer agreement and loads them into a searchable database. Verification is against this database, not a live source. Displayed as: Batch Verified (Data as of [date]).
Tier 4: Manual Review
A ClearPass compliance reviewer examines the uploaded certificate document, cross-references it against any available public information (the agency portal, known certificate formats, anti-forgery checks), and approves or rejects it. This is slower but it is not less valid. Displayed as: Reviewer Verified.


9B.2 Integration Status and Strategy Per Certificate
The following maps the current state of each certificate integration, the realistic access path, the fallback tier active at launch, and the acquisition strategy to move up the tier hierarchy over time.

NHIA Health Insurance Certificate
Current API status
No API exists as of May 2026. The September 2025 presidential directive mandated the digital platform but it has not been built.
Launch tier
Tier 4: Manual Review. A ClearPass reviewer verifies uploaded NHIA certificates against the NHIA portal and known certificate formats.
Target tier
Tier 1: Direct API. To be established as part of the ClearPass-NHIA MoU.
Access acquisition strategy
The NHIA MoU is the primary business relationship for ClearPass. The negotiation positions ClearPass as the private-sector verification layer for the mandate. The MoU explicitly grants API access to the NHIA enrollment and certificate status database. This is the foundational agreement from which all other government API negotiations draw credibility.
Timeline to Tier 1
3 to 9 months after MoU signing. The MoU negotiation itself is estimated at 1 to 3 months given the urgency of the mandate and the absence of any competing platform.
Risk if API not achieved
High but manageable. Manual review at Tier 4 is operationally intensive but viable for the first 3 to 6 months. The 24-hour review SLA must be maintained. Reviewer headcount scales with volume. The business model must account for manual review costs at this tier.
Interim validation enhancement
While awaiting API access, ClearPass requests that NHIA publish a simple public verification page where a certificate reference number can be entered and status confirmed. This enables Tier 2 web extraction and reduces manual review burden significantly.


PenCom Pension Clearance Certificate
Current API status
A verification feed exists and is consumed by BPP for procurement purposes. PenCom also has an online verification portal at ecompliance.pencom.gov.ng.
Launch tier
Tier 2: Web Extraction from ecompliance.pencom.gov.ng. The portal accepts PCC reference numbers and returns holder name, status, and expiry date in a consistent HTML format.
Target tier
Tier 1: Direct API access through a formal data-sharing agreement with PenCom.
Access acquisition strategy
Formal written request to the PenCom Director General's office, with the NHIA MoU as supporting evidence of ClearPass's government relationship. PenCom has precedent for third-party API access (BPP consumes their feed). The request frames ClearPass as extending PenCom's reach to companies that are compliance-motivated but not yet fully captured in the existing system.
Timeline to Tier 1
3 to 6 months. PenCom is the most API-ready agency of the six.
Tier 2 web extraction specification
Headless browser (Playwright) submits reference number to ecompliance.pencom.gov.ng verification form. Response parser extracts: company name, PCC number, status, expiry date, compliance period. Rate limit: 1 request per 3 seconds. Cache TTL: 12 hours. If portal structure changes, extraction falls to Tier 4 pending re-engineering. Monitoring alert triggers if extraction fails for more than 15 minutes.


FIRS Tax Identification Number and Tax Clearance
Current API status
The NRS (formerly FIRS) operates TaxPro-Max which has a verification API. FIRS has historically engaged with third-party integrators through a formal accreditation process.
Launch tier
Tier 1 or Tier 2. ClearPass will apply for NRS API access through the TaxPro-Max integration program immediately upon company registration. If access is granted before launch, Tier 1 is active at launch. If delayed, Tier 2 web extraction from taxpromax.firs.gov.ng is active.
Target tier
Tier 1: Direct TaxPro-Max API.
Access acquisition strategy
Submit a formal integration application to the NRS through their published third-party integration process. Given that the NRS e-invoicing mandate already has multiple accredited Access Point Providers, the precedent for private sector API access is established. ClearPass's application should reference this precedent directly.
Timeline to Tier 1
1 to 3 months. This is the fastest API acquisition path of all six certificates.
Risk assessment
Low. Even if Tier 1 is not achieved at launch, Tier 2 is reliable. TaxPro-Max is among the more stable government portals.


NSITF Certificate
Current API status
NSITF has an online portal at nsitf.gov.ng with employer verification functionality. No publicly documented API as of May 2026.
Launch tier
Tier 2: Web Extraction from the NSITF employer compliance verification portal, combined with Tier 4 Manual Review for cases where extraction fails.
Target tier
Tier 1: Formal API agreement with NSITF.
Access acquisition strategy
NSITF sits under the Federal Ministry of Labour and Employment. A formal letter to the NSITF Managing Director, co-signed or endorsed by NHIA under the MoU relationship, requests integration access. The business case is that ClearPass routes employers to NSITF compliance, increasing NSITF's capture rate and reducing their manual verification workload.
Timeline to Tier 1
6 to 18 months. NSITF is less digitally mature than FIRS or PenCom. Tier 2 web extraction is the operational reality for the first year.
Tier 2 web extraction specification
Headless browser submits employer registration number and year to the NSITF verification endpoint. Parser extracts compliance status and certificate period. Rate limit: 1 request per 5 seconds (NSITF portal has lower capacity than others). Cache TTL: 24 hours. Monitoring alert if extraction fails for more than 30 minutes.
Manual review enhancement for NSITF
NSITF certificates have a standardised format that ClearPass reviewers are trained to recognise. A fraud detection checklist specific to NSITF certificates is maintained and updated quarterly.


ITF Certificate
Current API status
The Industrial Training Fund has an online employer portal at itf.gov.ng. API access is not documented. Many companies in the 1-10 employee band are exempt from ITF.
Launch tier
Tier 4: Manual Review. ITF portal availability is inconsistent and web extraction reliability is insufficient for a customer-facing verification service.
Target tier
Tier 2: Web Extraction once portal stability improves, then Tier 1 via formal agreement.
Access acquisition strategy
ITF falls under the Federal Ministry of Industry, Trade and Investment. A formal request through the NHIA MoU channel and the Ministry of Finance relationship. Lower priority than NSITF and PCC given that a large portion of ClearPass users are exempt from ITF.
Timeline to Tier 1
12 to 24 months. ITF is the lowest priority and longest timeline.
Risk assessment
Low business risk. ITF carries the lowest weight in the health score formula specifically because integration maturity is lowest. Tier 4 manual review is sufficient. The 24-hour review SLA applies.


BPP Certificate
Current API status
The Bureau of Public Procurement maintains the National Database of Federal Contractors. The BPP portal at procurementng.org has a public verification function. BPP already consumes the PenCom PCC daily feed. This creates a relationship and precedent.
Launch tier
Tier 2: Web Extraction from the BPP public verification portal combined with Tier 4 for cases that cannot be extracted.
Target tier
Tier 1: Direct BPP database feed. Given that BPP is the ultimate consumer of all compliance certificates, a direct integration with BPP is strategically the most valuable of all six. A company that is verified compliant in the BPP database IS the gold standard.
Access acquisition strategy
The BPP integration is positioned as a mutual benefit: BPP gains a private sector distribution channel that routes compliant companies to their database. ClearPass gains authoritative data. This makes the negotiation a partnership rather than a one-sided data request. The BPP DG office is a target outreach concurrent with the NHIA negotiation.
Timeline to Tier 1
6 to 12 months. BPP has institutional motivation to integrate with ClearPass once the user base reaches a meaningful size.
Strategic note
If BPP formally integrates ClearPass into their pre-qualification workflow (even as a recommended tool rather than a mandatory one), adoption becomes self-reinforcing. Every company that wants to bid on a federal contract has a direct pathway to ClearPass.


9B.3 Web Extraction Technical Architecture
Web extraction is a legitimate and widely used integration pattern in markets where government APIs do not yet exist. The following specification must be implemented to ensure reliability, legality, and maintainability.
Technology
Playwright (preferred over Puppeteer for its better reliability on complex portal interactions). Each government portal has its own dedicated extractor service deployed as an independent microservice.
Independence
Each extractor is independent. A failure in the NSITF extractor does not affect the PenCom extractor. Each extractor has its own health monitoring, fallback logic, and circuit breaker.
Rate limiting
Each extractor implements respectful rate limiting: PenCom 1 request per 3 seconds, NSITF 1 request per 5 seconds, BPP 1 request per 4 seconds. These limits are configurable in the admin portal without a code deploy.
Caching
Successful extraction results are cached in Redis with a certificate-type-specific TTL: PenCom 12 hours, NSITF 24 hours, BPP 24 hours, FIRS 6 hours. Cache is keyed by certificate reference number. Stale cache is served with a staleness indicator if the live extraction fails.
Circuit breaker
If an extractor fails 3 consecutive times within 10 minutes, the circuit breaker opens and all requests for that certificate type fall to Tier 4 manual review. The circuit breaker attempts recovery every 15 minutes. Admin is alerted when a circuit opens.
Selector maintenance
Government portal HTML structures change without notice. Each extractor uses CSS selectors stored in the database, not hardcoded in the extractor service. When a portal changes its structure, a selector update is applied through the admin portal within hours rather than requiring a code deploy.
Legal disclosure
ClearPass sends a formal letter to each agency whose portal is used for extraction, disclosing the integration, the rate limiting, and the verification purpose. This letter is sent before extraction begins for that agency. Acknowledgement is not legally required but strengthens the relationship and prepares the ground for formal API discussions.


9B.4 Batch File Processing Architecture
For agencies that cannot support real-time access but are willing to share periodic data exports, ClearPass implements a secure batch processing pipeline.
Transfer mechanism
Secure FTP (SFTP) with key-based authentication. The government agency pushes files to a ClearPass SFTP endpoint or ClearPass pulls from an agency-provided SFTP. No email attachments. No shared drives.
File formats supported
CSV, Excel (.xlsx), and fixed-width text. The parser is configurable per agency through the admin portal to handle different column names and orderings.
Processing
On file arrival, the batch processor validates the file format, deduplicates records, and upserts the data into a certificate verification snapshot table. The snapshot records the file date so verifications against this data clearly show the data vintage.
Reconciliation
The batch processor compares incoming data against existing records and flags any certificates that appear in ClearPass as active but are absent from the latest batch file. These are queued for manual review as potential revocations.
Transparency
Any certificate verified against batch data shows Batch Verified with the batch date in the API response and dashboard. Users can see exactly how old the verification data is.


9B.5 API Access Acquisition Priority and Timeline
The following is the sequenced strategy for moving each certificate from its launch tier to its target tier. Negotiations run in parallel, not sequentially.
Month 1 to 3: NHIA MoU
Primary focus. All other negotiations are downstream of this relationship. The MoU establishes ClearPass as a government-recognised private sector partner and opens every other door.
Month 1 to 2: NRS TaxPro-Max Application
Submit integration application immediately. This is the fastest and most process-driven negotiation. Run in parallel with the NHIA MoU.
Month 2 to 4: CAC API Request
Submit formal request to CAC through their documented integration process. Use the NHIA MoU as supporting evidence once signed.
Month 3 to 6: PenCom API Agreement
Submit formal request after NHIA MoU is signed. PenCom has precedent for third party access and this negotiation should move faster than others.
Month 4 to 8: BPP Partnership Discussion
Initiate once 5,000 companies are on the platform. The user base is the negotiating leverage. BPP gains more from integrating with a platform that 5,000 federal contractors already use than from integrating with a startup with no users.
Month 6 to 18: NSITF Formal Agreement
Begin after NHIA, PenCom, and FIRS integrations are operational. Use the track record of live integrations as evidence of ClearPass reliability.
Month 12 to 24: ITF Integration
Lowest priority. Begin discussions after all higher-priority integrations are live.


9B.6 What Happens If a Government Agency Refuses Integration
This scenario must be planned for. Not every agency will agree to every integration request. The refusal does not break the product.
Tier 2 web extraction continues
As long as the agency has a public verification portal, extraction continues. No agreement is required for this tier. ClearPass is a user of the public portal, doing what any compliance officer would do manually.
Manual review absorbs the volume
Tier 4 has no dependency on agency cooperation. The review team capacity is sized to handle full manual review for any certificate type. This is a cost centre, not a product risk.
The incentive argument
The more companies that onboard ClearPass, the stronger the incentive argument to each agency. 10,000 employers processing NSITF certificate verification through ClearPass represents a meaningful reduction in the agency's own verification workload. At scale, ClearPass becomes a service the agency depends on rather than an integration they are doing ClearPass a favour to provide.
The political argument
The NHIA MoU creates a template. Once one ministry has a formal ClearPass integration, every other ministry has political cover to do the same. The first integration is always the hardest.


9B.7 Government API Monitoring and SLA Matrix
The verification tier active for each certificate directly affects the SLA ClearPass can promise to users. The following matrix documents the user-facing SLA at each tier.
Tier 1: Direct API
Verification result in under 60 seconds for new certificates. Cached results in under 5 seconds. 99.5% accuracy (subject to government API correctness).
Tier 2: Web Extraction
Verification result in under 3 minutes for new certificates. Cached results in under 5 seconds. 95% accuracy (portal changes may cause temporary extraction failures before selector updates are applied).
Tier 3: Batch File
Verification result within 24 hours of batch processing. Accuracy reflects the batch date. Data may be up to 7 days old for weekly batch files.
Tier 4: Manual Review
Verification result within 24 business hours of submission. Accuracy is 98% (human review catches most forgeries that automated systems miss). SLA suspended during declared government API outages.
Tier visibility commitment
The tier used for every verification is visible in the ClearPass dashboard, the compliance report, and the API response. ClearPass does not obscure how data was obtained. This transparency is a competitive differentiator and a trust signal with government partners.


10. UX Specifications
This section provides the complete design brief for every screen, flow, and interaction in ClearPass. It is written specifically for the product designer and bridges the product requirements in Sections 1 through 9 to the Figma workspace. It does not define visual style, design tokens, or component aesthetics. It defines structure: what screens exist, what states each screen has, how screens connect, and what the content of every interactive moment communicates to the user.
The total screen count before states is 120 screens across 8 portal contexts. With states factored in, the Figma file will require approximately 480 to 520 frames before prototyping begins. This section is the design brief that ensures no screen is discovered mid-build.
10.1 Information Architecture
ClearPass has eight distinct portal contexts. Each is accessed by a different user type and has its own navigation structure. They share the same authentication system but render completely different interfaces after login.
Business Portal
Accessed by business_primary and business_sub users. Primary navigation: Dashboard, Certificates, Reports, Team, Billing, Settings. Mobile-first. This is the highest-volume interface.
MDA Verification Portal
Accessed by mda_officer users. Primary navigation: Verify, Bulk Verify, Watchlist, History, API Settings. Desktop-primary with mobile fallback for field officers.
Compliance Partner Portal
Accessed by compliance_partner users. Primary navigation: My Clients, Alerts, Reports, Settings. Desktop-primary.
HMO Partner Portal
Accessed by hmo_partner users. Primary navigation: Referrals, Commissions, Settings. Desktop-primary.
NHIA Enrollment Flow
A guided modal or dedicated screen flow triggered from the Business Portal when NHIA certificate is missing. Not a separate portal but a distinct product experience within the Business Portal.
Live Verification Page
Public-facing. No authentication. Accessed via QR code scan. Single-purpose: show compliance status comparison. Optimised for mobile scanning scenarios.
Admin Portal
Accessed by admin and super_admin users. Separate subdomain: admin.clearpass.com.ng. Primary navigation: Review Queue, Companies, Partners, Analytics, Integrations, Settings. Desktop only.
Onboarding Flow
A linear guided experience for new business registrations. Overlays the Business Portal and collapses when the user achieves a minimum compliance milestone. Not a separate portal.


10.2 Complete Screen Inventory
Every screen in ClearPass is listed below. Screens are numbered with a prefix indicating their portal context. Each screen has exactly one primary user type and one module owner. Priority follows the same P0/P1/P2 system used in Module specifications.

AUTHENTICATION SCREENS (AUTH)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
AUTH-01
Landing / Account Type Selection
All new users
Module 01
P0
Mobile + Desktop
AUTH-02
Business Registration: RC Number Entry
Business owner
Module 01
P0
Mobile-first
AUTH-03
CAC Verification: Loading State
Business owner
Module 01
P0
Mobile-first
AUTH-04
CAC Verification: Pending (API offline)
Business owner
Module 01
P0
Mobile-first
AUTH-05
Company Details Confirmation (CAC data)
Business owner
Module 01
P0
Mobile-first
AUTH-06
Account Details: Name, Email, Phone
Business owner
Module 01
P0
Mobile-first
AUTH-07
BVN Identity Verification
Business primary
Module 01
P0
Mobile-first
AUTH-08
Email Verification: Check Your Inbox
All new users
Module 01
P0
Mobile-first
AUTH-09
Email Verified: Success Confirmation
All new users
Module 01
P0
Mobile-first
AUTH-10
MDA Registration: Agency Selection
MDA officer
Module 01
P0
Desktop-first
AUTH-11
MDA Registration: Pending Domain Review
MDA officer
Module 01
P1
Desktop-first
AUTH-12
Partner Registration: Consultant Type
Compliance partner
Module 01
P1
Desktop-first
AUTH-13
Login
All users
Module 01
P0
Mobile + Desktop
AUTH-14
Login: MFA Verification (SMS/TOTP)
MDA, Admin users
Module 01
P0
Mobile + Desktop
AUTH-15
Forgot Password: Email Entry
All users
Module 01
P0
Mobile-first
AUTH-16
Forgot Password: OTP Verification
All users
Module 01
P0
Mobile-first
AUTH-17
Forgot Password: New Password Entry
All users
Module 01
P0
Mobile-first
AUTH-18
Session Expired: Re-authentication
All users
Module 01
P0
Mobile + Desktop


ONBOARDING FLOW (ONB)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
ONB-01
Welcome: What ClearPass Does (3-slide)
Business owner
Module 01
P0
Mobile-first
ONB-02
Compliance Checklist Overview
Business owner
Module 03
P0
Mobile-first
ONB-03
Onboarding Step: Connect First Certificate
Business owner
Module 03
P0
Mobile-first
ONB-04
Onboarding Complete / First Dashboard
Business owner
Module 04
P0
Mobile-first


BUSINESS DASHBOARD (DASH)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
DASH-01
Dashboard: Populated (normal use)
Compliance officer
Module 04
P0
Mobile + Desktop
DASH-02
Dashboard: Empty State (zero certs)
Business owner
Module 04
P0
Mobile + Desktop
DASH-03
Dashboard: Score At Risk Banner Active
Compliance officer
Module 04
P0
Mobile + Desktop
DASH-04
Dashboard: Ineligible To Bid State
Compliance officer
Module 04
P0
Mobile + Desktop
DASH-05
Dashboard: NHIA Enrollment Prompt Banner
Business owner
Module 08
P0
Mobile + Desktop
DASH-06
Activity Feed: Expanded View
Compliance officer
Module 04
P1
Mobile + Desktop
DASH-07
Expiry Timeline View
Compliance officer
Module 04
P1
Desktop-first
DASH-08
Renewal Cost Forecast Widget
Finance director
Module 04
P2
Desktop-first


CERTIFICATE MANAGEMENT (CERT)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
CERT-01
Certificate Detail: NHIA
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-02
Certificate Detail: PCC
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-03
Certificate Detail: NSITF
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-04
Certificate Detail: ITF
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-05
Certificate Detail: FIRS TIN
Finance director
Module 03
P0
Mobile + Desktop
CERT-06
Certificate Detail: BPP
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-07
Certificate Upload: Document Drop Zone
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-08
Certificate Upload: Upload Progress
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-09
Certificate Upload: Pending Review
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-10
Certificate Upload: Rejected with Reason
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-11
Certificate Connect: Reference Number
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-12
Certificate Connect: API Verifying
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-13
Certificate Connect: Verified Success
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-14
Certificate Connect: API Contradiction
Compliance officer
Module 03
P0
Mobile + Desktop
CERT-15
Certificate History: Change Timeline
Compliance officer
Module 09
P1
Desktop-first
CERT-16
Certificate: Application Guide (How-To)
SME owner
Module 03
P1
Mobile + Desktop
CERT-17
Certificate: Not Applicable Info Screen
Compliance officer
Module 03
P1
Mobile + Desktop


NHIA ENROLLMENT AND HMO FLOW (NHIA)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
NHIA-01
NHIA Gap Detected: Enrollment Prompt
Business owner
Module 08
P0
Mobile-first
NHIA-02
HMO Directory: Browse and Filter
Business owner
Module 08
P0
Mobile + Desktop
NHIA-03
HMO Directory: Plan Detail Expanded
Business owner
Module 08
P0
Mobile + Desktop
NHIA-04
Enrollment Handoff: Confirm and Proceed
Business owner
Module 08
P0
Mobile-first
NHIA-05
Enrollment Handoff: HMO Portal Offline
Business owner
Module 08
P0
Mobile-first
NHIA-06
Enrollment Progress Tracker
Business owner
Module 08
P0
Mobile + Desktop
NHIA-07
Enrollment Complete: Certificate Issued
Business owner
Module 08
P0
Mobile-first


COMPLIANCE REPORTS (RPT)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
RPT-01
Reports: List of Generated Reports
Compliance officer
Module 09
P0
Mobile + Desktop
RPT-02
Report Generation: Configure
Compliance officer
Module 09
P0
Mobile + Desktop
RPT-03
Report Generation: NHIA Hard Cap Warning
Compliance officer
Module 09
P0
Mobile + Desktop
RPT-04
Report Generation: In Progress
Compliance officer
Module 09
P0
Mobile + Desktop
RPT-05
Report: Preview Before Download
Compliance officer
Module 09
P0
Mobile + Desktop
RPT-06
Report: Download Confirmation
Compliance officer
Module 09
P0
Mobile + Desktop
RPT-07
Live Verification Page: Current = Report
MDA officer (public)
Module 09
P0
Mobile-first (QR scan)
RPT-08
Live Verification: Status Changed Warning
MDA officer (public)
Module 09
P0
Mobile-first
RPT-09
Live Verification: Expired Report State
MDA officer (public)
Module 09
P0
Mobile-first
RPT-10
Provisional Report: Watermarked Preview
Compliance officer
Module 09
P1
Mobile + Desktop
RPT-11
Audit Trail: Company Event Timeline
Compliance officer
Module 09
P1
Desktop-first


NOTIFICATIONS (NOTIF)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
NOTIF-01
Notification Centre: List
All business users
Module 05
P0
Mobile + Desktop
NOTIF-02
Notification: Individual Detail
All business users
Module 05
P1
Mobile + Desktop
NOTIF-03
Notification Preferences: Settings
All business users
Module 05
P1
Mobile + Desktop


TEAM MANAGEMENT (TEAM)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
TEAM-01
Team: Members List
Business primary
Module 01
P1
Desktop-first
TEAM-02
Team: Invite Member
Business primary
Module 01
P1
Desktop-first
TEAM-03
Team: Member Permissions Editor
Business primary
Module 01
P1
Desktop-first
TEAM-04
Team: Remove Member Confirmation
Business primary
Module 01
P1
Desktop-first


BILLING AND SUBSCRIPTION (BILL)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
BILL-01
Billing: Subscription Overview
Finance director
Module 10
P0
Desktop-first
BILL-02
Billing: Plan Comparison / Upgrade
Finance director
Module 10
P0
Desktop-first
BILL-03
Billing: NHIA Hard Cap Pre-Pay Warning
Finance director
Module 10
P0
Desktop-first
BILL-04
Billing: Payment - Card Entry
Finance director
Module 10
P0
Desktop-first
BILL-05
Billing: Payment - Bank Transfer
Finance director
Module 10
P0
Desktop-first
BILL-06
Billing: Payment - USSD Flow
Finance director
Module 10
P1
Mobile-first
BILL-07
Billing: Payment Success
Finance director
Module 10
P0
Mobile + Desktop
BILL-08
Billing: Payment Failed
Finance director
Module 10
P0
Mobile + Desktop
BILL-09
Billing: Invoice List
Finance director
Module 10
P1
Desktop-first
BILL-10
Billing: Invoice Detail
Finance director
Module 10
P1
Desktop-first
BILL-11
Billing: Downgrade Impact Preview
Finance director
Module 10
P1
Desktop-first
BILL-12
Billing: Cancel Subscription Confirm
Finance director
Module 10
P1
Desktop-first


COMPANY PROFILE AND SETTINGS (PROF)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
PROF-01
Company Profile: View
Business primary
Module 02
P1
Mobile + Desktop
PROF-02
Company Profile: Edit (Sector / Band)
Business primary
Module 02
P1
Desktop-first
PROF-03
Company Profile: Shareable Link Settings
Business primary
Module 02
P1
Desktop-first
PROF-04
Document Vault: File List
Compliance officer
Module 02
P1
Desktop-first
PROF-05
Document Vault: Upload
Compliance officer
Module 02
P1
Mobile + Desktop
PROF-06
Document Vault: Storage Limit Warning
Compliance officer
Module 02
P1
Desktop-first
PROF-07
Account Settings: Personal Details
All business users
Module 01
P1
Mobile + Desktop
PROF-08
Account Settings: Change Email
All business users
Module 01
P1
Mobile + Desktop
PROF-09
Account Settings: Change Password
All business users
Module 01
P1
Mobile + Desktop
PROF-10
Account Settings: MFA Setup
MDA, Admin users
Module 01
P0
Mobile + Desktop
PROF-11
Account Settings: Data and Privacy
All users
Module 12
P1
Mobile + Desktop
PROF-12
Account Settings: Delete Account
All users
Module 12
P1
Mobile + Desktop
PROF-13
Certificate Compliance Wallet (Mobile)
Business owner
Module 09
P2
Mobile-only


MDA VERIFICATION PORTAL (MDA)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
MDA-01
MDA Dashboard: Usage Stats + Recents
MDA officer
Module 06
P0
Desktop-first
MDA-02
MDA Single Lookup: Search
MDA officer
Module 06
P0
Desktop-first
MDA-03
MDA Lookup Result: Fully Compliant
MDA officer
Module 06
P0
Desktop-first
MDA-04
MDA Lookup Result: Non-Compliant
MDA officer
Module 06
P0
Desktop-first
MDA-05
MDA Lookup Result: Partially Compliant
MDA officer
Module 06
P0
Desktop-first
MDA-06
MDA Lookup Result: Company Not Found
MDA officer
Module 06
P0
Desktop-first
MDA-07
MDA Bulk Verify: CSV Upload
MDA officer
Module 06
P0
Desktop-first
MDA-08
MDA Bulk Verify: CSV Preview (Parsed)
MDA officer
Module 06
P0
Desktop-first
MDA-09
MDA Bulk Verify: Processing Progress
MDA officer
Module 06
P0
Desktop-first
MDA-10
MDA Bulk Verify: Results Matrix
MDA officer
Module 06
P0
Desktop-first
MDA-11
MDA Company Watchlist
MDA officer
Module 06
P1
Desktop-first
MDA-12
MDA Verification History Log
Audit officer
Module 06
P0
Desktop-first
MDA-13
MDA API Key Management
MDA IT admin
Module 07
P1
Desktop-first
MDA-14
MDA Monthly Usage Statement
MDA IT admin
Module 10
P1
Desktop-first


COMPLIANCE PARTNER PORTAL (PART)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
PART-01
Partner: Multi-Client Dashboard
Compliance consultant
Module 04
P1
Desktop-first
PART-02
Partner: Client Company Scoped View
Compliance consultant
Module 04
P1
Desktop-first
PART-03
Partner: Invite New Client
Compliance consultant
Module 01
P1
Desktop-first
PART-04
Partner: Client Activity Digest
Compliance consultant
Module 05
P1
Desktop-first


HMO PARTNER PORTAL (HMO)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
HMO-01
HMO: Referral Pipeline Dashboard
HMO enrollment officer
Module 08
P1
Desktop-first
HMO-02
HMO: Individual Referral Detail
HMO enrollment officer
Module 08
P1
Desktop-first
HMO-03
HMO: Commission Statement
HMO enrollment officer
Module 10
P1
Desktop-first


ADMIN PORTAL (ADMIN)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
ADMIN-01
Admin: Certificate Review Queue
ClearPass reviewer
Module 11
P0
Desktop-only
ADMIN-02
Admin: Certificate Review Detail
ClearPass reviewer
Module 11
P0
Desktop-only
ADMIN-03
Admin: Company Search
Support agent
Module 11
P0
Desktop-only
ADMIN-04
Admin: Company Account Oversight
Support agent
Module 11
P0
Desktop-only
ADMIN-05
Admin: Suspend Company
ClearPass admin
Module 11
P0
Desktop-only
ADMIN-06
Admin: Integration Health Monitor
ClearPass admin
Module 07
P0
Desktop-only
ADMIN-07
Admin: Platform Analytics Dashboard
Super admin
Module 11
P0
Desktop-only
ADMIN-08
Admin: Partner Management Console
ClearPass admin
Module 11
P0
Desktop-only
ADMIN-09
Admin: SLA Monitoring
ClearPass admin
Module 11
P1
Desktop-only
ADMIN-10
Admin: Fraud Detection Flags
ClearPass admin
Module 11
P1
Desktop-only
ADMIN-11
Admin: Content Management
ClearPass admin
Module 11
P1
Desktop-only


SYSTEM AND ERROR STATES (SYS)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
SYS-01
404: Page Not Found
All users
N/A
P0
Mobile + Desktop
SYS-02
500: Server Error
All users
N/A
P0
Mobile + Desktop
SYS-03
503: Maintenance Mode
All users
N/A
P0
Mobile + Desktop
SYS-04
Account Suspended Screen
All users
Module 11
P0
Mobile + Desktop
SYS-05
Government Services Disruption Banner
All business users
Module 07
P0
Mobile + Desktop


10.3 UI State Matrix for Critical Screens
Every screen has at minimum four states. The screens below are the most complex and are specified in detail. All other screens follow the same state pattern: Loading, Empty, Populated, Error.

DASH-01: Business Dashboard
State
Trigger
UI Behaviour
Primary CTA
Loading
Page load or data refresh
Health score ring shows skeleton animation. Six certificate cards show pulse skeleton. Activity feed shows three skeleton rows.
None
Empty
New account, zero certificates
Score ring shows 0 with grey ring. Six certificate cards in Not Connected state with gentle prompt. Large illustrated empty state with a single action. No activity feed.
Start connecting certificates
Procurement Ready
Score 80+, NHIA active, none expired
Score ring full green. Procurement Ready badge prominent. All six cards green. Score at top of visual hierarchy.
Generate compliance report
Score At Risk
Any cert expires within 14 days
Amber warning banner below header listing the at-risk certificates and projected score drop date. Score ring turns amber. Nearest expiry card pulses.
Renew now
Ineligible
Any certificate in Expired state
Red Ineligible to Bid badge replaces Procurement Ready. Expired certificate card highlighted in red with hard border. Score ring shows actual number but ineligible label overrides the green/amber colour.
Fix expired certificate
NHIA Prompt
NHIA = Not Connected
Persistent amber banner below header specific to NHIA. Cannot be dismissed. Explains procurement consequence directly.
Get NHIA certificate
Suspended
Account suspended by admin
Full-screen overlay. Cannot access dashboard content. Suspension reason shown. Support contact link.
Contact support


CERT-01 to CERT-06: Certificate Detail Screens
State
Trigger
UI Behaviour
Primary CTA
Not Connected
Certificate never uploaded
Large illustrated empty state specific to the certificate type. Steps to get the certificate if they do not have one. Upload option if they already do.
Upload certificate or Get this certificate
Pending Review
Document uploaded, awaiting review
Review in progress indicator. Estimated completion time. Document thumbnail shown. Option to cancel and re-upload.
Cancel submission
Active - Healthy
Active, expiry 31+ days
Green status badge. Expiry date prominent. Reference number. Issuing authority. Verification method badge (API Verified / Reviewer Verified). Certificate history button.
View history
Expiring Soon
Active, expiry 15 to 30 days
Amber Expiring Soon badge. Days remaining shown prominently. Renewal pathway button appears. Score contribution shown.
Renew certificate
Expiring Critical
Active, expiry 8 to 14 days
Orange Expiring Critical badge. Countdown prominent. Renewal button is primary CTA in brand green.
Renew now
Expiring Urgent
Active, expiry 1 to 7 days
Red urgent banner. Large countdown. Renewal is the only prominent action. Procurement impact explained explicitly.
Renew immediately
Expired
Expiry date passed
Red Expired badge. Date expired shown. Ineligible to bid consequence stated clearly. Large renewal CTA.
Renew certificate
Renewal In Progress
Renewal initiated
Amber in-progress indicator. Renewal reference shown if available. Expected completion date if known.
Check renewal status
Not Applicable
Sector exemption applies
Grey Not Applicable badge. Plain language explanation of why this certificate does not apply to the company.
None
Contradicted
API contradicts uploaded document
Warning state. Under additional review message. No numeric impact shown. Contact support link.
Contact support


MDA-02 to MDA-06: Lookup Results
State
Trigger
UI Behaviour
Primary CTA
Searching
RC number submitted
Progress indicator with company name if found in ClearPass. Certificate verification running indicators per certificate type.
None (auto-completes)
Fully Compliant
All certs active, score 80+
Green COMPLIANT banner at top. Procurement Ready badge. All six certificates listed with green status and expiry dates. Download report button prominent.
Download verification report
Partially Compliant
Some certs active, some expired/missing
Amber PARTIAL COMPLIANCE banner. Compliant certificates listed in green. Non-compliant listed in red with specific expiry dates or not-connected status. Clear visual separation.
Download verification report
Non-Compliant
NHIA expired or score below 50
Red NON-COMPLIANT or INELIGIBLE TO BID banner. All failed certificates listed with expiry dates and days since expiry. Share invite to register button if company not in ClearPass.
Invite company to ClearPass
Not Found
RC not in ClearPass database
Neutral NOT FOUND state. Clearly distinguished from non-compliant. CAC company name shown if available. Option to invite company to register.
Send registration invitation


10.4 Critical User Flows (Screen by Screen)
The following flows trace the exact screen sequence for the five most critical user journeys. Each step shows the screen ID, the action the user takes, and any critical note for the designer about what must happen in that transition.

Flow 01: First-Time Business Registration to First Certificate Connected
01.  [AUTH-01]  User selects Business Account on the landing screen
02.  [AUTH-02]  User enters RC number. CAC validation begins immediately on entry complete
03.  [AUTH-03]  CAC verification loading. If offline: AUTH-04 (pending state). If success: continue
04.  [AUTH-05]  User confirms auto-populated company details. Can edit sector and employee band only
05.  [AUTH-06]  User enters name, email, and phone number
06.  [AUTH-07]  BVN identity verification for primary account holders
07.  [AUTH-08]  Check your inbox screen. Polling in background for email verification
08.  [AUTH-09]  Email verified. Auto-redirect to onboarding
09.  [ONB-01]  Welcome slides (3 screens). Skip available from slide 1
10.  [ONB-02]  Compliance checklist overview. Health score shows 0. Six not-connected cards visible
11.  [ONB-03]  Guided certificate connection. First suggested certificate is NHIA  — If user has no NHIA: route to NHIA-01. If user has another cert: route to CERT-07
12.  [CERT-07]  Document upload or reference number entry for chosen certificate
13.  [CERT-09]  Pending review confirmation. Score updates to show partial credit
14.  [ONB-04]  Onboarding step complete. First real dashboard view. Onboarding collapses
15.  [DASH-01]  Business dashboard. Health score shows first non-zero value

Flow 02: Compliance Officer Responding to an Expiry Alert
01.  [Email]  Officer receives expiry alert email: NSITF expires in 14 days
02.  [DASH-01]  Logs into dashboard. Score at Risk banner visible. NSITF card pulsing amber  — The dashboard state must reflect the alert that triggered the login
03.  [CERT-03]  Taps NSITF card. Certificate detail in Expiring Critical state
04.  [CERT-03]  Taps Renew Now. Opens renewal pathway guidance screen (CERT-16 variant)
05.  [CERT-11]  On return from NSITF renewal: enters new certificate reference number
06.  [CERT-12]  API verifying. If PenCom extraction succeeds: CERT-13. If falls to manual: CERT-09
07.  [CERT-13]  Verification success. Certificate state updates to Active. Score recalculates
08.  [DASH-01]  Returns to dashboard. Score at Risk banner gone. Score updated. Green state restored

Flow 03: MDA Officer Verifying 40 Vendors for a Tender
01.  [MDA-01]  MDA officer logs in to MDA portal. Dashboard shows recent queries
02.  [MDA-07]  Selects Bulk Verify. Uploads CSV of 40 RC numbers
03.  [MDA-08]  CSV preview shows parsed rows. Invalid rows flagged before submission  — Designer note: invalid rows shown in red inline. User can fix or remove before proceeding
04.  [MDA-09]  Processing progress. Shows count: verifying 1 of 38 valid companies
05.  [MDA-10]  Results matrix. Three columns: Compliant (green), Partial (amber), Non-Compliant (red)  — Designer note: this is the hero screen for MDA. Summary counts at top. Sortable table below.
06.  [MDA-10]  Officer downloads verification report PDF for the tender file
07.  [MDA-12]  Verification history log updated with this batch automatically

Flow 04: SME Owner Going from Zero to Procurement Ready
01.  [AUTH-01]  Registers as Business Account (flows AUTH-01 through ONB-04 as Flow 01)
02.  [DASH-05]  NHIA prompt banner visible on first dashboard load
03.  [NHIA-01]  Taps NHIA prompt. Gap detection screen explains procurement consequence
04.  [NHIA-02]  HMO directory. Filtered by state and employee band automatically from profile
05.  [NHIA-03]  Selects HMO. Sees plan details and estimated annual premium
06.  [NHIA-04]  Confirms handoff. Company data shown pre-filled for review
07.  [NHIA-06]  Enrollment progress tracker. HMO Selected state active
08.  [CERT-07]  While waiting for NHIA: connects PCC, NSITF, FIRS TIN, BPP certificates
09.  [NHIA-07]  NHIA enrollment complete. Certificate issued. Tracker updates.
10.  [CERT-13]  NHIA certificate auto-activates in certificate detail screen
11.  [DASH-01]  Dashboard: Procurement Ready state. Green ring. All certificates active.
12.  [RPT-02]  Generates compliance report for first tender submission

Flow 05: Compliance Consultant Onboarding a New Client
01.  [PART-03]  Consultant selects Add New Client from partner portal
02.  [PART-03]  Enters client RC number. System checks if company is already registered
03.  [PART-03]  If registered: sends access request to client primary account
04.  [PART-03]  If not registered: sends registration invitation to client with consultant referral
05.  [PART-01]  Client accepts. Appears in multi-client dashboard with health score 0
06.  [PART-02]  Consultant opens client scoped view. Sees exact same dashboard as client  — Designer note: clear header showing 'Viewing as: [Company Name]'. Easy one-tap back to partner dashboard.
07.  [CERT-07]  Consultant uploads certificates on behalf of client with write permission
08.  [PART-04]  Consultant receives weekly digest email grouping all client alerts

10.5 Content and Copy Guidelines
These guidelines govern every word in the ClearPass product interface. Consistency in voice is as important as consistency in visual design. An interface that is visually clean but textually inconsistent loses user trust in the same way.
Voice and Tone
The voice is
Direct, trustworthy, and specific. ClearPass speaks like a knowledgeable compliance advisor who respects the user's time. It never hedges, never over-explains, and never uses jargon without defining it.
The tone shifts by context
For success states: confident and affirming. For warning states: urgent but calm. For error states: clear and actionable, never apologetic. For empty states: inviting and instructive, never abandoning.
Never
Use passive voice in CTAs. Never say Please wait while we process your request. Say Verifying your certificate (20 seconds). Never say An error has occurred. Say [Specific thing] failed. Here is what to do.


Empty State Copy Pattern
Every empty state follows a three-part structure: what this screen is for, why it is empty right now, what to do to fill it. Never show only an illustration with No data found.
DASH-02 empty state example
Headline: Your compliance dashboard is ready. Body: Connect your six federal compliance certificates to see your health score and procurement status. Action: Start with your NHIA certificate
PART-01 empty state example
Headline: No clients yet. Body: Add your first client company to start managing their compliance from here. Action: Add a client company
RPT-01 empty state example
Headline: No reports generated yet. Body: Generate a compliance report to share with an MDA or for your own records. Action: Generate your first report


Error Message Copy Pattern
Every error message answers three questions: what failed, why it failed, what to do. Never write a generic error. Every error is specific and actionable.
CAC API offline error
We could not verify RC number [XXXXX] right now. The CAC registry is temporarily unavailable. Your registration has been saved and we will complete verification automatically. No action needed.
Certificate upload rejected
Your NSITF certificate could not be approved. Reason: [admin-entered reason]. Please re-upload a clear scan and ensure the certificate belongs to [Company Name]. Need help? Contact our team.
Payment failed
Your payment could not be processed. Your card was not charged. Please check your card details or try a different payment method.
API rate limit
Too many requests. Please wait 60 seconds before trying again.


Button Label Conventions
Always action-oriented verbs
Connect Certificate (not Submit). Generate Report (not OK). Verify Company (not Search). Renew Now (not Proceed). Get NHIA Certificate (not Start).
Primary CTA is always singular
One primary action per screen. Never two equal-weight buttons competing for attention.
Destructive actions are always explicit
Suspend Account (not Confirm). Delete Certificate Record (not Yes). Cancel Subscription (not Proceed with Cancellation).
Loading labels use present participle
Verifying certificate... Generating report... Processing payment... Loading dashboard...


Number and Date Formatting
Currency
₦60,000 for amounts under a million. ₦1.2M for millions. Always prefix with ₦ symbol. Never use NGN prefix in the UI.
Dates
08 May 2026 format throughout. Never numeric-only dates (05/08/26 is ambiguous in Nigerian context). Month always in three-letter abbreviated form: Jan, Feb, Mar.
Countdown days
Expires in 14 days (not 2 weeks). Expired 3 days ago (not last week). Today is used only on the actual expiry date: Expires today.
Scores
87 out of 100 in full text descriptions. 87 in the score ring display. Never 87%. This is a compliance score, not a percentage.


10.6 Responsive Design Requirements
ClearPass is a mobile-first platform for the Business Portal and a desktop-primary platform for the MDA and Admin portals. The following defines the breakpoints and adaptation strategy.
Mobile (320px to 767px)
Business Portal primary surface. Single-column layout. Bottom tab navigation (Dashboard, Certificates, Reports, Settings). Certificate cards stack vertically. Health score ring occupies 40% of viewport width. CTAs are full-width. Touch targets minimum 44x44px.
Tablet (768px to 1023px)
Hybrid layout. Two-column certificate grid. Side navigation replaces bottom tabs. Reports and team screens shift to desktop-style layout.
Desktop (1024px+)
Full layout with persistent side navigation. MDA bulk verification and admin portal exclusively designed for this breakpoint. Certificate cards in 3-column grid. Dashboard shows timeline and forecast widgets alongside main score area.
MDA Portal
Desktop-primary. Minimum design width 1280px. Bulk verification results matrix requires horizontal space. MDA officers work at desks with monitors.
Live Verification Page
Mobile-first. Optimised for QR scan scenario: user is standing at a desk scanning a printed document. Large text. High contrast. Loads in under 3 seconds on 3G.
Admin Portal
Desktop-only. No mobile breakpoint required. Admin work is performed on desktop. A responsive admin portal adds design and build complexity without user benefit.


10.7 Critical Interaction Specifications
Health Score Ring Animation
On dashboard load, the ring animates from 0 to the current score over 1.2 seconds using an ease-out curve. The colour transitions from grey at 0 to red at 1-49, amber at 50-79, and green at 80-100. The colour applies to the filled arc of the ring, not the entire ring. The unfilled portion remains a consistent light grey. The numeric score inside the ring counts up in sync with the arc animation. On score update (certificate state change), the ring transitions smoothly to the new value over 0.8 seconds without restarting from 0.
Certificate Card Status Transitions
When a certificate status changes (e.g., from Active to Expiring Soon), the card background and badge colour transition over 0.4 seconds. No hard cut. The transition is triggered by a server-sent event or WebSocket message, not a page reload. If the user is actively viewing the dashboard when a certificate expires at midnight, the card updates in place with a gentle pulse animation drawing attention to the change.
Document Upload Interaction
On mobile: single tap opens the device camera or file picker. On desktop: drag-and-drop zone with visual feedback on hover and drop. During upload, a progress bar with percentage and file name visible. If the file fails validation (size, format, password protection), the error appears inline beneath the drop zone before the file is submitted to the server. The user corrects and re-drops without losing their place in the flow.
MDA Bulk CSV Upload and Preview
The CSV upload screen shows a preview of the first 5 parsed rows before submission. Invalid rows are highlighted in red inline with the specific error (Invalid RC format, Empty row, Duplicate). The valid row count and invalid row count are shown in a summary above the preview. The user can remove invalid rows individually or proceed with only valid rows. This preview happens client-side before any network request.
QR Code Display
The QR code on the Driver Gate Pass screen and on compliance report previews is displayed at minimum 240x240 pixels. The code is SVG-rendered for infinite sharpness, not a rasterized image. On mobile, the screen brightness automatically increases to maximum when the QR screen is active to aid scanning in variable lighting conditions. A vibration haptic confirms when the QR is successfully scanned (if the device supports it).
Score At Risk Warning
The Score at Risk banner on DASH-03 is a persistent amber bar below the main navigation. It cannot be dismissed. It shows the specific certificate at risk, the projected score drop, and the days remaining. The projected score is displayed in the same ring format as the current score, smaller, with a calendar icon and the drop date. This is the most important design element on the dashboard after the main score ring. It must command attention without creating panic.

10B. UX Specifications Addendum
This section adds the six items identified as gaps in the original Section 10 audit. Together with Section 10, this constitutes the complete UX specification for ClearPass. Every item here is required before the Figma file is considered complete enough for engineering handoff.
10B.1 Modal and Overlay Inventory
Modals, drawers, bottom sheets, confirmation dialogs, and toast notifications are not full screens but they require their own design frames. The 35 overlay interactions below are in addition to the 120 full screens in Section 10. They follow the same ID system with a MODL prefix. Every MODL item has a parent screen that triggers it and must be linked in Figma prototyping.

OVERLAY INTERACTIONS (MODL)
ID
Screen Name
Primary User
Module
Priority
Desktop / Mobile
MODL-01
Score At Risk: Detail Overlay
Compliance officer
Module 04
P0
Mobile + Desktop
MODL-02
Certificate Upload: Document Modal
Compliance officer
Module 03
P0
Mobile + Desktop
MODL-03
Certificate Connect: Reference Entry Modal
Compliance officer
Module 03
P0
Mobile + Desktop
MODL-04
Certificate API Contradiction Warning
Compliance officer
Module 03
P0
Mobile + Desktop
MODL-05
Certificate History: Right Drawer
Compliance officer
Module 09
P1
Mobile + Desktop
MODL-06
Certificate Rejection Detail Modal
Compliance officer
Module 03
P0
Mobile + Desktop
MODL-07
NHIA Gap: Initial Enrollment Prompt Modal
Business owner
Module 08
P0
Mobile-first
MODL-08
HMO Plan Quick Compare Overlay
Business owner
Module 08
P1
Mobile + Desktop
MODL-09
Enrollment Handoff: Confirm Before Redirect
Business owner
Module 08
P0
Mobile-first
MODL-10
Report Configuration: Bottom Drawer
Compliance officer
Module 09
P0
Mobile (drawer) / Desktop (side panel)
MODL-11
Report Generation: Full-Screen Progress
Compliance officer
Module 09
P0
Mobile + Desktop
MODL-12
Report Preview: Full-Screen Modal
Compliance officer
Module 09
P0
Mobile + Desktop
MODL-13
In-App Notification Toast (Success)
All users
Module 05
P0
Mobile + Desktop
MODL-14
In-App Notification Toast (Warning)
All users
Module 05
P0
Mobile + Desktop
MODL-15
In-App Notification Toast (Error)
All users
Module 05
P0
Mobile + Desktop
MODL-16
Notification Detail Drawer
All business users
Module 05
P1
Mobile + Desktop
MODL-17
Invite Team Member Modal
Business primary
Module 01
P1
Desktop-first
MODL-18
Edit Team Member Permissions Modal
Business primary
Module 01
P1
Desktop-first
MODL-19
Remove Team Member Confirmation Dialog
Business primary
Module 01
P1
Desktop-first
MODL-20
Upgrade Plan Modal (Tier Comparison)
Finance director
Module 10
P0
Desktop-first
MODL-21
Downgrade Impact Preview Modal
Finance director
Module 10
P1
Desktop-first
MODL-22
Cancel Subscription Confirmation Dialog
Finance director
Module 10
P1
Desktop-first
MODL-23
NHIA Hard Cap Pre-Payment Warning Modal
Finance director
Module 10
P0
Desktop-first
MODL-24
Edit Company Profile Modal (Sector/Band)
Business primary
Module 02
P1
Mobile + Desktop
MODL-25
Shareable Compliance Link Settings Modal
Business primary
Module 02
P1
Desktop-first
MODL-26
Document Vault: Delete File Confirmation
Compliance officer
Module 02
P1
Desktop-first
MODL-27
Delete Account Final Confirmation Dialog
All users
Module 12
P1
Mobile + Desktop
MODL-28
MDA: Invite Unregistered Company Modal
MDA officer
Module 06
P1
Desktop-first
MODL-29
MDA: Verification Report Download Confirm
MDA officer
Module 06
P1
Desktop-first
MODL-30
Admin: Reject Certificate with Reason
ClearPass reviewer
Module 11
P0
Desktop-only
MODL-31
Admin: Suspend Company Confirmation
ClearPass admin
Module 11
P0
Desktop-only
MODL-32
Admin: Manual Certificate Status Override
ClearPass admin
Module 11
P0
Desktop-only
MODL-33
Partner: Link Client Company Modal
Compliance partner
Module 01
P1
Desktop-first
MODL-34
API Key: Revoke Confirmation Dialog
MDA IT admin
Module 07
P1
Desktop-first
MODL-35
Session Expired: Overlay on Current Screen
All users
Module 01
P0
Mobile + Desktop


Total design frames including modals: 120 screens plus 35 overlay interactions equals 155 addressable design items. With states factored in (average 4 states per item) the Figma file will contain approximately 550 to 620 frames before prototyping connections are added.

10B.2 Extended State Matrix for Complex Screens
The following screens have states that cannot be inferred from the generic Loading, Empty, Populated, Error pattern. Each is specified in full.

AUTH-03 and AUTH-04: CAC Verification States
State
Trigger
UI Behaviour
Primary CTA
Verifying
RC number submitted
Animated progress indicator. Company name typed fades slightly. Single line copy: Checking CAC registry. This takes about 10 seconds. Do not close this screen.
None (auto-advances)
Success
CAC returns valid, active company
Green check animation. Company name and registration date appear. Brief success moment before auto-advancing to AUTH-05.
None (auto-advances in 1.5 seconds)
Deregistered
CAC returns struck-off or dormant status
Amber warning icon. Company name shown with status badge. Specific message explaining the deregistered status and how to reinstate at CAC. Link to CAC portal.
Visit CAC portal
Not Found
RC number not in CAC database
Red error state. RC number shown in error context. Two options: correct the RC number or contact support.
Try a different RC number
API Offline
CAC API timeout after 10 seconds
Amber pending state. Explains CAC registry is temporarily unavailable. Account created and will verify automatically. Email will confirm.
Continue to dashboard


AUTH-07: BVN Identity Verification States
State
Trigger
UI Behaviour
Primary CTA
Entry
User arrives at BVN screen
Clean input field for 11-digit BVN. Privacy note explaining BVN is verified but never stored. Link to what BVN verification means.
Verify identity
Verifying
BVN submitted
Spinner. Copy: Verifying your identity securely. About 15 seconds. Do not close this screen. BVN field is not visible during verification (privacy).
None
Verified
BVN matches submitted identity
Green check. Brief confirmation. Auto-advances.
None (auto-advances)
Mismatch
BVN does not match name/details entered
Amber warning. Specific guidance: the name on your BVN does not match your registration details. User is not told which field is wrong (security).
Review my details
Already Used
BVN hash matches existing account
Neutral message. Not red. Not accusatory. We could not complete your registration. Please contact support for assistance. Support contact visible.
Contact support
API Offline
BVN API unavailable
Amber state. BVN verification unavailable right now. Account created. We will re-attempt verification automatically. Action needed if not resolved in 24 hours.
Continue to dashboard


BILL-04: Payment Card Entry States
State
Trigger
UI Behaviour
Primary CTA
Empty
User arrives at payment screen
Card number, expiry, CVV, and cardholder name fields. Amount and plan displayed prominently above the form. Paystack logo and security badge visible.
Pay ₦60,000
Validating
Pay button tapped
Button becomes loading state. Fields disabled. Spinner inside button. Copy: Processing payment.
None (processing)
3DS Challenge
Bank requires additional verification
3DS challenge appears in an iframe overlay. User completes bank verification. Explainer: Your bank requires additional verification. Complete it to continue.
None (bank controlled)
Success
Payment confirmed by Paystack
Full-screen green success animation. Subscription tier, effective date, and invoice email confirmation shown. Auto-redirects to dashboard in 5 seconds.
Go to dashboard
Card Declined
Bank declines the card
Specific decline reason shown if provided by Paystack. Your card was not charged. Try again or use a different payment method.
Try again / Use bank transfer
Gateway Error
Paystack unavailable or timeout
Amber state. Payment service is temporarily unavailable. Your card has not been charged. Please try again in a few minutes.
Try again
Split-Brain Warning
Payment confirmed but webhook delayed
Amber note shown if user returns to dashboard within 10 minutes of payment: Your subscription is being activated. Refresh if you do not see your new plan in 5 minutes.
Refresh now


CERT-09: Certificate Pending Review States
State
Trigger
UI Behaviour
Primary CTA
Just Submitted
Document upload complete
Animated receipt confirmation. Document thumbnail shown. Reference number assigned. Estimated review time: within 24 business hours. Email confirmation note.
Return to dashboard
In Queue
User returns before review complete
Progress indicator showing: Document received, In review queue, Reviewer checking. Current stage highlighted. Time remaining estimate.
None
Approaching SLA
Submission is 20+ hours old
Amber note added: Still reviewing. Our team is taking longer than expected. We will prioritise your submission.
None
Government API Fallback
Auto-verification failed
Amber note: We are verifying your certificate with the issuing authority. This may take up to 24 hours. Small verification method badge visible.
None
Cancel Option
Any pending state
Secondary cancel and re-upload button always visible below the progress tracker. Confirms they want to cancel the current submission before re-upload.
Cancel and re-upload


CERT-14: API Contradiction States
State
Trigger
UI Behaviour
Primary CTA
Contradiction Detected
API returns different company for reference
Amber warning, not red. Under additional verification heading. Specific message: The details on your submitted certificate do not match our records from [issuing authority]. Our team will review this within 2 business days.
Contact support
Resolved: Approved
Admin reviews and approves despite discrepancy
Certificate moves to Active state with Reviewer Verified badge. Notification sent to user confirming resolution.
None
Resolved: Rejected
Admin rejects after contradiction review
Certificate moves to Rejected state. Clear rejection reason shown. CERT-10 state activates.
Re-upload certificate


NHIA-05: HMO Portal Offline States
State
Trigger
UI Behaviour
Primary CTA
Immediate Failure
HMO portal returns error on handoff attempt
Amber state, not red. [HMO Name] is temporarily unavailable. Your enrollment details have been saved. You can retry or choose a different HMO.
Try a different HMO / Retry in 4 hours
Retry Scheduled
User selects retry later
Confirmation that a reminder will be sent. The selected HMO name shown. Estimated retry time displayed.
Return to dashboard
HMO Suspended
HMO has been deactivated in ClearPass
Specific message: [HMO Name] is no longer accepting new enrollments through ClearPass. Please select a different HMO from the directory.
Choose a different HMO


RPT-07: Live Verification Page States
State
Trigger
UI Behaviour
Primary CTA
Current Matches
All certs same state as at report generation
Clean green VERIFIED banner at top. Company name and report ID shown. Two columns: At time of report and Current status. Both identical. Report timestamp visible.
None (read-only public page)
Status Changed
Any certificate state changed since generation
Amber STATUS CHANGED banner replaces VERIFIED. Changed certificates highlighted in amber with both the original state and current state shown side by side. Download current report prompt.
Company: Generate fresh report
Certificate Expired
Certificate expired since report was generated
Red INELIGIBLE TO BID banner. Specific expired certificate named. Stong visual distinction from the green verified state. Date of expiry shown.
None (MDA makes eligibility decision)
Report Expired
Report older than 90 days
Amber EXPIRED REPORT banner. Historical snapshot preserved and visible. Clear warning this report is no longer valid for procurement use. Current live status shown below.
None
Loading
QR scanned, page loading
Minimal skeleton. Brand logo and report ID visible immediately. Full content loads within 3 seconds on 3G.
None
Not Found
Invalid or archived report ID
Neutral not-found state. Report ID shown. Suggests the report may have been generated on a different platform.
None


MDA-07 to MDA-10: Bulk Verification Flow States
State
Trigger
UI Behaviour
Primary CTA
Upload Zone Empty
Officer arrives at bulk verify
Large drag-and-drop zone. CSV format guidance below. Download template link. Maximum 100 companies per batch.
Upload CSV
File Parsing
CSV file selected or dropped
Progress bar for file parsing. If file is large: Parsing 340 rows. This takes a few seconds.
None
Preview with Errors
CSV parsed, invalid rows detected
Table preview of first 5 rows. Invalid rows highlighted red inline. Error type shown per row. Summary: 38 valid, 2 invalid. Officer can remove invalid rows or proceed with valid only.
Proceed with 38 valid companies
Preview Clean
CSV parsed with no errors
Table preview of first 5 rows. Row count shown. All green. Clean confirmation.
Run verification
Processing
Verification batch submitted
Progress bar with count: Verifying 12 of 38 companies. Estimated time remaining. Cancel option visible. Do not close browser tab note.
Cancel (with confirmation)
Results Ready
All verifications complete
Three-column matrix: Fully Compliant count (green), Partially Compliant (amber), Non-Compliant or Not Found (red). Summary counts at top. Sortable table below. Each row shows company name, RC number, and status summary.
Download verification report
Partial Failure
Some verifications failed mid-batch
Results shown for completed verifications. Failed queries listed separately with error type. Option to retry failed queries or proceed with current results.
Retry failed queries / Download partial report


ADMIN-02: Certificate Review Detail States
State
Trigger
UI Behaviour
Primary CTA
Standard Review
Reviewer opens a queued submission
Left panel: certificate document viewer at full legible size. Right panel: company details, certificate type, submission date, submitter name. Approve and Reject buttons equally weighted.
Approve or Reject
Document Integrity Failure
File hash mismatch detected
Red DOCUMENT INTEGRITY FAILURE banner across the top of the document viewer. Approve button disabled. Only option is to flag for security review and notify engineering.
Flag for security review
Duplicate Reference Alert
Same reference found on another company
Amber warning banner: This reference number is already associated with [Company Name]. Review both submissions before approving either.
View conflicting submission
Approving
Reviewer clicks Approve
Brief confirmation modal: Confirm approval. Certificate will be activated immediately. Company will be notified. This action is logged.
Confirm approval
Rejecting
Reviewer clicks Reject
Rejection reason text field appears. Required. Dropdown of common rejection reasons for speed plus free text option. Cannot submit rejection without a reason.
Submit rejection


ADMIN-06: Integration Health Monitor States
State
Trigger
UI Behaviour
Primary CTA
All Online
All government APIs responding
Six integration cards all green. Response times shown per integration. Last successful sync timestamp per integration. Clean operational dashboard.
None
One API Offline
Single API circuit breaker open
Affected card turns amber. Shows: Offline since [time]. Fallback active: Manual review. Retry attempts shown. All other cards remain green.
Retry now
Multiple Offline
Two or more APIs failing
Platform-wide amber banner added. Affected cards in amber. Manual review queue load indicator. Escalate to on-call button visible.
Declare outage / Notify users
Authentication Failure
API credentials returning 401/403
Affected card turns red (distinct from offline amber). Shows: Authentication failed. Credentials rotation required. Engineering alert icon.
Rotate credentials
Degraded
API responding slowly but not failing
Affected card turns yellow (distinct from amber offline). Shows: Response time [Xms]. Above normal. Monitoring. Not yet in fallback.
None (monitoring)


ONB-02: Compliance Checklist (Progressive Completion)
State
Trigger
UI Behaviour
Primary CTA
All Zero
Brand new account, zero certs
Six certificate rows, all showing Not Connected. Health score 0. Suggested sequence shown: Start with NHIA, then PCC, then NSITF. Encouragement copy.
Start with NHIA
Partial Progress
1 to 5 certs connected
Connected certs show green check with score contribution. Remaining show not connected. Updated score shown. Percentage complete indicator.
Connect next certificate
Pending Review Mix
Some certs pending, some active
Pending certs show amber clock icon. Active certs show green check. Pending review note: Under review (24 hours).
Connect remaining
All Connected
All 6 certs in active or pending state
Celebratory completion state. All rows green or amber-pending. Onboarding complete CTA. Dashboard preview.
Go to my dashboard


10B.3 Navigation Trees
The following trees map every primary screen, its children, and the modals each screen triggers. Parent screens are indented at level 1. Child screens and modals triggered from each parent are indented at level 2 and 3.

Business Portal Navigation Tree
PRIMARY NAV: DASHBOARD
DASH-01: Dashboard (Populated, default landing after login)
  → MODL-01: Score At Risk Detail (from banner tap)
  → DASH-06: Activity Feed Expanded (from See All tap)
  → DASH-07: Expiry Timeline (from timeline widget tap)
  → NHIA-01: NHIA Enrollment Flow (from NHIA prompt banner, if applicable)
  → CERT-01 to CERT-06: Certificate Detail (from any certificate card tap)
PRIMARY NAV: CERTIFICATES
CERT-01: NHIA Certificate Detail
  → MODL-02: Upload Document
  → MODL-03: Connect by Reference Number
  → MODL-04: API Contradiction Warning
  → MODL-05: Certificate History Drawer
  → MODL-06: Rejection Detail (if rejected)
  → CERT-16: Application Guide (if not yet obtained)
CERT-02 to CERT-06: Same structure as CERT-01
PRIMARY NAV: REPORTS
RPT-01: Reports List
  → MODL-10: Report Configuration Drawer
    → MODL-11: Generation Progress Full Screen
      → RPT-05: Report Preview
        → RPT-06: Download Confirmation
  → RPT-11: Audit Trail (from history tab)
PRIMARY NAV: NOTIFICATIONS
NOTIF-01: Notification Centre
  → MODL-16: Notification Detail Drawer
  → NOTIF-03: Notification Preferences (from settings icon in NOTIF-01)
PRIMARY NAV: SETTINGS
TEAM-01: Team Members
  → MODL-17: Invite Member
  → MODL-18: Edit Permissions
  → MODL-19: Remove Member Confirmation
BILL-01: Billing Overview
  → MODL-20: Upgrade Plan
  → MODL-21: Downgrade Impact Preview
  → MODL-22: Cancel Subscription
  → MODL-23: NHIA Hard Cap Warning
  → BILL-04: Payment Card Entry
    → BILL-07: Payment Success
    → BILL-08: Payment Failed
PROF-01: Company Profile
  → MODL-24: Edit Sector and Band
  → MODL-25: Shareable Link Settings
  → PROF-04: Document Vault
    → MODL-26: Delete File Confirmation
PROF-07: Account Settings
  → PROF-08 to PROF-12: Sub-settings screens
  → MODL-27: Delete Account Confirmation
NHIA ENROLLMENT FLOW (TRIGGERED FROM DASHBOARD, NOT PRIMARY NAV)
NHIA-01: Gap Prompt (or MODL-07 as modal version for soft prompts)
  → NHIA-02: HMO Directory
    → MODL-08: HMO Plan Quick Compare
    → NHIA-03: HMO Plan Detail
      → MODL-09: Enrollment Handoff Confirmation
        → NHIA-05: HMO Portal Offline (if handoff fails)
        → NHIA-06: Enrollment Progress Tracker (if handoff succeeds)
          → NHIA-07: Enrollment Complete

MDA Verification Portal Navigation Tree
PRIMARY NAV: VERIFY
MDA-02: Single Company Lookup
  → MDA-03: Result - Fully Compliant
    → MODL-29: Report Download Confirmation
  → MDA-04: Result - Non-Compliant
  → MDA-05: Result - Partially Compliant
  → MDA-06: Result - Not Found
    → MODL-28: Invite Company to Register
PRIMARY NAV: BULK VERIFY
MDA-07: CSV Upload
  → MDA-08: CSV Preview with Validation
  → MDA-09: Processing Progress
  → MDA-10: Results Matrix
    → MODL-29: Report Download Confirmation
PRIMARY NAV: WATCHLIST
MDA-11: Company Watchlist
PRIMARY NAV: HISTORY
MDA-12: Verification History Log
PRIMARY NAV: SETTINGS
MDA-13: API Key Management
  → MODL-34: Revoke Key Confirmation
MDA-14: Monthly Usage Statement

Admin Portal Navigation Tree
PRIMARY NAV: REVIEW QUEUE
ADMIN-01: Certificate Review Queue
  → ADMIN-02: Certificate Review Detail
    → MODL-30: Reject with Reason
    → MODL-32: Manual Status Override
PRIMARY NAV: COMPANIES
ADMIN-03: Company Search
  → ADMIN-04: Company Account Oversight
    → MODL-31: Suspend Company Confirmation
    → MODL-32: Manual Certificate Override
PRIMARY NAV: INTEGRATIONS
ADMIN-06: Integration Health Monitor
PRIMARY NAV: ANALYTICS
ADMIN-07: Platform Analytics Dashboard
PRIMARY NAV: PARTNERS
ADMIN-08: Partner Management Console
PRIMARY NAV: OPERATIONS
ADMIN-09: SLA Monitoring
ADMIN-10: Fraud Detection Flags
ADMIN-11: Content Management

10B.4 Email Template Specifications
Six email templates require formal design specifications. Each template defines the subject line pattern with variable substitution, the content zones in order from top to bottom, the primary CTA, and the footer requirements. All emails are responsive and render correctly in Gmail, Apple Mail, and Outlook at both mobile and desktop widths.

EMAIL-01: Certificate Expiry Alert
Trigger
Automated send at 30 days, 14 days, and 7 days before certificate expiry.
Subject line pattern
[30-day] Your [Certificate Type] expires in 30 days. Renew before [Date] to stay eligible. [14-day] Urgent: Your [Certificate Type] expires in 14 days. [7-day] Critical: [Certificate Type] expires in 7 days. Your procurement eligibility is at risk.
Zone 1: Header
ClearPass logo. Coloured band below: green for 30-day, amber for 14-day, red for 7-day. Band communicates urgency through colour before reading begins.
Zone 2: Alert Summary
Certificate type name in large type. Expiry date. Days remaining counter. Current health score and projected score after expiry shown side by side.
Zone 3: Business Context
One line stating the procurement consequence. Example: If this certificate expires, your company will be ineligible to bid for federal contracts.
Zone 4: Renewal Steps
Three numbered steps for renewal: 1. Log in to ClearPass. 2. Tap [Certificate Type] card. 3. Follow the renewal pathway. No more than this. Not a full guide.
Primary CTA
Renew Now button. Links directly to the specific certificate detail screen authenticated via magic link.
Zone 5: Secondary Info
Current overall compliance score. List of other certificates and their expiry dates as a digest. Reduces need for separate alerts.
Footer
Notification preferences link. Unsubscribe from expiry alerts link (does not unsubscribe from all emails). ClearPass address. NDPA compliance note.


EMAIL-02: Weekly Compliance Digest
Trigger
Every Monday at 08:00 WAT for all active Business tier and above accounts.
Subject line pattern
Your ClearPass weekly summary: [Health Score] out of 100. [Action needed / All certificates active].
Zone 1: Header
ClearPass logo. Week dates (Mon 5 May to Sun 11 May 2026).
Zone 2: Score Summary
Health score ring rendered as a static image. Score number large. Procurement Ready or Attention Required label below it. One sentence describing change from last week if applicable.
Zone 3: Certificate Status Table
Six-row table. Certificate name, status badge (rendered as coloured text, not image, for email client compatibility), expiry date, days remaining. Rows with expiring or expired certificates are visually distinct.
Zone 4: Actions This Week (if any)
Bulleted list of what changed: certificate connected, certificate renewed, report generated. Empty if no activity.
Zone 5: Upcoming Actions
Any certificate expiring in the next 30 days listed with a Renew link per row.
Primary CTA
View my dashboard. Magic link authentication.
Footer
Standard footer. Notification preferences. Note: Sent every Monday. To change frequency, update your notification preferences.


EMAIL-03: Certificate Approved
Trigger
Immediately after admin approval or successful API verification of a certificate.
Subject line pattern
Your [Certificate Type] has been verified. Your compliance score is now [Score] out of 100.
Zone 1: Header
ClearPass logo. Green success band.
Zone 2: Verification Confirmation
Certificate type. Reference number. Expiry date. Verification method (API Verified or Reviewer Verified). Score change: was [X], now [Y].
Zone 3: Next Step
If Procurement Ready: Congratulations, you are now eligible to bid. Generate your compliance report. If not yet Procurement Ready: You are [N] certificates away from Procurement Ready status.
Primary CTA
View my dashboard.
Footer
Standard footer.


EMAIL-04: Certificate Rejected
Trigger
Immediately after admin rejection of a submitted certificate.
Subject line pattern
Action needed: Your [Certificate Type] submission was not approved.
Zone 1: Header
ClearPass logo. Amber band (not red, not accusatory).
Zone 2: Rejection Summary
Certificate type. Submission date. Specific rejection reason (admin-entered text). This reason must be the verbatim text the admin entered, not reformatted.
Zone 3: Next Steps
Clear instructional copy on what to correct. Re-upload link that takes the user directly to the certificate upload screen via magic link.
Primary CTA
Re-upload certificate.
Zone 4: Support Note
If you believe this rejection is an error, contact our team at [support email].
Footer
Standard footer.


EMAIL-05: Payment Confirmation and Invoice
Trigger
Within 1 hour of successful subscription payment.
Subject line pattern
Payment confirmed. Your ClearPass [Plan Name] subscription is active. Invoice [CPX-2026-XXXXXX] attached.
Zone 1: Header
ClearPass logo. Green confirmation band.
Zone 2: Payment Summary
Plan name. Amount paid in ₦. Payment date. Next renewal date. Invoice number.
Zone 3: What You Can Now Do
Bullet list of 3 features unlocked by this tier. Concise. Not a feature tour.
Primary CTA
Go to my dashboard.
Attachment
PDF invoice attached to the email. Invoice includes: invoice number, company name, RC number, plan, amount, payment date, Paystack reference, ClearPass registered address, tax identification if applicable.
Footer
Standard footer. Billing support contact.


EMAIL-06: Score At Risk Alert
Trigger
When projected score drop of 20 or more points is within 14 days.
Subject line pattern
Your ClearPass score will drop from [Current] to [Projected] on [Date] unless you act now.
Zone 1: Header
ClearPass logo. Red urgency band. This email must visually feel different from the standard expiry alert.
Zone 2: Score Impact
Current score and current status badge. Projected score and projected status badge. Date of the drop. Certificate causing the drop named explicitly.
Zone 3: Business Consequence
If the drop removes Procurement Ready status: You will no longer be eligible to bid for federal contracts from [Date]. If it reduces score but keeps Procurement Ready: Your compliance status will be downgraded to Attention Required from [Date].
Zone 4: Action Required
Single focused action. Not a list of options. Renew [Certificate Type] before [Date].
Primary CTA
Renew [Certificate Type] now. Magic link direct to certificate renewal screen.
Footer
Standard footer. This email cannot be opted out of. Score at risk alerts are a core compliance service.


10B.5 Accessibility Design Requirements
WCAG 2.1 AA compliance requires more than colour contrast ratios. The following specifications translate the WCAG requirements into concrete design decisions for every screen type in ClearPass. These requirements must be applied at the component level in Figma before any design is considered complete.

Secondary Indicators for All Colour-Coded States
Colour alone cannot communicate status per WCAG Success Criterion 1.4.1 (Use of Color). Every status that is communicated through colour must also carry a secondary indicator that is visible without colour perception.
Certificate Active (Green)
Icon: filled circle with checkmark. Text label: Active. Colour is reinforcing, not the only signal.
Certificate Expiring Soon (Amber)
Icon: clock with exclamation point. Text label: Expiring Soon or the specific days remaining number.
Certificate Expiring Critical (Orange)
Icon: clock with warning triangle. Text label: Expiring in [N] days. Days remaining always visible as a number.
Certificate Expired (Red)
Icon: X circle. Text label: Expired. Date of expiry shown.
Certificate Pending (Grey-amber)
Icon: hourglass. Text label: Under Review.
Certificate Not Connected (Grey)
Icon: empty circle with plus. Text label: Not Connected.
Procurement Ready (Green)
Icon: shield with checkmark. Text label: Procurement Ready. Never badge only.
Ineligible to Bid (Red)
Icon: shield with X. Text label: Ineligible to Bid. Never badge only.
Score colour coding
The score ring uses colour AND a text label below it: Procurement Ready (80-100), Attention Required (50-79), Ineligible (0-49). A user who cannot distinguish red from green reads the label, not the colour.


Screen Reader Specifications for Key Components
Health Score Ring
ARIA role: meter. ARIA attributes: aria-valuenow=[87], aria-valuemin=0, aria-valuemax=100, aria-label='Compliance health score: 87 out of 100. Status: Procurement Ready.' When the score changes, aria-live=polite announces the new value.
Certificate Status Cards
ARIA role: article per card. Card heading: NHIA Health Insurance Certificate. Status announced as: Status: Active. Expires 15 March 2027. 311 days remaining. Verification method: API Verified. Action button: Connect Certificate or Renew Certificate, not just Connect.
Ineligible to Bid Badge
aria-label='Warning: Company is ineligible to bid for federal contracts. One or more certificates have expired.' aria-live=assertive when this badge first appears so screen readers announce it immediately.
Bulk Verification Results
Table with proper thead and tbody. Column headers: Company, RC Number, Compliance Status, Details. Status cells have aria-label that combines all relevant information: Fully Compliant, 6 of 6 certificates active, or Non-Compliant, NSITF expired on 1 May 2026.
Progress Indicators
All loading spinners and progress bars use aria-live=polite and aria-label. Progress bars use role=progressbar with aria-valuenow, aria-valuemin, and aria-valuemax.


Keyboard Navigation Requirements
Dashboard certificate cards
All six certificate cards are keyboard-focusable in left-to-right, top-to-bottom order. Enter key activates the card (same as tap). Tab moves to next card. No mouse required to navigate certificates.
Modal focus management
When any modal opens, focus moves to the modal heading. Tab is trapped within the modal until it is closed. Escape key closes all dismissible modals. Non-dismissible modals (session expired, account suspended) cannot be escaped with the keyboard.
MDA bulk upload drag-and-drop
The drag-and-drop zone has a keyboard-accessible alternative: a clearly labelled Browse files button that is always visible alongside the drop zone, not hidden behind a hover state.
Certificate cards in MDA results
The bulk verification results table is fully keyboard-navigable. Arrow keys navigate between rows. Enter opens the detail view for a company. Screen reader announces row content as it receives focus.
Form validation
Validation errors are announced via aria-live=assertive. Error messages are programmatically associated with their input fields via aria-describedby. Fields with errors have aria-invalid=true. Focus moves to the first error field when the form is submitted with errors.


Colour Contrast Requirements
The following contrast ratios must be verified in Figma before design is considered complete. WCAG AA requires 4.5:1 for normal text and 3:1 for large text and UI components.
Brand green (#1A6B4A) on white
Ratio: approximately 7.2:1. PASS. Used for primary buttons, headings, and active states.
Red expired state on white
The specific red chosen for expired states must achieve minimum 4.5:1 on white background. Pure red (#FF0000) achieves 3.99:1 and FAILS for small text. Use #CC0000 or darker which achieves 5.8:1. This must be verified and locked before the component library is built.
Amber warning text on white
Standard amber (#FFA500) achieves only 2.9:1 on white. FAILS for text. Amber is acceptable for icon-only or large graphic elements but any amber text label must use a darker variant (#8B6914 or equivalent) that achieves 4.5:1.
White text on brand green
Ratio: approximately 7.2:1. PASS. Used for primary button labels and module header text.
Body text (#4A5568) on white
Ratio: approximately 7.6:1. PASS.
Disabled state text
Disabled inputs and buttons must use a minimum of 3:1 contrast ratio even in their disabled state. WCAG allows lower contrast for disabled components but this product serves users in challenging environments. Use #767676 minimum for disabled text.


Focus Order for Critical Flows
The following focus orders must be implemented for the five most frequently used flows. These are not visual design decisions. They are functional accessibility requirements.
Dashboard focus order
1. Skip to main content link (visually hidden, first tab stop). 2. Primary navigation items left to right. 3. Health score ring (read-only, aria-label announces score). 4. Certificate cards top-left to bottom-right. 5. Activity feed items. 6. Action buttons within each certificate card.
Certificate upload modal focus order
1. Modal heading. 2. File drop zone (with keyboard alternative). 3. Supported formats note. 4. Cancel button. 5. Submit button. Escape returns focus to the element that triggered the modal.
MDA single lookup focus order
1. RC number input field. 2. Search button. 3. Results area (focus moves here automatically when results load). 4. Individual certificate rows. 5. Download report button. 6. New search button.
Payment form focus order
1. Card number field. 2. Expiry field. 3. CVV field. 4. Cardholder name field. 5. Pay button. Error messages are announced via aria-live when form is submitted with invalid fields.
Onboarding checklist focus order
1. Checklist heading. 2. Certificate rows top to bottom. 3. Primary CTA at bottom. Each certificate row announces: [Certificate Name]. Status: Not Connected. Action: Connect this certificate.


10B.6 Error Path User Flows
The two error path flows below extend existing happy-path flows with their most likely failure variants. Designers must create prototype connections for all error branches, not just the success paths.

Error Flow 01: Renewal Reference Number Contradicts API
This is the error variant of Flow 02 (Compliance Officer Responding to an Expiry Alert). At step 6 of that flow, the officer enters a new certificate reference number. This flow covers what happens when the API contradicts what was submitted.
01.  [CERT-03]  Officer taps Renew Now on expiring NSITF certificate
02.  [CERT-16]  Renewal guidance screen shows NSITF portal link and required steps
03.  [External]  Officer completes renewal on NSITF portal and receives new reference number
04.  [CERT-11]  Returns to ClearPass and enters new NSITF reference number
05.  [CERT-12]  API verification begins. Extraction queries NSITF portal  — If extraction succeeds and confirms validity: flow continues to CERT-13 as normal
06.  [CERT-14]  ERROR PATH: API returns different company name for the reference number  — This is MODL-04 presented as an inline state on CERT-03, not a separate screen
07.  [CERT-14]  Officer sees: Under Additional Verification. Details submitted do not match NSITF records. Our team will review within 2 business days.  — Certificate enters Contradicted state. Score is not penalised during review window.
08.  [DASH-01]  Officer returns to dashboard. Certificate shows amber Contradicted badge. Score unchanged pending review.
09.  [ADMIN-01]  Admin review queue receives high-priority Contradiction flag for this company
10.  [ADMIN-02]  Admin reviews both submitted data and API response side by side
11a.  [CERT-13]  IF APPROVED: Admin approves with contradiction note. Certificate activates. Officer receives EMAIL-03 with Reviewer Verified badge. Score recalculates.
11b.  [CERT-10]  IF REJECTED: Admin rejects with specific reason. Officer receives EMAIL-04. Returns to CERT-11 to re-submit with correct reference number.

Error Flow 02: Bulk CSV Fails Partway Through Processing
This is the error variant of Flow 03 (MDA Officer Verifying 40 Vendors). The error occurs after processing has begun and some but not all verifications have completed.
01.  [MDA-07]  Officer uploads CSV of 40 companies
02.  [MDA-08]  CSV parses cleanly. 40 valid RC numbers. Officer proceeds.
03.  [MDA-09]  Processing begins. Progress counter: Verifying 1 of 40.
04.  [MDA-09]  Progress reaches 23 of 40. ClearPass API experiences a timeout on government source.  — Progress bar pauses. Timer shows: Verification paused. Retrying (attempt 1 of 3).
05.  [MDA-09]  Retry 1 fails. Retry 2 begins automatically. Progress counter shows 23 of 40 still.  — Officer sees: Verification paused. Government verification service is responding slowly. Retrying automatically.
06.  [MDA-09]  Retry 3 fails. System cannot complete remaining 17 verifications via API.  — Partial Failure state activates. Officer sees a split result view.
07.  [MDA-10]  PARTIAL RESULTS VIEW: Two sections. Section 1: Verified (23 companies with full results). Section 2: Verification Incomplete (17 companies with last-known status and a freshness warning).  — Designer note: The Verification Incomplete section must be visually distinct from Non-Compliant. These companies are not non-compliant. They are unverified due to a system issue.
08.  [MDA-10]  Officer has two options: Download partial report (23 verified companies only) or Retry incomplete verifications.
09a.  [MDA-10]  IF RETRY CHOSEN: Retry button triggers re-verification of the 17 incomplete companies only. Returns to processing state for those 17.
09b.  [MDA-10]  IF PARTIAL DOWNLOAD CHOSEN: PDF generated for 23 verified companies with a prominent watermark: PARTIAL VERIFICATION - 17 companies excluded due to service interruption.
10.  [MDA-12]  Verification history log records the batch as Partial - 23 of 40 verified. API outage flag shown against the batch record. Full audit trail preserved for any dispute.

11. Supporting Specifications
11.1 Glossary
Every acronym and product-specific term used in this document is defined below. This glossary is the first section any new team member, government partner, or investor should read.

11.1A Regulatory and Government Acronyms
BPP
Bureau of Public Procurement. Federal agency that maintains the National Database of Federal Contractors and governs procurement across all MDAs. ClearPass targets BPP as a verification integration partner.
BVN
Bank Verification Number. An 11-digit number issued by NIBSS that uniquely identifies every bank account holder in Nigeria. Used by ClearPass at registration to prevent duplicate primary accounts. Never stored after verification.
CAC
Corporate Affairs Commission. The Nigerian government body responsible for company registration and the RC number registry. ClearPass queries CAC to validate company registrations at onboarding.
DPO
Data Protection Officer. The designated individual responsible for ClearPass compliance with the Nigeria Data Protection Act. Must be registered with NITDA before the platform processes personal data.
DPIA
Data Protection Impact Assessment. A mandatory risk assessment under the NDPA 2023 required before ClearPass processes sensitive personal data. Must be completed and filed with NITDA before launch.
FIRS
Federal Inland Revenue Service. Predecessor to the Nigeria Revenue Service. Still referenced in historical context and by the TaxPro-Max system. See NRS.
HMO
Health Maintenance Organisation. Licensed organisations that provide NHIA-compliant health insurance plans to employers and their employees. ClearPass routes NHIA enrollment referrals to HMO partners.
ITF
Industrial Training Fund. Federal agency that collects a training levy from Nigerian employers with 11 or more employees. Compliance is demonstrated by an ITF certificate required for federal procurement.
MDA
Ministry, Department, or Agency. Collective term for all federal government bodies in Nigeria that issue tenders, award contracts, or issue licences. MDAs are the verification consumers in ClearPass.
MCO
Mining Cadastre Office. The federal body managing mining licences. Referenced in the project origin context only.
NDPA
Nigeria Data Protection Act 2023. The primary data protection legislation governing how ClearPass collects, stores, and processes personal data of Nigerian users.
NHIA
National Health Insurance Authority. The federal agency established under the NHIA Act 2022 to regulate health insurance in Nigeria. The September 2025 presidential directive made NHIA certificates mandatory for all federal procurement.
NIBSS
Nigeria Inter-Bank Settlement System. The interbank infrastructure operator that manages BVN records. ClearPass uses NIBSS-adjacent systems for BVN identity verification.
NIN
National Identification Number. The unique identity number issued by NIMC to every Nigerian citizen. Referenced in the broader identity ecosystem context.
NIMC
National Identity Management Commission. The agency that manages NIN records.
NITDA
National Information Technology Development Agency. The regulatory body that governs data protection and technology compliance in Nigeria. ClearPass must register with NITDA as a data controller and file its DPIA before launch.
NRS
Nigeria Revenue Service. The successor agency to FIRS established under the 2025 Tax Reform Acts. Operates TaxPro-Max and the e-invoicing mandate. ClearPass pursues NRS API access for TIN and tax clearance verification.
NSITF
Nigeria Social Insurance Trust Fund. The agency that collects employee injury insurance contributions from Nigerian employers. NSITF compliance certification is mandatory for federal procurement.
OAGF
Office of the Accountant General of the Federation. Issued the November 2025 circulars mandating digital revenue collection across all MDAs. Context for the broader govtech landscape.
PCC
Pension Clearance Certificate. Issued by PenCom confirming that a company has been remitting pension contributions for all eligible employees. One of the six mandatory compliance certificates tracked by ClearPass.
PenCom
Pension Commission. The federal agency responsible for overseeing pension administration in Nigeria and issuing Pension Clearance Certificates. PenCom's API integration is Priority 1 for ClearPass after NHIA.
RC Number
Registration Certificate Number. The unique identifier assigned to every company registered with the CAC. The primary key ClearPass uses to identify and look up companies across all government databases.
SGF
Secretary to the Government of the Federation. The SGF circular of September 3, 2025 gave operational effect to President Tinubu's directive making NHIA certificates mandatory for federal procurement.
TIN
Tax Identification Number. Issued by FIRS or NRS to registered Nigerian taxpayers. Tax clearance verification (confirming active and compliant TIN status) is one of the six mandatory certificates tracked by ClearPass.
WAT
West Africa Time. UTC+1. The time zone in which all ClearPass alert scheduling, notification delivery, and expiry transitions operate.


11.1B Technical Acronyms
AES
Advanced Encryption Standard. AES-256 is the encryption standard required for all data at rest in ClearPass.
API
Application Programming Interface. A defined set of rules that allows one software system to communicate with another. ClearPass exposes a public REST API and consumes government APIs for certificate verification.
ARIA
Accessible Rich Internet Applications. A set of HTML attributes that improve the accessibility of web content for users with disabilities, particularly screen reader users.
CDN
Content Delivery Network. A distributed network that delivers static assets (images, scripts, stylesheets) from servers geographically close to the user. Cloudflare is specified as the ClearPass CDN.
CSV
Comma-Separated Values. A plain text file format for tabular data. Used in the MDA bulk verification flow and compliance consultant bulk certificate import.
DDoS
Distributed Denial of Service. A cyberattack that floods a server with traffic to make it unavailable. Cloudflare provides DDoS protection for ClearPass.
HMAC
Hash-based Message Authentication Code. A cryptographic technique used to verify the integrity of webhook payloads sent from ClearPass to MDA integrators. Consumers must validate the X-ClearPass-Signature header.
JSONB
JSON Binary. A PostgreSQL data type that stores JSON data in a decomposed binary format enabling efficient querying. Used in ClearPass for government API response storage, health score breakdowns, and audit log metadata.
JWT
JSON Web Token. A compact, self-contained token used for authentication between the ClearPass client and server. Tokens expire after 24 hours with refresh token rotation.
MFA
Multi-Factor Authentication. A security requirement for all MDA officer and admin accounts in ClearPass. Supported methods: TOTP (authenticator app) and SMS OTP.
MVP
Minimum Viable Product. The first deployable version of ClearPass defined in the Phase 1 MVP scope in Section 5.
OCR
Optical Character Recognition. A technology that reads text from images. Referenced as a Phase 2 enhancement for auto-detecting certificate types from uploaded document images.
OTP
One-Time Password. A single-use code sent via SMS or email for authentication. Used in ClearPass for password reset and MFA verification.
PDF
Portable Document Format. The file format used for compliance report exports and certificate document uploads.
PWA
Progressive Web App. A web application that delivers app-like experiences on mobile without requiring an app store download. ClearPass Business Portal is configured as a PWA.
REST
Representational State Transfer. The architectural style used for the ClearPass Public API. All endpoints follow REST conventions using standard HTTP methods and status codes.
RLS
Row Level Security. A PostgreSQL feature that enforces access control at the database row level. Used in ClearPass to make the AuditLog and CertificateHistory tables physically immutable.
RPO
Recovery Point Objective. The maximum acceptable data loss in the event of a database failure. Critical tables (AuditLog, CertificateHistory) use synchronous replication with RPO approaching zero.
RTO
Recovery Time Objective. The maximum acceptable downtime in the event of a system failure. Target RTO for ClearPass is under 5 minutes using AWS Multi-AZ automated failover.
SaaS
Software as a Service. The business model under which ClearPass is sold. Companies subscribe to the platform rather than purchasing a perpetual licence.
SFTP
Secure File Transfer Protocol. The secure file transfer mechanism used for government agency batch data file ingestion in the Tier 3 integration architecture.
SHA
Secure Hash Algorithm. SHA-256 is used in ClearPass for BVN hashing (with salt), document integrity checking, and API key storage. The raw input to any SHA-256 hash is never reconstructable from the hash alone.
SLA
Service Level Agreement. A defined commitment to service performance. ClearPass SLAs include 24-hour manual certificate review, 99.5% platform uptime, and sub-10-second single verification API response times.
TLS
Transport Layer Security. TLS 1.3 is the minimum encryption standard for all data in transit in ClearPass. All HTTP connections are redirected to HTTPS.
TOTP
Time-based One-Time Password. An MFA method where a time-sensitive code is generated by an authenticator app such as Google Authenticator. Required for all admin accounts.
TTL
Time to Live. The duration for which cached data is considered valid before it must be refreshed. Certificate API verification results have TTLs ranging from 6 hours (FIRS) to 24 hours (NSITF, BPP).
UUID
Universally Unique Identifier. A 128-bit identifier used as the primary key for every entity in the ClearPass database. Prevents sequential ID enumeration and avoids leaking growth metrics.
USSD
Unstructured Supplementary Service Data. A mobile communication protocol that works on basic feature phones without internet. Referenced as a potential registration fallback for rural users.
WCAG
Web Content Accessibility Guidelines. The international standard for web accessibility. ClearPass targets WCAG 2.1 Level AA compliance.


11.1C ClearPass Product-Specific Terms
Certificate State Machine
The defined set of states a certificate can occupy and the allowed transitions between them. States: Not Connected, Pending Verification, Active, Expiring (30), Expiring (14), Expiring (7), Expired, Renewal In Progress, Not Applicable. Defined in Module 3.
Compliance Health Score
A numeric score from 0 to 100 calculated from three weighted components: Certificate Coverage (50 points), Compliance Freshness (30 points), and Verification Quality (20 points). Defined in full in Section 2.4.
Compliance Partner
A registered compliance consultant who manages ClearPass accounts for multiple client companies under a single Compliance Partner subscription. Linked to client companies via the CompliancePartnerLink entity.
Circuit Breaker
A resilience pattern used in the government API integration layer. After three consecutive failures, the connector enters open state, stops attempting live queries, and routes all requests to manual review fallback. Attempts recovery every 15 minutes.
Dead Letter Queue
A message queue that receives jobs that have failed all retry attempts. Used in ClearPass for failed score recalculation jobs, failed notification deliveries, and failed webhook dispatch. All items in the dead letter queue trigger an ops alert.
Four-Tier Integration Architecture
The ClearPass government data verification hierarchy. Tier 1: Direct API. Tier 2: Web Extraction. Tier 3: Batch File. Tier 4: Manual Review. Every certificate falls to the highest available tier. Defined in Section 9B.
Formula Version
A version string (e.g., 1.0) stored alongside every health score calculation and verification query result. Enables historical scores to be interpreted correctly after formula updates. Managed through the Certificate Rule Engine in the admin portal.
Gate Check
The five simultaneous conditions that must all be true for a company to achieve Procurement Ready status. Defined in Section 2.4. A company can score 85 out of 100 and still fail the Gate Check.
Government Integration Architecture
See Four-Tier Integration Architecture.
Hard Block Rule
A rule in the health score formula that overrides the calculated numeric score under specific circumstances. Three hard block rules exist: NHIA Expired Cap (maximum score 49), Ineligible to Bid Badge (any expired certificate), and Unverified Profile Lock (CAC not confirmed). Defined in Section 2.4.
Ineligible to Bid
A badge displayed on the ClearPass dashboard and in verification results when any certificate is in Expired state. Displayed independently of and alongside the numeric health score. Defined by Hard Block Rule 2.
NHIA Hard Cap
Hard Block Rule 1. If the NHIA certificate is in Expired or Not Connected state, the maximum displayable health score is 49 out of 100 regardless of the Component A, B, and C calculation results.
Procurement Ready
A binary badge status awarded only when all five Gate Check conditions are simultaneously met. Separate from and more stringent than the numeric health score. A company can have a high score without being Procurement Ready.
Projected Score
The health score the company will have on the date the soonest-expiring certificate expires, calculated assuming no renewal action is taken. Displayed alongside the current score when any certificate expires within 60 days.
Report ID
A human-readable, URL-safe unique identifier for every generated compliance report. Format: CPR-YYYYMMDD-XXXXXXX. The X segment is cryptographically random. Used in QR codes and for report lookup.
Score at Risk
A dashboard state and email notification triggered when a projected score drop of 20 or more points will occur within 14 days. Separate from standard expiry alerts. Cannot be opted out of.
Verification Tier
The method used to verify a certificate. Displayed in the dashboard, API response, and compliance report as: API Verified (Tier 1), Portal Verified (Tier 2), Batch Verified with data date (Tier 3), or Reviewer Verified (Tier 4).
Web Extraction
The Tier 2 integration method. A Playwright-based headless browser submits certificate reference numbers to government verification portals and parses the HTML response. Independent microservice per portal with circuit breaker, rate limiting, and configurable CSS selectors.


11.2 Risk Register
This register consolidates every risk identified throughout the ClearPass PRD into a single reference. Risks were previously documented in Sections 2, 4, 8, 9, 10, and 11. Consolidation here ensures no risk is missed regardless of where in the document it originated. The register is a living document updated at the start of every sprint and reviewed in full monthly.
Likelihood and Impact are rated High, Medium, or Low. The Risk Owner is the role responsible for monitoring and executing the mitigation. Status reflects current state: Open (risk not yet mitigated), Mitigated (mitigation in place), Accepted (risk accepted with no further action), or Closed (risk no longer applicable).

POLITICAL AND REGULATORY RISKS
ID
Risk
Likelihood
Impact
Owner
Mitigation
Status
R-01
NHIA mandate suspended or reversed by court injunction or change of government
Low
High
Product Strategist
Platform is architected as a multi-cert hub. PCC and NSITF carry independent mandatory value. NHIA weight is configurable via admin portal without a code deploy.
Open
R-02
NHIA awards PPP to a single private integrator before ClearPass reaches the MoU stage
Medium
High
Product Strategist
Position ClearPass as the corporate-side compliance hub that sits above any single-agency platform. The PPP integrator becomes a data source, not a competitor.
Open
R-03
Nigerian government builds a competing multi-certificate compliance platform
Low
Medium
Product Strategist
First-mover advantage and government MoU create switching costs. Government platform becomes an additional data source for ClearPass verification layer.
Open
R-04
Ministerial reshuffle removes the political champion driving NHIA mandate enforcement
Medium
High
Product Strategist
Build relationships at the DG and technical director level, not only at minister level. Technical officials outlast ministerial appointments.
Open
R-05
2027 elections create prolonged government transition that pauses MDA procurement activities
Medium
Medium
Product Strategist
Diversify revenue toward business subscription fees (B2B) rather than MDA API fees (B2G) before 2027. Business subscriptions are election-agnostic.
Open
R-06
NDPA enforcement action against ClearPass for a data handling violation
Low
High
Product Strategist
Complete DPIA before launch. Appoint DPO. Register with NITDA. Conduct annual NDPA compliance audit. BVN non-storage architecture is documented and demonstrable.
Open


GOVERNMENT API AND INTEGRATION RISKS
ID
Risk
Likelihood
Impact
Owner
Mitigation
Status
R-07
NHIA does not deliver a verification API within the 9-month post-MoU target
Medium
Medium
Lead Developer
Tier 4 manual review is fully operational at launch. Tier 2 web extraction is built alongside Tier 1 API work so fallback activates immediately if API is delayed.
Open
R-08
PenCom changes their portal structure, breaking Tier 2 web extraction before Tier 1 API is secured
Medium
Medium
Lead Developer
CSS selectors are stored in the database and configurable from the admin portal. A portal structure change triggers an ops alert within 15 minutes and selector updates deploy in hours not days.
Open
R-09
A government agency formally prohibits web extraction from their portal
Low
Medium
Product Strategist
Formal disclosure letters are sent to each agency before extraction begins. If prohibited, that certificate type falls to Tier 4. Manual review absorbs the volume. API negotiation is accelerated.
Open
R-10
All government APIs simultaneously unavailable for an extended period (24+ hours)
Low
High
Lead Developer
Declared outage mode activates. Manual review queue is staffed up. SLA is suspended. Status page updated. Users notified with transparent communication.
Open
R-11
Government API credentials expire causing silent verification failures
Medium
High
Lead Developer
All credential expiry dates tracked in secrets manager. 30-day advance alert to engineering team. Credential rotation is a scheduled maintenance task not an emergency response.
Open


ADOPTION AND COMMERCIAL RISKS
ID
Risk
Likelihood
Impact
Owner
Mitigation
Status
R-12
Target market of Nigerian businesses is unaware of NHIA procurement mandate and does not register
Medium
High
Product Strategist
Not Found queries from MDA bulk verifications are captured as leads. Each Not Found triggers an automated registration invitation via CAC email. NECA partnership drives employer awareness.
Open
R-13
Compliance consultants resist ClearPass adoption because it reduces their advisory fees
Medium
Medium
Product Strategist
Compliance Partner tier gives consultants a platform to scale from 25 to 80+ clients. ClearPass is positioned as their practice management tool not their replacement.
Open
R-14
MDA officers resist adoption because it removes their discretionary verification power
Medium
High
Product Strategist
Entry strategy targets MDA IT directors and procurement directors who benefit from audit protection. Field officers are not the primary adoption target at launch.
Open
R-15
Revenue falls below projections due to low subscription conversion from free tier
Medium
High
Product Strategist
Compliance report generation is gated behind paid tier. Any company that needs to submit a report must upgrade. Report generation is the primary conversion trigger.
Open
R-16
High churn after first subscription year if NHIA mandate enforcement is weak
Medium
Medium
Product Strategist
PCC and NSITF certificates have strong independent enforcement history. Multi-cert value proposition reduces NHIA dependency. Engagement features (expiry alerts, digest) drive habitual use.
Open


SECURITY AND FRAUD RISKS
ID
Risk
Likelihood
Impact
Owner
Mitigation
Status
R-17
Certificate forgery at scale where fraudulent documents pass both manual review and API gaps
Medium
High
Lead Developer
Duplicate reference number detection, document hash integrity, API contradiction flagging, and reviewer training on certificate-specific forgery patterns. Government API integration reduces forgery surface progressively.
Open
R-18
Admin account compromise allowing bulk certificate approvals or data exfiltration
Low
High
Lead Developer
MFA mandatory for all admin accounts. New-device email confirmation. Anomaly detection for bulk approvals. Immutable audit log. Super admin can suspend any admin account within 60 seconds.
Open
R-19
Data breach exposing company certificate data and employee records
Low
High
Lead Developer
AES-256 at rest. TLS 1.3 in transit. BVN never stored. Annual penetration testing. DPIA completed. NDPA breach notification plan documented before launch.
Open
R-20
API key compromise leading to mass unauthorized verification queries
Medium
Medium
Lead Developer
GitHub Secret Scanning integration for automatic key detection and revocation. Rate limiting with temporary suspension on sustained abuse. API keys are hashed in storage.
Open


OPERATIONAL AND TECHNICAL RISKS
ID
Risk
Likelihood
Impact
Owner
Mitigation
Status
R-21
Manual certificate review SLA breaches (24 hours) as volume scales beyond reviewer capacity
High
Medium
Product Strategist
SLA monitoring alerts at 20 hours. Review queue load tracking in admin analytics. Reviewer headcount plan scales with company onboarding rate. Target: 1 reviewer per 200 pending submissions.
Open
R-22
Database primary failure with data loss for writes that occurred during replication lag
Low
High
Lead Developer
Synchronous replication (synchronous_commit=on) for AuditLog and CertificateHistory. Asynchronous for non-critical tables. Maximum replication lag monitored and alarmed at 30 seconds.
Open
R-23
VerificationQuery table performance degradation as query volume scales to millions of rows
Medium
High
Lead Developer
Monthly range partitioning defined at table creation. Not retrofitted. Partition strategy documented. Archive policy for partitions older than 24 months.
Open
R-24
Nigerian SMS carrier failures causing mass notification delivery failure at critical expiry moments
High
Medium
Lead Developer
Dual SMS provider (Termii primary, Twilio Nigeria fallback). Exponential backoff retry with dead letter queue. In-app notification as tertiary channel. Failed delivery logged and displayed on next login.
Open
R-25
Key person dependency: product design and strategy concentrated in one person at launch
High
High
Product Strategist
This PRD is the institutional knowledge transfer mechanism. Every decision is documented. Process documentation for manual review, partner management, and government outreach maintained separately.
Open
R-26
Paystack or payment gateway downtime during subscription renewal peak period
Medium
Medium
Lead Developer
Flutterwave as hot standby. 7-day grace period after subscription expiry. Reconciliation job resolves split-brain payment states. Users notified proactively during known gateway incidents.
Open
R-27
Government agency issues a cease-and-desist against web extraction from their portal
Low
Medium
Product Strategist
Formal disclosure letters sent before extraction begins. Extraction is rate-limited to be indistinguishable from normal user traffic. If prohibited, falls to Tier 4. API negotiation accelerated immediately.
Open
R-28
Formula version change causes discrepancy between historical scores and current scores creating user confusion
Medium
Low
Lead Developer
Formula version stored with every score calculation. Dashboard displays formula version on score detail. Formula change communications sent to all active users before deployment.
Open


11.3 KPI and Metrics Framework
This framework defines what ClearPass measures, how it is measured, the target value at each phase, the frequency of review, the tool used to capture the data, and the owner responsible for tracking and acting on each metric. A metric without an owner and a threshold is a vanity number. Every KPI here has both.
Phase 1 targets apply to months 1 to 6 post-launch. Phase 2 targets apply to months 7 to 12. The threshold column defines the value that triggers an immediate product or operational decision.

PRODUCT METRICS
KPI
Definition
Target
Frequency
Tool
Owner
Monthly Active Companies (MAC)
Companies with at least one dashboard login in the past 30 days
500 (P1) / 5,000 (P2)
Weekly
Mixpanel
Product
Certificate Connection Rate
Percentage of registered companies with all applicable certificates connected (any state other than Not Connected)
60% (P1) / 80% (P2)
Weekly
Internal DB query
Product
Time to First Certificate
Median days from registration to first certificate in Active or Pending state
Under 3 days (P1 and P2)
Weekly
Mixpanel funnel
Product
Time to Procurement Ready
Median days from registration to first Procurement Ready badge
Under 21 days (P1) / Under 14 days (P2)
Monthly
Mixpanel funnel
Product
Onboarding Completion Rate
Percentage of registered companies that complete onboarding and connect at least one certificate
70% (P1) / 85% (P2)
Weekly
Mixpanel
Product
Renewal Conversion Rate
Percentage of 30-day expiry alerts that result in a successful certificate renewal before expiry
65% (P1) / 80% (P2)
Monthly
Mixpanel
Product
Report Generation Rate
Percentage of Procurement Ready companies that have generated at least one compliance report in the past 90 days
40% (P1) / 60% (P2)
Monthly
Internal DB
Product


BUSINESS METRICS
KPI
Definition
Target
Frequency
Tool
Owner
Monthly Recurring Revenue (MRR)
Total subscription revenue collected in the month across all tiers in NGN
₦3M (P1) / ₦30M (P2)
Monthly
Paystack dashboard + DB
Finance
Free to Paid Conversion Rate
Percentage of Starter tier accounts that upgrade to a paid tier within 60 days of registration
15% (P1) / 25% (P2)
Monthly
Mixpanel
Product
Monthly Churn Rate
Percentage of paying companies that cancel or downgrade to Starter in the month
Under 5% (P1 and P2)
Monthly
Internal DB
Finance
Average Revenue Per Account (ARPA)
Total MRR divided by total paying companies
₦7,500 (P1) / ₦9,000 (P2)
Monthly
Internal DB
Finance
MDA API Revenue
Total verification query fees billed to MDA accounts above the free tier in the month
₦500K (P1) / ₦5M (P2)
Monthly
Internal DB
Finance
HMO Commission Revenue
Total enrollment referral commissions earned in the month
₦200K (P1) / ₦3M (P2)
Monthly
Internal DB
Finance
Customer Acquisition Cost (CAC)
Total sales and marketing spend divided by new paying companies acquired in the month
Under ₦30,000 (P1 and P2)
Monthly
Finance records + DB
Finance


OPERATIONAL METRICS
KPI
Definition
Target
Frequency
Tool
Owner
Manual Review SLA Compliance
Percentage of certificate submissions reviewed within 24 business hours
95% (P1) / 99% (P2)
Daily
Admin portal SLA monitor
Operations
Average Review Queue Time
Median hours from certificate submission to review completion
Under 12 hours (P1) / Under 8 hours (P2)
Daily
Admin portal
Operations
API Uptime
Percentage of minutes in the month that the ClearPass API returns valid responses
99.5% (P1 and P2)
Continuous
Uptime monitor (BetterUptime or PagerDuty)
Engineering
Government API Availability
Percentage of the time each government integration is in Tier 1 or Tier 2 (not in Tier 4 fallback)
80% (P1) / 95% (P2)
Weekly
Integration health monitor
Engineering
Notification Delivery Rate
Percentage of outbound notifications successfully delivered across all channels
92% (P1) / 97% (P2)
Weekly
Notification table query
Engineering
P0 Incident Rate
Number of P0 incidents (platform unusable or data incorrect) per month
Under 2 (P1) / Under 1 (P2)
Monthly
Incident log
Engineering


QUALITY AND TRUST METRICS
KPI
Definition
Target
Frequency
Tool
Owner
Certificate Fraud Detection Rate
Percentage of submitted certificates flagged as potential forgeries that are confirmed fraudulent on review
Tracked from month 1. No minimum target. Increasing rate signals product trust.
Monthly
Admin portal fraud queue
Operations
QR Verification Accuracy
Percentage of QR code scans that return a status consistent with the company current database state
99.9% (P1 and P2)
Monthly
VerificationQuery table
Engineering
Score Calculation Staleness
Percentage of company health scores that are older than 10 minutes when a certificate state change has occurred
Under 1% (P1 and P2)
Daily
DB query on score age
Engineering
Data Accuracy Disputes
Number of companies that formally dispute the accuracy of their ClearPass data in the month
Under 5 per 1,000 active companies
Monthly
Support ticket system
Operations


GOVERNMENT PARTNERSHIP METRICS
KPI
Definition
Target
Frequency
Tool
Owner
MDA Portal Registrations
Number of distinct MDAs with active officer accounts on ClearPass
3 (P1) / 15 (P2)
Monthly
Internal DB
Product Strategist
MDA Monthly Verification Queries
Total single and bulk verification queries performed by MDA officers in the month
500 (P1) / 10,000 (P2)
Monthly
VerificationQuery table
Product Strategist
NHIA Enrollment Conversions
Number of companies that complete NHIA enrollment through ClearPass and receive a certificate in the month
50 (P1) / 500 (P2)
Monthly
EnrollmentReferral table
Operations
Government API Tier 1 Coverage
Number of the six certificate types verified via Tier 1 direct API
2 (P1: NRS + CAC) / 4 (P2: add PenCom + NHIA)
Milestone
Integration health monitor
Engineering


11.4 Analytics and Event Tracking
This section defines the analytics stack, the event naming convention, every tracked event with its properties, the key funnels, and the dashboards that must exist before launch. Analytics is not a post-launch addition. The events defined here are instrumented during build, not retrofitted after the product ships.
Analytics Stack
Product analytics
Mixpanel. Tracks user behaviour, funnels, retention, and feature adoption. All events below are sent to Mixpanel.
Server-side tracking
All events are fired server-side, not client-side. This eliminates ad blocker interference and ensures data integrity. The client never sends analytics events directly.
Error tracking
Sentry. Captures all application errors, API failures, and performance issues with full stack traces.
Infrastructure monitoring
Datadog or AWS CloudWatch. CPU, memory, database connections, queue depths, and API response times.
Uptime monitoring
BetterUptime or PagerDuty. External monitoring of all public endpoints. Alerts to on-call engineer within 60 seconds of downtime.
Business analytics
Internal PostgreSQL queries via Metabase or Retool. Revenue, churn, MDA usage, and operational metrics that require joining multiple tables.


Event Naming Convention
All events follow the pattern: noun_verb in snake_case. The noun is the entity being acted on. The verb is the action. Examples: company_registered, certificate_uploaded, report_generated. Events are never renamed after they are deployed. Renaming breaks historical funnels.

REGISTRATION AND ONBOARDING EVENTS
Event Name
Properties
Trigger
Used In
user_registration_started
account_type, source (organic/invite/mda_referral)
User selects account type on AUTH-01
Acquisition funnel
rc_number_submitted
cac_validation_result (success/pending/failed/deregistered), validation_time_ms
RC number entered and CAC query returns
Registration funnel
company_created
sector_id, employee_band, country_code, cac_verified
Company row inserted in DB
Registration funnel, segmentation
user_registered
account_type, company_id, email_domain
User row inserted and email verified
Activation metric
onboarding_started
company_id, health_score_at_start (always 0)
User reaches ONB-01
Onboarding funnel
onboarding_step_completed
step_number, step_name, certificate_type (if applicable)
Each ONB step completed
Onboarding funnel
onboarding_completed
company_id, time_to_complete_minutes, certificates_connected
User reaches ONB-04
Activation funnel
onboarding_skipped
step_skipped, reason (user_action/timeout)
User skips onboarding step
Drop-off analysis


CERTIFICATE MANAGEMENT EVENTS
Event Name
Properties
Trigger
Used In
certificate_upload_started
certificate_type, company_id
User opens upload modal MODL-02
Certificate funnel
certificate_uploaded
certificate_type, file_size_kb, validation_passed
File passes upload validation
Certificate funnel
certificate_submitted
certificate_type, submission_method (upload/reference_number)
Certificate submitted to review queue
Certificate funnel
certificate_api_verified
certificate_type, integration_tier, response_time_ms
Government API returns valid result
API performance, tier tracking
certificate_approved
certificate_type, verification_method, review_time_hours
Admin approves or API confirms
Operational SLA, certificate funnel
certificate_rejected
certificate_type, rejection_reason_category
Admin rejects submission
Quality analysis
certificate_expired
certificate_type, days_since_expiry, had_alert_sent
Nightly expiry job transitions to Expired
Retention risk, alert effectiveness
certificate_renewed
certificate_type, days_before_expiry, renewal_triggered_by (alert/self)
Certificate transitions from expiring to active
Renewal funnel, alert ROI
certificate_contradiction_detected
certificate_type, api_response_company_match
API returns different company for reference
Fraud monitoring


DASHBOARD AND ENGAGEMENT EVENTS
Event Name
Properties
Trigger
Used In
dashboard_viewed
health_score, procurement_ready, ineligible_to_bid, certs_expiring_count
User loads DASH-01
Engagement, health score distribution
score_at_risk_banner_seen
certificate_type, days_until_score_drop, projected_score
Banner renders on DASH-03
Risk alert effectiveness
certificate_card_tapped
certificate_type, certificate_status
User taps any certificate card
Feature usage, most-viewed certs
renewal_cta_tapped
certificate_type, days_remaining, from_surface (card/banner/email)
Renew Now tapped anywhere
Renewal funnel entry
activity_feed_expanded
items_visible
User taps See All on activity feed
Feature engagement
expiry_timeline_viewed
certs_in_view_count
User navigates to DASH-07
Feature engagement


NHIA ENROLLMENT EVENTS
Event Name
Properties
Trigger
Used In
nhia_gap_prompt_seen
source (banner/onboarding/certificate_detail)
NHIA missing prompt renders
NHIA enrollment funnel
nhia_enrollment_started
company_id, employee_band
User taps Get NHIA Certificate
NHIA enrollment funnel
hmo_directory_viewed
state_filter, size_filter
User reaches NHIA-02
HMO partner performance
hmo_selected
hmo_id, hmo_name, plan_type
User confirms HMO selection in MODL-09
HMO partner performance
enrollment_handoff_completed
hmo_id, handoff_method (api/deeplink)
Company data successfully passed to HMO portal
Conversion, commission tracking
enrollment_handoff_failed
hmo_id, failure_reason
HMO portal returns error
HMO partner health monitoring
nhia_certificate_issued
hmo_id, days_from_enrollment_start
NHIA API confirms certificate issuance
Enrollment completion rate


COMPLIANCE REPORT EVENTS
Event Name
Properties
Trigger
Used In
report_generation_started
report_type, health_score_at_start, procurement_ready
User taps Generate Report
Report funnel
report_generated
report_type, health_score, procurement_ready, generation_time_seconds
Report PDF creation complete
Report funnel, performance
report_downloaded
report_type, report_id
User downloads PDF
Report utility
qr_verification_scanned
report_id, report_age_days, status_changed_since_generation, current_score
Live verification URL accessed
QR usage, report freshness


MDA VERIFICATION EVENTS
Event Name
Properties
Trigger
Used In
mda_single_lookup
mda_id, result (compliant/partial/non_compliant/not_found), response_time_ms
MDA officer submits RC number query
MDA usage, API performance
mda_bulk_upload_started
mda_id, company_count, invalid_row_count
Officer submits CSV
MDA bulk usage
mda_bulk_verification_completed
mda_id, total, compliant, non_compliant, not_found, partial_failure
Batch processing completes
MDA operational metrics
mda_report_downloaded
mda_id, report_type (single/bulk), company_count
Officer downloads verification report
MDA engagement
company_invite_sent
mda_id, invited_via (not_found_query)
MDA officer sends registration invitation
Lead acquisition


BILLING AND SUBSCRIPTION EVENTS
Event Name
Properties
Trigger
Used In
subscription_upgrade_started
from_tier, to_tier, nhia_hard_cap_warning_shown
User enters upgrade flow
Revenue funnel
subscription_upgraded
from_tier, to_tier, amount_kobo, payment_method, gateway
Payment confirmed and subscription activated
Revenue, conversion
subscription_renewed
tier, amount_kobo, days_before_expiry
Annual renewal payment processed
Retention
payment_failed
tier, reason, gateway, attempt_number
Payment gateway returns failure
Revenue recovery
subscription_cancelled
tier, reason, days_since_last_login
User cancels subscription
Churn analysis
subscription_downgraded
from_tier, sub_accounts_deactivated
Grace period expires without renewal
Churn analysis


Key Funnels
Registration to Procurement Ready Funnel
user_registration_started → company_created → user_registered → onboarding_completed → certificate_approved (first) → procurement_ready_achieved (derived from dashboard_viewed where procurement_ready=true). Target drop-off at each stage tracked weekly.
NHIA Enrollment Funnel
nhia_gap_prompt_seen → nhia_enrollment_started → hmo_directory_viewed → hmo_selected → enrollment_handoff_completed → nhia_certificate_issued. Conversion rate target: 40% from prompt seen to certificate issued.
Renewal Funnel
certificate_expired (30 days ahead, when alert sent) → renewal_cta_tapped → certificate_submitted → certificate_approved. Target: 80% of 30-day alerts result in renewal before expiry by Phase 2.
Free to Paid Conversion Funnel
user_registered (Starter) → report_generation_started (gated CTA hit) → subscription_upgrade_started → subscription_upgraded. This funnel identifies the moment Starter users encounter the paywall and the conversion rate from that moment.


Launch-Day Dashboards
The following dashboards must be live and verified before the platform opens to users. These are not post-launch additions.
Dashboard 1: Real-Time Activation
New registrations per hour. Onboarding completion rate. First certificate connected rate. Visible to Product Strategist at all times during launch week.
Dashboard 2: Certificate Health
Certificates by status across all companies. Manual review queue depth. Average review time. API tier distribution per certificate type.
Dashboard 3: Revenue
MRR. New paying companies today. Churn events today. Payment failures today. HMO commissions this month.
Dashboard 4: Operational
API uptime by integration. Notification delivery rate. P0 incident count. Manual review SLA compliance rate.
Dashboard 5: MDA Activity
Verification queries today. MDAs active this week. Bulk verifications completed. Not Found rate (conversion opportunity indicator).


11.5 QA and Testing Strategy
This section defines how ClearPass is verified before any code reaches production. Testing is not a phase at the end of development. Each level of testing runs continuously throughout the build and gates every deployment to production.
The testing strategy has six levels. Each level has an owner, a coverage threshold, the tooling used, and the pass criteria that must be met before code advances to the next level. No exceptions.

Level 1: Unit Testing
Scope
Individual functions, methods, and classes in isolation. No external dependencies. Database calls, API calls, and file system operations are mocked.
Owner
The developer who writes the code writes the tests. No separate QA resource required at this level.
Coverage threshold
Minimum 80% line coverage across the entire codebase. Critical modules (health score formula, certificate state machine, payment processing, audit log writes) require 95% coverage. Coverage reports generated on every pull request.
Tooling
Jest (Node.js backend). React Testing Library (frontend components). Coverage reporting via Jest's built-in coverage reporter.
Pass criteria
All tests pass. Coverage thresholds met. No test skipped without documented justification. Pull request blocked from merging if coverage drops below threshold.
Health score formula testing
The compliance health score formula requires a dedicated test suite covering: all six certificate state combinations, all three hard block rule triggers, sector adjustment scenarios, projected score calculation accuracy, and formula version stamping. Minimum 50 test cases for the formula alone.


Level 2: Integration Testing
Scope
Testing interactions between components. API endpoint testing with real database connections. Message queue processing. Background job execution. Government API connector behaviour against mock government endpoints.
Owner
Developer writes integration tests alongside feature development. Tech lead reviews integration test coverage in pull request review.
Coverage threshold
Every API endpoint has at minimum one integration test for its success response, one for its primary error response, and one for its authentication failure response.
Tooling
Supertest for API endpoint testing. PostgreSQL test database (separate from development and production). WireMock or similar for mocking government API responses. Testcontainers for spinning up isolated database instances in CI.
Pass criteria
All integration tests pass in CI. Government API mock responses cover both success and failure scenarios for each tier. Circuit breaker behaviour verified against mock timeouts. Database transactions verified for rollback on partial failure.
Critical integration tests
Certificate state machine transitions. Health score recalculation triggered by certificate state change. Payment webhook processing with duplicate detection. Audit log immutability (attempt to UPDATE or DELETE an audit log row must return a database error). BVN hash non-storage (verify BVN is absent from all database tables after verification).


Level 3: End-to-End Testing
Scope
Full user journey testing from browser to database and back. Tests the complete system including UI, API, database, and background jobs as a user would experience it.
Owner
QA engineer. Developers do not write E2E tests. This separation ensures the tests reflect actual user behaviour rather than developer assumptions.
Coverage
All five happy-path user flows from Section 10.4 have corresponding E2E test scripts. All five error-path flows from Section 10B.6 have corresponding E2E test scripts. All ten critical edge cases marked P0 in Section 8 have E2E reproduction scripts.
Tooling
Playwright (same technology as the government web extraction layer, ensuring team familiarity). Tests run against a dedicated staging environment that mirrors production configuration. Test accounts and test company data are seeded before each test run and torn down after.
Pass criteria
100% of E2E tests pass before any production deployment. E2E suite completes in under 20 minutes (longer suites create deployment delays that lead to batching and reduced deployment frequency). Any E2E test failure blocks the deployment pipeline.
Mobile E2E
A subset of the 10 most critical user flows are executed against a mobile viewport in Playwright to verify mobile-specific interactions (bottom tab navigation, touch targets, document upload from camera). This subset runs on every deployment. Full mobile suite runs weekly.


Level 4: Performance and Load Testing
Scope
Verifying that the system meets its non-functional performance requirements under realistic and peak load conditions.
Owner
Lead developer. Conducted before launch and after any major infrastructure change or feature that affects high-traffic endpoints.
Tooling
k6 (open source load testing tool). Tests are scripted in JavaScript and version-controlled alongside the codebase.
Test scenarios
Scenario 1: Normal load. 500 concurrent users. Mix of dashboard loads, certificate lookups, and single MDA verifications. Duration: 10 minutes.
Scenario 2: Peak tender period. 2,000 concurrent users. Weighted heavily toward MDA verification queries and compliance report generation. Duration: 30 minutes.
Scenario 3: Bulk verification spike. 50 simultaneous MDA bulk CSV uploads of 100 companies each. Verifies queue handling and database write performance under concurrent load.
Scenario 4: Nightly expiry job. Simulate the nightly expiry scanning job processing 100,000 certificate records. Verify job completes within the 15-minute window and score recalculation backlog clears within 30 minutes.
Pass criteria
Dashboard load time under 2 seconds at 500 concurrent users on a simulated 3G connection. Single company verification API response under 5 seconds at normal load. API error rate under 0.1% at normal load. System remains stable (no crashes, no data corruption) at 2,000 concurrent users. Nightly job completes within 15 minutes for 100,000 records.


Level 5: Security Testing
Scope
Verifying that the platform resists the security threats documented in Sections 8 and 12.
Owner
External penetration testing firm. Conducted before launch and annually thereafter. Internal security review conducted by lead developer on every major feature release.
Pre-launch security requirements
OWASP Top 10 vulnerability assessment completed with no Critical or High findings unresolved.
SQL injection testing on all database-interacting endpoints.
Authentication bypass testing on all protected endpoints.
BVN non-storage verification: independent audit confirms BVN is absent from all database tables, logs, and API responses after registration.
Audit log immutability verification: direct database UPDATE and DELETE attempts on AuditLog table must return permission denied errors.
API rate limiting verification: brute force and enumeration attempts are rate-limited as specified.
Report ID enumeration resistance: automated sequential scanning of verification URLs returns no exploitable data.
Webhook signature validation: payloads with invalid HMAC signatures are rejected with HTTP 401.
Pass criteria
No Critical or High severity findings from the external penetration test unresolved at launch. All Medium findings documented with remediation plan and timeline. All items above verified and signed off by lead developer.


Level 6: User Acceptance Testing (UAT)
Scope
Real users from the target personas validate that the product meets their needs in a realistic scenario.
Owner
Product Strategist coordinates. QA engineer facilitates sessions. Developers observe but do not intervene.
Participants
Minimum 3 participants per persona. Target personas for UAT: Corporate compliance officer (Amaka), SME owner bidding for first federal contract (Emeka), and MDA procurement officer (Engr. Bello). HMO enrollment officer and compliance consultant UAT can follow in the 2 weeks after initial UAT.
UAT script
Each session follows a structured task script derived from the five happy-path flows in Section 10.4. Participants attempt each task without guidance from the facilitator. The facilitator observes and records where users hesitate, make errors, or express confusion. Sessions are screen-recorded with participant consent.
Pass criteria
Each critical task (register company, connect certificate, generate report, verify vendor for MDA participants) is completed successfully by at least 80% of participants without facilitator assistance. No task takes more than twice the expected time. Zero participants encounter a blocking error that prevents task completion.
UAT findings
All Critical (blocking) UAT findings must be resolved before launch. High findings must be resolved or have an approved workaround documented before launch. Medium and Low findings are entered into the product backlog for post-launch sprints.


Pre-Launch Gate Checklist
The following conditions must all be verified and signed off before ClearPass opens to public users. No exception. No partial sign-off.
Unit test coverage at or above threshold for all modules.
All integration tests passing in the staging environment.
All E2E tests passing including mobile subset.
Performance tests completed. All pass criteria met.
External penetration test completed. No Critical or High findings unresolved.
UAT completed. All Critical findings resolved.
BVN non-storage independently audited and confirmed.
Audit log immutability confirmed at database level.
DPIA completed and filed with NITDA.
DPO designated and registered.
All six email templates tested across Gmail, Apple Mail, and Outlook at mobile and desktop widths.
Uptime monitoring configured and alerting to on-call engineer.
All five launch-day dashboards live and displaying accurate data from staging data.
Paystack webhook idempotency tested with duplicate event simulation.
Payment reconciliation job tested with artificially delayed webhook.
All government disclosure letters sent for web extraction integrations.
NRS TaxPro-Max API integration application submitted.
NHIA MoU engagement initiated (meeting confirmed or MoU signed).
Stakeholder sign-off obtained (see Section 11.6).
Support email and escalation path operational.

11.6 Stakeholder Sign-Off
This section constitutes the formal approval record for ClearPass PRD v2.1. By signing below, each stakeholder confirms that they have read and understood the requirements within their area of responsibility, that the requirements are complete enough for their team to begin work, and that any changes to the requirements after this sign-off must follow the Change Request Process defined below.

Approval Block
Document
ClearPass Product Requirements Document
Version
2.1
Date
May 2026
Status
Pending Approval


Role
Name
Date
Signature
Lead Product Strategist






Lead Developer






Lead Designer






Finance Lead






Operations Lead






Legal / Compliance Lead






Government Relations Lead








Change Request Process
After sign-off, any change to the requirements in this document must follow the process below. Changes are not made by editing this document directly. A new version is issued and re-approved.
Requester submits a Change Request describing: the section to be changed, the proposed change, the reason for the change, and the modules and teams affected.
Product Strategist evaluates the change within 3 business days and classifies it as Minor (no sign-off required, incorporated in next version), Significant (sign-off required from affected team leads), or Major (full stakeholder sign-off required, new PRD version issued).
Approved changes are incorporated into the next document version. The change log is updated.
A Minor change increments the patch version (2.1 to 2.2). A Significant change increments the minor version (2.1 to 2.2). A Major change increments the major version (2.x to 3.0).
All team members are notified of version changes via the team communication channel with a summary of what changed.

Change Log
Version
Date
Author
Changes
1.0
May 2026
Quadri Ismail
Initial PRD. Cover, Executive Summary, Product Vision, 6 User Personas, 3 Journey Maps, 12 Modules with features and user stories.
1.1
May 2026
Quadri Ismail
Added acceptance criteria AC-02 through AC-12 across all modules. 80 acceptance criteria added.
1.2
May 2026
Quadri Ismail
Added Section 2.4: Full Compliance Health Score Formula including three components, hard block rules, procurement ready gate, sector adjustment, projected score, and bottleneck solutions.
1.3
May 2026
Quadri Ismail
Added Section 7: Data Model. 16 entities fully specified with field definitions, constraints, indexes, and West Africa extensibility.
1.4
May 2026
Quadri Ismail
Added Section 8: Edge Cases and Error States. 44 edge cases across 11 failure layers.
1.5
May 2026
Quadri Ismail
Added Section 9: API Specifications. ClearPass Public REST API (9A) and Four-Tier Government Integration Architecture (9B).
2.0
May 2026
Quadri Ismail
Added Section 10: UX Specifications. 120-screen inventory, 8 portal IA definitions, 5 state matrices, 5 user flows, content guidelines, responsive requirements, interaction specs.
2.1
May 2026
Quadri Ismail
Added Section 10B: UX Addendum. 35 modal inventory, 10 extended state matrices, 3 navigation trees, 6 email templates, accessibility requirements, 2 error path flows. Fixed AC-01 labeling.
2.1
May 2026
Quadri Ismail
Added Section 11: Glossary (47 acronyms, 18 product terms), Risk Register (28 risks), KPI Framework (26 KPIs across 5 categories), Analytics Event Tracking (40 events, 4 funnels, 5 dashboards), QA and Testing Strategy (6 levels, 20-item pre-launch gate), Stakeholder Sign-Off and Change Log.


6. Open Questions and Decisions Required
The following items require decisions from the product owner or external stakeholders before development can proceed on the relevant modules.
OQ-01
What is the formal legal structure for the NHIA MoU? Does ClearPass operate as a licensed data processor under the NHIA Act or as an independent verification service?
OQ-02
Will manual certificate review be handled by internal ClearPass staff or by outsourced reviewers? This determines the admin portal design for the review queue.
OQ-03
What is the data-sharing agreement with PenCom for the PCC API feed? Does ClearPass query PenCom directly or consume via BPP?
OQ-04
Is the USSD registration fallback in scope for MVP or Phase 2? This has significant backend implications.
OQ-05
What is the go-live target date for the MDA verification portal? This determines whether Phase 1 and Phase 2 can be compressed into a single launch.




ClearPass Product Requirements Document
Version 1.0  |  May 2026  |  Confidential
Sparkr Digitals  |  clearpass.com.ng
