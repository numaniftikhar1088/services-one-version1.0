CREATE TABLE [dbo].[tblIntegrationKeyConfigurations] (
    [ID]            INT            IDENTITY (1, 1) NOT NULL,
    [Name]          NVARCHAR (MAX) NULL,
    [Type]          NVARCHAR (MAX) NULL,
    [TypeKey]       NVARCHAR (MAX) NULL,
    [Tag]           NVARCHAR (MAX) NULL,
    [TypeKeyValues] NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblIntegrationKeyConfigurations] PRIMARY KEY CLUSTERED ([ID] ASC)
);

