import axios from 'axios';
import {GlobalConstants} from "@/utils/GlobalConstants";
import {ReportCreationDto} from "@/models/content/dto/ReportCreationDto";
import {ReportResponseDto} from "@/models/content/dto/ReportResponseDto";

export class ReportService {
    static baseUrl: string = GlobalConstants.baseUrl + '/reports';

    static getAuthHeaders(userData: any) {
        return {Authorization: userData?.token ?? ''};
    }

    // Create a report
    static createReport(reportCreationDto: ReportCreationDto, userData: any): Promise<ReportResponseDto> {
        return axios.post(
            `${this.baseUrl}`,
            reportCreationDto,
            {headers: this.getAuthHeaders(userData)}
        )
            .then(response => response.data)
            .catch(error => {
                console.error('Error while creating the report:', error);
                throw error;
            });
    }

    // Get a report by its ID
    static getReportById(userData: any, reportId: string): Promise<ReportResponseDto> {
        return axios.get(
            `${this.baseUrl}/${reportId}`,
            {headers: this.getAuthHeaders(userData)}
        )
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching the report by id:', error);
                throw error;
            });
    }

    // Get all unresolved reports
    static getAllUnresolvedReports(userData: any): Promise<ReportResponseDto[]> {
        return axios.get(
            `${this.baseUrl}/unresolved`,
            {headers: this.getAuthHeaders(userData)}
        )
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching unresolved reports:', error);
                throw error;
            });
    }
}
