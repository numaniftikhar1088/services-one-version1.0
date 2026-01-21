CREATE TABLE [dbo].[tblTests] (
    [TestID]          INT            IDENTITY (1, 1) NOT NULL,
    [TestName]        NVARCHAR (MAX) NOT NULL,
    [TestDisplayName] NVARCHAR (MAX) NULL,
    [TMITCode]        NVARCHAR (50)  NULL,
    [IsActive]        BIT            CONSTRAINT [DF__tblTests__TestS__5F7E2DAC] DEFAULT ((1)) NOT NULL,
    [NetworkType]     NVARCHAR (MAX) NULL,
    [CreatedBy]       NVARCHAR (200) NOT NULL,
    [CreatedDate]     DATETIME2 (7)  NOT NULL,
    [UpdatedBy]       NVARCHAR (200) NULL,
    [UpdatedDate]     DATETIME2 (7)  NULL,
    [DeletedBy]       NVARCHAR (200) NULL,
    [DeletedDate]     DATETIME2 (7)  NULL,
    [IsDeleted]       BIT            CONSTRAINT [DF_tblTests_IsDeleted] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_tblTests] PRIMARY KEY CLUSTERED ([TestID] ASC)
);

