import { ReportResponseDto } from '../../models/content/dto/ReportResponseDto';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Eye } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

interface ReportsTableProps {
    reports: ReportResponseDto[];
    onReportSelect: (report: ReportResponseDto) => void;
    isLoading: boolean;
}

export const ReportsTable = ({ reports, onReportSelect, isLoading }: ReportsTableProps) => {
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Reporter</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Additional Notes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {reports.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No unresolved reports found
                            </TableCell>
                        </TableRow>
                    ) : (
                        reports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.reporterUsername}</TableCell>
                                <TableCell>{report.reportType}</TableCell>
                                <TableCell>{report.reason}</TableCell>
                                <TableCell>
                                    {report.additionalNotes || 'No additional notes'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onReportSelect(report)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}; 