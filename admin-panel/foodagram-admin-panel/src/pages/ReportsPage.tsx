import { useEffect, useState } from 'react';
import { ReportService } from '../services/report-service';
import { ReportResponseDto } from '../models/content/dto/ReportResponseDto';
import { ReportsTable } from '../components/reports/ReportsTable';
import { ReportDetailsDialog } from '../components/reports/ReportDetailsDialog';
import { Button } from '../components/ui/button';
import { RefreshCw } from 'lucide-react';

export const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState<'unresolved' | 'resolved'>('unresolved');
    const [reports, setReports] = useState<ReportResponseDto[]>([]);
    const [selectedReport, setSelectedReport] = useState<ReportResponseDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchReports = async () => {
        try {
            setIsLoading(true);
            const fetchedReports =
                activeTab === 'unresolved'
                    ? await ReportService.getAllUnresolvedReports()
                    : await ReportService.getAllResolvedReports();
            setReports(fetchedReports);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, [activeTab]);

    const handleReportSelect = (report: ReportResponseDto) => {
        setSelectedReport(report);
    };

    const handleReportResolve = async (reportId: string, resolutionNotes: string) => {
        try {
            await ReportService.resolveReport(reportId, resolutionNotes);
            await fetchReports();
            setSelectedReport(null);
        } catch (error) {
            console.error('Error resolving report:', error);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Reports</h1>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchReports}
                    disabled={isLoading}
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
            </div>

            <div className="mb-4">
                <div className="flex space-x-4">
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'unresolved' ? 'border-b-2 border-blue-500' : ''
                        }`}
                        onClick={() => setActiveTab('unresolved')}
                    >
                        Unresolved
                    </button>
                    <button
                        className={`px-4 py-2 font-medium ${
                            activeTab === 'resolved' ? 'border-b-2 border-blue-500' : ''
                        }`}
                        onClick={() => setActiveTab('resolved')}
                    >
                        Resolved
                    </button>
                </div>
            </div>

            <ReportsTable
                reports={reports}
                onReportSelect={handleReportSelect}
                isLoading={isLoading}
            />

            {selectedReport && (
                <ReportDetailsDialog
                    report={selectedReport}
                    onClose={() => setSelectedReport(null)}
                    onResolve={handleReportResolve}
                />
            )}
        </div>
    );
};
