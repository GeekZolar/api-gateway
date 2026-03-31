declare const _default: () => {
    database: {
        type: any;
        host: string | undefined;
        port: number | undefined;
        username: string | undefined;
        password: string | undefined;
        database: string | undefined;
        schema: string;
        ssl: boolean | undefined;
        synchronize: boolean | undefined;
        logging: boolean | undefined;
        poolMin: number | undefined;
        poolMax: number | undefined;
    };
};
export default _default;
