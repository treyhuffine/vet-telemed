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
import { mockCases } from '@/constants/mocks';

interface AnalyticsExportOptions {
  format: 'json' | 'csv';
  reportType: 'summary' | 'detailed' | 'performance';
  dateFrom: string;
  dateTo: string;
}

const GET = async (req: NextApiRequestWithAuthRequired, res: NextApiResponse) => {
  try {
    // Only admins can export analytics
    if (req.user.role !== 'admin') {
      return response403ForbiddenError(res, 'Only administrators can export analytics');
    }

    const {
      format = 'json',
      reportType = 'summary',
      dateFrom,
      dateTo,
    } = req.query as Record<string, string>;

    if (!dateFrom || !dateTo) {
      return response400BadRequestError(res, 'Date range is required');
    }

    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);

    // Filter cases within date range
    const casesInRange = mockCases.filter(c => {
      const caseDate = new Date(c.createdAt);
      return caseDate >= fromDate && caseDate <= toDate;
    });

    let reportData: any;

    switch (reportType) {
      case 'summary':
        reportData = generateSummaryReport(casesInRange, fromDate, toDate);
        break;
      case 'detailed':
        reportData = generateDetailedReport(casesInRange, fromDate, toDate);
        break;
      case 'performance':
        reportData = generatePerformanceReport(casesInRange, fromDate, toDate);
        break;
      default:
        return response400BadRequestError(res, 'Invalid report type');
    }

    // Format response
    if (format === 'csv') {
      const csv = convertAnalyticsToCSV(reportData, reportType);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=analytics-${reportType}-${Date.now()}.csv`);
      return res.status(200).send(csv);
    }

    // Default to JSON
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=analytics-${reportType}-${Date.now()}.json`);
    return res.status(200).json(reportData);
  } catch (error) {
    console.error('Export error:', error);
    return response500ServerError(
      res,
      error instanceof Error ? error.message : 'Failed to export analytics'
    );
  }
};

function generateSummaryReport(cases: any[], fromDate: Date, toDate: Date) {
  const totalCases = cases.length;
  const completedCases = cases.filter(c => c.status === 'completed').length;
  const avgWaitTime = cases.reduce((sum, c) => sum + c.waitTime, 0) / totalCases || 0;
  const avgConsultTime = cases.filter(c => c.consultationDuration).reduce((sum, c) => sum + c.consultationDuration, 0) / completedCases || 0;

  const triageBreakdown = {
    red: cases.filter(c => c.triageLevel === 'red').length,
    yellow: cases.filter(c => c.triageLevel === 'yellow').length,
    green: cases.filter(c => c.triageLevel === 'green').length,
  };

  return {
    reportType: 'summary',
    dateRange: {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    },
    metrics: {
      totalCases,
      completedCases,
      completionRate: ((completedCases / totalCases) * 100).toFixed(2) + '%',
      avgWaitTimeMinutes: Math.round(avgWaitTime),
      avgConsultationMinutes: Math.round(avgConsultTime),
      triageBreakdown,
    },
    generatedAt: new Date().toISOString(),
  };
}

function generateDetailedReport(cases: any[], fromDate: Date, toDate: Date) {
  // Group cases by day
  const casesByDay: Record<string, any[]> = {};
  
  cases.forEach(caseItem => {
    const date = new Date(caseItem.createdAt).toISOString().split('T')[0];
    if (!casesByDay[date]) {
      casesByDay[date] = [];
    }
    casesByDay[date].push(caseItem);
  });

  const dailyMetrics = Object.entries(casesByDay).map(([date, dayCases]) => {
    const completed = dayCases.filter(c => c.status === 'completed').length;
    const avgWait = dayCases.reduce((sum, c) => sum + c.waitTime, 0) / dayCases.length || 0;
    
    return {
      date,
      totalCases: dayCases.length,
      completedCases: completed,
      avgWaitTime: Math.round(avgWait),
      triageBreakdown: {
        red: dayCases.filter(c => c.triageLevel === 'red').length,
        yellow: dayCases.filter(c => c.triageLevel === 'yellow').length,
        green: dayCases.filter(c => c.triageLevel === 'green').length,
      },
    };
  });

  return {
    reportType: 'detailed',
    dateRange: {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    },
    dailyMetrics: dailyMetrics.sort((a, b) => a.date.localeCompare(b.date)),
    generatedAt: new Date().toISOString(),
  };
}

function generatePerformanceReport(cases: any[], fromDate: Date, toDate: Date) {
  // Calculate performance KPIs
  const redCases = cases.filter(c => c.triageLevel === 'red');
  const redCasesUnder5Min = redCases.filter(c => c.waitTime <= 5).length;
  const redResponseRate = redCases.length > 0 ? (redCasesUnder5Min / redCases.length) * 100 : 100;

  const consultationTimes = cases
    .filter(c => c.consultationDuration)
    .map(c => c.consultationDuration);
  
  const avgConsultTime = consultationTimes.length > 0
    ? consultationTimes.reduce((sum, time) => sum + time, 0) / consultationTimes.length
    : 0;

  // Wait time distribution
  const waitTimeRanges = {
    '0-5min': cases.filter(c => c.waitTime <= 5).length,
    '6-10min': cases.filter(c => c.waitTime > 5 && c.waitTime <= 10).length,
    '11-20min': cases.filter(c => c.waitTime > 10 && c.waitTime <= 20).length,
    '20+min': cases.filter(c => c.waitTime > 20).length,
  };

  return {
    reportType: 'performance',
    dateRange: {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    },
    kpis: {
      redCaseResponseRate: redResponseRate.toFixed(2) + '%',
      avgConsultationMinutes: Math.round(avgConsultTime),
      casesPerDay: (cases.length / Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24))).toFixed(1),
      waitTimeDistribution: waitTimeRanges,
    },
    targets: {
      redCaseTarget: '100% under 5 minutes',
      avgWaitTarget: 'Under 10 minutes',
      consultationTarget: '15-30 minutes',
    },
    generatedAt: new Date().toISOString(),
  };
}

function convertAnalyticsToCSV(data: any, reportType: string): string {
  let csvContent = '';
  
  switch (reportType) {
    case 'summary':
      csvContent = 'Metric,Value\n';
      csvContent += `Total Cases,${data.metrics.totalCases}\n`;
      csvContent += `Completed Cases,${data.metrics.completedCases}\n`;
      csvContent += `Completion Rate,${data.metrics.completionRate}\n`;
      csvContent += `Average Wait Time (min),${data.metrics.avgWaitTimeMinutes}\n`;
      csvContent += `Average Consultation Time (min),${data.metrics.avgConsultationMinutes}\n`;
      csvContent += `Red Triage Cases,${data.metrics.triageBreakdown.red}\n`;
      csvContent += `Yellow Triage Cases,${data.metrics.triageBreakdown.yellow}\n`;
      csvContent += `Green Triage Cases,${data.metrics.triageBreakdown.green}\n`;
      break;
      
    case 'detailed':
      csvContent = 'Date,Total Cases,Completed Cases,Avg Wait Time,Red Cases,Yellow Cases,Green Cases\n';
      data.dailyMetrics.forEach((day: any) => {
        csvContent += `${day.date},${day.totalCases},${day.completedCases},${day.avgWaitTime},`;
        csvContent += `${day.triageBreakdown.red},${day.triageBreakdown.yellow},${day.triageBreakdown.green}\n`;
      });
      break;
      
    case 'performance':
      csvContent = 'KPI,Value,Target\n';
      csvContent += `Red Case Response Rate,${data.kpis.redCaseResponseRate},100% under 5 minutes\n`;
      csvContent += `Average Consultation Time,${data.kpis.avgConsultationMinutes} min,15-30 minutes\n`;
      csvContent += `Cases Per Day,${data.kpis.casesPerDay},-\n`;
      csvContent += '\nWait Time Distribution\n';
      csvContent += 'Range,Count\n';
      Object.entries(data.kpis.waitTimeDistribution).forEach(([range, count]) => {
        csvContent += `${range},${count}\n`;
      });
      break;
  }
  
  csvContent += `\nGenerated at,${data.generatedAt}\n`;
  return csvContent;
}

export default withHttpMethods({
  [HttpMethods.Get]: withAuthRequired(GET),
});