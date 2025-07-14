import { NextApiResponse } from 'next';
import {
  response200Success,
  response400BadRequestError,
  response403ForbiddenError,
  response500ServerError,
} from '@/lib/server/serverless/http';
import {
  NextApiRequestWithAuthRequired,
  withAuthRequired,
} from '@/lib/server/serverless/middleware/withAuthRequired';
import { HttpMethods, withHttpMethods } from '@/lib/server/serverless/middleware/withHttpMethods';
import { mockCases, mockPets, mockOwners } from '@/constants/mocks';

interface ExportOptions {
  format: 'json' | 'csv';
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  triageLevel?: string;
  includeNotes?: boolean;
  includeVitals?: boolean;
}

const GET = async (req: NextApiRequestWithAuthRequired, res: NextApiResponse) => {
  try {
    // Check permissions - admins can export all, vets can export their cases
    if (req.user.role !== 'admin' && req.user.role !== 'vet') {
      return response403ForbiddenError(res, 'Insufficient permissions for data export');
    }

    const {
      format = 'json',
      dateFrom,
      dateTo,
      status,
      triageLevel,
      includeNotes = 'true',
      includeVitals = 'true',
    } = req.query as Record<string, string>;

    // Filter cases based on parameters
    let filteredCases = [...mockCases];

    // Filter by user if not admin
    if (req.user.role === 'vet') {
      filteredCases = filteredCases.filter(c => c.assignedVetId === req.user.id);
    }

    // Apply date filters
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filteredCases = filteredCases.filter(c => new Date(c.createdAt) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      filteredCases = filteredCases.filter(c => new Date(c.createdAt) <= toDate);
    }

    // Apply status filter
    if (status && status !== 'all') {
      filteredCases = filteredCases.filter(c => c.status === status);
    }

    // Apply triage level filter
    if (triageLevel && triageLevel !== 'all') {
      filteredCases = filteredCases.filter(c => c.triageLevel === triageLevel);
    }

    // Enrich case data
    const enrichedCases = filteredCases.map(caseItem => {
      const pet = mockPets.find(p => p.id === caseItem.patientId);
      const owner = pet ? mockOwners.find(o => o.id === pet.ownerId) : null;

      const enrichedCase: any = {
        caseId: caseItem.id,
        status: caseItem.status,
        triageLevel: caseItem.triageLevel,
        presentingComplaint: caseItem.presentingComplaint,
        createdAt: caseItem.createdAt,
        completedAt: caseItem.completedAt,
        waitTime: caseItem.waitTime,
        consultationDuration: caseItem.consultationDuration,
        
        // Pet information
        petName: pet?.name || 'Unknown',
        petSpecies: pet?.species || 'Unknown',
        petBreed: pet?.breed || 'Unknown',
        petAge: pet?.age || 0,
        petWeight: pet?.weight || 0,
        
        // Owner information
        ownerName: owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown',
        ownerPhone: owner?.phone || '',
        ownerEmail: owner?.email || '',
      };

      // Conditionally include vitals
      if (includeVitals === 'true' && caseItem.vitals) {
        enrichedCase.vitals = caseItem.vitals;
      }

      // Conditionally include notes
      if (includeNotes === 'true' && caseItem.notes) {
        enrichedCase.notes = caseItem.notes;
      }

      return enrichedCase;
    });

    // Format response based on requested format
    if (format === 'csv') {
      const csv = convertToCSV(enrichedCases);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=cases-export-${Date.now()}.csv`);
      return res.status(200).send(csv);
    }

    // Default to JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=cases-export-${Date.now()}.json`);
    return res.status(200).json({
      exportDate: new Date().toISOString(),
      totalCases: enrichedCases.length,
      filters: {
        dateFrom,
        dateTo,
        status,
        triageLevel,
      },
      cases: enrichedCases,
    });
  } catch (error) {
    console.error('Export error:', error);
    return response500ServerError(
      res,
      error instanceof Error ? error.message : 'Failed to export cases'
    );
  }
};

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  // Get headers from first object
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');

  // Convert each object to CSV row
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Handle nested objects
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value || '');
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  return [csvHeaders, ...csvRows].join('\n');
}

export default withHttpMethods({
  [HttpMethods.Get]: withAuthRequired(GET),
});