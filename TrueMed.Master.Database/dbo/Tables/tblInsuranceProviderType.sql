CREATE TABLE [dbo].[tblInsuranceProviderType] (
    [ID]                  INT            IDENTITY (1, 1) NOT NULL,
    [InsuranceProviderId] INT            NULL,
    [InsuraceTypeId]      INT            NULL,
    [IsActive]            BIT            NULL,
    [IsDeleted]           BIT            NULL,
    [CreatedBy]           NVARCHAR (MAX) NULL,
    [CreatedDate]         DATETIME       NULL,
    [UpdatedBy]           NVARCHAR (MAX) NULL,
    [UpdatedDate]         DATETIME       NULL,
    PRIMARY KEY CLUSTERED ([ID] ASC)
);

