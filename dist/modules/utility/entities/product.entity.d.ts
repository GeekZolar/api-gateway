export declare class Product {
    productId: number;
    supplierId: number | null;
    productName: string;
    description: string | null;
    categoryId: number | null;
    productSize: string | null;
    sku: string | null;
    minOrderPallet: number | null;
    casePerPallet: number | null;
    shelfLifeMonth: number | null;
    isActive: boolean;
    isSeasonal: boolean;
    seasonStartDate: Date | null;
    seasonEndDate: Date | null;
    countryCode: string | null;
    createdAt: Date;
    modifiedAt: Date | null;
    note: string | null;
}
