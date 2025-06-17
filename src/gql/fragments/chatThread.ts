import { gql } from '@/types/generated/client';

export const CHAT_THREAD = gql(/* GraphQL */ `
  fragment chatThread on ChatThreads {
    id
    title
    messages(orderBy: { createdAt: ASC }) {
      id
      user {
        id
        name
      }
      content
      role
      files {
        id
        filePath
        fileName
        mimeType
      }
    }
    breadEntry {
      archivedAt
      cons
      consConfidence
      createdAt
      analysis
      expertGuidance
      expertGuidanceConfidence
      id
      notes
      overallConfidence
      overallScore
      pros
      prosConfidence
      updatedAt
      summary
      trendAnalysis
      hasValidImage
      validImageConfidence
      recipeId
      recipe {
        id
        name
        url
        ingredients
        instructions
        remarks
        notes(
          orderBy: { createdAt: DESC }
          where: { archivedAt: { _isNull: true }, deletedAt: { _isNull: true } }
        ) {
          id
          content
          createdAt
        }
      }
      images(orderBy: { createdAt: DESC }) {
        id
        imagePath
        imageName
        originalImageName
      }
    }
  }
`);
