# Emergency Vet Telemedicine - Demo Script

## Overview
This demo showcases a hybrid telemedicine platform where on-site technicians collect vitals and connect patients with remote veterinarians via secure video consultation.

## Setup Instructions

### 1. Start the Application
```bash
pnpm install
pnpm run dev
```
Open http://localhost:3000 in two browser windows (or two different browsers/computers).

### 2. Demo Accounts
The application includes pre-configured demo accounts. On the login screen, use the "Quick Access" buttons to instantly log in as different user types:

- **Vet Tech (Sarah)**: On-site technician who handles intake
- **Veterinarian (Dr. Johnson)**: Remote vet who conducts consultations
- **Admin (Dr. Chen)**: Clinic administrator

## Demo Flow

### Part 1: Patient Check-In (Vet Tech - Window 1)

1. **Login as Vet Tech**
   - Click "Vet Tech (Sarah)" quick login button
   - You'll see the Emergency Queue dashboard

2. **Create New Patient**
   - Click "New Patient" button
   - Search by phone: (555) 123-4567 (or skip search)
   - Fill owner info:
     - First Name: Jane
     - Last Name: Smith
     - Phone: (555) 123-4567
     - Email: jane.smith@example.com
   - Fill pet info:
     - Name: Max
     - Species: Dog
     - Breed: Golden Retriever
     - Age: 5 years
     - Weight: 30 kg

3. **Capture Vitals**
   - Temperature: 103.2°F (will show as "High")
   - Heart Rate: Click "Count" button or enter 120 bpm
   - Respiratory Rate: 30 rpm
   - Select Triage Level: Yellow - Urgent
   - Presenting Complaint: "Vomiting and lethargy for 2 days"
   - Click "Add to Queue"

### Part 2: Remote Consultation (Veterinarian - Window 2)

1. **Login as Veterinarian**
   - In the second window, click "Veterinarian (Dr. Johnson)"
   - You'll see the Veterinarian Dashboard with the new case

2. **Start Consultation**
   - The case will appear as "Next Case" with Yellow priority
   - Click "Start Consultation"
   - The simulated video call will begin

3. **During the Call**
   - Review vitals in the overlay panel
   - Add quick notes: "Patient appears dehydrated"
   - Check examination items in the "Exam" tab
   - Click "Complete Consultation" when ready

4. **Document SOAP Notes**
   - Subjective: Pre-filled with owner's complaint
   - Objective: Pre-filled with vitals, add exam findings
   - Assessment: "Likely gastroenteritis, moderate dehydration"
   - Plan: "IV fluids, anti-emetic injection, bland diet"
   - Click "Save & Complete"

### Part 3: Real-Time Updates

Both windows will show real-time updates:
- Tech sees case status change to "In Consult"
- Queue updates automatically
- Video participants appear in both windows

### Part 4: Admin Overview (Optional)

1. **Login as Admin**
   - Use "Admin (Dr. Chen)" quick login
   - View clinic metrics and staff availability
   - Access "Demo Controls" to:
     - View this demo script
     - Reset all demo data

## Key Features to Highlight

### For Vet Techs
- Fast patient intake with auto-save
- Visual triage indicators (Red/Yellow/Green)
- Real-time queue updates
- Vitals validation with normal range indicators

### For Veterinarians
- Prioritized queue with wait times
- One-click video consultation
- Integrated patient history and vitals
- Structured SOAP note documentation

### For Administrators
- Live clinic metrics
- Staff availability tracking
- Performance analytics
- System health monitoring

## Demo Tips

1. **Multiple Windows**: Keep both windows visible to show real-time synchronization
2. **BroadcastChannel**: Data syncs between tabs/windows automatically
3. **No External APIs**: Everything runs locally - no Supabase or GraphQL needed
4. **Responsive Design**: Try resizing windows to show mobile/tablet views
5. **Error Handling**: Try invalid inputs to show validation

## Troubleshooting

- **Can't see updates?**: Make sure both windows are using the same browser
- **Video not showing?**: The video is simulated - it shows placeholder content
- **Lost data?**: Admin users can reset demo data from their dashboard

## Next Steps

After the demo, discuss:
- Integration with existing PIMS systems
- Customization for specific clinic workflows
- Training requirements for staff
- Deployment and security considerations