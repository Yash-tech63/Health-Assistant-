# Frontend API integration

Set `VITE_API_BASE_URL=http://localhost:5000/api` and `VITE_SOCKET_URL=http://localhost:5000`. Send `Authorization: Bearer <access token>` for protected endpoints. API responses use `{ success, message, data }`; errors use `{ success, message, errors }`.

On a single 401 response, POST `{ refreshToken }` to `/auth/refresh-token`, replace both returned tokens, and retry the original request once. Do not refresh a refresh-token request.

Available endpoint groups: `auth`, `patients`, `facilities`, `doctors`, `appointments`, `queue`, `medical-records`, `prescriptions`, `lab-reports`, `symptoms`, `referrals`, `notifications`, `follow-ups`, and `teleconsultation`. Their exact methods and parameters are exposed in Swagger at `/api-docs`.

Queue clients should join `queue:<doctorId>:<facilityId>` and listen for `queueUpdated`, `patientCalled`, and `consultationCompleted`. Teleconsultation signaling uses `joinRoom`, `offer`, `answer`, `iceCandidate`, and `leaveRoom`; clients must only join a room returned by the authenticated teleconsultation API.
