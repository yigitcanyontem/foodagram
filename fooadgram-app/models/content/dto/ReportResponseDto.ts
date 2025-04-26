export interface ReportResponseDto {
    id: string;
    reporterId: string;
    reporterUsername: string;
    reportType: 'POST' | 'COMMENT' | 'USER';
    reportedEntityId: string;
    reason: string;
    additionalNotes?: string;
    resolved: boolean;
}
