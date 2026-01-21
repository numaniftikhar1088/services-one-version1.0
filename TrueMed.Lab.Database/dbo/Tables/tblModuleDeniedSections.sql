CREATE TABLE [dbo].[tblModuleDeniedSections] (
    [ModuleId]   INT            NOT NULL,
    [SectionId]  INT            NOT NULL,
    [CreateDate] DATETIME2 (7)  NOT NULL,
    [CreateBy]   NVARCHAR (MAX) NOT NULL,
    CONSTRAINT [PK_tblModuleDeniedSections] PRIMARY KEY CLUSTERED ([ModuleId] ASC, [SectionId] ASC),
    CONSTRAINT [FK_tblModuleDeniedSections_tblSections] FOREIGN KEY ([SectionId]) REFERENCES [dbo].[tblSections] ([ID])
);

