# Digital Medical Records (DMR) Simulation System — User Manual

This manual helps end-users (students, instructors, and admins) operate the DMR simulation system. It explains how to log in, navigate role-based dashboards, complete common tasks, and troubleshoot issues. For system setup by developers, see README.md instead.

- Audience: end users of the web app (no coding required)
- Platforms: modern desktop browsers (Chrome, Edge, Safari)
- Backend service required: Django REST API (provided by your institution)

## Table of Contents

- Getting Started
  - Access and Login
  - Role-based Homepages
  - Interface Basics
- Students
  - Select a Patient
  - Overview
  - Record Observations
  - Clinical Notes (SOAP)
  - Investigation Requests (Blood Tests, Imaging)
  - Medication Orders
  - Discharge Summary
  - Viewing Approved Files
- Instructors
  - Select a Patient
  - Overview
  - Manage Patient Files (Upload, Preview, Delete)
  - Review and Complete Requests (approve files + page ranges)
- Admins
  - Using Django Admin (backend)
- Tips and Troubleshooting

---

## Getting Started

### Access and Login

1. Open the application URL provided by your program coordinator.
2. On the landing page, enter your Username and Password.
3. Select “Sign In”.
4. You’ll be redirected to your role-based dashboard automatically:

- Admin → Django Admin (backend) — typically available at your backend’s /admin URL
- Instructor → /instructor
- Student → /student

Notes

- Student accounts use a “shared group account” model. All members of the group log in with the same credentials and share the same records and requests.
- If login fails, you’ll see a “Login Failed” toast message; recheck credentials or contact your instructor.

### Role-based Homepages

- Student Dashboard: patient list + tabs for Overview, Observations, SOAP Notes, Investigation Requests, Medication Orders, and Discharge Summary.
- Instructor Dashboard: patient list + tabs for Overview, File Management, and Lab Requests.
- Admin: Administration is performed in the Django Admin (backend), not in this web app. Ask your coordinator for the backend admin URL (commonly your API domain with "/admin").

### Interface Basics

- Patient List (left sidebar): choose a patient. The app remembers the last selected patient and tab for convenience.
- Top Navigation: shows your role and provides quick access to dashboards.
- Tabs: switch between feature areas within a patient.
- Toasts: appear at the bottom-right for success/errors.

---

## Students

### Select a Patient

- Use the left “Patient List” to select a patient. The current patient appears in the header area with demographic details.

### Overview

- Student Patient Overview displays a summary of the selected patient’s information. Use this as a quick reference before performing actions.

### Record Observations

- Go to Observations tab.
- Two sub-tabs:
  - Current Observations: view latest vitals and historical trends.
  - Add Observations: enter new vitals and submit.
- After saving, your entries are associated with your group account.

Tips

- Ensure values are realistic and complete; the backend may validate ranges.

### Clinical Notes (SOAP)

- Go to SOAP Notes tab.
- Two sub-tabs:
  - View Notes: lists all notes with timestamps.
  - Create Note: write clinical notes; a free-form text area supports SOAP structure.
- Sign-off: enter your own Name and Role before saving (because the system uses a shared group account, sign-off tracks the individual author).
- Click Save Note. A success toast confirms it.

Validation

- Content, Name, and Role are required. You’ll see a validation error if fields are empty.

### Investigation Requests (Blood Tests, Imaging)

- Go to Investigation Requests tab.
- Select Blood Tests or Imaging.
- Each section has “View Requests” and “Create Request”.
- Create Request:
  - Fill in test type and details.
  - Submit; the request status starts as “pending”.
- Instructors will review and may attach “approved files” when marking completed.

Viewing Requests

- Use the lists to track your requests and statuses. For completed requests with approved files, you’ll see links or previews depending on access.

### Medication Orders

- Go to Medication Orders tab.
- “View Orders” shows existing orders.
- “Create Order” enables you to place a new medication order.

### Discharge Summary

- Go to Discharge Summary tab to prepare a patient discharge summary following your simulation’s requirements.

### Viewing Approved Files (access control)

Students can only access files when all are true:

1) An Approved File record exists that links a file to your specific request
2) A page range is defined (for paginated PDFs)
3) The request status is “completed”

How it works

- After your request is marked completed, instructors might grant access to specific files and pages. You can then preview allowed pages via the file preview dialog.
- If you cannot see an expected file, ask your instructor to check approved files and page ranges for your request.

---

## Instructors

### Select a Patient (Instructor)

- Use the left “Patient List” to choose a patient. Patient info displays in the header.

### Overview (Instructor)

- Instructor overview shows patient information and may include extended controls (read-only/summary views of student data).

### Manage Patient Files (Upload, Preview, Delete)

- Go to File Management tab.
- Upload File:
  - Select File (PDF, images, documents)
  - Choose Category (Admission, Pathology, Imaging, Diagnostics, Lab Results, Other)
  - Optionally tick “Requires page-based access control” for PDFs where you intend to grant page-restricted student access later
  - Upload File → success toast appears; file shows in the list
- Preview:
  - Click “View” to open the preview dialog
  - If pagination is required, you’ll be prompted to input a page range before fetching
- Delete:
  - Click the trash icon, confirm deletion

Notes

- “Admission” files are visible to all student groups by default.
- Other categories require explicit approvals tied to a completed request.

### Review and Complete Requests (approve files + page ranges)

- Go to Lab Requests tab.
- Two lists: Blood Tests and Imaging Requests with pagination.
- For each pending request:
  - Click “Approve Request”
  - In the dialog, select one or more patient files to approve; for paginated PDFs, enter page ranges (e.g., 1-3 or 1,3,5)
  - Approve & Complete: the request status becomes completed, and students in that group can access only approved files/pages
- You can preview approved files from the request card using “Preview”.

Tips

- Define precise page ranges to limit student access appropriately.
- If a patient has no files, upload first from File Management.

---

## Admins

Administration for Admin users is handled via the Django Admin (backend), not within this web application.

- Access: Use the backend admin URL provided by your coordinator (`/admin/` on the API domain).
- Capabilities: Manage users and roles, review data, and perform other system administration tasks as configured by your institution.
- Support: If you need access or additional capabilities, contact the system administrator.

---

## Tips and Troubleshooting

- I can’t log in
  - Verify username/password; ensure correct role/account
  - If still failing, contact your instructor or admin

- I can’t see a patient
  - Your cohort might be restricted; refresh and confirm with staff

- My request is pending
  - Instructors must review and complete it; ask them to approve

- I can’t open a file or some pages are missing
  - Student access depends on Approved Files + page ranges + completed request
  - Ask instructors to verify approved files for your request

- Forms won’t submit
  - Check required fields; errors appear as toasts or inline messages

- Navigation feels stuck on a previous tab/patient
  - The app remembers your last selection; switch patients/tabs or clear browser storage if needed

- Supported browsers
  - Use recent versions of Chrome/Edge/Safari. If embedded PDF preview fails, download the file or try another browser.

---

## Privacy and Safety

- This is a simulation system with synthetic data for teaching only.
- Do not enter real patient data unless your program explicitly instructs you.
- Follow your institution’s guidelines for account sharing and usage.
