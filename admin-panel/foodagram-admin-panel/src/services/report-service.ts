import axios from 'axios';
import { GlobalConstants } from '../utils/GlobalConstants';
import {ReportResponseDto} from "../models/content/dto/ReportResponseDto.ts";
import {AuthService} from "./auth-service.ts";

export class ReportService {
    static baseUrl: string = GlobalConstants.baseUrl + 'reports';

    static getAuthHeaders() {
        return {Authorization: AuthService.getUserData().token ?? ''};
    }

    // Get a report by its ID
    static getReportById(reportId: string): Promise<ReportResponseDto> {
        return axios.get(
            `${this.baseUrl}/${reportId}`,
            {
                headers: this.getAuthHeaders()
            }
        )
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching the report by id:', error);
                throw error;
            });
    }

    // Get all unresolved reports
    static getAllUnresolvedReports(): Promise<ReportResponseDto[]> {
        return axios.get(
            `${this.baseUrl}/unresolved`,
            {
                headers: this.getAuthHeaders()
            }
        )
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching unresolved reports:', error);
                throw error;
            });
    }

    // Add a method to resolve a report by its ID
    static resolveReport(reportId: string): Promise<ReportResponseDto> {
        return axios.patch(
            `${this.baseUrl}/${reportId}/resolve`,
            {
                headers: this.getAuthHeaders()
            }
        )
            .then(response => response.data)
            .catch(error => {
                console.error('Error while resolving the report:', error);
                throw error;
            });
    }
}
