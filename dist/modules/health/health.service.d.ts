import { DataSource } from 'typeorm';
export declare class HealthService {
    private dataSource;
    constructor(dataSource: DataSource);
    check(): Promise<{
        status: string;
        database: string;
        timestamp: string;
    }>;
}
