# Security Spec for Clemtrix Play (Firestore)

## 1. Data Invariants
- A user can only read/update their own profile.
- Lessons are read-only for public/authenticated users.
- Progress records can only be created/updated by the user they belong to.
- Progress for lesson N can only be marked as completed if lesson N-1 is already completed (relational sync).
- Quiz attempts are linked to a specific user and lesson.

## 2. The Dirty Dozen Payloads
1. **Identity Theft**: Creating a User profile with another user's UID.
2. **Ghost Record**: Creating a Progress record for another user.
3. **Admin Escalation**: Setting `isAdmin` or a higher `skillLevel` bypassing onboarding.
4. **Content Tampering**: Attempting to update a Lesson's title or content as a regular user.
5. **Score Injection**: Submitting a QuizAttempt with a score of 100/5 (invalid score).
6. **Orphaned Writes**: Creating Progress without a valid Lesson reference.
7. **Bypass Sequence**: Marking Lesson 8 as completed when Lesson 1 is not.
8. **Malicious ID**: Using a 1KB string as a Document ID for a user.
9. **Spam Writes**: Flooding the `quizAttempts` collection with thousands of records.
10. **Data Scraping**: Authenticated user trying to list ALL users' progress.
11. **Shadow Update**: Adding `isVerified: true` to a profile during a name update.
12. **PII Leak**: Non-admin user trying to read user private info (emails).

## 3. Test Runner (Draft Logic)
The `firestore.rules` will be tested via ESLint and manual logic check against these invariants.
