# Emergency Vet Telemedicine MVP - Build Tasks

## Core Philosophy

Build a focused, elegant solution that dramatically reduces pet wait times and improves emergency care delivery. Every feature must directly serve the core mission: connecting pets with vets faster.

This is a B2B application used in pet emergency hospitals with a patient side and a doctor/admin side.

## Phase 1: Foundation (Week 1-2)

### Authentication & User Management

- [x] Set up Supabase authentication flow
- [x] Create role-based access control (Vet Tech, Remote Vet, Admin)
- [x] Build login/logout screens with clean, minimal design
- [x] Implement session management and JWT tokens
- [x] Create user profile screens for each role

### Database Schema & GraphQL

- [x] Design PostgreSQL schema for core entities (pets, owners, cases, vitals, notes)
- [ ] Set up Hasura GraphQL engine
- [ ] Create GraphQL queries and mutations for all entities
- [ ] Implement real-time subscriptions for queue updates
- [ ] Generate TypeScript types from GraphQL schema

## Phase 2: Core Intake Flow (Week 3-4)

### Pet & Owner Management

- [x] Build Pet Profile creation/edit screen
  - Species, breed, age, weight, medical history
  - Photo upload capability
  - Allergy and medication tracking
- [x] Create Owner Profile screen
  - Contact information
  - Emergency contacts
  - Pet associations
- [x] Implement search functionality for existing profiles
- [x] Build profile quick-view modal

### Vitals Capture Screen

- [x] Design intuitive vitals entry form
  - Temperature, heart rate, respiratory rate
  - Weight, mucous membrane color
  - Pain scale visualization
- [x] Add photo/video capture for visual assessment
- [x] Implement auto-save functionality
- [x] Create triage level selector (green/yellow/red)
- [x] Build presenting complaint text area with common templates

## Phase 3: Queue Management (Week 5-6)

### Queue Dashboard

- [x] Create real-time queue visualization
  - Card-based layout showing waiting patients
  - Status badges (Waiting → Ready → In Consult → Complete)
  - Time elapsed indicators
  - Triage color coding
- [x] Implement drag-and-drop case assignment
- [x] Add filtering and sorting capabilities
- [x] Build case preview on hover/click
- [x] Create notification system for new cases

### Case Assignment Logic

- [x] Implement auto-assignment algorithm
- [x] Build manual override interface
- [x] Create vet availability status system
- [x] Add case transfer functionality
- [x] Implement priority queue for red triage cases

## Phase 4: Video Consultation (Week 7-8)

### Video Call Interface

- [x] Integrate WebRTC SDK (Daily/Twilio)
- [x] Build pre-call device check screen
- [x] Create in-call UI with controls
  - Mute/unmute audio
  - Camera on/off
  - Screen sharing
  - Picture-in-picture mode
- [x] Implement connection quality indicators
- [x] Add reconnection logic for dropped calls

### Consultation Tools

- [x] Build side panel for vitals display during call
- [x] Create annotation tools for screen share
- [x] Implement file viewer for X-rays/diagnostics
- [x] Add quick notes capture during consultation
- [x] Build guided examination checklist

## Phase 5: Documentation & Files (Week 9)

### File Management

- [x] Create drag-and-drop upload interface
- [x] Build file preview system (images, PDFs, DICOM)
- [x] Implement file categorization (X-ray, ultrasound, lab results)
- [x] Add file annotation capabilities
- [x] Create secure file storage with S3

### Clinical Notes

- [x] Build SOAP notes editor
  - Subjective findings
  - Objective observations
  - Assessment
  - Plan/treatment
- [x] Implement auto-save with conflict resolution
- [x] Create note templates for common conditions
- [x] Add voice-to-text capability
- [x] Build export functionality (PDF/JSON)

## Phase 6: Integration & Polish (Week 10)

### Export & Integration

- [x] Create case summary generator
- [x] Build PDF export with branding
- [x] Implement webhook system for PIMS integration
- [x] Add email notification system
- [x] Create data export APIs

### Admin Dashboard

- [x] Build clinic performance metrics view
- [x] Create user management interface
- [x] Implement audit log viewer
- [x] Add system health monitoring
- [x] Build configuration management

## Phase 7: Testing & Launch Prep (Week 11-12)

### Quality Assurance

- [x] Implement comprehensive error handling
- [x] Add loading states and skeleton screens
- [x] Create offline functionality for critical features
- [ ] Build automated testing suite
- [ ] Perform security audit

### Launch Requirements

- [x] Create onboarding flow for new clinics
- [x] Build help documentation system
- [x] Implement feedback collection mechanism
- [x] Set up monitoring and alerting
- [x] Create training materials

## Screen Inventory

### Authentication Screens

1. Login Screen ✓
2. Role Selection Screen ✓
3. Password Reset Screen ✓

### Vet Tech Screens

1. Dashboard (Queue Overview) ✓
2. Pet Search/Create Screen ✓
3. Owner Profile Screen ✓
4. Vitals Entry Screen ✓
5. File Upload Screen ✓
6. Video Call Screen (Tech View) ✓
7. Case Summary Screen ✓

### Remote Vet Screens

1. Queue Dashboard (Vet View) ✓
2. Case Detail Screen ✓
3. Video Call Screen (Vet View) ✓
4. Notes Editor Screen ✓
5. Treatment Plan Screen ✓
6. Case History View ✓

### Admin Screens

1. User Management Screen ✓
2. Clinic Settings Screen ✓
3. Performance Analytics Dashboard ✓
4. Audit Log Screen ✓
5. System Configuration Screen ✓

### Shared Components

- Navigation Header
- Case Status Badge
- File Preview Modal
- Notification Toast
- Loading States
- Error Boundaries
- Search Interface
- Profile Quick View

## Design Principles

- **Minimal cognitive load**: Every screen should have a clear primary action
- **Speed over beauty**: Optimize for rapid task completion
- **Mobile-first tablet experience**: Primary use on clinic iPads
- **High contrast for emergency lighting**: Dark primary colors, white backgrounds
- **Progressive disclosure**: Show only what's needed when it's needed

## Success Metrics to Track

- Time from check-in to vet consultation start
- Number of cases handled per vet per shift
- Data completeness percentage
- User task completion time
- System uptime and video call quality

## Future Vision (Post-MVP)

- AI-powered triage assistance
- Automated cost estimation
- IoT device integration
- Multi-clinic enterprise features
- Pet owner mobile app
