CREATE TABLE [dbo].[tblFiles] (
    [Id]          NVARCHAR (300) CONSTRAINT [DF__tblFiles__Id__0B91BA14] DEFAULT (newid()) NOT NULL,
    [Name]        NVARCHAR (MAX) NULL,
    [FileType]    NVARCHAR (MAX) NULL,
    [FilePath]    NVARCHAR (350) NULL,
    [ParentID]    INT            NULL,
    [ChildID]     INT            NULL,
    [ContentType] NVARCHAR (200) NULL,
    [Length]      NVARCHAR (250) NULL,
    [LabID]       INT            NOT NULL,
    [FacilityId]  INT            NOT NULL,
    [CreatedBy]   NVARCHAR (MAX) NULL,
    [CreateDate]  DATETIME2 (7)  CONSTRAINT [DF__tblFiles__Create__0C85DE4D] DEFAULT (getdate()) NULL,
    [DeletedBy]   NVARCHAR (MAX) NULL,
    [DeletedDate] DATETIME2 (7)  NULL,
    [IsDeleted]   BIT            CONSTRAINT [DF__tblFiles__IsDele__2739D489] DEFAULT ((0)) NULL,
    CONSTRAINT [PK__tblFiles__3214EC079E9B09AF] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_tblFiles_tblFacility] FOREIGN KEY ([FacilityId]) REFERENCES [dbo].[tblFacility] ([FacilityId])
);

