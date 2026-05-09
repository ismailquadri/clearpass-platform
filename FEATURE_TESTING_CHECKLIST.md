# ClearPass Frontend - Feature Testing Checklist

**Test Date:** May 9, 2026  
**Deployment:** https://clearpass-seven.vercel.app  
**Purpose:** Verify all buttons and features work correctly before backend development

---

## 🎯 **Testing Instructions**

1. Open https://clearpass-seven.vercel.app
2. Use the **Tweaks Panel** (bottom-right button) to switch between portals and states
3. Test each feature listed below
4. Mark ✅ if working, ❌ if broken, 🔄 if partially working

---

## 🏢 **BUSINESS PORTAL TESTS**

### **Navigation Tests**
- [ ] **Overview Dashboard** - Default view loads correctly
- [ ] **Certificates View** - Click "Certificates" in sidebar → loads certificate list
- [ ] **Verify Company** - Click "Verify Company" → loads verification form
- [ ] **Activity Log** - Click "Activity Log" → loads activity history
- [ ] **Reports** - Click "Reports" → loads reports page
- [ ] **Alerts** - Click "Alerts" → loads alerts page
- [ ] **Settings** - Click "Settings" → loads settings page
- [ ] **Back Navigation** - Clicking sidebar items returns to correct views

### **Dashboard Tests**
- [ ] **Compliance Score** - Score displays correctly (e.g., "85/100")
- [ ] **Score Color** - Score color matches state (green/amber/red)
- [ ] **Certificate Cards** - All 6 certificate cards display
- [ ] **Certificate Status** - Status badges show correct colors
- [ ] **Quick Actions** - 4 quick action buttons work:
  - [ ] Generate Report → navigates to Reports
  - [ ] Verify Company → navigates to Verify
  - [ ] Upload Certificate → navigates to Certificates
  - [ ] Contact Support → navigates to Settings

### **Certificate Management Tests**
- [ ] **View All Certificates** - Button navigates to full certificate list
- [ ] **Certificate Connect Button** - Opens upload modal
- [ ] **Certificate Card Click** - Opens detail modal
- [ ] **Copy Certificate Number** - Copies to clipboard with toast
- [ ] **Certificate Renew Button** - Opens renewal modal
- [ ] **Certificate View Button** - Opens detail modal

### **Certificate Upload Modal Tests**
- [ ] **Modal Opens** - Clicking "Connect" opens modal
- [ ] **Close Button** - X button closes modal
- [ ] **Backdrop Click** - Clicking outside closes modal
- [ ] **Three Upload Methods** - File, Manual Entry, API Connect tabs work
- [ ] **File Upload Tab**:
  - [ ] Drag & drop zone displays
  - [ ] "Choose File" button opens file picker
  - [ ] File upload shows loading spinner
  - [ ] Success toast appears after upload
  - [ ] Modal closes after successful upload
- [ ] **Manual Entry Tab**:
  - [ ] Certificate Number field accepts input
  - [ ] Issued Date field accepts input
  - [ ] Expiry Date field accepts input
  - [ ] Validation works (empty fields show error)
  - [ ] Success toast appears after submission
- [ ] **API Connect Tab**:
  - [ ] Certificate number field accepts input
  - [ ] Connect button works
  - [ ] Loading state displays
  - [ ] Success/failure toast appears
- [ ] **State-Aware Messaging** - Banner shows correct message based on dashboard state

### **Reports Page Tests**
- [ ] **Generate New Report** buttons work (2 locations)
- [ ] **Download PDF** buttons work for available reports
- [ ] **View Report** buttons work
- [ ] **Email to MDA** button works (where available)
- [ ] **Report Cards** display correctly
- [ ] **Lock Status** - Locked reports show appropriate UI
- [ ] **Toast Notifications** - All actions show toast feedback

### **Settings Page Tests**
- [ ] **Form Fields** - All input fields accept data
- [ ] **Save Button** - Shows success toast
- [ ] **Navigation** - Settings sections load correctly

---

## 🏛️ **MDA PORTAL TESTS**

### **Portal Switching**
- [ ] **Switch to MDA Portal** - Use Tweaks Panel → Select "MDA"
- [ ] **Sidebar Changes** - MDA-specific sidebar appears
- [ ] **Default View** - Verify view loads by default

### **MDA Navigation Tests**
- [ ] **Verify Vendors** - Default view loads correctly
- [ ] **Pre-Qualification** - Click "Pre-Qualification" → loads list
- [ ] **Settings** - Click "Settings" → loads settings

### **Vendor Verification Tests**
- [ ] **Quick Verify Button** - Orange button opens verification modal
- [ ] **RC Number Input** - Accepts RC number input
- [ ] **Verify Button** - Shows loading state
- [ ] **Results Display** - Shows company info after verification
- [ ] **Compliance Score** - Displays score with correct color
- [ ] **Certificate List** - Shows all 6 certificates with statuses
- [ ] **CAC Verification** - Shows verification badge
- [ ] **Download Report** - Button works and shows toast
- [ ] **Verify Another** - Resets form for new search

### **Pre-Qualification List Tests**
- [ ] **Vendor List** - Displays mock vendor data
- [ ] **Statistics Cards** - Show correct numbers
- [ ] **Filter Buttons** - Filter buttons work
- [ ] **Vendor Cards** - Display correctly
- [ ] **View Details** - Buttons work
- [ ] **Export Button** - Shows success toast

---

## 🤝 **PARTNER PORTAL TESTS**

### **Portal Switching**
- [ ] **Switch to Partner Portal** - Use Tweaks Panel → Select "Partner"
- [ ] **Sidebar Changes** - Partner-specific sidebar appears
- [ ] **Default View** - Clients view loads by default

### **Partner Navigation Tests**
- [ ] **My Clients** - Default view loads correctly
- [ ] **Analytics** - Click "Analytics" → loads analytics dashboard
- [ ] **Settings** - Click "Settings" → loads settings

### **Client Management Tests**
- [ ] **Client List** - Displays mock client data
- [ ] **Search** - Search field filters clients
- [ ] **Client Cards** - Display correctly
- [ ] **View Dashboard** - Button shows toast
- [ ] **Manage** - Button shows toast
- [ ] **Upload Certificate** - Button opens upload modal

### **Partner Upload Modal Tests**
- [ ] **3-Step Wizard** - Steps work correctly
- [ ] **Step 1 - Client Selection** - Search and select client
- [ ] **Step 2 - Certificate Type** - Select certificate type
- [ ] **Step 3 - File Upload** - Upload certificate file
- [ ] **Breadcrumb Navigation** - Can jump between steps
- [ ] **Back Button** - Step-by-step navigation works
- [ ] **Success Toast** - Shows client name and certificate type

### **Analytics Tests**
- [ ] **Dashboard Loads** - Analytics dashboard displays
- [ ] **Charts** - Charts display correctly
- [ ] **Statistics** - Numbers display correctly
- [ ] **Filters** - Filter options work

---

## 🎛️ **TWEAKS PANEL TESTS**

### **Panel Functionality**
- [ ] **Panel Opens** - Floating button opens panel
- [ ] **Panel Closes** - X button and backdrop close panel
- [ ] **Persona Switching** - Business/MDA/Partner switching works
- [ ] **State Switching** - All 6 dashboard states work:
  - [ ] Healthy
  - [ ] Attention Required
  - [ ] Critical
  - [ ] Non-Compliant
  - [ ] New Registration
  - [ ] Pending Verification
- [ ] **State Persistence** - State applies correctly when switching

### **State Testing**
- [ ] **Healthy State** - Green score, all certificates active
- [ ] **Attention Required** - Amber score, some certificates expiring
- [ ] **Critical State** - Red score, urgent action needed
- [ ] **Non-Compliant** - Red score, expired certificates
- [ ] **New Registration** - Blue banner, setup guidance
- [ ] **Pending Verification** - Yellow/amber state, awaiting review

---

## 🔔 **TOAST NOTIFICATION TESTS**

### **Toast Types**
- [ ] **Success Toasts** - Green toasts appear and auto-dismiss
- [ ] **Error Toasts** - Red toasts appear and auto-dismiss
- [ ] **Info Toasts** - Blue toasts appear and auto-dismiss
- [ ] **Toast Position** - Toasts appear in correct position
- [ ] **Toast Duration** - Toasts dismiss after appropriate time
- [ ] **Multiple Toasts** - Multiple toasts stack correctly

---

## 📱 **RESPONSIVE DESIGN TESTS**

### **Desktop (1920x1080)**
- [ ] **Layout** - Full layout displays correctly
- [ ] **Sidebar** - Sidebar displays correctly
- [ ] **Content** - Main content area displays correctly
- [ ] **Tweaks Panel** - Floating button accessible

### **Tablet (768x1024)**
- [ ] **Layout** - Layout adapts correctly
- [ ] **Sidebar** - Sidebar still accessible
- [ ] **Content** - Content displays correctly
- [ ] **Modals** - Modals fit within screen

### **Mobile (375x667)**
- [ ] **Layout** - Layout adapts for mobile
- [ ] **Sidebar** - Navigation works on mobile
- [ ] **Content** - Content displays correctly
- [ ] **Touch Targets** - Buttons are large enough for touch
- [ ] **Modals** - Modals fit on mobile screens

---

## 🐛 **KNOWN LIMITATIONS (Expected for Prototype)**

### **Non-Functional (By Design)**
- ❌ **Real File Uploads** - Files aren't actually stored (simulated)
- ❌ **Real API Connections** - Government APIs not connected (simulated)
- ❌ **Real Authentication** - No real login/signup (simulated)
- ❌ **Real Data Persistence** - Data resets on refresh (mock data)
- ❌ **Real Email/SMS** - Notifications not actually sent
- ❌ **Real PDF Generation** - Downloads are simulated

### **Functional (Should Work)**
- ✅ **All UI Interactions** - Buttons, modals, navigation should work
- ✅ **Form Validation** - Frontend validation should work
- ✅ **State Management** - Switching states/portals should work
- ✅ **Responsive Design** - Should work on different screen sizes
- ✅ **Error Handling** - Error boundaries should catch crashes
- ✅ **Loading States** - Loading spinners should display

---

## 📋 **ISSUE REPORTING**

If you find any broken features, please document:

1. **Feature Name** - What button/feature is broken?
2. **Expected Behavior** - What should happen?
3. **Actual Behavior** - What actually happens?
4. **Steps to Reproduce** - How can I reproduce the issue?
5. **Browser/Device** - What browser and device are you using?

---

## ✅ **TESTING COMPLETE**

**Test Date:** _____________  
**Tester Name:** _____________  
**Overall Status:** [ ] Ready for Backend / [ ] Needs Fixes

**Summary:**
- Total Features Tested: ___/___
- Working Features: ___/___
- Broken Features: ___/___
- Critical Issues: ___

---

**Next Steps:**
- If all tests pass: Ready for backend development handoff
- If tests fail: Report specific issues for fixes