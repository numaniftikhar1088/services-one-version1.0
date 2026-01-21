CREATE TABLE [dbo].[tblRequisitions] (
    [Id]              NVARCHAR (300) DEFAULT (newid()) NOT NULL,
    [FacilityId]      INT            NOT NULL,
    [IsDeleted]       BIT            DEFAULT ((0)) NOT NULL,
    [DeleteDate]      DATETIME2 (7)  NULL,
    [DeletedByUserId] NVARCHAR (300) NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

