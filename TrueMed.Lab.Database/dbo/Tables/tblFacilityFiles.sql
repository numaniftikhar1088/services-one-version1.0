CREATE TABLE [dbo].[tblFacilityFiles] (
    [FileId]     NVARCHAR (300) NOT NULL,
    [FacilityId] INT            NOT NULL,
    [FileType]   NVARCHAR (200) CONSTRAINT [DF__tblFacili__FileT__02084FDA] DEFAULT ('Normal') NOT NULL,
    [Report]     NVARCHAR (MAX) NULL,
    CONSTRAINT [PK_tblFacilityFiles] PRIMARY KEY CLUSTERED ([FileId] ASC),
    CONSTRAINT [FK_tblFacilityFiles_tblFacility] FOREIGN KEY ([FacilityId]) REFERENCES [dbo].[tblFacility] ([FacilityId])
);

