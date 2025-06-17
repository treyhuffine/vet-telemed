/**
 * Checks if user can interact with the thread (owner check)
 */
export const getCanInteractWithThread = async ({
  createdByUserId,
  userId,
}: {
  createdByUserId: string | null;
  userId?: string | null;
}) => {
  return !!createdByUserId && !!userId && createdByUserId === userId;
};
