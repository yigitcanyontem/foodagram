export interface ReportCreationDto {
    reportType: 'POST' | 'COMMENT' | 'USER';
    reportedEntityId: string;
    reporterUsername: string;
    reason: string;
    additionalNotes?: string;
}
