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
import { mockPets, mockOwners } from '@/constants/mocks';

interface ExportOptions {
  format: 'json' | 'csv';
  species?: string;
  includeOwnerInfo?: boolean;
  includeMedicalHistory?: boolean;
}

const GET = async (req: NextApiRequestWithAuthRequired, res: NextApiResponse) => {
  try {
    // Only admins can export patient data
    if (req.user.role !== 'admin') {
      return response403ForbiddenError(res, 'Only administrators can export patient data');
    }

    const {
      format = 'json',
      species,
      includeOwnerInfo = 'true',
      includeMedicalHistory = 'true',
    } = req.query as Record<string, string>;

    // Filter patients
    let filteredPets = [...mockPets];

    if (species && species !== 'all') {
      filteredPets = filteredPets.filter(p => p.species.toLowerCase() === species.toLowerCase());
    }

    // Enrich patient data
    const enrichedPatients = filteredPets.map(pet => {
      const owner = mockOwners.find(o => o.id === pet.ownerId);

      const enrichedPatient: any = {
        petId: pet.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        weight: pet.weight,
        sex: pet.sex,
        microchipId: pet.microchipId,
        isNeutered: pet.isNeutered,
        createdAt: pet.createdAt,
      };

      // Include owner information
      if (includeOwnerInfo === 'true' && owner) {
        enrichedPatient.ownerName = `${owner.firstName} ${owner.lastName}`;
        enrichedPatient.ownerPhone = owner.phone;
        enrichedPatient.ownerEmail = owner.email;
        enrichedPatient.ownerAddress = `${owner.address}, ${owner.city}, ${owner.state} ${owner.zipCode}`;
      }

      // Include medical history
      if (includeMedicalHistory === 'true') {
        enrichedPatient.medicalHistory = pet.medicalHistory || 'None recorded';
        enrichedPatient.allergies = pet.allergies?.join(', ') || 'None';
        enrichedPatient.currentMedications = pet.currentMedications?.join(', ') || 'None';
        enrichedPatient.lastVisit = pet.lastVisit || 'Never';
      }

      return enrichedPatient;
    });

    // Format response
    if (format === 'csv') {
      const csv = convertToCSV(enrichedPatients);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=patients-export-${Date.now()}.csv`);
      return res.status(200).send(csv);
    }

    // Default to JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=patients-export-${Date.now()}.json`);
    return res.status(200).json({
      exportDate: new Date().toISOString(),
      totalPatients: enrichedPatients.length,
      filters: {
        species,
      },
      patients: enrichedPatients,
    });
  } catch (error) {
    console.error('Export error:', error);
    return response500ServerError(
      res,
      error instanceof Error ? error.message : 'Failed to export patients'
    );
  }
};

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');

  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
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