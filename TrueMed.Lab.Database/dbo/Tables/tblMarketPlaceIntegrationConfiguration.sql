CREATE TABLE [dbo].[tblMarketPlaceIntegrationConfiguration] (
    [ID]            NVARCHAR (300) NOT NULL,
    [FacilityID]    INT            NULL,
    [RequisitionID] INT            NULL,
    [MarketplaceID] NVARCHAR (300) NULL,
    CONSTRAINT [PK_tblIntegrationConfiguration] PRIMARY KEY CLUSTERED ([ID] ASC)
);

