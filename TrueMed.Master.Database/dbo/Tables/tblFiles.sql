CREATE TABLE [dbo].[tblFiles] (
    [Id]          NVARCHAR (300) CONSTRAINT [DF__tblFiles__Id__0B91BA14] DEFAULT (newid()) NOT NULL,
    [Name]        NVARCHAR (MAX) NOT NULL,
    [ContentType] NVARCHAR (200) NOT NULL,
    [CreateDate]  DATETIME2 (7)  CONSTRAINT [DF__tblFiles__Create__0C85DE4D] DEFAULT (getdate()) NOT NULL,
    [FilePath]    NVARCHAR (350) NOT NULL,
    [Length]      NVARCHAR (200) NULL,
    [IsDeleted]   BIT            CONSTRAINT [DF__tblFiles__IsDele__2739D489] DEFAULT ((0)) NOT NULL,
    [UserId]      NVARCHAR (300) NULL,
    CONSTRAINT [PK__tblFiles__3214EC079E9B09AF] PRIMARY KEY CLUSTERED ([Id] ASC)
);

