# Online Course Platform — Phase-wise Build Plan (for AI-assisted development)

Purpose: hand this document to an AI coding assistant (Claude Code, Cursor, etc.) one phase at a time. Each phase is self-contained: goal, prerequisites, tasks, files touched, and a ready-to-use prompt. Do not start a phase until the previous one is tested and working.

---

## Phase 0 — Project Setup

**Goal**: empty but running backend + frontend skeleton, connected to the database.

**Tasks**
- Init `server/` (Express) and `client/` (Vite + React).
- Install backend deps: `express mongoose bcryptjs jsonwebtoken dotenv cors`.
- Install frontend deps: `axios react-router-dom` (+ Tailwind if using it).
- Create `server/.env` with `MONGO_URI`, `JWT_SECRET`, `PORT`.
- Connect to MongoDB Atlas; confirm connection log on server start.
- Set up folder structure: `models/ controllers/ routes/ middleware/ config/`.
- Set up `client/src/{pages,components,services,context}`.

**Deliverable**: `npm run dev` on both server and client, server logs "MongoDB connected", client shows a blank React page.

**Prompt to give the AI**
> Set up a Node.js + Express backend in `server/` and a React (Vite) frontend in `client/`. Backend needs mongoose, bcryptjs, jsonwebtoken, dotenv, cors. Connect to MongoDB using a `MONGO_URI` from `.env`. Create folders: models, controllers, routes, middleware, config. Frontend needs axios and react-router-dom, with folders: pages, components, services, context. Confirm the server starts and logs a successful DB connection.

---

## Phase 1 — Authentication

**Depends on**: Phase 0

**Endpoints**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

**Tasks**
- `User` model: name, email (unique), password (hashed), role.
- Register controller: hash password with bcrypt, save user, return 201.
- Login controller: compare password, sign JWT (include user id + role in payload), return token + user.
- `middleware/auth.js`: verify JWT from `Authorization: Bearer <token>`, attach `req.user`, else 401.
- `/me` route: protected, returns `req.user`'s profile without the password field.
- Test all three in Postman.

**Deliverable**: can register, login, and fetch profile with the token, in Postman.

**Prompt to give the AI**
> Build the auth system: a User model (name, email unique, password hashed with bcrypt, role: student/instructor). POST /api/auth/register to create a user. POST /api/auth/login to verify credentials and return a signed JWT (payload: user id and role) plus the user object (no password). An auth middleware that reads `Authorization: Bearer <token>`, verifies it, and attaches the decoded user to `req.user`, returning 401 if missing/invalid. GET /api/auth/me, protected, returning the logged-in user's own profile. Use proper status codes (201, 200, 400, 401) and validate input.

---

## Phase 2 — Courses (CRUD + pagination)

**Depends on**: Phase 1 (needs auth middleware + req.user)

**Endpoints**
- `POST /api/courses` (protected, instructor)
- `GET /api/courses` (public, paginated)
- `GET /api/courses/:id` (public)
- `PUT /api/courses/:id` (protected, owner only)
- `DELETE /api/courses/:id` (protected, owner only)

**Tasks**
- `Course` model: title, description, instructor (ref User), price, category, timestamps.
- Create: set `instructor` from `req.user.id`, never from body.
- List: support `?page=&limit=&search=&category=`, return `{ data, page, limit, totalPages, totalCourses }`.
- Get one: 404 if not found.
- Update/Delete: check `course.instructor.toString() === req.user.id`, else 403.
- Test all five in Postman (as the owner and as a different user, to confirm 403 works).

**Deliverable**: full course CRUD tested in Postman, ownership enforced.

**Prompt to give the AI**
> Build Course CRUD on top of the existing auth system. Course model: title, description, instructor (ref User), price, category, timestamps. POST /api/courses (protected) creates a course owned by req.user.id. GET /api/courses (public) lists courses with pagination (`page`, `limit`) and optional `search`/`category` filters, returning `{ data, page, limit, totalPages, totalCourses }`. GET /api/courses/:id (public) returns one course or 404. PUT and DELETE /api/courses/:id are protected and must check the requester is the course's instructor, returning 403 otherwise.

---

## Phase 3 — Lessons (CRUD + pagination)

**Depends on**: Phase 2 (nested under courses)

**Endpoints**
- `POST /api/courses/:courseId/lessons` (protected, owning instructor)
- `GET /api/courses/:courseId/lessons` (paginated)
- `GET /api/lessons/:id`
- `PUT /api/lessons/:id` (protected, owning instructor)
- `DELETE /api/lessons/:id` (protected, owning instructor)

**Tasks**
- `Lesson` model: course (ref Course), title, content/videoUrl, order, duration.
- Create: verify the course exists and `req.user.id` owns it before creating.
- List: paginate, order by `order` field ascending.
- Get one / Update / Delete: same ownership check pattern as courses.
- Decide and implement your content-gating rule (e.g. title always visible, `content` only returned if the requester is enrolled or is the owner).
- Test all five in Postman.

**Deliverable**: full lesson CRUD tested, nested correctly under courses, ownership enforced.

**Prompt to give the AI**
> Build Lesson CRUD, nested under courses, using the existing Course/auth setup. Lesson model: course (ref Course), title, content, videoUrl, order, duration. POST /api/courses/:courseId/lessons (protected) — verify the course exists and belongs to req.user before creating. GET /api/courses/:courseId/lessons — paginated, ordered by `order`. GET /api/lessons/:id, PUT /api/lessons/:id, DELETE /api/lessons/:id — protected for PUT/DELETE with the same ownership check as courses. For GET, only return full `content` if the requester owns the course or is enrolled in it; otherwise return the lesson without content.

---

## Phase 4 — Enrollment & Progress

**Depends on**: Phase 2 and 3

**Endpoints**
- `POST /api/enrollments/:courseId`
- `GET /api/enrollments/my-courses`
- `PATCH /api/enrollments/:courseId/lessons/:lessonId/complete`
- `GET /api/enrollments/:courseId/progress`

**Tasks**
- `Enrollment` model: user (ref User), course (ref Course), completedLessons (array of Lesson ids), enrolledAt.
- Enrol: 400 if an enrollment for this user+course already exists.
- My courses: filter strictly by `req.user.id`; never accept a userId from query params.
- Mark complete: 400 if not enrolled; add lesson id to `completedLessons` if not already present (avoid duplicates).
- Progress: `completedLessons.length / totalLessonsInCourse * 100`, rounded, handle the zero-lessons case.
- Test the full flow in Postman: enrol → mark a couple of lessons complete → check progress updates correctly.

**Deliverable**: a student can enrol, mark lessons complete, and see accurate progress; verified in Postman.

**Prompt to give the AI**
> Build enrollment and progress tracking. Enrollment model: user (ref User), course (ref Course), completedLessons (array of Lesson refs), enrolledAt. POST /api/enrollments/:courseId (protected) creates an enrollment for req.user, 400 if already enrolled. GET /api/enrollments/my-courses (protected) returns the logged-in user's enrollments with basic course info and current progress. PATCH /api/enrollments/:courseId/lessons/:lessonId/complete (protected) adds the lesson to completedLessons if not already there, 400 if not enrolled. GET /api/enrollments/:courseId/progress (protected) returns `{ totalLessons, completedLessons, progressPercent }` calculated from the course's actual lesson count.

---

## Phase 5 — Frontend

**Depends on**: Phases 1–4 fully tested via Postman

**Tasks**
- `services/api.js`: Axios instance with base URL and an interceptor that attaches the stored token.
- `context/AuthContext.jsx` (or Redux slice): login/register/logout, current user, token persistence.
- Pages: Register, Login, CourseList (paginated), CourseDetail (+ enrol button), LessonView, MyEnrollments (with progress bars), CreateCourse/EditCourse (instructor), CreateLesson/EditLesson (instructor).
- Route guards: redirect to login if no token on protected pages.
- Wire every page to its corresponding API from Phases 1–4.

**Deliverable**: a working UI covering the full user journey — register/login, browse courses, enrol, view lessons, mark complete, see progress.

**Prompt to give the AI**
> Build the React frontend for the course platform, consuming the existing API (auth, courses, lessons, enrollments — already built and tested). Use an Axios instance with a token interceptor, an AuthContext for login state, and React Router. Pages: Register, Login, Course list (paginated, searchable), Course detail with an Enrol button, Lesson view, My Enrollments with progress bars, and instructor pages to create/edit courses and lessons. Protect routes that require login and redirect to /login if there's no token.

---

## Phase 6 — Deployment

**Depends on**: Phases 0–5 working locally

**Tasks**
- MongoDB Atlas: create a free cluster, whitelist IP / allow-all for now, get connection string.
- Render: deploy `server/`, set env vars (`MONGO_URI`, `JWT_SECRET`), confirm live API URL.
- Vercel/Netlify: deploy `client/`, point its API base URL to the live Render URL.
- Update CORS on the backend to allow only the deployed frontend origin.
- Smoke-test the full flow on the live URLs.

**Deliverable**: publicly accessible, working app.

**Prompt to give the AI**
> Prepare the app for deployment: confirm the backend reads MONGO_URI, JWT_SECRET and PORT from environment variables only, restrict CORS to the deployed frontend origin, and set the frontend's API base URL from an environment variable so it can point to the Render-deployed backend. Walk me through deploying server/ to Render and client/ to Vercel.

---

## How to use this document

1. Copy one phase's prompt into your AI coding tool.
2. Let it build, then test every endpoint/page from that phase before moving on.
3. Copy the next phase's prompt, referencing that the previous phase already exists.
4. Do not skip ahead — each phase assumes the previous one is in place and working.
