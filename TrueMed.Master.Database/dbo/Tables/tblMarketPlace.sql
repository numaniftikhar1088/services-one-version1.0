CREATE TABLE [dbo].[tblMarketPlace] (
    [ID]                NVARCHAR (300) NOT NULL,
    [MarketPlaceModule] NVARCHAR (MAX) NULL,
    [PortalModuleName]  NVARCHAR (MAX) NULL,
    [IntegrationName]   NVARCHAR (MAX) NULL,
    [IntegrationKey]    NVARCHAR (MAX) NULL,
    [DynamicFormKey]    NVARCHAR (MAX) NULL,
    [IntegrationImage]  NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblMarketPlace] PRIMARY KEY CLUSTERED ([ID] ASC)
);

