CREATE TABLE [dbo].[tblRequisitionFile] (
    [Id]              INT            IDENTITY (1, 1) NOT NULL,
    [FileName]        NVARCHAR (MAX) NULL,
    [FileUrl]         NVARCHAR (MAX) NULL,
    [FormId]          INT            NULL,
    [RequisitionId]   INT            NULL,
    [TypeOfFile]      NVARCHAR (MAX) NULL,
    [RequisitionType] NVARCHAR (MAX) NULL,
    [SystemGenerated] NVARCHAR (MAX) NULL,
    [CreatedBy]       NVARCHAR (MAX) NULL,
    [CreatedDate]     DATETIME       NULL,
    [UpdatedBy]       NVARCHAR (MAX) NULL,
    [UpdatedDate]     DATETIME       NULL,
    [DeletedBy]       NVARCHAR (MAX) NULL,
    [DeletedDate]     DATETIME       NULL,
    [IsDeleted]       BIT            NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

