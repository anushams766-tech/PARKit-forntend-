# PARKIT --- Project Requirements & Implementation Plan

**Version:** 1.2\
**Project type:** Hackathon MVP --- smart parking using computer vision,
a miniature model, backend services, and a web dashboard.

------------------------------------------------------------------------

## 1. Project Overview

PARKIT is a camera-based smart parking management system. A smartphone
camera continuously views a miniature parking lot. A computer-vision
application detects whether each marked parking slot is **empty**,
**occupied**, or **uncertain**. The detection results are sent to a
backend, which updates the web application so users can discover nearby
registered parking locations and view parking availability.

The application also supports parking sessions and **Stripe test-mode
payments** for demonstrating the payment flow during the hackathon.

### Core user journey

1.  An administrator registers a parking location by pasting a pinned
    Google Maps link.
2.  The system stores the location's coordinates and parking details.
3.  A camera observes the miniature parking model.
4.  The vision application detects the occupancy of each configured
    slot.
5.  The vision application sends slot status updates to the backend.
6.  A user opens PARKIT and grants browser location permission.
7.  PARKIT finds registered parking locations near the user's current
    location.
8.  The user opens a parking location, views its availability, selects a
    parking duration, and makes a simulated test payment through Stripe.
9.  The dashboard displays the payment result and transaction history.

> **Important distinction:** The miniature model is the physical
> demonstration setup. Registered real-world parking locations are the
> places users discover through the map. The team must clearly explain
> how the demo camera/model maps to the parking location shown in the
> application.

------------------------------------------------------------------------

## 2. Confirmed Scope and Constraints

### Included

-   Miniature parking-lot model with clearly marked parking slots.
-   Toy cars to represent parked vehicles.
-   Smartphone camera and stable phone mount/tripod.
-   Windows laptop running Python and OpenCV.
-   Computer-vision occupancy detection.
-   FastAPI backend (or the team's already-selected backend framework).
-   Database for users, locations, slots, sessions, payments, and
    occupancy history.
-   Web application with user and administrator dashboards.
-   Nearby parking discovery using the user's browser location.
-   Admin registration of parking locations using pinned Google Maps
    links.
-   Stripe **test mode only** for payment demonstrations.

### Explicitly excluded

-   ESP32 or other microcontrollers.
-   LEDs.
-   IR, ultrasonic, or other physical parking sensors.
-   Motors or servos.
-   Automatic gates or barriers.
-   Physical display screens.
-   Public marketing/landing page.

The application should open directly into the authentication flow or
user dashboard, depending on whether the user is signed in.

### Non-negotiable design rules

-   Do not add excluded hardware.
-   Do not trust payment amounts supplied by the frontend; calculate
    fees on the backend.
-   Do not mark a payment successful merely because the browser reaches
    a success page. Verify payment through Stripe's server-side
    event/webhook flow.
-   Do not treat a successful payment as proof that a parking slot is
    physically empty.
-   Do not automatically reserve or lock a parking slot after payment
    unless a reservation feature is explicitly added later.
-   Show uncertain camera detections as **UNCERTAIN**, rather than
    guessing.
-   Do not claim Google Maps provides live parking availability.
    PARKIT's own camera/vision pipeline and backend provide
    availability.

------------------------------------------------------------------------

## 3. System Architecture

``` text
                   ADMIN
                     |
          Pastes pinned Google Maps URL
                     |
                     v
             PARKIT WEB APP
                     |
                     v
             FASTAPI BACKEND
              /      |       \
             /       |        \
        Database  Location   Stripe
                  Search     Test Mode
                     |
                     |
USER BROWSER          |
    |                 |
    | Browser         |
    | Geolocation     |
    v                 v
 User coordinates -> Nearby registered locations
                           |
                           v
                    Parking details
                    + live availability

SMARTPHONE CAMERA
       |
       v
 Python + OpenCV / AI vision application
       |
       v
 Per-slot status + confidence + timestamp
       |
       v
 FastAPI detection ingestion endpoint
       |
       v
 Database + live dashboard updates
```

### Main modules

1.  **Physical demo setup:** miniature model, marked slots, toy cars,
    camera mount.
2.  **Computer vision:** camera capture, slot configuration,
    calibration, occupancy detection, visualizer.
3.  **Backend:** authentication, locations, slots, detection ingestion,
    sessions, payments, analytics.
4.  **Frontend:** user dashboard, nearby parking discovery, parking
    details, checkout, payment history, admin dashboard.
5.  **Integrations:** Google Maps link parsing/map display and Stripe
    test mode.

------------------------------------------------------------------------

## 4. Physical Model and Hardware Requirements

The hardware portion is intentionally simple. It demonstrates a physical
environment for the software to monitor.

### Required materials

-   A flat, rigid base for the miniature parking lot.
-   Clearly marked parking bays with unique identifiers (P1, P2, P3,
    etc.).
-   Toy cars that fit consistently inside the marked bays.
-   Smartphone with a usable camera.
-   Stable overhead phone mount or tripod.
-   Adequate, consistent lighting.
-   Windows laptop.
-   USB cable or reliable local Wi-Fi connection, depending on the
    chosen camera-stream method.

### Model design guidelines

-   Keep the camera fixed and pointed at the full parking area.
-   Avoid changing the camera angle after slot calibration.
-   Make slot boundaries high-contrast and easy to distinguish.
-   Leave enough space between adjacent toy cars.
-   Avoid reflective surfaces and harsh shadows.
-   Ensure every slot is visible and not obstructed.
-   Label every parking bay consistently.

### Hardware deliverables

-   Completed miniature parking model.
-   Stable camera mount.
-   Camera successfully connected to the laptop.
-   Top-down test image/video showing all slots.
-   Final slot layout reference image.
-   Short setup instructions describing camera placement and lighting.

------------------------------------------------------------------------

## 5. Computer Vision Implementation

### Recommended development approach

Start with OpenCV and a reliable baseline. Do not make a pretrained YOLO
model a dependency until it has been tested with the team's actual toy
cars and miniature scene. A model trained on ordinary road vehicles may
not reliably recognize small toy cars.

### Suggested project structure

``` text
vision/
├── main.py
├── camera.py
├── parking_slots.py
├── occupancy_detector.py
├── vehicle_detector.py
├── visualizer.py
├── calibration.py
├── config.json
├── parking_slots.json
├── parking_status.json
├── references/
│   └── empty_reference/
├── tests/
│   ├── test_camera.py
│   ├── test_slots.py
│   └── test_occupancy.py
├── requirements.txt
└── README.md
```

### Implementation stages

#### Stage 1 --- Project setup

-   Create a Python virtual environment.
-   Install OpenCV and NumPy.
-   Record dependencies in `requirements.txt`.
-   Create a basic camera window that displays frames.
-   Confirm that the application exits cleanly.

**Acceptance check:** The camera feed opens, displays continuously, and
closes with `Q`.

#### Stage 2 --- Camera connection

-   Begin with the laptop webcam if it is the easiest way to validate
    the pipeline.
-   Add smartphone camera streaming through a configurable HTTP/RTSP
    stream URL.
-   Keep the stream URL in `config.json`; do not hardcode it.
-   Handle connection failures and reconnect attempts.
-   Display camera connection status and FPS.

**Acceptance check:** The application can consistently display the
chosen camera feed. The team has documented how to obtain and configure
the smartphone stream URL.

#### Stage 3 --- Parking-slot configuration

-   Allow the operator to click the four corners of each parking bay.
-   Assign a unique ID to each bay (P1, P2, etc.).
-   Support undoing the last point/slot.
-   Save and load slot polygons in `parking_slots.json`.
-   Store coordinates relative to the source frame and handle resolution
    changes correctly.

**Acceptance check:** All parking-slot polygons align with the physical
bays after restarting the application.

#### Stage 4 --- Calibration and occupancy detection

-   Capture an empty reference image for each slot.
-   Compare each live slot region with its reference.
-   Use suitable image-difference, edge, texture, or other OpenCV
    features.
-   Add configurable thresholds.
-   Return one of three states:
    -   `EMPTY`
    -   `OCCUPIED`
    -   `UNCERTAIN`
-   Include a confidence score.
-   Use temporal smoothing so a single bad frame does not immediately
    change the displayed status.
-   Test shadows and moderate lighting changes.

**Acceptance check:** Repeated tests with cars entering and leaving bays
produce sensible statuses. Ambiguous results are shown as `UNCERTAIN`.

#### Stage 5 --- Visualizer

-   Draw green overlays for empty slots.
-   Draw red overlays for occupied slots.
-   Draw yellow overlays for uncertain slots.
-   Show slot IDs and confidence scores.
-   Show total, available, occupied, and uncertain counts.
-   Show occupancy percentage and FPS.
-   Support:
    -   `Q`: quit
    -   `R`: recalibrate
    -   `S`: save screenshot
    -   `P`: pause/resume

**Acceptance check:** The visualizer clearly communicates each slot's
status and the total parking availability.

#### Stage 6 --- Optional AI/YOLO evaluation

-   Evaluate a lightweight pretrained model only after the OpenCV
    baseline works.
-   Test whether it recognizes the actual miniature toy cars.
-   If it works, map detected vehicles to configured parking polygons.
-   Consider combining object detection with the OpenCV slot comparison.
-   Keep the OpenCV fallback available.
-   Do not claim AI accuracy without testing it on the miniature setup.

**Acceptance check:** The team can demonstrate whether the optional
model improves detection. If not, the working OpenCV method remains the
MVP.

#### Stage 7 --- Stabilization and backend output

-   Test all slots, multiple cars, cars entering/leaving, lighting
    changes, and camera disconnection.
-   Ensure the app does not crash on a temporary camera failure.
-   Write a structured status file or send the same data to the backend.

Example `parking_status.json`:

``` json
{
  "camera_id": "CAM-01",
  "timestamp": "2026-11-06T12:00:00Z",
  "total_slots": 6,
  "available_slots": 3,
  "occupied_slots": 2,
  "uncertain_slots": 1,
  "occupancy_percentage": 33.33,
  "slots": [
    {
      "slot_id": "P1",
      "status": "EMPTY",
      "confidence": 0.97
    },
    {
      "slot_id": "P2",
      "status": "OCCUPIED",
      "confidence": 0.91
    }
  ]
}
```

**Acceptance check:** The vision application produces valid,
timestamped, per-slot status updates that the backend can consume.

------------------------------------------------------------------------

## 6. Google Maps Location Discovery

### Goal

Users should be able to discover PARKIT parking locations near their
current location. Administrators should be able to register a parking
location by pasting a pinned Google Maps link.

### Admin flow --- register a location

1.  Admin opens Google Maps.
2.  Admin finds the parking facility and drops/selects a pin.
3.  Admin copies the Google Maps share link.
4.  Admin pastes the link into the PARKIT admin dashboard.
5.  Backend validates the link and extracts or resolves the location
    coordinates.
6.  Admin confirms the displayed place/location details.
7.  Admin enters any PARKIT-specific information, such as display
    name, capacity, and associated camera.
8.  Backend stores the registered location.

### User flow --- discover nearby locations

1.  User opens the PARKIT dashboard.
2.  Browser requests permission to access the user's location.
3.  If permission is granted, the browser returns latitude and
    longitude.
4.  Frontend sends coordinates and a search radius to the backend.
5.  Backend searches registered PARKIT locations within that radius.
6.  Frontend displays nearby locations on a map and in a list.
7.  Each result shows available, occupied, and uncertain spaces, where
    data is available.
8.  User opens a location to view its details and live availability.

### Suggested endpoints

``` http
POST /api/locations/from-map-link
GET  /api/locations/nearby?lat={latitude}&lng={longitude}&radius={meters}
GET  /api/locations/{location_id}
GET  /api/locations/{location_id}/status
```

### Location data model

At minimum, store:

-   `id`
-   `name`
-   `address` (if available)
-   `latitude`
-   `longitude`
-   `google_maps_url`
-   `total_slots`
-   `camera_id` (if applicable)
-   `created_at`
-   `updated_at`
-   `is_active`

### Important implementation notes

-   Google Maps share links have multiple formats. Do not assume every
    link directly contains coordinates.
-   Validate accepted URL formats and handle redirects/short links
    safely.
-   If a link cannot be resolved reliably, ask the admin to confirm the
    location on a map or enter coordinates manually.
-   Do not blindly fetch arbitrary URLs from the backend. Restrict
    accepted hosts and protect against server-side request forgery
    (SSRF).
-   Google Maps Platform APIs may require an API key, billing setup, and
    enabled APIs. Keep API keys out of source control and restrict
    browser keys by allowed referrers and API permissions.
-   Use Google Maps for map display and location context, not as the
    source of PARKIT occupancy data.
-   Nearby search should query PARKIT's own registered locations, not
    imply that every public parking facility on Google Maps is
    integrated with PARKIT.
-   Provide a manual location-selection fallback if the user denies
    browser location permission.

### Nearby search logic

The backend should calculate the distance between the user's coordinates
and each registered parking location, filter by the selected radius, and
return the nearest results first. A geospatial database feature or a
Haversine-distance calculation can be used for the MVP.

------------------------------------------------------------------------

## 7. Frontend Requirements

There is **no public landing page** in this version.

### Screen 1 --- Authentication

-   Login.
-   Registration.
-   Logout.
-   Protected user and admin routes.
-   Clear loading and error states.

### Screen 2 --- User dashboard

Display:

-   Nearby registered parking locations.
-   Available parking spaces.
-   Occupied and uncertain spaces where relevant.
-   Active parking session, if any.
-   Parking duration.
-   Estimated parking charges.
-   Payment status.
-   Recent transactions.
-   Parking history.
-   Quick action to find parking.

### Screen 3 --- Parking discovery

-   Map showing nearby registered PARKIT locations.
-   List of nearby locations.
-   Distance from user.
-   Available/occupied counts.
-   Last-updated time or camera status.
-   Manual search/location fallback if geolocation is unavailable.

### Screen 4 --- Parking details and live availability

-   Parking location name and address.
-   Map position.
-   Total capacity.
-   Live slot layout or slot list.
-   Empty, occupied, and uncertain states.
-   Camera/last-update status.
-   Parking pricing and session options.

### Screen 5 --- Checkout

-   Selected location.
-   Selected duration or session option.
-   Backend-calculated price.
-   Payment action using Stripe test mode.
-   Pending, success, failure, and retry states.

### Screen 6 --- Payment history

-   Transaction list.
-   Amount and currency.
-   Payment status.
-   Date/time.
-   Parking location/session reference.
-   Receipt or transaction details.

### Screen 7 --- Admin dashboard

-   Add a parking location using a Google Maps pinned link.
-   Confirm/edit location details.
-   Manage parking slots and capacity.
-   Associate camera/vision feed with a location.
-   View live occupancy.
-   View camera health and last update.
-   Manually override a slot status when authorized, with an audit
    record.
-   View users, parking sessions, and test transactions as appropriate.

### UI behavior

-   Make the distinction between `EMPTY`, `OCCUPIED`, and `UNCERTAIN`
    obvious.
-   Always show when availability was last updated.
-   Show useful empty, loading, permission-denied, and error states.
-   Do not display stale availability as if it were live.

------------------------------------------------------------------------

## 8. Backend Requirements

FastAPI is a suitable choice for the Python-based MVP.

### Main responsibilities

-   Authentication and authorization.
-   User and administrator management.
-   Parking location registration and nearby search.
-   Parking-slot management.
-   Camera/vision data ingestion.
-   Current occupancy status.
-   Occupancy history and analytics.
-   Parking sessions and pricing.
-   Stripe test-mode payment creation and verification.
-   Payment history.
-   Camera health and error logging.
-   Live updates to connected dashboards (WebSockets or polling).

### Suggested API endpoints

#### Locations

``` http
GET    /api/locations
POST   /api/locations
POST   /api/locations/from-map-link
GET    /api/locations/nearby?lat={lat}&lng={lng}&radius={meters}
GET    /api/locations/{location_id}
PUT    /api/locations/{location_id}
DELETE /api/locations/{location_id}
GET    /api/locations/{location_id}/slots
POST   /api/locations/{location_id}/slots
GET    /api/locations/{location_id}/status
GET    /api/locations/{location_id}/analytics
```

#### Slots

``` http
GET    /api/slots/{slot_id}
PUT    /api/slots/{slot_id}
POST   /api/slots/{slot_id}/override
```

#### Vision/camera

``` http
POST   /api/detections
GET    /api/system/health
POST   /api/cameras/{camera_id}/recalibrate
```

#### Payments and sessions

``` http
POST   /api/payments/create-checkout-session
POST   /api/payments/webhook
GET    /api/payments
GET    /api/payments/{payment_id}
GET    /api/payments/{payment_id}/status
GET    /api/users/me/payments
```

The exact payment endpoints depend on whether the implementation uses
Stripe Checkout Sessions or PaymentIntents. Keep the API consistent with
the chosen Stripe flow.

#### Live updates

``` text
/ws/parking/{location_id}
```

Use WebSockets if time permits. Short-interval polling is an acceptable
hackathon fallback.

### Detection ingestion payload

Example:

``` json
{
  "camera_id": "CAM-01",
  "location_id": "LOC-01",
  "timestamp": "2026-11-06T12:00:00Z",
  "slots": [
    {
      "slot_id": "P1",
      "status": "EMPTY",
      "confidence": 0.97
    },
    {
      "slot_id": "P2",
      "status": "OCCUPIED",
      "confidence": 0.91
    }
  ]
}
```

The backend should validate that the camera, location, and slot IDs are
known and that confidence values and statuses are valid. Store a history
record and update the current status.

------------------------------------------------------------------------

## 9. Database Design

PostgreSQL is recommended if the team is comfortable with it. SQLite is
acceptable for a small local MVP.

Suggested tables:

### `users`

-   `id`
-   `name`
-   `email`
-   `password_hash` or external auth identifier
-   `role`
-   `created_at`

### `parking_locations`

-   `id`
-   `name`
-   `address`
-   `latitude`
-   `longitude`
-   `google_maps_url`
-   `total_slots`
-   `is_active`
-   `created_at`

### `parking_slots`

-   `id`
-   `location_id`
-   `slot_code`
-   `current_status`
-   `confidence`
-   `last_updated_at`
-   `manual_override_status` (nullable)

### `cameras`

-   `id`
-   `location_id`
-   `name`
-   `connection_status`
-   `last_seen_at`

### `occupancy_history`

-   `id`
-   `slot_id`
-   `status`
-   `confidence`
-   `detected_at`
-   `source`

### `detection_logs`

-   `id`
-   `camera_id`
-   `location_id`
-   `payload`
-   `received_at`
-   `processing_status`

### `parking_sessions`

-   `id`
-   `user_id`
-   `location_id`
-   `slot_id` (nullable unless a slot is explicitly assigned)
-   `started_at`
-   `ended_at`
-   `duration`
-   `amount_due`
-   `status`

### `payments`

-   `id`
-   `user_id`
-   `parking_session_id`
-   `stripe_session_id` or `stripe_payment_intent_id`
-   `amount`
-   `currency`
-   `status`
-   `created_at`
-   `updated_at`

### `payment_events`

-   `id`
-   `payment_id`
-   `stripe_event_id`
-   `event_type`
-   `received_at`
-   `processed_at`

### `manual_overrides`

-   `id`
-   `slot_id`
-   `admin_user_id`
-   `old_status`
-   `new_status`
-   `reason`
-   `created_at`

Use foreign keys, indexes, and uniqueness constraints where appropriate.
In particular, store Stripe event IDs uniquely to help prevent duplicate
webhook processing.

------------------------------------------------------------------------

## 10. Stripe Test-Mode Payments

### Goal

Demonstrate the complete parking-payment experience without charging
real money.

### Payment journey

1.  User signs in.
2.  User selects a PARKIT location.
3.  User selects a duration/session option.
4.  Backend calculates the price using trusted server-side pricing
    rules.
5.  Frontend asks backend to create a Stripe test-mode checkout/payment
    flow.
6.  User completes the payment using Stripe test details.
7.  Stripe sends a signed event to the backend webhook.
8.  Backend verifies the signature and processes the event idempotently.
9.  Backend updates the payment record.
10. User dashboard displays the confirmed payment status and
    transaction.

### Payment requirements

-   Test keys only.
-   Secret key stored only on the backend in environment variables.
-   Never commit `.env` or secrets to GitHub.
-   Backend calculates the amount; never trust a frontend-supplied
    amount.
-   Verify webhook signatures.
-   Handle duplicate webhook events safely.
-   Support pending, succeeded, failed, and refunded states where
    applicable.
-   Show transaction history.
-   Provide a retry path for failed payments.
-   Do not store card numbers or CVC values in PARKIT.

### Stripe integration choice

For a hackathon MVP, Stripe-hosted Checkout is often the simplest
integration to demonstrate. Confirm that the selected Stripe account and
India-specific requirements support the intended flow before
implementation. If the account requires a PaymentIntents/PaymentMethods
flow, follow Stripe's current India guidance and implement the required
authentication/3DS behavior.

### Stripe test cards

Use Stripe's official test-card documentation for the current set of
test scenarios. Common examples include:

  Scenario                  Test card
  ------------------------- -----------------------
  Successful payment        `4242 4242 4242 4242`
  Authentication/3DS test   `4000 0025 0000 3155`
  Declined payment          `4000 0000 0000 0002`

Use a future expiry date and any test CVC/ZIP values accepted by
Stripe's test environment. These are test details only; do not use real
card information.

Official documentation: https://docs.stripe.com/testing

### Critical separation of responsibilities

-   **Camera/vision system:** source of truth for physical occupancy.
-   **Stripe:** source of truth for payment status.
-   **Backend:** coordinates records and presents the combined
    application state.

A successful payment does not prove that a slot is empty, and a camera
detection does not prove that a user has paid. Payment does not reserve
or lock a slot in this MVP.

------------------------------------------------------------------------

## 11. Security, Reliability, and Quality Requirements

-   Protect admin endpoints with role-based authorization.
-   Validate all incoming API data.
-   Hash passwords using a suitable password-hashing algorithm if
    managing passwords directly.
-   Store secrets in environment variables.
-   Keep Stripe secret keys on the backend only.
-   Verify Stripe webhook signatures.
-   Make payment webhook processing idempotent.
-   Validate Google Maps URLs and restrict backend URL resolution to
    trusted hosts.
-   Use HTTPS for deployed services.
-   Ask permission before using browser geolocation.
-   Provide a manual location fallback.
-   Do not expose unnecessary user location data.
-   Handle camera disconnections gracefully.
-   Mark camera data stale when updates stop arriving.
-   Show `UNCERTAIN` for ambiguous detections.
-   Log detection and payment errors without logging secrets or
    sensitive payment data.

------------------------------------------------------------------------

## 12. Suggested Team Split --- 4 Members

  -----------------------------------------------------------------------
  Member                  Ownership               Main deliverables
  ----------------------- ----------------------- -----------------------
  1 --- Hardware/model    Miniature lot and       Physical model, marked
                          camera setup            slots, camera mount,
                                                  stable camera feed

  2 --- Vision/AI         Python and OpenCV       Camera capture, slot
                                                  polygons, calibration,
                                                  occupancy status,
                                                  JSON/API output

  3 --- Backend           API and database        Authentication,
                                                  locations, nearby
                                                  search, detection
                                                  ingestion, sessions,
                                                  Stripe webhook

  4 --- Frontend          Web dashboard and       User dashboard, map
                          integration             discovery, parking
                                                  details, checkout,
                                                  payment history, admin
                                                  UI
  -----------------------------------------------------------------------

### Integration rules

-   Agree on API contracts and JSON schemas before parallel
    implementation.
-   Use consistent IDs across the vision module, backend, and frontend.
-   Keep the vision module independently runnable.
-   Keep Stripe integration in a separate backend module.
-   Integrate early using sample detection data before the physical
    camera pipeline is complete.
-   Use Git branches and small, reviewable commits.
-   Assign one person to own final integration and demo readiness.

------------------------------------------------------------------------

## 13. Recommended Implementation Order

Do not build every feature at once. Get one end-to-end path working,
then expand.

### Phase 1 --- Physical and camera foundation

-   Build and label the miniature parking lot.
-   Fix the smartphone camera position.
-   Confirm a stable camera feed.
-   Capture an empty reference image.

**Milestone:** Laptop can reliably view the complete miniature lot.

### Phase 2 --- Vision MVP

-   Configure slot polygons.
-   Calibrate empty slots.
-   Detect empty/occupied/uncertain.
-   Display overlays and counts.
-   Export timestamped status data.

**Milestone:** Moving a toy car into or out of a bay changes its
displayed status.

### Phase 3 --- Backend foundation

-   Create database models.
-   Implement location and slot APIs.
-   Implement detection ingestion.
-   Store current status and history.
-   Test using sample JSON before connecting the camera.

**Milestone:** Backend accepts detection data and returns the latest
parking status.

### Phase 4 --- Frontend dashboard

-   Build authentication.
-   Build user dashboard.
-   Build parking details and slot availability.
-   Build admin location and slot management.
-   Connect the dashboard to backend data.

**Milestone:** A user can see the same parking status generated by the
vision module.

### Phase 5 --- Google Maps discovery

-   Implement admin Google Maps link registration.
-   Validate and confirm extracted coordinates.
-   Implement browser geolocation permission.
-   Implement nearby registered-location search.
-   Display results on a map and in a list.
-   Add manual fallback.

**Milestone:** Admin can register a location from a pinned link, and a
user can find it through nearby search.

### Phase 6 --- Stripe test payments

-   Configure Stripe test credentials.
-   Implement backend payment creation.
-   Implement checkout UI.
-   Implement signed webhook verification.
-   Update payment records and dashboard history.
-   Test success, authentication, and failure scenarios.

**Milestone:** User completes a test payment and sees the verified
result in PARKIT.

### Phase 7 --- Integration and demo hardening

-   Test the full journey.
-   Fix stale status and error handling.
-   Verify permissions and admin restrictions.
-   Prepare demo data and test accounts.
-   Rehearse the presentation and fallback plan.

**Milestone:** The team can demonstrate the complete user journey
without manual database edits.

------------------------------------------------------------------------

## 14. MVP Acceptance Checklist

### Physical and vision

-   [ ] Miniature parking model is complete and stable.
-   [ ] Parking bays are clearly marked and uniquely identified.
-   [ ] Smartphone camera is fixed and connected.
-   [ ] All bays are visible in the camera frame.
-   [ ] Slot polygons can be configured and saved.
-   [ ] Empty reference calibration works.
-   [ ] Empty, occupied, and uncertain states are supported.
-   [ ] Visualizer displays slot statuses and availability counts.
-   [ ] Status output includes timestamp and confidence.
-   [ ] Camera failure does not crash the entire system.

### Backend

-   [ ] Database starts and migrations/schema are ready.
-   [ ] Locations can be created and retrieved.
-   [ ] Nearby-location endpoint returns registered locations.
-   [ ] Slots can be listed and managed.
-   [ ] Vision data can be ingested and validated.
-   [ ] Current status and history are stored.
-   [ ] Stale camera data is identified.
-   [ ] Admin-only operations are protected.

### Google Maps and location

-   [ ] Admin can paste a supported Google Maps pinned link.
-   [ ] Link is validated and coordinates are confirmed before saving.
-   [ ] Location details are stored.
-   [ ] Browser requests user location permission.
-   [ ] Nearby search uses the user's coordinates.
-   [ ] Nearby results are sorted by distance.
-   [ ] Map/list displays PARKIT availability.
-   [ ] Denied location permission has a manual fallback.

### Frontend

-   [ ] No public landing page is present.
-   [ ] Authentication works.
-   [ ] User dashboard displays parking information.
-   [ ] Parking details show slot statuses.
-   [ ] Last-updated/camera status is visible.
-   [ ] Admin dashboard can manage locations and slots.
-   [ ] Loading, empty, and error states are handled.

### Payments

-   [ ] Stripe test mode is configured.
-   [ ] Backend calculates the payment amount.
-   [ ] Checkout works with Stripe test details.
-   [ ] Webhook signature is verified.
-   [ ] Duplicate events do not create duplicate payment updates.
-   [ ] Success and failure states appear in the dashboard.
-   [ ] Transaction history is visible.
-   [ ] No live charges or real card data are used.

### End-to-end demo

-   [ ] Admin registers a parking location.
-   [ ] Camera detects a toy car entering/leaving a bay.
-   [ ] Backend receives and stores the detection.
-   [ ] User finds the registered location through nearby search.
-   [ ] User views updated parking availability.
-   [ ] User completes a Stripe test payment.
-   [ ] Dashboard displays the verified transaction.
-   [ ] Team can explain that occupancy and payment are separate
    systems.

------------------------------------------------------------------------

## 15. Hackathon Demo Script

1.  **Show the physical model:** Explain that the smartphone camera
    monitors the miniature parking lot.
2.  **Show live detection:** Move a toy car into a slot and show the
    vision application changing the slot to occupied.
3.  **Show backend integration:** Show the updated status in the
    backend/dashboard.
4.  **Show admin location registration:** Paste a pinned Google Maps
    link and confirm the saved location.
5.  **Show user discovery:** Grant location permission and find the
    registered parking location nearby.
6.  **Show parking availability:** Open the location and inspect its
    slot statuses.
7.  **Show payment:** Select a session option and complete a Stripe
    test-mode payment.
8.  **Show transaction history:** Demonstrate the verified test payment
    in the user dashboard.
9.  **Explain the architecture:** Camera determines occupancy; Stripe
    determines payment status; backend connects the two.

Be transparent that the physical model is a miniature proof of concept
and that the nearby-location list contains locations registered in
PARKIT, not every parking facility on Google Maps.

------------------------------------------------------------------------

## 16. Scope Boundaries and Future Enhancements

These are not required for the MVP:

-   Actual parking reservations or slot locking.
-   Live deployment across multiple real parking facilities.
-   Multiple cameras per location.
-   Predictive parking availability.
-   Advanced YOLO/custom model training.
-   Push notifications.
-   Advanced analytics.
-   Live Stripe payments.
-   Physical sensors, gates, LEDs, or microcontrollers.

Only consider these after the core camera-to-dashboard flow works.

------------------------------------------------------------------------

## 17. Key Technical References

-   Stripe testing: https://docs.stripe.com/testing
-   Stripe Checkout: https://docs.stripe.com/checkout
-   Stripe webhooks: https://docs.stripe.com/webhooks
-   Google Maps Platform documentation:
    https://developers.google.com/maps/documentation
-   Browser Geolocation API:
    https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
-   OpenCV documentation: https://docs.opencv.org/

------------------------------------------------------------------------

## Final Project Definition

**PARKIT is a smart parking prototype that uses a smartphone camera
and computer vision to monitor parking-slot occupancy, a backend to
manage parking data, Google Maps-based location registration and nearby
discovery, and a web dashboard with Stripe test-mode payments.**

The MVP is complete when a toy car's movement is reflected in the live
parking status, a user can discover a registered location using their
current location, and the user can complete a test payment whose
verified status appears in their dashboard.
