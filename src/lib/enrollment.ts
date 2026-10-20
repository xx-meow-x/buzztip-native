// Where course group chats come from.
//
// Nothing is hardcoded. Until you connect the school's records this returns no courses,
// so students only see course chats once enrollment sync (a Cloud Function using the
// student's account number) adds them to the course groups. Course groups are groups with
// isCourse: true; firestore.rules stop the app from joining or leaving them on its own.
export function getEnrolledCourses(/* studentNumber */): string[] {
  return []
}
