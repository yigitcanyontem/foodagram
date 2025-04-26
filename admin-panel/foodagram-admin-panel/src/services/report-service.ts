import axios from 'axios';
import { GlobalConstants } from '../utils/GlobalConstants';
import {ReportCreationDto} from "../models/content/dto/ReportCreationDto.ts";
import {ReportResponseDto} from "../models/content/dto/ReportResponseDto.ts";

export class ReportService {
    static baseUrl: string = GlobalConstants.baseUrl + '/reports';

    // Create a report
    static createReport(jwtToken: string, reportCreationDto: ReportCreationDto): Promise<ReportResponseDto> {
        return axios.post(
            `${this.baseUrl}`,
            reportCreationDto,
            {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            }
        )
            .then(response => response.data)
            .catch(error => {
                console.error('Error while creating the report:', error);
                throw error;
            });
    }

    // Get a report by its ID
    static getReportById(jwtToken: string, reportId: string): Promise<ReportResponseDto> {
        return axios.get(
            `${this.baseUrl}/${reportId}`,
            {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            }
        )
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching the report by id:', error);
                throw error;
            });
    }

    // Get all unresolved reports
    static getAllUnresolvedReports(jwtToken: string): Promise<ReportResponseDto[]> {
        return axios.get(
            `${this.baseUrl}/unresolved`,
            {
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                },
            }
        )
            .then(response => response.data)
            .catch(error => {
                console.error('Error while fetching unresolved reports:', error);
                throw error;
            });
    }
}
