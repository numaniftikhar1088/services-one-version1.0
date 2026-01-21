CREATE TABLE [dbo].[tblCompendiumTests] (
    [ID]          INT            IDENTITY (1, 1) NOT NULL,
    [TestName]    NVARCHAR (MAX) NOT NULL,
    [TMITCode]    NVARCHAR (MAX) NULL,
    [NetworkType] INT            NULL,
    [ReqTypeID]   INT            NULL,
    [isActive]    BIT            NOT NULL,
    [IsDeleted]   BIT            NOT NULL,
    [CreatedBy]   NVARCHAR (MAX) NOT NULL,
    [CreatedDate] DATETIME2 (7)  NOT NULL,
    [UpdatedBy]   NVARCHAR (MAX) NULL,
    [UpdatedDate] DATETIME2 (7)  NULL,
    [DeletedBy]   NVARCHAR (MAX) NULL,
    [DeletedDate] DATETIME2 (7)  NULL,
    CONSTRAINT [PK_tblCompendiumTests] PRIMARY KEY CLUSTERED ([ID] ASC)
);

