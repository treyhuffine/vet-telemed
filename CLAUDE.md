Below is our codebase overview and product requirements:

This is a web application. Use clean, modern UI.

We will use a basic color palette - dark primary color (ie for buttons) and a white background.

This is a B2B application used in pet emergency hospitals with a patient side and a doctor/admin side.

Use pnpm for your package manager

## Stack:

- Next.js (primarily the /pages router)
- Business logic in API routes
- GraphQL via Hasura + Postgres. This is used on the client and server.
- Tailwind
- Shadcn UI
- TypeScript
- React
- Supabase for authentication
- Stripe

## Folder Structure

- `src/components` - Reusable components
- `src/components/ui` - Shadcn UI components (our base design system) - DO NOT BUILD COMPONENTS IF YOU NEED A NEW ONE, YOU SHOULD INSTALL THEM.
- `src/constants` - Where we store constant values of the app. Particularly, use `src/constants/pages` for defining URLs and paths
- `src/context` - Store React context (global state)
- `src/gql` - GraphQL queries that are used in multiple places in the app in the client
- `src/hooks` - Reusable custom hooks
- `src/layouts` - Abstraction for page layouts/templates
- `src/pages` - This is a Next.js standard that defines routes based on the folder structure
- `src/app` - This is a Next.js standard that defines routes based on the folder structure
- `src/screens` - Imported into `src/app` and `src/pages`. These wrap the actual content of the page
- `src/services` - Communicate with something external
  - Segment into `/client` and `/server`. Client is meant to run in the browser and can use browser APIs. Server is meant to run in a server context and can directly touch the database or external services. Only use private keys in a server service that runs on the server and NEVER use private keys in the browser
- `src/styles` - Abstractions for styles
- `src/types` - TypeScript files
- `src/lib` - Reusable functionality for within the application (should this be broken apart further? It can get dense.)
- `./hasurs` - Where the database schema and migrations live
- `supabase` - Supabase functions (primarily used for signup), it will call webhooks in the app (only used for auth)

Don't use getServerProps ever. Use either getStaticProps or client-side requests.

Follow our patterns for the API. Define an API using its expecting method, and then combine them withHttpMethods. Use should also use the withAuthRequired/Optional methods in the server middleware, depedning on how the function is defined (serverless, edge, rsc). Use our ressponse wrappers, ex. responseJson200Success || resposne400BadRequestError

Ex:
import { NextApiResponse } from 'next';
import { extractContentFromUrl, generateEmbedding } from '@/services/server/ai';
import { fetchAndParseContent, isValidUrl } from '@/services/server/content-fetcher';
import {
response400BadRequestError,
response500ServerError,
responseJson200Success,
} from '@/lib/server/serverless/http';
import {
NextApiRequestWithAuthRequired,
withAuthRequired,
} from '@/lib/server/serverless/middleware/withAuthRequired';
import { HttpMethods, withHttpMethods } from '@/lib/server/serverless/middleware/withHttpMethods';

const POST = async (req: NextApiRequestWithAuthRequired, res: NextApiResponse) => {
try {
const { url, type = 'url', content: manualContent } = req.body;

    if (!url && !manualContent) {
      return response400BadRequestError(res, 'URL or content is required');
    }

    let contentData;
    let extractedContent;

    if (type === 'url' && url) {
      if (!isValidUrl(url)) {
        return response400BadRequestError(res, 'Invalid URL');
      }

      // Fetch and parse the content
      contentData = await fetchAndParseContent(url);

      // Extract learning information using AI
      extractedContent = await extractContentFromUrl(url, contentData.textContent);
    } else if (manualContent) {
      // For manual content (AI discussions, etc.)
      extractedContent = await extractContentFromUrl('', manualContent);
    }

    if (!extractedContent) {
      return response400BadRequestError(res, 'Failed to extract content');
    }

    // Generate embeddings for the summary and concepts
    const summaryEmbedding = await generateEmbedding(extractedContent.summary);
    const conceptEmbeddings = await Promise.all(
      extractedContent.concepts.map(async (concept) => ({
        name: concept.name,
        embedding: await generateEmbedding(`${concept.name}: ${concept.description}`),
      })),
    );

    // TODO: Save to database using GraphQL mutation
    // For now, return the extracted content
    return responseJson200Success(res, {
      success: true,
      data: {
        ...extractedContent,
        url,
        domain: url ? new URL(url).hostname : null,
        embeddings: {
          summary: summaryEmbedding,
          concepts: conceptEmbeddings,
        },
      },
    });

} catch (error) {
console.error('Error processing resource:', error);
return response500ServerError(
res,
error instanceof Error ? error.message : 'Failed to process resource',
);
}
};

export default withHttpMethods({
[HttpMethods.Post]: withAuthRequired(POST),
});

Building a page/route and general patterns used:

- All code starts in the `src` folder
- Create a file in `pages` for a new route/page
- Create a `screens` which holds the page content and is the entry point for the page route
- Build reusable components in `components`
- Add theme variables to `tailwind.config.ts` when needed
- Favor React hooks and functional components. There likely shouldn't be any class components.
- Always use TypeScript. If the page uses data, make sure you use the automatically generated types from `src/types/generated`
- Generate types using `yarn codegen:client` and `yarn codegen:server`
- Favor statically generated pages when it makes sense for speed
- Files live where they're used. For example, tests live next to files that they're testing, and GraphQL queries live next to the page where the query is called (unless called in multiple places)
- ALWAYS use absolute imports, e.g., `@/components/Button`, not `../../components/Button`
- Make sure to set up prettier to run automatically on save in VS Code, or at minimum, run it manually when pushing code
- Only use TypeScript and make sure all type checks pass before asking for a review
- Create request and response TypeScript payload interfaces in `@/constants/payloads` so that we are type-safe between the client and server
- Use Tailwind for nearly all styles. On rare occasions for complex styles, or complex state that drives styles, you can use styled-components
- Use `@headless/react` for standard UI components that aren't HTML default (dialogues/modals, accordions, tooltips, transitions, side panels, etc.)

## Components

- If there is a component isolated to a screen, you can create a file for it inside that screen's folder and import it `./MyComponent`.
- For general components that are reusable across the app, put them in `src/components`. The folder name should be the component's name, and each folder will contain an index file and a component file. You may also need a `types.ts` file as well.
- Declare components like `export default function MyComponent(props: Props) {...`
- This is a new pattern, so not all components may have been transformed yet
- All props should be typed with an interface `Props`
- When you need default values, they should just be function arguments: `export default function MyComponent({ isVisible = true }: Props) {...`

## APIs

- Use `src/app/api` as an API gateway. All requests should flow through here.
- Prefer Vercel edge routes when possible as they're much faster. Note the restrictions, specifically they can't use Node-specific packages (a big one being Stripe)
- Next.js API routes
- For authentication in Next.js, use the middleware that wraps the route handler - `src/lib/server/middleware`
- Next/Vercel introduced Edge routes. These use a V8 engine instead of Node. They claim that it doesn't suffer from the same cold start issue and serverless functions, so it should perform faster. We should test this claim, but it seems to make sense to use these when possible. @

## Styling

- Use Tailwind as much as possible
- Put things in the Tailwind theme, so if something needs to be changed (for example, a color), it only has to be done in one place.
- We still have styled-components as a dependency, but it’s used very infrequently. I keep style-components around for styles that are driven off of complex state that is better off abstracted, but I find myself mostly reaching for the classNames from (`src/styles/utils/classNames`) helper util combined with Tailwind instead of styled-components.

# Product Requirements Document (PRD)

## Title: Emergency Vet Hybrid Telemedicine – MVP

### Document Control

- **Author:** ChatGPT Assistant
- **Stakeholders:** Product Lead, Clinical Advisor (DVM), Engineering Lead, Design Lead, Operations Manager
- **Version:** 0.1 (Draft)
- **Last Updated:** 2025‑07‑04

---

## 1. Purpose & Vision

Emergency veterinary clinics often experience bottlenecks when a veterinarian is not immediately available on‑site. This MVP introduces a **hybrid telemedicine platform** where on‑site technicians collect vitals and diagnostics, then connect the patient (and optionally the pet owner) with a **remote veterinarian via secure video**. The goal is to **reduce patient wait times, optimize doctor utilization, and improve outcomes** for companion animals in urgent situations.

## 2. Problem Statement

1. **Delays in critical triage:** Pets may wait >30 minutes before a vet can assess them, risking deterioration.
2. **Inefficient doctor coverage:** Clinics must staff expensive overnight shifts even during lulls, or remain understaffed at peak times.
3. **Fragmented records:** Vitals, images (X‑rays), and notes are often stored in disparate systems, slowing decision‑making.

## 3. Goals & Success Metrics

| Goal                               | KPI                                                                 | MVP Target   |
| ---------------------------------- | ------------------------------------------------------------------- | ------------ |
| Reduce door‑to‑vet time            | Median minutes from check‑in to live vet consult                    | **< 10 min** |
| Improve doctor coverage efficiency | # cases per remote vet per shift                                    | **≥ 15**     |
| Data completeness                  | % of cases with vitals + doc notes + attachments stored in platform | **90 %+**    |
| User satisfaction                  | CSAT from techs & vets after 4 weeks                                | **≥ 4/5**    |

## 4. Scope (MVP)

### In‑Scope

1. **Pet & Owner Profiles**
   • Basic demographics (pet: name, species, breed, age, weight; owner: name, contact)
   • Medical history summary & allergies
2. **Intake & Vitals Capture**
   • Manual entry: temp, HR, RR, weight, mucous membrane color
   • Attach notes & triage level (green, yellow, red)
3. **Queue Management Dashboard**
   • Real‑time list of waiting patients with status badges (Waiting ▸ Ready ▸ In Consult ▸ Complete)
   • Assign/auto‑assign cases to available remote vets
4. **Secure Video Consultation**
   • WebRTC‑based 1:1 HD video (clinic ↔ remote vet)
   • Screen share & zoom camera controls
5. **File & Image Uploads**
   • Drag‑and‑drop X‑ray, ultrasound, lab PDF
   • Preview inline during call
6. **Session Notes & Export**
   • Rich‑text notes linked to case
   • Export/print summary PDF or push JSON via webhook to clinic’s PIMS
7. **Roles & Permissions**
   • Vet Tech (on‑site)
   • Remote Vet (DVM)
   • Admin (clinic manager)
8. **Security & Compliance**
   • End‑to‑end encrypted video
   • SOC 2‑ready architecture & HIPAA‑like data handling

### Out‑of‑Scope (for MVP)

- Payment processing & insurance claims
- Prescription e‑Rx workflow
- IoT/Bluetooth vitals devices integration
- Multi‑clinic enterprise analytics dashboard
- AI triage or chat‑bot symptom checker

## 5. User Personas

- **Vet Technician (Anna)** – Handles intake, collects vitals, uploads diagnostics, initiates video call.
- **Remote Veterinarian (Dr. Lee)** – Logs in from home, reviews queue, consults via video, writes SOAP notes.
- **Clinic Admin (Morgan)** – Sets up staff accounts, monitors performance metrics, exports records.
- **Pet Owner (optional)** – May join video from waiting room/home for doctor explanation post‑exam.

## 6. User Flows

1. **Check‑In & Intake**
   a. Vet Tech creates/locates Pet Profile → enters presenting complaint.
   b. Records vitals, triage level, uploads quick photo.
2. **Queue & Assignment**
   a. Case appears in Queue Dashboard as _Waiting_.
   b. System auto‑routes to next available Remote Vet; status → _Ready_.
3. **Video Consultation**
   a. Vet Tech taps _Start Call_ → connects clinic exam‑room iPad to Remote Vet.
   b. Remote Vet reviews vitals, guides Tech through additional physical checks.
   c. Remote Vet dictates treatment plan; Tech records instructions.
4. **Documentation & Handoff**
   a. Remote Vet finalizes notes, uploads annotated X‑ray.
   b. Tech carries out treatment or escalates for surgery.
   c. Case marked _Complete_; summary exported.

## 7. Functional Requirements

| #    | Feature            | Description                                              | Acceptance Criteria                                 |
| ---- | ------------------ | -------------------------------------------------------- | --------------------------------------------------- |
| FR‑1 | Profile Management | Create/update pet & owner profiles                       | CRUD works; unique Pet ID generated                 |
| FR‑2 | Vitals Entry       | Form for manual vitals input                             | Saved instantly; visible to Remote Vet              |
| FR‑3 | Queue Dashboard    | Real‑time list with filters & drag‑and‑drop reassignment | Latency < 1 sec updates                             |
| FR‑4 | Video Consult      | HD video, mute/cam toggle, screen‑share                  | Connect‑time < 5 sec; disconnect < 2 % failure rate |
| FR‑5 | File Upload        | Accept PNG/JPG/PDF/DICOM ≤ 50 MB                         | Preview works; persists in case record              |
| FR‑6 | Notes Editor       | Rich‑text with autosave                                  | No data loss on refresh; exportable                 |
| FR‑7 | Audit Log          | Track all user actions per case                          | Immutable time‑stamped log available                |

## 8. Technical Requirements & Architecture

- **Frontend:** React (Next.js) + TypeScript; responsive for desktop & tablet.
- **Video:** WebRTC via commercial SDK (e.g., Daily, Twilio Live) for low‑latency and HIPAA compliance.
- **Backend:** Node.js API, PostgreSQL for relational data; S3‑compatible object storage for files.
- **Real‑time:** Supabase Realtime or WebSocket gateway for queue updates.
- **Auth & RBAC:** JWT‑based, role‑scoped policies; optional SSO for clinicians.
- **Deployment:** Vercel (frontend) + AWS Fargate / Render (API), using CI/CD.
- **Compliance:** AES‑256 at rest, TLS 1.2+, audit logging, BAA with vendors.

## 9. Dependencies & Risks

| Area       | Risk                               | Mitigation                                  |
| ---------- | ---------------------------------- | ------------------------------------------- |
| Video SDK  | Poor bandwidth at clinic           | Adaptive bitrate, pre‑call network test     |
| Regulatory | VCPR rules vary by state           | Limit remote prescribing; legal review      |
| Adoption   | Staff training & change management | Provide on‑boarding guides and support chat |

## 10. Milestones & Timeline

| Date         | Milestone                                       |
| ------------ | ----------------------------------------------- |
| **Week 0‑1** | Finalize PRD & designs                          |
| **Week 2‑4** | Build core data models, auth, profile UI        |
| **Week 5‑7** | Implement queue dashboard & real‑time backend   |
| **Week 8‑9** | Integrate video SDK & file uploads              |
| **Week 10**  | Internal alpha test; bug fix                    |
| **Week 11**  | Pilot launch at partner clinic                  |
| **Week 12**  | KPI review; decide go/no‑go for broader rollout |

## 11. Future Features & Roadmap

### AI‑Assisted Clinical Support

- **AI Case Review:** A large‑language model ingests vitals, medical history, triage notes, lab results, and imaging metadata to surface red‑flag patterns, recommend differential diagnoses, and tag urgency levels with confidence scores.
- **AI Q\&A Copilot:** Conversational agent that answers follow‑up questions from vet techs and pet owners using contextual embeddings from the active case, clinic SOPs, and peer‑reviewed veterinary references.
- **Auto‑Draft SOAP Notes:** Generates structured notes and preliminary treatment plans for veterinarian approval, reducing documentation time and standardizing record quality.

### AI‑Powered Cost Estimation

- **Dynamic Estimate Generator:** Algorithm parses diagnostic codes, procedure catalog, pharmacy formulary, and clinic pricing rules to create real‑time cost estimates, presenting low/typical/high ranges.
- **Owner‑Friendly Breakdown:** Produces plain‑language summaries with optional financing options; integrates with payment processor for deposits.
- **Continuous Learning Loop:** Model retrains on historical billing vs. actual invoice data to improve estimate accuracy and highlight variance drivers.

### Additional Roadmap Items

- Bluetooth/IoT vitals device integration (digital stethoscope, temp probe, pulse oximetry)
- Integrated payment collection & insurance claims submission
- AI triage prioritization and queue auto‑balancing
- Enterprise multi‑clinic analytics dashboard
- Mobile pet‑owner app for post‑visit follow‑ups and care compliance tracking

---

_End of Document_
